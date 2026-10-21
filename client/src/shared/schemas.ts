import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'Administrator',
  'Logistics Manager',
  'Operations Analyst',
  'Viewer'
]);

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRoleSchema.default('Operations Analyst'),
  department: z.string().optional(),
});

export const GeoLocationSchema = z.object({
  name: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  facilityId: z.string().optional(),
  address: z.string().optional(),
});

export const CreateShipmentSchema = z.object({
  shipmentId: z.string().min(3),
  orderId: z.string().min(3),
  customerReference: z.string().min(2),
  origin: GeoLocationSchema,
  destination: GeoLocationSchema,
  carrierId: z.string().min(2),
  carrierName: z.string().min(2),
  vehicleId: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  cargoDescription: z.string().min(2),
  weightKg: z.number().positive(),
  volumeM3: z.number().positive().optional(),
  temperatureControlled: z.boolean().default(false),
  plannedPickup: z.string(),
  plannedDelivery: z.string(),
  notes: z.string().optional(),
});

export const UpdateShipmentStatusSchema = z.object({
  status: z.enum([
    'draft',
    'pending_validation',
    'ready_for_dispatch',
    'in_transit',
    'delayed',
    'exception',
    'delivered',
    'cancelled',
  ]),
  reason: z.string().optional(),
  location: GeoLocationSchema.optional(),
});

export const CreateSimulationSchema = z.object({
  name: z.string().min(3),
  description: z.string().default(''),
  disruption: z.object({
    type: z.enum([
      'road_closure',
      'vehicle_breakdown',
      'warehouse_outage',
      'port_delay',
      'carrier_capacity_reduction',
      'severe_weather',
      'customs_hold',
      'fuel_surge',
    ]),
    title: z.string().min(3),
    description: z.string().default(''),
    facilityId: z.string().optional(),
    vehicleId: z.string().optional(),
    routeCorridor: z.string().optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    durationHours: z.number().min(1).max(168),
    capacityDropPercentage: z.number().min(0).max(100).optional(),
    speedReductionPercentage: z.number().min(0).max(100).optional(),
    affectedShipmentIds: z.array(z.string()).optional(),
  }),
});

export const CreateRecoveryPlanSchema = z.object({
  scenarioId: z.string(),
  strategyCategory: z.enum(['fastest_delivery', 'lowest_cost', 'balanced_resilience']),
  customConstraints: z.record(z.any()).optional(),
});

export const ApproveRecoveryPlanSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  reviewNotes: z.string().optional(),
});

export const AiChatRequestSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ).optional(),
  context: z.object({
    currentPage: z.string().optional(),
    selectedShipmentId: z.string().optional(),
    activeScenarioId: z.string().optional(),
  }).optional(),
});
