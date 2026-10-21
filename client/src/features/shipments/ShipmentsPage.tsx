import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Download,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { MOCK_SHIPMENTS } from '../../lib/mockApi.js';
import { useAuth } from '../../lib/authContext.js';
import { ShipmentDetailDrawer } from './ShipmentDetailDrawer.js';
import { useSearchParams } from 'react-router-dom';

export const ShipmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [shipments, setShipments] = useState<any[]>(MOCK_SHIPMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    shipmentId: `SH-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: `ORD-${Math.floor(50000 + Math.random() * 40000)}`,
    customerReference: `PO-REF-${Math.floor(1000 + Math.random() * 9000)}`,
    originName: 'Chicago Central Logistics Park',
    destinationName: 'New York Atlantic Gateway',
    carrierName: 'Apex Freight Dynamics',
    cargoDescription: 'Precision Industrial Electronics',
    weightKg: 14500,
    priority: 'medium',
  });

  const fetchShipments = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (carrierFilter !== 'all') params.append('carrier', carrierFilter);

    api.get<any>(`/shipments?${params.toString()}`)
      .then(res => {
        if (res && Array.isArray(res.shipments)) {
          setShipments(res.shipments);
        }
      })
      .catch(err => {
        console.error('Failed to load shipments:', err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchShipments();
  }, [search, statusFilter, carrierFilter]);

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/shipments', {
        shipmentId: newShipment.shipmentId,
        orderId: newShipment.orderId,
        customerReference: newShipment.customerReference,
        origin: { name: newShipment.originName, lat: 41.8781, lng: -87.6298, facilityId: 'FAC-CHI-01' },
        destination: { name: newShipment.destinationName, lat: 40.7128, lng: -74.0060, facilityId: 'FAC-NYC-02' },
        carrierId: 'CAR-APEX',
        carrierName: newShipment.carrierName,
        cargoDescription: newShipment.cargoDescription,
        weightKg: Number(newShipment.weightKg),
        priority: newShipment.priority,
        plannedPickup: new Date().toISOString(),
        plannedDelivery: new Date(Date.now() + 3600 * 1000 * 48).toISOString(),
      });
      setIsCreateModalOpen(false);
      fetchShipments();
    } catch (err: any) {
      alert(`Error creating shipment: ${err.message}`);
    }
  };

  const exportCSV = () => {
    const headers = ['Shipment ID,Order ID,Customer Ref,Origin,Destination,Carrier,Status,Weight (kg),Delay (hrs),Risk Score\n'];
    const rows = shipments.map(s =>
      `"${s.shipmentId}","${s.orderId}","${s.customerReference}","${s.origin.name}","${s.destination.name}","${s.carrierName}","${s.status}",${s.weightKg},${s.delayHours || 0},${s.riskScore}`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowTwin_Shipments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const canCreate = user?.role === 'Administrator' || user?.role === 'Logistics Manager';

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Shipment Registry & Telematics</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time milestone tracking, risk scoring, and SLA monitoring across monitored carrier networks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181B2B] hover:bg-[#20243A] text-gray-300 border border-[#24283E] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Shipment</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-[#121422] border border-[#24283E] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by ID, PO, customer, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0A0B12] border border-[#24283E] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0A0B12] border border-[#24283E] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="in_transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="exception">Exception</option>
            <option value="ready_for_dispatch">Ready for Dispatch</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Carrier filter */}
          <select
            value={carrierFilter}
            onChange={e => setCarrierFilter(e.target.value)}
            className="bg-[#0A0B12] border border-[#24283E] rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500/50"
          >
            <option value="all">All Carriers</option>
            <option value="Apex Freight Dynamics">Apex Freight</option>
            <option value="Titan Intermodal Logistics">Titan Intermodal</option>
            <option value="Nexus Global Haulers">Nexus Global</option>
            <option value="BlueSky Logistics Corp">BlueSky Logistics</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl bg-[#121422] border border-[#24283E] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E101B] border-b border-[#24283E] text-gray-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Origin & Destination</th>
                <th className="py-3 px-4">Carrier & Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk Index</th>
                <th className="py-3 px-4">Delivery SLA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2238]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span>Querying shipment registry...</span>
                    </div>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No shipments match the selected criteria.
                  </td>
                </tr>
              ) : (
                shipments.map(ship => (
                  <tr
                    key={ship._id}
                    onClick={() => setSelectedShipment(ship)}
                    className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                        {ship.shipmentId}
                      </div>
                      <div className="text-[10px] text-gray-400">{ship.customerReference}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{ship.origin.name}</div>
                      <div className="text-[10px] text-gray-400">→ {ship.destination.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-200">{ship.carrierName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{ship.vehicleId || 'Assigned'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                          ship.status === 'in_transit'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                            : ship.status === 'delayed'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                            : ship.status === 'exception'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : ship.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        }`}
                      >
                        {ship.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {ship.delayHours > 0 && (
                        <div className="text-[10px] text-rose-400 font-semibold font-mono mt-0.5">
                          +{ship.delayHours}h delay
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-xs ${
                            ship.riskScore >= 70
                              ? 'text-rose-400'
                              : ship.riskScore >= 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {ship.riskScore}
                        </span>
                        <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              ship.riskScore >= 70
                                ? 'bg-rose-500'
                                : ship.riskScore >= 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ship.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                      {new Date(ship.plannedDelivery).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 rounded bg-white/[0.04] group-hover:bg-purple-600/20 text-gray-300 group-hover:text-purple-300 border border-white/[0.06] text-[11px] font-semibold transition-colors">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Details Drawer */}
      <ShipmentDetailDrawer
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onRefresh={() => {
          fetchShipments();
          if (selectedShipment) {
            api.get<any>(`/shipments/${selectedShipment.shipmentId}`)
              .then(res => setSelectedShipment(res.shipment))
              .catch(() => {});
          }
        }}
      />

      {/* Create Shipment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#10121C] border border-[#24283E] rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Create New Consignment</h2>
            <form onSubmit={handleCreateShipment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Shipment ID</label>
                  <input
                    type="text"
                    value={newShipment.shipmentId}
                    onChange={e => setNewShipment({ ...newShipment, shipmentId: e.target.value })}
                    required
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Order Reference</label>
                  <input
                    type="text"
                    value={newShipment.orderId}
                    onChange={e => setNewShipment({ ...newShipment, orderId: e.target.value })}
                    required
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Origin Facility</label>
                  <input
                    type="text"
                    value={newShipment.originName}
                    onChange={e => setNewShipment({ ...newShipment, originName: e.target.value })}
                    required
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Destination Facility</label>
                  <input
                    type="text"
                    value={newShipment.destinationName}
                    onChange={e => setNewShipment({ ...newShipment, destinationName: e.target.value })}
                    required
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400">Cargo Description</label>
                <input
                  type="text"
                  value={newShipment.cargoDescription}
                  onChange={e => setNewShipment({ ...newShipment, cargoDescription: e.target.value })}
                  required
                  className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Carrier</label>
                  <select
                    value={newShipment.carrierName}
                    onChange={e => setNewShipment({ ...newShipment, carrierName: e.target.value })}
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  >
                    <option value="Apex Freight Dynamics">Apex Freight Dynamics</option>
                    <option value="Titan Intermodal Logistics">Titan Intermodal Logistics</option>
                    <option value="Nexus Global Haulers">Nexus Global Haulers</option>
                    <option value="BlueSky Logistics Corp">BlueSky Logistics Corp</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400">Weight (kg)</label>
                  <input
                    type="number"
                    value={newShipment.weightKg}
                    onChange={e => setNewShipment({ ...newShipment, weightKg: Number(e.target.value) })}
                    required
                    className="w-full mt-1 bg-[#161928] border border-[#24283E] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
