import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe2,
  Box,
  BrainCircuit,
  SlidersHorizontal,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PlatformPillarsSection: React.FC = () => {
  const navigate = useNavigate();

  const pillars = [
    {
      id: '3d-factory-twin',
      title: '3D Chocolate Factory Twin',
      subtitle: '5 Interactive Production Zones',
      description:
        'Walk through the full chocolate factory floor. Inspect raw cocoa silos, rotary roasting drums, conching tanks, tempering machines, foil wrapping lines, and cold storage.',
      icon: Box,
      accentColor: 'from-amber-600 to-amber-800',
      badge: 'Interactive WebGL 3D',
      glow: 'shadow-[0_0_30px_rgba(217,119,6,0.2)]',
      borderHover: 'hover:border-amber-400/60',
      route: '/app/twin-3d',
      features: ['Orbit Camera & Zone Jumps', 'Real-Time Machine Inspector', '2D Schematic Fallback Blueprint'],
    },
    {
      id: 'production-workflow',
      title: '7-Stage Production Pipeline',
      subtitle: 'From Cocoa Bean to Packaged Bar',
      description:
        'Visualise every step of the chocolate manufacturing process. Start, pause, or resume batch runs and monitor ingredient conversion in real time.',
      icon: SlidersHorizontal,
      accentColor: 'from-amber-500 to-yellow-600',
      badge: 'Visual Workflow Engine',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      borderHover: 'hover:border-amber-400/60',
      route: '/app/production',
      features: ['Start / Pause / Resume Controls', 'Live Batch Completion %', 'Machine Operating Telemetry'],
    },
    {
      id: 'problem-simulator',
      title: 'Factory Problem Simulator',
      subtitle: '7 Operational Stress Scenarios',
      description:
        'Simulate cocoa shortages, conche breakdowns, warm storage rooms, and delivery delays. Compare factory performance before and after executing managerial playbooks.',
      icon: ShieldCheck,
      accentColor: 'from-red-600 to-amber-700',
      badge: 'Problem & Resolution Engine',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      borderHover: 'hover:border-red-400/60',
      route: '/app/problems',
      features: ['Before vs After Performance', 'Root Cause Explanations', 'Actionable Manager Playbooks'],
    },
    {
      id: 'compare-plans',
      title: 'Compare Factory Plans',
      subtitle: 'Plans A, B, and C Side-by-Side',
      description:
        'Evaluate 3 possible futures: Normal Production (Plan A), Machine Breakdown (Plan B), and High Customer Demand Surge (Plan C) with cost and output graphs.',
      icon: BrainCircuit,
      accentColor: 'from-amber-700 to-orange-800',
      badge: 'Plan Decision Studio',
      glow: 'shadow-[0_0_30px_rgba(180,83,9,0.2)]',
      borderHover: 'hover:border-amber-500/60',
      route: '/app/plans',
      features: ['Side-by-Side Comparison Cards', 'Output & Operating Cost Charts', 'One-Click Condition Apply'],
    },
    {
      id: 'quality-and-fleet',
      title: 'Quality Scanner & Logistics Fleet',
      subtitle: 'Cold-Chain Delivery & Batch Assurance',
      description:
        'Scan chocolate batches with our optical defect inspector and dispatch temperature-controlled refrigerated delivery trucks to regional customer hubs.',
      icon: Globe2,
      accentColor: 'from-yellow-600 to-amber-700',
      badge: 'Inspection & Fleet Control',
      glow: 'shadow-[0_0_30px_rgba(202,138,4,0.2)]',
      borderHover: 'hover:border-yellow-400/60',
      route: '/app/quality',
      features: ['Optical Defect Scanner Station', 'Valid Status Fleet Transitions', 'Stock Replenishment Controls'],
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Smart Chocolate Factory Digital Twin</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Everything You Need to Run{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            ChocoFlow AI 🍫
          </span>
        </h2>
        <p className="text-amber-100/70 text-sm sm:text-base leading-relaxed">
          From 3D confectionery machinery and ingredient stoichiometry to refrigerated truck routing,
          ChocoFlow AI empowers students, factory workers, and managers to simulate every chocolate decision.
        </p>
      </div>

      {/* Grid of 5 Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => navigate(pillar.route)}
              className={`group relative p-6 sm:p-7 rounded-2xl bg-[#080D24]/85 hover:bg-[#0C1236]/95 border border-white/[0.08] ${pillar.borderHover} backdrop-blur-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between text-left ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${pillar.accentColor} p-0.5 shadow-lg flex items-center justify-center`}
                  >
                    <div className="w-full h-full rounded-[10px] bg-[#080D24] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                    {pillar.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 pt-0.5 pb-2">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300/80 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-2 space-y-1.5 border-t border-white/[0.04]">
                  {pillar.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:text-white transition-colors">
                <span>Explore {pillar.title}</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
