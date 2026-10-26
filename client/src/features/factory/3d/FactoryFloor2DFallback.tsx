import React from 'react';
import {
  Package,
  Truck,
  Thermometer,
  Layers,
  ArrowRight,
  Flame,
  Boxes,
  Gauge,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';
import { SelectedFactoryEntity } from './MachineDetailsModal.js';

interface FactoryFloor2DFallbackProps {
  onSelectEntity: (entity: SelectedFactoryEntity) => void;
}

export const FactoryFloor2DFallback: React.FC<FactoryFloor2DFallbackProps> = ({ onSelectEntity }) => {
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const deliveries = useChocolateFactoryStore(s => s.deliveries);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  return (
    <div className="w-full bg-[#120B07] rounded-2xl border border-amber-500/25 p-6 space-y-6 shadow-2xl">
      {/* Blueprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-wide uppercase font-mono">
              2D Factory Floor Plan & Telemetry Blueprint
            </h2>
          </div>
          <p className="text-xs text-amber-200/70 mt-0.5">
            Interactive plant schematic showing all 5 manufacturing, storage, and dispatch sectors. Click any zone to inspect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
            Status: {isRunning ? 'Running (Continuous)' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Grid of the 5 Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Zone 1: Raw Materials (Col 1-4) */}
        <div
          onClick={() =>
            onSelectEntity({
              id: 'raw-materials-zone',
              name: 'Raw Material Intake & Storage Zone',
              type: 'Ingredient Storage',
              purpose: 'Store, meter, and quality-verify raw cocoa beans, sugar, and milk.',
              status: params.cocoaStockKg < 1500 ? 'Low Cocoa' : 'Optimal',
              operatingValues: {
                'Cocoa Stock': `${params.cocoaStockKg.toLocaleString()} kg`,
                'Sugar Stock': `${params.sugarStockKg.toLocaleString()} kg`,
                'Milk Stock': `${params.milkStockLitres.toLocaleString()} L`,
              },
              description: 'Houses single-origin organic cocoa beans in jute sacks and climate silos.',
            })
          }
          className="lg:col-span-4 p-5 rounded-xl bg-[#1C110A] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              1. Raw Material Storage
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
              Intake Bay
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Cocoa Beans</span>
                <span className="font-mono text-amber-300 font-bold">{params.cocoaStockKg} kg</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (params.cocoaStockKg / 5000) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Fine Sugar</span>
                <span className="font-mono text-amber-200 font-bold">{params.sugarStockKg} kg</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (params.sugarStockKg / 4000) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Dairy Milk</span>
                <span className="font-mono text-blue-200 font-bold">{params.milkStockLitres} L</span>
              </div>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (params.milkStockLitres / 3000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: Chocolate Making (Col 5-8) */}
        <div
          onClick={() =>
            onSelectEntity({
              id: 'production-zone',
              name: 'Chocolate Making & Tempering Area',
              type: 'Production Core',
              purpose: 'Roast cocoa, conche for velvety texture, and temper chocolate to Beta-V crystals.',
              status: activeProblem?.id === 'machine_breakdown' ? 'Needs Attention' : 'Running',
              operatingValues: {
                'Capacity': `${params.productionCapacityBarsPerHour} bars/hr`,
                'Efficiency': `${params.machineEfficiencyPct}%`,
                'Tempering Working Temp': '31.5°C',
              },
              description: 'Thermal loops and crystallization columns create glossy chocolate with clean snap.',
            })
          }
          className="lg:col-span-4 p-5 rounded-xl bg-[#1C110A] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              2. Chocolate Making
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
              Line 1 Active
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
              <span className="text-gray-300">Roasting Drum</span>
              <span className="font-mono text-amber-300 font-bold">138°C (Fluidized)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
              <span className="text-gray-300">Conching Tank</span>
              <span className="font-mono text-amber-300 font-bold">14 hrs / 18 µm</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
              <span className="text-gray-300">Tempering Reactor</span>
              <span
                className={`font-mono font-bold ${
                  activeProblem?.id === 'machine_breakdown' ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {activeProblem?.id === 'machine_breakdown' ? '34.8°C (ALARM)' : '31.5°C (Beta-V)'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 3: Packaging & Boxing (Col 9-12) */}
        <div
          onClick={() =>
            onSelectEntity({
              id: 'packaging-zone',
              name: 'Packaging & Boxing Area',
              type: 'Packaging Automation',
              purpose: 'Wrap chocolate bars in foil and pack into 24-count display cartons.',
              status: activeProblem?.id === 'packaging_shortage' ? 'Needs Attention' : 'Running',
              operatingValues: {
                'Speed': '650 bars/min',
                'Foil Stock': `${params.packagingStockUnits} units`,
                'Packed Today': `${results.estimatedProductionBars} bars`,
              },
              description: 'Flow wrapper wraps fresh bars before robot case packer fills boxes.',
            })
          }
          className="lg:col-span-4 p-5 rounded-xl bg-[#1C110A] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              3. Packaging Area
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
              650 bars/min
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded bg-black/30">
              <span className="text-gray-300">Foil Stock</span>
              <span className="font-mono text-amber-300 font-bold">{params.packagingStockUnits} wrappers</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-black/30">
              <span className="text-gray-300">Bars Packed Today</span>
              <span className="font-mono text-emerald-400 font-bold">{results.estimatedProductionBars} bars</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-black/30">
              <span className="text-gray-300">Display Boxes Staged</span>
              <span className="font-mono text-amber-200 font-bold">
                {Math.floor(results.estimatedProductionBars / 24)} boxes
              </span>
            </div>
          </div>
        </div>

        {/* Zone 4: Chocolate Warehouse (Col 1-6) */}
        <div
          onClick={() =>
            onSelectEntity({
              id: 'warehouse-zone',
              name: 'Climate-Controlled Chocolate Warehouse',
              type: 'Cold Storage Racks',
              purpose: 'Store finished chocolate at 16-19°C to protect texture and prevent bloom.',
              status: activeProblem?.id === 'warm_storage' ? 'High Temp Alarm' : 'Optimal',
              operatingValues: {
                'Room Temp': `${params.coldStorageTempCelsius}°C`,
                'Warehouse Stock': `${results.warehouseStockBars} bars`,
                'Pallets Stored': '38 pallets',
              },
              description: 'High-bay racking with automated inventory tracking and climate chillers.',
            })
          }
          className="lg:col-span-6 p-5 rounded-xl bg-[#1C110A] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Thermometer
                className={`w-4 h-4 ${
                  activeProblem?.id === 'warm_storage' ? 'text-red-400 animate-bounce' : 'text-blue-400'
                }`}
              />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                4. Chocolate Warehouse (Cold Storage)
              </span>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                activeProblem?.id === 'warm_storage'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              }`}
            >
              Temp: {params.coldStorageTempCelsius.toFixed(1)}°C
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
              <span className="text-gray-400 text-[11px]">Finished Chocolate Stock</span>
              <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">
                {results.warehouseStockBars.toLocaleString()} bars
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
              <span className="text-gray-400 text-[11px]">Wholesale Boxes</span>
              <div className="text-lg font-bold font-mono text-amber-200 mt-0.5">
                {Math.floor(results.warehouseStockBars / 24).toLocaleString()} boxes
              </div>
            </div>
          </div>
        </div>

        {/* Zone 5: Loading & Delivery Docks (Col 7-12) */}
        <div
          onClick={() =>
            onSelectEntity({
              id: 'delivery-zone',
              name: 'Loading Docks & Delivery Fleet',
              type: 'Outbound Logistics',
              purpose: 'Dispatch refrigerated delivery trucks with climate-safe chocolate shipments.',
              status: activeProblem?.id === 'truck_delay' ? 'Highway Delay' : 'Active Dispatch',
              operatingValues: {
                'Fleet Available': `${params.availableTrucks} trucks`,
                'Average Delay': `${params.averageTruckDelayHours} hours`,
                'Active Shipments': `${deliveries.length} loads`,
              },
              description: 'Refrigerated trucks maintain steady temperatures en route to retail stores.',
            })
          }
          className="lg:col-span-6 p-5 rounded-xl bg-[#1C110A] border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                5. Loading and Delivery Area
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
              Fleet: {params.availableTrucks} Trucks
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {deliveries.slice(0, 3).map(del => (
              <div
                key={del.id}
                className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5"
              >
                <div>
                  <span className="font-mono font-bold text-amber-200">{del.truckId}</span>
                  <span className="text-gray-400 text-[11px] ml-2 truncate max-w-[150px] inline-block align-bottom">
                    {del.customerName}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    del.status === 'In Transit'
                      ? 'bg-blue-500/20 text-blue-300'
                      : del.status === 'Loaded'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {del.status} ({del.temperatureCelsius.toFixed(1)}°C)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
