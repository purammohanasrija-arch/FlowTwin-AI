import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FactoryParameters {
  dailyOrders: number; // Chocolate bars ordered per day (e.g. 5,000)
  cocoaStockKg: number; // Cocoa beans/powder in kg (e.g. 4,200 kg)
  sugarStockKg: number; // Sugar in kg (e.g. 2,800 kg)
  milkStockLitres: number; // Milk ingredients in litres (e.g. 1,900 L)
  packagingStockUnits: number; // Wrappers & boxes (e.g. 10,000 units)
  machineEfficiencyPct: number; // Efficiency 0 - 100% (e.g. 92%)
  productionCapacityBarsPerHour: number; // Standard speed (e.g. 800 bars/h)
  coldStorageTempCelsius: number; // Storage temperature in °C (ideal: 16-19°C)
  availableTrucks: number; // Refrigerated trucks (e.g. 5)
  averageTruckDelayHours: number; // Truck transit delay in hours (e.g. 0.5 h)
  qualityRejectionPct: number; // Rejection rate 0 - 100% (e.g. 2.1%)
}

export interface ProductionStage {
  id: string;
  name: string;
  purpose: string;
  machineName: string;
  status: 'Waiting' | 'Running' | 'Completed' | 'Needs Attention';
  progress: number; // 0 - 100%
  operatingValues: Record<string, string | number>;
  description: string;
  zone: 'storage' | 'production' | 'quality' | 'packaging' | 'cold_storage' | 'loading' | 'delivery';
}

export interface ProblemScenario {
  id: string;
  title: string;
  category: string;
  whatHappened: string;
  affectedArea: string;
  productionDelay: string;
  affectedOrders: string;
  recommendedAction: string;
  changesAfterAction: string;
  parameterImpacts: Partial<FactoryParameters>;
}

export interface FactoryPlan {
  id: 'plan_a' | 'plan_b' | 'plan_c';
  name: string;
  tagline: string;
  description: string;
  expectedProductionBars: number;
  ordersCompleted: number;
  ordersDelayed: number;
  cocoaNeededKg: number;
  sugarNeededKg: number;
  milkNeededLitres: number;
  deliveryCapacityLoads: number;
  estimatedOperatingCostUSD: number;
  efficiencyRating: string;
  parameters: Partial<FactoryParameters>;
}

export interface ChocolateDelivery {
  id: string;
  truckId: string;
  driverName: string;
  orderNumber: string;
  customerName: string;
  destination: string;
  distanceKm: number;
  boxesCount: number;
  chocolateType: string;
  status: 'Ready for Loading' | 'Loaded' | 'In Transit' | 'Delivered';
  etaMinutes: number;
  delayReason?: string;
  temperatureCelsius: number;
}

export interface QualityBatchRecord {
  batchNumber: string;
  date: string;
  recipe: string;
  appearance: 'Glossy & Uniform' | 'Slight Surface Haze' | 'Bloom Detected' | 'Texture Irregularity';
  shapeAndSeal: 'Hermetically Sealed, Crisp Edge' | 'Foil Creased' | 'Improper Mould Fill' | 'Perfect Wrapper Alignment';
  storageTempCelsius: number;
  inspectionResult: 'Passed' | 'Flagged' | 'Rejected';
  totalInspected: number;
  acceptedCount: number;
  rejectedCount: number;
  rejectionReason?: string;
  inspector: string;
}

export interface FactoryCalculationResults {
  estimatedProductionBars: number;
  ordersCompleted: number;
  ordersDelayed: number;
  cocoaReplenishNeededKg: number;
  sugarReplenishNeededKg: number;
  milkReplenishNeededLitres: number;
  packagingReplenishNeededUnits: number;
  expectedDeliveryDelaysHours: number;
  warehouseStockBars: number;
  machineUtilizationPct: number;
  estimatedRejectedBars: number;
  estimatedRevenueUSD: number;
  estimatedOperatingCostUSD: number;
}

export const DEFAULT_PARAMETERS: FactoryParameters = {
  dailyOrders: 5000,
  cocoaStockKg: 3500,
  sugarStockKg: 2200,
  milkStockLitres: 1800,
  packagingStockUnits: 9500,
  machineEfficiencyPct: 92,
  productionCapacityBarsPerHour: 750,
  coldStorageTempCelsius: 18.2,
  availableTrucks: 5,
  averageTruckDelayHours: 0.4,
  qualityRejectionPct: 1.8,
};

export const INITIAL_STAGES: ProductionStage[] = [
  {
    id: 'stage-1',
    name: 'Raw Materials',
    purpose: 'Inspect and prepare cocoa beans, sugar, and milk ingredients.',
    machineName: 'Ingredient Intake Silos & Metering Weighers',
    status: 'Running',
    progress: 95,
    operatingValues: {
      'Cocoa Beans': '3,500 kg',
      'Sugar Grade A': '2,200 kg',
      'Milk Concentrate': '1,800 L',
      'Moisture Level': '4.2%',
    },
    description: 'Fresh organic cocoa beans from fair-trade farms are weighed, winnowed to separate husks, and blended with sugar and powdered milk.',
    zone: 'storage',
  },
  {
    id: 'stage-2',
    name: 'Chocolate Making',
    purpose: 'Roast, grind, mix, and temper chocolate to achieve silky texture and snap.',
    machineName: 'Rotary Roaster, 5-Roll Refiner & Continuous Temperer',
    status: 'Running',
    progress: 74,
    operatingValues: {
      'Roaster Temp': '138°C',
      'Conching Duration': '14 hours',
      'Tempering Phase 1': '45°C (Melt)',
      'Tempering Phase 2': '27°C (Cool)',
      'Tempering Phase 3': '31.5°C (Working)',
    },
    description: 'Nibs are roasted for rich flavor, ground into cocoa liquor, conched to aerate acids, and tempered to align Beta-V cocoa butter crystals.',
    zone: 'production',
  },
  {
    id: 'stage-3',
    name: 'Quality Check',
    purpose: 'Examine chocolate gloss, snap firmness, thickness, and packaging integrity.',
    machineName: 'Optical Surface Inspector & Inline Viscometer',
    status: 'Running',
    progress: 68,
    operatingValues: {
      'Surface Gloss': '98.4%',
      'Crystalline Snap': 'Optimal',
      'Rejection Rate': '1.8%',
      'Defects Detected': '3 bars',
    },
    description: 'High-speed camera sensors inspect chocolate bars for surface fat bloom, air pockets, weight variance, and moulding consistency.',
    zone: 'quality',
  },
  {
    id: 'stage-4',
    name: 'Packaging',
    purpose: 'Wrap finished chocolate bars in protective foil and luxury branded boxes.',
    machineName: 'High-Speed Flow Wrapper & Case Packer 400',
    status: 'Running',
    progress: 62,
    operatingValues: {
      'Wrapping Speed': '650 bars/min',
      'Foil Tension': '14.2 N',
      'Sealing Temp': '112°C',
      'Bars Packed': '3,120 bars',
    },
    description: 'Tempered chocolate bars pass onto conveyors where gold foil seals freshness before robotic arms pack 24 bars per display carton.',
    zone: 'packaging',
  },
  {
    id: 'stage-5',
    name: 'Cold Storage',
    purpose: 'Maintain packaged chocolates in climate-controlled warehouse to prevent melting.',
    machineName: 'Industrial Cold Storage Air Handler HVAC-02',
    status: 'Running',
    progress: 88,
    operatingValues: {
      'Current Temp': '18.2°C',
      'Target Range': '15°C - 19°C',
      'Humidity Level': '48% RH',
      'Storage Pallets': '42 pallets',
    },
    description: 'Finished chocolate cartons are palletized and kept in specialized dry cold storage to preserve pristine texture and prevent moisture damage.',
    zone: 'cold_storage',
  },
  {
    id: 'stage-6',
    name: 'Loading',
    purpose: 'Stage and load chilled pallet boxes into climate-controlled delivery trucks.',
    machineName: 'Dock Leveler & Automated Pallet Shuttle',
    status: 'Running',
    progress: 50,
    operatingValues: {
      'Docks Active': 'Dock Bay 1 & 2',
      'Pallets Staged': '18 pallets',
      'Dock Temp': '16.5°C',
      'Load Time / Truck': '18 min',
    },
    description: 'Insulated roll-up dock seals prevent warm outside air from entering while electric forklifts load palletized shipments.',
    zone: 'loading',
  },
  {
    id: 'stage-7',
    name: 'Delivery',
    purpose: 'Transport fresh chocolate to retail stores, supermarkets, and boutique cafes.',
    machineName: 'Refrigerated Fleet Fleet-Telematics Tracker',
    status: 'Running',
    progress: 45,
    operatingValues: {
      'Active Trucks': '4 in transit',
      'On-Time Rate': '96.2%',
      'Average Temp': '17.8°C',
      'Next Drop-Off': 'Sweet Delights (14m)',
    },
    description: 'Refrigerated trucks maintain steady temperatures en route, preventing heat exposure and ensuring chocolates reach shelves in peak condition.',
    zone: 'delivery',
  },
];

export const PROBLEM_SCENARIOS: ProblemScenario[] = [
  {
    id: 'cocoa_shortage',
    title: 'Cocoa Bean Shortage',
    category: 'Raw Materials',
    whatHappened: 'A maritime shipping delay delayed our organic cocoa bean shipment. Cocoa stock dropped by 65%.',
    affectedArea: 'Raw Material Storage & Roasting Line',
    productionDelay: '4 to 6 hours if unscheduled batch swap occurs.',
    affectedOrders: '1,450 dark chocolate bars across 6 retail orders.',
    recommendedAction: '1. Switch production line to Milk Chocolate (uses less cocoa).\n2. Request expedited cocoa dispatch from regional safety reserve.\n3. Adjust production schedules to balance remaining cocoa inventory.',
    changesAfterAction: 'Cocoa consumption drops by 35%, factory maintains 88% throughput without stopping production.',
    parameterImpacts: {
      cocoaStockKg: 1100,
      dailyOrders: 5000,
    },
  },
  {
    id: 'machine_breakdown',
    title: 'Tempering Machine Breakdown',
    category: 'Production Equipment',
    whatHappened: 'The secondary continuous tempering unit experienced a cooling circuit pump failure. Temperature rose above 34°C.',
    affectedArea: 'Chocolate Production Area (Tempering & Moulding)',
    productionDelay: 'Production halted on Line 2; capacity reduced by 45%.',
    affectedOrders: '850 bars currently in moulding cycle.',
    recommendedAction: '1. Divert melted chocolate into thermal holding tanks to prevent crystal breakdown.\n2. Engage backup cooling heat exchanger.\n3. Dispatch on-duty maintenance technician with replacement seal kit.',
    changesAfterAction: 'Backup cooling unit stabilizes temperature at 31.5°C within 25 minutes; line resumes at 80% speed.',
    parameterImpacts: {
      machineEfficiencyPct: 52,
      productionCapacityBarsPerHour: 420,
    },
  },
  {
    id: 'packaging_shortage',
    title: 'Packaging Material Shortage',
    category: 'Packaging',
    whatHappened: 'Gold foil wrapper rolls were damaged in transit from the print vendor. Packaging inventory critically depleted.',
    affectedArea: 'Packaging Area (Flow Wrapping Station)',
    productionDelay: 'Chocolate bars accumulating on cooling conveyor; risk of jam in 35 minutes.',
    affectedOrders: 'All orders scheduled for packaging after 2:00 PM.',
    recommendedAction: '1. Slow cooling conveyor speed by 20% to avoid bar piling.\n2. Authorize standard branded silver foil as temporary emergency substitute.\n3. Alert the quality inspector to verify foil heat-seal calibration.',
    changesAfterAction: 'Packaging resumes within 15 minutes using reserve foil; prevents conveyor jam and avoids chocolate remelting.',
    parameterImpacts: {
      packagingStockUnits: 850,
      machineEfficiencyPct: 70,
    },
  },
  {
    id: 'warm_storage',
    title: 'Storage Temperature Too High',
    category: 'Chocolate Storage',
    whatHappened: 'Cold storage HVAC Unit 2 compressor tripped. Room temperature climbed to 24.5°C, risking chocolate fat bloom.',
    affectedArea: 'Chocolate Warehouse (Cold Storage Racks)',
    productionDelay: 'No immediate production stop, but 12,000 finished bars at risk of discoloration.',
    affectedOrders: '18 wholesale store orders in holding zone.',
    recommendedAction: '1. Activate emergency auxiliary chillers immediately.\n2. Keep warehouse bay doors strictly closed to prevent warm air drafts.\n3. Perform rapid quality spot-check on top carton layer.',
    changesAfterAction: 'Room temperature drops back to 17.5°C in 22 minutes; chocolate surface texture preserved without bloom.',
    parameterImpacts: {
      coldStorageTempCelsius: 24.5,
      qualityRejectionPct: 6.8,
    },
  },
  {
    id: 'truck_delay',
    title: 'Delivery Truck Delay',
    category: 'Deliveries',
    whatHappened: 'Major highway accident on the northern arterial route blocked 3 refrigerated delivery trucks for over 3 hours.',
    affectedArea: 'Loading and Delivery Area',
    productionDelay: 'Finished goods loading bays backing up; dock congestion.',
    affectedOrders: '7 retail shop deliveries with morning delivery guarantees.',
    recommendedAction: '1. Re-route remaining trucks via southern expressway bypass.\n2. Verify truck refrigeration telemetry is operating properly.\n3. Send automated delivery update notifications to store managers.',
    changesAfterAction: 'Rerouted trucks arrive with average delay of only 42 minutes; refrigeration temperatures stayed safe at 17.2°C.',
    parameterImpacts: {
      availableTrucks: 2,
      averageTruckDelayHours: 3.4,
    },
  },
  {
    id: 'order_surge',
    title: 'Sudden Increase in Customer Orders',
    category: 'Demand & Logistics',
    whatHappened: 'A holiday promotion campaign triggered an unexpected 50% spike in supermarket chocolate bar orders today.',
    affectedArea: 'Entire Factory & Warehouse',
    productionDelay: 'Current stock insufficient to fulfill all orders today.',
    affectedOrders: '2,600 additional chocolate bars demanded.',
    recommendedAction: '1. Schedule voluntary 2-hour evening overtime shift on packaging and tempering.\n2. Reallocate warehouse safety stock to fulfill priority boutique orders.\n3. Pre-dispatch delivery trucks in dual waves.',
    changesAfterAction: 'Production increases to 950 bars/h; 92% of new order surge fulfilled on schedule without stockout.',
    parameterImpacts: {
      dailyOrders: 7500,
    },
  },
  {
    id: 'high_rejection',
    title: 'High Chocolate Rejection Rate',
    category: 'Quality Control',
    whatHappened: 'Cocoa butter viscosity imbalance in Batch B-084 caused 8.5% of bars to fail optical gloss and thickness tests.',
    affectedArea: 'Quality Check & Moulding Conveyor',
    productionDelay: 'High volume of rejected bars requires remelt reprocessing.',
    affectedOrders: 'Batch B-084 earmarked for Premium Dark Chocolate gift boxes.',
    recommendedAction: '1. Adjust tempering zone 3 temperature up by +0.5°C to optimize crystal seeding.\n2. Divert rejected bars into the sanitary remelt kettle for recovery.\n3. Recalibrate optical camera inspection threshold.',
    changesAfterAction: 'Rejection rate drops from 8.5% down to 1.6%; 98% of rejected chocolate recovered cleanly into next batch.',
    parameterImpacts: {
      qualityRejectionPct: 8.5,
      machineEfficiencyPct: 78,
    },
  },
];

export const FACTORY_PLANS: FactoryPlan[] = [
  {
    id: 'plan_a',
    name: 'Plan A — Normal Production',
    tagline: 'Standard Balanced Factory Operations',
    description: 'Factory operates under standard steady-state conditions with balanced ingredient consumption and normal truck schedules.',
    expectedProductionBars: 5400,
    ordersCompleted: 4950,
    ordersDelayed: 50,
    cocoaNeededKg: 2700,
    sugarNeededKg: 1620,
    milkNeededLitres: 1350,
    deliveryCapacityLoads: 5,
    estimatedOperatingCostUSD: 4120,
    efficiencyRating: '94% Optimal',
    parameters: {
      dailyOrders: 5000,
      machineEfficiencyPct: 92,
      productionCapacityBarsPerHour: 750,
      coldStorageTempCelsius: 18.0,
      availableTrucks: 5,
      averageTruckDelayHours: 0.3,
      qualityRejectionPct: 1.8,
    },
  },
  {
    id: 'plan_b',
    name: 'Plan B — Machine Breakdown',
    tagline: 'Contingency Mode with Single Line Down',
    description: 'One production machine becomes unavailable. Factory slows throughput, conserves ingredient stock, and prioritizes express orders.',
    expectedProductionBars: 3200,
    ordersCompleted: 3100,
    ordersDelayed: 1900,
    cocoaNeededKg: 1600,
    sugarNeededKg: 960,
    milkNeededLitres: 800,
    deliveryCapacityLoads: 3,
    estimatedOperatingCostUSD: 3350,
    efficiencyRating: '62% Degraded',
    parameters: {
      dailyOrders: 5000,
      machineEfficiencyPct: 60,
      productionCapacityBarsPerHour: 450,
      coldStorageTempCelsius: 18.5,
      availableTrucks: 4,
      averageTruckDelayHours: 1.8,
      qualityRejectionPct: 4.2,
    },
  },
  {
    id: 'plan_c',
    name: 'Plan C — High Customer Demand',
    tagline: 'Peak Rush with +40% Customer Orders',
    description: 'Customer orders surge by 40%. The factory pushes machine speeds to maximum, dispatches all trucks, and schedules extended packing shifts.',
    expectedProductionBars: 6800,
    ordersCompleted: 6450,
    ordersDelayed: 550,
    cocoaNeededKg: 3400,
    sugarNeededKg: 2040,
    milkNeededLitres: 1700,
    deliveryCapacityLoads: 6,
    estimatedOperatingCostUSD: 5850,
    efficiencyRating: '88% High Stress',
    parameters: {
      dailyOrders: 7000,
      machineEfficiencyPct: 95,
      productionCapacityBarsPerHour: 900,
      coldStorageTempCelsius: 17.5,
      availableTrucks: 5,
      averageTruckDelayHours: 0.8,
      qualityRejectionPct: 2.6,
    },
  },
];

export const INITIAL_DELIVERIES: ChocolateDelivery[] = [
  {
    id: 'del-1',
    truckId: 'TRK-CHOC-01',
    driverName: 'Marco Bellini',
    orderNumber: 'ORD-CHOC-8821',
    customerName: 'Sweet Delights Confectionery',
    destination: 'Downtown Artisan Market, Suite 104',
    distanceKm: 18.5,
    boxesCount: 45,
    chocolateType: 'Velvet Milk Chocolate & Dark 70%',
    status: 'In Transit',
    etaMinutes: 14,
    temperatureCelsius: 17.6,
  },
  {
    id: 'del-2',
    truckId: 'TRK-CHOC-02',
    driverName: 'Hannah Larson',
    orderNumber: 'ORD-CHOC-8822',
    customerName: 'Metro Gourmet Superstore',
    destination: 'Northside Distribution Plaza, Bay 6',
    distanceKm: 34.0,
    boxesCount: 90,
    chocolateType: 'Salted Caramel Crunch Bars',
    status: 'In Transit',
    etaMinutes: 32,
    temperatureCelsius: 17.9,
  },
  {
    id: 'del-3',
    truckId: 'TRK-CHOC-03',
    driverName: 'Rashid Khan',
    orderNumber: 'ORD-CHOC-8823',
    customerName: 'Cocoa Haven Cafe Chain',
    destination: 'Westside Terminal Logistics Park',
    distanceKm: 12.0,
    boxesCount: 30,
    chocolateType: 'Artisan Hazelnut Praline Bars',
    status: 'Loaded',
    etaMinutes: 45,
    temperatureCelsius: 18.0,
  },
  {
    id: 'del-4',
    truckId: 'TRK-CHOC-04',
    driverName: 'Carlos Ruiz',
    orderNumber: 'ORD-CHOC-8824',
    customerName: 'Grand Hyatt Pastry Kitchen',
    destination: 'Central Avenue Hotel Hub',
    distanceKm: 22.0,
    boxesCount: 25,
    chocolateType: '85% Single-Origin Bitter Dark',
    status: 'Ready for Loading',
    etaMinutes: 75,
    temperatureCelsius: 18.2,
  },
  {
    id: 'del-5',
    truckId: 'TRK-CHOC-05',
    driverName: 'Aisha Al-Mansoor',
    orderNumber: 'ORD-CHOC-8820',
    customerName: 'Boutique Chocolatier Zurich',
    destination: 'Airport Cargo Terminal 3',
    distanceKm: 48.0,
    boxesCount: 120,
    chocolateType: 'Assorted Premium Gift Collections',
    status: 'Delivered',
    etaMinutes: 0,
    temperatureCelsius: 17.4,
  },
];

export const INITIAL_QUALITY_BATCHES: QualityBatchRecord[] = [
  {
    batchNumber: 'BATCH-CHOC-2026-084',
    date: 'Today, 10:15 AM',
    recipe: 'Dark 70% Single Origin Ecuadorian',
    appearance: 'Glossy & Uniform',
    shapeAndSeal: 'Hermetically Sealed, Crisp Edge',
    storageTempCelsius: 18.1,
    inspectionResult: 'Passed',
    totalInspected: 1200,
    acceptedCount: 1182,
    rejectedCount: 18,
    inspector: 'Sensor AI + Sarah Jenkins (QC Lead)',
  },
  {
    batchNumber: 'BATCH-CHOC-2026-083',
    date: 'Today, 08:30 AM',
    recipe: 'Alpine Milk Chocolate with Honey',
    appearance: 'Glossy & Uniform',
    shapeAndSeal: 'Perfect Wrapper Alignment',
    storageTempCelsius: 17.9,
    inspectionResult: 'Passed',
    totalInspected: 1500,
    acceptedCount: 1475,
    rejectedCount: 25,
    inspector: 'Sensor AI + Sarah Jenkins (QC Lead)',
  },
  {
    batchNumber: 'BATCH-CHOC-2026-082',
    date: 'Yesterday, 04:45 PM',
    recipe: 'Salted Caramel Silk Bar',
    appearance: 'Slight Surface Haze',
    shapeAndSeal: 'Foil Creased',
    storageTempCelsius: 19.4,
    inspectionResult: 'Flagged',
    totalInspected: 800,
    acceptedCount: 742,
    rejectedCount: 58,
    rejectionReason: 'Minor caramel seepage at corner seal',
    inspector: 'Optical Scanner Bay 1',
  },
];

// Calculation utility based on factory physics & recipe ratios
// 1 chocolate bar = approx. 100g
// Standard chocolate ratio: 50% Cocoa (50g), 30% Sugar (30g), 20% Milk (20ml)
export function calculateFactoryResults(params: FactoryParameters): FactoryCalculationResults {
  const hoursOperationalPerDay = 8;
  const theoreticalHourlyBars = params.productionCapacityBarsPerHour;
  const effectiveEfficiency = Math.max(0.1, Math.min(1.0, params.machineEfficiencyPct / 100));
  const rawProductionBars = theoreticalHourlyBars * hoursOperationalPerDay * effectiveEfficiency;

  // Recipe constraints (in kg / L)
  // Each bar needs: 0.050 kg cocoa, 0.030 kg sugar, 0.020 L milk
  const cocoaPossibleBars = (params.cocoaStockKg / 0.05) || 0;
  const sugarPossibleBars = (params.sugarStockKg / 0.03) || 0;
  const milkPossibleBars = (params.milkStockLitres / 0.02) || 0;
  const packagingPossibleBars = params.packagingStockUnits || 0;

  // Actual production is bottle-necked by machine capacity and available ingredients
  const ingredientCeiling = Math.min(cocoaPossibleBars, sugarPossibleBars, milkPossibleBars, packagingPossibleBars);
  const estimatedProductionBars = Math.round(Math.min(rawProductionBars, ingredientCeiling));

  const rejectionRate = Math.max(0, Math.min(0.5, params.qualityRejectionPct / 100));
  const estimatedRejectedBars = Math.round(estimatedProductionBars * rejectionRate);
  const netGoodBars = Math.max(0, estimatedProductionBars - estimatedRejectedBars);

  const ordersCompleted = Math.min(params.dailyOrders, netGoodBars);
  const ordersDelayed = Math.max(0, params.dailyOrders - ordersCompleted);

  // Replenishment needs
  const cocoaUsed = estimatedProductionBars * 0.05;
  const sugarUsed = estimatedProductionBars * 0.03;
  const milkUsed = estimatedProductionBars * 0.02;
  const packagingUsed = estimatedProductionBars;

  const cocoaReplenishNeededKg = Math.max(0, Math.round(cocoaUsed * 1.5 - (params.cocoaStockKg - cocoaUsed)));
  const sugarReplenishNeededKg = Math.max(0, Math.round(sugarUsed * 1.5 - (params.sugarStockKg - sugarUsed)));
  const milkReplenishNeededLitres = Math.max(0, Math.round(milkUsed * 1.5 - (params.milkStockLitres - milkUsed)));
  const packagingReplenishNeededUnits = Math.max(0, Math.round(packagingUsed * 1.5 - (params.packagingStockUnits - packagingUsed)));

  // Delivery delays: base delay + delay from truck shortage if orders exceed capacity
  const trucksRequired = Math.ceil(ordersCompleted / 1000);
  const truckShortage = Math.max(0, trucksRequired - params.availableTrucks);
  const expectedDeliveryDelaysHours = Number((params.averageTruckDelayHours + truckShortage * 1.2).toFixed(1));

  // Warehouse stock remaining / accumulated
  const warehouseStockBars = Math.max(0, Math.round(12400 + netGoodBars - ordersCompleted));

  // Utilization %
  const machineUtilizationPct = Math.min(100, Math.round((estimatedProductionBars / (theoreticalHourlyBars * hoursOperationalPerDay)) * 100));

  // Financial estimates: $3.50 per chocolate bar wholesale, $0.85 material & utility cost
  const estimatedRevenueUSD = ordersCompleted * 3.5;
  const estimatedOperatingCostUSD = Math.round(estimatedProductionBars * 0.85 + (expectedDeliveryDelaysHours > 1 ? 400 : 0));

  return {
    estimatedProductionBars,
    ordersCompleted,
    ordersDelayed,
    cocoaReplenishNeededKg,
    sugarReplenishNeededKg,
    milkReplenishNeededLitres,
    packagingReplenishNeededUnits,
    expectedDeliveryDelaysHours,
    warehouseStockBars,
    machineUtilizationPct,
    estimatedRejectedBars,
    estimatedRevenueUSD,
    estimatedOperatingCostUSD,
  };
}

interface ChocolateFactoryState {
  // Production runtime state
  isProductionRunning: boolean;
  productionSpeedMultiplier: number;
  totalBarsProducedToday: number;
  selectedZone: string;
  selectedMachineId: string | null;

  // Factory parameters
  parameters: FactoryParameters;
  results: FactoryCalculationResults;

  // Workflow Stages
  stages: ProductionStage[];

  // Active Problem Simulation
  activeProblem: ProblemScenario | null;
  problemResolved: boolean;
  baselineResults: FactoryCalculationResults | null;

  // Plans
  selectedPlanId: 'plan_a' | 'plan_b' | 'plan_c';

  // Quality Scanner
  qualityBatches: QualityBatchRecord[];
  isScanningBatch: boolean;

  // Deliveries
  deliveries: ChocolateDelivery[];

  // Actions
  startProduction: () => void;
  pauseProduction: () => void;
  resumeProduction: () => void;
  updateParameter: <K extends keyof FactoryParameters>(key: K, value: FactoryParameters[K]) => void;
  resetParameters: () => void;
  applyParameters: (newParams: Partial<FactoryParameters>) => void;
  selectZone: (zone: string) => void;
  selectMachine: (machineId: string | null) => void;
  runProblemScenario: (scenarioId: string) => void;
  resolveProblem: () => void;
  applyPlan: (planId: 'plan_a' | 'plan_b' | 'plan_c') => void;
  scanNewBatch: () => QualityBatchRecord;
  advanceDeliveryStatus: (deliveryId: string) => void;
  assignTruckToOrder: (truckId: string, orderNumber: string, destination: string, boxes: number) => void;
  updateStock: (stockType: 'cocoa' | 'sugar' | 'milk' | 'packaging', changeAmount: number) => void;
  resetDemoData: () => void;
}

export const useChocolateFactoryStore = create<ChocolateFactoryState>()(
  persist(
    (set, get) => ({
      isProductionRunning: true,
      productionSpeedMultiplier: 1.0,
      totalBarsProducedToday: 4120,
      selectedZone: 'all',
      selectedMachineId: null,

      parameters: { ...DEFAULT_PARAMETERS },
      results: calculateFactoryResults(DEFAULT_PARAMETERS),

      stages: [...INITIAL_STAGES],
      activeProblem: null,
      problemResolved: false,
      baselineResults: null,

      selectedPlanId: 'plan_a',
      qualityBatches: [...INITIAL_QUALITY_BATCHES],
      isScanningBatch: false,

      deliveries: [...INITIAL_DELIVERIES],

      startProduction: () => {
        set(state => ({
          isProductionRunning: true,
          stages: state.stages.map(s => ({
            ...s,
            status: 'Running',
          })),
        }));
      },

      pauseProduction: () => {
        set(state => ({
          isProductionRunning: false,
          stages: state.stages.map(s => ({
            ...s,
            status: s.id === 'stage-2' || s.id === 'stage-4' ? 'Waiting' : s.status,
          })),
        }));
      },

      resumeProduction: () => {
        set(state => ({
          isProductionRunning: true,
          stages: state.stages.map(s => ({
            ...s,
            status: 'Running',
          })),
        }));
      },

      updateParameter: (key, value) => {
        set(state => {
          const updated = { ...state.parameters, [key]: value };
          return {
            parameters: updated,
            results: calculateFactoryResults(updated),
          };
        });
      },

      resetParameters: () => {
        set({
          parameters: { ...DEFAULT_PARAMETERS },
          results: calculateFactoryResults(DEFAULT_PARAMETERS),
          activeProblem: null,
          problemResolved: false,
          baselineResults: null,
        });
      },

      applyParameters: newParams => {
        set(state => {
          const updated = { ...state.parameters, ...newParams };
          return {
            parameters: updated,
            results: calculateFactoryResults(updated),
          };
        });
      },

      selectZone: zone => {
        set({ selectedZone: zone });
      },

      selectMachine: machineId => {
        set({ selectedMachineId: machineId });
      },

      runProblemScenario: scenarioId => {
        const scenario = PROBLEM_SCENARIOS.find(s => s.id === scenarioId);
        if (!scenario) return;

        set(state => {
          const baseline = { ...state.results };
          const updatedParams = { ...state.parameters, ...scenario.parameterImpacts };
          const newResults = calculateFactoryResults(updatedParams);

          // Update stages to show impact
          const updatedStages = state.stages.map(stage => {
            if (scenario.id === 'machine_breakdown' && stage.id === 'stage-2') {
              return { ...stage, status: 'Needs Attention' as const, progress: 30 };
            }
            if (scenario.id === 'cocoa_shortage' && stage.id === 'stage-1') {
              return { ...stage, status: 'Needs Attention' as const };
            }
            if (scenario.id === 'packaging_shortage' && stage.id === 'stage-4') {
              return { ...stage, status: 'Needs Attention' as const };
            }
            if (scenario.id === 'warm_storage' && stage.id === 'stage-5') {
              return { ...stage, status: 'Needs Attention' as const };
            }
            if (scenario.id === 'truck_delay' && stage.id === 'stage-7') {
              return { ...stage, status: 'Needs Attention' as const };
            }
            return stage;
          });

          return {
            activeProblem: scenario,
            problemResolved: false,
            baselineResults: baseline,
            parameters: updatedParams,
            results: newResults,
            stages: updatedStages,
          };
        });
      },

      resolveProblem: () => {
        set(state => {
          if (!state.activeProblem) return state;
          // Restore healthy parameters with corrected values
          const recoveredParams: FactoryParameters = {
            ...DEFAULT_PARAMETERS,
            dailyOrders: state.parameters.dailyOrders,
            cocoaStockKg: Math.max(state.parameters.cocoaStockKg, 3200),
            packagingStockUnits: Math.max(state.parameters.packagingStockUnits, 8000),
            coldStorageTempCelsius: 17.8,
            machineEfficiencyPct: 91,
            productionCapacityBarsPerHour: 750,
            qualityRejectionPct: 1.6,
            averageTruckDelayHours: 0.3,
            availableTrucks: 5,
          };

          return {
            problemResolved: true,
            parameters: recoveredParams,
            results: calculateFactoryResults(recoveredParams),
            stages: state.stages.map(stage => ({
              ...stage,
              status: 'Running' as const,
              progress: Math.min(100, stage.progress + 15),
            })),
          };
        });
      },

      applyPlan: planId => {
        const plan = FACTORY_PLANS.find(p => p.id === planId);
        if (!plan) return;

        set(state => {
          const updatedParams = { ...state.parameters, ...plan.parameters };
          return {
            selectedPlanId: planId,
            parameters: updatedParams,
            results: calculateFactoryResults(updatedParams),
          };
        });
      },

      scanNewBatch: () => {
        const batchNum = `BATCH-CHOC-2026-${Math.floor(100 + Math.random() * 900)}`;
        const recipes = [
          'Dark 70% Single Origin Ecuadorian',
          'Alpine Milk Chocolate with Honey',
          'Salted Caramel Silk Bar',
          'Hazelnut Roasted Crunch Bar',
          'White Chocolate Vanilla Bean',
        ];
        const chosenRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        const total = 1000 + Math.floor(Math.random() * 500);
        const hasIssue = Math.random() < 0.2;
        const rejected = hasIssue ? Math.floor(total * 0.05) : Math.floor(total * 0.015);
        const accepted = total - rejected;

        const newRecord: QualityBatchRecord = {
          batchNumber: batchNum,
          date: 'Just now',
          recipe: chosenRecipe,
          appearance: hasIssue ? 'Slight Surface Haze' : 'Glossy & Uniform',
          shapeAndSeal: hasIssue ? 'Foil Creased' : 'Hermetically Sealed, Crisp Edge',
          storageTempCelsius: Number((17.5 + Math.random() * 1.5).toFixed(1)),
          inspectionResult: hasIssue ? 'Flagged' : 'Passed',
          totalInspected: total,
          acceptedCount: accepted,
          rejectedCount: rejected,
          rejectionReason: hasIssue ? 'Minor foil edge crease detected during optical feed' : undefined,
          inspector: 'Sensor AI + Sarah Jenkins (QC Lead)',
        };

        set(state => ({
          qualityBatches: [newRecord, ...state.qualityBatches],
        }));

        return newRecord;
      },

      advanceDeliveryStatus: deliveryId => {
        set(state => {
          const transitions: Record<string, ChocolateDelivery['status']> = {
            'Ready for Loading': 'Loaded',
            'Loaded': 'In Transit',
            'In Transit': 'Delivered',
            'Delivered': 'Delivered',
          };

          return {
            deliveries: state.deliveries.map(del => {
              if (del.id !== deliveryId) return del;
              const nextStatus = transitions[del.status] || del.status;
              const nextEta = nextStatus === 'Delivered' ? 0 : Math.max(0, del.etaMinutes - 15);
              return {
                ...del,
                status: nextStatus,
                etaMinutes: nextEta,
              };
            }),
          };
        });
      },

      assignTruckToOrder: (truckId, orderNumber, destination, boxes) => {
        set(state => {
          const newDelivery: ChocolateDelivery = {
            id: `del-${Date.now()}`,
            truckId,
            driverName: 'Assigned Driver',
            orderNumber,
            customerName: `Store Order ${orderNumber}`,
            destination,
            distanceKm: Math.floor(15 + Math.random() * 30),
            boxesCount: boxes,
            chocolateType: 'Fresh Production Mix',
            status: 'Ready for Loading',
            etaMinutes: 60,
            temperatureCelsius: 17.8,
          };

          return {
            deliveries: [newDelivery, ...state.deliveries],
          };
        });
      },

      updateStock: (stockType, changeAmount) => {
        set(state => {
          const p = { ...state.parameters };
          if (stockType === 'cocoa') p.cocoaStockKg = Math.max(0, p.cocoaStockKg + changeAmount);
          if (stockType === 'sugar') p.sugarStockKg = Math.max(0, p.sugarStockKg + changeAmount);
          if (stockType === 'milk') p.milkStockLitres = Math.max(0, p.milkStockLitres + changeAmount);
          if (stockType === 'packaging') p.packagingStockUnits = Math.max(0, p.packagingStockUnits + changeAmount);

          return {
            parameters: p,
            results: calculateFactoryResults(p),
          };
        });
      },

      resetDemoData: () => {
        set({
          parameters: { ...DEFAULT_PARAMETERS },
          results: calculateFactoryResults(DEFAULT_PARAMETERS),
          stages: [...INITIAL_STAGES],
          activeProblem: null,
          problemResolved: false,
          baselineResults: null,
          selectedPlanId: 'plan_a',
          deliveries: [...INITIAL_DELIVERIES],
          qualityBatches: [...INITIAL_QUALITY_BATCHES],
          isProductionRunning: true,
          totalBarsProducedToday: 4120,
        });
      },
    }),
    {
      name: 'chocoflow_factory_storage_v1',
      partialize: state => ({
        parameters: state.parameters,
        selectedPlanId: state.selectedPlanId,
        totalBarsProducedToday: state.totalBarsProducedToday,
      }),
    }
  )
);
