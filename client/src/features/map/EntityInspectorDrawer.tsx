import React, { useState } from 'react';
import {
  X,
  Building2,
  Truck,
  Package,
  AlertTriangle,
  Route as RouteIcon,
  Box,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Clock,
  Gauge,
  Navigation,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { RouteService, RouteComputationResult } from './routeService.js';

interface EntityInspectorDrawerProps {
  entity: {
    type: 'facility' | 'vehicle' | 'shipment' | 'disruption' | 'route' | string;
    id: string;
    data: any;
  } | null;
  onClose: () => void;
  onSetCalculatedRoute?: (res: RouteComputationResult | null) => void;
  calculatedRoute?: RouteComputationResult | null;
}

export const EntityInspectorDrawer: React.FC<EntityInspectorDrawerProps> = ({
  entity,
  onClose,
  onSetCalculatedRoute,
  calculatedRoute,
}) => {
  const navigate = useNavigate();
  const select3DEntity = useDigitalTwinStore(s => s.selectEntity);
  const followVehicleIn3D = useDigitalTwinStore(s => s.followVehicle);
  const toggleCutawayIn3D = useDigitalTwinStore(s => s.toggleWarehouseCutaway);

  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  if (!entity) return null;

  const { type, data } = entity;

  // Jump to 3D Digital Twin Universe and focus this entity
  const handleLaunchIn3D = () => {
    select3DEntity({
      type: type as any,
      id: entity.id,
      data,
    });

    if (type === 'vehicle') {
      followVehicleIn3D(entity.id);
    } else if (type === 'facility') {
      toggleCutawayIn3D(entity.id);
    }

    navigate('/app/twin-3d');
  };

  // Request live route from Google Maps Routes/Directions API
  const handleRequestLiveRoute = async (originLat: number, originLng: number, destLat: number, destLng: number) => {
    setIsCalculatingRoute(true);
    try {
      const res = await RouteService.requestDrivingRoute(
        { lat: originLat, lng: originLng },
        { lat: destLat, lng: destLng }
      );
      if (onSetCalculatedRoute) {
        onSetCalculatedRoute(res);
      }
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1100] w-84 md:w-96 max-h-[calc(100vh-140px)] flex flex-col bg-[#090D1E]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden font-sans transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0E142C]/80 border-b border-[#1E2642]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            {type === 'facility' && <Building2 className="w-4 h-4" />}
            {type === 'vehicle' && <Truck className="w-4 h-4" />}
            {type === 'shipment' && <Package className="w-4 h-4" />}
            {type === 'disruption' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            {type === 'route' && <RouteIcon className="w-4 h-4 text-purple-400" />}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
              Logistics Telemetry
            </span>
            <span className="text-xs font-bold text-white font-mono capitalize">
              {type} Inspector
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-gray-300">
        {/* ================= 1. FACILITY INSPECTOR ================= */}
        {type === 'facility' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  {data.facilityCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    data.status === 'optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {data.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">{data.name}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {data.location?.name || data.location?.address || 'Regional Industrial Terminal'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5">
                  Yard Utilization
                </span>
                <span
                  className={`text-base font-bold font-mono ${
                    data.utilizationPercentage >= 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {data.utilizationPercentage || 74}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5">
                  Throughput Rate
                </span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {data.throughputPerHour || 340} /hr
                </span>
              </div>
            </div>

            <div className="space-y-1.5 p-2.5 rounded-xl bg-[#070A18] border border-[#19223A] text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Capacity:</span>
                <span className="font-mono font-bold text-gray-200">
                  {(data.totalCapacityUnits || 50000).toLocaleString()} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Shipments:</span>
                <span className="font-mono font-bold text-purple-300">
                  {data.activeShipmentCount || 18} consignments
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dock Doors:</span>
                <span className="font-mono text-gray-300">{data.dockDoorsCount || 12} bays</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GPS Coordinates:</span>
                <span className="font-mono text-cyan-400 text-[10px]">
                  {data.location?.lat?.toFixed(4)}, {data.location?.lng?.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. VEHICLE INSPECTOR ================= */}
        {type === 'vehicle' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  {data.vehicleCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    data.status === 'in_transit'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : data.status === 'delayed'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {data.status?.toUpperCase() || 'IN_TRANSIT'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {data.carrierName || 'Apex Freight Dynamics'}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Location: {data.currentLocation?.name || 'Interstate Highway Corridor'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" /> Speed Telematics
                </span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {data.speedKmh || data.currentSpeedKmh || 0} km/h
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5">
                  Gross Payload
                </span>
                <span className="text-base font-bold font-mono text-purple-300">
                  {(data.currentWeightKg || 14500).toLocaleString()} kg
                </span>
              </div>
            </div>

            <div className="space-y-1.5 p-2.5 rounded-xl bg-[#070A18] border border-[#19223A] text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Assigned Route:</span>
                <span className="font-mono font-bold text-gray-200">
                  {data.assignedRouteCode || 'ROUTE-I80-MW'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Disruption Delay:</span>
                <span
                  className={`font-mono font-bold ${
                    data.isDelayedByDisruption ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {data.isDelayedByDisruption ? '+16.5h Delay' : 'On Schedule'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Live GPS:</span>
                <span className="font-mono text-cyan-400 text-[10px]">
                  {data.currentLocation?.lat?.toFixed(4)}, {data.currentLocation?.lng?.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. SHIPMENT INSPECTOR ================= */}
        {type === 'shipment' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  {data.shipmentId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    data.priority === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {data.priority?.toUpperCase()} PRIORITY
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {data.cargoDescription || 'Industrial Consignment'}
              </h3>
              <p className="text-[11px] text-gray-400">Order: {data.orderId || 'ORD-89211'}</p>
            </div>

            {/* Origin -> Destination Corridor */}
            <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642] space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-gray-200">Origin: {data.origin?.name || 'Chicago Mega-Hub'}</span>
              </div>
              <div className="border-l-2 border-dashed border-gray-600 ml-1.5 pl-3 py-1 text-gray-500 text-[10px]">
                Carrier: {data.carrierName || 'Apex Freight'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                <span className="text-gray-200">Dest: {data.destination?.name || 'New York Atlantic'}</span>
              </div>
            </div>

            {/* Driving Route Button */}
            {data.origin?.lat && data.destination?.lat && (
              <button
                type="button"
                onClick={() =>
                  handleRequestLiveRoute(
                    data.origin.lat,
                    data.origin.lng,
                    data.destination.lat,
                    data.destination.lng
                  )
                }
                disabled={isCalculatingRoute}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>
                  {isCalculatingRoute ? 'Calculating Live Route...' : 'Compute Driving Directions'}
                </span>
              </button>
            )}

            {/* Calculated Route Details */}
            {calculatedRoute && (
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>{calculatedRoute.provider}</span>
                  <span>{calculatedRoute.isRealDrivingRoute ? 'Live' : 'Baseline'}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Distance:</span>
                  <span className="font-mono font-bold text-white">{calculatedRoute.distanceText}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Duration:</span>
                  <span className="font-mono font-bold text-cyan-300">{calculatedRoute.durationText}</span>
                </div>
                {calculatedRoute.warnings && (
                  <p className="text-[10px] text-amber-400 pt-1">
                    {calculatedRoute.warnings[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= 4. DISRUPTION / INCIDENT INSPECTOR ================= */}
        {(type === 'disruption' || type === 'incident') && (
          <div className="space-y-3">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                {data.severity || 'CRITICAL'} ALERT
              </span>
              <h3 className="text-sm font-bold text-rose-300 mt-1">
                {data.title || 'I-80 Midwest Blizzard Warning & Highway Closure'}
              </h3>
              <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                {data.impact ||
                  'Heavy blizzard snowfall and multi-vehicle accident forced closure of I-80 commercial corridor.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Delay Impact:</span>
                <span className="font-mono font-bold text-rose-400">
                  +{data.duration || '16.5'} Hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Affected Consignments:</span>
                <span className="font-mono font-bold text-amber-300">
                  8 Shipments ($184k Value)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recommended Detour:</span>
                <span className="font-mono font-bold text-emerald-400">I-70 South Bypass</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/simulations')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Mitigation in Disruption Lab</span>
            </button>
          </div>
        )}

        {/* ================= 5. ROUTE CORRIDOR INSPECTOR ================= */}
        {type === 'route' && (
          <div className="space-y-3">
            <div>
              <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
                {data.roadCorridor} CORRIDOR
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">{data.name}</h3>
              <p className="text-[11px] text-gray-400">
                Type: {data.routeType?.toUpperCase() || 'PRIMARY INTERSTATE'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5">Length</span>
                <span className="text-base font-bold font-mono text-white">{data.distanceKm} km</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0F1428] border border-[#1E2642]">
                <span className="text-[10px] font-mono text-gray-400 block mb-0.5">Transit Time</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {data.durationHours || data.estimatedDurationHours || 14.5} hrs
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070A18] border border-[#19223A] text-[11px]">
              <span className="text-gray-400 block mb-1">Waypoints:</span>
              <p className="font-mono text-[10px] text-gray-300">
                {data.coordinates?.length || 0} GPS corridor anchors plotted on Google Maps
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Action */}
      <div className="p-3 bg-[#0A0D1E] border-t border-[#1E2642] space-y-2">
        <button
          type="button"
          onClick={handleLaunchIn3D}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Box className="w-4 h-4" />
          <span>Synchronize & View in Ultra 3D Universe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
