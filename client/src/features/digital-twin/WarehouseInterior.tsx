import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { CargoItem3D } from './types.js';

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
    <group position={pos} name="WarehouseInteriorCutaway">
      {/* 1. Holographic Lifted / Exploded Roof (Animated Y: 7 -> 15.5) */}
      <group ref={roofRef} position={[0, 7.5, 0]}>
        <mesh>
          <boxGeometry args={[22, 0.4, 16]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={0.4}
            transparent
            opacity={0.25}
            wireframe
          />
        </mesh>
        {/* Roof Support Laser Beams */}
        {[-10, 10].map(x =>
          [-7, 7].map(z => (
            <mesh key={`${x}-${z}`} position={[x, -4, z]}>
              <cylinderGeometry args={[0.04, 0.04, 8, 4]} />
              <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* 2. Semi-Transparent Holographic Glass Walls */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[22, 7, 16]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.15}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. Interior High-Grip Epoxy Floor with Safety Markings */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[21.6, 15.6]} />
        <meshStandardMaterial color="#0B0E1B" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Yellow Floor Navigation Paths for AGVs */}
      {[-4, 4].map((zOffset, idx) => (
        <mesh key={idx} position={[0, 0.05, zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 0.6]} />
          <meshBasicMaterial color="#FACC15" />
        </mesh>
      ))}

      {/* 4. Inbound Staging Bay (Yellow Striping) */}
      <group position={[-6.5, 0.06, 5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.3} />
        </mesh>
        {/* Staged Inbound Pallet Boxes */}
        {[-1.5, 0, 1.5].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0.5, 0]}>
            <boxGeometry args={[1.1, 0.9, 1.1]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 5. Outbound Staging Bay (Green Striping) */}
      <group position={[6.5, 0.06, 5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.3} />
        </mesh>
        {/* Staged Outbound Pallet Boxes */}
        {[-1.5, 0, 1.5].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0.5, 0]}>
            <boxGeometry args={[1.1, 0.9, 1.1]} />
            <meshStandardMaterial color="#10B981" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 6. Automated Roller Conveyor System */}
      <group position={[0, 1.2, 0]}>
        {/* Conveyor Bed */}
        <mesh>
          <boxGeometry args={[16, 0.2, 1.2]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        {/* Animated Packages Moving along Conveyor */}
        <group ref={conveyorRef}>
          {[0, 1, 2, 3, 4, 5].map(idx => (
            <mesh key={idx} position={[0, 0.35, 0]}>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
          ))}
        </group>
      </group>

      {/* 7. AGV 1 (Autonomous Mobile Robot) */}
      <group ref={agv1Ref} position={[0, 0.25, -4]}>
        <mesh>
          <boxGeometry args={[1.6, 0.4, 1.1]} />
          <meshStandardMaterial color="#00F5FF" metalness={0.8} />
        </mesh>
        {/* Pallet on AGV */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#EC4899" />
        </mesh>
        {/* Safety Warning Light */}
        <pointLight color="#00F5FF" intensity={1.5} distance={4} />
      </group>

      {/* 8. AGV 2 */}
      <group ref={agv2Ref} position={[0, 0.25, 4]}>
        <mesh>
          <boxGeometry args={[1.6, 0.4, 1.1]} />
          <meshStandardMaterial color="#A855F7" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
      </group>

      {/* 9. Heavy Industrial Pallet Racking Aisles (4 Aisles, 3 Tiers each) */}
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
              {/* Beams */}
              <mesh position={[-0.6, 0, 0]}>
                <boxGeometry args={[0.08, 0.12, 7.2]} />
                <meshStandardMaterial color="#F97316" metalness={0.8} />
              </mesh>
              <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[0.08, 0.12, 7.2]} />
                <meshStandardMaterial color="#F97316" metalness={0.8} />
              </mesh>

              {/* Stored Pallets with Colorful Consignments */}
              {[-2.4, -0.8, 0.8, 2.4].map((zPos, slotIdx) => {
                const slotCode = `RACK-A${aisleIdx + 1}-T${tierIdx + 1}-S${slotIdx + 1}`;
                const isSelectedSlot = warehouseCutaway.selectedShelfId === slotCode;
                const cargoMatch = cargoItems[slotIdx % cargoItems.length];

                const color =
                  aisleIdx === 0
                    ? '#EF4444' // Aisle 1 Congested (92%)
                    : aisleIdx === 1
                    ? '#F59E0B' // Aisle 2 Amber (86%)
                    : aisleIdx === 2
                    ? '#10B981' // Aisle 3 Healthy (45%)
                    : '#00F5FF'; // Aisle 4 High-Tech (70%)

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

                    {/* Stored Cargo Box Unit */}
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

      {/* 10. Aisle Utilization Heatmap Floor Banners */}
      {[
        { x: -6, aisle: 1, util: '92% CONGESTED', col: '#EF4444' },
        { x: -2, aisle: 2, util: '86% UTILIZED', col: '#F59E0B' },
        { x: 2, aisle: 3, util: '45% OPTIMAL', col: '#10B981' },
        { x: 6, aisle: 4, util: '70% ACTIVE', col: '#00F5FF' },
      ].map(b => (
        <group key={b.aisle} position={[b.x, 0.08, 2.8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 0.5]} />
            <meshBasicMaterial color={b.col} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
