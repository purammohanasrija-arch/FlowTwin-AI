import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe2,
  Box,
  BrainCircuit,
  SlidersHorizontal,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  borderColor: string;
  glowColor: string;
  route: string;
  badge?: string;
}

const FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: 'global-visibility',
    title: 'Global Visibility',
    description: 'From global networks to local operations.',
    icon: Globe2,
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-400/60',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(0,245,255,0.25)]',
    route: '/app/map',
    badge: 'Real-time Map',
  },
  {
    id: '3d-digital-twin',
    title: '3D Digital Twin',
    description: 'Explore real-world infrastructure in detail.',
    icon: Box,
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-400/60',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    route: '/app/twin-3d',
    badge: 'Interactive Universe',
  },
  {
    id: 'ai-prediction',
    title: 'AI-Powered Prediction',
    description: 'Detect risks before they become disruptions.',
    icon: BrainCircuit,
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-400/60',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    route: '/app/dashboard',
    badge: 'Multi-Agent',
  },
  {
    id: 'scenario-simulation',
    title: 'Scenario Simulation',
    description: 'Test multiple futures with real operational impact.',
    icon: SlidersHorizontal,
    iconColor: 'text-amber-400',
    borderColor: 'group-hover:border-amber-400/60',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    route: '/app/simulations',
    badge: 'Deterministic Lab',
  },
  {
    id: 'autonomous-recovery',
    title: 'Autonomous Recovery',
    description: 'AI agents generate recovery plans for human approval.',
    icon: ShieldCheck,
    iconColor: 'text-fuchsia-400',
    borderColor: 'group-hover:border-fuchsia-400/60',
    glowColor: 'group-hover:shadow-[0_0_30px_rgba(217,70,239,0.25)]',
    route: '/app/recovery',
    badge: 'Governance Signoff',
  },
];

export const FeatureCardsStrip: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {FEATURE_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * idx }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => navigate(card.route)}
              className={`group relative p-3 sm:p-3.5 rounded-xl bg-[#080C22]/85 hover:bg-[#0C1230]/95 border border-white/[0.08] ${card.borderColor} backdrop-blur-2xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] ${card.glowColor} transition-all duration-300 cursor-pointer flex flex-col justify-between text-left h-full`}
            >
              {/* Subtle top glow highlight */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-cyan-400/50 transition-all" />

              <div className="space-y-2">
                {/* Header row: Icon + Arrow */}
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 flex items-center justify-center transition-all">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${card.iconColor} group-hover:scale-110 transition-transform`} />
                  </div>

                  <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-cyan-400/40 group-hover:bg-cyan-500/20 transition-all">
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-cyan-200 transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug mt-0.5 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Bottom Tag / Badge */}
              <div className="pt-2 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px] sm:text-[10px] font-mono">
                <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                  {card.badge}
                </span>
                <span className="text-gray-600 group-hover:text-gray-400">
                  Explore →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
