import React from 'react';
import { X, Activity, CheckCircle, AlertTriangle, ArrowRight, Gauge, Cog, Thermometer } from 'lucide-react';

export interface SelectedFactoryEntity {
  id: string;
  name: string;
  type: string;
  purpose: string;
  status: string;
  operatingValues: Record<string, string | number>;
  description: string;
}

interface MachineDetailsModalProps {
  entity: SelectedFactoryEntity | null;
  onClose: () => void;
  onTriggerAction?: (actionName: string) => void;
}

export const MachineDetailsModal: React.FC<MachineDetailsModalProps> = ({
  entity,
  onClose,
  onTriggerAction,
}) => {
  if (!entity) return null;

  const isWarning =
    entity.status.toLowerCase().includes('need') ||
    entity.status.toLowerCase().includes('alert') ||
    entity.status.toLowerCase().includes('low') ||
    entity.status.toLowerCase().includes('err');

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] bg-[#160D08]/95 backdrop-blur-xl border-l border-amber-500/25 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-amber-500/20 flex items-start justify-between bg-[#1F120B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              {entity.type}
            </span>
            <div
              className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                isWarning
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isWarning ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span>{entity.status}</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
            {entity.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Purpose Card */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Cog className="w-3.5 h-3.5" />
            <span>Factory Purpose & Function</span>
          </div>
          <p className="text-sm text-amber-100/90 leading-relaxed font-sans">
            {entity.purpose}
          </p>
        </div>

        {/* Operating Values Table */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>Live Machine & Process Telemetry</span>
          </div>

          <div className="divide-y divide-amber-500/10 rounded-xl bg-[#21140D] border border-amber-500/20 overflow-hidden">
            {Object.entries(entity.operatingValues).map(([key, val], idx) => (
              <div key={idx} className="flex items-center justify-between px-4 py-3 text-xs">
                <span className="text-gray-300 font-medium">{key}</span>
                <span className="font-mono font-bold text-amber-200">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Industrial Context */}
        <div className="space-y-1.5 text-xs text-gray-300/90 leading-relaxed p-3.5 rounded-xl bg-black/30 border border-white/5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Technical Overview
          </div>
          <p>{entity.description}</p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-amber-500/20 bg-[#1A0E08] flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Close Inspector
        </button>
        {onTriggerAction && (
          <button
            onClick={() => onTriggerAction('run_diagnostics')}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <span>Run Diagnostics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
