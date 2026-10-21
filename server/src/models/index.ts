import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  UserRole,
  ShipmentStatus,
  PriorityLevel,
  FacilityType,
  DisruptionType,
} from '../shared/types.js';

// ================= USER MODEL =================
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  accountStatus: 'active' | 'suspended' | 'pending';
  department?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Administrator', 'Logistics Manager', 'Operations Analyst', 'Viewer'],
      default: 'Operations Analyst',
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
      index: true,
    },
    department: { type: String },
    avatarUrl: { type: String },
    preferences: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// ================= SHIPMENT MODEL =================
export interface IShipment extends Document {
  shipmentId: string;
  orderId: string;
  customerReference: string;
  origin: {
    name: string;
    lat: number;
    lng: number;
    facilityId?: string;
    address?: string;
  };
  destination: {
    name: string;
    lat: number;
    lng: number;
    facilityId?: string;
    address?: string;
  };
  currentLocation?: {
    name: string;
    lat: number;
    lng: number;
  };
  carrierId: string;
  carrierName: string;
  vehicleId?: string;
  status: ShipmentStatus;
  priority: PriorityLevel;
  cargoDescription: string;
  weightKg: number;
  volumeM3?: number;
  temperatureControlled: boolean;
  plannedPickup: Date;
  plannedDelivery: Date;
  actualPickup?: Date;
  actualDelivery?: Date;
  estimatedDelivery?: Date;
  delayHours: number;
  riskScore: number;
  riskFactors: string[];
  routeId?: string;
  documentReferences: string[];
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    location?: { name: string; lat: number; lng: number };
    timestamp: Date;
    type: string;
    status: string;
    actor?: string;
  }>;
  assignedFacilityId?: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    shipmentId: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    customerReference: { type: String, required: true, index: true },
    origin: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      facilityId: { type: String },
      address: { type: String },
    },
    destination: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      facilityId: { type: String },
      address: { type: String },
    },
    currentLocation: {
      name: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    carrierId: { type: String, required: true, index: true },
    carrierName: { type: String, required: true },
    vehicleId: { type: String, index: true },
    status: {
      type: String,
      enum: ['draft', 'pending_validation', 'ready_for_dispatch', 'in_transit', 'delayed', 'exception', 'delivered', 'cancelled'],
      default: 'ready_for_dispatch',
      index: true,
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    cargoDescription: { type: String, required: true },
    weightKg: { type: Number, required: true },
    volumeM3: { type: Number },
    temperatureControlled: { type: Boolean, default: false },
    plannedPickup: { type: Date, required: true },
    plannedDelivery: { type: Date, required: true, index: true },
    actualPickup: { type: Date },
    actualDelivery: { type: Date },
    estimatedDelivery: { type: Date },
    delayHours: { type: Number, default: 0, index: true },
    riskScore: { type: Number, default: 0, min: 0, max: 100, index: true },
    riskFactors: [{ type: String }],
    routeId: { type: String, index: true },
    documentReferences: [{ type: String }],
    milestones: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        location: {
          name: { type: String },
          lat: { type: Number },
          lng: { type: Number },
        },
        timestamp: { type: Date, required: true },
        type: { type: String, required: true },
        status: { type: String, required: true },
        actor: { type: String },
      },
    ],
    assignedFacilityId: { type: String, index: true },
    notes: { type: String },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ================= FACILITY MODEL =================
export interface IFacility extends Document {
  facilityCode: string;
  name: string;
  type: FacilityType;
  location: {
    name: string;
    lat: number;
    lng: number;
    address?: string;
  };
  totalCapacityUnits: number;
  currentUtilizationUnits: number;
  utilizationPercentage: number;
  status: 'optimal' | 'congested' | 'maintenance' | 'disrupted';
  throughputPerHour: number;
  activeShipmentCount: number;
  operatingHours: string;
}

const FacilitySchema = new Schema<IFacility>(
  {
    facilityCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['warehouse', 'distribution_center', 'port', 'cross_dock', 'supplier_hub'],
      required: true,
      index: true,
    },
    location: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    totalCapacityUnits: { type: Number, required: true },
    currentUtilizationUnits: { type: Number, default: 0 },
    utilizationPercentage: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ['optimal', 'congested', 'maintenance', 'disrupted'],
      default: 'optimal',
      index: true,
    },
    throughputPerHour: { type: Number, default: 100 },
    activeShipmentCount: { type: Number, default: 0 },
    operatingHours: { type: String, default: '24/7' },
  },
  { timestamps: true }
);

// ================= VEHICLE MODEL =================
export interface IVehicle extends Document {
  vehicleCode: string;
  type: string;
  licensePlate: string;
  carrierId: string;
  carrierName: string;
  maxWeightKg: number;
  currentWeightKg: number;
  status: 'in_transit' | 'idle' | 'loading' | 'unloading' | 'maintenance' | 'breakdown';
  currentLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  heading?: number;
  speedKmh?: number;
  assignedShipmentIds: string[];
}

const VehicleSchema = new Schema<IVehicle>(
  {
    vehicleCode: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    licensePlate: { type: String, required: true },
    carrierId: { type: String, required: true, index: true },
    carrierName: { type: String, required: true },
    maxWeightKg: { type: Number, required: true },
    currentWeightKg: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_transit', 'idle', 'loading', 'unloading', 'maintenance', 'breakdown'],
      default: 'idle',
      index: true,
    },
    currentLocation: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    heading: { type: Number, default: 0 },
    speedKmh: { type: Number, default: 0 },
    assignedShipmentIds: [{ type: String }],
  },
  { timestamps: true }
);

// ================= ROUTE MODEL =================
export interface IRoute extends Document {
  routeCode: string;
  name: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  distanceKm: number;
  estimatedDurationHours: number;
  waypoints: Array<{ name: string; lat: number; lng: number; sequence: number; estimatedTime?: string }>;
  routeType: 'planned' | 'observed' | 'simulated' | 'alternative';
  roadCorridor?: string;
  isCongested?: boolean;
  isClosed?: boolean;
}

const RouteSchema = new Schema<IRoute>(
  {
    routeCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    origin: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destination: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    distanceKm: { type: Number, required: true },
    estimatedDurationHours: { type: Number, required: true },
    waypoints: [
      {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        sequence: { type: Number, required: true },
        estimatedTime: { type: String },
      },
    ],
    routeType: {
      type: String,
      enum: ['planned', 'observed', 'simulated', 'alternative'],
      default: 'planned',
      index: true,
    },
    roadCorridor: { type: String, index: true },
    isCongested: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ================= INCIDENT MODEL =================
export interface IIncident extends Document {
  incidentType: DisruptionType;
  title: string;
  description: string;
  location?: { name: string; lat: number; lng: number };
  affectedEntities: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: Date;
  expectedEndTime?: Date;
  status: 'active' | 'mitigated' | 'resolved';
  source: 'simulated' | 'manual' | 'telemetry';
  scenarioId?: string;
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentType: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    location: {
      name: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    affectedEntities: [{ type: String }],
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium', index: true },
    startTime: { type: Date, default: Date.now },
    expectedEndTime: { type: Date },
    status: { type: String, enum: ['active', 'mitigated', 'resolved'], default: 'active', index: true },
    source: { type: String, enum: ['simulated', 'manual', 'telemetry'], default: 'simulated' },
    scenarioId: { type: String, index: true },
  },
  { timestamps: true }
);

// ================= SIMULATION SCENARIO MODEL =================
export interface ISimulationScenario extends Document {
  name: string;
  description: string;
  isBaseline: boolean;
  status: 'draft' | 'running' | 'completed' | 'failed';
  disruption: {
    type: DisruptionType;
    title: string;
    description: string;
    location?: { name: string; lat: number; lng: number };
    facilityId?: string;
    vehicleId?: string;
    routeCorridor?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    durationHours: number;
    capacityDropPercentage?: number;
    speedReductionPercentage?: number;
    affectedShipmentIds?: string[];
  };
  affectedShipmentIds: string[];
  metrics: {
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
    recoveryFeasibilityScore: number;
  };
  assumptions: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SimulationScenarioSchema = new Schema<ISimulationScenario>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    isBaseline: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['draft', 'running', 'completed', 'failed'], default: 'draft', index: true },
    disruption: {
      type: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, default: '' },
      location: {
        name: { type: String },
        lat: { type: Number },
        lng: { type: Number },
      },
      facilityId: { type: String },
      vehicleId: { type: String },
      routeCorridor: { type: String },
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
      durationHours: { type: Number, default: 8 },
      capacityDropPercentage: { type: Number },
      speedReductionPercentage: { type: Number },
      affectedShipmentIds: [{ type: String }],
    },
    affectedShipmentIds: [{ type: String }],
    metrics: {
      totalShipmentsMonitored: { type: Number, default: 0 },
      directlyAffectedShipments: { type: Number, default: 0 },
      atRiskShipments: { type: Number, default: 0 },
      projectedLateDeliveries: { type: Number, default: 0 },
      averageDelayHours: { type: Number, default: 0 },
      maxDelayHours: { type: Number, default: 0 },
      addedDistanceKm: { type: Number, default: 0 },
      estimatedExtraCostUSD: { type: Number, default: 0 },
      slaPenaltyRiskUSD: { type: Number, default: 0 },
      facilityUtilizationImpactPct: { type: Number, default: 0 },
      recoveryFeasibilityScore: { type: Number, default: 85 },
    },
    assumptions: [{ type: String }],
    createdBy: { type: String, default: 'System' },
  },
  { timestamps: true }
);

// ================= RECOVERY PLAN MODEL =================
export interface IRecoveryPlan extends Document {
  planCode: string;
  scenarioId: string;
  scenarioName: string;
  title: string;
  description: string;
  strategyCategory: 'fastest_delivery' | 'lowest_cost' | 'balanced_resilience';
  proposedActions: Array<{
    id: string;
    actionType: string;
    shipmentId: string;
    title: string;
    description: string;
    targetEntityId?: string;
    targetEntityName?: string;
    costDeltaUSD: number;
    timeSavingsHours: number;
    feasibilityConfidence: number;
    prerequisites?: string[];
  }>;
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
  approvedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecoveryPlanSchema = new Schema<IRecoveryPlan>(
  {
    planCode: { type: String, required: true, unique: true, index: true },
    scenarioId: { type: String, required: true, index: true },
    scenarioName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    strategyCategory: {
      type: String,
      enum: ['fastest_delivery', 'lowest_cost', 'balanced_resilience'],
      required: true,
      index: true,
    },
    proposedActions: [
      {
        id: { type: String, required: true },
        actionType: { type: String, required: true },
        shipmentId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        targetEntityId: { type: String },
        targetEntityName: { type: String },
        costDeltaUSD: { type: Number, default: 0 },
        timeSavingsHours: { type: Number, default: 0 },
        feasibilityConfidence: { type: Number, default: 80 },
        prerequisites: [{ type: String }],
      },
    ],
    projectedRecoveryMetrics: {
      recoveredOnTimeDeliveries: { type: Number, default: 0 },
      reducedDelayHours: { type: Number, default: 0 },
      netCostUSD: { type: Number, default: 0 },
      feasibilityScore: { type: Number, default: 85 },
    },
    constraintsChecked: [
      {
        name: { type: String, required: true },
        passed: { type: Boolean, required: true },
        details: { type: String, required: true },
      },
    ],
    unresolvedRisks: [{ type: String }],
    approvalStatus: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected', 'applied_to_simulation'],
      default: 'pending_review',
      index: true,
    },
    approvedBy: { type: String },
    approvedAt: { type: Date },
    reviewNotes: { type: String },
  },
  { timestamps: true }
);

// ================= DOCUMENT RECORD MODEL =================
export interface IDocumentRecord extends Document {
  documentCode: string;
  fileName: string;
  fileType: string;
  fileSizeKB: number;
  uploadTimestamp: Date;
  documentCategory: string;
  processingStatus: 'uploaded' | 'processing' | 'extracted' | 'flagged_discrepancy' | 'confirmed';
  extractedFields: Array<{
    fieldName: string;
    label: string;
    value: Schema.Types.Mixed;
    confidenceScore: number;
    sourceSnippet: string;
    pageNumber?: number;
    isValidated: boolean;
    correctedValue?: Schema.Types.Mixed;
  }>;
  validationStatus: 'valid' | 'missing_fields' | 'inconsistent_dates' | 'duplicate_detected';
  duplicateCandidateId?: string;
  conflictingFields?: string[];
  linkedShipmentId?: string;
  rawTextPreview?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentRecordSchema = new Schema<IDocumentRecord>(
  {
    documentCode: { type: String, required: true, unique: true, index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSizeKB: { type: Number, required: true },
    uploadTimestamp: { type: Date, default: Date.now },
    documentCategory: { type: String, required: true, index: true },
    processingStatus: {
      type: String,
      enum: ['uploaded', 'processing', 'extracted', 'flagged_discrepancy', 'confirmed'],
      default: 'extracted',
      index: true,
    },
    extractedFields: [
      {
        fieldName: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: Schema.Types.Mixed },
        confidenceScore: { type: Number, default: 0.9 },
        sourceSnippet: { type: String, default: '' },
        pageNumber: { type: Number },
        isValidated: { type: Boolean, default: false },
        correctedValue: { type: Schema.Types.Mixed },
      },
    ],
    validationStatus: {
      type: String,
      enum: ['valid', 'missing_fields', 'inconsistent_dates', 'duplicate_detected'],
      default: 'valid',
      index: true,
    },
    duplicateCandidateId: { type: String },
    conflictingFields: [{ type: String }],
    linkedShipmentId: { type: String, index: true },
    rawTextPreview: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// ================= ALERT MODEL =================
export interface IAlert extends Document {
  alertCode: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  linkedEntityId?: string;
  linkedEntityType?: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  assignedTo?: string;
  notes?: string[];
  timestamp: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    alertCode: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    severity: { type: String, enum: ['critical', 'warning', 'info'], required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    linkedEntityId: { type: String, index: true },
    linkedEntityType: { type: String },
    status: {
      type: String,
      enum: ['active', 'investigating', 'resolved', 'dismissed'],
      default: 'active',
      index: true,
    },
    assignedTo: { type: String },
    notes: [{ type: String }],
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// ================= AUDIT EVENT MODEL =================
export interface IAuditEvent extends Document {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  outcome: 'success' | 'denied' | 'failed';
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    outcome: { type: String, enum: ['success', 'denied', 'failed'], required: true, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

import { createSqliteModel, ISqliteModel, isValidObjectId } from '../db/sqlite.js';

// Export Models powered by SQLite file-based persistence
export const User: ISqliteModel<IUser> = createSqliteModel<IUser>('User', 'users');
export const Shipment: ISqliteModel<IShipment> = createSqliteModel<IShipment>('Shipment', 'shipments');
export const Facility: ISqliteModel<IFacility> = createSqliteModel<IFacility>('Facility', 'facilities');
export const Vehicle: ISqliteModel<IVehicle> = createSqliteModel<IVehicle>('Vehicle', 'vehicles');
export const Route: ISqliteModel<IRoute> = createSqliteModel<IRoute>('Route', 'routes');
export const Incident: ISqliteModel<IIncident> = createSqliteModel<IIncident>('Incident', 'incidents');
export const SimulationScenario: ISqliteModel<ISimulationScenario> = createSqliteModel<ISimulationScenario>('SimulationScenario', 'simulationscenarios');
export const RecoveryPlan: ISqliteModel<IRecoveryPlan> = createSqliteModel<IRecoveryPlan>('RecoveryPlan', 'recoveryplans');
export const DocumentRecord: ISqliteModel<IDocumentRecord> = createSqliteModel<IDocumentRecord>('DocumentRecord', 'documentrecords');
export const Alert: ISqliteModel<IAlert> = createSqliteModel<IAlert>('Alert', 'alerts');
export const AuditEvent: ISqliteModel<IAuditEvent> = createSqliteModel<IAuditEvent>('AuditEvent', 'auditevents');

export { isValidObjectId };
