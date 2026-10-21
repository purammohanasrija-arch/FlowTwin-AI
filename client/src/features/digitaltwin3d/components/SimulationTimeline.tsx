import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface SimulationTimelineProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  timelineProgress: number; // 0.0 to 1.0
  onSeek: (progress: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isDisruptionActive: boolean;
}

const MILESTONES = [
  { time: 0.15, label: '04:00 Fleet Dispatch', type: 'info' },
  { time: 0.35, label: '08:30 Blizzard Warning', type: 'warning' },
  { time: 0.45, label: '11:00 I-80 Road Closure', type: 'critical' },
  { time: 0.65, label: '15:30 AI Detour Active', type: 'recovery' },
  { time: 0.88, label: '21:00 Final Deliveries', type: 'success' },
];

export const SimulationTimeline: React.FC<SimulationTimelineProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  timelineProgress,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  isDisruptionActive,
}) => {
  // Convert progress to 24-hour format
  const totalMinutes = Math.floor(timelineProgress * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} UTC`;

  return (
    <div className="bg-[#0B0D18]/90 backdrop-blur-md border border-[#1E2238] rounded-xl px-4 py-2.5 shadow-2xl flex flex-col gap-2 select-none">
      {/* Top row: Controls, Current Simulation Time, Speed */}
      <div className="flex items-center justify-between">
        {/* Playback action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(Math.max(0, timelineProgress - 0.05))}
            className="p-1.5 rounded-lg bg-[#141728] hover:bg-[#1E2238] text-gray-300 hover:text-white transition-colors"
            title="Step Back 1 Hour"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`p-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => onSeek(Math.min(1, timelineProgress + 0.05))}
            className="p-1.5 rounded-lg bg-[#141728] hover:bg-[#1E2238] text-gray-300 hover:text-white transition-colors"
            title="Step Forward 1 Hour"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#141728] hover:bg-[#1E2238] text-gray-400 hover:text-gray-200 transition-colors ml-1"
            title="Reset Timeline to 00:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Time Clock */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#121424] border border-[#1E2238] rounded-lg">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-mono font-bold text-white tracking-wider">
            {timeFormatted}
          </span>
          {isDisruptionActive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              DISRUPTED
            </span>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-[#141728] p-0.5 rounded-lg border border-[#1E2238]">
          {[0.5, 1.0, 2.0, 4.0].map(speed => (
            <button
              key={speed}
              onClick={() => onChangeSpeed(speed)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                playbackSpeed === speed
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Track with Milestone Markers */}
      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={timelineProgress}
          onChange={e => onSeek(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#1E2238] rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
        />

        {/* Milestone Indicator Pins */}
        <div className="relative w-full h-4 mt-0.5 pointer-events-none">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${m.time * 100}%` }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  m.type === 'critical'
                    ? 'bg-red-500 ring-2 ring-red-500/40'
                    : m.type === 'warning'
                    ? 'bg-amber-400'
                    : m.type === 'recovery'
                    ? 'bg-purple-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-[8px] text-gray-400 whitespace-nowrap mt-0.5">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
