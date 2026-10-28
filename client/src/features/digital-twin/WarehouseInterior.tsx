import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const WarehouseInterior: React.FC = () => {
  const warehouseCutaway = useDigitalTwinStore(s => s.warehouseCutaway);
  const facilities = useDigitalTwinStore(s => s.facilities);
  const cargoItems = useDigitalTwinStore(s => s.cargoItems);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectWarehouseSlot = useDigitalTwinStore(s => s.selectWarehouseSlot);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);

  const agv1Ref = useRef<THREE.Group>(null);
  const agv2Ref = useRef<THREE.Group>(null);
  const conveyorRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Group>(null);
  const agitator1Ref = useRef<THREE.Group>(null);
  const agitator2Ref = useRef<THREE.Group>(null);

  // ALWAYS call useFrame unconditionally to satisfy React Rules of Hooks
  useFrame((_, delta) => {
    if (!warehouseCutaway.active) {
      if (roofRef.current) {
        roofRef.current.position.y = 7.5;
      }
      return;
    }

    // Smoothly lift roof to 15.5 units
    if (roofRef.current) {
      roofRef.current.position.y = THREE.MathUtils.lerp(roofRef.current.position.y, 15.5, 0.08);
    }

    if (!isPlaying) return;
    const time = performance.now() * 0.001;

    // Rotate concher agitators
    if (agitator1Ref.current) {
      agitator1Ref.current.rotation.y += 0.05;
    }
    if (agitator2Ref.current) {
      agitator2Ref.current.rotation.y -= 0.04;
    }

    // AGV 1: Inbound lane patrol
    if (agv1Ref.current) {
      agv1Ref.current.position.x = Math.sin(time * 0.8) * 6;
      agv1Ref.current.rotation.y = Math.cos(time * 0.8) > 0 ? 0 : Math.PI;
    }

    // AGV 2: Outbound lane patrol
    if (agv2Ref.current) {
      agv2Ref.current.position.x = Math.cos(time * 0.6) * 5;
      agv2Ref.current.rotation.y = -Math.sin(time * 0.6) > 0 ? 0 : Math.PI;
    }

    // Conveyor package loop
    if (conveyorRef.current) {
      conveyorRef.current.children.forEach((child, idx) => {
        child.position.x = ((performance.now() * 0.002 + idx * 2.5) % 14) - 7;
      });
    }
  });

  if (!warehouseCutaway.active) return null;

  const facility =
    facilities.find(f => f.facilityCode === warehouseCutaway.facilityCode) || facilities[0];
  const pos = facility?.position3D || [0, 0, -18];

  return (
    <group position={pos} name="ChocolateFactoryInteriorCutaway">
      {/* Floating Interior Process Stage Banner */}
      <group position={[0, 16.5, 0]}>
        <Html center distanceFactor={45} zIndexRange={[20, 0]}>
          <div className="px-4 py-2 rounded-2xl bg-[#1C0E07]/95 border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-2xl text-center font-mono whitespace-nowrap pointer-events-none select-none">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="text-lg">🍫</span>
              <span className="text-xs font-extrabold text-amber-200 tracking-wider">
                {facility.chocolateFacilityName || facility.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                STAGE {facility.processStageNumber || 6}: {facility.processStageName || 'Conching & Refining'}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-300">
              <span>
                Temp: <b className="text-rose-400">{facility.temperatureCelsius || 72.4}°C</b>
              </span>
              <span>•</span>
              <span>
                Viscosity: <b className="text-amber-300">{(facility.viscosityCp || 3450).toLocaleString()} cP</b>
              </span>
              <span>•</span>
              <span>
                Tank Load: <b className="text-cyan-300">{facility.utilizationPercentage}%</b>
              </span>
              <span>•</span>
              <span>
                Air Hygiene: <b className="text-emerald-400">ISO-7 Cleanroom</b>
              </span>
            </div>
          </div>
        </Html>
      </group>

      {/* 1. Holographic Lifted / Exploded Roof (Animated Y: 7 -> 15.5) */}
      <group ref={roofRef} position={[0, 7.5, 0]}>
        <mesh>
          <boxGeometry args={[22, 0.4, 16]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
        {/* Roof Support Laser Beams */}
        {[-10, 10].map(x =>
          [-7, 7].map(z => (
            <mesh key={`${x}-${z}`} position={[x, -4, z]}>
              <cylinderGeometry args={[0.04, 0.04, 8, 4]} />
              <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* 2. Semi-Transparent Holographic Glass Walls */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[22, 7, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#78350F"
          emissiveIntensity={0.15}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Interior High-Grip Epoxy Floor */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[21.6, 15.6]} />
        <meshStandardMaterial color="#140C07" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Yellow Safety Markings for Chocolate AGV Carts */}
      {[-4, 4].map((zOffset, idx) => (
        <mesh key={idx} position={[0, 0.05, zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 0.6]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* 4. Conching Tank 1 & 2 (Rotating Agitators with Molten Chocolate Surface) */}
      <group position={[-5, 0, 4]}>
        {/* Stainless Steel Outer Vat */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 3.6, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Top Rim */}
        <mesh position={[0, 3.6, 0]}>
          <torusGeometry args={[2.2, 0.12, 12, 24]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} />
        </mesh>
        {/* Molten Chocolate Liquid Surface */}
        <mesh position={[0, 3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.1, 24]} />
          <meshStandardMaterial color="#2B1408" roughness={0.1} metalness={0.4} />
        </mesh>
        {/* Agitator Impeller Blades */}
        <group ref={agitator1Ref} position={[0, 3.3, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
          {[-1.2, 1.2].map((xOffset, idx) => (
            <mesh key={idx} position={[xOffset, -0.1, 0]}>
              <boxGeometry args={[1.2, 0.15, 0.35]} />
              <meshStandardMaterial color="#D97706" metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      <group position={[5, 0, 4]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 3.6, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.6, 0]}>
          <torusGeometry args={[2.2, 0.12, 12, 24]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.1, 24]} />
          <meshStandardMaterial color="#381A0B" roughness={0.1} metalness={0.4} />
        </mesh>
        <group ref={agitator2Ref} position={[0, 3.3, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
          {[-1.2, 1.2].map((xOffset, idx) => (
            <mesh key={idx} position={[xOffset, -0.1, 0]}>
              <boxGeometry args={[1.2, 0.15, 0.35]} />
              <meshStandardMaterial color="#D97706" metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 5. Continuous Chocolate Bar Mold Conveyor System */}
      <group position={[0, 1.2, 0]}>
        {/* Conveyor Bed */}
        <mesh>
          <boxGeometry args={[16, 0.25, 1.2]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Conveyor side rails */}
        <mesh position={[0, 0.25, -0.6]}>
          <boxGeometry args={[16, 0.25, 0.08]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0.6]}>
          <boxGeometry args={[16, 0.25, 0.08]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} />
        </mesh>

        {/* Animated Chocolate Bar Molds & Praline Boxes Moving on Conveyor */}
        <group ref={conveyorRef}>
          {[0, 1, 2, 3, 4, 5].map(idx => (
            <group key={idx} position={[0, 0.25, 0]}>
              {/* Mold Tray */}
              <mesh>
                <boxGeometry args={[1.0, 0.12, 0.7]} />
                <meshStandardMaterial color="#D97706" metalness={0.7} />
              </mesh>
              {/* Chocolate Bars inside Tray */}
              {[-0.25, 0.25].map((xOff, cIdx) => (
                <mesh key={cIdx} position={[xOff, 0.1, 0]}>
                  <boxGeometry args={[0.38, 0.08, 0.55]} />
                  <meshStandardMaterial color="#2B1408" roughness={0.2} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>

      {/* 6. AGV 1 (Autonomous Chocolate Mold Transport Cart) */}
      <group ref={agv1Ref} position={[0, 0.25, -4]}>
        <mesh>
          <boxGeometry args={[1.6, 0.4, 1.1]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} />
        </mesh>
        {/* Stack of chocolate bar trays */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.4} />
        </mesh>
        <pointLight color="#F59E0B" intensity={1.5} distance={4} />
      </group>

      {/* 7. AGV 2 */}
      <group ref={agv2Ref} position={[0, 0.25, 4]}>
        <mesh>
          <boxGeometry args={[1.6, 0.4, 1.1]} />
          <meshStandardMaterial color="#10B981" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#78350F" roughness={0.5} />
        </mesh>
      </group>

      {/* 8. Chocolate Vault Racks (Cocoa Butter Drums & Finished Bar Pallets) */}
      {[-6, -2, 2, 6].map((xOffset, aisleIdx) => (
        <group
          key={aisleIdx}
          position={[xOffset, 0, -2]}
          onClick={e => {
            e.stopPropagation();
            selectWarehouseSlot(aisleIdx + 1, `AISLE-${aisleIdx + 1}`);
          }}
        >
          {/* Steel Upright Posts */}
          {[-3.5, 0, 3.5].map((zOffset, zIdx) => (
            <group key={zIdx} position={[0, 3, zOffset]}>
              <mesh position={[-0.6, 0, 0]}>
                <boxGeometry args={[0.1, 6, 0.1]} />
                <meshStandardMaterial color="#3B82F6" metalness={0.9} />
              </mesh>
              <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[0.1, 6, 0.1]} />
                <meshStandardMaterial color="#3B82F6" metalness={0.9} />
              </mesh>
            </group>
          ))}

          {/* 3 Tiers of Horizontal Orange Load Beams */}
          {[1.5, 3.2, 4.9].map((yOffset, tierIdx) => (
            <group key={tierIdx} position={[0, yOffset, 0]}>
              <mesh position={[-0.6, 0, 0]}>
                <boxGeometry args={[0.08, 0.12, 7.2]} />
                <meshStandardMaterial color="#F97316" metalness={0.8} />
              </mesh>
              <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[0.08, 0.12, 7.2]} />
                <meshStandardMaterial color="#F97316" metalness={0.8} />
              </mesh>

              {/* Stored Pallets with Chocolate Couverture & Cocoa Butter */}
              {[-2.4, -0.8, 0.8, 2.4].map((zPos, slotIdx) => {
                const slotCode = `CHOC-RACK-A${aisleIdx + 1}-T${tierIdx + 1}-S${slotIdx + 1}`;
                const isSelectedSlot = warehouseCutaway.selectedShelfId === slotCode;
                const cargoMatch = cargoItems[slotIdx % cargoItems.length];

                const color =
                  aisleIdx === 0
                    ? '#EF4444' // Aisle 1 High-Density (92%)
                    : aisleIdx === 1
                    ? '#F59E0B' // Aisle 2 Amber (86%)
                    : aisleIdx === 2
                    ? '#10B981' // Aisle 3 Optimal (45%)
                    : '#00F5FF'; // Aisle 4 Specialty Couverture (70%)

                return (
                  <group
                    key={slotIdx}
                    position={[0, 0.45, zPos]}
                    onClick={e => {
                      e.stopPropagation();
                      selectWarehouseSlot(aisleIdx + 1, slotCode);
                      if (cargoMatch) {
                        selectEntity({
                          type: 'cargo',
                          id: cargoMatch.id,
                          data: { ...cargoMatch, shelfSlotId: slotCode },
                        });
                      }
                    }}
                  >
                    {/* Wooden Pallet Base */}
                    <mesh position={[0, -0.35, 0]}>
                      <boxGeometry args={[1.0, 0.1, 1.0]} />
                      <meshStandardMaterial color="#78350F" roughness={0.8} />
                    </mesh>

                    {/* Stored Chocolate Batch Box Unit */}
                    <mesh castShadow>
                      <boxGeometry args={[0.9, 0.7, 0.9]} />
                      <meshStandardMaterial
                        color={color}
                        roughness={0.3}
                        emissive={isSelectedSlot ? '#FFFFFF' : color}
                        emissiveIntensity={isSelectedSlot ? 0.6 : 0.1}
                      />
                    </mesh>
                  </group>
                );
              })}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};
