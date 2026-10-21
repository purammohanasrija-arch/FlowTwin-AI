import React from 'react';
import {
  X,
  Building2,
  Truck,
  Route as RouteIcon,
  AlertOctagon,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
  Navigation,
} from 'lucide-react';

interface SelectedEntityDrawerProps {
  entity: {
    type: 'facility' | 'vehicle' | 'route' | 'incident';
    data: any;
  } | null;
  onClose: () => void;
  onTriggerDisruption: (type: string, targetId: string) => void;
  onOpenRecoveryPlanner: () => void;
}

export const SelectedEntityDrawer: React.FC<SelectedEntityDrawerProps> = ({
  entity,
  onClose,
  onTriggerDisruption,
  onOpenRecoveryPlanner,
}) => {
  if (!entity) return null;

  const { type, data } = entity;

  return (
    <div className="w-80 bg-[#0B0D18]/95 backdrop-blur-xl border border-[#1E2238] rounded-2xl p-4 shadow-2xl flex flex-col gap-3 select-none text-white animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E2238]">
        <div className="flex items-center gap-2">
          {type === 'facility' && <Building2 className="w-4 h-4 text-purple-400" />}
          {type === 'vehicle' && <Truck className="w-4 h-4 text-cyan-400" />}
          {type === 'route' && <RouteIcon className="w-4 h-4 text-indigo-400" />}
          {type === 'incident' && <AlertOctagon className="w-4 h-4 text-red-400" />}

          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            {type} Inspector
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#1E2238] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* FACILITY BODY */}
      {type === 'facility' && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-bold text-sm text-white">{data.name}</h3>
            <p className="text-[11px] text-gray-400">
              {data.location?.city ? `${data.location.city}, ${data.location?.state}` : data.location?.name || 'Regional Hub'} • {data.type?.replace('_', ' ')}
            </p>
          </div>

          <div className="bg-[#121424] p-3 rounded-xl border border-[#1E2238] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Status:</span>
              <span
                className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                  data.status === 'disrupted'
                    ? 'bg-red-500/20 text-red-300'
                    : data.status === 'congested'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {data.status || 'optimal'}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Throughput Capacity:</span>
                <span className="font-bold text-gray-200">
                  {data.utilizationPercentage ?? data.currentUtilization ?? 72}% ({((data.totalCapacityUnits ?? data.capacityTeu ?? 15000)).toLocaleString()} units)
                </span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all ${
                    (data.utilizationPercentage ?? data.currentUtilization ?? 72) > 85
                      ? 'bg-red-500'
                      : (data.utilizationPercentage ?? data.currentUtilization ?? 72) > 70
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(data.utilizationPercentage ?? data.currentUtilization ?? 72, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onTriggerDisruption('warehouse_outage', data.facilityCode)}
            className="w-full py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate Facility Outage</span>
          </button>
        </div>
      )}

      {/* VEHICLE BODY */}
      {type === 'vehicle' && (
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">{data.vehicleCode}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30">
                {data.type}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Assigned Corridor: <span className="text-white font-medium">{data.assignedRoute?.roadCorridor || 'I-80 Interstate'}</span>
            </p>
          </div>

          <div className="bg-[#121424] p-3 rounded-xl border border-[#1E2238] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Payload Limit:</span>
              <span className="font-bold text-gray-200">
                {(((data.maxWeightKg ?? data.capacityWeightKg ?? 24000)) / 1000).toFixed(1)} Metric Tons
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Operating Status:</span>
              <span className="font-semibold text-emerald-400 uppercase text-[10px]">
                {data.status?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={() => onTriggerDisruption('vehicle_breakdown', data.vehicleCode)}
            className="w-full py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Vehicle Breakdown</span>
          </button>
        </div>
      )}

      {/* ROUTE BODY */}
      {type === 'route' && (
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-bold text-sm text-white">{data.name}</h3>
            <p className="text-[11px] text-purple-300 font-medium">
              Corridor: {data.roadCorridor} • Type: {data.routeType?.toUpperCase()}
            </p>
          </div>

          <div className="bg-[#121424] p-3 rounded-xl border border-[#1E2238] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Route Distance:</span>
              <span className="font-bold text-gray-200">{data.distanceKm} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Transit Duration:</span>
              <span className="font-bold text-gray-200">{data.durationHours} hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Operational State:</span>
              <span
                className={`font-semibold text-[10px] px-1.5 py-0.5 rounded uppercase ${
                  data.isClosed
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {data.isClosed ? 'BLOCKED' : 'CLEAR'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onTriggerDisruption('road_closure', data.roadCorridor)}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Road Closure</span>
          </button>
        </div>
      )}

      {/* INCIDENT BODY */}
      {type === 'incident' && (
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-red-300">{data.title}</h3>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/30 text-red-200">
                {data.severity}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {data.location?.description}
            </p>
          </div>

          <div className="bg-[#180A0A] p-3 rounded-xl border border-red-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Closure Duration:</span>
              <span className="font-bold text-white">{data.expectedDurationHours} Hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Estimated Delay:</span>
              <span className="font-bold text-red-400">+{data.delayImpactHours} Hours</span>
            </div>
          </div>

          <button
            onClick={onOpenRecoveryPlanner}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Review AI Recovery Plan</span>
          </button>
        </div>
      )}
    </div>
  );
};
