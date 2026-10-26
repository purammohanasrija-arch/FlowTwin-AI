import React from 'react';
import { Html } from '@react-three/drei';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';

interface WarehouseStorageZoneProps {
  onSelectEntity: (entity: {
    id: string;
    name: string;
    type: string;
    purpose: string;
    status: string;
    operatingValues: Record<string, string | number>;
    description: string;
  }) => void;
  isSelected: boolean;
}

export const WarehouseStorageZone: React.FC<WarehouseStorageZoneProps> = ({
  onSelectEntity,
  isSelected,
}) => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const isWarmStorage = activeProblem?.id === 'warm_storage';
  const temp = params.coldStorageTempCelsius;

  const handleClickZone = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'warehouse-zone',
      name: 'Climate-Controlled Chocolate Cold Storage',
      type: 'Cold Chain Warehouse',
      purpose: 'Preserve finished chocolate bars and gift boxes at optimal 16-19°C with low humidity to eliminate fat bloom.',
      status: isWarmStorage ? 'Critical Alarm (High Temperature!)' : 'Optimal Climate',
      operatingValues: {
        'Storage Temperature': `${temp.toFixed(1)}°C ${isWarmStorage ? '(HIGH RISK)' : '(Normal)'}`,
        'Relative Humidity': '48% RH (Safe < 55%)',
        'Finished Chocolate Inventory': `${results.warehouseStockBars.toLocaleString()} bars`,
        'Total Display Boxes': `${Math.floor(results.warehouseStockBars / 24).toLocaleString()} boxes`,
        'Active Pallets Stored': '38 high-bay pallets',
        'HVAC Compressor Status': isWarmStorage ? 'Chiller 2 Tripped' : 'Dual Chillers Active',
      },
      description: 'The cold storage warehouse protects chocolate crystal structure. If the room rises above 22°C, cocoa butter melts and creates whitish fat bloom on the chocolate surface.',
    });
  };

  const handleClickRack = (rackName: string, recipe: string, count: number, e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: `rack-${rackName}`,
      name: `High-Bay Storage Rack: ${rackName}`,
      type: 'Industrial Pallet Racking',
      purpose: `Store and organize palletized cases of ${recipe}.`,
      status: isWarmStorage ? 'Temperature Warning' : 'Organized',
      operatingValues: {
        'Chocolate Variety': recipe,
        'Stock on Rack': `${count.toLocaleString()} bars`,
        'Pallet Slots': '12 / 12 slots occupied',
        'Batch Codes': 'BATCH-082, BATCH-083, BATCH-084',
        'Expiration Window': '12 Months (Pristine)',
      },
      description: 'Heavy duty steel racking with seismic cross-bracing and automated bar code tracking for first-in, first-out (FIFO) logistics dispatch.',
    });
  };

  return (
    <group position={[-16, 0, 10]} onClick={handleClickZone}>
      {/* Zone Floor Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 14]} />
        <meshStandardMaterial
          color={isSelected ? '#5C2D15' : '#1C120C'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>

      {/* Floating Spatial Label with Real-Time Temperature Display */}
      <Html position={[0, 7.2, 0]} center distanceFactor={28}>
        <div
          className={`pointer-events-none select-none px-3.5 py-2 rounded-xl backdrop-blur-md border shadow-2xl flex flex-col items-center ${
            isWarmStorage
              ? 'bg-red-950/95 border-red-500/70 text-red-200'
              : 'bg-[#1E100A]/90 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isWarmStorage ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-bold tracking-wider uppercase font-mono">
              Chocolate Cold Storage
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono mt-1 font-semibold">
            <span
              className={`px-2 py-0.5 rounded ${
                isWarmStorage ? 'bg-red-900 text-red-100 font-bold' : 'bg-amber-950/80 text-amber-300'
              }`}
            >
              Temp: {temp.toFixed(1)}°C
            </span>
            <span>•</span>
            <span>Stock: {results.warehouseStockBars.toLocaleString()} bars</span>
          </div>
        </div>
      </Html>

      {/* High-Bay Pallet Rack 1: Dark 70% Single Origin */}
      <group position={[-5, 0, 0]} onClick={e => handleClickRack('Rack A1', '70% Ecuadorian Dark Chocolate', 4800, e)}>
        {/* Steel Uprights */}
        {[-2.2, 2.2].map((x, i) =>
          [-1.5, 1.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 3, z]}>
              <boxGeometry args={[0.15, 6, 0.15]} />
              <meshStandardMaterial color="#0284C7" metalness={0.8} />
            </mesh>
          ))
        )}
        {/* Horizontal Orange Shelves */}
        {[1.2, 3.0, 4.8].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[4.6, 0.15, 3.2]} />
              <meshStandardMaterial color="#EA580C" metalness={0.7} />
            </mesh>
            {/* Chocolate Box Pallets on Shelf */}
            {[-1.2, 1.2].map((bx, bidx) => (
              <mesh key={bidx} position={[bx, 0.6, 0]} castShadow>
                <boxGeometry args={[1.8, 1.0, 2.4]} />
                <meshStandardMaterial color="#78350F" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* High-Bay Pallet Rack 2: Velvet Milk Chocolate */}
      <group position={[4, 0, 0]} onClick={e => handleClickRack('Rack B1', 'Alpine Velvet Milk Chocolate', 5600, e)}>
        {[-2.2, 2.2].map((x, i) =>
          [-1.5, 1.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 3, z]}>
              <boxGeometry args={[0.15, 6, 0.15]} />
              <meshStandardMaterial color="#0284C7" metalness={0.8} />
            </mesh>
          ))
        )}
        {[1.2, 3.0, 4.8].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[4.6, 0.15, 3.2]} />
              <meshStandardMaterial color="#EA580C" metalness={0.7} />
            </mesh>
            {[-1.2, 1.2].map((bx, bidx) => (
              <mesh key={bidx} position={[bx, 0.6, 0]} castShadow>
                <boxGeometry args={[1.8, 1.0, 2.4]} />
                <meshStandardMaterial color="#92400E" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Cold Storage HVAC Air Chiller Unit on Ceiling/Wall */}
      <group position={[0, 5.5, -6]}>
        <mesh castShadow>
          <boxGeometry args={[4.0, 1.4, 1.2]} />
          <meshStandardMaterial
            color={isWarmStorage ? '#7F1D1D' : '#334155'}
            metalness={0.7}
          />
        </mesh>
        {/* Chiller Cool Air Glow */}
        <pointLight
          position={[0, -0.8, 0]}
          color={isWarmStorage ? '#EF4444' : '#38BDF8'}
          intensity={isWarmStorage ? 1.5 : 1.0}
          distance={5}
        />
      </group>
    </group>
  );
};
