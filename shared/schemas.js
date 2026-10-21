"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatRequestSchema = exports.ApproveRecoveryPlanSchema = exports.CreateRecoveryPlanSchema = exports.CreateSimulationSchema = exports.UpdateShipmentStatusSchema = exports.CreateShipmentSchema = exports.GeoLocationSchema = exports.RegisterRequestSchema = exports.LoginRequestSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum([
    'Administrator',
    'Logistics Manager',
    'Operations Analyst',
    'Viewer'
]);
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.RegisterRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: exports.UserRoleSchema.default('Operations Analyst'),
    department: zod_1.z.string().optional(),
});
exports.GeoLocationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    facilityId: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.CreateShipmentSchema = zod_1.z.object({
    shipmentId: zod_1.z.string().min(3),
    orderId: zod_1.z.string().min(3),
    customerReference: zod_1.z.string().min(2),
    origin: exports.GeoLocationSchema,
    destination: exports.GeoLocationSchema,
    carrierId: zod_1.z.string().min(2),
    carrierName: zod_1.z.string().min(2),
    vehicleId: zod_1.z.string().optional(),
    priority: zod_1.z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
    cargoDescription: zod_1.z.string().min(2),
    weightKg: zod_1.z.number().positive(),
    volumeM3: zod_1.z.number().positive().optional(),
    temperatureControlled: zod_1.z.boolean().default(false),
    plannedPickup: zod_1.z.string(),
    plannedDelivery: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
});
exports.UpdateShipmentStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        'draft',
        'pending_validation',
        'ready_for_dispatch',
        'in_transit',
        'delayed',
        'exception',
        'delivered',
        'cancelled',
    ]),
    reason: zod_1.z.string().optional(),
    location: exports.GeoLocationSchema.optional(),
});
exports.CreateSimulationSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    description: zod_1.z.string().default(''),
    disruption: zod_1.z.object({
        type: zod_1.z.enum([
            'road_closure',
            'vehicle_breakdown',
            'warehouse_outage',
            'port_delay',
            'carrier_capacity_reduction',
            'severe_weather',
            'customs_hold',
            'fuel_surge',
        ]),
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().default(''),
        facilityId: zod_1.z.string().optional(),
        vehicleId: zod_1.z.string().optional(),
        routeCorridor: zod_1.z.string().optional(),
        severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
        durationHours: zod_1.z.number().min(1).max(168),
        capacityDropPercentage: zod_1.z.number().min(0).max(100).optional(),
        speedReductionPercentage: zod_1.z.number().min(0).max(100).optional(),
        affectedShipmentIds: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.CreateRecoveryPlanSchema = zod_1.z.object({
    scenarioId: zod_1.z.string(),
    strategyCategory: zod_1.z.enum(['fastest_delivery', 'lowest_cost', 'balanced_resilience']),
    customConstraints: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.ApproveRecoveryPlanSchema = zod_1.z.object({
    decision: zod_1.z.enum(['approve', 'reject']),
    reviewNotes: zod_1.z.string().optional(),
});
exports.AiChatRequestSchema = zod_1.z.object({
    message: zod_1.z.string().min(1),
    conversationHistory: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'assistant', 'system']),
        content: zod_1.z.string(),
    })).optional(),
    context: zod_1.z.object({
        currentPage: zod_1.z.string().optional(),
        selectedShipmentId: zod_1.z.string().optional(),
        activeScenarioId: zod_1.z.string().optional(),
    }).optional(),
});
