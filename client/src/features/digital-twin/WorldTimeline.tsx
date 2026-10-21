import React from 'react';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const WorldTimeline: React.FC = () => {
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);
  const togglePlay = useDigitalTwinStore(s => s.togglePlay);
  const playbackSpeed = useDigitalTwinStore(s => s.playbackSpeed);
  const setPlaybackSpeed = useDigitalTwinStore(s => s.setPlaybackSpeed);
  const timelineProgress = useDigitalTwinStore(s => s.timelineProgress);
  const seekTimeline = useDigitalTwinStore(s => s.seekTimeline);
  const simulationTimeHours = useDigitalTwinStore(s => s.simulationTimeHours);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const resetScene = useDigitalTwinStore(s => s.resetScene);

  // Format 24h time into HH:MM:SS
  const formatTime = (hours: number) => {
    const h = Math.floor(hours) % 24;
    const m = Math.floor((hours * 60) % 60);
    const s = Math.floor((hours * 3600) % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2.5 rounded-2xl bg-[#090D1E]/95 border border-[#1E2648] shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl text-white select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isPlaying
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              seekTimeline(0);
            }}
            className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 transition-colors cursor-pointer"
            title="Rewind to 00:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#13182E] rounded-xl p-1 border border-gray-800 text-[11px] font-mono">
            {[0.5, 1.0, 2.0, 5.0].map(spd => (
              <button
                key={spd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaybackSpeed(spd);
                }}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00F5FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Timeline Progress Scrubber with Event Markers */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={timelineProgress}
              onChange={e => seekTimeline(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#171D36] rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />

            {/* Event Marker 1: Blizzard Incident at 38% */}
            {isDisruptionActive && (
              <div
                title="Event: I-80 Blizzard Roadblock Detected"
                onClick={() => seekTimeline(0.38)}
                className="absolute top-1/2 -translate-y-1/2 left-[38%] w-3 h-3 rounded-full bg-red-500 border border-white cursor-pointer shadow-[0_0_8px_#EF4444]"
              />
            )}

            {/* Event Marker 2: Recovery Plan at 55% */}
            <div
              title="Event: I-70 Bypass Recovery Plan"
              onClick={() => seekTimeline(0.55)}
              className="absolute top-1/2 -translate-y-1/2 left-[55%] w-2.5 h-2.5 rounded-full bg-purple-400 border border-white cursor-pointer shadow-[0_0_8px_#A855F7]"
            />
          </div>

          {/* Time & Event Labels */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
            <span>00:00:00</span>
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              SIM CLOCK: {formatTime(simulationTimeHours)}
            </span>
            <span>23:59:59</span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>DETERMINISTIC SIM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
