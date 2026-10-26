import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Truck,
  Package,
  Layers,
  Thermometer,
  Zap,
} from 'lucide-react';
import { useChocolateFactoryStore, FactoryParameters } from './chocolateFactoryStore.js';

export const FactoryParametersPage: React.FC = () => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const updateParameter = useChocolateFactoryStore(s => s.updateParameter);
  const resetParameters = useChocolateFactoryStore(s => s.resetParameters);
  const applyParameters = useChocolateFactoryStore(s => s.applyParameters);

  // Local draft state for inputs
  const [draft, setDraft] = useState<FactoryParameters>({ ...params });
  const [hasChanges, setHasChanges] = useState(false);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  const handleFieldChange = <K extends keyof FactoryParameters>(key: K, val: number) => {
    const updated = { ...draft, [key]: Math.max(0, val) };
    setDraft(updated);
    setHasChanges(true);
    // Real-time reactive updates
    updateParameter(key, Math.max(0, val));
  };

  const handleRunSimulation = () => {
    applyParameters(draft);
    setHasChanges(false);
    setSimulatedNotice('Simulation executed successfully: dependent factory formulas recalculated.');
    setTimeout(() => setSimulatedNotice(null), 4000);
  };

  const handleResetValues = () => {
    resetParameters();
    setDraft({ ...params });
    setHasChanges(false);
    setSimulatedNotice('All factory parameters restored to default demo baseline.');
    setTimeout(() => setSimulatedNotice(null), 4000);
  };

  const handleApplyChanges = () => {
    applyParameters(draft);
    setHasChanges(false);
    setSimulatedNotice('Changes applied to live 3D factory & warehouse simulation.');
    setTimeout(() => setSimulatedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Interactive Factory Parameters
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATOR CONTROL ROOM
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Modify raw material reserves, machine capacity, storage temperature, and logistics fleet. Formulas dynamically recalculate expected chocolate bar output and backlogs in real time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRunSimulation}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Simulation</span>
          </button>

          <button
            onClick={handleApplyChanges}
            disabled={!hasChanges}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-all ${
              hasChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>

          <button
            onClick={handleResetValues}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Values</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {simulatedNotice && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{simulatedNotice}</span>
        </div>
      )}

      {/* Parameter Control Sliders & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Controls (Col 1-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section A: Demand & Capacity */}
          <div className="p-5 rounded-2xl bg-[#160D08] border border-amber-500/20 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Production & Order Demand</span>
            </h3>

            <div className="space-y-4">
              {/* Daily Orders */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">Daily Chocolate Orders</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {draft.dailyOrders.toLocaleString()} bars/day
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={12000}
                  step={100}
                  value={draft.dailyOrders}
                  onChange={e => handleFieldChange('dailyOrders', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-0.5">
                  <span>500 bars</span>
                  <span>12,000 bars</span>
                </div>
              </div>

              {/* Production Capacity */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">Production Speed Capacity</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {draft.productionCapacityBarsPerHour} bars/hour
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={1500}
                  step={50}
                  value={draft.productionCapacityBarsPerHour}
                  onChange={e => handleFieldChange('productionCapacityBarsPerHour', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-0.5">
                  <span>300 bars/h</span>
                  <span>1,500 bars/h</span>
                </div>
              </div>

              {/* Machine Efficiency */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">Machine Efficiency Percentage</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {draft.machineEfficiencyPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={1}
                  value={draft.machineEfficiencyPct}
                  onChange={e => handleFieldChange('machineEfficiencyPct', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-0.5">
                  <span>20% (Degraded)</span>
                  <span>100% (Maximum)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Ingredients & Packaging Stock */}
          <div className="p-5 rounded-2xl bg-[#160D08] border border-amber-500/20 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Ingredient Stock & Packaging</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cocoa Stock */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-xs text-gray-300 block mb-1 font-medium">Cocoa Beans Reserve</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={20000}
                    step={100}
                    value={draft.cocoaStockKg}
                    onChange={e => handleFieldChange('cocoaStockKg', Number(e.target.value))}
                    className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                  />
                  <span className="text-xs text-amber-400 font-mono font-bold">kg</span>
                </div>
              </div>

              {/* Sugar Stock */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-xs text-gray-300 block mb-1 font-medium">Fine Sugar Reserve</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={15000}
                    step={100}
                    value={draft.sugarStockKg}
                    onChange={e => handleFieldChange('sugarStockKg', Number(e.target.value))}
                    className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                  />
                  <span className="text-xs text-amber-400 font-mono font-bold">kg</span>
                </div>
              </div>

              {/* Milk Stock */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-xs text-gray-300 block mb-1 font-medium">Milk Concentrate</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={12000}
                    step={100}
                    value={draft.milkStockLitres}
                    onChange={e => handleFieldChange('milkStockLitres', Number(e.target.value))}
                    className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                  />
                  <span className="text-xs text-amber-400 font-mono font-bold">Litres</span>
                </div>
              </div>

              {/* Packaging Material Stock */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-xs text-gray-300 block mb-1 font-medium">Foil Wrappers Stock</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={30000}
                    step={500}
                    value={draft.packagingStockUnits}
                    onChange={e => handleFieldChange('packagingStockUnits', Number(e.target.value))}
                    className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                  />
                  <span className="text-xs text-amber-400 font-mono font-bold">Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Storage & Logistics Fleet */}
          <div className="p-5 rounded-2xl bg-[#160D08] border border-amber-500/20 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Storage Temperature & Delivery Fleet</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Cold Storage Temp */}
              <div>
                <span className="text-xs text-gray-300 block mb-1 font-medium">Storage Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  min={10}
                  max={30}
                  value={draft.coldStorageTempCelsius}
                  onChange={e => handleFieldChange('coldStorageTempCelsius', Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Ideal: 16-19°C</span>
              </div>

              {/* Available Trucks */}
              <div>
                <span className="text-xs text-gray-300 block mb-1 font-medium">Available Trucks</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={draft.availableTrucks}
                  onChange={e => handleFieldChange('availableTrucks', Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Refrigerated</span>
              </div>

              {/* Rejection Rate */}
              <div>
                <span className="text-xs text-gray-300 block mb-1 font-medium">Quality Rejection %</span>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={25}
                  value={draft.qualityRejectionPct}
                  onChange={e => handleFieldChange('qualityRejectionPct', Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Standard: 1.5 - 2.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Explanations (Col 8-12) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/25 shadow-xl space-y-5 sticky top-20">
            <div className="border-b border-amber-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Calculated Factory Results
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                Automatically updated from recipe stoichiometry and machine kinematics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Estimated Production */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Estimated Production</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  {results.estimatedProductionBars.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-400 font-mono">chocolate bars</span>
              </div>

              {/* Orders Completed */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Orders Completed</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {results.ordersCompleted.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {results.ordersDelayed > 0 ? `${results.ordersDelayed} delayed` : '0 delayed'}
                </span>
              </div>

              {/* Warehouse Stock */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Warehouse Stock</span>
                <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                  {results.warehouseStockBars.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">bars in cold room</span>
              </div>

              {/* Machine Utilization */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Machine Utilization</span>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                  {results.machineUtilizationPct}%
                </div>
                <span className="text-[10px] text-gray-400 font-mono">of 8h rated speed</span>
              </div>

              {/* Expected Delivery Delay */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Avg Delivery Delay</span>
                <div
                  className={`text-xl font-bold font-mono mt-0.5 ${
                    results.expectedDeliveryDelaysHours > 1 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {results.expectedDeliveryDelaysHours} hrs
                </div>
                <span className="text-[10px] text-gray-400 font-mono">fleet transit time</span>
              </div>

              {/* Estimated Rejected */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/20">
                <span className="text-[11px] text-gray-400 block">Estimated Rejections</span>
                <div className="text-xl font-bold font-mono text-amber-200 mt-0.5">
                  {results.estimatedRejectedBars.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">recycled into remelt</span>
              </div>
            </div>

            {/* Replenishment Alert Box */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2 text-xs">
              <span className="font-mono font-bold text-amber-300 block">
                Ingredient Replenishment Recommendation:
              </span>
              <ul className="space-y-1 text-gray-300 list-disc list-inside">
                <li>
                  Cocoa replenishment needed:{' '}
                  <strong className="text-amber-200">{results.cocoaReplenishNeededKg} kg</strong>
                </li>
                <li>
                  Sugar replenishment needed:{' '}
                  <strong className="text-amber-200">{results.sugarReplenishNeededKg} kg</strong>
                </li>
                <li>
                  Milk replenishment needed:{' '}
                  <strong className="text-amber-200">{results.milkReplenishNeededLitres} L</strong>
                </li>
              </ul>
            </div>

            {/* Simple English Formula Explanation */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400 space-y-1.5 leading-relaxed">
              <div className="text-amber-400 font-mono font-bold">Calculation Rule (Simple English):</div>
              <p>
                Each chocolate bar requires 50g cocoa, 30g sugar, and 20ml milk. Total output is the minimum of machine throughput (Capacity × Efficiency × 8h) and available ingredients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
