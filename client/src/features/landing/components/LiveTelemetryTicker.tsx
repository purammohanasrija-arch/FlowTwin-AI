import React from 'react';
import {
  Activity,
  Box,
  Plane,
  Ship,
  Truck,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const LiveTelemetryTicker: React.FC = () => {
  const telemetryItems = [
    { label: 'Active Shipments', value: '12,487', icon: Box, color: 'text-cyan-400' },
    { label: 'Air Transit Freights', value: '892 Active', icon: Plane, color: 'text-purple-400' },
    { label: 'Marine Berth Docks', value: '31 Vessels', icon: Ship, color: 'text-blue-400' },
    { label: 'Autonomous Fleet', value: '2,340 Trucks', icon: Truck, color: 'text-emerald-400' },
    { label: 'Disruption MTTR', value: '4.2x Faster', icon: Zap, color: 'text-amber-400' },
    { label: 'Multi-Agent Latency', value: '14 ms', icon: Cpu, color: 'text-fuchsia-400' },
    { label: 'Global Resilience', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-400' },
  ];

  return (
    <div className="w-full bg-[#070A1A]/95 border-y border-cyan-500/20 py-3.5 backdrop-blur-xl relative z-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0 text-xs font-mono font-bold text-white uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-cyan-300">Live Telemetry</span>
          <span className="text-gray-600">|</span>
        </div>

        <div className="flex items-center gap-8 min-w-max">
          {telemetryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-xs font-mono">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-gray-400">{item.label}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
