import React from 'react';
import { Html } from '@react-three/drei';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

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
      {/* 1. Facility Process Stage Labels */}
      {facilities.map(facility => {
        const isSelected =
          selectedEntity?.type === 'facility' && selectedEntity.id === facility.facilityCode;

        // Process friendly stage display
        const stageNum = facility.processStageNumber;
        const processName =
          facility.processStageName ||
          facility.chocolateFacilityName ||
          facility.name;

        const statusColor =
          facility.status === 'optimal'
            ? 'bg-emerald-400'
            : facility.status === 'congested'
            ? 'bg-amber-400'
            : 'bg-rose-400';

        return (
          <group
            key={facility.facilityCode}
            position={[facility.position3D[0], facility.position3D[1] + 9.2, facility.position3D[2]]}
          >
            <Html
              center
              distanceFactor={44}
              zIndexRange={[10, 0]}
              className="pointer-events-auto select-none"
            >
              <div
                onClick={() =>
                  selectEntity({
                    type: 'facility',
                    id: facility.facilityCode,
                    data: facility,
                  })
                }
                className={`px-3 py-1.5 rounded-xl font-mono whitespace-nowrap backdrop-blur-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1C120C]/95 border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-110 z-50 ring-2 ring-amber-400/50'
                    : 'bg-[#0E0F17]/90 border-[#2D334D] text-gray-200 hover:border-amber-400/80 hover:bg-[#16141F]/95 shadow-xl hover:scale-105'
                }`}
              >
                {/* Header row: Stage badge + process title */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${statusColor} ${
                      facility.status === 'congested' ? 'animate-pulse' : ''
                    }`}
                  />
                  {stageNum && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold tracking-wider">
                      STAGE {stageNum}
                    </span>
                  )}
                  <span className="font-bold text-[11px] text-white tracking-wide">
                    {processName}
                  </span>
                </div>

                {/* Sub-row: Facility Code + Tank Load + Operating Temp */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 pl-3.5">
                  <span className="text-gray-400 font-medium">{facility.facilityCode}</span>
                  <span className="text-gray-600">•</span>
                  <span
                    className={`font-semibold ${
                      facility.utilizationPercentage >= 85
                        ? 'text-rose-400'
                        : facility.utilizationPercentage >= 72
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {facility.utilizationPercentage}% Tank Load
                  </span>
                  {facility.temperatureCelsius && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-cyan-300 font-mono">
                        {facility.temperatureCelsius}°C
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Html>
          </group>
        );
      })}

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
