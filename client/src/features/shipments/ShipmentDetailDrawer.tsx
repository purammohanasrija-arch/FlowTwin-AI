import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Truck,
  FileText,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/authContext.js';
import { useNavigate } from 'react-router-dom';

interface ShipmentDetailDrawerProps {
  shipment: any | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const ShipmentDetailDrawer: React.FC<ShipmentDetailDrawerProps> = ({
  shipment,
  onClose,
  onRefresh,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (!shipment) return null;

  const canEdit = user?.role === 'Administrator' || user?.role === 'Logistics Manager' || user?.role === 'Operations Analyst';

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/shipments/${shipment.shipmentId}`, { status: newStatus });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'delayed': return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'exception': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'ready_for_dispatch': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'delivered': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default: return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-[#0E101B] border-l border-[#24283E] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#24283E] bg-[#121422] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white font-mono">{shipment.shipmentId}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getStatusColor(shipment.status)}`}>
              {shipment.status.replace('_', ' ').toUpperCase()}
            </span>
            {shipment.priority === 'critical' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CRITICAL SLA
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">PO: {shipment.customerReference} | Order: {shipment.orderId}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        {/* Risk Score Highlight */}
        <div className={`p-4 rounded-xl border ${shipment.riskScore >= 70 ? 'bg-rose-500/10 border-rose-500/30' : shipment.riskScore >= 40 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-300">Automated Risk Score</span>
            <span className={`text-base font-bold font-mono ${shipment.riskScore >= 70 ? 'text-rose-400' : shipment.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {shipment.riskScore} / 100
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${shipment.riskScore >= 70 ? 'bg-rose-500' : shipment.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${shipment.riskScore}%` }}
            />
          </div>
          {shipment.riskFactors && shipment.riskFactors.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-white/[0.08] space-y-1">
              {shipment.riskFactors.map((rf: string, i: number) => (
                <div key={i} className="flex items-center gap-1.5 text-gray-300">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{rf}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Route & Origin/Destination */}
        <div className="p-4 rounded-xl bg-[#141624] border border-[#24283E] space-y-3">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transit Routing</div>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="w-0.5 h-8 bg-gray-700" />
              <span className="w-3 h-3 rounded-full bg-purple-500" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="font-semibold text-white">{shipment.origin.name}</div>
                <div className="text-gray-400 text-[11px]">
                  Planned Pickup: {new Date(shipment.plannedPickup).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="font-semibold text-white">{shipment.destination.name}</div>
                <div className="text-gray-400 text-[11px]">
                  Delivery SLA: {new Date(shipment.plannedDelivery).toLocaleDateString()}
                  {shipment.delayHours > 0 && (
                    <span className="text-rose-400 font-semibold ml-2">(+{shipment.delayHours}h delay)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo & Carrier Specifications */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#141624] border border-[#24283E]">
            <div className="text-[10px] text-gray-400">Carrier</div>
            <div className="font-semibold text-white mt-0.5">{shipment.carrierName}</div>
            <div className="text-[10px] text-gray-400 mt-1">Vehicle: {shipment.vehicleId || 'Assigned'}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#141624] border border-[#24283E]">
            <div className="text-[10px] text-gray-400">Gross Weight</div>
            <div className="font-semibold text-white mt-0.5 font-mono">
              {shipment.weightKg?.toLocaleString()} kg
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {shipment.temperatureControlled ? '❄️ Cold-Chain (2-8°C)' : 'Standard Dry Freight'}
            </div>
          </div>
        </div>

        {/* Milestones Event History */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Milestone Chronology</div>
          <div className="space-y-2">
            {shipment.milestones?.map((m: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-[#141624] border border-white/[0.04] flex items-start gap-3">
                <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${m.status === 'alert' ? 'text-rose-400' : 'text-emerald-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{m.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-300 mt-0.5">{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Documents */}
        {shipment.documentReferences && shipment.documentReferences.length > 0 && (
          <div className="p-3 rounded-lg bg-[#141624] border border-[#24283E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-semibold text-white text-[11px]">Linked Documentation</div>
                <div className="text-[10px] text-gray-400">{shipment.documentReferences.join(', ')}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/app/documents');
              }}
              className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold hover:bg-purple-500/30 transition-colors"
            >
              Inspect Doc
            </button>
          </div>
        )}

        {/* Status Transition Control (Role-Gated) */}
        {canEdit && (
          <div className="p-4 rounded-xl bg-[#141624] border border-[#24283E] space-y-2.5">
            <div className="text-[11px] font-semibold text-gray-300">Update Operational Status:</div>
            <div className="grid grid-cols-2 gap-2">
              {['ready_for_dispatch', 'in_transit', 'delayed', 'delivered'].map(st => (
                <button
                  key={st}
                  disabled={isUpdating || shipment.status === st}
                  onClick={() => handleStatusUpdate(st)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                    shipment.status === st
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/[0.08] hover:bg-white/[0.08]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
