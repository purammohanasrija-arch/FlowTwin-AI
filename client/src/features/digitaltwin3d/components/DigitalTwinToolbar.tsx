import React, { useState } from 'react';
import {
  Camera,
  Layers,
  Compass,
  Sparkles,
  Search,
  Maximize2,
  RotateCcw,
  Sliders,
  MapPin,
  Network,
  Box,
  Eye,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CameraPreset } from './CameraController.js';

interface DigitalTwinToolbarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  isTourActive: boolean;
  onToggleTour: () => void;
  layers: {
    facilities: boolean;
    routes: boolean;
    vehicles: boolean;
    particles: boolean;
    incidents: boolean;
    labels: boolean;
  };
  onToggleLayer: (layer: keyof DigitalTwinToolbarProps['layers']) => void;
  quality: 'high' | 'medium' | 'low';
  onChangeQuality: (q: 'high' | 'medium' | 'low') => void;
  onResetScene: () => void;
  onSearchEntity: (term: string) => void;
  facilities: any[];
  vehicles: any[];
  incidents: any[];
}

export const DigitalTwinToolbar: React.FC<DigitalTwinToolbarProps> = ({
  currentPreset,
  onSelectPreset,
  isTourActive,
  onToggleTour,
  layers,
  onToggleLayer,
  quality,
  onChangeQuality,
  onResetScene,
  onSearchEntity,
  facilities,
  vehicles,
  incidents,
}) => {
  const navigate = useNavigate();
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  // Search filter
  const filteredItems = searchQuery.trim() === '' ? [] : [
    ...facilities.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())),
    ...vehicles.filter(v => v.vehicleCode.toLowerCase().includes(searchQuery.toLowerCase())),
    ...incidents.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())),
  ].slice(0, 5);

  return (
    <div className="bg-[#0B0D18]/90 backdrop-blur-md border border-[#1E2238] rounded-xl px-3 py-2 shadow-2xl flex items-center justify-between gap-3 select-none">
      {/* LEFT: View Mode Switcher */}
      <div className="flex items-center gap-1 bg-[#121424] p-1 rounded-lg border border-[#1E2238]">
        <button
          onClick={() => navigate('/app/map')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-400 hover:text-white transition-colors"
          title="Switch to 2D Geographic Map"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>2D Map</span>
        </button>

        <button
          onClick={() => navigate('/app/network')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-400 hover:text-white transition-colors"
          title="Switch to 2D Dependency Graph"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Dependency Twin</span>
        </button>

        <button
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
          title="Ultra 3D Interactive Digital Twin"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Ultra 3D Universe</span>
        </button>
      </div>

      {/* CENTER: Camera Presets & Tour */}
      <div className="flex items-center gap-1.5 bg-[#121424] p-1 rounded-lg border border-[#1E2238]">
        <span className="text-[10px] font-semibold text-gray-300 uppercase px-1.5 flex items-center gap-1">
          <Camera className="w-3 h-3 text-purple-400" />
          Camera:
        </span>

        {(['overview', 'warehouses', 'vehicles', 'routes', 'incidents'] as CameraPreset[]).map(preset => (
          <button
            key={preset}
            onClick={() => onSelectPreset(preset)}
            className={`px-2 py-1 rounded text-xs font-medium capitalize transition-all ${
              currentPreset === preset && !isTourActive
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2238]'
            }`}
          >
            {preset}
          </button>
        ))}

        <div className="w-[1px] h-4 bg-[#1E2238] mx-0.5" />

        <button
          onClick={onToggleTour}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ${
            isTourActive
              ? 'bg-emerald-600 text-white shadow-emerald-500/30 shadow-md animate-pulse'
              : 'bg-[#1C2038] text-purple-300 hover:bg-purple-900/40 hover:text-white'
          }`}
          title="Run guided cinematic camera tour across national hubs"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{isTourActive ? 'Stop Tour' : 'Guided Tour'}</span>
        </button>
      </div>

      {/* RIGHT: Search-to-focus, Layers & Performance */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-[#121424] border border-[#1E2238] rounded-lg px-2.5 py-1 w-44 focus-within:w-56 focus-within:border-purple-500 transition-all">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search hub or vehicle..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSearchResultsOpen(true);
              }}
              onFocus={() => setSearchResultsOpen(true)}
              className="bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>

          {/* Autocomplete dropdown */}
          {searchResultsOpen && filteredItems.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#0E101D] border border-[#1E2238] rounded-lg shadow-2xl p-1 z-50">
              {filteredItems.map((item: any, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSearchEntity(item.name || item.vehicleCode || item.title);
                    setSearchResultsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#1A1D30] text-xs text-gray-200 flex items-center justify-between"
                >
                  <span className="font-semibold text-white">
                    {item.name || item.vehicleCode || item.title}
                  </span>
                  <span className="text-[10px] text-purple-400 uppercase">
                    {item.type || 'Entity'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layers Filter Toggle */}
        <div className="relative">
          <button
            onClick={() => setLayersMenuOpen(!layersMenuOpen)}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
              layersMenuOpen
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : 'bg-[#121424] border-[#1E2238] text-gray-300 hover:text-white'
            }`}
            title="Toggle Scene Layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-xs">Layers</span>
          </button>

          {layersMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#0E101D] border border-[#1E2238] rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">
                3D Display Layers
              </span>
              {[
                { key: 'facilities', label: 'Warehouses & Terminals' },
                { key: 'routes', label: 'Corridors & Highways' },
                { key: 'vehicles', label: 'Transport Fleet' },
                { key: 'particles', label: 'Photon Flow Particles' },
                { key: 'incidents', label: 'Disruption Barriers' },
                { key: 'labels', label: 'Floating HUD Badges' },
              ].map(layer => {
                const active = (layers as any)[layer.key];
                return (
                  <button
                    key={layer.key}
                    onClick={() => onToggleLayer(layer.key as any)}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-[#1A1D30] text-gray-300 transition-colors"
                  >
                    <span>{layer.label}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        active
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-gray-600 bg-black/30'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quality selector */}
        <div className="flex items-center gap-1 bg-[#121424] px-2 py-1 rounded-lg border border-[#1E2238]">
          <span className="text-[10px] text-gray-400 font-medium">Quality:</span>
          {(['high', 'medium', 'low'] as const).map(q => (
            <button
              key={q}
              onClick={() => onChangeQuality(q)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                quality === q
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Reset Camera & Baseline */}
        <button
          onClick={onResetScene}
          className="p-1.5 rounded-lg bg-[#121424] hover:bg-[#1E2238] border border-[#1E2238] text-gray-400 hover:text-white transition-colors"
          title="Reset Camera to Overview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
