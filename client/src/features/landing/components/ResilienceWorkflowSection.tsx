import React from 'react';
import {
  Radio,
  Cpu,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ResilienceWorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Multimodal Telemetry Ingestion',
      subtitle: 'Sub-second event streaming',
      description:
        'Continuous synchronization from GPS transponders, marine AIS, air ADS-B, port terminal operating systems, and road sensor networks.',
      icon: Radio,
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bgGlow: 'bg-cyan-500/10',
    },
    {
      step: '02',
      title: 'Graph Anomaly Detection',
      subtitle: 'Predicting delays 48h in advance',
      description:
        'Neural graph agents evaluate weather patterns, port dwell times, and labor conditions to detect micro-bottlenecks before they trigger domino delays.',
      icon: Cpu,
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
      bgGlow: 'bg-purple-500/10',
    },
    {
      step: '03',
      title: 'Deterministic Shock Simulation',
      subtitle: 'Testing 100+ alternate futures',
      description:
        'Monte Carlo engines simulate the downstream ripple effect across warehouse inventories, carrier contracts, and critical customer delivery deadlines.',
      icon: GitBranch,
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      bgGlow: 'bg-amber-500/10',
    },
    {
      step: '04',
      title: 'Autonomous Mitigation Signoff',
      subtitle: 'Self-healing with human governance',
      description:
        'AI agents generate rerouting orders, reserve alternative air/rail freight allocations, and deliver one-click signoff protocols for operators.',
      icon: ShieldAlert,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-500/10',
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Resilience Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          How the{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Multi-Agent Engine
          </span>{' '}
          Operates
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          From the initial sensor ping to automated batch optimization, observe how ChocoTwin AI protects
          your chocolate manufacturing from end to end.
        </p>
      </div>

      {/* 4 Process Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 rounded-2xl bg-[#080D24]/85 border ${item.border} backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-gray-500/60">
                    {item.step}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${item.bgGlow} flex items-center justify-center ${item.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-gray-400 pt-0.5 pb-2">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-gray-300/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
