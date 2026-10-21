import React, { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { QualityPreset, CameraMode, ViewLayer } from '../digital-twin/types.js';
import { WorldEnvironment } from '../digital-twin/WorldEnvironment.js';
import { WorldLighting } from '../digital-twin/WorldLighting.js';
import { WorldTerrain } from '../digital-twin/WorldTerrain.js';
import { WarehouseCluster } from '../digital-twin/WarehouseCluster.js';
import { WarehouseInterior } from '../digital-twin/WarehouseInterior.js';
import { RouteNetwork } from '../digital-twin/RouteNetwork.js';
import { ParticleSystems } from '../digital-twin/ParticleSystems.js';
import { VehicleFleet } from '../digital-twin/VehicleFleet.js';
import { CargoVisualization } from '../digital-twin/CargoVisualization.js';
import { DisruptionEffects } from '../digital-twin/DisruptionEffects.js';
import { RiskVisualization } from '../digital-twin/RiskVisualization.js';
import { ExplodedSupplyChainGraph } from '../digital-twin/ExplodedSupplyChainGraph.js';
import { AIAgentCommandCenter3D } from '../digital-twin/AIAgentCommandCenter3D.js';
import { ScenarioRenderer } from '../digital-twin/ScenarioRenderer.js';
import { SpatialLabels } from '../digital-twin/SpatialLabels.js';
import { CameraDirector } from '../digital-twin/CameraDirector.js';
import { WorldMinimap } from '../digital-twin/WorldMinimap.js';
import { SelectedEntityDrawer } from '../digital-twin/SelectedEntityDrawer.js';
import { NetworkConnections3D } from '../digital-twin/NetworkConnections3D.js';
import { ConnectedNetworkGraph2D } from './ConnectedNetworkGraph2D.js';
import { api } from '../../lib/api.js';
import {
  Network,
  Compass,
  Layers,
  Search,
  Camera,
  Eye,
  RefreshCw,
  Box,
  AlertTriangle,
  Zap,
  Building2,
  Truck,
  Package,
  Route as RouteIcon,
  Activity,
  Sliders,
  ChevronDown,
  Minimize2,
  Maximize2,
  ShieldAlert,
  ArrowRight,
  Disc,
  GitFork,
  Share2,
  Filter,
} from 'lucide-react';

const CanvasReadyNotifier: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  useEffect(() => {
    const t = setTimeout(onReady, 250);
    return () => clearTimeout(t);
  }, [onReady]);
  return null;
};

export const DigitalTwinPage: React.FC = () => {
  const navigate = useNavigate();

  // Store bindings
  const quality = useDigitalTwinStore(s => s.quality);
  const setQuality = useDigitalTwinStore(s => s.setQuality);
  const cameraMode = useDigitalTwinStore(s => s.cameraMode);
  const setCameraMode = useDigitalTwinStore(s => s.setCameraMode);
  const focusOnPosition = useDigitalTwinStore(s => s.focusOnPosition);
  const followVehicle = useDigitalTwinStore(s => s.followVehicle);
  const layers = useDigitalTwinStore(s => s.layers);
  const toggleLayer = useDigitalTwinStore(s => s.toggleLayer);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const routes = useDigitalTwinStore(s => s.routes);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const triggerDisruption = useDigitalTwinStore(s => s.triggerDisruption);
  const resolveDisruption = useDigitalTwinStore(s => s.resolveDisruption);
  const applyRecoveryPlan = useDigitalTwinStore(s => s.applyRecoveryPlan);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const resetScene = useDigitalTwinStore(s => s.resetScene);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);
  const stepSimulation = useDigitalTwinStore(s => s.stepSimulation);
  const syncBackendData = useDigitalTwinStore(s => s.syncBackendData);
  const explodedGraph = useDigitalTwinStore(s => s.explodedGraph);
  const toggleExplodedGraph = useDigitalTwinStore(s => s.toggleExplodedGraph);
  const setExplodedLayoutMode = useDigitalTwinStore(s => s.setExplodedLayoutMode);
  const setExplosionSpread = useDigitalTwinStore(s => s.setExplosionSpread);
  const setExplodedActiveLayer = useDigitalTwinStore(s => s.setExplodedActiveLayer);

  // Local state
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [is3DReady, setIs3DReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLSupported(false);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Fetch and sync backend operational data on mount
  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const [facRes, routeRes, vehRes, plansRes] = await Promise.allSettled([
          api.get<any>('/facilities'),
          api.get<any>('/routes'),
          api.get<any>('/vehicles'),
          api.get<any>('/recovery-plans'),
        ]);

        const facs = facRes.status === 'fulfilled' ? facRes.value.facilities : undefined;
        const rts = routeRes.status === 'fulfilled' ? routeRes.value.routes : undefined;
        const vehs = vehRes.status === 'fulfilled' ? vehRes.value.vehicles : undefined;
        const plans = plansRes.status === 'fulfilled' ? plansRes.value.plans : undefined;

        syncBackendData({
          facilities: facs,
          routes: rts,
          vehicles: vehs,
          recoveryPlans: plans,
        });
      } catch (err) {
        console.warn('Backend live sync fallback to procedural 3D data:', err);
      }
    };

    fetchOperationalData();
  }, [syncBackendData]);

  // Simulation clock ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepSimulation(1.5);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, stepSimulation]);

  // Quick entity search & camera focus
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();

    // 1. Facility match
    const fac = facilities.find(
      f => f.name.toLowerCase().includes(q) || f.facilityCode.toLowerCase().includes(q)
    );
    if (fac) {
      focusOnPosition(fac.position3D, fac.position3D);
      selectEntity({ type: 'facility', id: fac.facilityCode, data: fac });
      setSearchQuery('');
      return;
    }

    // 2. Vehicle match
    const veh = vehicles.find(
      v => v.vehicleCode.toLowerCase().includes(q) || v.carrierName.toLowerCase().includes(q)
    );
    if (veh) {
      followVehicle(veh.vehicleCode);
      selectEntity({ type: 'vehicle', id: veh.vehicleCode, data: veh });
      setSearchQuery('');
      return;
    }

    // 3. Route corridor match
    const rt = routes.find(
      r =>
        (r.roadCorridor && r.roadCorridor.toLowerCase().includes(q)) ||
        (r.name && r.name.toLowerCase().includes(q))
    );
    if (rt) {
      selectEntity({ type: 'route', id: rt.routeCode, data: rt });
      setSearchQuery('');
      return;
    }

    // 4. Incident match
    const inc = incidents.find(
      i =>
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.affectedCorridor && i.affectedCorridor.toLowerCase().includes(q))
    );
    if (inc) {
      focusOnPosition(inc.location.position3D, inc.location.position3D);
      selectEntity({ type: 'incident', id: inc.incidentCode, data: inc });
      setSearchQuery('');
      return;
    }
  };

  // Toggle Disruption Blast Radius on I-80 corridor
  const handleToggleBlastRadius = () => {
    if (isDisruptionActive) {
      const activeInc = incidents[0];
      if (activeInc) {
        resolveDisruption(activeInc.incidentCode);
      }
    } else {
      triggerDisruption({
        title: 'I-80 Blizzard Emergency Roadblock',
        affectedCorridor: 'I-80',
        severity: 'critical',
      });
    }
  };

  // Camera preset handler
  const handleCameraPreset = (mode: string) => {
    if (mode === 'overview') {
      focusOnPosition([0, 52, 60], [0, 0, 0]);
      setCameraMode('overview');
    } else if (mode === 'top_down') {
      focusOnPosition([0, 85, 0], [0, 0, 0]);
      setCameraMode('overview');
    } else if (mode === 'follow_trk101') {
      followVehicle('TRK-101');
    } else if (mode === 'focus_chicago') {
      const chi = facilities.find(f => f.facilityCode === 'FAC-CHI-01');
      if (chi) {
        focusOnPosition([chi.position3D[0], chi.position3D[1] + 16, chi.position3D[2] + 24], chi.position3D);
        selectEntity({ type: 'facility', id: chi.facilityCode, data: chi });
      }
    } else if (mode === 'focus_pacific') {
      const lax = facilities.find(f => f.facilityCode === 'FAC-LAX-03');
      if (lax) {
        focusOnPosition([lax.position3D[0], lax.position3D[1] + 18, lax.position3D[2] + 28], lax.position3D);
        selectEntity({ type: 'facility', id: lax.facilityCode, data: lax });
      }
    } else if (mode === 'reset') {
      resetScene();
    }
  };

  if (!webGLSupported) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[#070913] text-white p-8 rounded-2xl border border-red-900/40 font-mono">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">WebGL Hardware Acceleration Unavailable</h2>
        <p className="text-sm text-gray-400 max-w-md text-center mb-6">
          The 3D Supply Chain Network Twin requires WebGL. Please ensure hardware acceleration is enabled in your browser settings.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono"
        >
          Retry WebGL Initialization
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] rounded-2xl border border-[#24283E] flex flex-col relative overflow-hidden bg-[#070913] select-none shadow-2xl">
      {/* 1. VISUALIZATION CANVAS LAYER: 3D SPATIAL UNIVERSE OR 2D TOPOLOGY GRAPH (Layer z-0) */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3d' ? (
          <Canvas
            shadows={quality === 'cinematic'}
            camera={{ position: [0, 52, 60], fov: 45, near: 0.1, far: 1000 }}
            dpr={[1, quality === 'cinematic' ? 2 : quality === 'balanced' ? 1.5 : 1]}
            gl={{
              antialias: quality !== 'performance',
              alpha: false,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              {/* Ambient & Directional Sun Lighting */}
              <WorldLighting />

              {/* Atmospheric Environment & Weather */}
              <WorldEnvironment />

              {/* Smooth OrbitControls & Camera Director */}
              <CameraDirector />

              {/* Cybernetic Dark Terrain with Spatial Grid & Highways */}
              <WorldTerrain />

              {/* 10 Detailed Industrial Facilities (Ports, Hubs, Cross-Docks) */}
              <WarehouseCluster />

              {/* Exploded Interior Cutaway View */}
              <WarehouseInterior />

              {/* 3D Catmull-Rom Transport Corridors & Arterial Splines */}
              <RouteNetwork />

              {/* Glowing 3D Parabolic Network Connection Arcs & Traveling Pulse Beads */}
              <NetworkConnections3D />

              {/* GPU Directional Route Flow Particles */}
              <ParticleSystems />

              {/* 3D Transport Fleet with Real Trajectory Traversal */}
              <VehicleFleet />

              {/* 3D Physical Cargo, Containers & Pallets */}
              <CargoVisualization />

              {/* Disruption Shockwaves, Barricades & Roadblocks */}
              <DisruptionEffects />

              {/* 3D Capacity Towers & Spatial Risk Heatmap */}
              <RiskVisualization />

              {/* 7-Tier Supply Chain Exploded Dependency Graph */}
              <ExplodedSupplyChainGraph />

              {/* 3D AI Neural Command Mesh */}
              <AIAgentCommandCenter3D />

              {/* Multi-Future Scenario Comparison */}
              <ScenarioRenderer />

              {/* Holographic 3D Floating Labels */}
              <SpatialLabels />

              {/* First Frame Rendered Notifier */}
              <CanvasReadyNotifier onReady={() => setIs3DReady(true)} />
            </Suspense>
          </Canvas>
        ) : (
          <ConnectedNetworkGraph2D isBlastRadiusActive={isDisruptionActive} />
        )}
      </div>

      {/* 2. TOP GLASSMORPHISM CONTROL BAR (Layer z-20) */}
      <div className="absolute top-3 left-3 right-3 z-20 pointer-events-auto flex flex-wrap items-center justify-between gap-2.5 bg-[#0A0D1D]/90 backdrop-blur-xl p-2.5 rounded-2xl border border-white/[0.09] shadow-2xl">
        {/* Title, Perspective Switcher & Live Status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 pr-2.5 border-r border-white/[0.1]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-white font-mono tracking-wider">
                  NETWORK TWIN
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  {viewMode === '3d' ? '3D Spatial' : '2D Topology'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono hidden sm:block">
                Interconnected Supply Chain Graph
              </span>
            </div>
          </div>

          {/* Perspective View Switcher: 3D Spatial Universe vs 2D Connected Topology */}
          <div className="flex items-center bg-[#10142B] p-0.5 rounded-xl border border-white/[0.08] shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-300" />
              <span>3D Spatial</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-purple-300" />
              <span>2D Topology</span>
            </button>
          </div>

          {/* Connection Counter Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#11162C] border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>15 CONNECTIONS ACTIVE</span>
          </div>

          {/* Active Disruption Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-semibold transition-all ${
              isDisruptionActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            <AlertTriangle className={`w-3 h-3 ${isDisruptionActive ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span>{isDisruptionActive ? '1 DISRUPTION (I-80)' : 'ALL OPTIMAL'}</span>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12162B]/90 border border-white/[0.08] focus-within:border-cyan-400 transition-colors w-64 max-w-xs shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hub, TRK-101, I-80..."
            className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
          />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Trace Disruption Blast Radius Button */}
          <button
            onClick={handleToggleBlastRadius}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDisruptionActive
                ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-lg shadow-rose-500/25 ring-1 ring-rose-500'
                : 'bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
            }`}
            title="Toggle I-80 Winter Blizzard & Road Closure Disruption"
          >
            <Zap className={`w-3.5 h-3.5 ${isDisruptionActive ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            <span>{isDisruptionActive ? 'Blast Radius Active' : 'Trace Disruption Blast Radius'}</span>
          </button>

          {/* 3D Exploded Layer Graph Toggle Button */}
          <button
            onClick={() => toggleExplodedGraph()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              explodedGraph.active
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                : 'bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
            }`}
            title="Toggle 7-Tier 3D Exploded Supply Chain Dependency Graph"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">3D Exploded Graph</span>
          </button>

          {/* Camera Mode Selector */}
          <div className="relative">
            <select
              value={cameraMode}
              onChange={e => handleCameraPreset(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#12162B] border border-white/[0.08] text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <option value="overview">🔭 Overview</option>
              <option value="top_down">⬇️ Top-Down (2D/3D Map)</option>
              <option value="follow_trk101">🚛 Follow TRK-101</option>
              <option value="focus_chicago">🏢 Focus Chicago Hub</option>
              <option value="focus_pacific">🚢 Focus Pacific Port</option>
              <option value="reset">🔄 Reset View</option>
            </select>
          </div>

          {/* Layers Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLayersMenuOpen(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                layersMenuOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/[0.08]'
              }`}
              title="Toggle View Layers"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Layers</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {layersMenuOpen && (
              <div className="absolute right-0 top-10 w-56 p-3 rounded-2xl bg-[#090D1E]/95 border border-[#232B4E] backdrop-blur-2xl shadow-2xl space-y-2 text-xs font-mono text-gray-300 z-50">
                <span className="font-bold text-cyan-300 text-[11px] block border-b border-gray-800 pb-1">
                  NETWORK LAYERS
                </span>
                {(
                  [
                    ['facilities', 'Warehouses & Ports'],
                    ['routes', 'Corridors & Splines'],
                    ['vehicles', 'Transport Fleet'],
                    ['cargo', 'Cargo & Consignments'],
                    ['particles', 'Directional Flow Pulses'],
                    ['incidents', 'Disruption Zone'],
                    ['labels', 'Spatial HUD Labels'],
                  ] as [ViewLayer, string][]
                ).map(([lKey, label]) => (
                  <label
                    key={lKey}
                    className="flex items-center justify-between cursor-pointer hover:text-white py-0.5"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={!!layers[lKey]}
                      onChange={() => toggleLayer(lKey)}
                      className="accent-cyan-400 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Quality Preset Toggle */}
          <div className="hidden xl:flex items-center bg-[#12162B] rounded-xl p-0.5 border border-white/[0.08] text-[10px] font-mono">
            {(['cinematic', 'balanced', 'performance'] as QualityPreset[]).map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-2 py-1 rounded-lg uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  quality === q
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/40'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {q.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Launch Ultra 3D Universe Shortcut */}
          <button
            onClick={() => navigate('/app/twin-3d')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            title="Launch Fullscreen 3D Universe"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ultra 3D</span>
          </button>
        </div>
      </div>

      {/* 2.5 3D EXPLODED GRAPH CONTROLLER STRIP (when exploded mode is active) */}
      {explodedGraph.active && (
        <div className="absolute top-16 left-3 right-3 z-20 pointer-events-auto max-w-4xl mx-auto px-4 py-2 rounded-2xl bg-[#090D1E]/95 border border-purple-500/40 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 uppercase tracking-wider text-[11px]">
              7-Tier Exploded Layout:
            </span>
            <div className="flex items-center bg-[#070A16] p-0.5 rounded-lg border border-[#232B4E]">
              <button
                onClick={() => setExplodedLayoutMode('stacked')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  explodedGraph.layoutMode === 'stacked' ? 'bg-cyan-500 text-black' : 'text-gray-400'
                }`}
              >
                Stratified
              </button>
              <button
                onClick={() => setExplodedLayoutMode('radial')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  explodedGraph.layoutMode === 'radial' ? 'bg-purple-600 text-white' : 'text-gray-400'
                }`}
              >
                Radial
              </button>
              <button
                onClick={() => setExplodedLayoutMode('dag_tree')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  explodedGraph.layoutMode === 'dag_tree' ? 'bg-emerald-500 text-black' : 'text-gray-400'
                }`}
              >
                DAG Flow
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Spread:</span>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={explodedGraph.explosionSpread ?? 1.0}
              onChange={e => setExplosionSpread(parseFloat(e.target.value))}
              className="w-20 accent-purple-500 cursor-pointer h-1.5"
            />
            <button
              onClick={() => toggleExplodedGraph()}
              className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 hover:text-white text-[10px]"
            >
              Exit 3D Graph
            </button>
          </div>
        </div>
      )}

      {/* 3. DISRUPTION BLAST RADIUS ALERT BANNER */}
      {isDisruptionActive && (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto flex items-center gap-3 bg-rose-950/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-rose-500/50 text-rose-200 shadow-2xl max-w-xl text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          <div className="flex-1 leading-snug">
            <span className="font-bold text-white">I-80 Blizzard Road Closure Active:</span> Chicago Hub & TRK-101
            impacted with +4.5h delay. Southern bypass route via I-70 corridor illuminated with 91% feasibility.
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => applyRecoveryPlan('REC-2026-BETA')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-[11px] shadow-sm cursor-pointer"
              title="Reroute affected freight via I-70 bypass corridor"
            >
              Apply Detour
            </button>
            <button
              onClick={() => navigate('/app/simulations')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-white font-semibold transition-all border border-rose-500/40 text-[11px] cursor-pointer"
            >
              Simulate in Lab
            </button>
          </div>
        </div>
      )}

      {/* 4. SCENE-MATCHING TOPOLOGY LEGEND (Bottom-Left, Layer z-20) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
        {showLegend ? (
          <div className="bg-[#090D1E]/95 backdrop-blur-xl p-3.5 rounded-2xl border border-white/[0.09] shadow-2xl text-xs space-y-2 max-w-xs animate-in fade-in duration-200">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-white/[0.08] pb-1.5">
              <span>Topology Legend</span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Collapse Legend"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            {/* Facilities Layer Toggle */}
            <div
              onClick={() => toggleLayer('facilities')}
              className="flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#10B981]" />
                <span className="text-gray-300 text-[11px] group-hover:text-white">
                  Logistics Facilities (Tier 1/2)
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">{facilities.length}</span>
            </div>

            {/* Vehicles Layer Toggle */}
            <div
              onClick={() => toggleLayer('vehicles')}
              className="flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_#06B6D4]" />
                <span className="text-gray-300 text-[11px] group-hover:text-white">
                  Carrier Fleet Asset (Interstate Tractors)
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">{vehicles.length}</span>
            </div>

            {/* Cargo / Shipments Layer Toggle */}
            <div
              onClick={() => toggleLayer('cargo')}
              className="flex items-center justify-between cursor-pointer group hover:bg-white/[0.04] p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#8B5CF6]" />
                <span className="text-gray-300 text-[11px] group-hover:text-white">
                  Active Consignments & Cargo
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">25+</span>
            </div>

            {/* Disrupted Route Edge */}
            <div
              onClick={handleToggleBlastRadius}
              className="flex items-center justify-between cursor-pointer group hover:bg-rose-950/30 p-1 rounded-lg transition-colors border-t border-white/[0.06] pt-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-rose-500 shrink-0 shadow-[0_0_8px_#EF4444]" />
                <span className="text-rose-300 text-[11px] font-semibold group-hover:text-rose-200">
                  Disrupted Route (I-80 Blizzard)
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">
                {isDisruptionActive ? 'CLOSED' : 'CLEAR'}
              </span>
            </div>

            {/* Proposed Recovery Bypass Route */}
            <div
              onClick={() => applyRecoveryPlan('REC-2026-BETA')}
              className="flex items-center justify-between cursor-pointer group hover:bg-purple-950/30 p-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-purple-400 border-b border-dashed border-purple-300 shrink-0 shadow-[0_0_8px_#A855F7]" />
                <span className="text-purple-300 text-[11px] font-semibold group-hover:text-purple-200">
                  Proposed Recovery Bypass (I-70)
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300">
                PLAN
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090D1E]/90 border border-white/[0.09] text-xs font-mono text-gray-300 hover:text-white shadow-xl cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show Legend</span>
          </button>
        )}
      </div>

      {/* 5. SYNCHRONIZED TACTICAL RADAR MINIMAP (Bottom-Right, Layer z-20, only for 3D mode) */}
      {viewMode === '3d' && (
        <div className="absolute bottom-20 right-4 z-20 pointer-events-auto flex flex-col items-end gap-1.5">
          {showMinimap ? (
            <div className="relative animate-in fade-in duration-200">
              <div className="absolute -top-7 right-0 flex items-center gap-1 text-[10px] font-mono text-gray-400">
                <button
                  onClick={() => setShowMinimap(false)}
                  className="px-2 py-0.5 rounded-lg bg-[#090D1E]/90 border border-white/[0.08] text-gray-400 hover:text-white cursor-pointer"
                  title="Collapse Tactical Radar"
                >
                  Hide Radar
                </button>
              </div>
              {/* WorldMinimap component */}
              <WorldMinimap />
            </div>
          ) : (
            <button
              onClick={() => setShowMinimap(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090D1E]/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white shadow-xl cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Open Tactical Radar</span>
            </button>
          )}
        </div>
      )}

      {/* 6. CONTEXTUAL SELECTED ENTITY TELEMETRY DRAWER (Right Side, Layer z-30) */}
      {selectedEntity && (
        <div className="absolute top-16 right-4 z-30 pointer-events-auto max-h-[calc(100vh-140px)] overflow-y-auto">
          <SelectedEntityDrawer />
        </div>
      )}

      {/* 7. INITIALIZING HARDWARE ACCELERATION OVERLAY */}
      {!is3DReady && viewMode === '3d' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#070913]/95 backdrop-blur-md transition-opacity duration-700">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 animate-ping absolute" />
            <div className="w-16 h-16 rounded-full border-2 border-purple-500 border-t-cyan-400 border-r-transparent animate-spin" />
            <Box className="w-7 h-7 text-purple-400 absolute animate-pulse" />
          </div>

          <div className="text-center space-y-2 max-w-sm px-6">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono">
                COMPILING 3D SUPPLY CHAIN TWIN
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Allocating WebGL GPU pipeline, generating 3D route corridors, and streaming real-time logistics telemetry...
            </p>

            <div className="w-full bg-[#181B2B] h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
              <div className="bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 h-full w-full animate-pulse" />
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 font-mono pt-1">
              <span>HARDWARE ACCELERATION: ON</span>
              <span>STANDBY...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
