import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Box, PlayCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingCtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[#29180E]/90 via-[#1E120B]/95 to-[#160D08]/90 border border-amber-600/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(217,119,6,0.25)] overflow-hidden text-center space-y-6">
        {/* Glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Factory Floor Ready</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-amber-100 tracking-tight max-w-3xl mx-auto leading-tight">
          Ready to Step Inside <span className="text-amber-400">ChocoFlow AI</span>? 🍫
        </h2>

        <p className="text-amber-100/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Explore the realistic 3D chocolate factory floor, change recipe parameters, simulate cocoa shortages or machine breakdowns,
          and discover how smart logistics decisions optimize delicious chocolate delivery.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-[#1A0F07] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Enter Factory Control Room</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/app/twin-3d')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-amber-200 hover:text-white bg-[#1E120B]/90 hover:bg-[#2A180E] border border-amber-500/40 hover:border-amber-400 backdrop-blur-xl transition-all cursor-pointer"
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Launch 3D Factory</span>
          </button>
        </div>
      </div>
    </section>
  );
};
