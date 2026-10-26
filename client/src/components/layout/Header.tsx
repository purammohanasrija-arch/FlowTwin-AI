import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Bot,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';
import { useChocolateFactoryStore } from '../../features/factory/chocolateFactoryStore.js';
import { UserRole } from '../../shared/types.js';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleCopilot: () => void;
  copilotOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleCopilot, copilotOpen }) => {
  const { user, switchRole, isLoading } = useAuth();
  const resetFactoryDemo = useChocolateFactoryStore(s => s.resetDemoData);
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/shipments?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleReset = () => {
    resetFactoryDemo();
  };

  const roles: UserRole[] = ['Administrator', 'Logistics Manager', 'Operations Analyst', 'Viewer'];

  return (
    <header className="h-16 bg-[#140A05]/95 backdrop-blur-md border-b border-amber-500/20 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="w-80 relative">
        <Search className="w-4 h-4 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search recipes, batches, ingredients, trucks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#1C1008] border border-amber-500/25 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </form>

      {/* Center status: Simulation Mode Badge */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
          <span
            className={`w-2 h-2 rounded-full ${
              activeProblem
                ? 'bg-red-400 animate-ping'
                : isRunning
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-xs font-semibold text-amber-200 font-mono tracking-wide">
            {activeProblem
              ? `INCIDENT: ${activeProblem.category.toUpperCase()}`
              : isRunning
              ? 'CHOCOLATE FACTORY TWIN: ACTIVE'
              : 'PRODUCTION LINE: PAUSED'}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          disabled={isLoading}
          title="Reset factory parameters and batches to standard default demo baseline"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>

        {/* Ask ChocoFlow AI Toggle Button */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
            copilotOpen
              ? 'bg-amber-400 text-black shadow-md shadow-amber-500/30'
              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask ChocoFlow</span>
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1008] border border-amber-500/20 hover:border-amber-400/40 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-left">
              <div className="text-[9px] text-gray-400 font-medium leading-none font-mono">ROLE</div>
              <div className="text-xs font-semibold text-white leading-tight">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1E110A] border border-amber-500/30 shadow-2xl p-1.5 z-50">
              <div className="px-3 py-2 text-[11px] text-amber-200/70 border-b border-white/[0.06] mb-1 font-mono font-medium">
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
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold'
                      : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {user?.role === r && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
