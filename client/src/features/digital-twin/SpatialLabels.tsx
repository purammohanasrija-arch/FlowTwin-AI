import React from 'react';
import { Html } from '@react-three/drei';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const SpatialLabels: React.FC = () => {
  const layers = useDigitalTwinStore(s => s.layers);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const explodedGraph = useDigitalTwinStore(s => s.explodedGraph);

  if (!layers.labels || explodedGraph.active) return null;

  return (
    <group name="SpatialLabels">
      {/* 1. Facility Labels */}
      {facilities.map(facility => {
        const isSelected =
          selectedEntity?.type === 'facility' && selectedEntity.id === facility.facilityCode;

        return (
          <group
            key={facility.facilityCode}
            position={[facility.position3D[0], facility.position3D[1] + 8.5, facility.position3D[2]]}
          >
            <Html
              center
              distanceFactor={45}
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
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap backdrop-blur-md border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,245,255,0.4)] scale-110'
                    : 'bg-[#0E1222]/85 border-[#2E375B] text-gray-300 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      facility.status === 'optimal'
                        ? 'bg-emerald-400'
                        : facility.status === 'congested'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                  />
                  <span>{facility.facilityCode}</span>
                  <span className="text-gray-400 font-normal">| {facility.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-cyan-400 font-normal">
                    {facility.utilizationPercentage}%
                  </span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 2. Disruption Incident Badges */}
      {isDisruptionActive &&
        incidents.map(incident => (
          <group
            key={incident.incidentCode}
            position={[
              incident.location.position3D[0],
              incident.location.position3D[1] + 6.0,
              incident.location.position3D[2],
            ]}
          >
            <Html
              center
              distanceFactor={40}
              zIndexRange={[10, 0]}
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
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-red-950/90 border border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <span>{incident.incidentCode}</span>
                  <span className="text-amber-300 font-normal">+{incident.delayImpactHours}h Delay</span>
                </div>
              </div>
            </Html>
          </group>
        ))}
    </group>
  );
};
