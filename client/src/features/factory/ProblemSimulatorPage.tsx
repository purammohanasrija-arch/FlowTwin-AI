import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  CheckCircle,
  RotateCcw,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Package,
  Layers,
  Thermometer,
  Truck,
  Sparkles,
} from 'lucide-react';
import {
  useChocolateFactoryStore,
  PROBLEM_SCENARIOS,
  ProblemScenario,
} from './chocolateFactoryStore.js';

export const ProblemSimulatorPage: React.FC = () => {
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);
  const problemResolved = useChocolateFactoryStore(s => s.problemResolved);
  const baselineResults = useChocolateFactoryStore(s => s.baselineResults);
  const currentResults = useChocolateFactoryStore(s => s.results);
  const runProblemScenario = useChocolateFactoryStore(s => s.runProblemScenario);
  const resolveProblem = useChocolateFactoryStore(s => s.resolveProblem);
  const resetParameters = useChocolateFactoryStore(s => s.resetParameters);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeProblem?.id || PROBLEM_SCENARIOS[0].id
  );

  const activeOrSelected =
    PROBLEM_SCENARIOS.find(s => s.id === selectedScenarioId) || PROBLEM_SCENARIOS[0];

  const isCurrentActiveRunning = activeProblem?.id === activeOrSelected.id && !problemResolved;

  const handleRun = () => {
    runProblemScenario(activeOrSelected.id);
  };

  const handleResolve = () => {
    resolveProblem();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Factory Problem Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
              DISRUPTION & RESILIENCE LAB
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Simulate realistic chocolate factory disruptions—such as cocoa bean shortages, tempering failures, warm storage, or delivery traffic holds—and evaluate operational recovery playbooks.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          {isCurrentActiveRunning ? (
            <button
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Resolve Problem</span>
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
            >
              <Play className="w-4 h-4" />
              <span>Run Scenario</span>
            </button>
          )}

          <button
            onClick={resetParameters}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Factory</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Carousel / Pills */}
      <div className="p-4 rounded-2xl bg-[#1A0E08] border border-amber-500/20 overflow-x-auto">
        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-3">
          Select Disruption Scenario (7 Operational Problems)
        </div>
        <div className="flex items-center gap-2.5 min-w-[850px] pb-1">
          {PROBLEM_SCENARIOS.map(sc => {
            const isSelected = selectedScenarioId === sc.id;
            const isActiveInFactory = activeProblem?.id === sc.id && !problemResolved;

            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`flex-1 p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-[#382014] border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                    : 'bg-[#20120B] border-amber-500/15 hover:border-amber-400/40 hover:bg-[#28160D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">
                    {sc.category}
                  </span>
                  {isActiveInFactory && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white tracking-tight leading-snug">
                  {sc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scenario Details & Before-and-After Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Breakdown Card (Col 1-7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-start justify-between border-b border-amber-500/15 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                Selected Incident Analysis
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {activeOrSelected.title}
              </h2>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isCurrentActiveRunning
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : problemResolved && activeProblem?.id === activeOrSelected.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}
            >
              {isCurrentActiveRunning
                ? 'CRITICAL INCIDENT ACTIVE'
                : problemResolved && activeProblem?.id === activeOrSelected.id
                ? 'INCIDENT RESOLVED'
                : 'READY TO SIMULATE'}
            </span>
          </div>

          {/* Structured Problem Breakdown Table */}
          <div className="space-y-3.5 text-xs">
            {/* 1. What Happened? */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
              <div className="font-mono font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>What Happened?</span>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">
                {activeOrSelected.whatHappened}
              </p>
            </div>

            {/* 2. Affected Area & Delays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-amber-400 font-mono font-bold block mb-1">
                  Which Factory Area is Affected?
                </span>
                <span className="text-white font-medium">{activeOrSelected.affectedArea}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
                <span className="text-amber-400 font-mono font-bold block mb-1">
                  How Much Production Delayed?
                </span>
                <span className="text-white font-medium">{activeOrSelected.productionDelay}</span>
              </div>
            </div>

            {/* 3. Affected Orders */}
            <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15">
              <span className="text-amber-400 font-mono font-bold block mb-1">
                Which Orders May Be Affected?
              </span>
              <span className="text-white font-medium">{activeOrSelected.affectedOrders}</span>
            </div>

            {/* 4. Manager Recommended Action */}
            <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1.5">
              <div className="font-mono font-bold text-amber-300 uppercase tracking-wider">
                What Should the Manager Do? (Recommended Playbook)
              </div>
              <pre className="text-amber-100 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {activeOrSelected.recommendedAction}
              </pre>
            </div>

            {/* 5. What Changes After Action */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <div className="font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>What Changes After Recommended Action?</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                {activeOrSelected.changesAfterAction}
              </p>
            </div>
          </div>
        </div>

        {/* Before-and-After Performance Comparison (Col 8-12) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/25 shadow-xl space-y-5">
            <div className="border-b border-amber-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Factory Performance Impact
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time formula calculation comparing baseline vs active problem state.
              </p>
            </div>

            {/* Comparison Metrics Cards */}
            <div className="space-y-3 text-xs">
              {/* Output Bars */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[11px] block">Daily Output</span>
                  <span className="font-mono font-bold text-white text-base">
                    {currentResults.estimatedProductionBars.toLocaleString()} bars
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">Baseline</span>
                  <span className="font-mono text-gray-300">
                    {(baselineResults?.estimatedProductionBars || 5400).toLocaleString()} bars
                  </span>
                </div>
              </div>

              {/* Delayed Orders */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[11px] block">Delayed Customer Orders</span>
                  <span
                    className={`font-mono font-bold text-base ${
                      currentResults.ordersDelayed > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {currentResults.ordersDelayed.toLocaleString()} orders
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">Baseline</span>
                  <span className="font-mono text-gray-300">
                    {(baselineResults?.ordersDelayed || 0).toLocaleString()} orders
                  </span>
                </div>
              </div>

              {/* Delivery Delay Hours */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[11px] block">Average Transit Delay</span>
                  <span
                    className={`font-mono font-bold text-base ${
                      currentResults.expectedDeliveryDelaysHours > 1 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {currentResults.expectedDeliveryDelaysHours} hours
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">Baseline</span>
                  <span className="font-mono text-gray-300">
                    {baselineResults?.expectedDeliveryDelaysHours || 0.4} hours
                  </span>
                </div>
              </div>

              {/* Quality Rejections */}
              <div className="p-3.5 rounded-xl bg-[#20120A] border border-amber-500/15 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[11px] block">Estimated Rejections</span>
                  <span className="font-mono font-bold text-amber-300 text-base">
                    {currentResults.estimatedRejectedBars.toLocaleString()} bars
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-mono block">Baseline</span>
                  <span className="font-mono text-gray-300">
                    {(baselineResults?.estimatedRejectedBars || 95).toLocaleString()} bars
                  </span>
                </div>
              </div>
            </div>

            {/* Action Trigger Buttons */}
            <div className="pt-2">
              {isCurrentActiveRunning ? (
                <button
                  onClick={handleResolve}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Execute Recommended Action & Restore Factory</span>
                </button>
              ) : (
                <button
                  onClick={handleRun}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold font-mono text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Inject This Problem into Simulation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
