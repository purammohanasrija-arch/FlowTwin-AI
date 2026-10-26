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
      id: 'global-visibility',
      title: 'Global Visibility',
      subtitle: 'Real-Time Geospatial Map & Telemetry',
      description:
        'Track multimodal consignments across ocean lanes, air corridors, and freight highways with sub-minute GPS precision and satellite terrain overlays.',
      icon: Globe2,
      accentColor: 'from-cyan-500 to-blue-600',
      badge: 'GIS Satellite & Dark Mode',
      glow: 'shadow-[0_0_30px_rgba(0,245,255,0.2)]',
      borderHover: 'hover:border-cyan-400/60',
      route: '/app/map',
      features: ['Satellite & Vector Tiles', 'Live GPS Vessel Feeds', 'Port Congestion Heatmaps'],
    },
    {
      id: '3d-digital-twin',
      title: '3D Digital Twin Universe',
      subtitle: 'Real-World Spatial Infrastructure',
      description:
        'Step directly into 3D operational environments. Inspect container quay cranes, container vessels, and warehouse aprons in real-time spatial fidelity.',
      icon: Box,
      accentColor: 'from-purple-500 to-indigo-600',
      badge: 'Interactive 3D Engine',
      glow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]',
      borderHover: 'hover:border-purple-400/60',
      route: '/app/twin-3d',
      features: ['Quay Crane Telemetry', 'Vessel Berth Spatial Models', 'Real-Time Camera Orbit'],
    },
    {
      id: 'ai-prediction',
      title: 'AI-Powered Prediction',
      subtitle: 'Autonomous Disruption Forecasts',
      description:
        'Graph neural networks and multi-agent predictors detect port bottlenecks, customs delays, and severe weather up to 72 hours before impact.',
      icon: BrainCircuit,
      accentColor: 'from-emerald-500 to-teal-600',
      badge: 'Multi-Agent Neural Engine',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      borderHover: 'hover:border-emerald-400/60',
      route: '/app/dashboard',
      features: ['72-Hour Anomaly Prediction', 'Downstream Impact Scoring', 'Continuous Fleet Learning'],
    },
    {
      id: 'scenario-simulation',
      title: 'Scenario Simulation Lab',
      subtitle: 'Deterministic What-If Testing',
      description:
        'Simulate macro shocks — canal blockages, category 5 typhoons, or dockworker strikes. Test alternate futures without risking real cargo.',
      icon: SlidersHorizontal,
      accentColor: 'from-amber-500 to-orange-600',
      badge: 'Shock Simulator',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      borderHover: 'hover:border-amber-400/60',
      route: '/app/simulations',
      features: ['Hurricane & Strike Scenarios', 'Inventory Ripple Calculations', 'Cost-to-Serve Projections'],
    },
    {
      id: 'autonomous-recovery',
      title: 'Autonomous Recovery Engine',
      subtitle: 'AI Agent Mitigation & Governance Signoff',
      description:
        'When disruptions strike, intelligent agents calculate optimal rerouting, book backup multimodal carriers, and present validated action plans for human sign-off.',
      icon: ShieldCheck,
      accentColor: 'from-fuchsia-500 to-pink-600',
      badge: 'Human-in-the-Loop Signoff',
      glow: 'shadow-[0_0_30px_rgba(217,70,239,0.2)]',
      borderHover: 'hover:border-fuchsia-400/60',
      route: '/app/recovery',
      features: ['Instant Dynamic Rerouting', 'Demurrage Cost Minimizer', 'One-Click Governance Approval'],
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Core Platform Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Everything You Need to Run{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Autonomous Logistics
          </span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          From global geospatial monitoring to microscopic 3D berth twins, FlowTwin AI unites
          real-time sensor telemetry with multi-agent intelligence to safeguard your supply chain.
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
