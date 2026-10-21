import React from 'react';
import { DollarSign, Clock, ShieldCheck, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

export const EnterpriseRoiSection: React.FC = () => {
  const stats = [
    {
      value: '$18.4M',
      label: 'Average Annual Cost Avoided',
      description: 'Eliminates container demurrage fees, expediting penalties, and factory line shutdowns.',
      icon: DollarSign,
      color: 'text-emerald-400',
    },
    {
      value: '4.2x',
      label: 'Faster Disruption Mitigation',
      description: 'AI agents formulate multi-modal alternatives in under 90 seconds compared to manual dispatchers.',
      icon: Clock,
      color: 'text-cyan-400',
    },
    {
      value: '99.8%',
      label: 'On-Time Supply Chain Delivery',
      description: 'Maintains critical delivery deadlines even through severe weather shocks and port gridlocks.',
      icon: ShieldCheck,
      color: 'text-purple-400',
    },
    {
      value: '140+',
      label: 'Global Ports & Hubs Integrated',
      description: 'Pre-calibrated digital twins covering major maritime, air cargo, and intermodal freight corridors.',
      icon: Anchor,
      color: 'text-blue-400',
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto z-20">
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#090D26]/90 via-[#070A1E]/95 to-[#0B0A24]/90 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{stat.label}</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
