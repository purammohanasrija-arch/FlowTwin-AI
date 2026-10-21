export type UserRole = 'Administrator' | 'Logistics Manager' | 'Operations Analyst' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: 'active' | 'suspended' | 'pending';
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ShipmentStatus =
  | 'draft'
  | 'pending_validation'
  | 'ready_for_dispatch'
  | 'in_transit'
  | 'delayed'
  | 'exception'
  | 'delivered'
  | 'cancelled';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  facilityId?: string;
  address?: string;
}

export interface MilestoneEvent {
  id: string;
  title: string;
  description: string;
  location?: GeoLocation;
  timestamp: string;
  type: 'pickup' | 'checkpoint' | 'delay' | 'customs' | 'handoff' | 'delivery' | 'incident' | 'recovery';
  status: 'completed' | 'current' | 'pending' | 'alert';
  actor?: string;
}

export interface ShipmentRecord {
  id: string;
  shipmentId: string; // e.g. SH-1042
  orderId: string;
  customerReference: string;
  origin: GeoLocation;
  destination: GeoLocation;
  currentLocation?: GeoLocation;
  carrierId: string;
  carrierName: string;
  vehicleId?: string;
  status: ShipmentStatus;
  priority: PriorityLevel;
  cargoDescription: string;
  weightKg: number;
  volumeM3?: number;
  temperatureControlled?: boolean;
  plannedPickup: string;
  plannedDelivery: string;
  actualPickup?: string;
  actualDelivery?: string;
  estimatedDelivery?: string;
  delayHours: number;
  riskScore: number; // 0 to 100
  riskFactors: string[];
  routeId?: string;
  documentReferences: string[];
  milestones: MilestoneEvent[];
  assignedFacilityId?: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FacilityType = 'warehouse' | 'distribution_center' | 'port' | 'cross_dock' | 'supplier_hub';

export interface FacilityRecord {
  id: string;
  facilityCode: string; // e.g. WH-CHI-01
  name: string;
  type: FacilityType;
  location: GeoLocation;
  totalCapacityUnits: number;
  currentUtilizationUnits: number;
  utilizationPercentage: number;
  status: 'optimal' | 'congested' | 'maintenance' | 'disrupted';
  throughputPerHour: number;
  activeShipmentCount: number;
  operatingHours: string;
}

export interface VehicleRecord {
  id: string;
  vehicleCode: string; // e.g. TRK-882
  type: 'dry_van' | 'reefer' | 'flatbed' | 'container_carrier' | 'air_freight' | 'intermodal';
  licensePlate: string;
  carrierId: string;
  carrierName: string;
  maxWeightKg: number;
  currentWeightKg: number;
  status: 'in_transit' | 'idle' | 'loading' | 'unloading' | 'maintenance' | 'breakdown';
  currentLocation: GeoLocation;
  heading?: number;
  speedKmh?: number;
  assignedShipmentIds: string[];
}

export interface RouteWaypoint extends GeoLocation {
  sequence: number;
  estimatedTime?: string;
}

export interface RouteRecord {
  id: string;
  routeCode: string;
  name: string;
  origin: GeoLocation;
  destination: GeoLocation;
  distanceKm: number;
  estimatedDurationHours: number;
  waypoints: RouteWaypoint[];
  routeType: 'planned' | 'observed' | 'simulated' | 'alternative';
  roadCorridor?: string;
  isCongested?: boolean;
  isClosed?: boolean;
}

export type DisruptionType =
  | 'road_closure'
  | 'vehicle_breakdown'
  | 'warehouse_outage'
  | 'port_delay'
  | 'carrier_capacity_reduction'
  | 'severe_weather'
  | 'customs_hold'
  | 'fuel_surge';

export interface DisruptionParameters {
  type: DisruptionType;
  title: string;
  description: string;
  location?: GeoLocation;
  facilityId?: string;
  vehicleId?: string;
  routeCorridor?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  durationHours: number;
  capacityDropPercentage?: number;
  speedReductionPercentage?: number;
  affectedShipmentIds?: string[];
}

export interface SimulationMetrics {
  totalShipmentsMonitored: number;
  directlyAffectedShipments: number;
  atRiskShipments: number;
  projectedLateDeliveries: number;
  averageDelayHours: number;
  maxDelayHours: number;
  addedDistanceKm: number;
  estimatedExtraCostUSD: number;
  slaPenaltyRiskUSD: number;
  facilityUtilizationImpactPct: number;
  recoveryFeasibilityScore: number; // 0 - 100
}

export interface SimulationScenarioRecord {
  id: string;
  name: string;
  description: string;
  isBaseline: boolean;
  status: 'draft' | 'running' | 'completed' | 'failed';
  disruption: DisruptionParameters;
  affectedShipmentIds: string[];
  metrics: SimulationMetrics;
  assumptions: string[];
  createdAt: string;
  createdBy: string;
}

export interface ScenarioComparison {
  baseline: SimulationMetrics;
  scenarios: Array<{
    scenarioId: string;
    scenarioName: string;
    disruptionType: DisruptionType;
    metrics: SimulationMetrics;
    deltaVsBaseline: {
      additionalDelayHours: number;
      additionalLateDeliveries: number;
      additionalCostUSD: number;
      additionalDistanceKm: number;
    };
  }>;
}

export interface ProposedAction {
  id: string;
  actionType:
    | 'reassign_vehicle'
    | 'reroute_alternative_corridor'
    | 'reallocate_warehouse'
    | 'reschedule_delivery_window'
    | 'expedite_priority'
    | 'split_consignment';
  shipmentId: string;
  title: string;
  description: string;
  targetEntityId?: string;
  targetEntityName?: string;
  costDeltaUSD: number;
  timeSavingsHours: number;
  feasibilityConfidence: number; // 0 - 100
  prerequisites?: string[];
}

export interface RecoveryPlanRecord {
  id: string;
  planCode: string;
  scenarioId: string;
  scenarioName: string;
  title: string;
  description: string;
  strategyCategory: 'fastest_delivery' | 'lowest_cost' | 'balanced_resilience';
  proposedActions: ProposedAction[];
  projectedRecoveryMetrics: {
    recoveredOnTimeDeliveries: number;
    reducedDelayHours: number;
    netCostUSD: number;
    feasibilityScore: number;
  };
  constraintsChecked: Array<{
    name: string;
    passed: boolean;
    details: string;
  }>;
  unresolvedRisks: string[];
  approvalStatus: 'pending_review' | 'approved' | 'rejected' | 'applied_to_simulation';
  approvedBy?: string;
  approvedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export interface ExtractedField {
  fieldName: string;
  label: string;
  value: string | number | boolean;
  confidenceScore: number; // 0 to 1
  sourceSnippet: string;
  pageNumber?: number;
  isValidated: boolean;
  correctedValue?: string | number | boolean;
}

export interface DocumentRecord {
  id: string;
  documentCode: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx' | 'image';
  fileSizeKB: number;
  uploadTimestamp: string;
  documentCategory: 'bill_of_lading' | 'delivery_order' | 'commercial_invoice' | 'dispatch_manifest' | 'customs_declaration';
  processingStatus: 'uploaded' | 'processing' | 'extracted' | 'flagged_discrepancy' | 'confirmed';
  extractedFields: ExtractedField[];
  validationStatus: 'valid' | 'missing_fields' | 'inconsistent_dates' | 'duplicate_detected';
  duplicateCandidateId?: string;
  conflictingFields?: string[];
  linkedShipmentId?: string;
  rawTextPreview?: string;
  notes?: string;
}

export interface AlertRecord {
  id: string;
  alertCode: string;
  type:
    | 'critical_delay'
    | 'deadline_risk'
    | 'missing_documentation'
    | 'invalid_shipment_data'
    | 'capacity_conflict'
    | 'facility_outage'
    | 'route_disruption'
    | 'recovery_plan_pending';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  linkedEntityId?: string;
  linkedEntityType?: 'shipment' | 'facility' | 'vehicle' | 'scenario' | 'recovery_plan' | 'document';
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  assignedTo?: string;
  notes?: string[];
  timestamp: string;
}

export interface AuditEventRecord {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'shipment' | 'facility' | 'simulation' | 'recovery_plan' | 'document' | 'user' | 'system';
  entityId: string;
  outcome: 'success' | 'denied' | 'failed';
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface AgentExecutionStep {
  agentName: 'DocumentIntelligence' | 'ShipmentRiskAnalysis' | 'DisruptionAnalysis' | 'RecoveryPlanning' | 'ValidationAgent' | 'ReportingAgent' | 'Orchestrator';
  status: 'idle' | 'running' | 'completed' | 'warning' | 'failed';
  inputSummary: string;
  outputSummary: string;
  validationPassed?: boolean;
  durationMs: number;
  timestamp: string;
}
