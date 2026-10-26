import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';

interface ChocolateProductionZoneProps {
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

export const ChocolateProductionZone: React.FC<ChocolateProductionZoneProps> = ({
  onSelectEntity,
  isSelected,
}) => {
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const params = useChocolateFactoryStore(s => s.parameters);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);

  const roasterRef = useRef<THREE.Mesh>(null);
  const mixerAgitatorRef = useRef<THREE.Group>(null);
  const coolingTunnelRef = useRef<THREE.Group>(null);

  // Animate rotating roaster drum and mixing agitator when running
  useFrame((_, delta) => {
    if (isRunning) {
      if (roasterRef.current) {
        roasterRef.current.rotation.z += delta * 1.5;
      }
      if (mixerAgitatorRef.current) {
        mixerAgitatorRef.current.rotation.y += delta * 2.2;
      }
    }
  });

  const isBreakdown = activeProblem?.id === 'machine_breakdown';

  const handleClickZone = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'production-zone',
      name: 'Chocolate Making & Tempering Area',
      type: 'Production Core',
      purpose: 'Roast cocoa nibs, refine liquor, conche for velvety texture, and temper chocolate to achieve Beta-V crystals.',
      status: isBreakdown ? 'Needs Attention (Tempering Failure)' : isRunning ? 'Running' : 'Paused',
      operatingValues: {
        'Capacity': `${params.productionCapacityBarsPerHour} bars/hour`,
        'Machine Efficiency': `${params.machineEfficiencyPct}%`,
        'Active Line': 'Line 1 (Continuous Tempering)',
        'Roaster Temp': '138°C',
        'Tempering Working Temp': '31.5°C',
      },
      description: 'The core processing heartbeat of ChocoFlow AI. High-precision thermal loops roast, grind, conche, and temper chocolate liquor into smooth liquid chocolate.',
    });
  };

  const handleClickRoaster = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'roaster-machine',
      name: 'Rotary Cocoa Bean Roaster (AeroRoast 400)',
      type: 'Thermal Processing Drum',
      purpose: 'Gently roast nibs with fluidized hot air to develop rich cocoa aromas and eliminate acidity.',
      status: isRunning ? 'Operating at 138°C' : 'Standby',
      operatingValues: {
        'Drum Temperature': '138.4°C',
        'Rotation Speed': '18 RPM',
        'Air Velocity': '4.2 m/s',
        'Batch Load': '250 kg/batch',
        'Roast Cycle Time': '28 minutes',
      },
      description: 'Fluidized drum roaster with infrared moisture monitoring. Releases floral and nutty flavor precursors.',
    });
  };

  const handleClickGrinderConche = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'conche-machine',
      name: '5-Roll Refiner & Long-Conche Tank',
      type: 'Refining & Micro-Aeration System',
      purpose: 'Crush cocoa particles down below 20 microns and conche for 14 hours to coat solids in velvety cocoa butter.',
      status: isRunning ? 'Running (Conching Cycle 7)' : 'Standby',
      operatingValues: {
        'Fineness Particle Size': '18 µm (Silky smooth)',
        'Conching Duration': '14.5 hours elapsed',
        'Shear Motor Load': '78%',
        'Tank Temp': '52.0°C',
      },
      description: 'Heavy roller mill followed by dual-shaft rotary conching blades that eliminate astringency and homogenize cocoa butter.',
    });
  };

  const handleClickTemperingMachine = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'tempering-machine',
      name: 'Continuous Multi-Stage Chocolate Temperer',
      type: 'Crystallization Reactor',
      purpose: 'Cycle liquid chocolate through precise cooling and warming stages to seed stable Beta-V cocoa butter crystals for crisp snap and glossy finish.',
      status: isBreakdown ? 'Needs Attention (Temp Alarm: 34.8°C)' : isRunning ? 'Optimal (31.5°C)' : 'Holding',
      operatingValues: {
        'Zone 1 (Melt)': '45.0°C',
        'Zone 2 (Seed Crystallize)': '27.2°C',
        'Zone 3 (Working Melt)': isBreakdown ? '34.8°C (Alarm!)' : '31.5°C',
        'Tempering Index (TI)': isBreakdown ? '1.8 (Sub-optimal)' : '5.4 (Ideal)',
        'Throughput': '650 kg/hour',
      },
      description: 'The most critical machine in chocolate making. If tempering fails, chocolate will melt too easily and develop unsightly grey fat bloom.',
    });
  };

  const handleClickMouldingConveyor = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'moulding-conveyor',
      name: 'Piston Depositor & Multi-Tier Cooling Tunnel',
      type: 'Moulding & Cooling Line',
      purpose: 'Deposit liquid tempered chocolate into polycarbonate bar moulds, vibrate to remove bubbles, and cool down to 14°C.',
      status: isRunning ? 'Depositing 800 bars/hr' : 'Paused',
      operatingValues: {
        'Depositor Speed': `${params.productionCapacityBarsPerHour} bars/hr`,
        'Cooling Zone 1': '16.0°C',
        'Cooling Zone 2': '13.5°C',
        'Transit Duration': '24 minutes',
        'Mould Vibration Freq': '42 Hz',
      },
      description: 'Automated depositing head pours exactly 100g of chocolate per mould. High-frequency vibrators eliminate air pockets before entry into cooling tunnel.',
    });
  };

  return (
    <group position={[-5, 0, -12]} onClick={handleClickZone}>
      {/* Zone Floor Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 14]} />
        <meshStandardMaterial
          color={isSelected ? '#5C2D15' : '#23140C'}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Floating Spatial Label */}
      <Html position={[0, 6.8, 0]} center distanceFactor={28}>
        <div className="pointer-events-none select-none px-3 py-1.5 rounded-lg bg-[#1E100A]/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isBreakdown ? 'bg-red-500 animate-ping' : isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase font-mono">
              Chocolate Production Area
            </span>
          </div>
          <div className="text-[9px] text-amber-100/80 font-mono mt-0.5">
            Status: {isBreakdown ? 'TEMPERING ALERT' : isRunning ? 'RUNNING (Beta-V Crystals)' : 'PAUSED'}
          </div>
        </div>
      </Html>

      {/* 1. ROTARY COCOA ROASTER (Horizontal rotating drum with heating glow) */}
      <group position={[-6, 0, -3]} onClick={handleClickRoaster}>
        {/* Support cradle */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[3.2, 2.4, 2.2]} />
          <meshStandardMaterial color="#382114" metalness={0.8} />
        </mesh>
        {/* Roasting Drum */}
        <mesh ref={roasterRef} position={[0, 2.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 3, 20]} />
          <meshStandardMaterial color="#78350F" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Warm thermal heating glow underneath drum */}
        <pointLight position={[0, 1.6, 0]} color="#F59E0B" intensity={1.2} distance={4} />
        {/* Exhaust flue */}
        <mesh position={[0, 4.4, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.8, 12]} />
          <meshStandardMaterial color="#6B7280" metalness={0.8} />
        </mesh>
        <Html position={[0, 3.8, 0]} center distanceFactor={22}>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
            Roaster 138°C
          </span>
        </Html>
      </group>

      {/* 2. REFINER & CONCHING TANK (Heavy industrial grinding vat) */}
      <group position={[-6, 0, 3]} onClick={handleClickGrinderConche}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[3.4, 3, 2.6]} />
          <meshStandardMaterial color="#4A2511" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Top open grate with warm chocolate liquor view */}
        <mesh position={[0, 3.02, 0]}>
          <boxGeometry args={[2.8, 0.05, 2.0]} />
          <meshStandardMaterial color="#27150C" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Gearbox head */}
        <mesh position={[0, 3.6, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 1.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.9} />
        </mesh>
        <Html position={[0, 3.9, 0]} center distanceFactor={22}>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
            Conche & Refiner
          </span>
        </Html>
      </group>

      {/* 3. CONTINUOUS TEMPERING MACHINE (Tall multi-stage column with digital display) */}
      <group position={[1.5, 0, -2.5]} onClick={handleClickTemperingMachine}>
        {/* Base Cabinet */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[2.4, 3.6, 2.2]} />
          <meshStandardMaterial
            color={isBreakdown ? '#7F1D1D' : '#374151'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Multi-tier cooling cylinder on top */}
        <mesh position={[0, 4.4, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 1.6, 20]} />
          <meshStandardMaterial
            color={isBreakdown ? '#B91C1C' : '#E5E7EB'}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        {/* Digital Temperature Gauge Screen */}
        <mesh position={[0, 2.6, 1.12]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color={isBreakdown ? '#EF4444' : '#10B981'} />
        </mesh>
        <Html position={[0, 2.6, 1.15]} center distanceFactor={18}>
          <div
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
              isBreakdown ? 'bg-red-950 text-red-200 border border-red-500 animate-pulse' : 'bg-emerald-950 text-emerald-200'
            }`}
          >
            {isBreakdown ? 'ERR: 34.8°C' : '31.5°C Beta-V'}
          </div>
        </Html>
      </group>

      {/* 4. LIQUID CHOCOLATE MIXING TANK with Agitator */}
      <group ref={mixerAgitatorRef} position={[1.5, 0, 3]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[1.3, 1.3, 3.6, 20]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Liquid chocolate pool inside */}
        <mesh position={[0, 3.4, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 20]} />
          <meshStandardMaterial color="#3B1C0E" roughness={0.15} metalness={0.2} />
        </mesh>
      </group>

      {/* 5. MOULDING & COOLING TUNNEL CONVEYOR */}
      <group ref={coolingTunnelRef} position={[7, 0, 0]} onClick={handleClickMouldingConveyor}>
        {/* Conveyor Bed */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3, 0.4, 11]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
        {/* Enclosed Insulated Cooling Tunnel Section */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[3.2, 2.0, 7]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Depositor Hopper over entrance */}
        <mesh position={[0, 3.4, -4.5]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[1.0, 1.4, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.7} />
        </mesh>
        <Html position={[0, 4.4, -4.5]} center distanceFactor={22}>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30">
            Depositor (800/h)
          </span>
        </Html>
        {/* Cool interior blue light leaking from tunnel ends */}
        <pointLight position={[0, 1.5, 0]} color="#38BDF8" intensity={0.9} distance={3} />
      </group>
    </group>
  );
};
