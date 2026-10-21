import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plane,
  Ship,
  Truck,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingHubPanels: React.FC = () => {
  const navigate = useNavigate();
  const [activePanelId, setActivePanelId] = useState<string | null>(null);

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP FLOATING OVERLAYS (Positioned over thematic scenery) */}
      {/* ============================================================ */}
      <div className="hidden xl:block pointer-events-none select-none">
        {/* Panel A — Global Hub: New York (Placed near western orbital arc of the globe) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/map')}
          className="absolute top-16 left-[44%] pointer-events-auto cursor-pointer animate-float-slow"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#080D22]/85 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,245,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,245,255,0.4)] transition-all">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>New York</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] text-gray-400">Distribution Hub</div>
              <div className="text-[10px] font-mono font-bold text-cyan-300">
                1,240 shipments
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 ml-1" />
          </div>
        </motion.div>

        {/* Panel B — Air Transit Hub: London (Placed near the flight trajectories high above the globe) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/map')}
          className="absolute top-8 left-[60%] pointer-events-auto cursor-pointer animate-float-gentle"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#090C24]/85 border border-purple-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(139,92,246,0.4)] transition-all">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-xs font-bold text-white">London</div>
              <div className="text-[10px] text-purple-300/80">Transit Hub</div>
              <div className="text-[10px] font-mono font-bold text-white">
                892 shipments
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 ml-1" />
          </div>
        </motion.div>

        {/* Panel C — Port Terminal: Shanghai (Placed above the maritime berth and container cranes) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/twin-3d')}
          className="absolute top-[44%] left-[44%] pointer-events-auto cursor-pointer animate-float-slow"
        >
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#080D22]/85 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,245,255,0.2)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,245,255,0.4)] transition-all">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Ship className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-xs font-bold text-white">Shanghai</div>
              <div className="text-[10px] text-cyan-400">Port Terminal</div>
              <div className="text-[10px] font-mono font-bold text-white">
                1,856 shipments
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              OPTIMAL
            </span>
          </div>
        </motion.div>

        {/* Panel D — Warehouse: DXB-01 (Placed above the illuminated warehouse apron) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/twin-3d')}
          className="absolute top-[60%] right-[20%] pointer-events-auto cursor-pointer animate-float-gentle"
        >
          <div className="px-3 py-2 rounded-2xl bg-[#090D26]/90 border border-indigo-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:border-indigo-400 transition-all text-left space-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>DXB-01 Warehouse</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                Cap: 78%
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-mono text-gray-300 pt-0.5">
              <span className="text-emerald-400">Inbound: 24</span>
              <span className="text-gray-600">|</span>
              <span className="text-cyan-400">Outbound: 31</span>
            </div>
          </div>
        </motion.div>

        {/* Panel E — Container Ship: MV Horizon (Placed over the illuminated container vessel) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/twin-3d')}
          className="absolute top-[68%] left-[42%] pointer-events-auto cursor-pointer animate-float-slow"
        >
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#070A1E]/85 border border-cyan-500/35 backdrop-blur-xl shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:border-cyan-300 transition-all">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-300">
              <Ship className="w-3 h-3" />
            </div>
            <div className="leading-none text-left">
              <div className="text-[11px] font-bold text-white">MV Horizon</div>
              <div className="text-[9px] text-gray-400 pt-0.5">Container Ship</div>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              On Time
            </span>
          </div>
        </motion.div>

        {/* Panel F — Truck: TRK-458 (Placed over the multi-tier freight viaduct highway) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/app/map')}
          className="absolute top-[72%] left-[58%] pointer-events-auto cursor-pointer animate-float-gentle"
        >
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#090C22]/85 border border-purple-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:border-purple-300 transition-all">
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Truck className="w-3 h-3" />
            </div>
            <div className="leading-none text-left">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>Truck TRK-458</span>
                <span className="text-[9px] font-mono text-cyan-400 font-normal">In Transit</span>
              </div>
              <div className="text-[9px] text-gray-400 pt-0.5">
                Dest: <strong className="text-white">Dubai Port</strong>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
          </div>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE & TABLET RESPONSIVE CAROUSEL STRIP (Below hero text) */}
      {/* ============================================================ */}
      <div className="xl:hidden w-full pt-4 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 px-4 min-w-max">
          {/* Card A */}
          <div
            onClick={() => navigate('/app/map')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#080D22]/90 border border-cyan-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[11px] font-bold text-white">New York Hub</div>
              <div className="text-[9px] font-mono text-cyan-300">1,240 shipments</div>
            </div>
          </div>

          {/* Card B */}
          <div
            onClick={() => navigate('/app/map')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090C24]/90 border border-purple-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Plane className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[11px] font-bold text-white">London Air Transit</div>
              <div className="text-[9px] font-mono text-purple-300">892 shipments</div>
            </div>
          </div>

          {/* Card C */}
          <div
            onClick={() => navigate('/app/twin-3d')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#080D22]/90 border border-cyan-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Ship className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[11px] font-bold text-white">Shanghai Port</div>
              <div className="text-[9px] font-mono text-emerald-400">1,856 shipments</div>
            </div>
          </div>

          {/* Card D */}
          <div
            onClick={() => navigate('/app/twin-3d')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090D26]/90 border border-indigo-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[11px] font-bold text-white">DXB-01 Warehouse</div>
              <div className="text-[9px] font-mono text-amber-300">Cap: 78% | In: 24 Out: 31</div>
            </div>
          </div>

          {/* Card E */}
          <div
            onClick={() => navigate('/app/twin-3d')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#070A1E]/90 border border-cyan-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Ship className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[11px] font-bold text-white">MV Horizon</div>
              <div className="text-[9px] font-mono text-emerald-300">On Time</div>
            </div>
          </div>

          {/* Card F */}
          <div
            onClick={() => navigate('/app/map')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090C22]/90 border border-purple-500/30 backdrop-blur-xl text-left cursor-pointer"
          >
            <Truck className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[11px] font-bold text-white">TRK-458 In Transit</div>
              <div className="text-[9px] font-mono text-gray-300">To: Dubai Port</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
