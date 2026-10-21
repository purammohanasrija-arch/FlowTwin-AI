import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Building2,
  Truck,
  Box,
  Layers,
  BarChart3,
  ShieldCheck,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const SEARCH_ITEMS = [
    { title: 'Chicago Central Mega-Warehouse (FAC-CHI-01)', category: 'Facility', route: '/app/map', icon: Building2 },
    { title: 'New York Atlantic Gateway (FAC-NYC-02)', category: 'Facility', route: '/app/map', icon: Building2 },
    { title: 'Pacific Maritime Port & Container Berth (FAC-LAX-03)', category: 'Port', route: '/app/twin-3d', icon: Building2 },
    { title: 'Truck TRK-101 (Apex Freight Dynamics - Delayed)', category: 'Fleet', route: '/app/shipments', icon: Truck },
    { title: 'Truck TRK-204 (Titan Cold-Chain Intermodal)', category: 'Fleet', route: '/app/shipments', icon: Truck },
    { title: 'I-80 Midwest Blizzard Disruption Incident', category: 'Disruption', route: '/app/simulations', icon: BarChart3 },
    { title: 'Live Control Tower & Executive Briefing', category: 'Module', route: '/app/dashboard', icon: Box },
    { title: 'Logistics Digital Twin 3D Universe', category: 'Module', route: '/app/twin-3d', icon: Box },
    { title: 'Geographic Logistics Map (Satellite & Dark)', category: 'Module', route: '/app/map', icon: Layers },
    { title: 'Document Intelligence (Bill of Lading Extraction)', category: 'Module', route: '/app/documents', icon: FileText },
    { title: 'AI Recovery Planner & Governance', category: 'Module', route: '/app/recovery', icon: ShieldCheck },
  ];

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#090D24] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(0,245,255,0.2)] overflow-hidden font-sans text-left">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1E2648] bg-[#0B1030]/90">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search facilities, vehicles, shipments, corridors..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 font-mono">
              No matching logistics entities found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.route);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-cyan-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#1E2648] bg-[#070A1A] flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>Press ESC to close</span>
          <span>Click any entity to inspect in FlowTwin AI</span>
        </div>
      </div>
    </div>
  );
};
