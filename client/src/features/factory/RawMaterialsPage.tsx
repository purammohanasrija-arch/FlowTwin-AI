import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
  Droplets,
  Package,
  TrendingDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useChocolateFactoryStore } from './chocolateFactoryStore.js';

export const RawMaterialsPage: React.FC = () => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const updateStock = useChocolateFactoryStore(s => s.updateStock);

  const [activeTab, setActiveTab] = useState<'all' | 'cocoa' | 'sugar' | 'milk'>('all');

  const materials = [
    {
      id: 'cocoa',
      name: 'Single-Origin Cocoa Beans & Nibs',
      category: 'Organic Ecuadorian Arriba Nacional',
      stockKg: params.cocoaStockKg,
      dailyUsageKg: Math.round(results.estimatedProductionBars * 0.05),
      moisturePct: '4.2%',
      qualityGrade: 'Grade AA Certified Fair Trade',
      supplier: 'Hacienda San José Fair Trade Co-op',
      replenishNeededKg: results.cocoaReplenishNeededKg,
      unit: 'kg',
      siloCapacityKg: 6000,
      description: 'Carefully fermented and sun-dried beans. Provides rich floral notes, low astringency, and high cocoa butter content for silky texture.',
    },
    {
      id: 'sugar',
      name: 'Ultra-Fine Pure Cane Sugar',
      category: 'Pharmaceutical-Grade Crystalline Sugar',
      stockKg: params.sugarStockKg,
      dailyUsageKg: Math.round(results.estimatedProductionBars * 0.03),
      moisturePct: '0.04%',
      qualityGrade: '120 µm Micro-Refined',
      supplier: 'Sweet Harvest Milling Ltd.',
      replenishNeededKg: results.sugarReplenishNeededKg,
      unit: 'kg',
      siloCapacityKg: 5000,
      description: 'Milled to 120 microns to dissolve seamlessly during conching without causing tongue grittiness.',
    },
    {
      id: 'milk',
      name: 'Pasteurized Whole Milk Concentrate',
      category: 'Swiss Alps Dairy Cream & Whey Solids',
      stockKg: params.milkStockLitres,
      dailyUsageKg: Math.round(results.estimatedProductionBars * 0.02),
      moisturePct: '12.5% (Concentrated)',
      qualityGrade: 'AOP Verified Non-GMO',
      supplier: 'Alpine Heritage Valley Creameries',
      replenishNeededKg: results.milkReplenishNeededLitres,
      unit: 'Litres',
      siloCapacityKg: 4000,
      description: 'Slow-condensed whole milk giving caramelization undertones and creamy mouthfeel to milk chocolate batches.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Raw Materials — Cocoa, Sugar & Milk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              INGREDIENT INTAKE & SILOS
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Track certified organic cocoa beans, refined caster sugar, and dairy milk ingredients. Monitor daily consumption rates against production schedules and calculate replenishment thresholds.
          </p>
        </div>

        {/* Quick Replenish Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              updateStock('cocoa', 1000);
              updateStock('sugar', 800);
              updateStock('milk', 600);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Restock All Silos (+Bulk)</span>
          </button>
        </div>
      </div>

      {/* Material Stock Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materials.map(mat => {
          const isLow = mat.stockKg < 1500;
          const pct = Math.min(100, Math.round((mat.stockKg / mat.siloCapacityKg) * 100));

          return (
            <div
              key={mat.id}
              className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      {mat.category}
                    </span>
                    <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {mat.name}
                    </h2>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isLow
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isLow ? 'LOW STOCK' : 'OPTIMAL'}
                  </span>
                </div>

                <p className="text-xs text-gray-300/80 leading-relaxed font-sans">
                  {mat.description}
                </p>

                {/* Stock Gauge */}
                <div className="space-y-1.5 pt-2 border-t border-amber-500/15">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">Available:</span>
                    <span className="text-amber-300 font-bold">
                      {mat.stockKg.toLocaleString()} {mat.unit}
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Daily Burn: {mat.dailyUsageKg} {mat.unit}</span>
                    <span>{pct}% Capacity</span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moisture Content:</span>
                    <span className="font-mono text-amber-200">{mat.moisturePct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality Spec:</span>
                    <span className="font-mono text-white text-[11px] truncate max-w-[150px]">
                      {mat.qualityGrade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Supplier:</span>
                    <span className="font-mono text-gray-200 text-[11px] truncate max-w-[150px]">
                      {mat.supplier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Replenish Buttons */}
              <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between">
                <span className="text-xs text-gray-400">Add Stock:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateStock(mat.id as any, 250)}
                    className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold"
                  >
                    +250 {mat.unit}
                  </button>
                  <button
                    onClick={() => updateStock(mat.id as any, 1000)}
                    className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold shadow"
                  >
                    +1,000 {mat.unit}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stoichiometric Recipe Formula Card */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
            Standard Chocolate Mass Balance (Recipe Conversion Ratio)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
            <span className="text-amber-400 font-bold block mb-0.5">50% Cocoa Solids</span>
            <span className="text-gray-300">50 grams cocoa beans per 100g bar</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
            <span className="text-amber-300 font-bold block mb-0.5">30% Fine Sugar</span>
            <span className="text-gray-300">30 grams refined sugar per 100g bar</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
            <span className="text-blue-300 font-bold block mb-0.5">20% Dairy Ingredients</span>
            <span className="text-gray-300">20 ml milk concentrate per 100g bar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
