import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Search,
  Menu,
  X,
  Sparkles,
  Box,
  Cpu,
  BarChart3,
  Shield,
  FileText,
  DollarSign,
} from 'lucide-react';

interface CoverNavbarProps {
  onOpenSearch: () => void;
  onOpenTour: () => void;
}

export const CoverNavbar: React.FC<CoverNavbarProps> = ({ onOpenSearch, onOpenTour }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060814]/90 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#060814]/80 via-[#060814]/40 to-transparent backdrop-blur-md border-b border-white/[0.06] py-4'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left Side: Geometric Layered Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Glowing Chocolate Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Ambient neon bloom */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-purple-600 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full rounded-xl bg-[#1A0E08] border border-amber-500/40 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#2D160A] to-[#140B07] flex items-center justify-center text-lg">
                🍫
              </div>
            </div>
          </div>

          {/* Brand Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-200 transition-colors">
                ChocoTwin
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-purple-600 text-white shadow-sm shadow-amber-600/40 border border-amber-400/30">
                AI
              </span>
            </div>
            <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-amber-400/90 uppercase pt-0.5">
              Smart Chocolate Twin
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium font-sans">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="relative text-gray-300 hover:text-white transition-colors group py-1"
          >
            <span>Products</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-200" />
          </button>

          <button
            onClick={() => navigate('/app/simulations')}
            className="relative text-gray-300 hover:text-white transition-colors group py-1"
          >
            <span>Solutions</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-200" />
          </button>

          <button
            onClick={() => navigate('/app/twin-3d')}
            className="relative flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors group py-1 font-semibold"
          >
            <Box className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>3D Digital Twin</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-200" />
          </button>

          <button
            onClick={() => navigate('/app/analytics')}
            className="relative text-gray-300 hover:text-white transition-colors group py-1"
          >
            <span>AI & Analytics</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-200" />
          </button>

          <button
            onClick={() => navigate('/app/documents')}
            className="relative text-gray-300 hover:text-white transition-colors group py-1"
          >
            <span>Resources</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-200" />
          </button>

          <button
            onClick={onOpenTour}
            className="relative text-gray-300 hover:text-white transition-colors group py-1 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Tour & Pricing</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 group-hover:w-full transition-all duration-200" />
          </button>
        </nav>

        {/* Right Side: Quick Search, Sign In, Command Center CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-gray-400 hover:text-cyan-300 hover:bg-white/[0.06] border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
            title="Search network (Press /)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sign In Button */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-[#0A0E23]/60 hover:bg-[#0A0E23]/90 border border-white/[0.1] hover:border-cyan-500/40 transition-all cursor-pointer backdrop-blur-md"
          >
            Sign In
          </button>

          {/* Enter Command Center CTA */}
          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:shadow-[0_0_35px_rgba(0,245,255,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-white/[0.05] border border-white/[0.1]"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-4 pb-6 bg-[#070A18]/95 backdrop-blur-2xl border-b border-cyan-500/20 space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                navigate('/app/dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left hover:border-cyan-500/40 text-gray-200"
            >
              <Cpu className="w-4 h-4 text-cyan-400 mb-1" />
              <div className="font-bold">Control Tower</div>
              <div className="text-[10px] text-gray-400">Live KPIs</div>
            </button>

            <button
              onClick={() => {
                navigate('/app/twin-3d');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-left hover:border-cyan-400 text-cyan-200"
            >
              <Box className="w-4 h-4 text-cyan-300 mb-1 animate-pulse" />
              <div className="font-bold">3D Universe</div>
              <div className="text-[10px] text-cyan-400">Real-World Twin</div>
            </button>

            <button
              onClick={() => {
                navigate('/app/map');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left hover:border-purple-500/40 text-gray-200"
            >
              <Layers className="w-4 h-4 text-purple-400 mb-1" />
              <div className="font-bold">Logistics Map</div>
              <div className="text-[10px] text-gray-400">Satellite & Dark</div>
            </button>

            <button
              onClick={() => {
                navigate('/app/simulations');
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-left hover:border-red-500/40 text-gray-200"
            >
              <BarChart3 className="w-4 h-4 text-amber-400 mb-1" />
              <div className="font-bold">Disruption Lab</div>
              <div className="text-[10px] text-gray-400">Shock Simulation</div>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-center font-bold text-gray-200"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                navigate('/app/dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
