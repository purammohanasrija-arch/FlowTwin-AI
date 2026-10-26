import React from 'react';
import {
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Package,
  Layers,
  Truck,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useChocolateFactoryStore, FACTORY_PLANS, FactoryPlan } from './chocolateFactoryStore.js';

export const ComparePlansPage: React.FC = () => {
  const selectedPlanId = useChocolateFactoryStore(s => s.selectedPlanId);
  const applyPlan = useChocolateFactoryStore(s => s.applyPlan);

  const chartData = FACTORY_PLANS.map(plan => ({
    name: plan.id === 'plan_a' ? 'Plan A (Normal)' : plan.id === 'plan_b' ? 'Plan B (Breakdown)' : 'Plan C (High Demand)',
    Production: plan.expectedProductionBars,
    Completed: plan.ordersCompleted,
    Delayed: plan.ordersDelayed,
    Cost: plan.estimatedOperatingCostUSD,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Compare Factory Plans (Three Possible Futures)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              STRATEGY PLANNER
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Evaluate how factory output, ingredient usage, logistics capacity, and operational costs shift under three realistic operational futures. Select any plan to apply its settings to the digital twin.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5">
          <Info className="w-4 h-4 text-amber-400" />
          <span>Formulas: Mass balance & machine throughput rules</span>
        </div>
      </div>

      {/* 3 Comparison Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {FACTORY_PLANS.map(plan => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-gradient-to-b from-[#382014] to-[#20110A] border-amber-400 shadow-2xl shadow-amber-500/20 ring-2 ring-amber-500/40'
                  : 'bg-[#180E09] border-amber-500/20 hover:border-amber-400/40 hover:bg-[#22130C]'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                      {plan.tagline}
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                      {plan.name}
                    </h2>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      <span>ACTIVE</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-300/90 leading-relaxed font-sans">
                  {plan.description}
                </p>

                {/* Key Metrics Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-amber-500/15 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Expected Production</span>
                    <span className="font-mono font-bold text-white">
                      {plan.expectedProductionBars.toLocaleString()} bars
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Orders Completed</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {plan.ordersCompleted.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Orders Delayed</span>
                    <span
                      className={`font-mono font-bold ${
                        plan.ordersDelayed > 0 ? 'text-red-400' : 'text-gray-400'
                      }`}
                    >
                      {plan.ordersDelayed.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Delivery Capacity</span>
                    <span className="font-mono font-bold text-amber-200">
                      {plan.deliveryCapacityLoads} truck loads
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Material Requirement</span>
                    <span className="font-mono text-[11px] text-amber-300">
                      {plan.cocoaNeededKg}kg cocoa • {plan.milkNeededLitres}L milk
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded bg-black/25">
                    <span className="text-gray-300">Operating Cost</span>
                    <span className="font-mono font-bold text-amber-300">
                      ${plan.estimatedOperatingCostUSD.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Select & Apply Plan Button */}
              <div className="pt-6">
                <button
                  onClick={() => applyPlan(plan.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/25 cursor-default'
                      : 'bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-500/30'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Currently Applied to Factory</span>
                    </>
                  ) : (
                    <>
                      <span>Apply {plan.name.split('—')[0]} Conditions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Visual Comparison Chart */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
              Production Output & Cost Comparison
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Deterministic rule-based forecast calculated across the three factory plans.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Formula Verified
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#382014" />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#D1D5DB', fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#D1D5DB', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E100A',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  borderRadius: '10px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ color: '#F3F4F6', fontSize: '12px' }} />
              <Bar dataKey="Production" fill="#F59E0B" name="Production (Bars)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" fill="#10B981" name="Orders Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Delayed" fill="#EF4444" name="Orders Delayed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cost" fill="#D97706" name="Operating Cost ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
