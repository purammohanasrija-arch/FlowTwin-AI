import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Zap,
  Building2,
  Navigation,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface AICommandInterfaceProps {
  onExecuteCommand: (action: string, payload?: any) => void;
  isProcessing?: boolean;
}

const QUICK_COMMANDS = [
  { id: 'focus_disruption', label: '🚨 Focus I-80 Disruption', action: 'FOCUS_INCIDENT' },
  { id: 'focus_chicago', label: '🏢 Inspect Chicago Hub', action: 'FOCUS_FACILITY', payload: 'FAC-ORD-01' },
  { id: 'show_detour', label: '🛣️ Show I-70 Detour Bypass', action: 'SHOW_ALTERNATIVE_ROUTE' },
  { id: 'simulate_blizzard', label: '❄️ Simulate Blizzard Surge', action: 'OPEN_DISRUPTION_SIMULATOR' },
];

export const AICommandInterface: React.FC<AICommandInterfaceProps> = ({
  onExecuteCommand,
  isProcessing = false,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isProcessing) return;

    const query = inputPrompt.toLowerCase();
    if (query.includes('chicago') || query.includes('hub')) {
      onExecuteCommand('FOCUS_FACILITY', 'FAC-ORD-01');
    } else if (query.includes('disrupt') || query.includes('road') || query.includes('closure') || query.includes('incident')) {
      onExecuteCommand('FOCUS_INCIDENT');
    } else if (query.includes('detour') || query.includes('alternative') || query.includes('bypass')) {
      onExecuteCommand('SHOW_ALTERNATIVE_ROUTE');
    } else if (query.includes('blizzard') || query.includes('simulate') || query.includes('weather')) {
      onExecuteCommand('OPEN_DISRUPTION_SIMULATOR');
    } else {
      onExecuteCommand('FOCUS_OVERVIEW');
    }

    setInputPrompt('');
  };

  return (
    <div className="bg-[#0B0D18]/90 backdrop-blur-md border border-[#1E2238] rounded-xl p-2.5 shadow-2xl flex flex-col gap-2 max-w-md select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Logistics Copilot 3D Dispatch</span>
        </div>
        <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
          Agent Ready
        </span>
      </div>

      {/* Suggested Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_COMMANDS.map(chip => (
          <button
            key={chip.id}
            onClick={() => onExecuteCommand(chip.action, chip.payload)}
            className="px-2 py-1 rounded-lg bg-[#141728] hover:bg-purple-900/40 border border-[#1E2238] hover:border-purple-500/40 text-[11px] font-medium text-gray-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <input
          type="text"
          placeholder="Ask copilot to focus camera, trigger disruption..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          className="flex-1 bg-[#121424] border border-[#1E2238] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isProcessing}
          className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors"
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};
