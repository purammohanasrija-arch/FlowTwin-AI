import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Package,
  FileText,
  Network,
  Zap,
  CheckCircle2,
  Bell,
  BarChart3,
  Shield,
  Layers,
  Sparkles,
  Box,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Control Tower', to: '/app/dashboard', icon: LayoutDashboard },
  { name: '3D Chocolate Twin', to: '/app/twin-3d', icon: Box, badge: 'CHOCOLATE' },
  { name: 'Live Logistics Map', to: '/app/map', icon: MapPin },
  { name: 'Shipments', to: '/app/shipments', icon: Package, badge: '34' },
  { name: 'Document Intelligence', to: '/app/documents', icon: FileText, badge: 'OCR' },
  { name: 'Network Twin', to: '/app/network', icon: Network },
  { name: 'Disruption Lab', to: '/app/simulations', icon: Zap, badge: 'AI Lab' },
  { name: 'Recovery Planner', to: '/app/recovery', icon: CheckCircle2, badge: '1 Pending' },
  { name: 'Alerts Center', to: '/app/alerts', icon: Bell, badge: '4' },
  { name: 'Analytics & Reports', to: '/app/analytics', icon: BarChart3 },
  { name: 'Admin & Audit', to: '/app/admin', icon: Shield, adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'Administrator' || user?.role === 'Logistics Manager';

  return (
    <aside className="w-64 bg-[#0A0B12] border-r border-[#1E2238] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E2238]">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
            <div className="w-full h-full bg-[#0E101B] rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">FlowTwin</span>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">AI</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">DIGITAL SUPPLY TWIN</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          Operations Core
        </div>
        {navItems.map(item => {
          if (item.adminOnly && user?.role !== 'Administrator') return null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${
                    item.badge.includes('AI')
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : item.badge.includes('Pending')
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* System Telemetry Badge */}
      <div className="p-3 border-t border-[#1E2238] bg-[#0E101B]/80">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-300 font-mono">TWIN ENGINE LIVE</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
