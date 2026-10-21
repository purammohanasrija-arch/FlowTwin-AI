import React, { useState } from 'react';
import {
  X,
  Zap,
  Sliders,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  Navigation,
} from 'lucide-react';
import { api } from '../../../lib/api.js';

interface DisruptionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
  defaultTarget?: string;
  onSimulationSuccess: (simulationResult: any) => void;
}

export const DisruptionSimulatorModal: React.FC<DisruptionSimulatorModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'road_closure',
  defaultTarget = 'I-80',
  onSimulationSuccess,
}) => {
  const [disruptionType, setDisruptionType] = useState(defaultType);
  const [targetCorridor, setTargetCorridor] = useState(defaultTarget);
  const [durationHours, setDurationHours] = useState(8);
  const [capacityReduction, setCapacityReduction] = useState(75);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const payload = {
        name: `${disruptionType.replace('_', ' ').toUpperCase()} on ${targetCorridor}`,
        disruption: {
          type: disruptionType,
          severity: durationHours >= 12 ? 'critical' : durationHours >= 6 ? 'severe' : 'moderate',
          corridor: targetCorridor,
          durationHours,
          capacityReductionPct: capacityReduction,
        },
      };

      const result: any = await api.post('/simulations', payload);
      onSimulationSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Simulation execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0E101D] border border-purple-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white relative animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2238]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Disruption Laboratory</h2>
              <p className="text-xs text-gray-400">Configure parameters & run deterministic simulation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1E2238] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4 text-xs">
          {/* Disruption Type */}
          <div>
            <label className="block font-semibold text-gray-300 mb-1.5">Disruption Scenario:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'road_closure', label: 'Highway Road Closure' },
                { id: 'severe_weather', label: 'Midwest Blizzard Surge' },
                { id: 'vehicle_breakdown', label: 'Fleet Vehicle Breakdown' },
                { id: 'warehouse_outage', label: 'Regional Hub Outage' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDisruptionType(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    disruptionType === opt.id
                      ? 'bg-purple-600/25 border-purple-500 text-white font-bold'
                      : 'bg-[#121424] border-[#1E2238] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Corridor / Hub */}
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Target Corridor / Facility:</label>
            <select
              value={targetCorridor}
              onChange={e => setTargetCorridor(e.target.value)}
              className="w-full bg-[#121424] border border-[#1E2238] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="I-80">I-80 Corridor (Chicago - Omaha - New York)</option>
              <option value="I-70">I-70 Corridor (Indianapolis - Columbus - Pittsburgh)</option>
              <option value="I-10">I-10 Transcontinental (Los Angeles - Phoenix - Dallas)</option>
              <option value="I-75">I-75 North-South (Detroit - Atlanta)</option>
              <option value="I-90">I-90 Northern Arterial (Seattle - Chicago)</option>
            </select>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-300">Expected Blockage Duration:</span>
              <span className="font-bold text-purple-400 text-sm">{durationHours} Hours</span>
            </div>
            <input
              type="range"
              min={2}
              max={36}
              step={1}
              value={durationHours}
              onChange={e => setDurationHours(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#1E2238] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>2h (Minor incident)</span>
              <span>12h (Severe blizzard)</span>
              <span>36h (Catastrophic bridge closure)</span>
            </div>
          </div>

          {/* Capacity Reduction */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-300">Throughput Capacity Impairment:</span>
              <span className="font-bold text-red-400 text-sm">{capacityReduction}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={capacityReduction}
              onChange={e => setCapacityReduction(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#1E2238] rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1E2238] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141728] hover:bg-[#1E2238] text-gray-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 disabled:opacity-50 transition-all"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating Deterministic Impact...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Execute 3D Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
