import {
  MOCK_SUMMARY,
  MOCK_KPIS,
  MOCK_FACILITIES,
  MOCK_VEHICLES,
  MOCK_SHIPMENTS,
  MOCK_INCIDENTS,
  MOCK_ALERTS,
  MOCK_SIMULATIONS,
  MOCK_RECOVERY_PLANS,
  MOCK_DOCUMENTS,
  MOCK_NETWORK_GRAPH,
} from './mockApi.js';

const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

// In-memory state for offline/demo mutations
let localShipments: any[] = [...MOCK_SHIPMENTS];
let localSimulations: any[] = [...MOCK_SIMULATIONS];
let localRecoveryPlans: any[] = [...MOCK_RECOVERY_PLANS];
let localAlerts: any[] = [...MOCK_ALERTS];
let localDocuments: any[] = [...MOCK_DOCUMENTS];

export function handleMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const cleanUrl = endpoint.split('?')[0];

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
          origin: { name: payload.originName || 'Chicago Central Logistics Park', lat: 41.8781, lng: -87.6298 },
          destination: { name: payload.destinationName || 'New York Atlantic Gateway', lat: 40.7128, lng: -74.0060 },
          carrierName: payload.carrierName || 'Apex Freight Dynamics',
          carrierId: 'CAR-APEX',
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
    return { shipments: localShipments, total: localShipments.length } as unknown as T;
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
  if (cleanUrl === '/incidents') {
    return { incidents: MOCK_INCIDENTS } as unknown as T;
  }
  if (cleanUrl === '/alerts') {
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
      if (plan) plan.approvalStatus = 'approved';
      return { success: true, message: 'Recovery plan approved and dispatched to network!' } as unknown as T;
    }
    return { recoveryPlans: localRecoveryPlans } as unknown as T;
  }
  if (cleanUrl === '/documents' || cleanUrl.startsWith('/documents')) {
    return { documents: localDocuments } as unknown as T;
  }
  if (cleanUrl === '/network') {
    return MOCK_NETWORK_GRAPH as unknown as T;
  }
  if (cleanUrl === '/ai/chat') {
    return {
      reply: 'Autonomous Logistics Telemetry: All primary freight corridors (I-80, I-70, I-10, I-90, I-75) are actively monitored. I-80 weather disruption near Toledo is impacting 8 consignments (+4.5h delay). Plan Alpha southern detour via I-70 is evaluated with 91% feasibility confidence. Cold-chain sensors report normal temperatures.',
      steps: [
        { agent: 'Agent A (Document OCR)', task: 'Matched active BOL records with road alerts', status: 'completed' },
        { agent: 'Agent B (Risk Engine)', task: 'Calculated SLA exposure: $28,000 at risk', status: 'completed' },
        { agent: 'Agent C (Disruption Lab)', task: 'Generated southern detour bypass via I-70', status: 'completed' },
      ],
    } as unknown as T;
  }
  if (cleanUrl === '/auth/login') {
    return {
      token: 'demo_token_' + Date.now(),
      user: {
        id: 'user-demo-1',
        name: 'Marcus Vance',
        email: 'manager@flowtwin.ai',
        role: 'Logistics Manager',
        department: 'Enterprise Logistics',
        accountStatus: 'active',
      },
    } as unknown as T;
  }
  if (cleanUrl === '/auth/me') {
    return {
      user: {
        id: 'user-demo-1',
        name: 'Marcus Vance',
        email: 'manager@flowtwin.ai',
        role: 'Logistics Manager',
        department: 'Enterprise Logistics',
        accountStatus: 'active',
      },
    } as unknown as T;
  }
  if (cleanUrl === '/admin/reset-data') {
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

  // Check if we are running in a static hosting environment without configured external backend
  const isVercelStaticWithoutBackend =
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app') &&
    (!rawApiUrl || rawApiUrl === '/api');

  if (!isVercelStaticWithoutBackend) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      
      // If server returned valid JSON
      if (response.ok && contentType.includes('application/json')) {
        return await response.json();
      }

      // If server returned a JSON error (e.g. 400 Bad Request with message)
      if (!response.ok && contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Request failed`);
      }

      // If response is HTML (e.g. 404 rewrite to index.html), fall through to mock
    } catch (err: any) {
      // If it's an explicit application error from server, throw it
      if (
        err.message &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError') &&
        !err.message.includes('Unexpected token') &&
        !err.message.includes('Load failed')
      ) {
        throw err;
      }
      console.warn(`[FlowTwin] Backend request to ${endpoint} failed, activating autonomous fallback store.`);
    }
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
