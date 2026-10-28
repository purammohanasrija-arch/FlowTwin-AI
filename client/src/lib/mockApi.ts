// Autonomous Client-Side Offline / Fallback Store for FlowTwin AI
// Provides instant high-fidelity responses if the backend is waking up, sleeping, or unconfigured

export const MOCK_SUMMARY = {
  kpis: {
    totalShipments: 34,
    inTransit: 18,
    onTimePct: 94.2,
    delayed: 5,
    exceptions: 2,
    vehiclesAvailable: 5,
    ordersAtRisk: 4,
    avgDeliveryDurationHours: 18.5,
    avgDelayHours: 3.8,
  },
  statusDistribution: [
    { status: 'in_transit', count: 18 },
    { status: 'delayed', count: 5 },
    { status: 'ready_for_dispatch', count: 7 },
    { status: 'exception', count: 2 },
    { status: 'delivered', count: 2 },
  ],
  carrierPerformance: [
    { carrier: 'Apex Freight Dynamics', total: 14, onTimePct: 92, delayed: 2 },
    { carrier: 'Titan Intermodal Logistics', total: 10, onTimePct: 90, delayed: 1 },
    { carrier: 'Nexus Global Haulers', total: 6, onTimePct: 100, delayed: 0 },
    { carrier: 'BlueSky Logistics Corp', total: 4, onTimePct: 75, delayed: 2 },
  ],
  activeAlertsCount: 4,
  aiBriefing: 'System monitoring 34 active consignments across North American corridors. On-time delivery rate is currently 94.2%. Primary corridor constraint detected on I-80 Midwest artery (+10h weather hold affecting 8 shipments). Chicago Central Logistics Park is operating at 86.4% utilization. 1 recovery plan awaits Logistics Manager review.',
};

export const MOCK_KPIS = {
  dailyVolume: [
    { day: 'Mon', volume: 28, onTime: 26, delayed: 2 },
    { day: 'Tue', volume: 34, onTime: 31, delayed: 3 },
    { day: 'Wed', volume: 31, onTime: 27, delayed: 4 },
    { day: 'Thu', volume: 38, onTime: 33, delayed: 5 },
    { day: 'Fri', volume: 42, onTime: 38, delayed: 4 },
    { day: 'Sat', volume: 24, onTime: 23, delayed: 1 },
    { day: 'Sun', volume: 20, onTime: 19, delayed: 1 },
  ],
  delayDistribution: [
    { range: '< 2 Hours', count: 12 },
    { range: '2 - 4 Hours', count: 6 },
    { range: '4 - 8 Hours', count: 4 },
    { range: '> 8 Hours', count: 2 },
  ],
  facilityThroughput: [
    { name: 'FAC-CHI-01', fullName: 'Stage 6: Conching & Refining Plant', utilization: 86.4, throughput: 320 },
    { name: 'FAC-NYC-02', fullName: 'Stage 10: Packaging & Cold Vault', utilization: 68.0, throughput: 450 },
    { name: 'FAC-LAX-03', fullName: 'Stage 1: Raw Bean Silos & Harbor', utilization: 82.0, throughput: 750 },
    { name: 'FAC-DAL-04', fullName: 'Stage 2: Thermal Drum Roasting Plant', utilization: 64.0, throughput: 280 },
    { name: 'FAC-ATL-05', fullName: 'Stage 7: Continuous Tempering Plant', utilization: 75.0, throughput: 310 },
    { name: 'FAC-SEA-06', fullName: 'Stage 3: Winnowing & Nib Separation', utilization: 72.0, throughput: 520 },
  ],
};

export const MOCK_FACILITIES = [
  {
    _id: 'fac-1',
    facilityCode: 'FAC-CHI-01',
    name: 'Stage 6: Conching & Refining Plant',
    chocolateFacilityName: 'Stage 6: Conching & Refining Plant',
    processStageName: 'Conching & Refining',
    processStageNumber: 6,
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
    _id: 'fac-2',
    facilityCode: 'FAC-NYC-02',
    name: 'Stage 10: Packaging & Cold Vault',
    chocolateFacilityName: 'Stage 10: Packaging & Cold Vault',
    processStageName: 'Packaging & Cold Vault',
    processStageNumber: 10,
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
    _id: 'fac-3',
    facilityCode: 'FAC-LAX-03',
    name: 'Stage 1: Raw Bean Silos & Harbor',
    chocolateFacilityName: 'Stage 1: Raw Bean Silos & Harbor',
    processStageName: 'Raw Bean Silos & Harbor',
    processStageNumber: 1,
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
    _id: 'fac-4',
    facilityCode: 'FAC-DAL-04',
    name: 'Stage 2: Thermal Drum Roasting Plant',
    chocolateFacilityName: 'Stage 2: Thermal Drum Roasting Plant',
    processStageName: 'Drum Roasting',
    processStageNumber: 2,
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
    _id: 'fac-5',
    facilityCode: 'FAC-ATL-05',
    name: 'Stage 7: Continuous Tempering Plant',
    chocolateFacilityName: 'Stage 7: Continuous Tempering Plant',
    processStageName: 'Continuous Tempering',
    processStageNumber: 7,
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
    _id: 'fac-6',
    facilityCode: 'FAC-SEA-06',
    name: 'Stage 3: Winnowing & Nib Separation',
    chocolateFacilityName: 'Stage 3: Winnowing & Nib Separation',
    processStageName: 'Winnowing & Nib Separation',
    processStageNumber: 3,
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
];

export const MOCK_VEHICLES = [
  {
    _id: 'veh-1',
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
    _id: 'veh-2',
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
    speedKmh: 45,
    assignedShipmentIds: ['SH-1043'],
  },
  {
    _id: 'veh-3',
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
    _id: 'veh-4',
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
    _id: 'veh-5',
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
];

export const MOCK_ROUTES = [
  {
    routeCode: 'ROUTE-I80-MW',
    name: 'Jacketed Chocolate Main Pipeline (Conching -> Packaging)',
    chocolatePipelineName: 'Jacketed Chocolate Main Pipeline (Conching -> Packaging)',
    roadCorridor: 'I-80',
    distanceKm: 1280,
    durationHours: 14.5,
    routeType: 'planned',
    isClosed: true,
    ingredientFlow: 'Molten Dark Chocolate Mass 48°C',
    pipeTemperatureCelsius: 16.5,
    pipePressureBar: 6.2,
    chocolateStatusText: 'JACKET FAULT (SOLIDIFYING)',
    coordinates: [
      [41.8781, -87.6298],
      [41.5868, -87.3464],
      [41.6528, -83.5379],
      [41.4993, -81.6944],
      [41.0998, -80.6495],
      [40.7128, -74.006],
    ],
  },
  {
    routeCode: 'ROUTE-I70-BYPASS',
    name: 'South Heated Jacketed Bypass Pipe (32°C Thermal Detour)',
    chocolatePipelineName: 'South Heated Jacketed Bypass Pipe (32°C Thermal Detour)',
    roadCorridor: 'I-70',
    distanceKm: 1395,
    durationHours: 16.8,
    routeType: 'alternative',
    isBypassAlternative: true,
    ingredientFlow: 'Recirculated Tempered Couverture 32°C',
    pipeTemperatureCelsius: 32.0,
    pipePressureBar: 4.8,
    chocolateStatusText: 'THERMAL BYPASS (32°C)',
    coordinates: [
      [41.8781, -87.6298],
      [39.7684, -86.1581],
      [39.9612, -82.9988],
      [40.4406, -79.9959],
      [40.7128, -74.006],
    ],
  },
];

// Helper to generate the exact 34 shipments
function generate34Shipments() {
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

  const shipments: any[] = [];
  const baseTime = Date.now();

  for (let i = 1; i <= 34; i++) {
    const pair = cityPairs[(i - 1) % cityPairs.length];
    const cargo = cargoTypes[(i - 1) % cargoTypes.length];
    const carrier = carriers[(i - 1) % carriers.length];
    const shipId = `SH-${1040 + i}`;

    let status: 'in_transit' | 'delayed' | 'ready_for_dispatch' | 'exception' | 'delivered' = 'in_transit';
    let delayHours = 0;
    let riskScore = 15;
    const riskFactors: string[] = [];

    if (i === 1) {
      status = 'in_transit';
      riskScore = 12;
    } else if (i === 2) {
      status = 'delayed';
      delayHours = 4.2;
      riskScore = 78;
      riskFactors.push('I-80 weather advisory & road slowdown');
      riskFactors.push('Cross-dock connection window tightened to 20 minutes');
    } else if (i === 3) {
      status = 'delayed';
      delayHours = 6.0;
      riskScore = 88;
      riskFactors.push('Refrigeration unit operating on auxiliary generator');
      riskFactors.push('Severe delay on westbound lane');
    } else if (i === 4) {
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
    } else if (i > 32) {
      status = 'delivered';
      riskScore = 5;
    }

    const pickupDate = new Date(baseTime - (3600 * 1000 * (12 + (i * 2)))).toISOString();
    const deliveryDate = new Date(baseTime + (3600 * 1000 * (18 + (i * 2)))).toISOString();

    const currentLoc = {
      name: `Transit Segment near ${pair.origin.name.split(',')[0]}`,
      lat: (pair.origin.lat + pair.destination.lat) / 2 + ((i % 5 - 2) * 0.3),
      lng: (pair.origin.lng + pair.destination.lng) / 2 + ((i % 5 - 2) * 0.4),
    };

    shipments.push({
      _id: `ship-${i}`,
      shipmentId: shipId,
      orderId: `ORD-${88000 + i}`,
      customerReference: `PO-REF-${5500 + i}`,
      origin: pair.origin,
      destination: pair.destination,
      currentLocation: currentLoc,
      carrierId: carrier.id,
      carrierName: carrier.name,
      vehicleId: i <= 5 ? `TRK-${100 + i * 10}` : `TRK-${600 + i}`,
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
          title: 'Freight Tendered & Dispatched',
          description: `Dispatched from ${pair.origin.name}`,
          timestamp: pickupDate,
          type: 'pickup',
          status: 'completed',
        },
        {
          id: `M2-${shipId}`,
          title: delayHours > 0 ? 'Corridor Delay Encountered' : 'Waypoint Cleared',
          description: delayHours > 0 ? `Corridor throttled by ${delayHours}h` : 'On-schedule GPS telemetry',
          timestamp: new Date(baseTime - 3600 * 1000).toISOString(),
          type: delayHours > 0 ? 'delay' : 'checkpoint',
          status: delayHours > 0 ? 'alert' : 'current',
        },
        {
          id: `M3-${shipId}`,
          title: 'Destination Hub Inbound Scheduled',
          description: `Inbound cross-dock at ${pair.destination.name}`,
          timestamp: deliveryDate,
          type: 'delivery',
          status: 'pending',
        },
      ],
      assignedFacilityId: pair.origin.facilityId,
      notes: `Corridor: ${pair.routeCorridor}. Synthetic enterprise demonstration data.`,
    });
  }

  return shipments;
}

export const MOCK_SHIPMENTS = generate34Shipments();

export const MOCK_INCIDENTS = [
  {
    _id: 'inc-1',
    incidentType: 'road_closure',
    title: 'I-80 Commercial Corridor Severe Winter Closure',
    description: 'Blizzard conditions and jackknifed vehicle between Mile 120 and 155 near Toledo, OH. Expect 8-12 hour detours.',
    severity: 'critical',
    location: { name: 'I-80 Mile 142 (Toledo, OH)', lat: 41.6528, lng: -83.5379 },
    affectedEntities: ['SH-1042', 'SH-1043', 'TRK-101', 'TRK-204'],
    status: 'active',
  },
  {
    _id: 'inc-2',
    incidentType: 'warehouse_congestion',
    title: 'Chicago Central Yard Dwell Spike (>4h)',
    description: 'Inbound container staging backlog due to rail siding delay. Utilization reached 86.4%.',
    severity: 'high',
    location: { name: 'Chicago Central Logistics Park', lat: 41.8781, lng: -87.6298 },
    affectedEntities: ['FAC-CHI-01'],
    status: 'active',
  },
];

export const MOCK_ALERTS = [
  {
    _id: 'alt-1',
    alertCode: 'ALT-101',
    severity: 'critical',
    type: 'route_disruption',
    title: 'I-80 Commercial Lane Closure Alert',
    message: 'Winter blizzard warning has forced commercial truck holds on I-80 westbound between Gary, IN and Toledo, OH. Estimated delay +10.0 hours.',
    linkedEntityId: 'I-80',
    linkedEntityType: 'scenario',
    status: 'active',
    assignedTo: 'Marcus Vance',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: ['[10:14] Marcus Vance: Operations monitoring southern bypass detour feasibility.'],
  },
  {
    _id: 'alt-2',
    alertCode: 'ALT-102',
    severity: 'critical',
    type: 'critical_delay',
    title: 'Tractor Mechanical Breakdown on SH-1044',
    message: 'Vehicle TRK-308 experienced turbocharger failure at Youngstown, OH. Consignment delayed by 8.5 hours. Rescue wrecker required.',
    linkedEntityId: 'SH-1044',
    linkedEntityType: 'shipment',
    status: 'active',
    assignedTo: 'Marcus Vance',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    _id: 'alt-3',
    alertCode: 'ALT-103',
    severity: 'warning',
    type: 'capacity_conflict',
    title: 'Chicago Central Logistics Park Nearing Capacity',
    message: 'Facility utilization reached 86.4%. Inbound freight pacing advisory active to prevent yard gridlock.',
    linkedEntityId: 'FAC-CHI-01',
    linkedEntityType: 'facility',
    status: 'active',
    assignedTo: 'Sarah Chen',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'alt-4',
    alertCode: 'ALT-104',
    severity: 'warning',
    type: 'recovery_plan_pending',
    title: 'Recovery Plan Alpha Awaiting Manager Approval',
    message: 'Disruption simulation generated Plan Gamma (Balanced Resilience) with 6 recovered on-time deliveries. Signoff pending.',
    linkedEntityId: 'rec-1',
    linkedEntityType: 'recovery_plan',
    status: 'active',
    assignedTo: 'Marcus Vance',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export const MOCK_SIMULATIONS = [
  {
    _id: 'sim-1',
    name: 'I-80 Corridor Severe Blizzard & Road Closure',
    description: 'Major weather event closing I-80 commercial lanes between Gary, IN and Toledo, OH for 10 hours.',
    isBaseline: true,
    status: 'completed',
    disruption: {
      type: 'road_closure',
      title: 'I-80 Midwest Corridor Blizzard Closure',
      severity: 'critical',
      durationHours: 10,
      routeCorridor: 'I-80',
      capacityDropPercentage: 60,
      affectedShipmentIds: ['SH-1042', 'SH-1043', 'SH-1044', 'SH-1047', 'SH-1052', 'SH-1057', 'SH-1062', 'SH-1067'],
    },
    metrics: {
      totalShipmentsMonitored: 34,
      directlyAffectedShipments: 8,
      atRiskShipments: 12,
      projectedLateDeliveries: 6,
      averageDelayHours: 5.4,
      maxDelayHours: 11.2,
      addedDistanceKm: 420,
      estimatedExtraCostUSD: 14800,
      slaPenaltyRiskUSD: 32000,
      facilityUtilizationImpactPct: 18.5,
      recoveryFeasibilityScore: 84,
    },
    assumptions: [
      'I-80 westbound closed to all commercial vehicles exceeding 26,000 lbs',
      'Alternate detour routing available via I-70 through Columbus & Indianapolis',
      'FMCSA 11-hour driver limit requires team driver substitution for detours',
    ],
    createdBy: 'System Simulation Seeder',
  },
];

export const MOCK_RECOVERY_PLANS = [
  {
    _id: 'rec-1',
    planCode: 'REC-2026-ALPHA',
    scenarioId: 'sim-1',
    scenarioName: 'I-80 Corridor Severe Blizzard & Road Closure',
    title: 'Plan Alpha: Expedited Southern Detour (I-70 / I-76 Bypass)',
    description: 'Hot-shot team driver relay diverting high-priority semiconductor & pharmaceutical loads south via I-70 Indianapolis corridor.',
    strategyCategory: 'fastest_delivery',
    approvalStatus: 'pending_review',
    proposedActions: [
      { id: 'act-1', actionType: 'reroute', shipmentId: 'SH-1042', title: 'Divert via I-70 East', description: 'Bypasses Toledo blizzard, saves 6.5 hours', costDeltaUSD: 1250, timeSavingsHours: 6.5, feasibilityConfidence: 94 },
      { id: 'act-2', actionType: 'carrier_swap', shipmentId: 'SH-1043', title: 'Assign Expedited Team Drivers', description: 'Dual drivers maintain uninterrupted transit under FMCSA rules', costDeltaUSD: 850, timeSavingsHours: 4.0, feasibilityConfidence: 89 },
      { id: 'act-3', actionType: 'dock_slot_advance', shipmentId: 'SH-1044', title: 'Stage Pre-Cleared Dock Gate at Newark', description: 'Advance gate reservation by 2 hours for immediate unloading', costDeltaUSD: 200, timeSavingsHours: 2.0, feasibilityConfidence: 96 },
    ],
    projectedRecoveryMetrics: {
      recoveredOnTimeDeliveries: 6,
      reducedDelayHours: 8.5,
      netCostUSD: 2300,
      feasibilityScore: 91,
    },
    constraintsChecked: [
      { name: 'FMCSA Hours of Service (HOS)', passed: true, details: 'Team drivers satisfy 11-hour driving limit rule' },
      { name: 'Vehicle Weight Limits (80k lbs GVWR)', passed: true, details: 'Axle load validated at 68,500 lbs' },
      { name: 'Cold-Chain SLA Tolerance', passed: true, details: 'Reefer battery reserve verified for +12h buffer' },
    ],
    unresolvedRisks: ['Slightly higher fuel burn on rolling hills of central Ohio'],
  },
  {
    _id: 'rec-2',
    planCode: 'REC-2026-BETA',
    scenarioId: 'sim-1',
    scenarioName: 'I-80 Corridor Severe Blizzard & Road Closure',
    title: 'Plan Beta: Intermodal Rail Pivot via Chicago BNSF',
    description: 'Transfer non-temperature-sensitive general freight to priority BNSF intermodal rail flatcars.',
    strategyCategory: 'lowest_cost',
    approvalStatus: 'approved',
    approvedBy: 'Marcus Vance',
    approvedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    reviewNotes: 'Cost-optimal solution for standard dry-van consignments.',
    proposedActions: [
      { id: 'act-4', actionType: 'modal_switch', shipmentId: 'SH-1047', title: 'Transfer to Chicago Intermodal Rail', description: 'Avoids highway gridlock entirely', costDeltaUSD: -450, timeSavingsHours: 1.5, feasibilityConfidence: 87 },
    ],
    projectedRecoveryMetrics: {
      recoveredOnTimeDeliveries: 4,
      reducedDelayHours: 4.2,
      netCostUSD: -850,
      feasibilityScore: 85,
    },
    constraintsChecked: [
      { name: 'Rail Well Car Availability', passed: true, details: '12 empty double-stack wells confirmed at Corwith Yard' },
    ],
    unresolvedRisks: ['Terminal dwell time at Elizabeth Marine Terminal'],
  },
];

export const MOCK_DOCUMENTS = [
  {
    _id: 'doc-1',
    documentCode: 'DOC-90412',
    fileName: 'Apex_BillOfLading_SH-1042.pdf',
    fileType: 'pdf',
    fileSizeKB: 284,
    uploadTimestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    documentCategory: 'bill_of_lading',
    processingStatus: 'confirmed',
    validationStatus: 'valid',
    linkedShipmentId: 'SH-1042',
    extractedFields: [
      { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1042', confidenceScore: 0.99, sourceSnippet: 'BOL Number: SH-1042', isValidated: true },
      { fieldName: 'orderId', label: 'Order Number', value: 'ORD-88002', confidenceScore: 0.97, sourceSnippet: 'PO REF: ORD-88002', isValidated: true },
      { fieldName: 'origin', label: 'Origin Facility', value: 'Chicago Central Logistics Park', confidenceScore: 0.95, sourceSnippet: 'Shipper: Chicago Central Logistics Park', isValidated: true },
      { fieldName: 'destination', label: 'Destination Facility', value: 'New York Atlantic Gateway', confidenceScore: 0.96, sourceSnippet: 'Consignee: New York Atlantic Gateway', isValidated: true },
      { fieldName: 'weightKg', label: 'Gross Weight', value: 12400, confidenceScore: 0.94, sourceSnippet: 'Weight: 12,400 KG', isValidated: true },
      { fieldName: 'carrierName', label: 'Carrier', value: 'Apex Freight Dynamics', confidenceScore: 0.98, sourceSnippet: 'Carrier: Apex Freight Dynamics', isValidated: true },
    ],
    rawTextPreview: 'APEX FREIGHT DYNAMICS - MASTER BILL OF LADING\nBOL: SH-1042 | Date: 2026-10-20\nShipper: Chicago Central Logistics Park, 4400 S Pulaski Rd, Chicago IL\nConsignee: New York Atlantic Gateway, 100 Port St, Newark NJ\nCommodity: Industrial Automation Sensors & PLCs\nTotal Weight: 12,400 kg | Handling: Standard Dry Van\nSeal: SEC-99410 | Driver: J. Henderson (CDL Class A)',
    notes: 'Verified against active shipment SH-1042 record.',
  },
  {
    _id: 'doc-2',
    documentCode: 'DOC-90413',
    fileName: 'Titan_CommercialInvoice_INV-882.pdf',
    fileType: 'pdf',
    fileSizeKB: 195,
    uploadTimestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    documentCategory: 'commercial_invoice',
    processingStatus: 'flagged_discrepancy',
    validationStatus: 'inconsistent_dates',
    conflictingFields: ['weightKg'],
    linkedShipmentId: 'SH-1043',
    extractedFields: [
      { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1043', confidenceScore: 0.94, sourceSnippet: 'Shipment: SH-1043', isValidated: true },
      { fieldName: 'orderId', label: 'Order Number', value: 'ORD-88003', confidenceScore: 0.91, sourceSnippet: 'Order: ORD-88003', isValidated: true },
      { fieldName: 'weightKg', label: 'Gross Weight', value: 7200, confidenceScore: 0.76, sourceSnippet: 'Total wt: 7,200 kg (Manifest shows 6,800 kg)', isValidated: false, correctedValue: 6800 },
      { fieldName: 'carrierName', label: 'Carrier', value: 'Titan Intermodal Logistics', confidenceScore: 0.95, sourceSnippet: 'Carrier: Titan', isValidated: true },
    ],
    rawTextPreview: 'TITAN INTERMODAL - COMMERCIAL INVOICE\nInvoice #: INV-882 | Ref: ORD-88003\nConsignment: SH-1043 | Cold-Chain Vaccines\nNote: Weight discrepancy of 400kg detected between packaging manifest and gross tare weight.',
    notes: 'Requires manual weight confirmation from dock inspector.',
  },
  {
    _id: 'doc-3',
    documentCode: 'DOC-90414',
    fileName: 'Pending_Delivery_Order_ORD-9104.csv',
    fileType: 'csv',
    fileSizeKB: 42,
    uploadTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    documentCategory: 'delivery_order',
    processingStatus: 'extracted',
    validationStatus: 'valid',
    extractedFields: [
      { fieldName: 'shipmentId', label: 'Shipment ID', value: 'SH-1090', confidenceScore: 0.88, sourceSnippet: 'CSV line 2: SH-1090', isValidated: true },
      { fieldName: 'origin', label: 'Origin', value: 'Dallas Inland Depot', confidenceScore: 0.89, sourceSnippet: 'DAL-04', isValidated: true },
      { fieldName: 'destination', label: 'Destination', value: 'Atlanta Distribution Cross-Dock', confidenceScore: 0.91, sourceSnippet: 'ATL-05', isValidated: true },
      { fieldName: 'weightKg', label: 'Weight', value: 16500, confidenceScore: 0.95, sourceSnippet: '16500', isValidated: true },
      { fieldName: 'carrierName', label: 'Carrier', value: 'Nexus Global Haulers', confidenceScore: 0.93, sourceSnippet: 'Nexus Global', isValidated: true },
    ],
    rawTextPreview: 'ShipmentID,OrderID,Origin,Destination,Weight,Carrier\nSH-1090,ORD-9104,FAC-DAL-04,FAC-ATL-05,16500,Nexus Global Haulers',
    notes: 'New draft shipment ready to be promoted to live dispatch.',
  },
];

export const MOCK_USERS = [
  { id: 'u-1', name: 'Elena Rostova', email: 'admin@flowtwin.ai', role: 'Administrator', department: 'Logistics Operations Command', accountStatus: 'active' },
  { id: 'u-2', name: 'Marcus Vance', email: 'manager@flowtwin.ai', role: 'Logistics Manager', department: 'Supply Chain Resiliency', accountStatus: 'active' },
  { id: 'u-3', name: 'Sarah Chen', email: 'analyst@flowtwin.ai', role: 'Operations Analyst', department: 'Simulation & Modeling Lab', accountStatus: 'active' },
  { id: 'u-4', name: 'David Kalu', email: 'viewer@flowtwin.ai', role: 'Viewer', department: 'Executive Governance', accountStatus: 'active' },
];

export const MOCK_AUDIT_EVENTS = [
  {
    _id: 'aud-1',
    actorName: 'Elena Rostova',
    actorRole: 'Administrator',
    action: 'BOOTSTRAP_WORKSPACE',
    entityType: 'system',
    entityId: 'SYSTEM-ROOT',
    outcome: 'success',
    details: { message: 'Initialized FlowTwin AI synthetic enterprise dataset with 34 shipments, 6 facilities, and 5 corridors.' },
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'aud-2',
    actorName: 'Marcus Vance',
    actorRole: 'Logistics Manager',
    action: 'DISRUPTION_SIMULATION_EXECUTED',
    entityType: 'simulation',
    entityId: 'sim-1',
    outcome: 'success',
    details: { scenarioName: 'I-80 Corridor Severe Blizzard & Road Closure', affectedShipmentsCount: 8 },
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'aud-3',
    actorName: 'Sarah Chen',
    actorRole: 'Operations Analyst',
    action: 'DOCUMENT_EXTRACTION_VALIDATED',
    entityType: 'document',
    entityId: 'DOC-90412',
    outcome: 'success',
    details: { confidence: 0.97, extractedFieldsCount: 6 },
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'aud-4',
    actorName: 'Marcus Vance',
    actorRole: 'Logistics Manager',
    action: 'APPROVE_RECOVERY_PLAN',
    entityType: 'recovery_plan',
    entityId: 'REC-2026-BETA',
    outcome: 'success',
    details: { strategy: 'lowest_cost', planCode: 'REC-2026-BETA' },
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const MOCK_NETWORK_GRAPH = {
  nodes: [
    {
      id: 'FAC-CHI-01',
      type: 'facilityNode',
      position: { x: 100, y: 70 },
      data: {
        label: 'Chicago Central Logistics Park',
        code: 'FAC-CHI-01',
        type: 'warehouse',
        utilization: 86.4,
        status: 'congested',
        throughput: 320,
        city: 'Chicago, IL',
      },
    },
    {
      id: 'FAC-LAX-03',
      type: 'facilityNode',
      position: { x: 620, y: 70 },
      data: {
        label: 'Pacific Intermodal Hub',
        code: 'FAC-LAX-03',
        type: 'port',
        utilization: 82.0,
        status: 'optimal',
        throughput: 750,
        city: 'Long Beach, CA',
      },
    },
    {
      id: 'TRK-101',
      type: 'vehicleNode',
      position: { x: 220, y: 290 },
      data: {
        label: 'TRK-101',
        type: 'dry_van',
        carrier: 'Apex Freight Dynamics',
        status: 'in_transit',
        currentLocation: 'Toledo, OH (I-80 Mile 64)',
      },
    },
    {
      id: 'TRK-204',
      type: 'vehicleNode',
      position: { x: 600, y: 290 },
      data: {
        label: 'TRK-204',
        type: 'reefer',
        carrier: 'Titan Intermodal Logistics',
        status: 'in_transit',
        currentLocation: 'South Bend, IN (I-70 Cor.)',
      },
    },
    {
      id: 'NODE-SH-1042',
      type: 'shipmentNode',
      position: { x: 60, y: 510 },
      data: {
        shipmentId: 'SH-1042',
        status: 'delayed',
        cargo: 'Semiconductor Lithography',
        delayHours: 4.5,
        riskScore: 78,
        destination: 'New York Gateway',
      },
    },
    {
      id: 'NODE-SH-1043',
      type: 'shipmentNode',
      position: { x: 340, y: 510 },
      data: {
        shipmentId: 'SH-1043',
        status: 'delayed',
        cargo: 'Biotech Cold Vaccines',
        delayHours: 6.0,
        riskScore: 88,
        destination: 'Boston BioHub',
      },
    },
    {
      id: 'NODE-SH-1044',
      type: 'shipmentNode',
      position: { x: 620, y: 510 },
      data: {
        shipmentId: 'SH-1044',
        status: 'exception',
        cargo: 'EV Lithium Batteries',
        delayHours: 8.5,
        riskScore: 95,
        destination: 'Detroit Assembly Park',
      },
    },
    {
      id: 'FAC-NYC-02',
      type: 'facilityNode',
      position: { x: 920, y: 510 },
      data: {
        label: 'New York Atlantic Gateway',
        code: 'FAC-NYC-02',
        type: 'distribution_center',
        utilization: 68.0,
        status: 'optimal',
        throughput: 450,
        city: 'Newark, NJ',
      },
    },
  ],
  edges: [
    {
      id: 'e-chi-trk101',
      source: 'FAC-CHI-01',
      target: 'TRK-101',
      animated: true,
      label: 'I-80 Corridor (Weather Alert)',
      style: { stroke: '#EF4444', strokeWidth: 3 },
    },
    {
      id: 'e-chi-trk204',
      source: 'FAC-CHI-01',
      target: 'TRK-204',
      animated: true,
      label: 'I-70 Corridor Link',
      style: { stroke: '#06B6D4', strokeWidth: 2 },
    },
    {
      id: 'e-lax-trk204',
      source: 'FAC-LAX-03',
      target: 'TRK-204',
      animated: true,
      label: 'Pacific Rail Relay',
      style: { stroke: '#10B981', strokeWidth: 2 },
    },
    {
      id: 'e-trk101-sh1042',
      source: 'TRK-101',
      target: 'NODE-SH-1042',
      animated: true,
      label: '+4.5h Weather Delay',
      style: { stroke: '#EF4444', strokeWidth: 3 },
    },
    {
      id: 'e-trk204-sh1043',
      source: 'TRK-204',
      target: 'NODE-SH-1043',
      animated: true,
      label: 'Cold-Chain (+6h Delay)',
      style: { stroke: '#EF4444', strokeWidth: 3 },
    },
    {
      id: 'e-trk204-sh1044',
      source: 'TRK-204',
      target: 'NODE-SH-1044',
      animated: true,
      label: 'HAZMAT Route',
      style: { stroke: '#8B5CF6', strokeWidth: 2 },
    },
    {
      id: 'e-trk101-nyc',
      source: 'TRK-101',
      target: 'FAC-NYC-02',
      animated: true,
      label: 'Inbound Atlantic DC',
      style: { stroke: '#EF4444', strokeDasharray: '5 5', strokeWidth: 2 },
    },
    {
      id: 'e-trk204-nyc',
      source: 'TRK-204',
      target: 'FAC-NYC-02',
      animated: true,
      label: 'Cross-dock Delivery',
      style: { stroke: '#06B6D4', strokeWidth: 2 },
    },
  ],
};
