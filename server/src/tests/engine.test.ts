import test from 'node:test';
import assert from 'node:assert/strict';
import { SimulationEngine } from '../services/simulation/simulationEngine.js';
import { DocumentIntelligenceAgent, ShipmentRiskAnalysisAgent, ValidationAgent } from '../agents/index.js';

test('SimulationEngine calculates deterministic delay impact for road closure', () => {
  const dummyShipments = [
    {
      shipmentId: 'SH-TEST-1',
      status: 'in_transit',
      origin: { name: 'Chicago, IL' },
      destination: { name: 'New York, NY' },
      routeId: 'I-80',
      plannedPickup: new Date(),
      plannedDelivery: new Date(Date.now() + 10 * 3600 * 1000),
      delayHours: 0,
    },
    {
      shipmentId: 'SH-TEST-2',
      status: 'delivered',
      origin: { name: 'Dallas, TX' },
      destination: { name: 'Atlanta, GA' },
      routeId: 'I-20',
      plannedPickup: new Date(),
      plannedDelivery: new Date(),
      delayHours: 0,
    },
  ];

  const result = SimulationEngine.simulate(
    'Test Corridor Closure',
    {
      type: 'road_closure',
      title: 'I-80 Closure',
      description: 'Closure for 8 hours',
      routeCorridor: 'I-80',
      severity: 'high',
      durationHours: 8,
    },
    dummyShipments
  );

  assert.equal(result.affectedShipmentIds.length, 1);
  assert.equal(result.affectedShipmentIds[0], 'SH-TEST-1');
  assert.ok(result.metrics.averageDelayHours > 0, 'Average delay should be greater than 0');
  assert.ok(result.metrics.estimatedExtraCostUSD > 0, 'Estimated cost should be positive');
  assert.equal(result.candidatePlans.length, 3, 'Should generate 3 candidate recovery plans');
});

test('ShipmentRiskAnalysisAgent computes calibrated score based on factors', async () => {
  const highRiskShipment = {
    shipmentId: 'SH-CRIT-1',
    status: 'delayed',
    delayHours: 5,
    priority: 'critical',
    temperatureControlled: true,
    plannedPickup: new Date(),
    plannedDelivery: new Date(Date.now() + 3600 * 1000 * 2),
  };

  const analysis = await ShipmentRiskAnalysisAgent.execute(highRiskShipment);
  assert.ok(analysis.riskScore >= 70, `Expected high risk score, got ${analysis.riskScore}`);
  assert.equal(analysis.riskLevel, 'critical');
  assert.ok(analysis.riskFactors.length >= 3, 'Should have multiple identified risk factors');
});

test('DocumentIntelligenceAgent parses structured attributes from unstructured text', async () => {
  const sampleDocText = `
    FREIGHT WAYBILL & CARGO MANIFEST
    Consignment Code: SH-7741
    Customer PO: ORD-33100
    Origin: Chicago Distribution Center
    Destination: New York Atlantic Gateway
    Gross Weight: 15,200 kg
    Assigned Transporter: Apex Freight Dynamics
  `;

  const result = await DocumentIntelligenceAgent.execute(sampleDocText, 'manifest_7741.txt');
  assert.equal(result.validationStatus, 'valid');
  const shipField = result.fields.find(f => f.fieldName === 'shipmentId');
  assert.equal(shipField?.value, 'SH-7741');
});

test('ValidationAgent checks role permissions and operational constraints', async () => {
  const plan = {
    planCode: 'REC-TEST-1',
    title: 'Test Recovery Plan',
    unresolvedRisks: [],
  };

  const managerCheck = await ValidationAgent.execute(plan, 'Logistics Manager');
  assert.equal(managerCheck.authorizationApproved, true, 'Logistics Manager should be authorized');

  const viewerCheck = await ValidationAgent.execute(plan, 'Viewer');
  assert.equal(viewerCheck.authorizationApproved, false, 'Viewer should NOT be authorized to approve');
});
