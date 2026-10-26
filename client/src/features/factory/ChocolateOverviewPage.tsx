import React from 'react';
import {
  Boxes,
  Truck,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  TrendingUp,
  Layers,
  Thermometer,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Eye,
  Activity,
  Flame,
  Package,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useChocolateFactoryStore } from './chocolateFactoryStore.js';
import { useNavigate } from 'react-router-dom';

export const ChocolateOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const startProduction = useChocolateFactoryStore(s => s.startProduction);
  const pauseProduction = useChocolateFactoryStore(s => s.pauseProduction);
  const stages = useChocolateFactoryStore(s => s.stages);
  const deliveries = useChocolateFactoryStore(s => s.deliveries);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);
  const resetDemoData = useChocolateFactoryStore(s => s.resetDemoData);

  const runningMachinesCount = stages.filter(s => s.status === 'Running').length;
  const inTransitCount = deliveries.filter(d => d.status === 'In Transit').length;

  const hourlyProductionData = [
    { time: '08:00', bars: 680 },
    { time: '09:00', bars: 740 },
    { time: '10:00', bars: 780 },
    { time: '11:00', bars: 760 },
    { time: '12:00', bars: 710 },
    { time: '13:00', bars: 790 },
    { time: '14:00', bars: Math.round(params.productionCapacityBarsPerHour * (params.machineEfficiencyPct / 100)) },
    { time: '15:00', bars: Math.round(params.productionCapacityBarsPerHour * (params.machineEfficiencyPct / 100)) },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Control Room Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#20120B] via-[#2A180E] to-[#1A0E08] border border-amber-500/25 shadow-2xl overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍫</span>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                ChocoFlow AI Digital Twin
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                TELEMETRY LIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Chocolate Factory & Logistics Control Tower
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-sans">
              Real-time digital twin monitoring cocoa roasting, conching, precision Beta-V crystal tempering, robotic foil packing, and refrigerated fleet deliveries across all retail channels.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={isRunning ? pauseProduction : startProduction}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold font-mono transition-all shadow-lg ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-amber-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Production' : 'Start Production'}</span>
            </button>

            <button
              onClick={() => navigate('/app/twin-3d')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold font-mono text-amber-300 bg-white/5 hover:bg-white/10 border border-amber-500/30 transition-all shadow-lg"
            >
              <Eye className="w-4 h-4" />
              <span>Explore 3D Factory</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Operational KPIs Requested by User Prompt */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Production Today */}
        <div
          onClick={() => navigate('/app/production')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Production Today</span>
            <Boxes className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {results.estimatedProductionBars.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-400/80 font-mono">chocolate bars</span>
        </div>

        {/* KPI 2: Orders Waiting */}
        <div
          onClick={() => navigate('/app/parameters')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Orders Waiting</span>
            <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-200">
            {params.dailyOrders.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {results.ordersCompleted} completed
          </span>
        </div>

        {/* KPI 3: Current Material Stock */}
        <div
          onClick={() => navigate('/app/materials')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Cocoa Stock</span>
            <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {params.cocoaStockKg.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400 font-mono">kg raw beans</span>
        </div>

        {/* KPI 4: Machines Running */}
        <div
          onClick={() => navigate('/app/twin-3d')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Machines Running</span>
            <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {runningMachinesCount} / {stages.length}
          </div>
          <span className="text-[10px] text-gray-400 font-mono">lines operational</span>
        </div>

        {/* KPI 5: Quality Rejection Rate */}
        <div
          onClick={() => navigate('/app/quality')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Rejection Rate</span>
            <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {params.qualityRejectionPct}%
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {results.estimatedRejectedBars} bars remelted
          </span>
        </div>

        {/* KPI 6: Deliveries in Progress */}
        <div
          onClick={() => navigate('/app/deliveries')}
          className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 hover:border-amber-400/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Deliveries Active</span>
            <Truck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-300">
            {inTransitCount} En Route
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">
            {params.availableTrucks} refrigerated
          </span>
        </div>
      </div>

      {/* Production Chart & Active Problem Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hourly Output Velocity Chart (Col 1-8) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                Production Velocity & Hourly Batch Output
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Calculated bar throughput across 8-hour continuous manufacturing shift.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Capacity: {params.productionCapacityBarsPerHour} bars/h
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyProductionData}>
                <defs>
                  <linearGradient id="chocoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#78350F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D170D" />
                <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fill: '#D1D5DB', fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#D1D5DB', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E100A',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                    borderRadius: '10px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bars"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chocoGradient)"
                  name="Bars Produced"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quick Plant Status & AI Recommendations (Col 9-12) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Control Room Briefing
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Active Problem Warning if Any */}
            {activeProblem && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-red-300 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>ACTIVE INCIDENT: {activeProblem.title}</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  {activeProblem.whatHappened}
                </p>
                <button
                  onClick={() => navigate('/app/problems')}
                  className="text-amber-300 hover:text-amber-200 font-bold font-mono text-[11px] underline block pt-1"
                >
                  View Resolution Playbook →
                </button>
              </div>
            )}

            {/* AI Assistant Quick Brief */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-1.5 leading-relaxed">
              <span className="text-amber-300 font-bold font-mono block">
                ChocoFlow Operational Note:
              </span>
              <p className="text-amber-100/90 text-xs">
                Tempering crystals are currently at 31.5°C Beta-V form. Warehouse cold storage is holding steady at {params.coldStorageTempCelsius.toFixed(1)}°C with {results.ordersCompleted} orders ready for loading bay staging.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/15">
            <button
              onClick={() => navigate('/app/ask')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Ask ChocoFlow Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
