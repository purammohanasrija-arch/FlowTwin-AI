import React from 'react';
import { Html } from '@react-three/drei';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

const STAGE_SHORT_NAMES: Record<number, string> = {
  1: 'Raw Silos',
  2: 'Drum Roasting',
  3: 'Winnowing',
  4: 'Butter Press',
  5: 'Dairy Blend',
  6: 'Conching',
  7: 'Tempering',
  8: 'Bulk Rail Tanker',
  9: 'Molding & Enrobing',
  10: 'Packaging Vault',
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
}

const FacilityLabelItem: React.FC<FacilityLabelProps> = ({ facility, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const stageNum = facility.processStageNumber;
  const shortName = stageNum ? STAGE_SHORT_NAMES[stageNum] || facility.name : facility.name;
  const icon = stageNum ? STAGE_ICONS[stageNum] || '🏭' : '🏭';
  const processName = facility.processStageName || facility.chocolateFacilityName || facility.name;

  const statusColor =
    facility.status === 'optimal'
      ? 'bg-emerald-400'
      : facility.status === 'congested'
      ? 'bg-amber-400'
      : 'bg-rose-400';

  // Stagger height to prevent vertical collisions between adjacent plants
  const heightOffset = facility.facilityCode === 'FAC-RAIL-08' ? 12.0 : 9.5;

  return (
    <group position={[facility.position3D[0], facility.position3D[1] + heightOffset, facility.position3D[2]]}>
      <Html center distanceFactor={44} zIndexRange={[12, 0]} className="pointer-events-auto select-none">
        <div
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`cursor-pointer transition-all duration-200 ${
            isSelected || isHovered ? 'z-50' : 'z-10'
          }`}
        >
          {isSelected || isHovered ? (
            /* Expanded detailed state on hover or selection */
            <div className="px-3.5 py-2 rounded-2xl bg-[#140E0A]/95 border-2 border-amber-400 text-amber-100 shadow-[0_0_28px_rgba(245,158,11,0.55)] scale-105 font-mono whitespace-nowrap">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{icon}</span>
                {stageNum && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[9px] font-bold">
                    STAGE {stageNum}
                  </span>
                )}
                <span className="font-extrabold text-xs text-white tracking-wide">
                  {processName}
                </span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor} ${facility.status === 'congested' ? 'animate-pulse' : ''}`} />
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-300 pl-4 border-t border-amber-500/20 pt-1">
                <span className="text-amber-400/90 font-medium">{facility.facilityCode}</span>
                <span className="text-gray-600">•</span>
                <span className="text-emerald-400 font-bold">{facility.utilizationPercentage}% Tank Load</span>
                {facility.temperatureCelsius && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-cyan-300 font-bold">{facility.temperatureCelsius}°C</span>
                  </>
                )}
                {facility.viscosityCp && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-purple-300">{facility.viscosityCp} cP</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Minimal, sleek capsule badge when idle */
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090C19]/90 border border-[#232B4E] hover:border-amber-400/80 text-gray-200 shadow-md backdrop-blur-md whitespace-nowrap font-sans hover:bg-[#15121E] transition-all">
              <span className="text-xs">{icon}</span>
              <span className="text-xs font-bold text-white tracking-tight">
                {stageNum ? `${stageNum}. ${shortName}` : facility.name}
              </span>
              {facility.temperatureCelsius && (
                <span className="text-[10px] font-mono text-cyan-300 px-1 py-0.2 rounded bg-black/40">
                  {facility.temperatureCelsius}°C
                </span>
              )}
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor}`} />
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

  if (!layers.labels || explodedGraph.active) return null;

  return (
    <group name="SpatialLabels">
      {/* 1. Facility Process Stage Labels (Clean, Compact, Minimal) */}
      {facilities.map(facility => (
        <FacilityLabelItem
          key={facility.facilityCode}
          facility={facility}
          isSelected={selectedEntity?.type === 'facility' && selectedEntity.id === facility.facilityCode}
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
