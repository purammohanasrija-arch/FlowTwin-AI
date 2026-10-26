import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Cog,
  Eye,
  Layers,
  Thermometer,
  Boxes,
} from 'lucide-react';
import { useChocolateFactoryStore, ProductionStage } from './chocolateFactoryStore.js';
import { useNavigate } from 'react-router-dom';

export const ProductionWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const stages = useChocolateFactoryStore(s => s.stages);
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const startProduction = useChocolateFactoryStore(s => s.startProduction);
  const pauseProduction = useChocolateFactoryStore(s => s.pauseProduction);
  const resumeProduction = useChocolateFactoryStore(s => s.resumeProduction);
  const totalProduced = useChocolateFactoryStore(s => s.totalBarsProducedToday);
  const results = useChocolateFactoryStore(s => s.results);
  const selectZone = useChocolateFactoryStore(s => s.selectZone);

  const [selectedStage, setSelectedStage] = useState<ProductionStage>(stages[1]); // Default to Chocolate Making

  const handleStageClick = (stage: ProductionStage) => {
    setSelectedStage(stage);
  };

  const handleViewIn3D = (zone: string) => {
    selectZone(zone);
    navigate('/app/twin-3d');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Factory Master Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Chocolate Production Workflow
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                isRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isRunning ? '● FACTORY LINE RUNNING' : '⏸ PRODUCTION PAUSED'}
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl leading-relaxed">
            Follow chocolate from raw organic cocoa beans, crystalline sugar, and milk ingredients through roasting, conching, precision tempering, packaging, and cold distribution.
          </p>
        </div>

        {/* Master Workflow Controls */}
        <div className="flex items-center gap-2.5">
          {isRunning ? (
            <button
              onClick={pauseProduction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-white bg-amber-600/80 hover:bg-amber-600 border border-amber-500/40 transition-all shadow-lg"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Production</span>
            </button>
          ) : (
            <button
              onClick={resumeProduction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4" />
              <span>Resume Production</span>
            </button>
          )}

          <button
            onClick={() => handleViewIn3D(selectedStage.zone)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-amber-300 bg-white/5 hover:bg-white/10 border border-amber-500/30 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Inspect in 3D Factory</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Stage Bar with Arrows */}
      <div className="p-6 rounded-2xl bg-[#1A0E08]/80 border border-amber-500/20 shadow-xl overflow-x-auto">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>7-Stage Industrial Production Pipeline (Click Any Stage)</span>
        </div>

        <div className="flex items-center gap-3 min-w-[950px] pb-2">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage.id === stage.id;
            const isNeedsAttention = stage.status === 'Needs Attention';

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Node Button */}
                <div
                  onClick={() => handleStageClick(stage)}
                  className={`flex-1 p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#382014] to-[#25130A] border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
                      : 'bg-[#20130B]/90 border-amber-500/20 hover:border-amber-400/50 hover:bg-[#2A180E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      STAGE 0{idx + 1}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        isNeedsAttention
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                          : stage.status === 'Running'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white tracking-tight mb-2 truncate">
                    {stage.name}
                  </h3>

                  {/* Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>Batch Progress</span>
                      <span className="text-amber-200 font-bold">{stage.progress}%</span>
                    </div>
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNeedsAttention ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'
                        }`}
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow */}
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-amber-500/40 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Deep-Dive Details Panel */}
      {selectedStage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stage Overview & Purpose */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-amber-500/15 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Active Stage Focus
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {selectedStage.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Machine: {selectedStage.machineName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 font-mono block">Status</span>
                <span
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full inline-block mt-0.5 ${
                    selectedStage.status === 'Needs Attention'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedStage.status}
                </span>
              </div>
            </div>

            {/* Purpose & Process Description */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <div className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider mb-1">
                  Purpose of this Stage
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed">
                  {selectedStage.purpose}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/25 border border-white/5">
                <div className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wider mb-1">
                  How it Works in Simple English
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedStage.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handleViewIn3D(selectedStage.zone)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20"
              >
                <Eye className="w-4 h-4" />
                <span>View Machine in 3D Factory</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Operating Values */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Live Machine Values & Sensors
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Real-Time</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(selectedStage.operatingValues).map(([metric, value], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#20120A] border border-amber-500/15 text-xs"
                >
                  <span className="text-gray-300 font-medium">{metric}</span>
                  <span className="font-mono font-bold text-amber-200">{String(value)}</span>
                </div>
              ))}
            </div>

            {/* Output Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-transparent border border-amber-500/20 text-xs space-y-2">
              <span className="text-amber-300 font-bold font-mono">Today's Total Factory Output</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">
                  {results.estimatedProductionBars.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs">chocolate bars produced</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Operating at {results.machineUtilizationPct}% capacity with {results.ordersCompleted} orders ready for loading.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
