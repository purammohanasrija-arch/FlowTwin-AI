import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Play,
  Box,
  Layers,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface SystemActionTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemActionTourModal: React.FC<SystemActionTourModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const TOUR_MODULES = [
    {
      title: 'Ultra 3D Logistics Universe',
      badge: 'Visual Digital Twin',
      icon: Box,
      color: 'from-cyan-500 to-blue-600',
      description:
        'Navigate the interactive supply chain universe. Zoom from transcontinental shipping corridors straight down into facility rack cutaways, autonomous forklifts, and vehicle telematics.',
      highlights: [
        'Real-time vehicle position tracking',
        '3D warehouse interior cutaways with shelf slotting',
        'Exploded graph topology mode with blast radius propagation',
      ],
      route: '/app/twin-3d',
      actionText: 'Explore 3D Universe',
    },
    {
      title: 'Live Geographic Logistics Map',
      badge: 'Geographic Intelligence',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      description:
        'Full-scale geographic basemaps powered by Satellite imagery and Cyber Dark canvases. Visualize active interstate corridors (I-80, I-70 detour, I-10, I-90), live traffic, and hazard zones.',
      highlights: [
        'Zero API key required out-of-the-box',
        'Category-specific facility markers (Ports, Rail, Airports, Hubs)',
        'Live route distance & travel time estimation',
      ],
      route: '/app/map',
      actionText: 'Open Live Logistics Map',
    },
    {
      title: 'Deterministic Disruption Simulation Lab',
      badge: 'Shock Modeling',
      icon: BarChart3,
      color: 'from-amber-500 to-rose-600',
      description:
        'Inject simulated shocks (blizzards, port strikes, interstate closures) and compute exact mathematical consequences: delay hours, detour expenses ($2.45/km + $65/h demurrage), and SLA penalties.',
      highlights: [
        'Parametric duration sliders (1-48 hours)',
        'Side-by-side scenario comparison matrix (Baseline vs. Scenario A/B)',
        'Automated delay impact calculations',
      ],
      route: '/app/simulations',
      actionText: 'Launch Disruption Lab',
    },
    {
      title: 'AI Multi-Objective Recovery Planner',
      badge: 'Human-in-the-Loop Governance',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      description:
        'Compare generated candidate mitigation plans (Fastest vs Lowest Cost vs Balanced Resilience) and submit manager authorization with cryptographic audit trails.',
      highlights: [
        'Automated FMCSA Hours of Service (HOS) validation',
        '80,000 lbs GVWR weight compliance verification',
        'Manager sign-off workflow with audit logging',
      ],
      route: '/app/recovery',
      actionText: 'Open Recovery Planner',
    },
  ];

  const current = TOUR_MODULES[activeStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090D22] border border-cyan-500/40 rounded-3xl shadow-[0_0_80px_rgba(0,245,255,0.2)] overflow-hidden text-left font-sans">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2346] bg-[#0C1230]/90">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Play className="w-4 h-4 fill-cyan-400" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                ChocoTwin AI — Guided System Tour
              </h3>
              <p className="text-[10px] font-mono text-cyan-300">
                Interactive Architecture Overview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 border-b border-[#1A2346] bg-[#070A1A]">
          {TOUR_MODULES.map((mod, idx) => (
            <button
              key={mod.title}
              onClick={() => setActiveStep(idx)}
              className={`py-3 px-2 text-[11px] font-mono font-bold transition-all border-b-2 text-center cursor-pointer ${
                activeStep === idx
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                {current.badge}
              </span>
              <h2 className="text-xl font-bold text-white mt-2">
                {current.title}
              </h2>
            </div>

            <div className={`p-3 rounded-2xl bg-gradient-to-tr ${current.color} text-white shadow-xl`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {current.description}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
            {current.highlights.map(h => (
              <div key={h} className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.08]"
                >
                  ← Previous
                </button>
              )}
              {activeStep < TOUR_MODULES.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-cyan-300 hover:text-white bg-cyan-500/20 border border-cyan-500/40"
                >
                  Next Step →
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                navigate(current.route);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
