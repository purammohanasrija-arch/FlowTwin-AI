import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import {
  Building2,
  Anchor,
  Plane,
  Truck,
  AlertTriangle,
  Train,
  Factory,
  Package,
  MapPin,
} from 'lucide-react';

import { SelectedEntity } from '../digital-twin/types.js';

interface LogisticsMarkersProps {
  facilities: any[];
  vehicles: any[];
  disruptions: any[];
  selectedShipment?: any | null;
  selectedEntity: any | null;
  showFacilities: boolean;
  showVehicles: boolean;
  showDisruptions: boolean;
  onSelectEntity: (entity: SelectedEntity) => void;
}

export const LogisticsMarkers: React.FC<LogisticsMarkersProps> = ({
  facilities,
  vehicles,
  disruptions,
  selectedShipment,
  selectedEntity,
  showFacilities,
  showVehicles,
  showDisruptions,
  onSelectEntity,
}) => {
  return (
    <>
      {/* 1. FACILITIES (Warehouses, Ports, Hubs, Plants) */}
      {showFacilities &&
        facilities.map(fac => {
          const lat = fac.location?.lat;
          const lng = fac.location?.lng;
          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          const isSelected =
            selectedEntity?.type === 'facility' && selectedEntity.id === fac.facilityCode;
          const util = fac.utilizationPercentage || 65;
          const isCongested = util >= 80;
          const statusCol = isCongested ? '#F59E0B' : '#10B981';

          // Choose icon based on facility category
          let IconComponent = Building2;
          let categoryLabel = 'Hub';
          if (fac.facilityCategory === 'coastal_port' || fac.type === 'port') {
            IconComponent = Anchor;
            categoryLabel = 'Port';
          } else if (fac.facilityCategory === 'airport_hub') {
            IconComponent = Plane;
            categoryLabel = 'Air';
          } else if (fac.facilityCategory === 'rail_terminal') {
            IconComponent = Train;
            categoryLabel = 'Rail';
          } else if (fac.facilityCategory === 'manufacturing_plant') {
            IconComponent = Factory;
            categoryLabel = 'Mfg';
          }

          return (
            <AdvancedMarker
              key={fac.facilityCode}
              position={{ lat, lng }}
              title={`${fac.name} (${fac.facilityCode}) - ${util}% Utilized`}
              onClick={() =>
                onSelectEntity({
                  type: 'facility',
                  id: fac.facilityCode,
                  data: fac,
                })
              }
            >
              <div
                className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 ${
                  isSelected ? 'scale-125 z-30' : 'z-10'
                }`}
              >
                {/* Glowing selection aura */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                )}

                {/* Facility Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-xl shadow-xl backdrop-blur-md border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-400 text-white shadow-[0_0_20px_#00F5FF]'
                      : 'bg-[#0A0D1E]/95 border-[#222B4A] text-gray-200'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${statusCol}25`, color: statusCol }}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left leading-none pr-0.5">
                    <span className="text-[10px] font-mono font-bold tracking-tight">
                      {fac.facilityCode}
                    </span>
                    <span
                      className="text-[9px] font-mono font-semibold"
                      style={{ color: statusCol }}
                    >
                      {util}%
                    </span>
                  </div>
                </div>

                {/* Ground anchor point pointer */}
                <div
                  className="w-1.5 h-1.5 rounded-full mt-[-2px] mx-auto shadow-sm"
                  style={{ backgroundColor: isSelected ? '#00F5FF' : statusCol }}
                />
              </div>
            </AdvancedMarker>
          );
        })}

      {/* 2. FLEET VEHICLES (Active trucks & reefers in transit) */}
      {showVehicles &&
        vehicles.map(veh => {
          const lat = veh.currentLocation?.lat;
          const lng = veh.currentLocation?.lng;
          if (typeof lat !== 'number' || typeof lng !== 'number') return null;

          const isSelected =
            selectedEntity?.type === 'vehicle' && selectedEntity.id === veh.vehicleCode;
          const isDelayed = veh.status === 'delayed' || veh.isDelayedByDisruption;
          const isBreakdown = veh.status === 'breakdown';
          const statusCol = isBreakdown ? '#EF4444' : isDelayed ? '#F59E0B' : '#00F5FF';

          return (
            <AdvancedMarker
              key={veh.vehicleCode}
              position={{ lat, lng }}
              title={`Vehicle ${veh.vehicleCode} (${veh.carrierName}) - Speed: ${veh.speedKmh || veh.currentSpeedKmh || 0} km/h`}
              onClick={() =>
                onSelectEntity({
                  type: 'vehicle',
                  id: veh.vehicleCode,
                  data: veh,
                })
              }
            >
              <div
                className={`relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-125 ${
                  isSelected ? 'scale-125 z-30' : 'z-20'
                }`}
              >
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                )}

                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-xl shadow-xl backdrop-blur-md border ${
                    isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_18px_#00F5FF]'
                      : 'bg-[#0B0E20]/95 border-[#202948] text-gray-200'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${statusCol}30`, color: statusCol }}
                  >
                    <Truck className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px] font-mono font-bold tracking-tight">
                      {veh.vehicleCode}
                    </span>
                    <span
                      className="text-[8px] font-mono"
                      style={{ color: statusCol }}
                    >
                      {veh.speedKmh || veh.currentSpeedKmh || 0} km/h
                    </span>
                  </div>
                </div>

                <div
                  className="w-1.5 h-1.5 rounded-full mt-[-2px] shadow-sm"
                  style={{ backgroundColor: statusCol }}
                />
              </div>
            </AdvancedMarker>
          );
        })}

      {/* 3. ACTIVE DISRUPTION INCIDENTS (Blizzards, Closures, Hazards) */}
      {showDisruptions &&
        disruptions.map((dis, idx) => {
          const lat = dis.location?.latitude || dis.location?.lat || 41.6528;
          const lng = dis.location?.longitude || dis.location?.lng || -83.5379;
          const isSelected =
            selectedEntity?.type === 'disruption' || selectedEntity?.type === 'incident';

          return (
            <AdvancedMarker
              key={dis.incidentCode || `disruption-${idx}`}
              position={{ lat, lng }}
              title={`Active Disruption: ${dis.title} (${dis.severity?.toUpperCase() || 'CRITICAL'})`}
              onClick={() =>
                onSelectEntity({
                  type: 'incident',
                  id: dis.incidentCode || 'INC-BLIZZ-01',
                  data: dis,
                })
              }
            >
              <div
                className={`relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-125 ${
                  isSelected ? 'scale-125 z-40' : 'z-30'
                }`}
              >
                {/* Pulsing severe danger shockwave */}
                <span className="absolute -inset-3 rounded-full bg-red-600/40 animate-ping pointer-events-none" />

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/95 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)] text-red-200 font-bold backdrop-blur-md">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
                  <div className="flex flex-col leading-none text-left">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-red-300">
                      I-80 Blizzard
                    </span>
                    <span className="text-[9px] font-mono text-red-400 font-semibold">
                      Lane Closed (+10h)
                    </span>
                  </div>
                </div>

                <div className="w-2 h-2 rounded-full bg-red-500 mt-[-3px] shadow-[0_0_8px_#EF4444]" />
              </div>
            </AdvancedMarker>
          );
        })}

      {/* 4. SELECTED SHIPMENT ORIGIN & DESTINATION PINS */}
      {selectedShipment && (
        <>
          {selectedShipment.origin?.lat && (
            <AdvancedMarker
              position={{
                lat: selectedShipment.origin.lat,
                lng: selectedShipment.origin.lng,
              }}
              title={`Origin: ${selectedShipment.origin.name}`}
            >
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/95 border border-emerald-400 text-emerald-300 font-mono text-[10px] shadow-lg">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Origin: {selectedShipment.shipmentId}</span>
              </div>
            </AdvancedMarker>
          )}

          {selectedShipment.destination?.lat && (
            <AdvancedMarker
              position={{
                lat: selectedShipment.destination.lat,
                lng: selectedShipment.destination.lng,
              }}
              title={`Destination: ${selectedShipment.destination.name}`}
            >
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950/95 border border-purple-400 text-purple-300 font-mono text-[10px] shadow-lg">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span>Dest: {selectedShipment.shipmentId}</span>
              </div>
            </AdvancedMarker>
          )}
        </>
      )}
    </>
  );
};
