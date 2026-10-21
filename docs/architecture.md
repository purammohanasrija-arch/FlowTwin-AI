# FlowTwin AI Architecture & Specification

## 1. Executive Summary
**FlowTwin AI** is an enterprise autonomous logistics intelligence platform and interactive supply chain digital twin. It transforms unstructured delivery orders, bills of lading, and telematics into a real-time graph model of the supply chain, enabling operators to simulate disruptions, predict bottlenecks, and approve multi-objective recovery plans.

---

## 2. System Architecture

```mermaid
graph TD
    Client[React + Vite Frontend\nTailwind CSS | Leaflet | ReactFlow]
    API[Node.js + Express REST API\nTypeScript | Socket.IO]
    DB[(MongoDB Database\nShipments | Facilities | Scenarios)]
    
    Orchestrator[Multi-Agent Orchestrator]
    AgentA[Agent A: Document Intelligence]
    AgentB[Agent B: Shipment Risk Analysis]
    AgentC[Agent C: Disruption Simulation]
    AgentD[Agent D: Recovery Planning]
    AgentE[Agent E: Constraint Validation]
    AgentF[Agent F: Executive Reporting]
    SimEngine[Deterministic Simulation Engine]
    LLM[Gemini API / Deterministic Fallback]

    Client <-->|REST & WebSockets| API
    API <--> DB
    API <--> Orchestrator
    Orchestrator --> AgentA
    Orchestrator --> AgentB
    Orchestrator --> AgentC
    Orchestrator --> AgentD
    Orchestrator --> AgentE
    Orchestrator --> AgentF
    AgentC <--> SimEngine
    AgentD <--> SimEngine
    API <--> LLM
```

---

## 3. Multi-Agent AI Framework

| Agent | Responsibility | Key Input | Structured Output |
|---|---|---|---|
| **Agent A: Document Intelligence** | OCR & field extraction from PDFs, CSVs, TXT, images | Raw text/file buffer | Extracted fields, confidence scores (0-1), snippet evidence |
| **Agent B: Shipment Risk Analysis** | SLA deadline checks, milestone latency, cold-chain checks | Shipment telemetry | Risk score (0-100), risk factors, mitigations |
| **Agent C: Disruption Analysis** | Interpret user disruption queries & map to corridors | Corridor, severity, duration | Disruption parameters, affected shipment list |
| **Agent D: Recovery Planning** | Synthesize candidate recovery options (Fast vs Cost vs Balanced) | Disruption metrics | 3 candidate recovery plans with actions |
| **Agent E: Constraint Validation** | Hard regulatory checks (FMCSA HOS, GVWR, dock windows) | Recovery plan | Constraint pass/fail checklist & permission check |
| **Agent F: Reporting Agent** | Compile executive summaries & printable reports | Fleet telemetry | ASCII & structured operational reports |

---

## 4. Deterministic Simulation Engine Formulas

FlowTwin AI rejects fabricated random simulation metrics. Instead, the simulation engine calculates:

1. **Detour Extra Travel Time ($\Delta T$)**:
   $$\Delta T = \min(D \times \alpha \times S, 24)$$
   Where $D$ is disruption duration in hours, $\alpha$ is corridor congestion factor (0.65), and $S$ is severity multiplier (1.0 for low, 1.3 for high, 1.6 for critical).

2. **Added Vehicle Detour Cost ($C_{\text{detour}}$)**:
   $$C_{\text{detour}} = \sum (\text{Detour Km} \times \$2.45) + \sum (\text{Delay Hours} \times \$65.00)$$

3. **SLA Penalty Risk ($P_{\text{SLA}}$)**:
   $$P_{\text{SLA}} = N_{\text{late}} \times \overline{\Delta T} \times \$150.00$$
   Where $N_{\text{late}}$ is count of orders where $T_{\text{projected}} > T_{\text{SLA}}$.

4. **Facility Queuing Impact**:
   Calculated through M/M/1 queuing variance when facility throughput decreases by $C_{\text{drop}}\%$.

---

## 5. Security & Governance Matrix

| Role | Read Dashboard | Edit Shipments | Run Simulations | Authorize Recovery Plans | Manage Users |
|---|:---:|:---:|:---:|:---:|:---:|
| **Administrator** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Logistics Manager** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Operations Analyst** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ |

All consequential actions (plan approval, shipment state change, user modification) produce an immutable `AuditEvent` record stored with actor ID, role, IP address, and payload parameters.
