import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingCtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0B0F30]/90 to-purple-950/60 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,245,255,0.2)] overflow-hidden text-center space-y-6">
        {/* Glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Instant Operations Access</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Ready to Orchestrate Autonomous Supply Chains?
        </h2>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Launch FlowTwin AI today. Inspect live global shipments, explore the interactive 3D spatial twin,
          or test catastrophic disruption scenarios with zero configuration required.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-[0_0_35px_rgba(0,245,255,0.5)] transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/app/twin-3d')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-cyan-200 hover:text-white bg-[#0A0F2B]/80 hover:bg-[#0A0F2B] border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl transition-all cursor-pointer"
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Launch 3D Digital Twin</span>
          </button>
        </div>
      </div>
    </section>
  );
};
