# FlowTwin AI
### Autonomous Logistics Intelligence & Interactive Supply Chain Digital Twin

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

FlowTwin AI is a next-generation enterprise logistics command center, interactive supply chain digital twin, and disruption simulation laboratory. It converts unstructured shipment documents, delivery manifests, and telematics into a real-time reactive graph model. Operators can introduce hypothetical shocks (interstate closures, breakdowns, warehouse outages), calculate deterministic delay impacts, evaluate multi-objective recovery trade-offs, and authorize mitigation actions with role-gated governance.

---

## 🌟 Key Features

### 1. Live Control Tower Dashboard
- **Real-Time KPIs**: Total Shipments, In-Transit Consignments, On-Time SLA %, Delayed Count, Critical Exceptions, and Available Fleet.
- **Dynamic Bento Grid**: Interactive charts for daily shipment volume, delay distribution, carrier compliance, and hub yard utilization.
- **AI Operational Briefing**: Continuous executive synthesis grounded in live database telemetry.

### 2. Live Logistics Map
- **Dual Map Architecture (Zero API Key Required)**: Runs out of the box with the **Autonomous Keyless Dark Map** powered by high-resolution ESRI ArcGIS World Dark Gray Canvas and OpenStreetMap (zero keys, zero cost, zero watermarks).
- **Optional Google Maps Integration**: If `VITE_GOOGLE_MAPS_API_KEY` is provided, automatically integrates with official Google Maps Platform (`@vis.gl/react-google-maps`) with `<AdvancedMarker>` elements, and allows 1-click toggling between providers.
- **Advanced Dynamic Markers**: Category-specific facility pins (coastal ports, rail terminals, airport hubs, distribution centers, factories) with live utilization status rings, tracked fleet trucks, and active incident hazard alerts.
- **Interstate Freight Corridors**: Native polylines for I-80 Midwest-Northeast, I-70 South Resilience Bypass (dashed detour), I-10 Pacific, I-90 Northern Transcon, and I-75 Southeast.
- **Smart Routing & Distance Abstraction**: Computes distance, duration, and route geometry across hubs both with Google Directions API and via autonomous internal vector geometry.
- **Traffic Congestion Telemetry**: Real-time traffic visualization for major freight corridors.
- **Bidirectional 3D Digital Twin Sync**: Seamlessly synchronized with the Ultra 3D Logistics Universe (`DigitalTwinStore`) for instant entity inspection and cross-view teleports.

### 3. Disruption Simulation Lab (Signature Feature)
- **Deterministic Simulation Engine**: Computes exact mathematical delay consequences, detour costs ($2.45/km + $65/hr demurrage), and SLA contractual penalty risks ($150/hr).
- **Configurable Parameters**: Disruption archetype, corridor, severity, duration slider (1–48h), and facility capacity drop %.
- **Multi-Scenario Comparison**: Side-by-side metric comparison matrix (Baseline vs. Scenario A vs. Scenario B) with visual delta charts.

### 4. AI Multi-Objective Recovery Planner
- **Candidate Strategy Generation**:
  - **Plan Alpha (Fastest Delivery)**: Hot-shot expedited team drivers bypassing bottlenecks.
  - **Plan Beta (Lowest Cost)**: Dynamic cross-dock staging and intermodal rail consolidation.
  - **Plan Gamma (Balanced Resilience)**: Selective priority elevation for temperature-sensitive cargo.
- **Regulatory Constraint Validation**: Automated verification of FMCSA Hours of Service (HOS), 80,000 lbs Gross Vehicle Weight Rating (GVWR), and dock appointment windows.
- **Human-in-the-Loop Governance**: Manager authorization workflow with cryptographic audit logging and celebration feedback.

### 5. Document Intelligence Engine
- **Multi-Format Ingestion**: Drag & drop support for PDF Bills of Lading, CSV manifests, XLSX sheets, invoices, and text files.
- **Structured Field Extraction**: Automated extraction of Shipment IDs, PO references, origin/destination hubs, weight, and carrier names with confidence scores.
- **Verification & Deduplication**: In-place field correction editor, candidate duplicate detection, and 1-click **Promote to Live Shipment** promotion.

### 6. Supply Chain Digital Twin (Network Explorer)
- **Connected Graph Topology**: Interactive React Flow diagram mapping Suppliers → Logistics Hubs → Assigned Vehicles → Active Consignments.
- **Disruption Blast Radius**: 1-click propagation analysis highlighting upstream and downstream dependencies affected by corridor holds.

### 7. AI Logistics Copilot & Multi-Agent Architecture
- **Persistent Conversational Assistant**: Grounded in live database records; cites specific shipment IDs and facility codes.
- **Multi-Agent Telemetry**: Live trace panel for Agent A (Doc), Agent B (Risk), Agent C (Disruption), Agent D (Recovery), Agent E (Validation), and Agent F (Reporting).
- **Out-of-the-Box Demo**: Works 100% autonomously without external API keys via smart deterministic fallback; also supports Google Gemini API when configured.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, `@vis.gl/react-google-maps`, Google Maps JavaScript API, Three.js / R3F, Framer Motion, Lucide React, Recharts, React Flow |
| **Backend** | Node.js (v20+ / v24), Express, TypeScript, Socket.IO, Multer, XLSX, Zod |
| **Database** | SQLite with WebAssembly (`sql.js`) — Zero-configuration file persistence (`./data/flowtwin.sqlite`), auto-seeding demo datasets on first boot |
| **AI / ML** | Configurable Google Gemini API (`gemini-1.5-flash`) + Deterministic Logistics Intelligence Engine |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested and verified)
- **Database**: Zero setup required! SQLite runs natively in pure JS and persists to `./data/flowtwin.sqlite`.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/purammohanasrija-arch/FlowTwin-AI.git
cd FlowTwin-AI

# Install all workspace dependencies
npm run install:all
```

### 2. Environment Configuration

#### Backend Configuration (`server/.env`)
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Default development settings:
```ini
PORT=5000
SQLITE_DB_PATH=./data/flowtwin.sqlite
JWT_SECRET=flowtwin_enterprise_jwt_secret_dev_2026
GEMINI_API_KEY=   # Optional: Leave empty for offline deterministic demo mode
```

#### Frontend Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
Frontend settings:
```ini
# Google Maps Platform (Optional - Live Logistics Map runs out-of-the-box in Keyless Mode)
# Leave empty for zero-cost, zero-configuration autonomous map (ESRI Dark Canvas, 100% free, no key needed)
VITE_GOOGLE_MAPS_API_KEY=

# Optional: Map ID for Vector rendering and AdvancedMarkerElement (Defaults to 'DEMO_MAP_ID')
VITE_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID
```

> **Keyless Mode (Active by Default)**: If `VITE_GOOGLE_MAPS_API_KEY` is omitted or empty, FlowTwin AI automatically runs the **Autonomous Keyless Interactive Map** using ESRI ArcGIS Dark Gray Canvas and OpenStreetMap. No setup, no credit cards, and zero "API KEY REQUIRED" watermarks.
> 
> **Optional Google Maps Integration**: If you wish to use Google Maps Platform, enter your key in `client/.env` or paste it directly in the application using the **Add Key** button on the map page. You can also generate a free [Google Maps Demo Key](https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1) for zero-billing prototyping.

#### Google Cloud Platform Setup (Production Guide)
For production deployments, configure your Google Cloud project as follows:
1. **Enable Required APIs**:
   - Maps JavaScript API
   - Places API / Places API (New)
   - Directions API or Routes API
2. **Create a Map ID**:
   - In the Google Cloud Console, navigate to **Google Maps Platform > Map Management**.
   - Create a Map ID with Map Type set to **JavaScript** (Vector or Raster) with Advanced Markers enabled.
3. **Secure Your API Key**:
   - **Application Restrictions**: Under **Google Maps Platform > Credentials**, restrict the browser key by HTTP referrers (e.g., `http://localhost:*/*`, `https://yourdomain.com/*`).
   - **API Restrictions**: Restrict the key to only the 3 enabled APIs above.

### 3. Run Development Servers
Start both the backend server (`http://localhost:5000`) and the Vite frontend (`http://localhost:3000`) concurrently:
```bash
npm run dev
```
Alternatively, run them in separate terminals:
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

Open your browser to: **`http://localhost:3000`**

---

## 🧪 Testing

Run backend simulation and validation unit tests:
```bash
npm test
```
All unit tests verify:
- Deterministic simulation formulas for road closures and detours
- Shipment risk scoring and cold-chain sensitivity calibration
- Document entity extraction and confidence estimation
- Role-based authorization and constraint validation rules

---

## 👥 Enterprise Roles & Demonstration Credentials

FlowTwin AI enforces backend role authorization. You can test permission boundaries using the 1-click **Role Switcher** in the top navigation header, or log in with the following seeded accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@flowtwin.ai` | `DemoPass123!` | Full system administration, user accounts, security audit log |
| **Logistics Manager** | `manager@flowtwin.ai` | `DemoPass123!` | Consignment dispatch, simulation modeling, **Recovery Plan Signoff** |
| **Operations Analyst** | `analyst@flowtwin.ai` | `DemoPass123!` | Modeling disruptions, running simulations, document extraction |
| **Viewer** | `viewer@flowtwin.ai` | `DemoPass123!` | Read-only access to control tower, maps, and reports |

---

## 📋 Primary Demonstration Walkthrough

1. **Launch the Portal**: Open `http://localhost:3000` and click **Launch Control Tower**.
2. **Review Real-Time KPIs**: Observe 34 monitored consignments, on-time SLA metrics, carrier compliance, and the AI operational briefing.
3. **Inspect the Map**: Click **Live Logistics Map** in the sidebar. Toggle layers (facilities, vehicles, corridors, disruptions). Click the pulsing red **I-80 Corridor** marker to view incident details.
4. **Trigger Disruption Simulation**: Navigate to **Disruption Lab**. Select the *I-80 Midwest Blizzard Closure*, adjust the duration slider to 10 hours, and click **Run Deterministic Simulation**.
5. **Compare Scenarios**: Observe the calculated delta (+8.4h delay, $18,450 extra cost, 4 late orders) and review the scenario comparison bar chart.
6. **Formulate Recovery Plans**: Click **Generate Recovery Plan** or navigate to **Recovery Planner**. Compare Plan Alpha (Fastest), Plan Beta (Lowest Cost), and Plan Gamma (Balanced).
7. **Authorize Mitigation Action**: Ensure your active role is **Logistics Manager** (top right). Click **Approve & Synchronize Simulation**, enter reviewer notes, and confirm. Notice the celebration confetti and updated status!
8. **Test Document Intelligence**: Navigate to **Document Intelligence**. Inspect pre-loaded Bills of Lading, edit any field in place, and click **Promote to Shipment**.
9. **Query AI Copilot**: Click the floating **Ask FlowTwin Copilot** button on bottom right. Ask *"Which shipments are currently delayed?"* or click the **Agent Telemetry** tab to inspect the multi-agent execution pipeline.

---

## 📦 Production Build & Deployment

### Build Command
```bash
# Build both backend and frontend for production
npm run build
```

### Deployment Strategy
- **Frontend**: Compatible with [Vercel](https://vercel.com/) or Cloudflare Pages. Point build command to `npm run build --prefix client` and output directory to `client/dist`.
- **Backend**: Compatible with [Render](https://render.com/), Railway, or AWS Elastic Beanstalk. Start command: `node dist/index.js` inside `server/`.
- **Database**: Connect to [MongoDB Atlas](https://www.mongodb.com/atlas) by updating `MONGODB_URI`.

---

## 📄 License
This project is licensed under the MIT License.
