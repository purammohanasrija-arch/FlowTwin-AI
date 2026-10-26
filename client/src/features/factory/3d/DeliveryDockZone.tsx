import React from 'react';
import { Html } from '@react-three/drei';
import { useChocolateFactoryStore, ChocolateDelivery } from '../chocolateFactoryStore.js';

interface DeliveryDockZoneProps {
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

export const DeliveryDockZone: React.FC<DeliveryDockZoneProps> = ({ onSelectEntity, isSelected }) => {
  const deliveries = useChocolateFactoryStore(s => s.deliveries);
  const params = useChocolateFactoryStore(s => s.parameters);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const isTruckDelay = activeProblem?.id === 'truck_delay';

  const handleClickZone = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'delivery-zone',
      name: 'Loading Docks & Refrigerated Logistics Bay',
      type: 'Outbound Logistics',
      purpose: 'Stage finished chocolate shipments and dispatch multi-temperature refrigerated delivery trucks to retail stores.',
      status: isTruckDelay ? 'Needs Attention (Highway Transit Hold)' : 'Active Dispatch',
      operatingValues: {
        'Available Trucks': `${params.availableTrucks} trucks`,
        'Average Truck Delay': `${params.averageTruckDelayHours} hours`,
        'Active Deliveries': `${deliveries.length} consignments`,
        'Active Docks': 'Bay 1, Bay 2, Bay 3',
        'Dock Temperature': '16.5°C',
      },
      description: 'The loading docks interface cold storage with refrigerated transit fleet. Insulated inflatable dock seals prevent outdoor warmth from spoiling chocolate during loading.',
    });
  };

  const handleClickTruck = (del: ChocolateDelivery, e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: del.id,
      name: `Refrigerated Truck: ${del.truckId}`,
      type: 'Climate-Controlled Delivery Vehicle',
      purpose: `Deliver chocolate shipment for ${del.customerName} to ${del.destination}.`,
      status: del.status,
      operatingValues: {
        'Order Number': del.orderNumber,
        'Customer / Destination': `${del.customerName} (${del.destination})`,
        'Chocolate Consignment': del.chocolateType,
        'Boxes Loaded': `${del.boxesCount} boxes (${del.boxesCount * 24} bars)`,
        'Trailer Temperature': `${del.temperatureCelsius.toFixed(1)}°C (Refrigerated)`,
        'Estimated Transit ETA': del.status === 'Delivered' ? 'Completed' : `${del.etaMinutes} minutes`,
        'Driver Assigned': del.driverName,
      },
      description: 'Equipped with ThermoKing multi-temp refrigeration unit and continuous telematics IoT sensors transmitting temperature every 30 seconds.',
    });
  };

  return (
    <group position={[14, 0, 10]} onClick={handleClickZone}>
      {/* Zone Floor Pad (Asphalt / Concrete Loading Apron) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 14]} />
        <meshStandardMaterial
          color={isSelected ? '#5C2D15' : '#1E1E24'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Floating Spatial Label */}
      <Html position={[0, 6.8, 0]} center distanceFactor={28}>
        <div className="pointer-events-none select-none px-3.5 py-1.5 rounded-lg bg-[#1E100A]/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isTruckDelay ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase font-mono">
              Loading & Delivery Docks
            </span>
          </div>
          <div className="text-[9px] text-amber-100/80 font-mono mt-0.5">
            Fleet: {params.availableTrucks} Trucks • Delay: {params.averageTruckDelayHours}h
          </div>
        </div>
      </Html>

      {/* Loading Dock Building Wall with Roll-up Shutter Doors */}
      <group position={[0, 3, -6.8]}>
        <mesh receiveShadow>
          <boxGeometry args={[17.6, 6, 0.4]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Dock Bay Doors */}
        {[-5.5, 0, 5.5].map((x, idx) => (
          <group key={idx} position={[x, -0.6, 0.22]}>
            {/* Dark Door Frame */}
            <mesh>
              <boxGeometry args={[3.2, 4.2, 0.1]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            {/* Roll-up Rubber Curtain / Door */}
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[3.0, 4.0, 0.05]} />
              <meshStandardMaterial color="#64748B" roughness={0.8} />
            </mesh>
            {/* Dock Number Badge */}
            <Html position={[0, 2.4, 0.1]} center distanceFactor={18}>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                BAY 0{idx + 1}
              </span>
            </Html>
          </group>
        ))}
      </group>

      {/* 3 Refrigerated Delivery Trucks parked at bays */}
      {deliveries.slice(0, 3).map((del, i) => {
        const xPos = -5.5 + i * 5.5;
        const isTransit = del.status === 'In Transit';
        const zPos = isTransit ? 3.5 : -1.8;

        return (
          <group key={del.id} position={[xPos, 0, zPos]} onClick={e => handleClickTruck(del, e)}>
            {/* Truck Cabin (Front) */}
            <mesh position={[0, 1.2, 2.2]} castShadow>
              <boxGeometry args={[2.0, 2.0, 1.6]} />
              <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Windshield */}
            <mesh position={[0, 1.5, 3.01]}>
              <planeGeometry args={[1.7, 0.9]} />
              <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.9} />
            </mesh>

            {/* Refrigerated Box Trailer (White with Chocolate Decal) */}
            <mesh position={[0, 1.8, -0.6]} castShadow>
              <boxGeometry args={[2.3, 2.6, 4.2]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.2} />
            </mesh>

            {/* Chocolate Decal Stripe along side */}
            <mesh position={[1.16, 1.8, -0.6]}>
              <boxGeometry args={[0.02, 0.6, 3.8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>
            <mesh position={[-1.16, 1.8, -0.6]}>
              <boxGeometry args={[0.02, 0.6, 3.8]} />
              <meshStandardMaterial color="#78350F" />
            </mesh>

            {/* ThermoKing Refrigeration Unit on Front of Trailer */}
            <mesh position={[0, 2.8, 1.4]} castShadow>
              <boxGeometry args={[1.2, 0.7, 0.5]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>

            {/* Wheels */}
            {[-1.05, 1.05].map((wx, wi) =>
              [-1.8, 0, 2.2].map((wz, wj) => (
                <mesh key={`${wi}-${wj}`} position={[wx, 0.45, wz]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.42, 0.42, 0.3, 16]} />
                  <meshStandardMaterial color="#111827" roughness={0.9} />
                </mesh>
              ))
            )}

            {/* Floating Destination & Status Tag */}
            <Html position={[0, 3.8, 0]} center distanceFactor={22}>
              <div className="pointer-events-none select-none px-2 py-1 rounded bg-black/90 border border-amber-500/40 text-center shadow-lg backdrop-blur-sm min-w-[120px]">
                <div className="text-[9px] font-bold text-amber-300 font-mono">{del.truckId}</div>
                <div className="text-[8px] text-gray-300 truncate max-w-[110px]">{del.customerName}</div>
                <div
                  className={`text-[8px] font-bold font-mono mt-0.5 px-1 py-0.2 rounded inline-block ${
                    del.status === 'In Transit'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : del.status === 'Loaded'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {del.status} ({del.temperatureCelsius.toFixed(1)}°C)
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
