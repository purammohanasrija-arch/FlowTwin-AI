import React from 'react';
import {
  Layers,
  Building2,
  Truck,
  Route as RouteIcon,
  AlertTriangle,
  TrafficCone,
  Compass,
  Maximize2,
  Box,
  Search,
  Key,
  ShieldCheck,
  CheckCircle2,
  Map as MapIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MapControlsOverlayProps {
  showFacilities: boolean;
  setShowFacilities: (val: boolean) => void;
  showVehicles: boolean;
  setShowVehicles: (val: boolean) => void;
  showRoutes: boolean;
  setShowRoutes: (val: boolean) => void;
  showDisruptions: boolean;
  setShowDisruptions: (val: boolean) => void;
  showTraffic: boolean;
  setShowTraffic: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  mapType: 'dark' | 'satellite' | 'roadmap' | 'terrain';
  setMapType: (val: 'dark' | 'satellite' | 'roadmap' | 'terrain') => void;
  onFitAll: () => void;
  onFocusDisruption: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  activeProvider?: 'keyless' | 'google';
  onToggleProvider?: () => void;
}

export const MapControlsOverlay: React.FC<MapControlsOverlayProps> = ({
  showFacilities,
  setShowFacilities,
  showVehicles,
  setShowVehicles,
  showRoutes,
  setShowRoutes,
  showDisruptions,
  setShowDisruptions,
  showTraffic,
  setShowTraffic,
  searchQuery,
  setSearchQuery,
  mapType,
  setMapType,
  onFitAll,
  onFocusDisruption,
  onOpenSettings,
  hasApiKey,
  activeProvider = 'keyless',
  onToggleProvider,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Floating Command Bar - High z-index to float above Leaflet canvas */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100%-100px)] pointer-events-auto">
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D1E]/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-xs text-white">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search facility (FAC-), vehicle (TRK-), or city..."
            className="w-48 md:w-64 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Layer Filters Rail */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#090D1E]/95 border border-[#1E2642] backdrop-blur-xl shadow-2xl text-xs font-mono">
          <div className="flex items-center gap-1 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Layers className="w-3 h-3 text-purple-400" />
            <span className="hidden sm:inline">Layers:</span>
          </div>

          {/* Facilities */}
          <button
            type="button"
            onClick={() => setShowFacilities(!showFacilities)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showFacilities
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-white/[0.02] text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Warehouses, Hubs & Coastal Ports"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Facilities</span>
          </button>

          {/* Vehicles */}
          <button
            type="button"
            onClick={() => setShowVehicles(!showVehicles)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showVehicles
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                : 'bg-white/[0.02] text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Transport Fleet Trucks"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fleet</span>
          </button>

          {/* Corridors */}
          <button
            type="button"
            onClick={() => setShowRoutes(!showRoutes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showRoutes
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-white/[0.02] text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Interstate Highway Corridors"
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Corridors</span>
          </button>

          {/* Disruptions */}
          <button
            type="button"
            onClick={() => setShowDisruptions(!showDisruptions)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showDisruptions
                ? 'bg-red-950/80 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'bg-white/[0.02] text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Weather Hazards & Road Closures"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Disruptions</span>
          </button>

          {/* Live Traffic */}
          <button
            type="button"
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showTraffic
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/[0.02] text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Google Maps Real-Time Traffic Density"
          >
            <TrafficCone className="w-3.5 h-3.5" />
            <span>Traffic</span>
          </button>
        </div>

        {/* View Controls & Reset */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#090D1E]/95 border border-[#1E2642] backdrop-blur-xl shadow-2xl text-xs font-mono">
          <button
            type="button"
            onClick={onFitAll}
            className="px-2.5 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Fit map to all logistics facilities"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit Network</span>
          </button>

          <button
            type="button"
            onClick={onFocusDisruption}
            className="px-2 py-1 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors flex items-center gap-1"
            title="Focus map on I-80 Blizzard Incident"
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Blizzard Focus</span>
          </button>
        </div>

        {/* Map Style Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090D1E]/95 border border-[#1E2642] backdrop-blur-xl shadow-2xl text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMapType('dark')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              mapType === 'dark'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            title="Cyber Command Dark Canvas"
          >
            <span>🌑</span>
            <span>Dark</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              mapType === 'satellite'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400'
                : 'text-gray-400 hover:text-purple-300 hover:bg-purple-950/30'
            }`}
            title="High-Resolution Real Satellite Photography"
          >
            <span>🛰️</span>
            <span>Satellite</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              mapType === 'roadmap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            title="Roads and Cities Map"
          >
            <span>🗺️</span>
            <span>Roads</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('terrain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              mapType === 'terrain'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            title="Topographic Elevation and Physical Terrain"
          >
            <span>⛰️</span>
            <span>Terrain</span>
          </button>
        </div>

        {/* Active Map Engine Pill */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={hasApiKey && onToggleProvider ? onToggleProvider : onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-xl text-xs font-mono font-bold transition-all shadow-lg cursor-pointer ${
              activeProvider === 'google'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 hover:border-emerald-400'
                : 'bg-[#090D1E]/95 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
            }`}
            title={
              hasApiKey
                ? `Click to toggle map provider (Currently: ${activeProvider === 'google' ? 'Google Maps' : 'Keyless Dark Canvas'})`
                : 'Running in autonomous Keyless mode. Click to optionally enter a Google Maps key.'
            }
          >
            <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {activeProvider === 'google'
                ? 'Google Maps Platform'
                : 'Keyless Dark Canvas (Free)'}
            </span>
            {hasApiKey && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                Switch
              </span>
            )}
          </button>

          {!hasApiKey && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-700/60 bg-[#090D1E]/90 hover:border-purple-500/50 text-gray-400 hover:text-purple-300 text-xs font-mono transition-all shadow-lg cursor-pointer"
              title="Optionally add Google Maps API Key"
            >
              <Key className="w-3 h-3 text-purple-400" />
              <span className="hidden sm:inline">Add Key</span>
            </button>
          )}
        </div>

        {/* Jump to 3D Universe */}
        <button
          type="button"
          onClick={() => navigate('/app/twin-3d')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Ultra 3D Universe</span>
        </button>
      </div>

      {/* Bottom Left Legend & Telemetry Status - High z-index to float above Leaflet */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#090D1E]/95 backdrop-blur-xl p-3.5 rounded-2xl border border-[#1E2642] shadow-2xl text-xs space-y-2 pointer-events-none max-w-xs font-mono">
        <div className="flex items-center justify-between border-b border-[#1A223A] pb-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Network Telemetry
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-gray-300">Optimal Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-gray-300">Congested (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-gray-300">Active Truck</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-gray-300">Blizzard Hazard</span>
          </div>
        </div>

        <div className="border-t border-[#1A223A] pt-1.5 space-y-1 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-purple-500" />
            <span className="text-gray-400">Primary Interstates (I-80, I-10, I-90)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t border-dashed border-emerald-400" />
            <span className="text-emerald-400 font-bold">I-70 South Resilience Bypass Detour</span>
          </div>
        </div>
      </div>
    </>
  );
};
