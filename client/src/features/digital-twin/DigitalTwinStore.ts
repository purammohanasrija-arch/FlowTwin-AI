import { create } from 'zustand';
import {
  QualityPreset,
  WeatherPreset,
  CameraMode,
  ViewLayer,
  SelectedEntity,
  FacilityNode3D,
  RouteCorridor3D,
  VehicleSimulationState,
  CargoItem3D,
  IncidentRecord3D,
  AIAgentNodeState,
  ScenarioComparisonState,
  GraphLayoutMode,
  ExplodedGraphState,
  ExplodedLayerId,
} from './types.js';
import {
  INITIAL_FACILITIES_3D,
  INITIAL_ROUTES_3D,
  INITIAL_VEHICLES_3D,
  INITIAL_CARGO_3D,
  INITIAL_INCIDENTS_3D,
  INITIAL_AI_AGENTS_3D,
} from './initialData.js';

interface DigitalTwinState {
  // Quality & Environment
  quality: QualityPreset;
  weather: WeatherPreset;
  timeOfDay: number; // 0 to 24
  fogDensity: number;
  rainIntensity: number;
  isTourActive: boolean;

  // View Layers
  layers: Record<ViewLayer, boolean>;

  // Camera Management
  cameraMode: CameraMode;
  cameraTarget: [number, number, number];
  cameraLookAt: [number, number, number];
  cameraDistance: number;
  followedVehicleId: string | null;

  // Entities
  facilities: FacilityNode3D[];
  routes: RouteCorridor3D[];
  vehicles: VehicleSimulationState[];
  cargoItems: CargoItem3D[];
  incidents: IncidentRecord3D[];
  aiAgents: AIAgentNodeState[];
  recoveryPlans: any[];

  // Selection & Hover
  selectedEntity: SelectedEntity | null;
  hoveredEntity: { type: string; id: string } | null;

  // Simulation Timeline Clock
  isPlaying: boolean;
  playbackSpeed: number;
  timelineProgress: number; // 0 to 1
  simulationTimeHours: number; // 0 to 24
  isDisruptionActive: boolean;
  activeIncidentCode: string | null;
  approvedRecoveryPlanCode: string | null;

  // Warehouse Cutaway Mode
  warehouseCutaway: {
    active: boolean;
    facilityCode: string | null;
    selectedAisle: number | null;
    selectedShelfId: string | null;
  };

  // Exploded Supply Chain Graph Mode
  explodedGraph: ExplodedGraphState;

  // Scenario Comparison Mode
  scenarioComparison: ScenarioComparisonState;

  // AI Command Copilot
  aiCopilot: {
    commandHistory: string[];
    isProcessing: boolean;
    lastResponse: string | null;
    activeCommunicationPair: [string, string] | null;
  };

  // Route Editing Mode
  routeEditing: {
    active: boolean;
    selectedRouteCode: string | null;
    previewAlternative: boolean;
  };

  // Actions
  setQuality: (quality: QualityPreset) => void;
  setWeather: (weather: WeatherPreset) => void;
  setTimeOfDay: (time: number) => void;
  toggleLayer: (layer: ViewLayer) => void;
  setCameraMode: (mode: CameraMode) => void;
  focusOnPosition: (pos: [number, number, number], lookAt?: [number, number, number]) => void;
  followVehicle: (vehicleCode: string | null) => void;
  selectEntity: (entity: SelectedEntity | null) => void;
  setHoveredEntity: (hover: { type: string; id: string } | null) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  seekTimeline: (progress: number) => void;
  stepSimulation: (deltaMinutes: number) => void;
  triggerDisruption: (incident: Partial<IncidentRecord3D>) => void;
  resolveDisruption: (incidentCode: string) => void;
  applyRecoveryPlan: (planCode: string) => void;
  toggleWarehouseCutaway: (facilityCode?: string) => void;
  selectWarehouseSlot: (aisle: number | null, shelfId: string | null) => void;
  toggleExplodedGraph: (isolateShipmentId?: string) => void;
  setExplodedLayoutMode: (mode: GraphLayoutMode) => void;
  setExplosionSpread: (spread: number) => void;
  setExplodedActiveLayer: (layer: ExplodedLayerId | 'all' | null) => void;
  toggleExplodedAutoRotate: () => void;
  toggleExplodedLinkFlow: () => void;
  setBlastRadiusNode: (nodeId: string | null) => void;
  setScenarioComparison: (state: Partial<ScenarioComparisonState>) => void;
  executeAICommand: (command: string) => Promise<string>;
  twinMode: 'chocolate' | 'logistics';
  setTwinMode: (mode: 'chocolate' | 'logistics') => void;
  focusOnFacility: (facilityCode: string) => void;

  toggleRouteEditing: (routeCode?: string) => void;
  resetScene: () => void;
  syncBackendData: (data: {
    facilities?: any[];
    routes?: any[];
    vehicles?: any[];
    recoveryPlans?: any[];
  }) => void;
}

export const useDigitalTwinStore = create<DigitalTwinState>((set, get) => ({
  // Defaults
  quality: 'cinematic',
  weather: 'midnight_cyber',
  timeOfDay: 21.5, // 9:30 PM Cyber Night
  fogDensity: 0.008,
  rainIntensity: 0.0,
  isTourActive: false,

  layers: {
    terrain: true,
    facilities: true,
    interior_cutaway: false,
    routes: true,
    vehicles: true,
    cargo: true,
    particles: true,
    incidents: true,
    labels: true,
    risk_heatmap: false,
    capacity_towers: true,
    ai_nodes: true,
    weather_effects: true,
    exploded_graph: false,
  },

  cameraMode: 'overview',
  cameraTarget: [0, 48, 56],
  cameraLookAt: [0, 0, 0],
  cameraDistance: 65,
  followedVehicleId: null,

  facilities: INITIAL_FACILITIES_3D,
  routes: INITIAL_ROUTES_3D,
  vehicles: INITIAL_VEHICLES_3D,
  cargoItems: INITIAL_CARGO_3D,
  incidents: INITIAL_INCIDENTS_3D,
  aiAgents: INITIAL_AI_AGENTS_3D,
  recoveryPlans: [],

  selectedEntity: null,
  hoveredEntity: null,

  isPlaying: true,
  playbackSpeed: 1.0,
  timelineProgress: 0.42,
  simulationTimeHours: 10.08,
  isDisruptionActive: true,
  activeIncidentCode: 'INC-BLIZZ-01',
  approvedRecoveryPlanCode: null,

  warehouseCutaway: {
    active: false,
    facilityCode: null,
    selectedAisle: null,
    selectedShelfId: null,
  },

  explodedGraph: {
    active: false,
    isolatedShipmentId: null,
    activeLayer: 'all',
    layoutMode: 'stacked',
    explosionSpread: 1.0,
    autoRotate: false,
    linkFlowActive: true,
    highlightedBlastRadiusNodeId: null,
  },

  scenarioComparison: {
    active: false,
    mode: 'overlay',
    baselineTitle: 'Baseline (Disrupted I-80 Blizzard)',
    alternativeTitle: 'Optimized Recovery Plan (I-70 Bypass Corridor)',
    baselineMetrics: {
      avgDelayHours: 14.2,
      lateDeliveries: 19,
      extraCostUSD: 48200,
      slaCompliancePct: 62.4,
    },
    recoveryMetrics: {
      avgDelayHours: 2.8,
      lateDeliveries: 2,
      extraCostUSD: 11400,
      slaCompliancePct: 94.1,
    },
  },

  aiCopilot: {
    commandHistory: [],
    isProcessing: false,
    lastResponse: 'FlowTwin AI Core operational. Ready for spatial queries and dispatch.',
    activeCommunicationPair: null,
  },

  routeEditing: {
    active: false,
    selectedRouteCode: null,
    previewAlternative: false,
  },

  twinMode: 'chocolate',
  setTwinMode: mode => set({ twinMode: mode }),

  focusOnFacility: facilityCode => {
    const fac = get().facilities.find(f => f.facilityCode === facilityCode);
    if (fac) {
      set({
        selectedEntity: { type: 'facility', id: fac.facilityCode, data: fac },
        cameraTarget: [fac.position3D[0] - 8, fac.position3D[1] + 16, fac.position3D[2] + 24],
        cameraLookAt: fac.position3D,
        cameraMode: 'overview',
      });
    }
  },

  // Actions
  setQuality: quality => set({ quality }),
  setWeather: weather => {
    let rain = 0.0;
    let fog = 0.008;
    let time = 21.5;

    if (weather === 'clear_day') {
      time = 13.0;
      fog = 0.003;
      rain = 0;
    } else if (weather === 'golden_hour') {
      time = 18.2;
      fog = 0.005;
      rain = 0;
    } else if (weather === 'heavy_rain') {
      time = 15.0;
      fog = 0.018;
      rain = 0.85;
    } else if (weather === 'storm_blizzard') {
      time = 19.5;
      fog = 0.028;
      rain = 0.95;
    } else if (weather === 'dense_fog') {
      time = 6.0;
      fog = 0.038;
      rain = 0.1;
    } else if (weather === 'extreme_heat') {
      time = 12.0;
      fog = 0.006;
      rain = 0;
    }

    set({ weather, timeOfDay: time, fogDensity: fog, rainIntensity: rain });
  },

  setTimeOfDay: timeOfDay => set({ timeOfDay }),

  toggleLayer: layer =>
    set(state => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),

  setCameraMode: mode => {
    const state = get();
    if (mode === 'overview') {
      set({
        cameraMode: 'overview',
        cameraTarget: [0, 52, 60],
        cameraLookAt: [0, 0, 0],
        followedVehicleId: null,
        isTourActive: false,
      });
    } else if (mode === 'incident_focus') {
      const inc = state.incidents[0];
      if (inc) {
        set({
          cameraMode: 'incident_focus',
          cameraTarget: [inc.location.position3D[0] - 12, 14, inc.location.position3D[2] + 18],
          cameraLookAt: inc.location.position3D,
          selectedEntity: { type: 'incident', id: inc.incidentCode, data: inc },
          followedVehicleId: null,
          isTourActive: false,
        });
      }
    } else if (mode === 'warehouse_inspect') {
      const fac =
        state.facilities.find(
          f => f.facilityCode === (state.selectedEntity?.type === 'facility' ? state.selectedEntity.id : 'FAC-CHI-01')
        ) || state.facilities[0];
      set({
        cameraMode: 'warehouse_inspect',
        cameraTarget: [fac.position3D[0] - 12, fac.position3D[1] + 16, fac.position3D[2] + 20],
        cameraLookAt: fac.position3D,
        selectedEntity: { type: 'facility', id: fac.facilityCode, data: fac },
        followedVehicleId: null,
        isTourActive: false,
        warehouseCutaway: {
          active: true,
          facilityCode: fac.facilityCode,
          selectedAisle: null,
          selectedShelfId: null,
        },
      });
    } else if (mode === 'executive_flyover') {
      set({ cameraMode: 'executive_flyover', isTourActive: true });
    } else {
      set({ cameraMode: mode, isTourActive: false });
    }
  },

  focusOnPosition: (pos, lookAt = [0, 0, 0]) => {
    set({
      cameraTarget: [pos[0], pos[1] + 20, pos[2] + 25],
      cameraLookAt: lookAt,
    });
  },

  followVehicle: vehicleCode => {
    if (!vehicleCode) {
      set({ followedVehicleId: null, cameraMode: 'overview' });
      return;
    }
    const veh = get().vehicles.find(v => v.vehicleCode === vehicleCode);
    if (veh) {
      set({
        followedVehicleId: vehicleCode,
        cameraMode: 'follow_vehicle',
        selectedEntity: { type: 'vehicle', id: vehicleCode, data: veh },
      });
    }
  },

  selectEntity: entity => {
    if (!entity) {
      set({ selectedEntity: null });
      return;
    }
    set({ selectedEntity: entity });

    // Auto-frame appropriate camera mode
    if (entity.type === 'vehicle') {
      const veh = entity.data;
      set({
        cameraTarget: [veh.position3D[0] - 8, veh.position3D[1] + 10, veh.position3D[2] + 14],
        cameraLookAt: veh.position3D,
      });
    } else if (entity.type === 'facility') {
      const fac = entity.data;
      set({
        cameraTarget: [fac.position3D[0] - 18, fac.position3D[1] + 22, fac.position3D[2] + 26],
        cameraLookAt: fac.position3D,
      });
    } else if (entity.type === 'incident') {
      const inc = entity.data;
      set({
        cameraTarget: [inc.location.position3D[0] - 12, 14, inc.location.position3D[2] + 18],
        cameraLookAt: inc.location.position3D,
        cameraMode: 'incident_focus',
      });
    }
  },

  setHoveredEntity: hoveredEntity => set({ hoveredEntity }),

  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: playbackSpeed => set({ playbackSpeed }),

  seekTimeline: progress => {
    const clamped = Math.max(0, Math.min(1, progress));
    const hours = clamped * 24;
    set({
      timelineProgress: clamped,
      simulationTimeHours: hours,
    });
  },

  stepSimulation: deltaMinutes => {
    const currentProg = get().timelineProgress;
    const addedProg = (deltaMinutes / (24 * 60)) * get().playbackSpeed;
    const nextProg = (currentProg + addedProg) % 1.0;
    set({
      timelineProgress: nextProg,
      simulationTimeHours: nextProg * 24,
    });
  },

  triggerDisruption: incidentParams => {
    const newCode = incidentParams.incidentCode || `INC-SIM-${Date.now().toString().slice(-4)}`;
    const newIncident: IncidentRecord3D = {
      incidentCode: newCode,
      title: incidentParams.title || 'Dynamic Supply Chain Disruption',
      type: incidentParams.type || 'road_closure',
      severity: incidentParams.severity || 'critical',
      location: incidentParams.location || {
        name: 'I-80 Mile Marker 410',
        latitude: 41.25,
        longitude: -95.93,
        position3D: [4, 0.5, -2],
        description: 'Blizzard whiteout and highway closure',
      },
      expectedDurationHours: incidentParams.expectedDurationHours || 14,
      delayImpactHours: incidentParams.delayImpactHours || 16.5,
      affectedCorridor: incidentParams.affectedCorridor || 'I-80',
    };

    set(state => {
      // Mark affected corridor closed
      const updatedRoutes = state.routes.map(r =>
        r.roadCorridor === newIncident.affectedCorridor ? { ...r, isClosed: true } : r
      );

      // Slow or stall vehicles on that corridor
      const updatedVehicles = state.vehicles.map(v =>
        v.assignedRouteCode.includes('I-80')
          ? {
              ...v,
              status: 'delayed' as const,
              currentSpeedKmh: 12,
              isDelayedByDisruption: true,
            }
          : v
      );

      return {
        incidents: [newIncident, ...state.incidents],
        isDisruptionActive: true,
        activeIncidentCode: newCode,
        routes: updatedRoutes,
        vehicles: updatedVehicles,
        selectedEntity: { type: 'incident', id: newCode, data: newIncident },
        cameraMode: 'incident_focus',
      };
    });
  },

  resolveDisruption: incidentCode => {
    set(state => ({
      incidents: state.incidents.filter(i => i.incidentCode !== incidentCode),
      isDisruptionActive: state.incidents.length > 1,
      routes: state.routes.map(r => ({ ...r, isClosed: false })),
      vehicles: state.vehicles.map(v => ({
        ...v,
        status: 'in_transit' as const,
        isDelayedByDisruption: false,
      })),
    }));
  },

  applyRecoveryPlan: planCode => {
    set(state => {
      // Activate I-70 bypass corridor
      const updatedRoutes = state.routes.map(r =>
        r.roadCorridor === 'I-70'
          ? { ...r, routeType: 'alternative' as const, isBypassAlternative: true }
          : r
      );

      // Re-route delayed vehicles onto the bypass corridor
      const updatedVehicles = state.vehicles.map(v =>
        v.isDelayedByDisruption
          ? {
              ...v,
              status: 'in_transit' as const,
              assignedRouteCode: 'ROUTE-I70-BYPASS',
              isTakingAlternativeRoute: true,
              isDelayedByDisruption: false,
              currentSpeedKmh: 82,
            }
          : v
      );

      return {
        routes: updatedRoutes,
        vehicles: updatedVehicles,
        approvedRecoveryPlanCode: planCode,
        scenarioComparison: {
          ...state.scenarioComparison,
          active: true,
        },
      };
    });
  },

  toggleWarehouseCutaway: facilityCode => {
    set(state => {
      const targetCode =
        facilityCode ||
        (state.selectedEntity?.type === 'facility' ? state.selectedEntity.id : null) ||
        state.warehouseCutaway.facilityCode ||
        'FAC-CHI-01';

      const isSwitching =
        Boolean(facilityCode) &&
        state.warehouseCutaway.active &&
        state.warehouseCutaway.facilityCode !== facilityCode;

      const nextActive = isSwitching ? true : !state.warehouseCutaway.active;
      const fac = state.facilities.find(f => f.facilityCode === targetCode);

      return {
        warehouseCutaway: {
          active: nextActive,
          facilityCode: nextActive ? targetCode : null,
          selectedAisle: null,
          selectedShelfId: null,
        },
        cameraMode: nextActive ? 'warehouse_inspect' : 'overview',
        cameraTarget:
          nextActive && fac
            ? [fac.position3D[0] - 12, fac.position3D[1] + 16, fac.position3D[2] + 20]
            : [0, 48, 56],
        cameraLookAt: nextActive && fac ? fac.position3D : [0, 0, 0],
        selectedEntity: nextActive && fac ? { type: 'facility', id: fac.facilityCode, data: fac } : null,
      };
    });
  },

  selectWarehouseSlot: (aisle, shelfId) => {
    set(state => ({
      warehouseCutaway: {
        ...state.warehouseCutaway,
        selectedAisle: aisle,
        selectedShelfId: shelfId,
      },
    }));
  },

  toggleExplodedGraph: isolateShipmentId => {
    set(state => {
      const nextActive = !state.explodedGraph.active;
      return {
        explodedGraph: {
          ...state.explodedGraph,
          active: nextActive,
          isolatedShipmentId: nextActive ? isolateShipmentId || 'SH-1042' : null,
          activeLayer: 'all',
          explosionSpread: nextActive ? (state.explodedGraph.explosionSpread || 1.0) : 0.0,
          highlightedBlastRadiusNodeId: null,
        },
        cameraMode: 'overview',
        cameraTarget: nextActive ? [0, 48, 70] : [0, 48, 56],
        cameraLookAt: nextActive ? [0, 24, 0] : [0, 0, 0],
      };
    });
  },

  setExplodedLayoutMode: mode =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, layoutMode: mode },
    })),

  setExplosionSpread: spread =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, explosionSpread: Math.max(0, Math.min(2.0, spread)) },
    })),

  setExplodedActiveLayer: layer =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, activeLayer: layer },
    })),

  toggleExplodedAutoRotate: () =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, autoRotate: !state.explodedGraph.autoRotate },
    })),

  toggleExplodedLinkFlow: () =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, linkFlowActive: !state.explodedGraph.linkFlowActive },
    })),

  setBlastRadiusNode: nodeId =>
    set(state => ({
      explodedGraph: { ...state.explodedGraph, highlightedBlastRadiusNodeId: nodeId },
    })),

  setScenarioComparison: comp =>
    set(state => ({
      scenarioComparison: { ...state.scenarioComparison, ...comp },
    })),

  executeAICommand: async (commandText: string) => {
    const text = commandText.trim().toLowerCase();
    const state = get();

    set(s => ({
      aiCopilot: {
        ...s.aiCopilot,
        isProcessing: true,
        commandHistory: [commandText, ...s.aiCopilot.commandHistory],
        activeCommunicationPair: ['Orchestrator', 'RoutePlanning'],
      },
    }));

    await new Promise(r => setTimeout(r, 600));

    let response = '';

    if (text.includes('conche') || text.includes('conching') || text.includes('viscosity')) {
      get().focusOnFacility('FAC-CHI-01');
      response = `Navigated to Stage 6: Grand Conching & Refining Mega-Plant. Current batch: 72% Dark Couverture at 72.4°C, viscosity 3,450 cP, tank load 86.4%. Agitation running smoothly.`;
    } else if (text.includes('temper') || text.includes('tempering') || text.includes('crystal')) {
      get().focusOnFacility('FAC-ATL-05');
      response = `Navigated to Stage 7: Precision Tempering Hub. Continuous 3-stage thermal tempering curve active (45°C -> 27°C -> 31.5°C). Form-V Beta Crystal formation verified at 99.8% purity.`;
    } else if (text.includes('roast') || text.includes('drum')) {
      get().focusOnFacility('FAC-DAL-04');
      response = `Navigated to Stage 2: Continuous Thermal Drum Roasting. Convective hot air running at 135.0°C. Maillard browning active on Criollo beans.`;
    } else if (text.includes('butter') || text.includes('press')) {
      get().focusOnFacility('FAC-SUPP-10');
      response = `Navigated to Stage 4: Cocoa Butter Hydraulic Press Depot. 500-bar hydraulic rams operating at 85.0°C, extracting pure deodorized golden cocoa butter.`;
    } else if (text.includes('radial') || text.includes('cylinder') || text.includes('orbit')) {
      if (!state.explodedGraph.active) get().toggleExplodedGraph();
      get().setExplodedLayoutMode('radial');
      response = `Switched 3D layout to Radial Cylindrical Orbit. Concentric tiers arranged around core nexus.`;
    } else if (text.includes('dag') || text.includes('tree') || text.includes('hierarch') || text.includes('flow layout') || text.includes('stages') || text.includes('process')) {
      if (!state.explodedGraph.active) get().toggleExplodedGraph();
      get().setExplodedLayoutMode('dag_tree');
      response = `Switched 3D layout to Chocolate Process Flow DAG: 1. Raw Silos -> 2. Roasting -> 3. Winnowing -> 4. Butter Press -> 5. Dairy Blend -> 6. Conching -> 7. Tempering -> 8. Bulk Rail -> 9. Enrobing -> 10. Packaging.`;
    } else if (text.includes('force') || text.includes('cluster') || text.includes('mesh layout')) {
      if (!state.explodedGraph.active) get().toggleExplodedGraph();
      get().setExplodedLayoutMode('force');
      response = `Switched 3D layout to Dynamic Force-Clustered Physics Mesh.`;
    } else if (text.includes('stack') || text.includes('stratified') || text.includes('isometric')) {
      if (!state.explodedGraph.active) get().toggleExplodedGraph();
      get().setExplodedLayoutMode('stacked');
      response = `Switched 3D layout to Stratified 7-Layer Exploded Stack.`;
    } else if (text.includes('blast radius') || text.includes('trace blast') || text.includes('impact chain')) {
      if (!state.explodedGraph.active) get().toggleExplodedGraph();
      get().setBlastRadiusNode('INC-BLIZZ-01');
      response = `Tracing Disruption Blast Radius: Highlighting critical path from Main Jacketed Pipe trip to downstream tempering and enrobing lines.`;
    } else if (text.includes('risk') || text.includes('highest risk')) {
      const topRiskVeh = state.vehicles.find(v => v.isDelayedByDisruption) || state.vehicles[0];
      set({
        selectedEntity: { type: 'vehicle', id: topRiskVeh.vehicleCode, data: topRiskVeh },
        cameraMode: 'follow_vehicle',
        followedVehicleId: topRiskVeh.vehicleCode,
      });
      response = `Highlighted vehicle ${topRiskVeh.vehicleCode} carrying molten chocolate mass. Jacketed pipe failure causing viscosity freeze delay (+16.5h).`;
    } else if (text.includes('disruption') || text.includes('blizzard') || text.includes('closure') || text.includes('jacket') || text.includes('freeze')) {
      const inc = state.incidents[0];
      if (inc) {
        set({
          selectedEntity: { type: 'incident', id: inc.incidentCode, data: inc },
          cameraMode: 'incident_focus',
        });
        response = `Focused on active incident: ${inc.title}. Jacketed heater failure on main transfer line Section 4.`;
      }
    } else if (text.includes('recovery') || text.includes('reroute') || text.includes('alternative') || text.includes('bypass')) {
      get().applyRecoveryPlan('PLAN-REC-01');
      response = `Thermal Recovery Plan Applied: Jacketed Recirculation Bypass Loop activated at 32°C. 17 batches protected, saving 11.4h avg solidification downtime.`;
    } else if (text.includes('warehouse') || text.includes('cutaway') || text.includes('interior') || text.includes('factory')) {
      get().toggleWarehouseCutaway('FAC-CHI-01');
      response = `Activated Chocolate Factory Interior Cutaway: Conching tanks, agitators, and continuous chocolate mold conveyors inspected.`;
    } else if (text.includes('exploded') || text.includes('graph') || text.includes('dependency')) {
      get().toggleExplodedGraph('SH-1042');
      response = `Activated 7-Layer 3D Supply Chain Exploded View. Isolating shipment SH-1042 (Artisan 72% Dark Couverture).`;
    } else if (text.includes('compare') || text.includes('future') || text.includes('scenarios')) {
      set(s => ({
        scenarioComparison: { ...s.scenarioComparison, active: true },
      }));
      response = `Multi-future comparison enabled. Baseline freezing scenario vs Recirculation Bypass Loop displayed.`;
    } else if (text.includes('port') || text.includes('ship') || text.includes('bean') || text.includes('silo')) {
      const port = state.facilities.find(f => f.facilityCategory === 'coastal_port') || state.facilities[0];
      get().focusOnPosition(port.position3D, port.position3D);
      set({ selectedEntity: { type: 'facility', id: port.facilityCode, data: port } });
      response = `Navigated to Pacific Cocoa Bean Deepwater Harbor (FAC-LAX-03). Single-origin bean sacks stored at 21°C.`;
    } else {
      set({ cameraMode: 'overview' });
      response = `Command parsed: Chocolate Factory Overview calibrated. Telemetry synchronized across 10 processing stages.`;
    }

    set(s => ({
      aiCopilot: {
        ...s.aiCopilot,
        isProcessing: false,
        lastResponse: response,
        activeCommunicationPair: null,
      },
    }));

    return response;
  },

  toggleRouteEditing: routeCode => {
    set(state => ({
      routeEditing: {
        active: !state.routeEditing.active,
        selectedRouteCode: routeCode || 'ROUTE-I80-MW',
        previewAlternative: true,
      },
    }));
  },

  resetScene: () => {
    set({
      cameraMode: 'overview',
      cameraTarget: [0, 48, 56],
      cameraLookAt: [0, 0, 0],
      selectedEntity: null,
      followedVehicleId: null,
      isTourActive: false,
      warehouseCutaway: {
        active: false,
        facilityCode: null,
        selectedAisle: null,
        selectedShelfId: null,
      },
      explodedGraph: {
        active: false,
        isolatedShipmentId: null,
        activeLayer: 'all',
        layoutMode: 'stacked',
        explosionSpread: 1.0,
        autoRotate: false,
        linkFlowActive: true,
        highlightedBlastRadiusNodeId: null,
      },
    });
  },

  syncBackendData: data => {
    set(state => {
      const newFacilities = data.facilities
        ? state.facilities.map(sf => {
            const match = data.facilities!.find((f: any) => f.facilityCode === sf.facilityCode);
            if (!match) return sf;
            return {
              ...sf,
              ...match,
              name: sf.name,
              processStageNumber: sf.processStageNumber,
              processStageName: sf.processStageName,
              chocolateFacilityName: sf.chocolateFacilityName,
              processDescription: sf.processDescription,
              temperatureCelsius: sf.temperatureCelsius,
              viscosityCp: sf.viscosityCp,
              cocoaSolidsPercent: sf.cocoaSolidsPercent,
            };
          })
        : state.facilities;

      const newRoutes = data.routes
        ? state.routes.map(sr => {
            const match = data.routes!.find((r: any) => r.routeCode === sr.routeCode);
            if (!match) return sr;
            return {
              ...sr,
              ...match,
              name: sr.name,
              chocolatePipelineName: sr.chocolatePipelineName,
              ingredientFlow: sr.ingredientFlow,
              pipeTemperatureCelsius: sr.pipeTemperatureCelsius,
              pipePressureBar: sr.pipePressureBar,
              chocolateStatusText: sr.chocolateStatusText,
            };
          })
        : state.routes;

      const newVehicles = data.vehicles
        ? state.vehicles.map(sv => {
            const match = data.vehicles!.find((v: any) => v.vehicleCode === sv.vehicleCode);
            return match ? { ...sv, ...match } : sv;
          })
        : state.vehicles;

      return {
        facilities: newFacilities,
        routes: newRoutes,
        vehicles: newVehicles,
        recoveryPlans: data.recoveryPlans || state.recoveryPlans,
      };
    });
  },
}));
