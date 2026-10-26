import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';

interface PackagingZoneProps {
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

export const PackagingZone: React.FC<PackagingZoneProps> = ({ onSelectEntity, isSelected }) => {
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const params = useChocolateFactoryStore(s => s.parameters);
  const totalProduced = useChocolateFactoryStore(s => s.totalBarsProducedToday);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const isPackagingShortage = activeProblem?.id === 'packaging_shortage';

  // Array of moving chocolate bar positions along the packaging conveyor
  const [barOffsets, setBarOffsets] = useState<number[]>([0, 1.8, 3.6, 5.4, 7.2, 9.0]);
  const barsGroupRef = useRef<THREE.Group>(null);
  const wrapperReelRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (isRunning && !isPackagingShortage) {
      if (wrapperReelRef.current) {
        wrapperReelRef.current.rotation.x += delta * 3;
      }
      setBarOffsets(prev =>
        prev.map(offset => {
          const next = offset + delta * 2.2;
          return next > 10.5 ? 0 : next;
        })
      );
    }
  });

  const handleClickZone = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'packaging-zone',
      name: 'High-Speed Packaging & Boxing Line',
      type: 'Packaging Automation',
      purpose: 'Enclose demoulded chocolate bars in protective hermetic foil and luxury retail display cartons.',
      status: isPackagingShortage ? 'Needs Attention (Low Foil Stock)' : isRunning ? 'Running' : 'Paused',
      operatingValues: {
        'Wrapping Speed': '650 bars/minute',
        'Foil Packaging Stock': `${params.packagingStockUnits.toLocaleString()} units`,
        'Bars Packed Today': `${totalProduced.toLocaleString()} bars`,
        'Cartons Finished': `${Math.floor(totalProduced / 24).toLocaleString()} boxes (24-ct)`,
        'Sealing Quality': '100% Hermetic Seal',
      },
      description: 'The packaging bay wraps solid chocolate in gold barrier foil to prevent oxidation and moisture transfer, followed by automated carton placement.',
    });
  };

  const handleClickConveyor = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'packaging-conveyor',
      name: 'High-Speed Chocolate Bar Infeed Conveyor',
      type: 'Sanitary Food Belt Conveyor',
      purpose: 'Transport solid tempered chocolate bars from demoulding table into the flow wrapper.',
      status: isRunning ? 'Active (Processing 11 bars/sec)' : 'Paused',
      operatingValues: {
        'Chocolates Being Processed': '11 bars/second (660 bars/min)',
        'Belt Velocity': '0.35 m/s',
        'Product Spacing': '150 mm center-to-center',
        'Bars Currently On Belt': '72 bars in active flight',
        'Bar Weight': '100.0g ± 0.5g',
      },
      description: 'FDA-approved blue polyurethane sanitary belt with optical bar orientation sensors and automated rejection diverter.',
    });
  };

  const handleClickWrappingMachine = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'wrapper-machine',
      name: 'Rotary Fin-Seal Flow Wrapper (ChocoPack 800)',
      type: 'Horizontal Form-Fill-Seal Machine',
      purpose: 'Fold and heat-seal barrier gold film around each chocolate bar at ultra-high speed.',
      status: isPackagingShortage ? 'Warning: Low Foil Inventory' : isRunning ? 'Optimal' : 'Standby',
      operatingValues: {
        'Foil Remaining': `${params.packagingStockUnits.toLocaleString()} wrappers`,
        'Heat Seal Jaw Temp': '118.0°C',
        'Film Feed Tension': '12.4 N',
        'Reject Diverter Status': 'Armed',
      },
      description: 'Continuous rotary heat-sealing jaws create airtight crimps at both ends of each chocolate bar.',
    });
  };

  const handleClickBoxingStation = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'boxing-machine',
      name: 'Robotic Pick-and-Place Case Packer',
      type: 'End-of-Line Secondary Packaging',
      purpose: 'Pick 24 wrapped chocolate bars and pack into branded luxury display boxes.',
      status: isRunning ? 'Packing 27 cases/min' : 'Paused',
      operatingValues: {
        'Boxes Packed Today': `${Math.floor(totalProduced / 24).toLocaleString()} boxes`,
        'Bars per Box': '24 bars',
        'Case Labeling': 'Barcoded with Lot Number',
        'Pallet Staging': 'Auto-transfer to Cold Storage',
      },
      description: 'Delta robot arm uses vacuum suction cups to gently pack bars into cartons without scratching foil embossing.',
    });
  };

  return (
    <group position={[14, 0, -12]} onClick={handleClickZone}>
      {/* Zone Floor Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 14]} />
        <meshStandardMaterial
          color={isSelected ? '#78350F' : '#26160E'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>

      {/* Floating Spatial Label */}
      <Html position={[0, 6.5, 0]} center distanceFactor={28}>
        <div className="pointer-events-none select-none px-3 py-1.5 rounded-lg bg-[#1E100A]/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isPackagingShortage ? 'bg-amber-400 animate-ping' : isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase font-mono">
              Packaging & Boxing Area
            </span>
          </div>
          <div className="text-[9px] text-amber-100/80 font-mono mt-0.5">
            Packed Today: {totalProduced.toLocaleString()} bars ({Math.floor(totalProduced / 24)} boxes)
          </div>
        </div>
      </Html>

      {/* 1. PACKAGING CONVEYOR with Moving Chocolate Bars */}
      <group position={[-4, 0, 0]} onClick={handleClickConveyor}>
        {/* Conveyor Bed */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.8, 0.35, 12]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} />
        </mesh>
        {/* Conveyor Side Rails */}
        <mesh position={[-0.95, 1.05, 0]}>
          <boxGeometry args={[0.08, 0.25, 12]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.8} />
        </mesh>
        <mesh position={[0.95, 1.05, 0]}>
          <boxGeometry args={[0.08, 0.25, 12]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.8} />
        </mesh>

        {/* Moving Chocolate Bars along the conveyor */}
        <group ref={barsGroupRef}>
          {barOffsets.map((zOffset, index) => {
            const zPos = -5.5 + zOffset;
            const isWrapped = zPos > 0; // Bars become wrapped in gold foil after midpoint
            return (
              <mesh key={index} position={[0, 1.05, zPos]} castShadow>
                <boxGeometry args={[0.8, 0.14, 1.4]} />
                <meshStandardMaterial
                  color={isWrapped ? '#F59E0B' : '#3B1C0E'} // Gold foil vs rich chocolate brown
                  roughness={isWrapped ? 0.2 : 0.4}
                  metalness={isWrapped ? 0.85 : 0.1}
                />
              </mesh>
            );
          })}
        </group>

        <Html position={[0, 2.2, 0]} center distanceFactor={20}>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40">
            Conveyor: 660 bars/min
          </span>
        </Html>
      </group>

      {/* 2. ROTARY WRAPPING MACHINE (ChocoPack Flow Wrapper) */}
      <group position={[-4, 0, 0]} onClick={handleClickWrappingMachine}>
        {/* Machine Arch Housing over the belt */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <boxGeometry args={[3.2, 2.4, 2.2]} />
          <meshStandardMaterial
            color={isPackagingShortage ? '#9A3412' : '#374151'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Gold Foil Roll Dispenser on top */}
        <mesh ref={wrapperReelRef} position={[0, 3.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 1.2, 18]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* 3. CASE PACKER / BOXING STATION */}
      <group position={[3.5, 0, -1]} onClick={handleClickBoxingStation}>
        {/* Packaging Table */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[4.2, 0.4, 4.2]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Delta Robot Arm Pillar */}
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 2.4, 12]} />
          <meshStandardMaterial color="#EAB308" metalness={0.6} />
        </mesh>
        {/* Robot Arm Crosshead */}
        <mesh position={[0, 3.6, 0]}>
          <boxGeometry args={[1.6, 0.2, 1.6]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>

        {/* Stack of Finished Luxury Chocolate Boxes */}
        {[0, 0.32, 0.64].map((y, i) => (
          <group key={i} position={[1.2, 1.35 + y, 1]}>
            <mesh castShadow>
              <boxGeometry args={[1.5, 0.3, 1.1]} />
              <meshStandardMaterial color="#92400E" roughness={0.6} />
            </mesh>
            {/* Box Gold Ribbon / Logo */}
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[1.52, 0.02, 0.2]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} />
            </mesh>
          </group>
        ))}

        <Html position={[1.2, 2.8, 1]} center distanceFactor={20}>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
            24-Bar Boxes
          </span>
        </Html>
      </group>
    </group>
  );
};
