import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Box,
  SlidersHorizontal,
  ShieldCheck,
  Play,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveShowcaseSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'control' | 'twin' | 'simulation' | 'recovery'>('control');

  const tabs = [
    { id: 'control', label: '1. Control Tower', icon: Activity, route: '/app/dashboard' },
    { id: 'twin', label: '2. 3D Spatial Twin', icon: Box, route: '/app/twin-3d' },
    { id: 'simulation', label: '3. Disruption Lab', icon: SlidersHorizontal, route: '/app/simulations' },
    { id: 'recovery', label: '4. Autonomous Recovery', icon: ShieldCheck, route: '/app/recovery' },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/10 blur-[180px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive System Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Experience FlowTwin AI in{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Real Operations
          </span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Switch between live command modules below to see how our agents detect anomalies, simulate
          shockwaves, and orchestrate automated recovery in seconds.
        </p>
      </div>

      {/* Tab Switcher Buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 overflow-x-auto no-scrollbar py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_25px_rgba(0,245,255,0.35)] border border-cyan-400/40'
                  : 'bg-[#090D24]/80 text-gray-400 hover:text-white border border-white/[0.08] hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Display Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#070A1E]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-left">
        <AnimatePresence mode="wait">
          {activeTab === 'control' && (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-mono font-bold">
                  CONTROL TOWER & TELEMETRY
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Real-Time Visibility Across 12,000+ Multimodal Shipments
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Unified ingestion from GPS transponders, marine AIS, air traffic ADS-B, and ERP systems.
                  Continuously calculates on-time probability and highlights bottlenecked hubs.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] text-gray-400">Total Tracked</div>
                    <div className="text-lg font-bold text-cyan-300">12,487</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] text-gray-400">On Schedule</div>
                    <div className="text-lg font-bold text-emerald-300">98.4%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] text-gray-400">Open Alerts</div>
                    <div className="text-lg font-bold text-red-400">7 Active</div>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/app/dashboard')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-cyan-500 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                  >
                    <span>Open Live Control Tower</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphic Mockup */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#090D26] border border-cyan-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-cyan-300 font-bold">PORT LOGISTICS HEALTH INDEX</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ALL CLEAR</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Shanghai Deepwater Berth</span>
                    <span className="text-emerald-400 font-bold">Optimal (94%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[94%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Rotterdam Multi-Tier Gateway</span>
                    <span className="text-cyan-400 font-bold">Stable (88%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[88%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Dubai Port Jebel Ali Apron</span>
                    <span className="text-amber-400 font-bold">High Load (78%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-amber-400 w-[78%]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'twin' && (
            <motion.div
              key="twin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/25 text-xs font-mono font-bold">
                  3D DIGITAL SPATIAL TWIN
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  3D Spatial Modeling of Container Ships & Quay Cranes
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Interactive real-world digital twin with full camera orbit, zoom, and live component inspection.
                  View container stack health, crane hoist velocity, and berth loading schedules in real time.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/app/twin-3d')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                  >
                    <span>Launch 3D Digital Twin Universe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#090D26] border border-purple-500/30 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  <Box className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-white">Spatial Digital Twin Ready</div>
                <div className="text-xs text-gray-400 font-mono">
                  Quay Cranes: 4 Online | Container Ship: MV Horizon Berthed | TEU Stack: 1,856 Units
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-mono font-bold">
                  DISRUPTION & SHOCK SIMULATION
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Deterministic Alternate Futures in Milliseconds
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Trigger simulated canal blockages, severe weather, or port strikes. Our simulation lab calculates
                  the downstream propagation across suppliers, transit hubs, and retail destinations.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/app/simulations')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-500 hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  >
                    <span>Run Disruption Simulation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-red-950/40 to-[#0A0E28] border border-red-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                    <span>SIMULATED TYPHOON 'KAI-TAK'</span>
                  </div>
                  <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">HIGH SHOCK</span>
                </div>
                <div className="text-gray-300 text-xs">Estimated Ripple Impact:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-white/[0.05]">
                    <span className="text-gray-400">Delay Risk:</span> <strong className="text-amber-400">+38 Hours</strong>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/[0.05]">
                    <span className="text-gray-400">At-Risk Value:</span> <strong className="text-red-400">$4.2M Cargo</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recovery' && (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-mono font-bold">
                  AUTONOMOUS MITIGATION & RECOVERY
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Multi-Agent Self-Healing Supply Chains
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Autonomous agents formulate rerouting protocols, negotiate spot rates with secondary freight carriers,
                  and deliver sign-off ready recovery plans with complete human-in-the-loop governance.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/app/recovery')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-500 hover:bg-emerald-400 transition-all shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                  >
                    <span>View Autonomous Recovery Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-5 rounded-2xl bg-[#090D26] border border-emerald-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>AGENT MITIGATION PLAN #882</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">READY FOR SIGN-OFF</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] space-y-1">
                  <div className="text-white font-bold">Recommended: Rail Intermodal Divert via Ningbo</div>
                  <div className="text-[11px] text-gray-400">Avoids 48hr port gridlock. On-time delivery restored to 99.1%.</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
