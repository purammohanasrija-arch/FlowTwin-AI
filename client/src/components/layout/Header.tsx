import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';
import { UserRole } from '../../shared/types.js';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleCopilot: () => void;
  copilotOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleCopilot, copilotOpen }) => {
  const { user, switchRole, resetDemoWorkspace, isLoading } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/shipments?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const roles: UserRole[] = ['Administrator', 'Logistics Manager', 'Operations Analyst', 'Viewer'];

  return (
    <header className="h-16 bg-[#0A0B12]/90 backdrop-blur-md border-b border-[#1E2238] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="w-80 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search shipments, orders, facilities..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#121422] border border-[#24283E] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/60 transition-colors"
        />
      </form>

      {/* Center status: Simulation Mode Badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-300 font-mono">TELEMETRY STREAM: SYNCHRONIZED</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Workspace Button */}
        <button
          onClick={resetDemoWorkspace}
          disabled={isLoading}
          title="Reset sample enterprise dataset with 34 shipments & disruption scenarios"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>

        {/* AI Copilot Toggle Button */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            copilotOpen
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/30'
              : 'bg-purple-600/15 text-purple-300 border-purple-500/30 hover:bg-purple-600/25'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>

        {/* Alerts Bell */}
        <button
          onClick={() => navigate('/app/alerts')}
          className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>

        {/* Interactive Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141624] border border-[#24283E] hover:border-purple-500/40 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <div className="text-left">
              <div className="text-[10px] text-gray-300 font-medium leading-none">ROLE</div>
              <div className="text-xs font-semibold text-white leading-tight">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121422] border border-[#24283E] shadow-2xl p-1.5 z-50">
              <div className="px-3 py-2 text-[11px] text-gray-400 border-b border-white/[0.06] mb-1 font-medium">
                Switch Operational Role:
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    user?.role === r
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {user?.role === r && <UserCheck className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
