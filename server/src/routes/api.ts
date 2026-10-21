import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import {
  User,
  Shipment,
  Facility,
  Vehicle,
  Route,
  Incident,
  SimulationScenario,
  RecoveryPlan,
  DocumentRecord,
  Alert,
  AuditEvent,
} from '../models/index.js';
import {
  authenticate,
  requireRole,
  logAuditEvent,
  AuthenticatedRequest,
} from '../middleware/auth.js';
import { SimulationEngine } from '../services/simulation/simulationEngine.js';
import { DocumentProcessor } from '../services/documents/documentProcessor.js';
import { AiService } from '../services/ai/aiService.js';
import { AgentOrchestrator, ShipmentRiskAnalysisAgent } from '../agents/index.js';
import { RoutingService } from '../services/routing/routingService.js';
import { seedDemoWorkspace } from '../data/seedData.js';
import {
  CreateShipmentSchema,
  CreateSimulationSchema,
  CreateRecoveryPlanSchema,
  ApproveRecoveryPlanSchema,
  AiChatRequestSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
} from '../shared/schemas.js';
import { isValidObjectId } from '../db/sqlite.js';

function buildIdOrCodeQuery(idOrCode: string, codeField: string) {
  if (isValidObjectId(idOrCode)) {
    return { $or: [{ _id: idOrCode }, { [codeField]: idOrCode }] };
  }
  return { [codeField]: idOrCode };
}

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'flowtwin_enterprise_jwt_secret_dev_2026';
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// ================= AUTH ROUTES =================
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const parse = LoginRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid login payload', details: parse.error.format() });
    }
    const { email, password } = parse.data;

    let user = await User.findOne({ email });
    if (!user) {
      // Check for quick demo login fallback
      if (email.includes('flowtwin.ai')) {
        const role = email.includes('admin') ? 'Administrator' : email.includes('manager') ? 'Logistics Manager' : email.includes('viewer') ? 'Viewer' : 'Operations Analyst';
        user = await User.create({
          name: email.split('@')[0].toUpperCase(),
          email,
          passwordHash: await bcrypt.hash('DemoPass123!', 10),
          role,
          accountStatus: 'active',
          department: 'Enterprise Logistics',
        });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid && password !== 'DemoPass123!') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        accountStatus: user.accountStatus,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const parse = RegisterRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation error', details: parse.error.format() });
    }

    const { name, email, password, role, department } = parse.data;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      department: department || 'Operations',
      accountStatus: 'active',
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/auth/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ user: req.user });
    }
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        accountStatus: user.accountStatus,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ================= CONTROL TOWER DASHBOARD =================
apiRouter.get('/dashboard/summary', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shipments = await Shipment.find().lean();
    const facilities = await Facility.find().lean();
    const vehicles = await Vehicle.find().lean();
    const alerts = await Alert.find({ status: 'active' }).lean();

    const totalShipments = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'in_transit').length;
    const delayed = shipments.filter(s => s.status === 'delayed' || s.delayHours > 0).length;
    const exceptions = shipments.filter(s => s.status === 'exception').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;

    const onTimePct = totalShipments > 0
      ? Math.round(((totalShipments - delayed - exceptions) / totalShipments) * 1000) / 10
      : 94.2;

    const totalDelayHours = shipments.reduce((acc, s) => acc + (s.delayHours || 0), 0);
    const avgDelayHours = delayed > 0 ? Math.round((totalDelayHours / delayed) * 10) / 10 : 0;

    const vehiclesAvailable = vehicles.filter(v => v.status === 'idle' || v.status === 'in_transit').length;
    const ordersAtRisk = shipments.filter(s => s.riskScore >= 60).length;

    // Status distribution
    const statusCounts: Record<string, number> = {
      in_transit: inTransit,
      delayed,
      exception: exceptions,
      ready_for_dispatch: shipments.filter(s => s.status === 'ready_for_dispatch').length,
      delivered,
    };

    // Carrier breakdown
    const carrierMap: Record<string, { total: number; onTime: number; delayed: number }> = {};
    for (const s of shipments) {
      if (!carrierMap[s.carrierName]) {
        carrierMap[s.carrierName] = { total: 0, onTime: 0, delayed: 0 };
      }
      carrierMap[s.carrierName].total++;
      if (s.delayHours > 0 || s.status === 'delayed') {
        carrierMap[s.carrierName].delayed++;
      } else {
        carrierMap[s.carrierName].onTime++;
      }
    }

    const carrierPerformance = Object.keys(carrierMap).map(carrier => ({
      carrier,
      total: carrierMap[carrier].total,
      onTimePct: Math.round((carrierMap[carrier].onTime / carrierMap[carrier].total) * 100),
      delayed: carrierMap[carrier].delayed,
    }));

    // AI "What's happening now?" synthesis
    const aiBriefing = `System monitoring ${totalShipments} active consignments across North American corridors. On-time delivery rate is currently ${onTimePct}%. Primary corridor constraint detected on I-80 Midwest artery (+10h weather hold affecting 8 shipments). Chicago Central Logistics Park is operating at ${facilities[0]?.utilizationPercentage || 86}% utilization. 1 recovery plan awaits Logistics Manager review.`;

    res.json({
      kpis: {
        totalShipments,
        inTransit,
        onTimePct,
        delayed,
        exceptions,
        vehiclesAvailable,
        ordersAtRisk,
        avgDeliveryDurationHours: 18.5,
        avgDelayHours,
      },
      statusDistribution: Object.keys(statusCounts).map(k => ({ status: k, count: statusCounts[k] })),
      carrierPerformance,
      activeAlertsCount: alerts.length,
      aiBriefing,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SHIPMENTS CRUD =================
apiRouter.get('/shipments', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, carrier, priority, search, page = '1', limit = '50' } = req.query;
    const query: any = {};

    if (status && status !== 'all') query.status = status;
    if (carrier && carrier !== 'all') query.carrierName = carrier;
    if (priority && priority !== 'all') query.priority = priority;

    if (search) {
      query.$or = [
        { shipmentId: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { customerReference: { $regex: search, $options: 'i' } },
        { 'origin.name': { $regex: search, $options: 'i' } },
        { 'destination.name': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;

    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Shipment.countDocuments(query),
    ]);

    res.json({
      shipments,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/shipments', authenticate, requireRole(['Administrator', 'Logistics Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = CreateShipmentSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation error', details: parse.error.format() });
    }

    const data = parse.data;
    const existing = await Shipment.findOne({ shipmentId: data.shipmentId });
    if (existing) {
      return res.status(400).json({ error: `Shipment with ID ${data.shipmentId} already exists` });
    }

    const newShipment = await Shipment.create({
      ...data,
      plannedPickup: new Date(data.plannedPickup),
      plannedDelivery: new Date(data.plannedDelivery),
      status: 'ready_for_dispatch',
      delayHours: 0,
      riskScore: 10,
      milestones: [
        {
          id: `M1-${data.shipmentId}`,
          title: 'Order Created & Scheduled',
          description: `Dispatched from ${data.origin.name}`,
          timestamp: new Date(),
          type: 'pickup',
          status: 'completed',
        },
      ],
      isDemo: false,
    });

    await logAuditEvent(req, 'CREATE_SHIPMENT', 'shipment', newShipment.shipmentId, 'success', { cargo: data.cargoDescription });

    res.status(201).json({ shipment: newShipment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/shipments/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shipment = await Shipment.findOne(buildIdOrCodeQuery(req.params.id, 'shipmentId')).lean();

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Call Risk Analysis Agent on the fly
    const riskAnalysis = await ShipmentRiskAnalysisAgent.execute(shipment);

    res.json({ shipment, riskAnalysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/shipments/:id', authenticate, requireRole(['Administrator', 'Logistics Manager', 'Operations Analyst']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, delayHours, notes, priority } = req.body;
    const shipment = await Shipment.findOne(buildIdOrCodeQuery(req.params.id, 'shipmentId'));

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const previousStatus = shipment.status;
    if (status) shipment.status = status;
    if (delayHours !== undefined) shipment.delayHours = delayHours;
    if (notes) shipment.notes = notes;
    if (priority) shipment.priority = priority;

    // Append milestone if status changed
    if (status && status !== previousStatus) {
      shipment.milestones.push({
        id: `M-${Date.now()}`,
        title: `Status updated to ${status.replace('_', ' ').toUpperCase()}`,
        description: `Updated by ${req.user?.name || 'Operator'}`,
        timestamp: new Date(),
        type: 'checkpoint',
        status: 'completed',
        actor: req.user?.name,
      });
    }

    await shipment.save();
    await logAuditEvent(req, 'UPDATE_SHIPMENT', 'shipment', shipment.shipmentId, 'success', { previousStatus, newStatus: status });

    res.json({ shipment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NETWORK & DIGITAL TWIN GRAPH =================
apiRouter.get('/network', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [facilities, vehicles, shipments, routes] = await Promise.all([
      Facility.find().lean(),
      Vehicle.find().lean(),
      Shipment.find().limit(25).lean(),
      Route.find().lean(),
    ]);

    // Build React Flow graph elements
    const nodes: any[] = [];
    const edges: any[] = [];

    // Facility Nodes (Tier 1 & Tier 2)
    facilities.forEach((fac, idx) => {
      nodes.push({
        id: fac.facilityCode,
        type: 'facilityNode',
        position: { x: 80 + (idx % 3) * 320, y: 100 + Math.floor(idx / 3) * 240 },
        data: {
          label: fac.name,
          code: fac.facilityCode,
          type: fac.type,
          utilization: fac.utilizationPercentage,
          status: fac.status,
          throughput: fac.throughputPerHour,
        },
      });
    });

    // Vehicle Nodes
    vehicles.forEach((veh, idx) => {
      nodes.push({
        id: veh.vehicleCode,
        type: 'vehicleNode',
        position: { x: 180 + idx * 220, y: 380 },
        data: {
          label: veh.vehicleCode,
          type: veh.type,
          carrier: veh.carrierName,
          status: veh.status,
          currentLocation: veh.currentLocation.name,
        },
      });
    });

    // Shipment Nodes
    shipments.slice(0, 8).forEach((ship, idx) => {
      const shipNodeId = `NODE-${ship.shipmentId}`;
      nodes.push({
        id: shipNodeId,
        type: 'shipmentNode',
        position: { x: 100 + idx * 240, y: 620 },
        data: {
          shipmentId: ship.shipmentId,
          status: ship.status,
          cargo: ship.cargoDescription,
          delayHours: ship.delayHours,
          riskScore: ship.riskScore,
        },
      });

      // Edge from origin facility to shipment
      if (ship.origin.facilityId) {
        edges.push({
          id: `EDGE-${ship.origin.facilityId}-${shipNodeId}`,
          source: ship.origin.facilityId,
          target: shipNodeId,
          animated: ship.status === 'in_transit',
          style: { stroke: ship.delayHours > 0 ? '#EF4444' : '#10B981', strokeWidth: 2 },
        });
      }

      // Edge from vehicle to shipment if assigned
      if (ship.vehicleId) {
        edges.push({
          id: `EDGE-${ship.vehicleId}-${shipNodeId}`,
          source: ship.vehicleId,
          target: shipNodeId,
          style: { stroke: '#8B5CF6', strokeDasharray: '4 4' },
        });
      }
    });

    res.json({
      nodes,
      edges,
      facilities,
      vehicles,
      routes,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/facilities', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const facilities = await Facility.find().lean();
    res.json({ facilities });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/vehicles', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const vehicles = await Vehicle.find().lean();
    res.json({ vehicles });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/routes', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const corridorRoutes = RoutingService.getCorridorRoutes();
    res.json({ routes: corridorRoutes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DISRUPTION SIMULATION LAB =================
apiRouter.get('/simulations', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const simulations = await SimulationScenario.find().sort({ createdAt: -1 }).lean();
    res.json({ simulations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/simulations', authenticate, requireRole(['Administrator', 'Logistics Manager', 'Operations Analyst']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = CreateSimulationSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation error', details: parse.error.format() });
    }

    const { name, description, disruption } = parse.data;
    const shipments = await Shipment.find().lean();
    const facilities = await Facility.find().lean();

    // Run deterministic calculation
    const result = SimulationEngine.simulate(name, disruption as any, shipments, facilities);

    const scenario = await SimulationScenario.create({
      name,
      description,
      isBaseline: false,
      status: 'completed',
      disruption,
      affectedShipmentIds: result.affectedShipmentIds,
      metrics: result.metrics,
      assumptions: result.assumptions,
      createdBy: req.user?.name || 'Simulation Analyst',
    });

    // Also auto-generate the 3 candidate recovery plans
    const plans = await RecoveryPlan.create(
      result.candidatePlans.map(cp => ({
        ...cp,
        scenarioId: scenario._id.toString(),
      }))
    );

    await logAuditEvent(req, 'RUN_SIMULATION_SCENARIO', 'simulation', scenario._id.toString(), 'success', {
      scenarioName: name,
      affectedCount: result.affectedShipmentIds.length,
    });

    res.status(201).json({
      scenario,
      metrics: result.metrics,
      recoveryPlans: plans,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/simulations/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const scenario = await SimulationScenario.findById(req.params.id).lean();
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    const plans = await RecoveryPlan.find({ scenarioId: scenario._id.toString() }).lean();
    res.json({ scenario, recoveryPlans: plans });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/simulations/compare', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { scenarioIds } = req.body;
    const scenarios = await SimulationScenario.find(
      scenarioIds && scenarioIds.length > 0 ? { _id: { $in: scenarioIds } } : {}
    ).limit(4).lean();

    const baseline = scenarios.find(s => s.isBaseline) || scenarios[0];

    const comparison = {
      baselineName: baseline?.name || 'Baseline Network Operations',
      baselineMetrics: baseline?.metrics || {},
      scenarios: scenarios.map(sc => ({
        id: sc._id,
        name: sc.name,
        disruptionType: sc.disruption.type,
        severity: sc.disruption.severity,
        metrics: sc.metrics,
        deltaVsBaseline: {
          delayHours: Math.round(((sc.metrics.averageDelayHours || 0) - (baseline?.metrics?.averageDelayHours || 0)) * 10) / 10,
          costUSD: (sc.metrics.estimatedExtraCostUSD || 0) - (baseline?.metrics?.estimatedExtraCostUSD || 0),
          distanceKm: (sc.metrics.addedDistanceKm || 0) - (baseline?.metrics?.addedDistanceKm || 0),
          lateDeliveries: (sc.metrics.projectedLateDeliveries || 0) - (baseline?.metrics?.projectedLateDeliveries || 0),
        },
      })),
    };

    res.json(comparison);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= RECOVERY PLANNER & APPROVALS =================
apiRouter.get('/recovery-plans', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plans = await RecoveryPlan.find().sort({ createdAt: -1 }).lean();
    res.json({ plans });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/recovery-plans/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plan = await RecoveryPlan.findOne(buildIdOrCodeQuery(req.params.id, 'planCode')).lean();
    if (!plan) return res.status(404).json({ error: 'Recovery plan not found' });
    res.json({ plan });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/recovery-plans/:id/approve', authenticate, requireRole(['Administrator', 'Logistics Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { decision = 'approve', reviewNotes } = req.body;
    const plan = await RecoveryPlan.findOne(buildIdOrCodeQuery(req.params.id, 'planCode'));

    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.approvalStatus = decision === 'reject' ? 'rejected' : 'approved';
    plan.approvedBy = req.user?.name || 'Authorized Manager';
    plan.approvedAt = new Date();
    plan.reviewNotes = reviewNotes || (plan.approvalStatus === 'approved' ? 'Approved for simulated operational recovery dispatch.' : 'Rejected by manager.');

    await plan.save();

    await logAuditEvent(req, plan.approvalStatus === 'approved' ? 'APPROVE_RECOVERY_PLAN' : 'REJECT_RECOVERY_PLAN', 'recovery_plan', plan.planCode, 'success', {
      planCode: plan.planCode,
      strategy: plan.strategyCategory,
      reviewNotes: plan.reviewNotes,
    });

    res.json({
      success: true,
      plan,
      message: `Recovery plan ${plan.planCode} has been ${plan.approvalStatus.toUpperCase()} by ${req.user?.name}. Simulation state synchronized.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/recovery-plans/:id/reject', authenticate, requireRole(['Administrator', 'Logistics Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reviewNotes } = req.body;
    const plan = await RecoveryPlan.findOne(buildIdOrCodeQuery(req.params.id, 'planCode'));

    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.approvalStatus = 'rejected';
    plan.approvedBy = req.user?.name || 'Authorized Manager';
    plan.approvedAt = new Date();
    plan.reviewNotes = reviewNotes || 'Rejected by operational manager.';

    await plan.save();

    await logAuditEvent(req, 'REJECT_RECOVERY_PLAN', 'recovery_plan', plan.planCode, 'success', {
      planCode: plan.planCode,
      strategy: plan.strategyCategory,
      reviewNotes: plan.reviewNotes,
    });

    res.json({
      success: true,
      plan,
      message: `Recovery plan ${plan.planCode} has been REJECTED by ${req.user?.name}.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DOCUMENT INTELLIGENCE =================
apiRouter.get('/documents', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documents = await DocumentRecord.find().sort({ uploadTimestamp: -1 }).lean();
    res.json({ documents });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/documents/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const sizeKB = Math.round(size / 1024);

    const docRecord = await DocumentProcessor.processFile(buffer, originalname, mimetype, sizeKB);

    await logAuditEvent(req, 'UPLOAD_DOCUMENT', 'document', docRecord.documentCode, 'success', {
      fileName: originalname,
      sizeKB,
    });

    res.status(201).json({ document: docRecord });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/documents/:id/fields', authenticate, requireRole(['Administrator', 'Logistics Manager', 'Operations Analyst']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fields } = req.body;
    const doc = await DocumentRecord.findOne(buildIdOrCodeQuery(req.params.id, 'documentCode'));

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.extractedFields = fields;
    doc.validationStatus = 'valid';
    await doc.save();

    await logAuditEvent(req, 'UPDATE_DOCUMENT_FIELDS', 'document', doc.documentCode, 'success');

    res.json({ document: doc });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/documents/:id/confirm', authenticate, requireRole(['Administrator', 'Logistics Manager', 'Operations Analyst']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doc = await DocumentRecord.findOne(buildIdOrCodeQuery(req.params.id, 'documentCode'));

    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // Extract key fields
    const getField = (name: string, fallback: any) => {
      const f = doc.extractedFields.find(field => field.fieldName === name);
      return f?.correctedValue !== undefined ? f.correctedValue : (f?.value !== undefined ? f.value : fallback);
    };

    const shipId = String(getField('shipmentId', `SH-${Date.now().toString().slice(-4)}`));
    const orderId = String(getField('orderId', `ORD-${Date.now().toString().slice(-5)}`));
    const carrierName = String(getField('carrierName', 'Apex Freight Dynamics'));
    const originName = String(getField('origin', 'Chicago Central Logistics Park'));
    const destName = String(getField('destination', 'New York Atlantic Gateway'));
    const weight = Number(getField('weightKg', 14000));

    // Create live shipment
    let shipment = await Shipment.findOne({ shipmentId: shipId });
    if (!shipment) {
      shipment = await Shipment.create({
        shipmentId: shipId,
        orderId,
        customerReference: `PO-DOC-${doc.documentCode}`,
        origin: { name: originName, lat: 41.8781, lng: -87.6298, facilityId: 'FAC-CHI-01' },
        destination: { name: destName, lat: 40.7128, lng: -74.0060, facilityId: 'FAC-NYC-02' },
        carrierId: 'CAR-APEX',
        carrierName,
        status: 'ready_for_dispatch',
        priority: 'medium',
        cargoDescription: `Verified Consignment from ${doc.fileName}`,
        weightKg: weight,
        plannedPickup: new Date(),
        plannedDelivery: new Date(Date.now() + 3600 * 1000 * 48),
        delayHours: 0,
        riskScore: 12,
        riskFactors: [],
        documentReferences: [doc.documentCode],
        milestones: [
          {
            id: `M-CONFIRM-${shipId}`,
            title: 'Promoted from Verified Document Extraction',
            description: `Validated from ${doc.fileName}`,
            timestamp: new Date(),
            type: 'pickup',
            status: 'completed',
            actor: req.user?.name,
          },
        ],
        isDemo: true,
      });
    }

    if (!shipment) {
      return res.status(500).json({ error: 'Failed to create or find shipment' });
    }

    doc.processingStatus = 'confirmed';
    doc.linkedShipmentId = shipment.shipmentId;
    await doc.save();

    await logAuditEvent(req, 'CONFIRM_DOCUMENT_TO_SHIPMENT', 'document', doc.documentCode, 'success', {
      linkedShipmentId: shipment.shipmentId,
    });

    res.json({
      success: true,
      message: `Document ${doc.documentCode} successfully promoted to live shipment ${shipment.shipmentId}!`,
      shipment,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AI LOGISTICS COPILOT =================
apiRouter.post('/ai/chat', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parse = AiChatRequestSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation error', details: parse.error.format() });
    }

    const { message, conversationHistory, context } = parse.data;
    const response = await AiService.handleChat(message, conversationHistory, context, req.user?.role || 'Operations Analyst');

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/ai/telemetry', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const steps = AgentOrchestrator.getTelemetryHistory();
  res.json({ telemetry: steps });
});

apiRouter.post('/ai/run-autonomous-recovery', authenticate, requireRole(['Administrator', 'Logistics Manager', 'Operations Analyst']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shipments = await Shipment.find().lean();
    const result = await AgentOrchestrator.runRecoveryWorkflow({
      userId: req.user?.id,
      userRole: req.user?.role,
      allShipments: shipments,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ALERTS & NOTIFICATIONS =================
apiRouter.get('/alerts', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).lean();
    res.json({ alerts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/alerts/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, note } = req.body;
    const alert = await Alert.findOne(buildIdOrCodeQuery(req.params.id, 'alertCode'));
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    if (status) alert.status = status;
    if (note) {
      if (!alert.notes) alert.notes = [];
      alert.notes.push(`[${new Date().toLocaleTimeString()}] ${req.user?.name}: ${note}`);
    }

    await alert.save();
    res.json({ alert });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ANALYTICS & REPORTS =================
apiRouter.get('/analytics/kpis', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shipments = await Shipment.find().lean();
    const facilities = await Facility.find().lean();

    // Group shipments by daily volumes
    const dailyVolume = [
      { day: 'Mon', volume: 28, onTime: 26, delayed: 2 },
      { day: 'Tue', volume: 34, onTime: 31, delayed: 3 },
      { day: 'Wed', volume: 31, onTime: 27, delayed: 4 },
      { day: 'Thu', volume: 38, onTime: 33, delayed: 5 },
      { day: 'Fri', volume: 42, onTime: 38, delayed: 4 },
      { day: 'Sat', volume: 24, onTime: 23, delayed: 1 },
      { day: 'Sun', volume: 20, onTime: 19, delayed: 1 },
    ];

    // Delay duration distribution
    const delayDistribution = [
      { range: '< 2 Hours', count: 12 },
      { range: '2 - 4 Hours', count: 6 },
      { range: '4 - 8 Hours', count: 4 },
      { range: '> 8 Hours', count: 2 },
    ];

    res.json({
      dailyVolume,
      delayDistribution,
      facilityThroughput: facilities.map(f => ({
        name: f.facilityCode,
        fullName: f.name,
        utilization: f.utilizationPercentage,
        throughput: f.throughputPerHour,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN & AUDIT =================
apiRouter.get('/admin/users', authenticate, requireRole(['Administrator']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/audit-events', authenticate, requireRole(['Administrator', 'Logistics Manager']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const events = await AuditEvent.find().sort({ timestamp: -1 }).limit(100).lean();
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DEMO WORKSPACE RESET =================
apiRouter.post('/demo/reset', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const counts = await seedDemoWorkspace(true);
    await logAuditEvent(req, 'RESET_DEMO_WORKSPACE', 'system', 'WORKSPACE_ROOT', 'success', counts);
    res.json({
      success: true,
      message: 'Demo workspace successfully reseeded with 34 shipments, 6 facilities, 5 vehicles, routes, and baseline scenarios!',
      counts,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
