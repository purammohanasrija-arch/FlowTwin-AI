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
              <span className="text-gray-400 block text-[10px]">FACILITY NAME</span>
              <p className="font-sans font-bold text-sm text-gray-100">{data.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div>
                <span className="text-gray-400 text-[10px]">UTILIZATION</span>
                <p className="text-sm font-bold text-amber-400">{data.utilizationPercentage}%</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">THROUGHPUT</span>
                <p className="text-sm font-bold text-cyan-300">{data.throughputPerHour} units/h</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">ACTIVE SHIPMENTS</span>
                <p className="text-sm font-bold text-gray-200">{data.activeShipmentCount}</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">STATUS</span>
                <p
                  className={`text-sm font-bold ${
                    data.status === 'optimal'
                      ? 'text-emerald-400'
                      : data.status === 'congested'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {data.status?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWarehouseCutaway(data.facilityCode || id);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold flex items-center justify-center gap-2 shadow-lg text-white cursor-pointer relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye className="w-4 h-4" />
                {warehouseCutaway.active && warehouseCutaway.facilityCode === (data.facilityCode || id)
                  ? 'Exit Cutaway View'
                  : 'Exploded Cutaway View'}
              </button>
            </div>
          </>
        )}

        {/* VEHICLE DETAILS */}
        {type === 'vehicle' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">CARRIER & MODEL</span>
              <p className="font-sans font-bold text-sm text-gray-100">{data.carrierName}</p>
              <p className="text-[11px] text-gray-400">
                Plate: {data.licensePlate} | Type: {data.vehicleModelType || data.type}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              <div>
                <span className="text-gray-400 text-[10px]">SPEED</span>
                <p className="text-sm font-bold text-cyan-300">{data.currentSpeedKmh || data.speedKmh} km/h</p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">LOAD WEIGHT</span>
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
                  {data.isDelayedByDisruption ? 'DELAYED (I-80)' : data.status?.toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">CORRIDOR</span>
                <p className="text-sm font-bold text-purple-300">
                  {data.assignedRouteCode || 'I-80'}
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
                  : 'Follow Vehicle Camera'}
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
                  Reroute to I-70 Bypass
                </button>
              )}
            </div>
          </>
        )}

        {/* ROUTE & CONNECTION DETAILS */}
        {type === 'route' && (
          <>
            <div>
              <span className="text-gray-400 block text-[10px]">CORRIDOR / CONNECTION</span>
              <p className="font-sans font-bold text-sm text-gray-100">{data.name || data.label || id}</p>
              {data.sourceName && data.targetName && (
                <p className="text-[11px] text-cyan-300 mt-0.5">
                  {data.sourceName} <ArrowRight className="w-3 h-3 inline mx-1 text-gray-400" /> {data.targetName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#12172E] border border-[#1E2648]">
              {data.distanceKm !== undefined ? (
                <div>
                  <span className="text-gray-400 text-[10px]">DISTANCE</span>
                  <p className="text-sm font-bold text-cyan-300">{data.distanceKm} km</p>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400 text-[10px]">LINK TYPE</span>
                  <p className="text-sm font-bold text-cyan-300">
                    {data.isDisrupted ? 'Hazard Alert' : data.isBypass ? 'Recovery Bypass' : 'Active Dispatch'}
                  </p>
                </div>
              )}
              {data.estimatedDurationHours !== undefined ? (
                <div>
                  <span className="text-gray-400 text-[10px]">EST. DURATION</span>
                  <p className="text-sm font-bold text-gray-200">{data.estimatedDurationHours} hours</p>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400 text-[10px]">TELEMETRY FLOW</span>
                  <p className="text-sm font-bold text-purple-300">Synchronized (Live)</p>
                </div>
              )}
              <div>
                <span className="text-gray-400 text-[10px]">STATUS</span>
                <p className={`text-sm font-bold ${data.isClosed || data.isDisrupted ? 'text-red-400' : 'text-emerald-400'}`}>
                  {data.isClosed ? 'ROADBLOCK CLOSED' : data.isDisrupted ? 'HAZARD IMPACT' : data.isBypass ? 'BYPASS ACTIVE' : 'OPTIMAL FLOW'}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-[10px]">CORRIDOR</span>
                <p className="text-sm font-bold text-purple-300">
                  {data.roadCorridor || (data.isBypass ? 'I-70 Bypass' : data.isDisrupted ? 'I-80 Alert' : 'Intermodal')}
                </p>
              </div>
            </div>
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
