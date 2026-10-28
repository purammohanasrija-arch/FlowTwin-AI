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

export interface RawMaterialsBreakdown {
  cocoaBeans?: number;
  cocoaButter?: number;
  caneSugar?: number;
  milkPowder?: number;
  vanillaLecithinKg?: number;
  pralineCaramelTons?: number;
  cocoaBeansTons?: number;
  cocoaButterTons?: number;
  caneSugarTons?: number;
  milkPowderTons?: number;
}

export interface ShockMetrics {
  thermalShockIndex: number; // °C/min rate of temp change (Safe < 2.0, Warning 2.0-3.5, Critical > 3.5)
  thermalShockStatus: 'safe' | 'warning' | 'critical';
  temperShockRiskPct: number; // 0-100% risk of beta-crystal degradation / fat bloom
  viscosityShockFactor: number; // 1.0 = baseline, > 1.5 = high shear stress
  supplyShockVulnerability: number; // 0-100% vulnerability to disruptions
  shockDescription?: string;
}

export interface FactoryTemperatureParameters {
  currentTempCelsius: number;
  targetTempCelsius: number;
  roastingTempCelsius?: number;
  mixingTempCelsius?: number;
  temperingTempCelsius?: number;
  coolingTempCelsius?: number;
  moldTempCelsius?: number;
  coolingRateCelsiusPerMin?: number;
  tempToleranceCelsius?: number;
  status?: 'normal' | 'warning' | 'critical';
}

export interface FactoryMachineParameters {
  machineCode: string; // e.g. MIX-01, PKG-02, COOL-01
  machineName: string; // e.g. Mixing Machine, Packaging, Cooling Tunnel
  machineSpeedRpm?: number; // RPM
  motorSpeedRpm?: number; // RPM
  wrappingSpeedBpm?: number; // packages/min
  capacityUtilizationPct: number; // %
  operatingStatus: 'normal' | 'warning' | 'critical' | 'maintenance' | 'offline';
  downtimeMinutes: number; // minutes
  maintenanceCondition: 'Optimal' | 'Good' | 'Service Due' | 'Critical Wear';
  vibrationMmSec?: number;
  powerKw?: number;
}

export interface FactoryProductionParameters {
  chocolateOutputKgPerHour: number; // kg/hour
  batchSizeKg: number; // kg/batch
  batchProgressPct?: number; // %
  productionRateUnitsPerHour: number; // units/hour
  packagesPerMinute?: number; // packages/min
  rejectedProductsPct: number; // %
  packagingCountTotal: number; // units
  defectCount: number; // units
  fillLevelPct?: number; // %
  processingDurationMinutes?: number;
}

export interface FactoryEnvironmentalParameters {
  factoryHumidityRh: number; // %RH
  roomTempCelsius: number; // °C
  coolingWaterTempCelsius: number; // °C
  energyConsumptionKwh: number; // kWh
  co2EmissionsKgPerHour?: number;
}

export interface FactoryInventoryParameters {
  cocoaBeansKg: number;
  cocoaButterKg: number;
  sugarKg: number;
  milkPowderKg: number;
  packagingMaterialPackages: number;
  finishedStockKg: number;
  finishedStockPackages: number;
  rawMaterialBufferDays: number;
}

export interface FactoryWideKPIs {
  totalProductionTodayKg: number; // Chocolate produced today in kg (e.g. 28,450 kg)
  productionEfficiencyPct: number; // Actual output compared with planned output (e.g. 94.2%)
  machineAvailabilityPct: number; // Percentage of time machines are available (e.g. 98.1%)
  qualityRatePct: number; // Percentage of products meeting quality criteria (e.g. 99.4%)
  energyConsumptionKwh: number; // Electricity consumed in kWh (e.g. 4,820 kWh)
  downtimeMinutes: number; // Minutes lost due to machine stoppages (e.g. 14 min)
  rawMaterialInventoryTonnes: number; // Available raw materials in tonnes (e.g. 210.5 T)
  finishedGoodsTonnes: number; // Finished goods in tonnes (e.g. 48.2 T)
  orderFulfillmentPct: number; // Percentage of orders completed on time (e.g. 98.8%)
  wastePercentage: number; // Material lost during production (e.g. 0.8%)
  aiRiskScore: number; // Estimated production disruption risk (e.g. 12/100)
}

export interface Live3DMapTelemetry {
  machineTag: string; // e.g. "MIX-01 · Mixing Machine"
  primaryMetric: {
    value: string; // e.g. "48°C", "120", "12°C"
    label: string; // e.g. "Temperature", "Packages/minute", "Cooling temperature"
    color?: string;
  };
  secondaryMetric: {
    badge: string; // e.g. "CAPACITY", "REJECT RATE", "BATCH PROGRESS"
    value: string; // e.g. "78%", "1.2%", "65%"
    statusNote: string; // e.g. "Operating normally", "Within demo threshold"
    statusColor: 'green' | 'amber' | 'red' | 'purple' | 'cyan';
  };
  extraMetrics?: {
    label: string;
    value: string;
  }[];
}

export interface ChocolateProcessStage {
  stageNumber: number;
  code: string;
  name: string;
  facilityCode: string;
  icon: string;
  description: string;
  operatingTempCelsius: number;
  targetViscosityCp?: number;
  outputProduct: string;
  chocolateVolumeTons?: number;
  rawMaterialSummary?: string;
  recipeRatio?: string;
  shockTolerance?: string;
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

  // Chocolate Factory Specialization
  processStageNumber?: number;
  processStageName?: string;
  chocolateFacilityName?: string;
  processDescription?: string;
  temperatureCelsius?: number;
  viscosityCp?: number;
  batchCapacityLiters?: number;
  activeBatches?: number;
  cocoaSolidsPercent?: number;
  qualityGrade?: string;

  // Parameters: Chocolate, Raw Materials, Shock
  chocolateVolumeTons?: number;
  finishedChocolateTons?: number;
  rawMaterialStockTons?: number;
  rawMaterialBufferDays?: number;
  rawMaterialsBreakdown?: RawMaterialsBreakdown;
  recipeRatio?: string;
  shockMetrics?: ShockMetrics;
  thermalShockIndex?: number;
  temperShockRiskPct?: number;
  supplyShockVulnerability?: number;

  // Smart Factory Machine & Process Parameters
  machineParams?: FactoryMachineParameters;
  temperatureParams?: FactoryTemperatureParameters;
  productionParams?: FactoryProductionParameters;
  environmentalParams?: FactoryEnvironmentalParameters;
  inventoryParams?: FactoryInventoryParameters;
  liveMapTelemetry?: Live3DMapTelemetry;
}

export interface RouteCorridor3D extends RouteRecord {
  splinePoints: [number, number, number][];
  corridorCategory: 'interstate' | 'railway' | 'seaway' | 'airway' | 'arterial';
  colorCode: string;
  flowSpeed: number;
  congestionLevel: number; // 0 to 1
  isBypassAlternative?: boolean;

  // Chocolate Factory Specialization
  chocolatePipelineName?: string;
  ingredientFlow?: string;
  pipeTemperatureCelsius?: number;
  pipePressureBar?: number;
  chocolateStatusText?: string;
  transportVolumeTons?: number;
  flowThroughputKgPerHour?: number;
  thermalShockGradient?: string;
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
