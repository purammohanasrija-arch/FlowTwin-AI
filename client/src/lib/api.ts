import {
  MOCK_SUMMARY,
  MOCK_KPIS,
  MOCK_FACILITIES,
  MOCK_VEHICLES,
  MOCK_ROUTES,
  MOCK_SHIPMENTS,
  MOCK_INCIDENTS,
  MOCK_ALERTS,
  MOCK_SIMULATIONS,
  MOCK_RECOVERY_PLANS,
  MOCK_DOCUMENTS,
  MOCK_AUDIT_EVENTS,
  MOCK_USERS,
  MOCK_NETWORK_GRAPH,
} from './mockApi.js';

const DEFAULT_PROD_API = 'https://flowtwin-ai-7chg.onrender.com';
const rawApiUrl = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? DEFAULT_PROD_API : '')
).replace(/\/+$/, '');

export const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

// In-memory state for offline/demo mutations
let localShipments: any[] = [...MOCK_SHIPMENTS];
let localSimulations: any[] = [...MOCK_SIMULATIONS];
let localRecoveryPlans: any[] = [...MOCK_RECOVERY_PLANS];
let localAlerts: any[] = [...MOCK_ALERTS];
let localDocuments: any[] = [...MOCK_DOCUMENTS];
let localTelemetrySteps: any[] = [
  {
    agentName: 'Orchestrator',
    status: 'completed',
    inputSummary: 'System initialization & corridor telemetry sync',
    outputSummary: 'Monitored 24 active shipments across North American network',
    durationMs: 180,
    timestamp: 'Just now',
  },
];

export function handleMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const [cleanUrl, queryString] = endpoint.split('?');
  const queryParams = new URLSearchParams(queryString || '');

  if (cleanUrl === '/dashboard/summary') {
    return MOCK_SUMMARY as unknown as T;
  }
  if (cleanUrl === '/analytics/kpis') {
    return MOCK_KPIS as unknown as T;
  }
  if (cleanUrl === '/shipments') {
    if (method === 'POST') {
      try {
        const payload = JSON.parse(options.body as string);
        const newShip = {
          _id: `ship-${Date.now()}`,
          shipmentId: payload.shipmentId || `SH-${Math.floor(1000 + Math.random() * 9000)}`,
          orderId: payload.orderId || `ORD-${Math.floor(50000 + Math.random() * 40000)}`,
          customerReference: payload.customerReference || `PO-${Math.floor(1000 + Math.random() * 9000)}`,
          origin: payload.origin || { name: payload.originName || 'Chicago Central Logistics Park', lat: 41.8781, lng: -87.6298, facilityId: 'FAC-CHI-01' },
          destination: payload.destination || { name: payload.destinationName || 'New York Atlantic Gateway', lat: 40.7128, lng: -74.0060, facilityId: 'FAC-NYC-02' },
          carrierName: payload.carrierName || 'Apex Freight Dynamics',
          carrierId: payload.carrierId || 'CAR-APEX',
          cargoDescription: payload.cargoDescription || 'Standard Freight Consignment',
          weightKg: payload.weightKg || 12000,
          status: 'ready_for_dispatch',
          priority: payload.priority || 'medium',
          delayHours: 0,
          riskScore: 10,
          milestones: [{ id: 'm1', title: 'Order Registered', description: 'Manifest created', timestamp: new Date().toISOString(), type: 'pickup', status: 'completed' }],
        };
        localShipments.unshift(newShip);
        return { success: true, shipment: newShip } as unknown as T;
      } catch {
        return { success: true } as unknown as T;
      }
    }

    // Dynamic filtering for GET /shipments?status=...&carrier=...&search=...
    let filtered = [...localShipments];
    const statusParam = queryParams.get('status');
    const carrierParam = queryParams.get('carrier');
    const searchParam = queryParams.get('search');

    if (statusParam && statusParam !== 'all') {
      filtered = filtered.filter(s => s.status === statusParam);
    }
    if (carrierParam && carrierParam !== 'all') {
      filtered = filtered.filter(s => s.carrierName === carrierParam);
    }
    if (searchParam) {
      const q = searchParam.toLowerCase();
      filtered = filtered.filter(s =>
        (s.shipmentId && s.shipmentId.toLowerCase().includes(q)) ||
        (s.orderId && s.orderId.toLowerCase().includes(q)) ||
        (s.customerReference && s.customerReference.toLowerCase().includes(q)) ||
        (s.origin?.name && s.origin.name.toLowerCase().includes(q)) ||
        (s.destination?.name && s.destination.name.toLowerCase().includes(q)) ||
        (s.cargoDescription && s.cargoDescription.toLowerCase().includes(q))
      );
    }

    return {
      shipments: filtered,
      total: filtered.length,
      pagination: {
        total: filtered.length,
        page: 1,
        totalPages: 1,
      },
    } as unknown as T;
  }
  if (cleanUrl.startsWith('/shipments/')) {
    const id = cleanUrl.replace('/shipments/', '');
    const found = localShipments.find(s => s._id === id || s.shipmentId === id) || localShipments[0];
    return { shipment: found } as unknown as T;
  }
  if (cleanUrl === '/facilities') {
    return { facilities: MOCK_FACILITIES } as unknown as T;
  }
  if (cleanUrl === '/vehicles') {
    return { vehicles: MOCK_VEHICLES } as unknown as T;
  }
  if (cleanUrl === '/routes') {
    return { routes: MOCK_ROUTES } as unknown as T;
  }
  if (cleanUrl === '/incidents') {
    return { incidents: MOCK_INCIDENTS } as unknown as T;
  }
  if (cleanUrl === '/alerts' || cleanUrl.startsWith('/alerts')) {
    if (method === 'PATCH') {
      try {
        const id = cleanUrl.replace('/alerts/', '');
        const payload = JSON.parse(options.body as string);
        const alert = localAlerts.find(a => a._id === id || a.alertCode === id);
        if (alert) {
          if (payload.status) alert.status = payload.status;
          if (payload.note) {
            if (!alert.notes) alert.notes = [];
            alert.notes.push(payload.note);
          }
        }
        return { alert } as unknown as T;
      } catch {
        return { success: true } as unknown as T;
      }
    }
    return { alerts: localAlerts } as unknown as T;
  }
  if (cleanUrl === '/simulations') {
    if (method === 'POST') {
      try {
        const payload = JSON.parse(options.body as string);
        const newSim = {
          _id: `sim-${Date.now()}`,
          name: payload.name || 'Simulated Shock Scenario',
          description: payload.description || '',
          isBaseline: false,
          status: 'completed',
          disruption: payload.disruption || {},
          metrics: {
            totalShipmentsMonitored: localShipments.length,
            directlyAffectedShipments: 8,
            atRiskShipments: 12,
            projectedLateDeliveries: 5,
            averageDelayHours: (payload.disruption?.durationHours || 8) * 0.5,
            maxDelayHours: (payload.disruption?.durationHours || 8) * 1.1,
            addedDistanceKm: 380,
            estimatedExtraCostUSD: 12400,
            slaPenaltyRiskUSD: 28000,
            facilityUtilizationImpactPct: 16,
            recoveryFeasibilityScore: 89,
          },
        };
        localSimulations.unshift(newSim);
        return { success: true, scenario: newSim } as unknown as T;
      } catch {
        return { success: true } as unknown as T;
      }
    }
    return { simulations: localSimulations } as unknown as T;
  }
  if (cleanUrl === '/simulations/compare') {
    return {
      baselineName: 'Baseline Network Operations',
      baselineMetrics: {
        totalShipmentsMonitored: 34,
        directlyAffectedShipments: 0,
        atRiskShipments: 0,
        projectedLateDeliveries: 0,
        averageDelayHours: 0,
        maxDelayHours: 0,
        addedDistanceKm: 0,
        estimatedExtraCostUSD: 0,
        slaPenaltyRiskUSD: 0,
        facilityUtilizationImpactPct: 0,
        recoveryFeasibilityScore: 100,
      },
      scenarios: localSimulations.map(s => ({
        id: s._id,
        name: s.name,
        disruptionType: s.disruption?.type || 'road_closure',
        severity: s.disruption?.severity || 'medium',
        metrics: s.metrics,
      })),
    } as unknown as T;
  }
  if (cleanUrl === '/recovery-plans' || cleanUrl.startsWith('/recovery-plans')) {
    if (cleanUrl.includes('/approve')) {
      const plan = localRecoveryPlans[0];
      if (plan) {
        plan.approvalStatus = 'approved';
        plan.approvedBy = 'Marcus Vance';
        plan.approvedAt = new Date().toISOString();
      }
      return { success: true, plan, message: 'Recovery plan approved and dispatched to network!' } as unknown as T;
    }
    if (cleanUrl.includes('/reject')) {
      const plan = localRecoveryPlans[0];
      if (plan) {
        plan.approvalStatus = 'rejected';
      }
      return { success: true, plan, message: 'Recovery plan rejected.' } as unknown as T;
    }
    // Return both `plans` and `recoveryPlans` for full client compatibility
    return { plans: localRecoveryPlans, recoveryPlans: localRecoveryPlans } as unknown as T;
  }
  if (cleanUrl === '/documents' || cleanUrl.startsWith('/documents')) {
    if (cleanUrl.endsWith('/confirm')) {
      const id = cleanUrl.split('/')[2];
      const doc = localDocuments.find(d => d.documentCode === id || d._id === id);
      if (doc) doc.processingStatus = 'confirmed';
      const promotedShipment = {
        _id: `ship-promoted-${Date.now()}`,
        shipmentId: `SH-${Math.floor(2000 + Math.random() * 8000)}`,
        orderId: 'ORD-9104',
        customerReference: `PO-DOC-${doc?.documentCode || '90414'}`,
        origin: { name: 'Dallas Inland Depot', lat: 32.7767, lng: -96.7970, facilityId: 'FAC-DAL-04' },
        destination: { name: 'Atlanta Distribution Cross-Dock', lat: 33.7490, lng: -84.3880, facilityId: 'FAC-ATL-05' },
        carrierName: 'Nexus Global Haulers',
        carrierId: 'CAR-NEXUS',
        status: 'ready_for_dispatch',
        cargoDescription: 'Promoted Verified Consignment',
        weightKg: 16500,
        priority: 'high',
        delayHours: 0,
        riskScore: 12,
        milestones: [{ id: 'm1', title: 'Promoted to Dispatch', description: 'Extracted from delivery order', timestamp: new Date().toISOString(), type: 'pickup', status: 'completed' }],
      };
      localShipments.unshift(promotedShipment);
      return {
        success: true,
        message: `Document ${doc?.documentCode || id} successfully promoted to live shipment ${promotedShipment.shipmentId}!`,
        shipment: promotedShipment,
      } as unknown as T;
    }
    if (cleanUrl.endsWith('/fields')) {
      const id = cleanUrl.split('/')[2];
      const doc = localDocuments.find(d => d.documentCode === id || d._id === id);
      if (doc && options.body) {
        try {
          const payload = JSON.parse(options.body as string);
          if (payload.fields) doc.extractedFields = payload.fields;
        } catch { /* ignore */ }
      }
      return { document: doc || localDocuments[0] } as unknown as T;
    }
    return { documents: localDocuments } as unknown as T;
  }
  if (cleanUrl === '/network') {
    return MOCK_NETWORK_GRAPH as unknown as T;
  }
  if (cleanUrl === '/admin/audit-events') {
    return { events: MOCK_AUDIT_EVENTS } as unknown as T;
  }
  if (cleanUrl === '/admin/users') {
    return { users: MOCK_USERS } as unknown as T;
  }
  if (cleanUrl === '/ai/chat') {
    let userQuery = '';
    try {
      if (options.body) {
        const parsed = JSON.parse(options.body as string);
        userQuery = (parsed.message || '').trim().toLowerCase();
      }
    } catch {}

    const delayedList = localShipments.filter(s => s.status === 'delayed' || (s.delayHours && s.delayHours > 0));

    let content = '';
    let suggestedShipmentIds: string[] = [];
    let suggestedAction: any = null;
    let agentName = 'Orchestrator';

    // 1. Specific Shipment queries
    const shipmentMatch = userQuery.match(/\b(sh-\d+)\b/i);
    if (shipmentMatch) {
      const queriedId = shipmentMatch[1].toUpperCase();
      const target = localShipments.find(s => s.shipmentId?.toUpperCase() === queriedId);
      agentName = 'ShipmentRiskAnalysis';

      if (!target) {
        content = `### Shipment Telemetry Query Notice\n\nConsignment **${queriedId}** was not located in active North American freight manifests.\n\nPlease verify the consignment identifier. Active tracked shipments with registered telematics include:\n${delayedList.slice(0, 4).map(s => `• **${s.shipmentId}** (${s.origin?.name || 'Hub'} → ${s.destination?.name || 'DC'})`).join('\n')}`;
        suggestedShipmentIds = delayedList.slice(0, 3).map(s => s.shipmentId);
      } else {
        const delayText = target.delayHours > 0 ? `+${target.delayHours}h Delay` : 'On Schedule';
        content = `### Risk Diagnostic: ${target.shipmentId}\n\n• **Route**: ${target.origin?.name || 'Chicago'} → ${target.destination?.name || 'New York'}\n• **Status**: **${target.status.toUpperCase()}** (${delayText})\n• **Risk Score**: **${target.riskScore || 78}/100** (Carrier: ${target.carrierName})\n• **Cargo**: ${target.cargoDescription} (Weight: ${target.weightKg?.toLocaleString() || '12,000'} kg)\n\n**Threat Vectors**:\n• Severe winter blizzard along I-80 corridor\n• Cross-dock connection window under 45 minutes\n\n*Mitigation*: Proposed Recovery Plan Alpha detours TRK-101 via I-70 South, recovering **6.5 hours** with a 91% on-time SLA confidence.`;
        suggestedShipmentIds = [target.shipmentId];
        suggestedAction = {
          actionType: 'inspect_shipment',
          title: `Inspect ${target.shipmentId}`,
          description: `Open comprehensive telematics details and milestone timeline for ${target.shipmentId}.`,
          payload: { shipmentId: target.shipmentId },
        };
      }
    } else if (userQuery.includes('delayed') || userQuery.includes('late')) {
      agentName = 'ShipmentRiskAnalysis';
      const items = delayedList.slice(0, 6).map(s => `• **${s.shipmentId}** (${s.origin?.name || 'Hub'} → ${s.destination?.name || 'DC'}): **+${s.delayHours || 4.2}h delay**, Risk Score: **${s.riskScore || 78}/100** (Status: ${s.status})`).join('\n');
      content = `### Delayed Shipments Status Report\n\nIdentified **${delayedList.length} delayed shipments** requiring active monitoring across North American corridors:\n\n${items}\n\n*Recommended action*: Open the **Disruption Simulation Lab** to run corridor detour scenarios for these consignments.`;
      suggestedShipmentIds = delayedList.slice(0, 5).map(s => s.shipmentId);
      suggestedAction = {
        actionType: 'run_simulation',
        title: 'Run I-80 Detour Simulation',
        description: 'Simulate southern detour routing via I-70 to recover delayed deliveries.',
        payload: { corridor: 'I-80' },
      };
    } else if (userQuery.includes('closure') || userQuery.includes('i-80') || userQuery.includes('blizzard') || userQuery.includes('10-hour')) {
      agentName = 'DisruptionAnalysis';
      content = `### I-80 Corridor Disruption Blast Radius\n\nA 10-hour highway closure along the I-80 Midwest artery produces the following network impacts:\n\n• **Directly Affected Shipments**: 8 active consignments\n• **Average Delay Impact**: +5.4 hours (Max: +11.2h)\n• **Projected SLA Penalties**: $32,000 across 3 priority pharmaceutical/semiconductor contracts\n• **Recommended Contingency**: Reroute westbound loads via I-70 Columbus / Indianapolis corridor.\n\nRecovery Plan Alpha has been pre-computed by the AI Orchestrator and awaits manager approval.`;
      suggestedShipmentIds = ['SH-1042', 'SH-1043', 'SH-1044'];
      suggestedAction = {
        actionType: 'approve_plan',
        title: 'Review Recovery Plan Alpha',
        description: 'Open Recovery Planner to authorize expedited team-driver detour.',
        payload: { planCode: 'REC-2026-ALPHA' },
      };
    } else if (userQuery.includes('warehouse') || userQuery.includes('facility') || userQuery.includes('utilization') || userQuery.includes('chicago')) {
      agentName = 'ReportingAgent';
      content = `### Facility Capacity & Utilization Telemetry\n\n• **Highest Load**: **Chicago Central Logistics Park (FAC-CHI-01)** at **86.4% utilization** (43,200 / 50,000 units, Status: *Congested*)\n• **Pacific Maritime Port (FAC-LAX-03)**: 82.0% utilization (98,400 / 120,000 units)\n• **Peach State Sorting Center (FAC-ATL-05)**: 75.0% utilization (36,000 / 48,000 units)\n• **New York Atlantic Gateway (FAC-NYC-02)**: 68.0% utilization (44,200 / 65,000 units - Optimal)\n\n*Recommendation*: Shift non-critical staging loads from Chicago to Indianapolis Midwest Aerotropolis Hub to mitigate yard congestion.`;
      suggestedShipmentIds = [];
    } else if (userQuery.includes('vehicle') || userQuery.includes('fleet') || userQuery.includes('truck') || userQuery.includes('reassignment') || userQuery.includes('available')) {
      agentName = 'ReportingAgent';
      content = `### Fleet Telematics & Vehicle Availability\n\n• **Active Linehaul Fleet**: 28 commercial vehicles currently deployed across regional corridors.\n• **Available for Reassignment**: 4 standby regional tractors (TRK-204, TRK-208 in Chicago, TRK-311 in Indianapolis).\n• **Flagged Carrier**: TRK-101 (Apex Freight Dynamics on I-80) held due to severe weather restrictions.\n• **HOS Compliance**: 100% compliant with zero active FMCSA violations.`;
      suggestedShipmentIds = ['SH-1042', 'SH-1043'];
    } else if (userQuery.includes('recovery') || userQuery.includes('plan')) {
      agentName = 'RecoveryPlanning';
      content = `### Active Recovery Strategy: Plan Alpha (I-70 Expedited Bypass)\n\n• **Strategy Category**: Fastest Delivery\n• **Target Corridor**: Diverting from I-80 Blizzard to I-70 South through Indianapolis\n• **Recovered On-Time Deliveries**: 6 out of 8 shipments\n• **Time Savings**: Average **8.5 hours delay reduced**\n• **Net Added Cost**: $2,300 (FMCSA team-driver substitution)\n• **Status**: Pending Logistics Manager Approval.`;
      suggestedAction = {
        actionType: 'approve_plan',
        title: 'Approve Plan Alpha',
        description: 'Authorize immediate dispatch of team drivers and reroute commands.',
        payload: { planCode: 'REC-2026-ALPHA' },
      };
    } else if (/^(hu|hi|hello|hey|help|status)\b/i.test(userQuery) || userQuery.length <= 4) {
      agentName = 'Orchestrator';
      content = `### FlowTwin AI Copilot Operational Desk\n\nHello Operator! I am your autonomous logistics digital twin copilot, monitoring real-time North American supply chain corridors.\n\n• **Network Overview**: **${localShipments.length} total consignments** monitored.\n• **Active Disruptions**: **${delayedList.length} delayed shipments** (+5.4h average delay along I-80).\n• **Facility Status**: Peak load at **Chicago Central Logistics Park (FAC-CHI-01)** (86.4% utilization).\n• **Contingency Strategy**: Recovery Plan Alpha (I-70 Bypass) staged for authorization.\n\n**Quick Inquiries You Can Ask Me**:\n- *"Which shipments are currently delayed?"*\n- *"Why is shipment SH-1042 at risk?"*\n- *"What is the impact of a 10-hour road closure on I-80?"*\n- *"Which warehouse has the highest utilization?"*\n- *"Which vehicles are available for reassignment?"*`;
      suggestedShipmentIds = delayedList.slice(0, 3).map(s => s.shipmentId);
    } else {
      agentName = 'Orchestrator';
      content = `### Autonomous Logistics Telemetry Synthesis\n\nAll primary freight corridors (I-80, I-70, I-10, I-90, I-75) are actively monitored by the multi-agent network.\n\n• **Current Status**: 1 active corridor disruption detected on **I-80 Midwest** due to a winter blizzard.\n• **Delay Footprint**: 8 shipments affected, average delay +5.4h.\n• **Mitigation**: I-70 Southern Bypass is ready for dispatch with 91% feasibility.\n\nYou can query specific shipments, corridor closures, or facility capacities for targeted telemetry.`;
      suggestedShipmentIds = delayedList.slice(0, 3).map(s => s.shipmentId);
    }

    const step = {
      agentName,
      status: 'completed',
      inputSummary: userQuery.slice(0, 50) || 'Operational inquiry',
      outputSummary: content.replace(/\n+/g, ' ').slice(0, 100),
      durationMs: 145,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    localTelemetrySteps.unshift(step);
    if (localTelemetrySteps.length > 30) localTelemetrySteps.pop();

    return {
      ok: true,
      content,
      reply: content,
      suggestedShipmentIds,
      suggestedAction,
      isGeminiPowered: false,
      providerStatus: 'fallback',
      telemetryStep: step,
    } as unknown as T;
  }
  if (cleanUrl === '/ai/telemetry') {
    return { telemetry: localTelemetrySteps } as unknown as T;
  }
  if (cleanUrl === '/ai/run-autonomous-recovery') {
    const recoveryStep = {
      agentName: 'RecoveryPlanning',
      status: 'completed',
      inputSummary: 'Autonomous corridor recovery simulation execution',
      outputSummary: 'Pre-computed Plan Alpha: 6 deliveries recovered, 8.5h saved',
      durationMs: 320,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    localTelemetrySteps.unshift(recoveryStep);
    return { success: true, steps: [recoveryStep] } as unknown as T;
  }
  if (cleanUrl === '/auth/login' || cleanUrl === '/auth/me') {
    return {
      token: 'demo_token_' + Date.now(),
      user: {
        id: 'user-demo-1',
        name: 'Marcus Vance',
        email: 'manager@flowtwin.ai',
        role: 'Logistics Manager',
        department: 'Supply Chain Resiliency',
        accountStatus: 'active',
      },
    } as unknown as T;
  }
  if (cleanUrl === '/admin/reset-data' || cleanUrl === '/demo/reset') {
    localShipments = [...MOCK_SHIPMENTS];
    localSimulations = [...MOCK_SIMULATIONS];
    localRecoveryPlans = [...MOCK_RECOVERY_PLANS];
    localAlerts = [...MOCK_ALERTS];
    localDocuments = [...MOCK_DOCUMENTS];
    return { success: true, message: 'Demo telemetry reset successfully!' } as unknown as T;
  }

  return { success: true } as unknown as T;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('flowtwin_token');
  const role = localStorage.getItem('flowtwin_role') || 'Logistics Manager';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-demo-role': role,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData uploads so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Primary: Live Backend Request (Vite proxy forwards /api to localhost:5000)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for AI copilot queries

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const contentType = response.headers.get('content-type') || '';
    
    // If server returned valid JSON
    if (response.ok && contentType.includes('application/json')) {
      return await response.json();
    }

    // If server returned a JSON error (e.g. 400 Bad Request with message)
    if (!response.ok && contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status >= 500 || endpoint.startsWith('/ai/')) {
        console.warn(`[FlowTwin] Live request to ${endpoint} returned ${response.status}, utilizing autonomous fallback store.`);
        return handleMockFallback<T>(endpoint, options);
      }
      throw new Error(errorData.error || `HTTP ${response.status}: Request failed`);
    }

    // If response is HTML (Vite fallback) or 502/503, fallback cleanly to local store
  } catch (err: any) {
    if (endpoint.startsWith('/ai/') || endpoint.startsWith('/simulation/')) {
      console.warn(`[FlowTwin] Request error on ${endpoint}, utilizing autonomous fallback store.`);
      return handleMockFallback<T>(endpoint, options);
    }
    if (
      err.message &&
      !err.message.includes('Failed to fetch') &&
      !err.message.includes('NetworkError') &&
      !err.message.includes('Unexpected token') &&
      !err.message.includes('Load failed') &&
      !err.message.includes('aborted')
    ) {
      throw err;
    }
    console.warn(`[FlowTwin] Live request to ${endpoint} unreachable, using synchronized autonomous fallback store.`);
  }

  // Autonomous fallback store
  return handleMockFallback<T>(endpoint, options);
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
