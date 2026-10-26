import React, { useState } from 'react';
import {
  Boxes,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  RotateCcw,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useChocolateFactoryStore } from './chocolateFactoryStore.js';

export const WarehouseStoragePage: React.FC = () => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const updateStock = useChocolateFactoryStore(s => s.updateStock);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  // Modal / Quick Adjust State
  const [selectedStock, setSelectedStock] = useState<'cocoa' | 'sugar' | 'milk' | 'packaging'>('cocoa');
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isWarmStorage = activeProblem?.id === 'warm_storage';

  const handleStockUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStock(selectedStock, adjustAmount);
    setIsModalOpen(false);
  };

  const inventoryItems = [
    {
      id: 'cocoa',
      name: 'Organic Cocoa Beans Reserve',
      category: 'Raw Material',
      current: params.cocoaStockKg,
      unit: 'kg',
      minThreshold: 1500,
      capacity: 6000,
      description: 'Single-origin Ecuadorian cocoa beans in jute storage silos.',
      color: 'bg-amber-600',
    },
    {
      id: 'sugar',
      name: 'Fine Crystalline Sugar',
      category: 'Raw Material',
      current: params.sugarStockKg,
      unit: 'kg',
      minThreshold: 1200,
      capacity: 5000,
      description: 'Food-grade refined sugar stored in pneumatic silos.',
      color: 'bg-amber-400',
    },
    {
      id: 'milk',
      name: 'Milk Concentrate & Dairy',
      category: 'Liquid Dairy',
      current: params.milkStockLitres,
      unit: 'Litres',
      minThreshold: 1000,
      capacity: 4000,
      description: 'Chilled condensed milk stored in stainless steel jacketed tanks at 4°C.',
      color: 'bg-blue-400',
    },
    {
      id: 'packaging',
      name: 'Protective Gold Foil Wrappers',
      category: 'Packaging Supply',
      current: params.packagingStockUnits,
      unit: 'Wrappers',
      minThreshold: 3000,
      capacity: 25000,
      description: 'Hermetic barrier gold wrapping rolls for flow wrapper line.',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Chocolate Storage & Warehouse Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              COLD CHAIN WAREHOUSE
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Monitor raw ingredient stock, finished chocolate inventory, cold room climate sensors, and reorder levels. Adjust stock quantities directly to simulate replenishments.
          </p>
        </div>

        {/* Update Stock Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Update Stock Inventory</span>
        </button>
      </div>

      {/* Finished Goods Cold Storage Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Finished Chocolate Inventory */}
        <div className="p-5 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Finished Chocolate Inventory</span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {results.warehouseStockBars.toLocaleString()}
          </div>
          <span className="text-xs text-amber-300 font-mono block">
            {Math.floor(results.warehouseStockBars / 24).toLocaleString()} wholesale cartons (24-ct)
          </span>
        </div>

        {/* Card 2: Cold Room Storage Climate */}
        <div
          className={`p-5 rounded-2xl border shadow-xl space-y-2 ${
            isWarmStorage
              ? 'bg-red-950/40 border-red-500/40'
              : 'bg-[#160D08] border-amber-500/20'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Storage Temperature</span>
            <Thermometer
              className={`w-4 h-4 ${isWarmStorage ? 'text-red-400 animate-bounce' : 'text-blue-400'}`}
            />
          </div>
          <div
            className={`text-2xl font-bold font-mono ${
              isWarmStorage ? 'text-red-300' : 'text-cyan-300'
            }`}
          >
            {params.coldStorageTempCelsius.toFixed(1)}°C
          </div>
          <span className="text-xs font-mono text-gray-300 block">
            Target Safe Window: 16°C — 19°C (Humidity: 48% RH)
          </span>
        </div>

        {/* Card 3: Orders Awaiting Dispatch */}
        <div className="p-5 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Orders Completed Today</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {results.ordersCompleted.toLocaleString()}
          </div>
          <span className="text-xs text-gray-400 font-mono block">
            {results.ordersDelayed > 0 ? `${results.ordersDelayed} delayed due to capacity` : 'All scheduled orders staged'}
          </span>
        </div>
      </div>

      {/* Raw Ingredients & Packaging Inventory Cards */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
          <h2 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
            Ingredient Reserves & Reorder Thresholds
          </h2>
          <span className="text-xs text-gray-400 font-mono">Live Mass Balance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inventoryItems.map(item => {
            const isLow = item.current < item.minThreshold;
            const pct = Math.min(100, Math.round((item.current / item.capacity) * 100));

            return (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#20120A] border border-amber-500/15 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                      {item.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isLow
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isLow ? 'LOW STOCK ALERT' : 'HEALTHY'}
                  </span>
                </div>

                <p className="text-xs text-gray-300/80 leading-relaxed">{item.description}</p>

                {/* Progress Bar of Stock Level */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">
                      Current: <strong className="text-white">{item.current.toLocaleString()} {item.unit}</strong>
                    </span>
                    <span className="text-amber-300 font-bold">{pct}% of Capacity</span>
                  </div>
                  <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-red-500' : item.color
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Reorder Alert: {item.minThreshold.toLocaleString()} {item.unit}</span>
                    <span>Max Silo: {item.capacity.toLocaleString()} {item.unit}</span>
                  </div>
                </div>

                {/* Quick Add/Subtract Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <span className="text-[11px] text-gray-400">Quick Restock:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateStock(item.id as any, -200)}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono"
                    >
                      -200
                    </button>
                    <button
                      onClick={() => updateStock(item.id as any, 500)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold"
                    >
                      +500 {item.unit}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Update Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1E110A] border border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight">
                Update Simulated Inventory
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">
                  Select Ingredient / Material
                </label>
                <select
                  value={selectedStock}
                  onChange={e => setSelectedStock(e.target.value as any)}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="cocoa">Organic Cocoa Beans (kg)</option>
                  <option value="sugar">Fine Sugar (kg)</option>
                  <option value="milk">Milk Concentrate (Litres)</option>
                  <option value="packaging">Gold Foil Wrappers (Units)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">
                  Adjustment Amount (+ to add replenishment, - to deplete)
                </label>
                <input
                  type="number"
                  step={50}
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                >
                  Apply Stock Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
