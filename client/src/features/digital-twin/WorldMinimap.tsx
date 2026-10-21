import React from 'react';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { Compass, Crosshair } from 'lucide-react';

export const WorldMinimap: React.FC = () => {
  const facilities = useDigitalTwinStore(s => s.facilities);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const cameraTarget = useDigitalTwinStore(s => s.cameraTarget);
  const focusOnPosition = useDigitalTwinStore(s => s.focusOnPosition);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);

  // Map 3D coordinate space [-70 to +70] to Minimap pixel space [0 to 160]
  const toMinimapCoords = (x: number, z: number) => {
    const size = 160;
    const px = ((x + 70) / 140) * size;
    const py = ((z + 70) / 140) * size;
    return { x: Math.max(8, Math.min(size - 8, px)), y: Math.max(8, Math.min(size - 8, py)) };
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = (clickX / 160) * 140 - 70;
    const worldZ = (clickY / 160) * 140 - 70;
    focusOnPosition([worldX, 0, worldZ], [worldX, 0, worldZ]);
  };

  const camPos = toMinimapCoords(cameraTarget[0], cameraTarget[2]);

  return (
    <div className="relative w-44 h-44 rounded-2xl bg-[#090D1E]/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,245,255,0.25)] backdrop-blur-md p-2 flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 border-b border-cyan-500/20 pb-1">
        <span className="flex items-center gap-1 font-bold">
          <Compass className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          TACTICAL RADAR
        </span>
        <span className="text-gray-400 text-[9px]">160 km²</span>
      </div>

      {/* Radar Grid Viewport */}
      <div
        onClick={handleMinimapClick}
        className="relative w-full h-[120px] rounded-lg bg-[#050711] border border-cyan-900/50 cursor-crosshair overflow-hidden"
      >
        {/* Radar concentric sweep rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full border border-cyan-500/15" />
          <div className="w-12 h-12 rounded-full border border-cyan-500/20" />
          <div className="w-full h-[1px] bg-cyan-500/15" />
          <div className="h-full w-[1px] bg-cyan-500/15" />
        </div>

        {/* Facility Blips */}
        {facilities.map(fac => {
          const pt = toMinimapCoords(fac.position3D[0], fac.position3D[2]);
          return (
            <div
              key={fac.facilityCode}
              title={`${fac.name} (${fac.facilityCode})`}
              onClick={e => {
                e.stopPropagation();
                focusOnPosition(fac.position3D, fac.position3D);
                selectEntity({ type: 'facility', id: fac.facilityCode, data: fac });
              }}
              className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 hover:scale-150 transition-transform shadow-[0_0_6px_#00F5FF]"
              style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
            />
          );
        })}

        {/* Vehicle Blips */}
        {vehicles.map(veh => {
          const pt = toMinimapCoords(veh.position3D[0], veh.position3D[2]);
          return (
            <div
              key={veh.vehicleCode}
              title={`${veh.vehicleCode} (${veh.status})`}
              className={`absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-sm ${
                veh.isDelayedByDisruption ? 'bg-red-400 animate-ping' : 'bg-emerald-400'
              }`}
              style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
            />
          );
        })}

        {/* Disruption Epicenter Pulse */}
        {incidents.map(inc => {
          const pt = toMinimapCoords(inc.location.position3D[0], inc.location.position3D[2]);
          return (
            <div
              key={inc.incidentCode}
              title={`INCIDENT: ${inc.title}`}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 animate-ping"
              style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
            />
          );
        })}

        {/* Camera Reticle Crosshair */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-purple-400"
          style={{ left: `${camPos.x}px`, top: `${camPos.y}px` }}
        >
          <Crosshair className="w-4 h-4 text-purple-400 drop-shadow-[0_0_4px_#A855F7]" />
        </div>
      </div>

      {/* Footer Coordinates */}
      <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 pt-0.5">
        <span>X: {cameraTarget[0].toFixed(1)}</span>
        <span>Z: {cameraTarget[2].toFixed(1)}</span>
        <span className="text-cyan-400">ONLINE</span>
      </div>
    </div>
  );
};
