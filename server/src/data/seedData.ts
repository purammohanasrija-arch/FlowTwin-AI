import bcrypt from 'bcryptjs';
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
import { RoutingService } from '../services/routing/routingService.js';
import { SimulationEngine } from '../services/simulation/simulationEngine.js';

export async function seedDemoWorkspace(forceReset: boolean = true) {
  if (forceReset) {
    await Promise.all([
      User.deleteMany({}),
      Shipment.deleteMany({}),
      Facility.deleteMany({}),
      Vehicle.deleteMany({}),
      Route.deleteMany({}),
      Incident.deleteMany({}),
      SimulationScenario.deleteMany({}),
      RecoveryPlan.deleteMany({}),
      DocumentRecord.deleteMany({}),
      Alert.deleteMany({}),
      AuditEvent.deleteMany({}),
    ]);
  }

  // 1. Users
  const passwordHash = await bcrypt.hash('DemoPass123!', 10);
  const users = await User.create([
    {
      name: 'Elena Rostova',
      email: 'admin@flowtwin.ai',
      passwordHash,
      role: 'Administrator',
      accountStatus: 'active',
      department: 'Logistics Operations Command',
    },
    {
      name: 'Marcus Vance',
      email: 'manager@flowtwin.ai',
      passwordHash,
      role: 'Logistics Manager',
      accountStatus: 'active',
      department: 'Supply Chain Resiliency',
    },
    {
      name: 'Sarah Chen',
      email: 'analyst@flowtwin.ai',
      passwordHash,
      role: 'Operations Analyst',
      accountStatus: 'active',
      department: 'Simulation & Modeling Lab',
    },
    {
      name: 'David Kalu',
      email: 'viewer@flowtwin.ai',
      passwordHash,
      role: 'Viewer',
      accountStatus: 'active',
      department: 'Executive Governance',
    },
  ]);

  // 2. Facilities
  const facilities = await Facility.create([
    {
      facilityCode: 'FAC-CHI-01',
      name: 'Chicago Central Logistics Park',
      type: 'warehouse',
      location: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, address: '4400 S Pulaski Rd, Chicago, IL' },
      totalCapacityUnits: 50000,
      currentUtilizationUnits: 43200,
      utilizationPercentage: 86.4,
      status: 'congested',
      throughputPerHour: 320,
      activeShipmentCount: 14,
      operatingHours: '24/7',
    },
    {
      facilityCode: 'FAC-NYC-02',
      name: 'New York Atlantic Gateway',
      type: 'distribution_center',
      location: { name: 'New York, NY', lat: 40.7128, lng: -74.0060, address: '100 Port St, Newark, NJ' },
      totalCapacityUnits: 65000,
      currentUtilizationUnits: 44200,
      utilizationPercentage: 68.0,
      status: 'optimal',
      throughputPerHour: 450,
      activeShipmentCount: 18,
      operatingHours: '24/7',
    },
    {
      facilityCode: 'FAC-LAX-03',
      name: 'Pacific Intermodal Hub',
      type: 'port',
      location: { name: 'Long Beach, CA', lat: 33.7701, lng: -118.1937, address: 'Pier G, Long Beach, CA' },
      totalCapacityUnits: 120000,
      currentUtilizationUnits: 98400,
      utilizationPercentage: 82.0,
      status: 'optimal',
      throughputPerHour: 750,
      activeShipmentCount: 22,
      operatingHours: '24/7',
    },
    {
      facilityCode: 'FAC-DAL-04',
      name: 'Lone Star Inland Depot',
      type: 'cross_dock',
      location: { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, address: '2200 E Interstate 30, Dallas, TX' },
      totalCapacityUnits: 40000,
      currentUtilizationUnits: 25600,
      utilizationPercentage: 64.0,
      status: 'optimal',
      throughputPerHour: 280,
      activeShipmentCount: 9,
      operatingHours: '24/7',
    },
    {
      facilityCode: 'FAC-ATL-05',
      name: 'Peach State Distribution Cross-Dock',
      type: 'distribution_center',
      location: { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, address: '3000 Fulton Industrial Blvd, Atlanta, GA' },
      totalCapacityUnits: 48000,
      currentUtilizationUnits: 36000,
      utilizationPercentage: 75.0,
      status: 'optimal',
      throughputPerHour: 310,
      activeShipmentCount: 11,
      operatingHours: '24/7',
    },
    {
      facilityCode: 'FAC-SEA-06',
      name: 'Puget Sound Maritime Terminal',
      type: 'port',
      location: { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, address: 'Terminal 18, Harbor Island, Seattle, WA' },
      totalCapacityUnits: 80000,
      currentUtilizationUnits: 57600,
      utilizationPercentage: 72.0,
      status: 'optimal',
      throughputPerHour: 520,
      activeShipmentCount: 12,
      operatingHours: '24/7',
    },
  ]);

  // 3. Vehicles
  const vehicles = await Vehicle.create([
    {
      vehicleCode: 'TRK-101',
      type: 'dry_van',
      licensePlate: 'IL-9921-CV',
      carrierId: 'CAR-APEX',
      carrierName: 'Apex Freight Dynamics',
      maxWeightKg: 20000,
      currentWeightKg: 14500,
      status: 'in_transit',
      currentLocation: { name: 'I-80 Mile 142 (Toledo, OH)', lat: 41.6528, lng: -83.5379 },
      heading: 95,
      speedKmh: 88,
      assignedShipmentIds: ['SH-1042'],
    },
    {
      vehicleCode: 'TRK-204',
      type: 'reefer',
      licensePlate: 'OH-4412-RF',
      carrierId: 'CAR-TITAN',
      carrierName: 'Titan Intermodal Logistics',
      maxWeightKg: 18000,
      currentWeightKg: 16200,
      status: 'in_transit',
      currentLocation: { name: 'I-80 Mile 88 (South Bend, IN)', lat: 41.6764, lng: -86.2520 },
      heading: 90,
      speedKmh: 45, // slowed by weather
      assignedShipmentIds: ['SH-1043'],
    },
    {
      vehicleCode: 'TRK-308',
      type: 'dry_van',
      licensePlate: 'PA-8823-TX',
      carrierId: 'CAR-APEX',
      carrierName: 'Apex Freight Dynamics',
      maxWeightKg: 22000,
      currentWeightKg: 19400,
      status: 'breakdown',
      currentLocation: { name: 'I-80 Mile 210 (Youngstown, OH)', lat: 41.0998, lng: -80.6495 },
      heading: 92,
      speedKmh: 0,
      assignedShipmentIds: ['SH-1044'],
    },
    {
      vehicleCode: 'TRK-412',
      type: 'reefer',
      licensePlate: 'CA-7719-XP',
      carrierId: 'CAR-NEXUS',
      carrierName: 'Nexus Global Haulers',
      maxWeightKg: 20000,
      currentWeightKg: 12000,
      status: 'in_transit',
      currentLocation: { name: 'I-10 Near Tucson, AZ', lat: 32.2226, lng: -110.9747 },
      heading: 105,
      speedKmh: 92,
      assignedShipmentIds: ['SH-1051'],
    },
    {
      vehicleCode: 'TRK-519',
      type: 'container_carrier',
      licensePlate: 'WA-3390-PL',
      carrierId: 'CAR-BLUE',
      carrierName: 'BlueSky Logistics Corp',
      maxWeightKg: 24000,
      currentWeightKg: 21500,
      status: 'in_transit',
      currentLocation: { name: 'I-90 Near Billings, MT', lat: 45.7833, lng: -108.5007 },
      heading: 110,
      speedKmh: 85,
      assignedShipmentIds: ['SH-1060'],
    },
  ]);

  // 4. Routes
  const corridorRoutes = RoutingService.getCorridorRoutes();
  const routes = await Route.create(
    corridorRoutes.map(cr => ({
      routeCode: cr.routeCode,
      name: cr.name,
      origin: { name: 'Origin Terminal', lat: cr.coordinates[0][0], lng: cr.coordinates[0][1] },
      destination: { name: 'Destination Terminal', lat: cr.coordinates[cr.coordinates.length - 1][0], lng: cr.coordinates[cr.coordinates.length - 1][1] },
      distanceKm: cr.distanceKm,
      estimatedDurationHours: cr.durationHours,
      waypoints: cr.coordinates.map((c, idx) => ({ name: `Waypoint ${idx + 1}`, lat: c[0], lng: c[1], sequence: idx + 1 })),
      routeType: cr.routeType,
      roadCorridor: cr.roadCorridor,
      isClosed: cr.isClosed || false,
    }))
  );

  // 5. Generate 34 Realistic Shipments across US Corridors
  const cityPairs = [
    { origin: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, facilityId: 'FAC-CHI-01' }, destination: { name: 'New York, NY', lat: 40.7128, lng: -74.0060, facilityId: 'FAC-NYC-02' }, routeCorridor: 'I-80' },
    { origin: { name: 'Long Beach, CA', lat: 33.7701, lng: -118.1937, facilityId: 'FAC-LAX-03' }, destination: { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, facilityId: 'FAC-DAL-04' }, routeCorridor: 'I-10' },
    { origin: { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, facilityId: 'FAC-SEA-06' }, destination: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, facilityId: 'FAC-CHI-01' }, routeCorridor: 'I-90' },
    { origin: { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, facilityId: 'FAC-ATL-05' }, destination: { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 }, routeCorridor: 'I-75' },
    { origin: { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, facilityId: 'FAC-DAL-04' }, destination: { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880, facilityId: 'FAC-ATL-05' }, routeCorridor: 'I-20' },
  ];

  const cargoTypes = [
    { desc: 'Industrial Automation Sensors & PLCs', temp: false, weight: 12400 },
    { desc: 'Cold-Chain Pharmaceutical Vaccines', temp: true, weight: 6800 },
    { desc: 'EV Lithium Battery Packs (UN 3480)', temp: false, weight: 18900 },
    { desc: 'Aerospace Composite Panels', temp: false, weight: 8200 },
    { desc: 'Specialty Semiconductor Wafers', temp: true, weight: 4500 },
    { desc: 'Commercial HVAC Compressors', temp: false, weight: 16400 },
    { desc: 'Retail Consumer Electronics', temp: false, weight: 14200 },
  ];

  const carriers = [
    { id: 'CAR-APEX', name: 'Apex Freight Dynamics' },
    { id: 'CAR-TITAN', name: 'Titan Intermodal Logistics' },
    { id: 'CAR-NEXUS', name: 'Nexus Global Haulers' },
    { id: 'CAR-BLUE', name: 'BlueSky Logistics Corp' },
  ];

  const shipmentsData: any[] = [];
  const baseTime = Date.now();

  for (let i = 1; i <= 34; i++) {
    const pair = cityPairs[(i - 1) % cityPairs.length];
    const cargo = cargoTypes[(i - 1) % cargoTypes.length];
    const carrier = carriers[(i - 1) % carriers.length];
    const shipId = `SH-${1040 + i}`;

    // Create realistic statuses: some in_transit, some delayed, some delivered, 2 exceptions
    let status: 'in_transit' | 'delayed' | 'ready_for_dispatch' | 'exception' | 'delivered' = 'in_transit';
    let delayHours = 0;
    let riskScore = 15;
    const riskFactors: string[] = [];

    if (i === 1) { // SH-1041: Healthy benchmark
      status = 'in_transit';
      riskScore = 12;
    } else if (i === 2) { // SH-1042: Key scenario shipment
      status = 'delayed';
      delayHours = 4.2;
      riskScore = 78;
      riskFactors.push('I-80 weather advisory & road slowdown');
      riskFactors.push('Cross-dock connection window tightened to 20 minutes');
    } else if (i === 3) { // SH-1043: Cold-chain delay
      status = 'delayed';
      delayHours = 6.0;
      riskScore = 88;
      riskFactors.push('Refrigeration unit operating on auxiliary generator');
      riskFactors.push('Severe delay on westbound lane');
    } else if (i === 4) { // SH-1044: Mechanical exception
      status = 'exception';
      delayHours = 8.5;
      riskScore = 95;
      riskFactors.push('Tractor mechanical breakdown at Youngstown, OH');
      riskFactors.push('Immediate driver rescue required');
    } else if (i % 6 === 0) {
      status = 'delayed';
      delayHours = Math.round((2.5 + (i * 0.4)) * 10) / 10;
      riskScore = 65;
      riskFactors.push('Yard dwell time exceeded standard 90-minute SLA');
    } else if (i % 8 === 0) {
      status = 'ready_for_dispatch';
      riskScore = 20;
    } else if (i > 30) {
      status = 'delivered';
      riskScore = 5;
    }

    const pickupDate = new Date(baseTime - (3600 * 1000 * (12 + (i * 2))));
    const deliveryDate = new Date(baseTime + (3600 * 1000 * (18 + (i * 2))));

    // Calculate synthetic current position along route
    const currentLoc = {
      name: `Transit Segment near ${pair.origin.name.split(',')[0]}`,
      lat: (pair.origin.lat + pair.destination.lat) / 2 + ((i % 5 - 2) * 0.3),
      lng: (pair.origin.lng + pair.destination.lng) / 2 + ((i % 5 - 2) * 0.4),
    };

    shipmentsData.push({
      shipmentId: shipId,
      orderId: `ORD-${88000 + i}`,
      customerReference: `PO-REF-${5500 + i}`,
      origin: pair.origin,
      destination: pair.destination,
      currentLocation: currentLoc,
      carrierId: carrier.id,
      carrierName: carrier.name,
      vehicleId: i <= 5 ? vehicles[i - 1]?.vehicleCode : `TRK-${600 + i}`,
      status,
      priority: (i === 2 || i === 3 || i === 4) ? 'critical' : (i % 4 === 0) ? 'high' : 'medium',
      cargoDescription: cargo.desc,
      weightKg: cargo.weight,
      volumeM3: Math.round(cargo.weight / 350),
      temperatureControlled: cargo.temp,
      plannedPickup: pickupDate,
      plannedDelivery: deliveryDate,
      actualPickup: pickupDate,
      delayHours,
      riskScore,
      riskFactors,
      routeId: pair.routeCorridor,
      documentReferences: [`DOC-BOL-${9000 + i}`],
      milestones: [
        {
          id: `M1-${shipId}`,
          title: 'Freight Accepted & Tendered',
          description: `Tendered at ${pair.origin.name}`,
          location: pair.origin,
          timestamp: pickupDate,
          type: 'pickup',
          status: 'completed',
          actor: carrier.name,
        },
        {
          id: `M2-${shipId}`,
          title: 'Departed Origin Hub',
          description: `Dispatched on line-haul ${pair.routeCorridor}`,
          timestamp: new Date(pickupDate.getTime() + 3600 * 1000 * 2),
          type: 'checkpoint',
          status: 'completed',
        },
        {
          id: `M3-${shipId}`,
          title: delayHours > 0 ? 'Corridor Delay Encountered' : 'En Route Telemetry Ping',
          description: delayHours > 0 ? `Transit throttled by ${delayHours} hours due to corridor incident` : 'On-schedule GPS waypoint clear',
          timestamp: new Date(baseTime - 3600 * 1000 * 1),
          type: delayHours > 0 ? 'delay' : 'checkpoint',
          status: delayHours > 0 ? 'alert' : 'current',
        },
        {
          id: `M4-${shipId}`,
          title: 'Destination Hub Inbound Gate',
          description: `Scheduled cross-dock at ${pair.destination.name}`,
          location: pair.destination,
          timestamp: deliveryDate,
          type: 'delivery',
          status: 'pending',
        },
      ],
      assignedFacilityId: pair.origin.facilityId,
      notes: `Corridor: ${pair.routeCorridor}. Synthetic enterprise demonstration data.`,
      isDemo: true,
    });
  }

  const shipments = await Shipment.create(shipmentsData);

  // 6. Primary Disruption Scenario: I-80 Midwest Road Closure
  const baselineSimulation = SimulationEngine.simulate(
    'I-80 Corridor Severe Blizzard & Road Closure',
    {
      type: 'road_closure',
      title: 'I-80 Midwest Corridor Blizzard Closure',
      description: 'Major weather event closing I-80 commercial lanes between Gary, IN and Toledo, OH for 10 hours.',
      routeCorridor: 'I-80',
      severity: 'critical',
      durationHours: 10,
    },
    shipmentsData,
    facilities
  );

  const scenario = await SimulationScenario.create({
    name: 'I-80 Corridor Severe Blizzard & Road Closure',
    description: 'Major weather event closing I-80 commercial lanes between Gary, IN and Toledo, OH for 10 hours.',
    isBaseline: true,
    status: 'completed',
    disruption: {
      type: 'road_closure',
      title: 'I-80 Midwest Corridor Blizzard Closure',
      description: 'Commercial arterial closure affecting heavy freight.',
      routeCorridor: 'I-80',
      severity: 'critical',
      durationHours: 10,
      affectedShipmentIds: baselineSimulation.affectedShipmentIds,
    },
    affectedShipmentIds: baselineSimulation.affectedShipmentIds,
    metrics: baselineSimulation.metrics,
    assumptions: baselineSimulation.assumptions,
    createdBy: 'System Simulation Seeder',
  });

  // 7. Seed Candidate Recovery Plans for this scenario
  const recoveryPlans = await RecoveryPlan.create(
    baselineSimulation.candidatePlans.map(cp => ({
      ...cp,
      scenarioId: scenario._id.toString(),
    }))
  );

  // 8. Documents (Bills of Lading, Invoice, Delivery Order)
  const documents = await DocumentRecord.create([
    {
      documentCode: 'DOC-90412',
      fileName: 'Apex_BillOfLading_SH-1042.pdf',
      fileType: 'pdf',
      fileSizeKB: 284,
      uploadTimestamp: new Date(baseTime - 3600 * 1000 * 8),
      documentCategory: 'bill_of_lading',
      processingStatus: 'confirmed',
      extractedFields: [
        { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1042', confidenceScore: 0.99, sourceSnippet: 'BOL Number: SH-1042', isValidated: true },
        { fieldName: 'orderId', label: 'Order Number', value: 'ORD-88002', confidenceScore: 0.97, sourceSnippet: 'PO REF: ORD-88002', isValidated: true },
        { fieldName: 'origin', label: 'Origin Facility', value: 'Chicago Central Logistics Park', confidenceScore: 0.95, sourceSnippet: 'Shipper: Chicago Central Logistics Park', isValidated: true },
        { fieldName: 'destination', label: 'Destination Facility', value: 'New York Atlantic Gateway', confidenceScore: 0.96, sourceSnippet: 'Consignee: New York Atlantic Gateway', isValidated: true },
        { fieldName: 'weightKg', label: 'Gross Weight', value: 12400, confidenceScore: 0.94, sourceSnippet: 'Weight: 12,400 KG', isValidated: true },
        { fieldName: 'carrierName', label: 'Carrier', value: 'Apex Freight Dynamics', confidenceScore: 0.98, sourceSnippet: 'Carrier: Apex Freight Dynamics', isValidated: true },
      ],
      validationStatus: 'valid',
      linkedShipmentId: 'SH-1042',
      rawTextPreview: 'APEX FREIGHT DYNAMICS - MASTER BILL OF LADING\nBOL: SH-1042 | Date: 2026-10-20\nShipper: Chicago Central Logistics Park, 4400 S Pulaski Rd, Chicago IL\nConsignee: New York Atlantic Gateway, 100 Port St, Newark NJ\nCommodity: Industrial Automation Sensors & PLCs\nTotal Weight: 12,400 kg | Handling: Standard Dry Van\nSeal: SEC-99410 | Driver: J. Henderson (CDL Class A)',
      notes: 'Verified against active shipment SH-1042 record.',
    },
    {
      documentCode: 'DOC-90413',
      fileName: 'Titan_CommercialInvoice_INV-882.pdf',
      fileType: 'pdf',
      fileSizeKB: 195,
      uploadTimestamp: new Date(baseTime - 3600 * 1000 * 5),
      documentCategory: 'commercial_invoice',
      processingStatus: 'flagged_discrepancy',
      extractedFields: [
        { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1043', confidenceScore: 0.94, sourceSnippet: 'Shipment: SH-1043', isValidated: true },
        { fieldName: 'orderId', label: 'Order Number', value: 'ORD-88003', confidenceScore: 0.91, sourceSnippet: 'Order: ORD-88003', isValidated: true },
        { fieldName: 'weightKg', label: 'Gross Weight', value: 7200, confidenceScore: 0.76, sourceSnippet: 'Total wt: 7,200 kg (Manifest shows 6,800 kg)', isValidated: false, correctedValue: 6800 },
        { fieldName: 'carrierName', label: 'Carrier', value: 'Titan Intermodal Logistics', confidenceScore: 0.95, sourceSnippet: 'Carrier: Titan', isValidated: true },
      ],
      validationStatus: 'inconsistent_dates',
      conflictingFields: ['weightKg'],
      linkedShipmentId: 'SH-1043',
      rawTextPreview: 'TITAN INTERMODAL - COMMERCIAL INVOICE\nInvoice #: INV-882 | Ref: ORD-88003\nConsignment: SH-1043 | Cold-Chain Vaccines\nNote: Weight discrepancy of 400kg detected between packaging manifest and gross tare weight.',
      notes: 'Requires manual weight confirmation from dock inspector.',
    },
    {
      documentCode: 'DOC-90414',
      fileName: 'Pending_Delivery_Order_ORD-9104.csv',
      fileType: 'csv',
      fileSizeKB: 42,
      uploadTimestamp: new Date(baseTime - 3600 * 1000 * 2),
      documentCategory: 'delivery_order',
      processingStatus: 'extracted',
      extractedFields: [
        { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1090', confidenceScore: 0.88, sourceSnippet: 'CSV line 2: SH-1090', isValidated: true },
        { fieldName: 'origin', label: 'Origin', value: 'Dallas Inland Depot', confidenceScore: 0.89, sourceSnippet: 'DAL-04', isValidated: true },
        { fieldName: 'destination', label: 'Destination', value: 'Atlanta Distribution Cross-Dock', confidenceScore: 0.91, sourceSnippet: 'ATL-05', isValidated: true },
        { fieldName: 'weightKg', label: 'Weight', value: 16500, confidenceScore: 0.95, sourceSnippet: '16500', isValidated: true },
      ],
      validationStatus: 'valid',
      rawTextPreview: 'ShipmentID,OrderID,Origin,Destination,Weight,Carrier\nSH-1090,ORD-9104,FAC-DAL-04,FAC-ATL-05,16500,Nexus Global Haulers',
      notes: 'New draft shipment ready to be promoted to live dispatch.',
    },
  ]);

  // 9. Operational Alerts
  const alerts = await Alert.create([
    {
      alertCode: 'ALT-101',
      type: 'route_disruption',
      severity: 'critical',
      title: 'I-80 Commercial Lane Closure Alert',
      message: 'Winter blizzard warning has forced commercial truck holds on I-80 westbound between Gary, IN and Toledo, OH. Estimated delay +10.0 hours.',
      linkedEntityId: 'I-80',
      linkedEntityType: 'scenario',
      status: 'active',
      assignedTo: 'Marcus Vance',
      timestamp: new Date(baseTime - 3600 * 1000 * 2),
    },
    {
      alertCode: 'ALT-102',
      type: 'critical_delay',
      severity: 'critical',
      title: 'Tractor Mechanical Breakdown on SH-1044',
      message: 'Vehicle TRK-308 experienced turbocharger failure at Youngstown, OH. Consignment delayed by 8.5 hours. Rescue wrecker required.',
      linkedEntityId: 'SH-1044',
      linkedEntityType: 'shipment',
      status: 'active',
      assignedTo: 'Marcus Vance',
      timestamp: new Date(baseTime - 3600 * 1000 * 3),
    },
    {
      alertCode: 'ALT-103',
      type: 'capacity_conflict',
      severity: 'warning',
      title: 'Chicago Central Logistics Park Nearing Capacity',
      message: 'Facility utilization reached 86.4%. Inbound freight pacing advisory active to prevent yard gridlock.',
      linkedEntityId: 'FAC-CHI-01',
      linkedEntityType: 'facility',
      status: 'active',
      assignedTo: 'Sarah Chen',
      timestamp: new Date(baseTime - 3600 * 1000 * 4),
    },
    {
      alertCode: 'ALT-104',
      type: 'recovery_plan_pending',
      severity: 'warning',
      title: 'Recovery Plan Alpha Awaiting Manager Approval',
      message: 'Disruption simulation generated Plan Gamma (Balanced Resilience) with 6 recovered on-time deliveries. Signoff pending.',
      linkedEntityId: recoveryPlans[0]?._id?.toString(),
      linkedEntityType: 'recovery_plan',
      status: 'active',
      assignedTo: 'Marcus Vance',
      timestamp: new Date(baseTime - 3600 * 1000 * 1),
    },
  ]);

  // 10. Audit Events
  await AuditEvent.create([
    {
      actorId: users[0]._id.toString(),
      actorName: 'Elena Rostova',
      actorRole: 'Administrator',
      action: 'BOOTSTRAP_WORKSPACE',
      entityType: 'system',
      entityId: 'SYSTEM-ROOT',
      outcome: 'success',
      details: { message: 'Initialized FlowTwin AI synthetic enterprise dataset with 34 shipments, 6 facilities, and 5 corridors.' },
      timestamp: new Date(baseTime - 3600 * 1000 * 12),
    },
    {
      actorId: users[1]._id.toString(),
      actorName: 'Marcus Vance',
      actorRole: 'Logistics Manager',
      action: 'DISRUPTION_SIMULATION_EXECUTED',
      entityType: 'simulation',
      entityId: scenario._id.toString(),
      outcome: 'success',
      details: { scenarioName: scenario.name, affectedShipmentsCount: baselineSimulation.affectedShipmentIds.length },
      timestamp: new Date(baseTime - 3600 * 1000 * 2),
    },
  ]);

  console.log(`[FlowTwin AI Seeder] Successfully populated ${shipments.length} shipments, ${facilities.length} facilities, ${vehicles.length} vehicles, ${documents.length} documents, ${alerts.length} alerts!`);

  return {
    usersCount: users.length,
    shipmentsCount: shipments.length,
    facilitiesCount: facilities.length,
    vehiclesCount: vehicles.length,
    documentsCount: documents.length,
    alertsCount: alerts.length,
  };
}
