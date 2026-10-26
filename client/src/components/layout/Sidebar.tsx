import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  Sparkles,
  Shield,
  Activity,
  Scan,
  Boxes,
  Truck,
  Zap,
  CheckCircle2,
  Bot,
  MapPin,
  Package,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';
import { useChocolateFactoryStore } from '../../features/factory/chocolateFactoryStore.js';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  adminOnly?: boolean;
}

const mainFactoryNavItems: NavItem[] = [
  { name: 'Overview', to: '/app/dashboard', icon: LayoutDashboard },
  { name: '3D Factory', to: '/app/twin-3d', icon: Box, badge: '3D LIVE', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { name: 'Production', to: '/app/production', icon: Layers, badge: 'Workflow', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { name: 'Raw Materials', to: '/app/materials', icon: Activity, badge: 'Cocoa' },
  { name: 'Quality Check', to: '/app/quality', icon: Scan, badge: 'Scanner', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { name: 'Warehouse', to: '/app/warehouse', icon: Boxes, badge: 'Storage' },
  { name: 'Deliveries', to: '/app/deliveries', icon: Truck, badge: 'Fleet' },
  { name: 'Problem Simulator', to: '/app/problems', icon: Zap, badge: 'Lab', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { name: 'Compare Factory Plans', to: '/app/plans', icon: CheckCircle2, badge: '3 Plans' },
  { name: 'Ask ChocoFlow', to: '/app/ask', icon: Bot, badge: 'AI', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
];

const secondaryNavItems: NavItem[] = [
  { name: 'Delivery Route Map', to: '/app/map', icon: MapPin },
  { name: 'Orders & Shipments', to: '/app/shipments', icon: Package },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  return (
    <aside className="w-64 bg-[#140A05] border-r border-amber-500/20 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-amber-500/20 bg-[#1A0E08]">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-[#1A0E08] rounded-[10px] flex items-center justify-center text-lg">
              🍫
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">ChocoFlow</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                AI
              </span>
            </div>
            <p className="text-[9px] text-amber-200/70 font-semibold tracking-wider uppercase font-mono">
              Smart Chocolate Twin
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
          Factory Operations
        </div>

        {mainFactoryNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 shrink-0 text-amber-400/80" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-semibold border ${
                  item.badgeColor || 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-3 px-3 pb-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
          Logistics Views
        </div>

        {secondaryNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </div>
          </NavLink>
        ))}
      </div>

      {/* System Status Telemetry Footer */}
      <div className="p-3 border-t border-amber-500/20 bg-[#160D08]">
        <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                activeProblem
                  ? 'bg-red-400 animate-ping'
                  : isRunning
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] text-amber-200 font-mono font-semibold">
              {activeProblem ? 'INCIDENT ACTIVE' : isRunning ? 'FACTORY RUNNING' : 'LINE PAUSED'}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">v2.0</span>
        </div>
      </div>
    </aside>
  );
};
