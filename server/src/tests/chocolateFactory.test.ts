import test from 'node:test';
import assert from 'node:assert/strict';

// Core Stoichiometric & Factory Logic Constants
const RECIPE_PER_BAR = {
  cocoaKg: 0.05, // 50g cocoa per 100g chocolate bar
  sugarKg: 0.03, // 30g sugar per 100g chocolate bar
  milkLitre: 0.02, // 20ml milk per 100g chocolate bar
};

function calculateChocolateFactoryOutputs(params: {
  dailyChocolateOrders: number;
  cocoaStockKg: number;
  sugarStockKg: number;
  milkStockLitres: number;
  machineEfficiencyPct: number;
  productionCapacityPerHour: number;
  storageTempCelsius: number;
  availableTrucks: number;
  truckDelayHours: number;
  packagingMaterialStock: number;
  qualityRejectionPct: number;
}) {
  // 1. Calculate material-constrained capacity
  const maxBarsFromCocoa = Math.floor(params.cocoaStockKg / RECIPE_PER_BAR.cocoaKg);
  const maxBarsFromSugar = Math.floor(params.sugarStockKg / RECIPE_PER_BAR.sugarKg);
  const maxBarsFromMilk = Math.floor(params.milkStockLitres / RECIPE_PER_BAR.milkLitre);
  const maxBarsFromPackaging = params.packagingMaterialStock;

  const materialLimit = Math.min(
    maxBarsFromCocoa,
    maxBarsFromSugar,
    maxBarsFromMilk,
    maxBarsFromPackaging
  );

  // 2. Machine output capacity (Standard 8-hour shift)
  const shiftHours = 8;
  const maxMachineCapacity = Math.floor(
    params.productionCapacityPerHour * (params.machineEfficiencyPct / 100) * shiftHours
  );

  // 3. Estimated production
  const targetProduction = Math.min(params.dailyChocolateOrders, maxMachineCapacity, materialLimit);
  const estimatedProductionBars = Math.max(0, targetProduction);

  // 4. Quality rejection
  const estimatedRejectedProducts = Math.round(
    estimatedProductionBars * (params.qualityRejectionPct / 100)
  );
  const salableBars = estimatedProductionBars - estimatedRejectedProducts;

  // 5. Orders completed (Assuming 500 bars per wholesale order)
  const barsPerOrder = 500;
  const ordersCompleted = Math.floor(salableBars / barsPerOrder);
  const totalOrdersExpected = Math.ceil(params.dailyChocolateOrders / barsPerOrder);
  const ordersDelayed = Math.max(0, totalOrdersExpected - ordersCompleted);

  // 6. Replenishment needs
  const replenishmentNeeded: string[] = [];
  if (params.cocoaStockKg < params.dailyChocolateOrders * RECIPE_PER_BAR.cocoaKg) {
    replenishmentNeeded.push('Cocoa');
  }
  if (params.sugarStockKg < params.dailyChocolateOrders * RECIPE_PER_BAR.sugarKg) {
    replenishmentNeeded.push('Sugar');
  }
  if (params.milkStockLitres < params.dailyChocolateOrders * RECIPE_PER_BAR.milkLitre) {
    replenishmentNeeded.push('Milk Ingredients');
  }
  if (params.packagingMaterialStock < params.dailyChocolateOrders) {
    replenishmentNeeded.push('Foil Wrappers & Boxes');
  }

  // 7. Storage risk
  const isStorageTooWarm = params.storageTempCelsius > 18;

  // 8. Expected delivery delay
  const expectedDeliveryDelayHours =
    params.truckDelayHours + (params.availableTrucks < 4 ? (4 - params.availableTrucks) * 1.5 : 0);

  return {
    estimatedProductionBars,
    salableBars,
    estimatedRejectedProducts,
    ordersCompleted,
    ordersDelayed,
    replenishmentNeeded,
    isStorageTooWarm,
    expectedDeliveryDelayHours,
  };
}

test('ChocoFlow AI: Recipe stoichiometry correctly bounds production by limiting ingredient', () => {
  // Scenario: Cocoa is the bottleneck (only 100 kg available = 2,000 bars max)
  const outputs = calculateChocolateFactoryOutputs({
    dailyChocolateOrders: 10000,
    cocoaStockKg: 100, // 100kg / 0.05 = 2000 bars
    sugarStockKg: 500, // 500kg / 0.03 = 16,666 bars
    milkStockLitres: 400, // 400L / 0.02 = 20,000 bars
    machineEfficiencyPct: 90,
    productionCapacityPerHour: 3000,
    storageTempCelsius: 16,
    availableTrucks: 4,
    truckDelayHours: 0,
    packagingMaterialStock: 20000,
    qualityRejectionPct: 2.0,
  });

  assert.equal(outputs.estimatedProductionBars, 2000, 'Production must be capped at 2,000 bars due to cocoa limitation');
  assert.ok(outputs.replenishmentNeeded.includes('Cocoa'), 'Replenishment alert must identify Cocoa deficit');
  assert.equal(outputs.isStorageTooWarm, false, '16°C storage is optimal');
});

test('ChocoFlow AI: Machine efficiency reduction limits production output', () => {
  // Scenario: Conche breakdown reduces efficiency to 40% (3,000 * 0.40 * 8 = 9,600 bars max)
  const outputs = calculateChocolateFactoryOutputs({
    dailyChocolateOrders: 14000,
    cocoaStockKg: 1500,
    sugarStockKg: 1000,
    milkStockLitres: 800,
    machineEfficiencyPct: 40, // Reduced from 85%
    productionCapacityPerHour: 3000,
    storageTempCelsius: 16,
    availableTrucks: 4,
    truckDelayHours: 0,
    packagingMaterialStock: 20000,
    qualityRejectionPct: 2.0,
  });

  assert.equal(outputs.estimatedProductionBars, 9600, 'Production must be capped at 9,600 bars due to machine constraint');
  assert.ok(outputs.ordersDelayed > 0, 'Orders must be delayed when demand (14,000) exceeds machine capacity (9,600)');
});

test('ChocoFlow AI: Quality scanner rejection rate accurately computes salable inventory', () => {
  // Scenario: 10,000 bars with 3.0% rejection rate
  const outputs = calculateChocolateFactoryOutputs({
    dailyChocolateOrders: 10000,
    cocoaStockKg: 1000,
    sugarStockKg: 600,
    milkStockLitres: 500,
    machineEfficiencyPct: 90,
    productionCapacityPerHour: 3000,
    storageTempCelsius: 16,
    availableTrucks: 4,
    truckDelayHours: 0,
    packagingMaterialStock: 15000,
    qualityRejectionPct: 3.0,
  });

  assert.equal(outputs.estimatedRejectedProducts, 300, '3.0% of 10,000 bars is exactly 300 rejected bars');
  assert.equal(outputs.salableBars, 9700, 'Salable bars must be 9,700');
});

test('ChocoFlow AI: Temperature warning triggers above 18 degrees Celsius', () => {
  const coldOutputs = calculateChocolateFactoryOutputs({
    dailyChocolateOrders: 5000,
    cocoaStockKg: 500,
    sugarStockKg: 300,
    milkStockLitres: 200,
    machineEfficiencyPct: 90,
    productionCapacityPerHour: 3000,
    storageTempCelsius: 16.5,
    availableTrucks: 4,
    truckDelayHours: 0,
    packagingMaterialStock: 10000,
    qualityRejectionPct: 2.0,
  });
  assert.equal(coldOutputs.isStorageTooWarm, false, '16.5°C should not flag warning');

  const warmOutputs = calculateChocolateFactoryOutputs({
    dailyChocolateOrders: 5000,
    cocoaStockKg: 500,
    sugarStockKg: 300,
    milkStockLitres: 200,
    machineEfficiencyPct: 90,
    productionCapacityPerHour: 3000,
    storageTempCelsius: 22.0, // High temperature!
    availableTrucks: 4,
    truckDelayHours: 0,
    packagingMaterialStock: 10000,
    qualityRejectionPct: 2.0,
  });
  assert.equal(warmOutputs.isStorageTooWarm, true, '22.0°C must trigger warm storage alert to prevent chocolate fat bloom');
});
