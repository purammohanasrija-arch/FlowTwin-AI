import React, { useState, useEffect } from 'react';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { QualityPreset, WeatherPreset, CameraMode, ViewLayer } from './types.js';
import { CHOCOLATE_PROCESS_STAGES } from './initialData.js';
import {
  Compass,
  Layers,
  Search,
  Camera,
  Maximize2,
  Building2,
  Truck,
  Activity,
  AlertTriangle,
  Bot,
  Send,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  BookOpen,
  X,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SelectedEntityDrawer } from './SelectedEntityDrawer.js';

const STAGE_EXPLANATIONS: Record<number, string> = {
  1: 'Raw cocoa beans arrive from international ports, undergo optical sorting and moisture regulation, and are stored in bulk stainless silos.',
  2: 'Thermal drum roasters develop rich chocolate aromas and precursor flavors under strict heat profiles (135°C–140°C).',
  3: 'High-velocity winnowers crush the roasted beans and blow away brittle husks, leaving pure aromatic cocoa nibs.',
  4: 'Hydraulic presses exert massive mechanical pressure to separate pure golden cocoa butter from dense cocoa cake.',
  5: 'Milk powder, sugar, vanilla, and cocoa liquor are dosed with recipe stoichiometry in continuous paddle blenders.',
  6: 'Molten chocolate is kneaded and sheared at 48°C for 24 hours to evaporate unwanted volatiles and refine particle size under 20 microns.',
  7: 'Chocolate is precisely cooled to 28°C and gently reheated to 31°C to seed stable Form V crystals for crisp snap and glossy sheen.',
  8: 'Continuous heated jacketed rail tankers transfer bulk liquid chocolate (couverture) at 45°C without solidification risk.',
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
  const layers = useDigitalTwinStore(s => s.layers);
  const toggleLayer = useDigitalTwinStore(s => s.toggleLayer);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const resetScene = useDigitalTwinStore(s => s.resetScene);
  const toggleWarehouseCutaway = useDigitalTwinStore(s => s.toggleWarehouseCutaway);
  const warehouseCutaway = useDigitalTwinStore(s => s.warehouseCutaway);
  const executeAICommand = useDigitalTwinStore(s => s.executeAICommand);
  const aiCopilot = useDigitalTwinStore(s => s.aiCopilot);
  const followedVehicleId = useDigitalTwinStore(s => s.followedVehicleId);
  const followVehicle = useDigitalTwinStore(s => s.followVehicle);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const focusOnFacility = useDigitalTwinStore(s => s.focusOnFacility);
  const factoryKPIs = useDigitalTwinStore(s => s.factoryKPIs);
  const labelDisplayMode = useDigitalTwinStore(s => s.labelDisplayMode);
  const setLabelDisplayMode = useDigitalTwinStore(s => s.setLabelDisplayMode);

  // Modals & Popovers
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [autoTourActive, setAutoTourActive] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

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
    <div className="absolute inset-0 pointer-events-none select-none z-40 flex flex-col justify-between p-3.5 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP COMMAND BAR (One Single Sleek Glass Bar - Zero Clutter)            */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-[#090D1E]/92 border border-amber-500/30 backdrop-blur-xl shadow-2xl pointer-events-auto relative z-30">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] text-base select-none">
              🍫
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090D1E] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-500">
                CHOCOTWIN AI
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/50 font-bold hidden sm:inline">
                SMART FACTORY TWIN
              </span>
            </div>
          </div>
        </div>

        {/* Center: 10-Stage Process Stepper (Clean, Compact, Clickable) */}
        <nav aria-label="Process stages" className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-2 rounded-xl bg-black/40 border border-[#232B4E]/80">
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
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
                    : 'text-gray-300 hover:text-amber-200 hover:bg-white/5 border border-transparent hover:border-amber-500/30'
                }`}
                title={`Stage ${stage.stageNumber}: ${stage.name} (${stage.operatingTempCelsius}°C) - Click to focus 3D camera`}
              >
                <span>{stage.icon}</span>
                <span className="text-[10px] opacity-80">{stage.stageNumber}</span>
                <span className={`text-[11px] font-sans ${isSelected ? 'font-extrabold' : 'hidden lg:inline'}`}>
                  {stage.name.split(' ')[0]}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-mono bg-black/30 px-1 py-0.2 rounded text-amber-950 font-bold">
                    {stage.operatingTempCelsius}°C
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Essential Tools (10 KPIs, Guide, Settings Dropdown, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* 10 Factory KPIs Modal Trigger */}
          <button
            type="button"
            onClick={() => setKpiModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 hover:bg-amber-500/25 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="Open Factory-Wide KPI Telemetry Panel (Section 4 Specification)"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">10 KPIs</span>
            <span className="hidden xl:inline text-[10px] text-emerald-400 font-semibold ml-0.5">
              (94% Eff)
            </span>
          </button>

          {/* Process Recipe Guide */}
          <button
            type="button"
            onClick={() => setGuideModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono font-bold transition-all cursor-pointer"
            title="Open Bean-to-Bar Process Guide & Recipes"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px]">Guide</span>
          </button>

          {/* Settings / View Preferences Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono font-bold transition-all cursor-pointer"
              title="Camera, Lighting & Label View Controls"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline text-[11px]">View</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {settingsMenuOpen && (
              <div className="absolute right-0 top-10 w-64 p-3 rounded-2xl bg-[#090D1E]/98 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-2.5 text-xs font-mono text-gray-300 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="font-bold text-amber-300 text-[11px]">3D VIEW SETTINGS</span>
                  <button onClick={() => setSettingsMenuOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Camera Mode */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Camera Viewpoint:</label>
                  <select
                    value={cameraMode}
                    onChange={e => setCameraMode(e.target.value as CameraMode)}
                    className="w-full px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none"
                  >
                    <option value="overview">🔭 Factory Overview</option>
                    <option value="freefly">🎮 Free-Fly Controls</option>
                    <option value="follow_vehicle">🚛 Follow Heated Tanker</option>
                    <option value="executive_flyover">🎬 Cinematic Flyover</option>
                    <option value="warehouse_inspect">🏢 Interior Zone Focus</option>
                  </select>
                </div>

                {/* 3D Label Density */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">3D Machine Labels:</label>
                  <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                    {(['pill', 'card', 'focus'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setLabelDisplayMode(mode)}
                        className={`py-1 rounded text-[10px] font-bold capitalize transition-all ${
                          labelDisplayMode === mode
                            ? 'bg-amber-500 text-black shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-500 block mt-0.5">
                    {labelDisplayMode === 'pill' ? 'Minimal numbered pills (cleanest)' : labelDisplayMode === 'card' ? 'Show all live cards' : 'Show only active machine'}
                  </span>
                </div>

                {/* Weather Lighting */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Atmosphere / Lighting:</label>
                  <select
                    value={weather}
                    onChange={e => setWeather(e.target.value as WeatherPreset)}
                    className="w-full px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-purple-300 focus:outline-none"
                  >
                    <option value="midnight_cyber">🌌 Midnight Cyber (Default)</option>
                    <option value="clear_day">☀️ Crisp Daytime</option>
                    <option value="golden_hour">🌅 Golden Sunset</option>
                    <option value="storm_blizzard">❄️ Blizzard Hazard</option>
                  </select>
                </div>

                {/* Quality Mode */}
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Graphics Rendering:</label>
                  <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                    {(['cinematic', 'balanced', 'performance'] as QualityPreset[]).map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuality(q)}
                        className={`py-1 rounded text-[10px] font-bold uppercase transition-all ${
                          quality === q
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {q.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Scene Viewpoint */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetScene();
            }}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Reset Scene Viewpoint to Overview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Command Center */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreen();
            }}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MIDDLE VIEWPORT AREA: COMPACT LEFT TOOLBAR + RIGHT INSPECTION DRAWER   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex justify-between items-start my-2 pointer-events-none">
        {/* Left Mini Quick-Action Bar */}
        <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#090D1E]/90 border border-white/10 backdrop-blur-xl shadow-2xl pointer-events-auto relative z-30">
          <button
            type="button"
            onClick={() => setCameraMode('overview')}
            className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              cameraMode === 'overview'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Overview Viewpoint"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => toggleWarehouseCutaway(selectedEntity?.type === 'facility' ? selectedEntity.id : undefined)}
            className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              warehouseCutaway.active
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={warehouseCutaway.active ? 'Exit Cutaway View' : 'Interior High-Bay Cutaway View'}
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const currentIdx = vehicles.findIndex(v => v.vehicleCode === (followedVehicleId || selectedEntity?.id));
              const nextVeh = vehicles[(currentIdx + 1) % vehicles.length] || vehicles[0];
              followVehicle(nextVeh.vehicleCode);
            }}
            className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              cameraMode === 'follow_vehicle'
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Follow Heated Tanker Fleet"
          >
            <Truck className="w-4 h-4" />
          </button>
        </div>

        {/* Right Contextual Inspector Drawer (Slides in on machine click) */}
        <div className="pointer-events-auto relative z-30">
          <SelectedEntityDrawer />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM PROCESS STORY DOCK (Unified, Clean, Self-Explanatory)           */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-4xl mx-auto flex flex-col gap-2 pointer-events-auto relative z-30">
        {/* Optional AI Assistant Drawer (Slides up only when clicked) */}
        {aiDrawerOpen && (
          <div className="w-full px-4 py-3 rounded-2xl bg-[#090D1E]/98 border border-purple-500/40 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>CHOCOTWIN AI COPILOT ASSISTANT</span>
              </div>
              <button
                type="button"
                onClick={() => setAiDrawerOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAICommandSubmit} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask anything: 'Inspect conching viscosity', 'Tempering crystal curve', 'Simulate heating failure'..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
              />
              <button
                type="submit"
                disabled={aiCopilot.isProcessing}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 inline mr-1" />
                <span>Ask</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => executeAICommand('Check conching vat viscosity and temperature')}
                className="px-2 py-0.5 rounded-lg bg-black/40 border border-amber-500/40 text-amber-300 hover:bg-amber-950/40"
              >
                🍫 Conche Viscosity
              </button>
              <button
                type="button"
                onClick={() => executeAICommand('Check tempering beta crystals')}
                className="px-2 py-0.5 rounded-lg bg-black/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
              >
                🌡️ Tempering Status
              </button>
              <button
                type="button"
                onClick={() => executeAICommand('Warehouse cutaway view')}
                className="px-2 py-0.5 rounded-lg bg-black/40 border border-purple-500/40 text-purple-300 hover:bg-purple-950/40"
              >
                🏢 Factory Cutaway
              </button>
            </div>

            {aiCopilot.lastResponse && (
              <div className="mt-2 p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-amber-200">
                {aiCopilot.lastResponse}
              </div>
            )}
          </div>
        )}

        {/* The Unified Process Story Dock */}
        <div className="w-full px-4 py-2.5 rounded-2xl bg-[#090D1E]/95 border border-amber-500/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col gap-2">
          {/* Main Info Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left: Stage Icon, Stage Number, Name & Short Narrative */}
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-2xl p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 shadow-inner shrink-0">
                {activeStage.icon}
              </span>
              <div className="leading-snug">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    STAGE {activeStage.stageNumber} OF 10
                  </span>
                  <span className="font-extrabold text-white font-mono text-sm">
                    {activeStage.name}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/50 border border-amber-400 text-amber-300">
                    {activeStage.operatingTempCelsius}°C
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans mt-0.5 max-w-xl line-clamp-1 md:line-clamp-2">
                  {STAGE_EXPLANATIONS[activeStage.stageNumber] || activeStage.description}
                </p>
              </div>
            </div>

            {/* Right: Step Controls (Prev, Next, Auto-Tour, Inspect, AI) */}
            <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
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
                Next ▶
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
                {autoTourActive ? '⏸ Pause' : '▶ Auto-Tour'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeFacility) {
                    selectEntity({ type: 'facility', id: activeFacility.facilityCode, data: activeFacility });
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900/60 text-xs font-bold transition-all cursor-pointer"
                title="Inspect all 15 machine parameters in drawer"
              >
                🔍 Inspect 15 KPIs
              </button>

              <button
                type="button"
                onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
                className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  aiDrawerOpen
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-purple-300 hover:text-white'
                }`}
                title="Toggle AI Copilot"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-bar: Status Code Legend & Telemetry Indicators */}
          <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-mono text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-bold uppercase">Color Key:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" /> Green: Normal
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" /> Amber: Limit
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" /> Red: Fault
              </span>
              <span className="flex items-center gap-1 text-cyan-300 font-semibold hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" /> Cyan: Active Pipeline
              </span>
            </div>

            <div className="flex items-center gap-2 text-amber-300">
              <span>Today's Output: <strong>{factoryKPIs?.totalProductionTodayKg?.toLocaleString() ?? '28,450'} kg</strong></span>
              <span>•</span>
              <span className="text-emerald-400">Quality: <strong>{factoryKPIs?.qualityRatePct ?? 99.4}%</strong></span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. MODAL: FACTORY-WIDE 10 KPI TELEMETRY REPORT (Section 4 Specification)  */}
      {/* ========================================================================= */}
      {kpiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl pointer-events-auto animate-in fade-in duration-200"
          onClick={() => setKpiModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl bg-[#0A0E23] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden text-white font-sans"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#232B4E] bg-[#070A1A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-lg text-xl">
                  📊
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Factory-Wide KPI Telemetry Overview</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-mono">
                      Section 4 Specification
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Real-time consolidated health, throughput, efficiency, and inventory for ChocoTwin AI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKpiModalOpen(false)}
                className="p-2 rounded-xl bg-gray-900/80 border border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 10 KPI Cards Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[70vh] overflow-y-auto">
              {/* 1. Total Production */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-amber-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">1. Total Production</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-amber-200">
                    {factoryKPIs?.totalProductionTodayKg?.toLocaleString() ?? '28,450'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">kg</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Chocolate produced today across all 10 stages</p>
              </div>

              {/* 2. Production Efficiency */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-emerald-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">2. Production Efficiency</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {factoryKPIs?.productionEfficiencyPct ?? 94.2}%
                  </span>
                  <span className="text-xs text-emerald-500 font-mono">vs Plan</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Actual output compared with planned daily quota</p>
              </div>

              {/* 3. Machine Availability */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-cyan-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">3. Machine Availability</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-cyan-300">
                    {factoryKPIs?.machineAvailabilityPct ?? 98.1}%
                  </span>
                  <span className="text-xs text-cyan-500 font-mono">Uptime</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Percentage of time processing machines are active</p>
              </div>

              {/* 4. Quality Rate */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-emerald-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">4. Quality Rate</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-emerald-300">
                    {factoryKPIs?.qualityRatePct ?? 99.4}%
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Pass</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Finished products meeting crystal, gloss & snap criteria</p>
              </div>

              {/* 5. Energy Consumption */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-yellow-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">5. Energy Consumption</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-yellow-300">
                    {factoryKPIs?.energyConsumptionKwh?.toLocaleString() ?? '4,820'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">kWh</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Electricity consumed across heating, conching & refrigeration</p>
              </div>

              {/* 6. Downtime */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-rose-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">6. Downtime</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-rose-300">
                    {factoryKPIs?.downtimeMinutes ?? 14}
                  </span>
                  <span className="text-xs text-rose-400 font-mono">min lost</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Minutes lost to mold jams or scheduled maintenance</p>
              </div>

              {/* 7. Inventory Level */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-amber-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">7. Inventory Level</span>
                <div className="flex items-baseline gap-2 my-1 text-sm font-mono font-bold">
                  <span className="text-amber-300">{factoryKPIs?.rawMaterialInventoryTonnes ?? 210.5}T Raw</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-emerald-300">{factoryKPIs?.finishedGoodsTonnes ?? 48.2}T Finished</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Stock in silos, storage vaults, and packaging dispatch</p>
              </div>

              {/* 8. Order Fulfillment */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-purple-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">8. Order Fulfillment</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-purple-300">
                    {factoryKPIs?.orderFulfillmentPct ?? 98.8}%
                  </span>
                  <span className="text-xs text-purple-400 font-mono">On-Time</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Percentage of commercial wholesale orders completed on schedule</p>
              </div>

              {/* 9. Waste Percentage */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-teal-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">9. Waste Percentage</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-teal-300">
                    {factoryKPIs?.wastePercentage ?? 0.8}%
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Loss</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">Cocoa residue, trim loss, and packaging scrap</p>
              </div>

              {/* 10. AI Disruption Risk */}
              <div className="p-3.5 rounded-2xl bg-[#0D122B] border border-emerald-500/30">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">10. AI Disruption Risk</span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-extrabold font-mono text-emerald-300">
                    {factoryKPIs?.aiRiskScore ?? 12}/100
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">Low Risk</span>
                </div>
                <p className="text-[11px] text-gray-300 font-sans">AI-estimated pipe freeze & machine breakdown probability</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#232B4E] bg-[#070A1A] flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live continuous telemetry stream active.
              </span>
              <button
                type="button"
                onClick={() => setKpiModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: BEAN-TO-BAR PROCESS GUIDE & INDUSTRIAL RECIPES                  */}
      {/* ========================================================================= */}
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
                      <span>Fly 3D Camera to Stage</span>
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
