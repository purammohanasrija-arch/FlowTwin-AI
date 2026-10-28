import React from 'react';
import { Html } from '@react-three/drei';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

const STAGE_SHORT_NAMES: Record<number, string> = {
  1: 'Raw Silos',
  2: 'Roasting',
  3: 'Winnowing',
  4: 'Butter Press',
  5: 'Dairy Blend',
  6: 'Conching',
  7: 'Tempering',
  8: 'Rail Tanker',
  9: 'Molding',
  10: 'Packaging',
};

const STAGE_ICONS: Record<number, string> = {
  1: '🚢',
  2: '🔥',
  3: '💨',
  4: '⚙️',
  5: '🥛',
  6: '🍫',
  7: '🌡️',
  8: '🚂',
  9: '🎨',
  10: '🎁',
};

interface FacilityLabelProps {
  facility: any;
  isSelected: boolean;
  onSelect: () => void;
  displayMode: 'pill' | 'card' | 'focus';
}

const STATUS_COLOR_MAP = {
  green: {
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_24px_rgba(16,185,129,0.35)]',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
  },
  amber: {
    dot: 'bg-amber-400',
    border: 'border-amber-500/60',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.4)]',
    text: 'text-amber-400',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
  },
  red: {
    dot: 'bg-rose-500',
    border: 'border-rose-500/70',
    glow: 'shadow-[0_0_28px_rgba(239,68,68,0.5)]',
    text: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-500/40',
  },
  purple: {
    dot: 'bg-purple-400',
    border: 'border-purple-500/60',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.4)]',
    text: 'text-purple-300',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
  },
  cyan: {
    dot: 'bg-cyan-400',
    border: 'border-cyan-500/60',
    glow: 'shadow-[0_0_24px_rgba(6,182,212,0.4)]',
    text: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/30',
  },
};

const FacilityLabelItem: React.FC<FacilityLabelProps> = ({ facility, isSelected, onSelect, displayMode }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const stageNum = facility.processStageNumber;
  const shortName = stageNum ? STAGE_SHORT_NAMES[stageNum] || facility.name : facility.name;
  const icon = stageNum ? STAGE_ICONS[stageNum] || '🏭' : '🏭';

  const telemetry = facility.liveMapTelemetry;
  const machineParams = facility.machineParams;
  const statusKey =
    telemetry?.secondaryMetric?.statusColor ||
    (facility.status === 'congested' ? 'amber' : facility.status === 'optimal' ? 'green' : 'red');

  const theme = STATUS_COLOR_MAP[statusKey as keyof typeof STATUS_COLOR_MAP] || STATUS_COLOR_MAP.green;

  // Stagger height to avoid vertical overlap across production zones
  const heightOffset =
    facility.facilityCode === 'FAC-RAIL-08'
      ? 12.8
      : facility.facilityCode === 'FAC-CHI-01'
      ? 11.5
      : facility.facilityCode === 'FAC-NYC-02'
      ? 11.0
      : 9.8;

  // If focus-only mode is active and this node is not active, hide to avoid clutter
  if (displayMode === 'focus' && !isSelected && !isHovered) {
    return (
      <group position={[facility.position3D[0], facility.position3D[1] + heightOffset, facility.position3D[2]]}>
        <Html center distanceFactor={42} zIndexRange={[10, 0]} className="pointer-events-auto select-none">
          <div
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            className="w-3 h-3 rounded-full bg-white/20 border border-white/40 hover:scale-150 transition-all cursor-pointer shadow-md"
            title={`Stage ${stageNum}: ${shortName} (Click to inspect)`}
          />
        </Html>
      </group>
    );
  }

  const showFullCard = isSelected || isHovered || displayMode === 'card';

  return (
    <group position={[facility.position3D[0], facility.position3D[1] + heightOffset, facility.position3D[2]]}>
      <Html center distanceFactor={42} zIndexRange={[20, 0]} className="pointer-events-auto select-none">
        <div
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`cursor-pointer transition-all duration-200 ${
            showFullCard ? 'scale-105 z-50' : 'z-10'
          }`}
        >
          {showFullCard ? (
            /* ============================================================ */
            /* 1. EXPANDED LIVE SENSOR CARD (Hover, Selected, or Card Mode) */
            /* ============================================================ */
            <div
              className={`p-3.5 rounded-2xl bg-[#090D1E]/95 border-2 ${theme.border} text-white ${theme.glow} font-sans min-w-[240px] backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150`}
            >
              {/* Header: Machine Code & Name + Status Dot */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base p-1 rounded-lg bg-black/40 border border-white/10">{icon}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-xs text-amber-200 tracking-wider">
                        {telemetry?.machineTag || `${facility.facilityCode} · ${shortName}`}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      Stage {stageNum} · {facility.chocolateFacilityName || facility.processStageName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${theme.dot} ${
                      facility.status === 'congested' ? 'animate-pulse' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Primary Live Value */}
              <div className="grid grid-cols-2 gap-2 mb-2 font-mono">
                <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider block">
                    {telemetry?.primaryMetric?.label || 'TEMPERATURE'}
                  </span>
                  <div className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    {telemetry?.primaryMetric?.value || `${facility.temperatureCelsius ?? 24}°C`}
                  </div>
                  <span className="text-[9px] text-cyan-300 font-bold block mt-0.5">
                    {telemetry?.primaryMetric?.label || 'Temperature'}
                  </span>
                </div>

                {/* Secondary Live Value */}
                <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider block">
                    {telemetry?.secondaryMetric?.badge || 'CAPACITY'}
                  </span>
                  <div className={`text-xl font-extrabold ${theme.text} tracking-tight mt-0.5`}>
                    {telemetry?.secondaryMetric?.value || `${facility.utilizationPercentage}%`}
                  </div>
                  <span className="text-[9px] text-gray-400 block truncate mt-0.5" title={telemetry?.secondaryMetric?.statusNote}>
                    {telemetry?.secondaryMetric?.statusNote || 'Operating normally'}
                  </span>
                </div>
              </div>

              {/* Extra Telemetry Chips */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono border-t border-white/10 pt-2">
                {telemetry?.extraMetrics?.map((metric: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-gray-400">{metric.label}:</span>
                    <span className="font-bold text-gray-200">{metric.value}</span>
                  </div>
                ))}
                {machineParams?.maintenanceCondition && (
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-gray-400">Condition:</span>
                    <span className="font-bold text-emerald-300">{machineParams.maintenanceCondition}</span>
                  </div>
                )}
                {facility.chocolateVolumeTons !== undefined && (
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-gray-400">Volume:</span>
                    <span className="font-bold text-amber-300">{facility.chocolateVolumeTons} MT</span>
                  </div>
                )}
              </div>

              {/* Click prompt */}
              <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-400">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <span>👆</span> Click to inspect full machine parameters
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-bold">15 KPIs</span>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* 2. COMPACT TACTICAL PILL (Default - Zero 3D Clutter)         */
            /* ============================================================ */
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090D1E]/95 border ${theme.border} text-white shadow-xl backdrop-blur-md font-mono hover:${theme.border} transition-all hover:scale-105 whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${theme.dot} ${facility.status === 'congested' ? 'animate-pulse' : ''}`} />
              <span className="text-xs">{icon}</span>
              <span className="text-[11px] font-extrabold text-amber-200">
                {stageNum ? `${stageNum}. ` : ''}{shortName}
              </span>
              <span className="text-gray-500 text-[10px]">·</span>
              <span className="text-[11px] font-bold text-white">
                {telemetry?.primaryMetric?.value || `${facility.temperatureCelsius ?? 24}°C`}
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

export const SpatialLabels: React.FC = () => {
  const layers = useDigitalTwinStore(s => s.layers);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const explodedGraph = useDigitalTwinStore(s => s.explodedGraph);
  const labelDisplayMode = useDigitalTwinStore(s => s.labelDisplayMode);

  if (!layers.labels || explodedGraph.active) return null;

  return (
    <group name="SpatialLabels">
      {/* 1. Facility Process Stage Labels (Clean, Compact, Minimal) */}
      {facilities.map(facility => (
        <FacilityLabelItem
          key={facility.facilityCode}
          facility={facility}
          isSelected={selectedEntity?.type === 'facility' && selectedEntity.id === facility.facilityCode}
          displayMode={labelDisplayMode}
          onSelect={() =>
            selectEntity({
              type: 'facility',
              id: facility.facilityCode,
              data: facility,
            })
          }
        />
      ))}

      {/* 2. Disruption Incident Badges (Jacket Failure & Viscosity Solidification) */}
      {isDisruptionActive &&
        incidents.map(incident => (
          <group
            key={incident.incidentCode}
            position={[
              incident.location.position3D[0],
              incident.location.position3D[1] + 6.4,
              incident.location.position3D[2],
            ]}
          >
            <Html
              center
              distanceFactor={38}
              zIndexRange={[15, 0]}
              className="pointer-events-auto select-none"
            >
              <div
                onClick={() =>
                  selectEntity({
                    type: 'incident',
                    id: incident.incidentCode,
                    data: incident,
                  })
                }
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#290808]/95 border-2 border-red-500 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse cursor-pointer hover:scale-110 transition-transform"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-300 font-extrabold tracking-wide">
                        VISCOSITY FREEZE HAZARD
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900/60 border border-red-600 text-red-200">
                        {incident.incidentCode}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-normal">
                      Jacket Pipe Fault • +{incident.delayImpactHours}h Solidification Risk
                    </div>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        ))}
    </group>
  );
};
