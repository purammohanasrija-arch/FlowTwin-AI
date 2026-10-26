import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, PlayCircle, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onOpenTour: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTour }) => {
  const navigate = useNavigate();

  return (
    <div className="relative z-20 max-w-2xl text-left space-y-4 pt-2 pb-4">
      {/* 1. Small Uppercase Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080D24]/85 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(0,245,255,0.15)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
          REAL-TIME INSIGHTS. SMARTER DECISIONS. STRONGER SUPPLY CHAINS.
        </span>
      </motion.div>

      {/* 2. Main Headline (Staggered lines with custom gradients and subtle glow) */}
      <div className="space-y-1 font-extrabold tracking-tight leading-[1.02] select-none text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px]">
        {/* Line 1: Pure White */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
        >
          THE FUTURE OF
        </motion.div>

        {/* Line 2: White-to-Cyan Gradient */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,245,255,0.35)]"
        >
          LOGISTICS IS
        </motion.div>

        {/* Line 3: Cyan-to-Violet-to-Magenta Gradient */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-r from-cyan-400 via-indigo-400 via-purple-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(217,70,239,0.35)]"
        >
          ALREADY MOVING.
        </motion.div>
      </div>

      {/* 3. Supporting Paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-sm sm:text-base text-gray-300/90 leading-relaxed max-w-[480px] font-sans drop-shadow-md"
      >
        Explore an intelligent digital twin that predicts disruptions, simulates alternate futures,
        and orchestrates smarter supply chains.
      </motion.p>

      {/* 4. Hero Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="flex flex-wrap items-center gap-3 pt-1"
      >
        {/* Primary Button */}
        <button
          type="button"
          onClick={() => navigate('/app/dashboard')}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-[0_0_25px_rgba(0,245,255,0.4)] hover:shadow-[0_0_35px_rgba(0,245,255,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="tracking-wide">Enter Command Center</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Button */}
        <button
          type="button"
          onClick={() => navigate('/app/twin-3d')}
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-cyan-200 hover:text-white bg-[#0A0F2B]/60 hover:bg-[#0A0F2B]/90 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,245,255,0.25)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Explore Interactive Demo</span>
        </button>

        {/* Tertiary Action Button */}
        <button
          type="button"
          onClick={onOpenTour}
          className="group inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 group-hover:bg-cyan-500/30 transition-all">
            <Play className="w-2 h-2 text-cyan-300 fill-cyan-300 ml-0.5" />
          </span>
          <span className="underline decoration-cyan-500/40 underline-offset-4 group-hover:decoration-cyan-400">
            Watch the System in Action
          </span>
        </button>
      </motion.div>

      {/* 5. Live Telemetry Metric Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex items-center gap-3 pt-1 text-[11px] font-mono text-gray-400"
      >
        <span className="flex items-center gap-1.5 text-cyan-300/90">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          34 Live Consignments Tracked
        </span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1.5 text-emerald-300/90">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Multi-Agent Resilience Engine Active
        </span>
      </motion.div>
    </div>
  );
};
