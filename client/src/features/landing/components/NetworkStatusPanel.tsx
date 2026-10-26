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
      {/* 1. Live Chocolate Factory Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="p-3 sm:p-3.5 rounded-2xl bg-[#1E120B]/90 border border-amber-600/40 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.8),0_0_20px_rgba(217,119,6,0.2)] space-y-2.5 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3D2213] pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div>
              <div className="text-xs font-bold text-amber-100 tracking-wide">
                Live Factory Telemetry
              </div>
              <div className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                CHOCOFLOW DIGITAL TWIN
              </div>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            RUNNING
          </span>
        </div>

        {/* Telemetry Metric Rows */}
        <div className="space-y-1.5 text-xs font-mono">
          {/* Output Rate */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-black/30 border border-white/[0.04]">
            <div className="flex items-center gap-2 text-amber-200/80">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Chocolate Output</span>
            </div>
            <span className="font-bold text-white text-[11px]">2,400 bars/hr</span>
          </div>

          {/* Cocoa Stock */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-black/30 border border-white/[0.04]">
            <div className="flex items-center gap-2 text-amber-200/80">
              <Building2 className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[11px]">Cocoa Silo Stock</span>
            </div>
            <span className="font-bold text-amber-300 text-[11px]">1,200 kg</span>
          </div>

          {/* Active Refrigerated Trucks */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-black/30 border border-white/[0.04]">
            <div className="flex items-center gap-2 text-amber-200/80">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Delivery Fleet</span>
            </div>
            <span className="font-bold text-emerald-300 text-[11px]">4 Active / 6</span>
          </div>

          {/* Machine Warnings */}
          <div className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-red-950/30 border border-red-500/30">
            <div className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="text-[11px]">Machine Notice</span>
            </div>
            <span className="font-bold text-red-400 text-[11px]">TEM-301 (Tune)</span>
          </div>
        </div>

        {/* Global Analytics CTA Button */}
        <button
          type="button"
          onClick={() => navigate('/app/dashboard')}
          className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-yellow-600/30 to-amber-700/30 hover:from-amber-600/50 hover:to-amber-700/50 border border-amber-500/40 text-amber-100 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg group"
        >
          <span>Factory Overview Desk</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* 2. Factory Scenario Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onClick={() => navigate('/app/problems')}
        className="p-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2A180E] to-[#1E120B] border border-amber-600/40 backdrop-blur-xl shadow-[0_0_25px_rgba(217,119,6,0.2)] hover:border-amber-400 transition-all cursor-pointer group text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-100">Factory Problem</span>
                <span className="text-[8px] font-mono px-1 rounded bg-amber-500/30 text-amber-300 font-bold uppercase">
                  SIMULATE
                </span>
              </div>
              <div className="text-[10px] font-bold text-amber-300">Cocoa Shortage Scenario</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform mt-0.5" />
        </div>
        <div className="text-[9px] text-amber-200/60 pt-1 flex items-center justify-between font-mono">
          <span>7 Scenarios Ready</span>
          <span className="text-amber-400 underline decoration-amber-500/40">Run Simulator →</span>
        </div>
      </motion.div>
    </div>
  );
};
