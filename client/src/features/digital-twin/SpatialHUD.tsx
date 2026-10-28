import React, { useState, useEffect } from 'react';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { QualityPreset, WeatherPreset, CameraMode, ViewLayer } from './types.js';
import { CHOCOLATE_PROCESS_STAGES } from './initialData.js';
import {
  Compass,
  Layers,
  Search,
  Camera,
  CloudSun,
  Sparkles,
  Maximize2,
  Building2,
  Truck,
  Route,
  Activity,
  AlertTriangle,
  Bot,
  Sliders,
  Send,
  Eye,
  RefreshCw,
  GitCompare,
  Box,
  Network,
  Disc,
  GitFork,
  RotateCw,
  SlidersHorizontal,
  Filter,
  Share2,
  Zap,
  BookOpen,
  Thermometer,
  Droplets,
  X,
} from 'lucide-react';
import { WorldMinimap } from './WorldMinimap.js';
import { WorldTimeline } from './WorldTimeline.js';
import { SelectedEntityDrawer } from './SelectedEntityDrawer.js';

const STAGE_EXPLANATIONS: Record<number, string> = {
  1: 'Raw cocoa beans arrive from international ports, undergo optical sorting and moisture regulation, and are stored in bulk stainless silos.',
  2: 'Thermal drum roasters develop rich chocolate aromas and precursor flavors under strict heat profiles (135°C–140°C).',
  3: 'High-velocity winnowers crush the roasted beans and blow away brittle husks, leaving pure aromatic cocoa nibs.',
  4: 'Hydraulic presses exert massive mechanical pressure to separate pure golden cocoa butter from dense cocoa cake.',
  5: 'Milk powder, sugar, vanilla, and cocoa liquor are dosed with recipe stoichiometry in continuous paddle blenders.',
  6: 'Molten chocolate is kneaded and sheared at 48°C for 24 hours to evaporate unwanted volatiles and refine particle size under 20 microns.',
  7: 'Chocolate is precisely cooled to 28°C and gently reheated to 31°C to seed stable Form V crystals for crisp snap and glossy sheen.',
  8: 'Continuous heated jacketed rail tankers transfer bulk liquid chocolate (couverture) without solidification risk.',
  9: 'Continuous depositors meter chocolate into polycarbonate molds, vibrating out air voids and cooling for bar setting.',
  10: 'High-speed automated wrapping seals bars in foil and barrier film, passing through metal/vision scanners to the 18°C vault.',
};

export const SpatialHUD: React.FC = () => {
  const quality = useDigitalTwinStore(s => s.quality);
  const setQuality = useDigitalTwinStore(s => s.setQuality);
  const weather = useDigitalTwinStore(s => s.weather);
  const setWeather = useDigitalTwinStore(s => s.setWeather);
  const cameraMode = useDigitalTwinStore(s => s.cameraMode);
  const setCameraMode = useDigitalTwinStore(s => s.setCameraMode);
  const isTourActive = useDigitalTwinStore(s => s.isTourActive);
  const layers = useDigitalTwinStore(s => s.layers);
  const toggleLayer = useDigitalTwinStore(s => s.toggleLayer);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const resetScene = useDigitalTwinStore(s => s.resetScene);
  const toggleWarehouseCutaway = useDigitalTwinStore(s => s.toggleWarehouseCutaway);
  const toggleExplodedGraph = useDigitalTwinStore(s => s.toggleExplodedGraph);
  const explodedGraph = useDigitalTwinStore(s => s.explodedGraph);
  const setExplodedLayoutMode = useDigitalTwinStore(s => s.setExplodedLayoutMode);
  const setExplosionSpread = useDigitalTwinStore(s => s.setExplosionSpread);
  const setExplodedActiveLayer = useDigitalTwinStore(s => s.setExplodedActiveLayer);
  const toggleExplodedAutoRotate = useDigitalTwinStore(s => s.toggleExplodedAutoRotate);
  const toggleExplodedLinkFlow = useDigitalTwinStore(s => s.toggleExplodedLinkFlow);
  const setBlastRadiusNode = useDigitalTwinStore(s => s.setBlastRadiusNode);
  const warehouseCutaway = useDigitalTwinStore(s => s.warehouseCutaway);
  const scenarioComparison = useDigitalTwinStore(s => s.scenarioComparison);
  const setScenarioComparison = useDigitalTwinStore(s => s.setScenarioComparison);
  const triggerDisruption = useDigitalTwinStore(s => s.triggerDisruption);
  const executeAICommand = useDigitalTwinStore(s => s.executeAICommand);
  const aiCopilot = useDigitalTwinStore(s => s.aiCopilot);
  const followedVehicleId = useDigitalTwinStore(s => s.followedVehicleId);
  const followVehicle = useDigitalTwinStore(s => s.followVehicle);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const focusOnFacility = useDigitalTwinStore(s => s.focusOnFacility);
  const factoryKPIs = useDigitalTwinStore(s => s.factoryKPIs);
  const labelDisplayMode = useDigitalTwinStore(s => s.labelDisplayMode);
  const setLabelDisplayMode = useDigitalTwinStore(s => s.setLabelDisplayMode);

  // Local state for drawers & modals
  const [searchQuery, setSearchQuery] = useState('');
  const [layersOpen, setLayersOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [disruptionModalOpen, setDisruptionModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [responseDismissed, setResponseDismissed] = useState(false);
  const [kpiBarVisible, setKpiBarVisible] = useState(true);
  const [walkthroughOpen, setWalkthroughOpen] = useState(true);
  const [autoTourActive, setAutoTourActive] = useState(false);

  // Determine active process stage
  const currentStageIndex = Math.max(
    0,
    CHOCOLATE_PROCESS_STAGES.findIndex(s => s.facilityCode === selectedEntity?.id)
  );
  const activeStage = CHOCOLATE_PROCESS_STAGES[currentStageIndex] || CHOCOLATE_PROCESS_STAGES[0];
  const activeFacility = facilities.find(f => f.facilityCode === activeStage.facilityCode);

  // Auto-tour timer advancing every 6 seconds smoothly
  useEffect(() => {
    if (!autoTourActive) return;
    const interval = setInterval(() => {
      const nextIdx = (currentStageIndex + 1) % CHOCOLATE_PROCESS_STAGES.length;
      focusOnFacility(CHOCOLATE_PROCESS_STAGES[nextIdx].facilityCode);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoTourActive, currentStageIndex, focusOnFacility]);

  useEffect(() => {
    if (aiCopilot.lastResponse) {
      setResponseDismissed(false);
    }
  }, [aiCopilot.lastResponse]);

  // Search filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();

    const fac = facilities.find(
      f =>
        f.name.toLowerCase().includes(q) ||
        f.facilityCode.toLowerCase().includes(q) ||
        (f.chocolateFacilityName && f.chocolateFacilityName.toLowerCase().includes(q)) ||
        (f.processStageName && f.processStageName.toLowerCase().includes(q)) ||
        (f.processDescription && f.processDescription.toLowerCase().includes(q))
    );
    if (fac) {
      focusOnFacility(fac.facilityCode);
      setSearchQuery('');
      return;
    }

    const veh = vehicles.find(
      v => v.vehicleCode.toLowerCase().includes(q) || v.carrierName.toLowerCase().includes(q)
    );
    if (veh) {
      selectEntity({ type: 'vehicle', id: veh.vehicleCode, data: veh });
      setSearchQuery('');
      return;
    }

    const inc = incidents.find(
      i => i.title.toLowerCase().includes(q) || i.incidentCode.toLowerCase().includes(q)
    );
    if (inc) {
      selectEntity({ type: 'incident', id: inc.incidentCode, data: inc });
      setSearchQuery('');
    }
  };

  const handleAICommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiCopilot.isProcessing) return;
    const cmd = aiPrompt;
    setAiPrompt('');
    await executeAICommand(cmd);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-40 flex flex-col justify-between p-4 overflow-hidden">
      {/* 1. TOP SPATIAL COMMAND DECK (Unified Single Header) */}
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-[#090D1E]/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl pointer-events-auto relative z-30">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] text-base select-none">
              🍫
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090D1E] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-500">
                CHOCOTWIN AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/50 font-bold hidden sm:inline-flex items-center gap-1">
                3D SMART TWIN
              </span>
            </div>
            <p className="text-[9px] font-mono text-amber-200/60 hidden xl:block">
              Bean-to-Bar Process Control & Temperature 3D Twin
            </p>
          </div>
        </div>

        {/* Center: 10-Stage Process Stepper (Clean, Compact & Expandable) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-2 rounded-xl bg-black/40 border border-[#232B4E]/80">
          {CHOCOLATE_PROCESS_STAGES.map((stage) => {
            const isSelected = selectedEntity?.type === 'facility' && selectedEntity.id === stage.facilityCode;
            return (
              <button
                key={stage.code}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  focusOnFacility(stage.facilityCode);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
                    : 'text-gray-300 hover:text-amber-200 hover:bg-white/5 border border-transparent hover:border-amber-500/30'
                }`}
                title={`Stage ${stage.stageNumber}: ${stage.name} (${stage.operatingTempCelsius}°C) - Click to inspect ${stage.facilityCode}`}
              >
                <span>{stage.icon}</span>
                <span className="text-[10px] opacity-80">{stage.stageNumber}</span>
                {isSelected ? (
                  <span className="text-[11px] font-sans font-bold flex items-center gap-1 pl-0.5">
                    <span>{stage.name.split(' ')[0]}</span>
                    <span className="text-[9px] font-mono bg-black/30 px-1 py-0.5 rounded text-amber-950 font-bold">
                      {stage.operatingTempCelsius}°C
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-white/10 mx-1 shrink-0" />

          {/* Process Guide Modal Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setGuideModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/40 text-amber-300 hover:text-white hover:bg-amber-500/25 text-xs font-mono font-bold shrink-0 cursor-pointer transition-all"
            title="Open Complete Bean-to-Bar Process Guide & Recipes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Guide</span>
          </button>

          {/* 10 Factory KPIs Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setKpiBarVisible(!kpiBarVisible);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold shrink-0 cursor-pointer transition-all ${
              kpiBarVisible
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Factory-Wide KPI Telemetry Bar (Section 4)"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline text-[11px]">10 KPIs</span>
          </button>

          {/* 3D Label Density Mode Selector (Pills / Cards / Focus) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const nextMode = labelDisplayMode === 'pill' ? 'card' : labelDisplayMode === 'card' ? 'focus' : 'pill';
              setLabelDisplayMode(nextMode);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-amber-400 text-xs font-mono font-bold shrink-0 cursor-pointer transition-all text-gray-300 hover:text-white"
            title={`Toggle 3D label display density (Current: ${labelDisplayMode.toUpperCase()})`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[11px] capitalize">{labelDisplayMode}</span>
          </button>
        </div>

        {/* Right Scene Quick Controls (Search, Camera, Weather, Quality, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Search */}
          <form
            onSubmit={handleSearch}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-[#232B4E] focus-within:border-amber-400 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stage..."
              className="w-24 lg:w-28 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
            />
          </form>

          {/* Camera Preset Dropdown */}
          <select
            value={cameraMode}
            onChange={e => {
              e.stopPropagation();
              setCameraMode(e.target.value as CameraMode);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-[#232B4E] text-xs font-mono text-cyan-300 backdrop-blur-md focus:outline-none cursor-pointer"
          >
            <option value="overview">🔭 Overview</option>
            <option value="freefly">🎮 Free-Fly</option>
            <option value="follow_vehicle">🚛 Follow</option>
            <option value="executive_flyover">🎬 Flyover</option>
            <option value="incident_focus">⚠️ Incident</option>
            <option value="warehouse_inspect">🏢 Factory</option>
          </select>

          {/* Weather Selector */}
          <select
            value={weather}
            onChange={e => {
              e.stopPropagation();
              setWeather(e.target.value as WeatherPreset);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-[#232B4E] text-xs font-mono text-purple-300 backdrop-blur-md focus:outline-none cursor-pointer hidden lg:block"
          >
            <option value="midnight_cyber">🌌 Cyber</option>
            <option value="clear_day">☀️ Day</option>
            <option value="golden_hour">🌅 Golden</option>
            <option value="storm_blizzard">❄️ Blizzard</option>
            <option value="heavy_rain">🌧️ Rain</option>
            <option value="dense_fog">🌫️ Fog</option>
            <option value="extreme_heat">🔥 Heat</option>
          </select>

          {/* Quality Preset Toggle */}
          <div className="hidden 2xl:flex items-center bg-black/40 rounded-xl p-0.5 border border-[#232B4E] text-[10px] font-mono">
            {(['cinematic', 'balanced', 'performance'] as QualityPreset[]).map(q => (
              <button
                key={q}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuality(q);
                }}
                className={`px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold cursor-pointer transition-all ${
                  quality === q
                    ? 'bg-purple-600 text-white shadow-[0_0_8px_#A855F7]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {q.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Reset Scene Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetScene();
            }}
            className="p-1.5 rounded-xl bg-black/40 border border-[#232B4E] hover:border-cyan-400 text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Reset Scene Viewpoint"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreen();
            }}
            className="p-1.5 rounded-xl bg-black/40 border border-[#232B4E] hover:border-cyan-400 text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen Command Center"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1.2 FACTORY-WIDE KPI TELEMETRY BAR (Section 4 Specification) */}
      {kpiBarVisible && (
        <div className="w-full mt-2 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-3.5 py-1.5 rounded-2xl bg-[#090D1E]/92 border border-amber-500/30 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
              <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/10">
                <span className="text-xs">📊</span>
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Factory KPIs
                </span>
              </div>

              {/* 1. Total Production */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[110px]"
                title="Chocolate produced today in kg"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Total Output</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-amber-200">
                    {factoryKPIs?.totalProductionTodayKg?.toLocaleString() ?? '28,450'}
                  </span>
                  <span className="text-[8px] text-gray-400 font-mono">kg</span>
                </div>
              </div>

              {/* 2. Production Efficiency */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[100px]"
                title="Actual output compared with planned output"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Efficiency</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {factoryKPIs?.productionEfficiencyPct ?? 94.2}%
                  </span>
                  <span className="text-[8px] text-emerald-500/80 font-mono">vs Plan</span>
                </div>
              </div>

              {/* 3. Machine Availability */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[105px]"
                title="Percentage of time machines are available"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Availability</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-cyan-300">
                    {factoryKPIs?.machineAvailabilityPct ?? 98.1}%
                  </span>
                  <span className="text-[8px] text-cyan-500/80 font-mono">Uptime</span>
                </div>
              </div>

              {/* 4. Quality Rate */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[95px]"
                title="Percentage of products meeting quality criteria"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Quality Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-emerald-300">
                    {factoryKPIs?.qualityRatePct ?? 99.4}%
                  </span>
                  <span className="text-[8px] text-gray-500 font-mono">Pass</span>
                </div>
              </div>

              {/* 5. Energy Consumption */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[105px]"
                title="Electricity consumed in kWh"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Energy</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-yellow-300">
                    {factoryKPIs?.energyConsumptionKwh?.toLocaleString() ?? '4,820'}
                  </span>
                  <span className="text-[8px] text-gray-400 font-mono">kWh</span>
                </div>
              </div>

              {/* 6. Downtime */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[95px]"
                title="Minutes lost due to machine stoppages"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Downtime</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-rose-300">
                    {factoryKPIs?.downtimeMinutes ?? 14}
                  </span>
                  <span className="text-[8px] text-gray-400 font-mono">min lost</span>
                </div>
              </div>

              {/* 7. Inventory Level */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[125px]"
                title="Available raw materials and finished goods"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Inventory</span>
                <div className="flex items-baseline gap-1 text-[11px] font-mono font-bold">
                  <span className="text-amber-300">{factoryKPIs?.rawMaterialInventoryTonnes ?? 210.5}T Raw</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-emerald-300">{factoryKPIs?.finishedGoodsTonnes ?? 48.2}T Fin</span>
                </div>
              </div>

              {/* 8. Order Fulfillment */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[105px]"
                title="Percentage of orders completed on time"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Fulfillment</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-purple-300">
                    {factoryKPIs?.orderFulfillmentPct ?? 98.8}%
                  </span>
                  <span className="text-[8px] text-purple-400/80 font-mono">On-Time</span>
                </div>
              </div>

              {/* 9. Waste Percentage */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[85px]"
                title="Material lost during production"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Waste</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold font-mono text-teal-300">
                    {factoryKPIs?.wastePercentage ?? 0.8}%
                  </span>
                  <span className="text-[8px] text-gray-500 font-mono">Loss</span>
                </div>
              </div>

              {/* 10. AI Risk Score */}
              <div
                className="px-2.5 py-1 rounded-xl bg-black/50 border border-white/5 shrink-0 flex flex-col justify-center min-w-[95px]"
                title="Estimated production disruption risk"
              >
                <span className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">AI Risk</span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-xs font-bold font-mono ${
                      (factoryKPIs?.aiRiskScore ?? 12) > 50
                        ? 'text-rose-400 animate-pulse'
                        : 'text-emerald-300'
                    }`}
                  >
                    {factoryKPIs?.aiRiskScore ?? 12}/100
                  </span>
                  <span className="text-[8px] text-emerald-500/80 font-mono">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1.2 INTERACTIVE FACTORY PROCESS WALKTHROUGH BANNER ("How It Works") */}
      {walkthroughOpen && (
        <div className="w-full max-w-5xl mx-auto px-4 py-2 rounded-2xl bg-[#090D1E]/95 border border-amber-500/40 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-sans mt-1.5 animate-in fade-in duration-200">
          {/* Active Stage Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 shadow-inner shrink-0">
              {activeStage.icon}
            </span>
            <div className="leading-snug">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  STAGE {activeStage.stageNumber} OF 10
                </span>
                <span className="font-extrabold text-white font-mono text-sm">
                  {activeStage.name}
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  ({activeStage.operatingTempCelsius}°C)
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans mt-0.5 max-w-xl line-clamp-2 md:line-clamp-none">
                {STAGE_EXPLANATIONS[activeStage.stageNumber] || activeStage.description}
              </p>
            </div>
          </div>

          {/* Controls: Prev, Next, Auto-Tour, Inspect */}
          <div className="flex items-center gap-1.5 shrink-0 font-mono">
            <button
              type="button"
              onClick={() => {
                const prevIdx = (currentStageIndex - 1 + CHOCOLATE_PROCESS_STAGES.length) % CHOCOLATE_PROCESS_STAGES.length;
                focusOnFacility(CHOCOLATE_PROCESS_STAGES[prevIdx].facilityCode);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white transition-all cursor-pointer font-bold text-xs"
              title="Previous Process Stage"
            >
              ◀ Prev
            </button>

            <button
              type="button"
              onClick={() => {
                const nextIdx = (currentStageIndex + 1) % CHOCOLATE_PROCESS_STAGES.length;
                focusOnFacility(CHOCOLATE_PROCESS_STAGES[nextIdx].facilityCode);
              }}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold shadow-md shadow-amber-500/30 transition-all cursor-pointer text-xs"
              title="Next Process Stage"
            >
              Next Stage ▶
            </button>

            <button
              type="button"
              onClick={() => setAutoTourActive(!autoTourActive)}
              className={`px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                autoTourActive
                  ? 'bg-purple-600 border-purple-400 text-white animate-pulse shadow-md shadow-purple-600/30'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
              }`}
              title="Auto-advance through all 10 stages in sequence"
            >
              {autoTourActive ? '⏸ Pause Tour' : '▶ Auto Tour'}
            </button>

            {/* Inspect parameters shortcut */}
            <button
              type="button"
              onClick={() => {
                if (activeFacility) {
                  selectEntity({ type: 'facility', id: activeFacility.facilityCode, data: activeFacility });
                }
              }}
              className="px-2 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              title="Inspect All 15 Machine Parameters in Drawer"
            >
              🔍 Inspect
            </button>

            <button
              type="button"
              onClick={() => setWalkthroughOpen(false)}
              className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer ml-1"
              title="Hide Walkthrough Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1.3 STATUS COLOR CONVENTIONS STRIP */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-3.5 py-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md pointer-events-auto text-[10px] font-mono text-gray-400 mt-1">
        <span className="font-bold text-gray-300 uppercase tracking-wider hidden sm:inline">Color Codes:</span>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" /> Green: Normal
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" /> Amber: Warning / Limit
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" /> Red: Fault / Solidifying
          </span>
          <span className="flex items-center gap-1 text-purple-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#A855F7]" /> Purple: AI Prediction
          </span>
          <span className="flex items-center gap-1 text-cyan-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" /> Cyan: Active Pipeline
          </span>
        </div>
        {!walkthroughOpen && (
          <button
            type="button"
            onClick={() => setWalkthroughOpen(true)}
            className="text-amber-400 hover:underline font-bold text-[10px] cursor-pointer"
          >
            Show Walkthrough
          </button>
        )}
      </div>

      {/* 1.5 3D LAYOUT & EXPLODED CONTROLLER BAR */}
      {explodedGraph.active && (
        <div className="w-full max-w-5xl mx-auto mt-2 px-4 py-2.5 rounded-2xl bg-[#090D1E]/95 border border-purple-500/40 backdrop-blur-2xl shadow-[0_0_35px_rgba(168,85,247,0.3)] pointer-events-auto flex flex-col gap-2 transition-all">
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            {/* Title & Mode */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 uppercase tracking-wider text-[11px]">
                  3D Exploded Layout Effects
                </span>
                <span className="text-[10px] text-gray-400 block">
                  7-Tier Spatial Graph & Dynamic Dependency Topology
                </span>
              </div>
            </div>

            {/* 4 Layout Mode Switches */}
            <div className="flex items-center bg-[#070A16] p-1 rounded-xl border border-[#232B4E]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExplodedLayoutMode('stacked');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  explodedGraph.layoutMode === 'stacked'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_#00F5FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Stratified 3D Exploded Layers"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Stratified Stack</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExplodedLayoutMode('radial');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  explodedGraph.layoutMode === 'radial'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_#A855F7]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Cylindrical Concentric Orbital Rings"
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Radial Orbit</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExplodedLayoutMode('dag_tree');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  explodedGraph.layoutMode === 'dag_tree'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_12px_#10B981]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Hierarchical Left-to-Right Supply Chain DAG Stream"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>DAG Flow</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExplodedLayoutMode('force');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  explodedGraph.layoutMode === 'force'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_12px_#F59E0B]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Physics-Driven Force Clustering"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Force Mesh</span>
              </button>
            </div>

            {/* Explosion Distance / Spread Slider */}
            <div className="flex items-center gap-2 bg-[#070A16] px-3 py-1 rounded-xl border border-[#232B4E]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-gray-400">Spread:</span>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={explodedGraph.explosionSpread ?? 1.0}
                onChange={e => {
                  e.stopPropagation();
                  setExplosionSpread(parseFloat(e.target.value));
                }}
                className="w-20 accent-purple-500 cursor-pointer h-1.5"
              />
              <span className="text-[10px] text-purple-300 font-bold w-10 text-right">
                {Math.round((explodedGraph.explosionSpread ?? 1.0) * 100)}%
              </span>
            </div>

            {/* Quick Toggles: Auto-Rotate, Pulse Packets, Trace Blast Radius, Close */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExplodedAutoRotate();
                }}
                className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                  explodedGraph.autoRotate
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_#A855F7]'
                    : 'bg-[#0D1226] border-[#232B4E] text-gray-400 hover:text-white'
                }`}
                title="Toggle Cinematic Turntable Orbit"
              >
                <RotateCw className={`w-3.5 h-3.5 ${explodedGraph.autoRotate ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExplodedLinkFlow();
                }}
                className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                  explodedGraph.linkFlowActive
                    ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_10px_#00F5FF]'
                    : 'bg-[#0D1226] border-[#232B4E] text-gray-400 hover:text-white'
                }`}
                title="Toggle Flow Packets Animation"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const next = explodedGraph.highlightedBlastRadiusNodeId ? null : 'INC-BLIZZ-01';
                  setBlastRadiusNode(next);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                  explodedGraph.highlightedBlastRadiusNodeId
                    ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : 'bg-[#0D1226] border-[#232B4E] text-red-400 hover:bg-red-950/40'
                }`}
                title="Trace Disruption Blast Radius: Highlight cascade chain from blizzard to vaccines"
              >
                <AlertTriangle className="w-3 h-3 animate-pulse" />
                <span>Blast Radius</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExplodedGraph();
                }}
                className="p-1.5 rounded-lg bg-[#0D1226] border border-[#232B4E] text-gray-400 hover:text-white hover:border-red-400 cursor-pointer"
                title="Close 3D Exploded View"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Layer Filter Solo Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono pt-1 border-t border-[#1A2038]">
            <span className="text-gray-500 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              LAYER SOLO:
            </span>
            {[
              { id: 'all', label: 'All 7 Layers', color: '#A855F7' },
              { id: 'suppliers', label: '1. Suppliers', color: '#14B8A6' },
              { id: 'manufacturing', label: '2. Manufacturing', color: '#F97316' },
              { id: 'warehouses', label: '3. Hubs & Ports', color: '#3B82F6' },
              { id: 'transport', label: '4. Transport Fleet', color: '#8B5CF6' },
              { id: 'cargo', label: '5. Consignments', color: '#00F5FF' },
              { id: 'documents', label: '6. Customs & Docs', color: '#10B981' },
              { id: 'disruptions', label: '7. Hazards & Risk', color: '#EF4444' },
            ].map(item => {
              const isCurrent = (explodedGraph.activeLayer || 'all') === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExplodedActiveLayer(item.id as any);
                  }}
                  className={`px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-purple-950 border text-white font-bold shadow-sm'
                      : 'bg-black/30 border border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                  style={{
                    borderColor: isCurrent ? item.color : undefined,
                    color: isCurrent ? '#FFFFFF' : undefined,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MIDDLE VIEWPORT AREA: LEFT TOOLBAR + RIGHT INSPECTOR */}
      <div className="flex-1 flex justify-between items-start my-3 pointer-events-none">
        {/* LEFT SPATIAL TOOL RAIL */}
        <div className="flex flex-col gap-2 p-2 rounded-2xl bg-[#090D1E]/90 border border-[#232B4E] backdrop-blur-xl shadow-2xl pointer-events-auto relative z-30">
          {/* Overview */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCameraMode('overview');
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              cameraMode === 'overview'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00F5FF]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title="Command Network Overview"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Facilities (Click to cycle through hubs) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const currentIdx = facilities.findIndex(f => f.facilityCode === selectedEntity?.id);
              const nextFac = facilities[(currentIdx + 1) % facilities.length] || facilities[0];
              selectEntity({ type: 'facility', id: nextFac.facilityCode, data: nextFac });
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              selectedEntity?.type === 'facility'
                ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,245,255,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title="Inspect Warehouses & Hubs (Click to Cycle)"
          >
            <Building2 className="w-5 h-5" />
          </button>

          {/* Warehouse Cutaway Mode */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWarehouseCutaway(selectedEntity?.type === 'facility' ? selectedEntity.id : undefined);
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              warehouseCutaway.active
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_#00F5FF]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title={warehouseCutaway.active ? "Exit Warehouse Cutaway View" : "Exploded High-Bay Warehouse Cutaway View"}
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Fleet Follow (Click to cycle through vehicles) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const currentIdx = vehicles.findIndex(v => v.vehicleCode === (followedVehicleId || selectedEntity?.id));
              const nextVeh = vehicles[(currentIdx + 1) % vehicles.length] || vehicles[0];
              followVehicle(nextVeh.vehicleCode);
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              cameraMode === 'follow_vehicle'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_#A855F7]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title="Follow Fleet Vehicle Camera (Click to Cycle)"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Exploded 7-Layer Supply Chain View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExplodedGraph();
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              explodedGraph.active
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-[0_0_15px_#A855F7]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title="3D Supply Chain Exploded View (7 Logical Layers)"
          >
            <Activity className="w-5 h-5" />
          </button>

          {/* Disruption Sandbox Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerDisruption({
                title: 'Jacketed Line Section 4 Thermal Freeze',
                affectedCorridor: 'ROUTE-I80-MW',
                severity: 'critical',
              });
            }}
            className="p-2.5 rounded-xl text-amber-400 hover:bg-amber-950/60 transition-all flex items-center justify-center cursor-pointer"
            title="Simulate Pipe Freeze (Jacket Heating Failure & Solidification)"
          >
            <AlertTriangle className="w-5 h-5 animate-pulse text-amber-400" />
          </button>

          {/* Scenario Comparison Ghost Overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScenarioComparison({ active: !scenarioComparison.active });
            }}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              scenarioComparison.active
                ? 'bg-purple-600 text-white shadow-[0_0_15px_#A855F7]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
            title="Multi-Future Scenario Comparison"
          >
            <GitCompare className="w-5 h-5" />
          </button>

          {/* Layers Toggle Modal */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLayersOpen(!layersOpen);
              }}
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all flex items-center justify-center cursor-pointer"
              title="Toggle View Layers"
            >
              <Layers className="w-5 h-5" />
            </button>

            {layersOpen && (
              <div className="absolute left-14 top-0 w-56 p-3 rounded-2xl bg-[#090D1E]/95 border border-[#232B4E] backdrop-blur-2xl shadow-2xl space-y-2 text-xs font-mono text-gray-300 z-50">
                <span className="font-bold text-cyan-300 text-[11px] block border-b border-gray-800 pb-1">
                  LAYER VISIBILITY
                </span>
                {(
                  [
                    ['facilities', 'Warehouses & Plants'],
                    ['routes', 'Jacketed Pipe Corridors'],
                    ['vehicles', 'Tankers & AGV Shuttles'],
                    ['cargo', 'Chocolate Pallets & Bar Trays'],
                    ['particles', 'Molten Flow Particles'],
                    ['incidents', 'Thermal Freeze Faults'],
                    ['labels', 'Stage & Process Labels'],
                    ['capacity_towers', '3D Tank Load Towers'],
                    ['risk_heatmap', 'Ground Risk Heatmap'],
                    ['ai_nodes', 'AI Agent Neural Mesh'],
                  ] as [ViewLayer, string][]
                ).map(([lKey, label]) => (
                  <label
                    key={lKey}
                    className="flex items-center justify-between cursor-pointer hover:text-white"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={layers[lKey]}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleLayer(lKey);
                      }}
                      className="accent-cyan-400 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTEXTUAL INSPECTOR DRAWER */}
        <div className="pointer-events-auto relative z-30">
          <SelectedEntityDrawer />
        </div>
      </div>

      {/* 3. BOTTOM SECTION: AI COPILOT BAR + TIMELINE + MINIMAP */}
      <div className="flex flex-col gap-2 pointer-events-auto relative z-30">
        {/* AI Command Copilot Dispatch Bar */}
        <div className="w-full max-w-4xl mx-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#090D1E]/90 border border-amber-500/40 backdrop-blur-xl shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold shrink-0">
            <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI COPILOT:</span>
          </div>

          <form onSubmit={handleAICommandSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Ask Copilot: 'Check conching vat viscosity', 'Tempering crystal curve', 'Warehouse interior cutaway', 'Bypass frozen jacketed line'..."
              className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={aiCopilot.isProcessing}
              className="p-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick AI Prompt Pills */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeAICommand('Check conching vat viscosity and temperature');
              }}
              className="px-2 py-0.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-300 hover:bg-amber-900/70 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              🍫 Conche Viscosity
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeAICommand('Check tempering beta crystals');
              }}
              className="px-2 py-0.5 rounded-lg bg-orange-950/70 border border-orange-500/50 text-orange-300 hover:bg-orange-900/70 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              🌡️ Tempering Check
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeAICommand('Warehouse cutaway view');
              }}
              className="px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              🏢 Factory Cutaway
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeAICommand('Recovery reroute around blizzard');
              }}
              className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              🔄 Jacketed Bypass
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeAICommand('Trace pipeline freeze hazard');
              }}
              className="px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              ⚠️ Freeze Fault
            </button>
          </div>
        </div>

        {/* AI Copilot Last Response Banner (if available and not dismissed) */}
        {aiCopilot.lastResponse && !responseDismissed && (
          <div className="w-full max-w-4xl mx-auto px-4 py-2 rounded-xl bg-[#090D1E]/95 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center justify-between shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
              <span className="truncate">{aiCopilot.lastResponse}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  executeAICommand('Reset view to network overview');
                }}
                className="text-[11px] text-amber-300 hover:text-white hover:underline cursor-pointer"
              >
                Recenter Overview
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setResponseDismissed(true);
                }}
                className="p-1 rounded-md text-amber-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                title="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bar: Timeline + Radar Minimap */}
        <div className="relative flex items-end justify-between gap-4">
          <div className="flex-1">
            <WorldTimeline />
          </div>

          <div className="shrink-0">
            <WorldMinimap />
          </div>
        </div>
      </div>

      {/* 4. CHOCOLATE PROCESS FLOW GUIDE MODAL */}
      {guideModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl pointer-events-auto"
          onClick={() => setGuideModalOpen(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] bg-[#0A0E23] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden text-white font-sans"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#232B4E] bg-[#070A1A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 flex items-center justify-center shadow-lg text-xl">
                  🍫
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Artisan Bean-to-Bar Chocolate Manufacturing</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-mono">
                      10 Process Stages
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Complete industrial recipe specification, temperature tolerances, and stage telemetry
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="p-2 rounded-xl bg-gray-900/80 border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stages Grid Container */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHOCOLATE_PROCESS_STAGES.map(stage => {
                const fac = facilities.find(f => f.facilityCode === stage.facilityCode);
                return (
                  <div
                    key={stage.code}
                    className="p-4 rounded-2xl bg-[#0D122B]/90 border border-[#232B4E] hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3 shadow-md group hover:bg-[#111738]"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1.5 rounded-xl bg-[#080B1E] border border-amber-500/30">
                            {stage.icon}
                          </span>
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase tracking-wider">
                              STAGE {stage.stageNumber} • {stage.code}
                            </span>
                            <h3 className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                              {stage.name}
                            </h3>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                          {stage.operatingTempCelsius}°C
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-300 leading-relaxed mb-3">
                        {stage.description}
                      </p>

                      {/* Metadata Chips */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#1C2344]">
                        <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E]">
                          <span className="text-gray-400 block text-[9px]">FACILITY & CODE</span>
                          <span className="text-white font-bold">{stage.facilityCode}</span>
                        </div>
                        <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E]">
                          <span className="text-gray-400 block text-[9px]">OUTPUT PRODUCT</span>
                          <span className="text-amber-300 font-bold truncate block">{stage.outputProduct}</span>
                        </div>
                        {stage.chocolateVolumeTons !== undefined && (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E]">
                            <span className="text-gray-400 block text-[9px]">CHOCOLATE VOLUME</span>
                            <span className="text-amber-200 font-bold">{stage.chocolateVolumeTons} MT</span>
                          </div>
                        )}
                        {stage.targetViscosityCp ? (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E]">
                            <span className="text-gray-400 block text-[9px]">TARGET VISCOSITY</span>
                            <span className="text-cyan-300 font-bold">{stage.targetViscosityCp} cP</span>
                          </div>
                        ) : fac ? (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E]">
                            <span className="text-gray-400 block text-[9px]">TANK LOAD / UTILIZATION</span>
                            <span className="text-emerald-400 font-bold">{fac.utilizationPercentage}%</span>
                          </div>
                        ) : null}

                        {stage.recipeRatio && (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E] col-span-2">
                            <span className="text-gray-400 block text-[9px]">INDUSTRIAL RECIPE FORMULA</span>
                            <span className="text-amber-100/90 text-[10px]">{stage.recipeRatio}</span>
                          </div>
                        )}

                        {stage.rawMaterialSummary && (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E] col-span-2">
                            <span className="text-gray-400 block text-[9px]">RAW MATERIAL BUFFER & STOCK</span>
                            <span className="text-emerald-300/90 text-[10px]">{stage.rawMaterialSummary}</span>
                          </div>
                        )}

                        {stage.shockTolerance && (
                          <div className="bg-[#070A1E] px-2.5 py-1.5 rounded-xl border border-[#1F274E] col-span-2">
                            <span className="text-gray-400 block text-[9px]">SHOCK & STABILITY TOLERANCE</span>
                            <span className="text-purple-300/90 text-[10px]">⚡ {stage.shockTolerance}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      type="button"
                      onClick={() => {
                        focusOnFacility(stage.facilityCode);
                        setGuideModalOpen(false);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600/80 to-amber-700/80 hover:from-amber-500 hover:to-amber-600 border border-amber-400/50 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    >
                      <span>Fly to 3D Stage Plant</span>
                      <span className="text-amber-200">→</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#232B4E] bg-[#070A1A] flex items-center justify-between text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All 10 processing stages synchronized with active 3D twin physical mesh.</span>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
