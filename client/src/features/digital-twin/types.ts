import {
  FacilityRecord,
  RouteRecord,
  VehicleRecord,
  ShipmentRecord,
  DisruptionParameters,
  RecoveryPlanRecord,
  AgentExecutionStep,
} from '../../shared/types.js';

export type QualityPreset = 'cinematic' | 'balanced' | 'performance';

export type WeatherPreset =
  | 'clear_day'
  | 'golden_hour'
  | 'midnight_cyber'
  | 'heavy_rain'
  | 'storm_blizzard'
  | 'dense_fog'
  | 'extreme_heat';

export type CameraMode =
  | 'overview'
  | 'freefly'
  | 'follow_vehicle'
  | 'route_journey'
  | 'warehouse_inspect'
  | 'incident_focus'
  | 'cargo_track'
  | 'executive_flyover'
  | 'compare_futures'
  | 'orbit_turntable';

export type ViewLayer =
  | 'terrain'
  | 'facilities'
  | 'interior_cutaway'
  | 'routes'
  | 'vehicles'
  | 'cargo'
  | 'particles'
  | 'incidents'
  | 'labels'
  | 'risk_heatmap'
  | 'capacity_towers'
  | 'ai_nodes'
  | 'weather_effects'
  | 'exploded_graph';

export type ExplodedLayerId =
  | 'suppliers'
  | 'manufacturing'
  | 'warehouses'
  | 'transport'
  | 'cargo'
  | 'documents'
  | 'disruptions';

export type GraphLayoutMode = 'stacked' | 'radial' | 'dag_tree' | 'force';

export interface ExplodedGraphState {
  active: boolean;
  isolatedShipmentId: string | null;
  activeLayer: ExplodedLayerId | 'all' | null;
  layoutMode: GraphLayoutMode;
  explosionSpread: number; // 0 (collapsed) to 1.5 (expanded)
  autoRotate: boolean;
  linkFlowActive: boolean;
  highlightedBlastRadiusNodeId: string | null;
}

export interface SelectedEntity {
  type:
    | 'facility'
    | 'vehicle'
    | 'route'
    | 'shipment'
    | 'incident'
    | 'cargo'
    | 'shelf_slot'
    | 'ai_agent'
    | 'supplier'
    | 'manufacturing'
    | 'document'
    | 'exploded_node';
  id: string;
  data: any;
}

export interface IncidentRecord3D {
  incidentCode: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    name: string;
    latitude: number;
    longitude: number;
    position3D: [number, number, number];
    description: string;
  };
  expectedDurationHours: number;
  delayImpactHours: number;
  affectedCorridor?: string;
  affectedVehicles?: string[];
  affectedShipments?: string[];
}

export interface FacilityNode3D extends FacilityRecord {
  position3D: [number, number, number];
  rotationY?: number;
  facilityCategory:
    | 'coastal_port'
    | 'mega_warehouse'
    | 'cross_dock'
    | 'inland_depot'
    | 'sorting_center'
    | 'airport_hub'
    | 'rail_terminal'
    | 'manufacturing_plant'
    | 'supplier_facility';
  buildingColor?: string;
  dockDoorsCount?: number;
}

export interface RouteCorridor3D extends RouteRecord {
  splinePoints: [number, number, number][];
  corridorCategory: 'interstate' | 'railway' | 'seaway' | 'airway' | 'arterial';
  colorCode: string;
  flowSpeed: number;
  congestionLevel: number; // 0 to 1
  isBypassAlternative?: boolean;
}

export interface VehicleSimulationState extends Omit<VehicleRecord, 'status'> {
  status:
    | 'in_transit'
    | 'idle'
    | 'loading'
    | 'unloading'
    | 'maintenance'
    | 'breakdown'
    | 'delayed'
    | 'rerouting';
  position3D: [number, number, number];
  rotationY: number;
  routeProgress: number; // 0 to 1
  assignedRouteCode: string;
  vehicleModelType:
    | 'semi_truck'
    | 'reefer'
    | 'delivery_van'
    | 'flatbed'
    | 'container_carrier'
    | 'freight_train'
    | 'cargo_ship'
    | 'cargo_aircraft'
    | 'forklift';
  currentSpeedKmh: number;
  isDelayedByDisruption?: boolean;
  isTakingAlternativeRoute?: boolean;
}

export interface CargoItem3D {
  id: string;
  shipmentId: string;
  orderId: string;
  cargoType: 'container_20ft' | 'container_40ft' | 'pallet_box' | 'reefer_crate' | 'hazmat_drum';
  weightKg: number;
  volumeM3: number;
  temperatureControlled: boolean;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  originFacilityCode: string;
  destinationFacilityCode: string;
  currentVehicleCode?: string;
  currentFacilityCode?: string;
  shelfSlotId?: string;
  status: 'staged_inbound' | 'in_storage' | 'loaded_transit' | 'staged_outbound' | 'delivered';
  riskScore: number;
  documentationStatus: 'complete' | 'pending' | 'flagged';
}

export interface AIAgentNodeState {
  id: string;
  name: string;
  displayName: string;
  role: string;
  status: 'idle' | 'running' | 'completed' | 'warning' | 'alert';
  currentTask: string;
  position3D: [number, number, number];
  lastOutputSummary?: string;
  processedCount: number;
  confidenceScore: number;
}

export interface SimulationClock {
  timestamp: number;
  hourOfDay: number;
  timeString: string;
  elapsedMinutes: number;
  speed: number;
  isPlaying: boolean;
}

export interface ScenarioComparisonState {
  active: boolean;
  mode: 'split' | 'overlay';
  baselineTitle: string;
  alternativeTitle: string;
  baselineMetrics: {
    avgDelayHours: number;
    lateDeliveries: number;
    extraCostUSD: number;
    slaCompliancePct: number;
  };
  recoveryMetrics: {
    avgDelayHours: number;
    lateDeliveries: number;
    extraCostUSD: number;
    slaCompliancePct: number;
  };
}
