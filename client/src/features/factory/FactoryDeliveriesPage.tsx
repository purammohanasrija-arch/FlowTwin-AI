import React, { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import { useChocolateFactoryStore, ChocolateDelivery } from './chocolateFactoryStore.js';

export const FactoryDeliveriesPage: React.FC = () => {
  const deliveries = useChocolateFactoryStore(s => s.deliveries);
  const params = useChocolateFactoryStore(s => s.parameters);
  const advanceDeliveryStatus = useChocolateFactoryStore(s => s.advanceDeliveryStatus);
  const assignTruckToOrder = useChocolateFactoryStore(s => s.assignTruckToOrder);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState('TRK-CHOC-06');
  const [newOrderNumber, setNewOrderNumber] = useState(`ORD-CHOC-${Math.floor(8900 + Math.random() * 900)}`);
  const [newDestination, setNewDestination] = useState('Central Confectionery Hub, Bay 4');
  const [newBoxes, setNewBoxes] = useState(40);

  const isTruckDelay = activeProblem?.id === 'truck_delay';

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignTruckToOrder(selectedTruckId, newOrderNumber, newDestination, newBoxes);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Factory Deliveries & Dispatch Logistics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              REFRIGERATED FLEET DISPATCH
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Manage refrigerated delivery trucks dispatching fresh chocolate orders to retail stores and supermarkets. Monitor continuous en route trailer temperatures and advance delivery statuses.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Truck to Delivery</span>
        </button>
      </div>

      {/* Fleet KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 shadow-lg">
          <span className="text-[11px] text-gray-400 font-mono block">Available Fleet</span>
          <div className="text-xl font-bold font-mono text-white mt-0.5">
            {params.availableTrucks} Trucks
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Refrigerated Active</span>
        </div>

        <div className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 shadow-lg">
          <span className="text-[11px] text-gray-400 font-mono block">Active Consignments</span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
            {deliveries.length} Shipments
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {deliveries.reduce((acc, d) => acc + d.boxesCount, 0)} boxes in transit
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 shadow-lg">
          <span className="text-[11px] text-gray-400 font-mono block">Average Fleet Transit Delay</span>
          <div
            className={`text-xl font-bold font-mono mt-0.5 ${
              isTruckDelay ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {params.averageTruckDelayHours} hours
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {isTruckDelay ? 'Arterial highway traffic hold' : 'Normal smooth traffic'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#160D08] border border-amber-500/20 shadow-lg">
          <span className="text-[11px] text-gray-400 font-mono block">Trailer Cold Chain</span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
            17.7°C Avg
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Safe chocolate window</span>
        </div>
      </div>

      {/* Deliveries Table with Status Transition Controls */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
          <h2 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
            Active Chocolate Delivery Routes & Shipment States
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            Click 'Advance Status' to progress shipment life cycle
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] font-mono text-gray-400 border-b border-amber-500/15 uppercase">
              <tr>
                <th className="py-2.5 px-3">Truck ID</th>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Customer & Destination</th>
                <th className="py-2.5 px-3">Boxes Loaded</th>
                <th className="py-2.5 px-3">Shipment Status</th>
                <th className="py-2.5 px-3">ETA</th>
                <th className="py-2.5 px-3">Trailer Temp</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 font-sans">
              {deliveries.map(del => {
                const nextAction =
                  del.status === 'Ready for Loading'
                    ? 'Mark as Loaded'
                    : del.status === 'Loaded'
                    ? 'Dispatch to Transit'
                    : del.status === 'In Transit'
                    ? 'Confirm Delivered'
                    : 'Delivered';

                return (
                  <tr key={del.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      {del.truckId}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-300">{del.orderNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{del.customerName}</div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                        {del.destination}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="text-amber-200 font-bold">{del.boxesCount} boxes</span>
                      <span className="text-[10px] text-gray-400 block">
                        ({del.boxesCount * 24} bars)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold inline-block ${
                          del.status === 'In Transit'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse'
                            : del.status === 'Loaded'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : del.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}
                      >
                        {del.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-300">
                      {del.status === 'Delivered' ? (
                        <span className="text-emerald-400">Completed</span>
                      ) : (
                        <span>{del.etaMinutes} mins</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-300">
                      {del.temperatureCelsius.toFixed(1)}°C
                    </td>
                    <td className="py-3 px-3 text-right">
                      {del.status !== 'Delivered' ? (
                        <button
                          onClick={() => advanceDeliveryStatus(del.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all"
                        >
                          {nextAction} →
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-mono text-xs font-semibold flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Truck Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1E110A] border border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight">
                Assign Truck to Pending Delivery
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Select Delivery Truck
                </label>
                <select
                  value={selectedTruckId}
                  onChange={e => setSelectedTruckId(e.target.value)}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="TRK-CHOC-06">TRK-CHOC-06 (Refrigerated 5-Ton)</option>
                  <option value="TRK-CHOC-07">TRK-CHOC-07 (Refrigerated 8-Ton)</option>
                  <option value="TRK-CHOC-08">TRK-CHOC-08 (Electric Express Van)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={newOrderNumber}
                  onChange={e => setNewOrderNumber(e.target.value)}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Customer & Delivery Destination
                </label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Number of Display Boxes (24 bars per box)
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={newBoxes}
                  onChange={e => setNewBoxes(Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                >
                  Assign & Stage Truck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
