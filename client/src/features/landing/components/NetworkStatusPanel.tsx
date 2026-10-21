import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Package,
  Building2,
  Truck,
  AlertTriangle,
  ArrowRight,
  CloudLightning,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const NetworkStatusPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-[280px] xl:max-w-xs select-none">
      {/* 1. Live Network Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="p-3 sm:p-3.5 rounded-2xl bg-[#080C22]/90 border border-cyan-500/35 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.8),0_0_20px_rgba(0,245,255,0.15)] space-y-2.5 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2346] pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div>
              <div className="text-xs font-bold text-white tracking-wide">
                Live Network Status
              </div>
              <div className="text-[9px] font-mono text-cyan-400/80 font-bold uppercase tracking-wider">
                DEMO TELEMETRY
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        {/* Telemetry Metric Rows */}
        <div className="space-y-1.5 text-xs font-mono">
          {/* Active Shipments */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-2 text-gray-300">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">Active Shipments</span>
            </div>
            <span className="font-bold text-white text-[11px]">12,487</span>
          </div>

          {/* Connected Hubs */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-2 text-gray-300">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px]">Connected Hubs</span>
            </div>
            <span className="font-bold text-purple-300 text-[11px]">86</span>
          </div>

          {/* Vehicles in Motion */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-2 text-gray-300">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Vehicles in Motion</span>
            </div>
            <span className="font-bold text-emerald-300 text-[11px]">2,340</span>
          </div>

          {/* Open Disruptions */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-red-950/30 border border-red-500/30">
            <div className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="text-[11px]">Open Disruptions</span>
            </div>
            <span className="font-bold text-red-400 text-[11px]">7</span>
          </div>
        </div>

        {/* Global Analytics CTA Button */}
        <button
          type="button"
          onClick={() => navigate('/app/analytics')}
          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group"
        >
          <span>View Global Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* 2. Weather Alert Card (Simulated Shock Notification) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onClick={() => navigate('/app/simulations')}
        className="p-2.5 px-3 rounded-xl bg-gradient-to-r from-red-950/80 to-[#120712]/90 border border-red-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:border-red-400 transition-all cursor-pointer group text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-md shadow-red-500/20">
              <CloudLightning className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Weather Alert</span>
                <span className="text-[8px] font-mono px-1 rounded bg-red-500/30 text-red-300 font-bold uppercase">
                  SIMULATED
                </span>
              </div>
              <div className="text-[10px] font-bold text-red-300">Severe Storms</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-1 transition-transform mt-0.5" />
        </div>
        <div className="text-[9px] text-gray-400 pt-1 flex items-center justify-between font-mono">
          <span>3 regions affected</span>
          <span className="text-red-400 underline decoration-red-500/40">Run Simulation →</span>
        </div>
      </motion.div>
    </div>
  );
};
