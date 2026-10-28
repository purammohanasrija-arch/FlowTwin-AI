import React from 'react';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import {
  X,
  Building2,
  Truck,
  Route,
  Package,
  AlertTriangle,
  Bot,
  Activity,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2,
  Navigation,
} from 'lucide-react';

const ZONE_MONITORED_PARAMETERS: Record<
  number,
  { zoneName: string; parameters: { label: string; value: string }[] }
> = {
  1: {
    zoneName: 'Raw Material Storage',
    parameters: [
      { label: 'Stock Quantity', value: '280,000 kg (Criollo & Trinitario)' },
      { label: 'Storage Temperature', value: '20.0°C (Controlled)' },
      { label: 'Humidity', value: '58% RH (Safe < 65%)' },
    ],
  },
  2: {
    zoneName: 'Cocoa Roasting',
    parameters: [
      { label: 'Temperature', value: '135.0°C (Hot-Air Convective)' },
      { label: 'Roasting Time', value: '45 min (Maillard Optimum)' },
      { label: 'Machine Speed', value: '32 RPM (Rotary Drum)' },
    ],
  },
  3: {
    zoneName: 'Grinding & Milling',
    parameters: [
      { label: 'Motor Speed', value: '1,450 RPM (Impact Mill)' },
      { label: 'Power Consumption', value: '42 kW (High Torque)' },
      { label: 'Processing Time', value: '35 min (Continuous Flow)' },
    ],
  },
  4: {
    zoneName: 'Cocoa Butter Press',
    parameters: [
      { label: 'Temperature', value: '85.0°C (Press Chamber)' },
      { label: 'Hydraulic Pressure', value: '500 bar (Hydraulic)' },
      { label: 'Cycle Time', value: '28 min (Yield: 55% Butter)' },
    ],
  },
  5: {
    zoneName: 'Dairy & Sugar Blending',
    parameters: [
      { label: 'Room Temperature', value: '22.0°C (Dehumidified)' },
      { label: 'Pneumatic Speed', value: '18 m/s (Dry Fluidization)' },
      { label: 'Recipe Ratio Adherence', value: '99.8% (Target Ratio)' },
    ],
  },
  6: {
    zoneName: 'Mixing and Conching',
    parameters: [
      { label: 'Temperature', value: '48.0°C (72.4°C Peak Conche)' },
      { label: 'Mixing Speed', value: '72 RPM (Twin Agitator)' },
      { label: 'Duration', value: '48 hours (Thermal Aeration)' },
      { label: 'Viscosity', value: '3,450 cP (Velvet Shear)' },
    ],
  },
  7: {
    zoneName: 'Tempering',
    parameters: [
      { label: 'Chocolate Temperature', value: '31.5°C (Working Zone)' },
      { label: 'Cooling Rate', value: '2.1°C/min (Seeding Curve)' },
      { label: 'Tempering Status', value: 'Beta Form-V Optimal (99.2%)' },
    ],
  },
  8: {
    zoneName: 'Cooling Tunnel',
    parameters: [
      { label: 'Temperature', value: '12.0°C (Chilled Air Flow)' },
      { label: 'Humidity', value: '42% RH (Anti-Condensation)' },
      { label: 'Cooling Duration', value: '16 min (Gradual Retraction)' },
    ],
  },
  9: {
    zoneName: 'Molding & Enrobing',
    parameters: [
      { label: 'Mold Temperature', value: '28.0°C (Pre-Heated)' },
      { label: 'Fill Level', value: '92% (Volumetric Precision)' },
      { label: 'Production Rate', value: '3,200 bars/hour' },
    ],
  },
  10: {
    zoneName: 'Packaging & Dispatch',
    parameters: [
      { label: 'Wrapping Speed', value: '120 packages/min (Hermetic)' },
      { label: 'Defect Count', value: '22 units (1.2% Reject Rate)' },
      { label: 'Vault Dispatch Temp', value: '18.0°C (Cold Chain Verified)' },
    ],
  },
};

export const SelectedEntityDrawer: React.FC = () => {
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const followVehicle = useDigitalTwinStore(s => s.followVehicle);
  const followedVehicleId = useDigitalTwinStore(s => s.followedVehicleId);
  const cameraMode = useDigitalTwinStore(s => s.cameraMode);
  const toggleWarehouseCutaway = useDigitalTwinStore(s => s.toggleWarehouseCutaway);
  const warehouseCutaway = useDigitalTwinStore(s => s.warehouseCutaway);
  const toggleExplodedGraph = useDigitalTwinStore(s => s.toggleExplodedGraph);
  const applyRecoveryPlan = useDigitalTwinStore(s => s.applyRecoveryPlan);
  const triggerDisruption = useDigitalTwinStore(s => s.triggerDisruption);

  if (!selectedEntity) return null;

  const { type, id, data } = selectedEntity;

  return (
    <div className="w-80 md:w-96 rounded-2xl bg-[#090D1E]/95 border border-[#232B4E] shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white p-4 select-none animate-in fade-in slide-in-from-right duration-200 pointer-events-auto relative z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#232B4E] pb-3 mb-3">
        <div className="flex items-center gap-2">
          {type === 'facility' && <Building2 className="w-5 h-5 text-cyan-400" />}
          {type === 'vehicle' && <Truck className="w-5 h-5 text-purple-400" />}
          {type === 'route' && <Route className="w-5 h-5 text-emerald-400" />}
          {type === 'cargo' && <Package className="w-5 h-5 text-amber-400" />}
          {type === 'incident' && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
          {type === 'ai_agent' && <Bot className="w-5 h-5 text-indigo-400" />}
          {type === 'supplier' && <Activity className="w-5 h-5 text-teal-400" />}
          {type === 'manufacturing' && <Building2 className="w-5 h-5 text-orange-400" />}
          {type === 'document' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
              {type} Telemetry
            </span>
            <h2 className="text-sm font-bold font-mono text-cyan-200 truncate max-w-[200px]">
              {id}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            selectEntity(null);
          }}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer relative z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content depending on entity type */}
      <div className="space-y-3 text-xs font-mono">
        {/* FACILITY DETAILS */}
        {type === 'facility' && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {data.processStageNumber && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    STAGE {data.processStageNumber}
                  </span>
                )}
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                  {data.processStageName || 'Chocolate Process Unit'}
                </span>
              </div>
              <p className="font-sans font-bold text-base text-amber-100">
                {data.chocolateFacilityName || data.name}
              </p>
              {data.processDescription && (
                <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed bg-[#12172E]/70 p-2.5 rounded-xl border border-[#1E2648]">
                  {data.processDescription}
                </p>
              )}
            </div>

            {/* 1. MACHINE & OPERATING PARAMETERS */}
            <div className="p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-cyan-300 font-mono uppercase tracking-wider">
                    ⚙️ Machine Telemetry
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold font-mono">
                    {data.machineParams?.machineCode || data.facilityCode}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    data.machineParams?.operatingStatus === 'normal' || data.status === 'optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : data.machineParams?.operatingStatus === 'warning' || data.status === 'congested'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  ● {data.machineParams?.operatingStatus || (data.status === 'optimal' ? 'NORMAL' : 'CONGESTED')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-white/5">
                  <span className="text-gray-400 text-[9px] block">MACHINE SPEED</span>
                  <span className="text-sm font-bold text-white">
                    {data.machineParams?.machineSpeedRpm ?? (data.processStageNumber === 2 ? 32 : data.processStageNumber === 6 ? 72 : 120)}{' '}
                    <span className="text-[10px] font-normal text-gray-400">RPM</span>
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-white/5">
                  <span className="text-gray-400 text-[9px] block">CAPACITY UTILIZATION</span>
                  <span className="text-sm font-bold text-amber-300">
                    {data.machineParams?.capacityUtilizationPct ?? data.utilizationPercentage}%
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-white/5">
                  <span className="text-gray-400 text-[9px] block">DOWNTIME (LOST)</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {data.machineParams?.downtimeMinutes ?? 0}{' '}
                    <span className="text-[10px] font-normal text-gray-400">min</span>
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-white/5">
                  <span className="text-gray-400 text-[9px] block">MAINTENANCE STATUS</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {data.machineParams?.maintenanceCondition || 'Optimal'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. TEMPERATURE PARAMETERS */}
            <div className="p-2.5 rounded-xl bg-rose-950/25 border border-rose-500/40">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-rose-500/20">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌡️</span> Temperature Parameters
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30 font-bold">
                  Units: °C
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-rose-500/20">
                  <span className="text-gray-400 text-[9px] block">ZONE TEMPERATURE</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-rose-200">
                      {data.temperatureParams?.currentTempCelsius ?? data.temperatureCelsius ?? 22}°C
                    </span>
                    <span className="text-[9px] text-gray-500">
                      (Target: {data.temperatureParams?.targetTempCelsius ?? data.temperatureCelsius ?? 22}°C)
                    </span>
                  </div>
                </div>

                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-rose-500/20">
                  <span className="text-gray-400 text-[9px] block">
                    {data.processStageNumber === 2
                      ? 'ROASTING TEMP'
                      : data.processStageNumber === 6
                      ? 'MIXING TEMP'
                      : data.processStageNumber === 7
                      ? 'TEMPERING TEMP'
                      : data.processStageNumber === 8 || data.processStageNumber === 9
                      ? 'COOLING TEMP'
                      : 'ROOM TEMP'}
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    {data.temperatureParams?.roastingTempCelsius
                      ? `${data.temperatureParams.roastingTempCelsius}°C`
                      : data.temperatureParams?.mixingTempCelsius
                      ? `${data.temperatureParams.mixingTempCelsius}°C`
                      : data.temperatureParams?.temperingTempCelsius
                      ? `${data.temperatureParams.temperingTempCelsius}°C`
                      : data.temperatureParams?.coolingTempCelsius
                      ? `${data.temperatureParams.coolingTempCelsius}°C`
                      : `${data.temperatureCelsius ?? 22}°C`}
                  </span>
                </div>

                {data.viscosityCp !== undefined && (
                  <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-rose-500/20 col-span-2 flex items-center justify-between">
                    <span className="text-gray-400 text-[10px]">VISCOSITY (RHEOLOGY):</span>
                    <span className="text-amber-300 font-bold">{data.viscosityCp.toLocaleString()} cP</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. PRODUCTION PARAMETERS */}
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40">
              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍫</span> Production Parameters
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold">
                  kg/h • units/h
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">CHOCOLATE OUTPUT</span>
                  <span className="text-sm font-bold text-amber-200">
                    {data.productionParams?.chocolateOutputKgPerHour
                      ? `${data.productionParams.chocolateOutputKgPerHour.toLocaleString()} kg/h`
                      : `${((data.chocolateVolumeTons ?? 22) * 50).toLocaleString()} kg/h`}
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">BATCH SIZE</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {data.productionParams?.batchSizeKg
                      ? `${data.productionParams.batchSizeKg.toLocaleString()} kg/batch`
                      : `${((data.batchCapacityLiters ?? 40000) * 0.2).toLocaleString()} kg/batch`}
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">PRODUCTION RATE</span>
                  <span className="text-sm font-bold text-emerald-300">
                    {data.productionParams?.productionRateUnitsPerHour
                      ? `${data.productionParams.productionRateUnitsPerHour.toLocaleString()} units/h`
                      : '3,200 units/h'}
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">REJECTED PRODUCTS</span>
                  <span className="text-sm font-bold text-rose-300">
                    {data.productionParams?.rejectedProductsPct ?? 0.6}%{' '}
                    <span className="text-[9px] font-normal text-gray-500">
                      ({data.productionParams?.defectCount ?? 8} defects)
                    </span>
                  </span>
                </div>
                {data.productionParams?.packagesPerMinute !== undefined && (
                  <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20 col-span-2 flex items-center justify-between">
                    <span className="text-gray-400 text-[10px]">PACKAGING COUNT & RATE:</span>
                    <span className="text-white font-bold">
                      {data.productionParams.packagesPerMinute} packages/min • {data.productionParams.packagingCountTotal.toLocaleString()} total
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. ENVIRONMENTAL PARAMETERS */}
            <div className="p-2.5 rounded-xl bg-cyan-950/25 border border-cyan-500/40">
              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-cyan-500/20">
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌿</span> Environmental Parameters
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-bold">
                  %RH • °C • kWh
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-gray-400 text-[9px] block">FACTORY HUMIDITY</span>
                  <span className="text-sm font-bold text-cyan-200">
                    {data.environmentalParams?.factoryHumidityRh ?? 42}% RH
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-gray-400 text-[9px] block">ROOM TEMPERATURE</span>
                  <span className="text-sm font-bold text-white">
                    {data.environmentalParams?.roomTempCelsius ?? 21.0}°C
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-gray-400 text-[9px] block">COOLING-WATER TEMP</span>
                  <span className="text-sm font-bold text-blue-300">
                    {data.environmentalParams?.coolingWaterTempCelsius ?? 14.5}°C
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-gray-400 text-[9px] block">ENERGY CONSUMPTION</span>
                  <span className="text-sm font-bold text-yellow-300">
                    {data.environmentalParams?.energyConsumptionKwh ?? 420} kWh
                  </span>
                </div>
              </div>
            </div>

            {/* 5. INVENTORY PARAMETERS */}
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌾</span> Inventory Parameters
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">
                  {data.rawMaterialBufferDays ?? 14}d Reserve Buffer
                </span>
              </div>

              <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-emerald-500/20 mb-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Total Raw Stock:</span>
                  <span className="text-emerald-300 font-bold text-xs">{data.rawMaterialStockTons ?? 0} Tonnes</span>
                </div>
                {data.recipeRatio && (
                  <p className="text-[10px] text-amber-200/90 mt-1 italic border-t border-emerald-500/10 pt-1">
                    Formula: {data.recipeRatio}
                  </p>
                )}
              </div>

              {/* Material Breakdown Tags */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Cocoa Beans:</span>
                  <span className="text-white font-bold">{data.inventoryParams?.cocoaBeansKg ? `${(data.inventoryParams.cocoaBeansKg / 1000).toFixed(1)} T` : `${data.rawMaterialsBreakdown?.cocoaBeans ?? 0} T`}</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Cocoa Butter:</span>
                  <span className="text-amber-300 font-bold">{data.inventoryParams?.cocoaButterKg ? `${(data.inventoryParams.cocoaButterKg / 1000).toFixed(1)} T` : `${data.rawMaterialsBreakdown?.cocoaButter ?? 0} T`}</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Sugar:</span>
                  <span className="text-cyan-300 font-bold">{data.inventoryParams?.sugarKg ? `${(data.inventoryParams.sugarKg / 1000).toFixed(1)} T` : `${data.rawMaterialsBreakdown?.caneSugar ?? 0} T`}</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Milk Powder:</span>
                  <span className="text-purple-300 font-bold">{data.inventoryParams?.milkPowderKg ? `${(data.inventoryParams.milkPowderKg / 1000).toFixed(1)} T` : `${data.rawMaterialsBreakdown?.milkPowder ?? 0} T`}</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Packaging Mat:</span>
                  <span className="text-yellow-300 font-bold">{data.inventoryParams?.packagingMaterialPackages?.toLocaleString() ?? '18,500'} pkgs</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#090D1E] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Finished Stock:</span>
                  <span className="text-emerald-300 font-bold">{data.finishedChocolateTons ? `${data.finishedChocolateTons} T` : '0 T'}</span>
                </div>
              </div>
            </div>

            {/* 4. SHOCK & QUALITY STABILITY TELEMETRY */}
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> Shock & Stability Dynamics
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                  (data.thermalShockIndex ?? 0) > 3.0
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {(data.thermalShockIndex ?? 0) > 3.0 ? 'SHOCK CRITICAL' : 'STABILITY OPTIMAL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-purple-500/20">
                  <span className="text-gray-400 text-[9px] block">THERMAL SHOCK INDEX</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-rose-300">{data.thermalShockIndex ?? 0.4}°C/min</span>
                    <span className="text-[9px] text-gray-500">(Safe &lt;2°C)</span>
                  </div>
                </div>

                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-purple-500/20">
                  <span className="text-gray-400 text-[9px] block">TEMPER SHOCK (FAT BLOOM)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-emerald-300">
                      {100 - (data.temperShockRiskPct ?? 0)}%
                    </span>
                    <span className="text-[9px] text-gray-500">Beta-V Form</span>
                  </div>
                </div>

                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-purple-500/20">
                  <span className="text-gray-400 text-[9px] block">VISCOSITY SHEAR FACTOR</span>
                  <span className="text-sm font-bold text-amber-300">
                    {data.shockMetrics?.viscosityShockFactor ?? 1.05}x
                  </span>
                </div>

                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-purple-500/20">
                  <span className="text-gray-400 text-[9px] block">SUPPLY SHOCK RESILIENCE</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {100 - (data.supplyShockVulnerability ?? 10)}%
                  </span>
                </div>
              </div>

              {data.shockMetrics?.shockDescription && (
                <p className="text-[10px] text-gray-400 mt-2 bg-black/40 p-1.5 rounded border border-white/5">
                  {data.shockMetrics.shockDescription}
                </p>
              )}
            </div>

            {/* 6. ZONE MONITORED PARAMETERS (Section 2 Specification) */}
            {data.processStageNumber && ZONE_MONITORED_PARAMETERS[data.processStageNumber] && (
              <div className="p-2.5 rounded-xl bg-blue-950/25 border border-blue-500/40">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-blue-500/20">
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span>📋</span> {ZONE_MONITORED_PARAMETERS[data.processStageNumber].zoneName} Checklist
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-200 border border-blue-500/30 font-bold">
                    Zone {data.processStageNumber}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[10px] font-mono mt-1">
                  {ZONE_MONITORED_PARAMETERS[data.processStageNumber].parameters.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-2 py-1 rounded bg-[#090D1E]/90 border border-white/5"
                    >
                      <span className="text-gray-400">{p.label}:</span>
                      <span className="font-bold text-cyan-200">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWarehouseCutaway(data.facilityCode || id);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 font-bold flex items-center justify-center gap-2 shadow-lg text-white cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye className="w-4 h-4" />
                {warehouseCutaway.active && warehouseCutaway.facilityCode === (data.facilityCode || id)
                  ? 'Exit Factory Interior'
                  : 'Inspect Factory Interior Cutaway'}
              </button>
            </div>
          </>
        )}

        {/* VEHICLE DETAILS */}
        {type === 'vehicle' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">CONFECTIONERY CARRIER</span>
              <p className="font-sans font-bold text-sm text-amber-200">{data.carrierName}</p>
              <p className="text-[11px] text-gray-400">
                Code: {data.vehicleCode || id} | Type: {data.vehicleModelType || data.type}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div>
                <span className="text-gray-400 text-[10px]">SPEED</span>
                <p className="text-sm font-bold text-cyan-300">{data.currentSpeedKmh || data.speedKmh} km/h</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">PAYLOAD CAPACITY</span>
                <p className="text-sm font-bold text-gray-200">
                  {((data.currentWeightKg || 12000) / 1000).toFixed(1)} / {((data.maxWeightKg || 20000) / 1000).toFixed(1)} t
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">STATUS</span>
                <p
                  className={`text-sm font-bold ${
                    data.isDelayedByDisruption || data.status === 'delayed'
                      ? 'text-red-400 animate-pulse'
                      : 'text-emerald-400'
                  }`}
                >
                  {data.isDelayedByDisruption ? 'VISCOSITY DELAY' : data.status?.toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">PIPELINE / CORRIDOR</span>
                <p className="text-sm font-bold text-purple-300">
                  {data.assignedRouteCode || 'PIPE-CHOC-01'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  followVehicle(data.vehicleCode || id);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4" />
                {cameraMode === 'follow_vehicle' && followedVehicleId === (data.vehicleCode || id)
                  ? 'Unfollow Vehicle Camera'
                  : 'Follow Carrier Camera'}
              </button>

              {data.isDelayedByDisruption && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyRecoveryPlan('PLAN-REC-01');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Reroute to Thermal Recirculation Bypass
                </button>
              )}
            </div>
          </>
        )}

        {/* ROUTE & CONNECTION DETAILS */}
        {type === 'route' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">JACKETED PROCESS PIPELINE</span>
              <p className="font-sans font-bold text-base text-amber-200">
                {data.chocolatePipelineName || data.name || data.label || id}
              </p>
              {data.ingredientFlow && (
                <p className="text-[11px] text-amber-300 mt-0.5 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
                  <span className="text-gray-400">Flow Ingredient: </span>
                  <span className="font-semibold text-amber-100">{data.ingredientFlow}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648]">
              {data.pipeTemperatureCelsius !== undefined ? (
                <div>
                  <span className="text-gray-400 text-[10px]">PIPE TEMPERATURE</span>
                  <p className={`text-sm font-bold ${data.pipeTemperatureCelsius < 32 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                    {data.pipeTemperatureCelsius}°C {data.pipeTemperatureCelsius < 32 ? '(Crystallizing!)' : '(Optimal)'}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400 text-[10px]">DISTANCE</span>
                  <p className="text-sm font-bold text-cyan-300">{data.distanceKm} km</p>
                </div>
              )}
              {data.pipePressureBar !== undefined ? (
                <div>
                  <span className="text-gray-400 text-[10px]">LINE PRESSURE</span>
                  <p className="text-sm font-bold text-gray-200">{data.pipePressureBar} Bar</p>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400 text-[10px]">FLOW SPEED</span>
                  <p className="text-sm font-bold text-purple-300">{data.flowSpeed || 0.45} m/s</p>
                </div>
              )}
              <div>
                <span className="text-gray-400 text-[10px]">STATUS</span>
                <p className={`text-sm font-bold ${data.isClosed || data.isDisrupted ? 'text-red-400' : 'text-emerald-400'}`}>
                  {data.chocolateStatusText || (data.isClosed ? 'JACKET FAULT' : 'OPTIMAL FLOW')}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">CORRIDOR ID</span>
                <p className="text-sm font-bold text-purple-300">
                  {data.roadCorridor || 'LINE-CHOC-01'}
                </p>
              </div>
            </div>

            {/* PIPELINE THROUGHPUT & MASS TRANSFER */}
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍫</span> Mass Throughput Telemetry
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold">
                  {data.transportVolumeTons ?? 15.0} MT In-Transit
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2">
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">TRANSFER RATE</span>
                  <span className="text-sm font-bold text-amber-200">
                    {data.flowThroughputKgPerHour ? `${data.flowThroughputKgPerHour.toLocaleString()} kg/h` : '2,400 kg/h'}
                  </span>
                </div>
                <div className="bg-[#090D1E]/80 p-2 rounded-lg border border-amber-500/20">
                  <span className="text-gray-400 text-[9px] block">CONVEYANCE MODE</span>
                  <span className="text-sm font-bold text-cyan-300 capitalize">
                    {data.corridorCategory || 'Jacketed Line'}
                  </span>
                </div>
              </div>
            </div>

            {/* JACKET THERMAL GRADIENT & SHOCK RISKS */}
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span> Thermal Gradient & Shock
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                  data.isClosed
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {data.isClosed ? 'CRYSTALLIZATION FREEZE' : 'ISOTHERMAL NOMINAL'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-300 bg-[#090D1E]/80 p-2 rounded-lg border border-purple-500/20">
                {data.thermalShockGradient || 'Nominal continuous temperature control across jacket boundary.'}
              </p>
            </div>

            {data.isClosed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  applyRecoveryPlan('PLAN-REC-01');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                Activate Thermal Recirculation Bypass Loop
              </button>
            )}
          </>
        )}

        {/* CARGO DETAILS */}
        {type === 'cargo' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">CARGO MANIFEST</span>
              <p className="font-sans font-bold text-sm text-gray-100">{data.description}</p>
              <p className="text-[11px] text-gray-400">Order: {data.orderId} | Consignment: {data.shipmentId}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div>
                <span className="text-gray-400 text-[10px]">TEMPERATURE</span>
                <p className="text-sm font-bold text-cyan-400">
                  {data.temperatureControlled ? '-20°C COLD-CHAIN' : 'AMBIENT'}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">WEIGHT</span>
                <p className="text-sm font-bold text-gray-200">{(data.weightKg / 1000).toFixed(1)} metric tons</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">PRIORITY</span>
                <p className="text-sm font-bold text-red-400 uppercase">{data.priority}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">RISK SCORE</span>
                <p className="text-sm font-bold text-amber-400">{data.riskScore}/100</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExplodedGraph(data.shipmentId || id);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              Trace 7-Layer Supply Chain
            </button>
          </>
        )}

        {/* INCIDENT DETAILS */}
        {type === 'incident' && (
          <>
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50">
              <span className="text-[10px] text-red-300 font-bold block mb-1">
                SEVERITY: {data.severity?.toUpperCase()}
              </span>
              <p className="font-sans font-bold text-sm text-red-100">{data.title}</p>
              <p className="text-[11px] text-gray-300 mt-1">{data.location?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div>
                <span className="text-gray-400 text-[10px]">DELAY IMPACT</span>
                <p className="text-sm font-bold text-red-400">+{data.delayImpactHours} hours</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">EXPECTED DURATION</span>
                <p className="text-sm font-bold text-amber-300">{data.expectedDurationHours}h</p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                applyRecoveryPlan('PLAN-REC-01');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold flex items-center justify-center gap-2 text-white shadow-lg cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              Apply I-70 Bypass Recovery
            </button>
          </>
        )}

        {/* AI AGENT DETAILS */}
        {type === 'ai_agent' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">AGENT ROLE</span>
              <p className="font-sans font-bold text-sm text-indigo-300">{data.displayName}</p>
              <p className="text-[11px] text-gray-300 mt-1">{data.role}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648] space-y-1.5">
              <div>
                <span className="text-gray-400 text-[10px]">CURRENT TASK</span>
                <p className="text-xs text-gray-200">{data.currentTask}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">LATEST SYNTHESIS OUTPUT</span>
                <p className="text-xs text-emerald-400 font-semibold">{data.lastOutputSummary}</p>
              </div>
            </div>
          </>
        )}

        {/* SUPPLIER DETAILS */}
        {type === 'supplier' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">TIER-1 SUPPLIER NODE</span>
              <p className="font-sans font-bold text-sm text-teal-300">{data.location || data.supplierCode || id}</p>
              {data.material && (
                <p className="text-xs text-teal-400 mt-1 font-semibold">{data.material}</p>
              )}
            </div>
            <div className="p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648] space-y-1">
              <span className="text-gray-400 text-[10px]">SUPPLIER ID</span>
              <p className="text-xs text-white font-mono">{id}</p>
            </div>
          </>
        )}

        {/* MANUFACTURING DETAILS */}
        {type === 'manufacturing' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">ADVANCED MANUFACTURING</span>
              <p className="font-sans font-bold text-sm text-orange-300">{data.location || id}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648] space-y-1">
              <span className="text-gray-400 text-[10px]">FACILITY CODE</span>
              <p className="text-xs text-white font-mono">{id}</p>
            </div>
          </>
        )}

        {/* DOCUMENT DETAILS */}
        {type === 'document' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">DIGITAL COMPLIANCE RECORD</span>
              <p className="font-sans font-bold text-sm text-emerald-300">{data.title || id}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#12172E] border border-[#1E2648] space-y-1">
              <span className="text-gray-400 text-[10px]">DOCUMENT AUDIT</span>
              <p className="text-xs text-emerald-400 font-bold">VERIFIED ON-CHAIN</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
