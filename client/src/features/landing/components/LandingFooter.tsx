import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ShieldCheck, Activity, Github, Globe } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#050713] border-t border-white/[0.08] pt-16 pb-12 text-gray-400 text-xs font-sans relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06] text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#090D1E] border border-cyan-500/40 flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white">ChocoTwin</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-600 text-white">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The smart chocolate factory digital twin. Powered by multi-agent predictive intelligence,
              3D SCADA process telemetry, and automated batch optimization.
            </p>

            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational (99.99%)</span>
            </div>
          </div>

          {/* Links Column 1: Core Modules */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Core Modules
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/app/dashboard')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Control Tower & KPIs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/twin-3d')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  3D Digital Twin Universe
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/map')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Live Geospatial Logistics Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/simulations')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Disruption Simulation Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Autonomous Intelligence */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Autonomous AI
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/app/recovery')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Autonomous Recovery Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/analytics')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Multi-Agent Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/documents')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Autonomous Shipping Docs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/app/integrations')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Enterprise ERP Connectors
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Platform & Security */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Security & Trust
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOC2 Type II Certified</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sub-15ms Live Telemetry</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>140+ Global Sea/Air Hubs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} ChocoTwin AI Technologies, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
