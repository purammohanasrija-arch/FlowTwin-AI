import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const RiskVisualization: React.FC = () => {
  const facilities = useDigitalTwinStore(s => s.facilities);
  const layers = useDigitalTwinStore(s => s.layers);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);

  const scanRingsRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!isPlaying) return;
    const time = performance.now() * 0.001;

    // Animate energy scan rings on capacity towers
    if (scanRingsRef.current) {
      scanRingsRef.current.children.forEach((ringMesh, idx) => {
        const fac = facilities[idx % facilities.length];
        const utilPct = fac?.utilizationPercentage || 65;
        const towerHeight = (utilPct / 100) * 12 + 2;
        // Periodic vertical scan
        const cycle = (time * 1.2 + idx * 0.4) % 1.0;
        ringMesh.position.y = 3.5 + cycle * towerHeight;
      });
    }

    // Animate heatmap concentric wave ripples
    if (rippleRef.current) {
      rippleRef.current.children.forEach((child, idx) => {
        const phase = (time * 0.8 + idx * 0.3) % 1.0;
        const scale = 1.0 + phase * 0.8;
        child.scale.set(scale, scale, 1);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = (1.0 - phase) * 0.4;
        }
      });
    }
  });

  return (
    <group name="RiskVisualization">
      {/* 1. HOLOGRAPHIC 3D CAPACITY UTILIZATION TOWERS */}
      {layers.capacity_towers && (
        <group name="CapacityTowersGroup">
          {facilities.map(facility => {
            const utilPct = facility.utilizationPercentage || 65;
            const towerHeight = (utilPct / 100) * 12 + 2; // 2 to 14 units
            const isSelected =
              selectedEntity?.type === 'facility' &&
              selectedEntity.id === facility.facilityCode;

            const color =
              utilPct >= 85 ? '#EF4444' : utilPct >= 72 ? '#F59E0B' : '#10B981';

            return (
              <group
                key={facility.facilityCode}
                position={[facility.position3D[0], 0, facility.position3D[2]]}
                onClick={e => {
                  e.stopPropagation();
                  selectEntity({
                    type: 'facility',
                    id: facility.facilityCode,
                    data: facility,
                  });
                }}
              >
                {/* Hexagonal Vertical Capacity Column */}
                <mesh position={[0, towerHeight / 2 + 3.5, 0]}>
                  <cylinderGeometry args={[1.2, 1.4, towerHeight, 6]} />
                  <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isSelected ? 0.8 : 0.35}
                    transparent
                    opacity={isSelected ? 0.75 : 0.45}
                    roughness={0.2}
                    wireframe={isSelected}
                  />
                </mesh>

                {/* Tower Top Halo Cap */}
                <mesh position={[0, towerHeight + 3.6, 0]}>
                  <cylinderGeometry args={[1.3, 1.3, 0.25, 6]} />
                  <meshBasicMaterial color={color} />
                </mesh>

                {/* 3D Floating Utilization Pill Label */}
                <group position={[0, towerHeight + 5.0, 0]}>
                  <Html
                    center
                    distanceFactor={50}
                    zIndexRange={[5, 0]}
                    className="pointer-events-none select-none"
                  >
                    <div
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold border backdrop-blur-xl whitespace-nowrap transition-transform shadow-lg ${
                        isSelected ? 'scale-125 shadow-amber-500/50' : ''
                      }`}
                      style={{
                        backgroundColor: `${color}25`,
                        borderColor: color,
                        color: color,
                      }}
                    >
                      {utilPct}% TANK LOAD
                    </div>
                  </Html>
                </group>

                {/* Base Glow Ring on Ground */}
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.8, 2.3, 6]} />
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            );
          })}

          {/* Animated Energy Scan Rings across towers */}
          <group ref={scanRingsRef}>
            {facilities.map(facility => {
              const utilPct = facility.utilizationPercentage || 65;
              const color =
                utilPct >= 85 ? '#EF4444' : utilPct >= 72 ? '#F59E0B' : '#10B981';
              return (
                <mesh
                  key={`scan-${facility.facilityCode}`}
                  position={[facility.position3D[0], 4, facility.position3D[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <ringGeometry args={[1.35, 1.6, 16]} />
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.85}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      )}

      {/* 2. SPATIAL GROUND RISK HEATMAP WITH ANIMATED CONCENTRIC WAVES */}
      {layers.risk_heatmap && (
        <group position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* I-80 Blizzard Incident Heatmap Base */}
          <mesh position={[4, -2, 0]}>
            <circleGeometry args={[13, 32]} />
            <meshBasicMaterial
              color="#EF4444"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Chicago Central Congestion Heatmap Base */}
          <mesh position={[0, -18, 0]}>
            <circleGeometry args={[11, 32]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Pacific Port High-Volume Heatmap Base */}
          <mesh position={[-46, 10, 0]}>
            <circleGeometry args={[12, 32]} />
            <meshBasicMaterial
              color="#00F5FF"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Animated concentric radar ripple rings */}
          <group ref={rippleRef}>
            {/* Blizzard ripples */}
            <mesh position={[4, -2, 0.01]}>
              <ringGeometry args={[10, 11, 32]} />
              <meshBasicMaterial
                color="#EF4444"
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[4, -2, 0.01]}>
              <ringGeometry args={[13, 14, 32]} />
              <meshBasicMaterial
                color="#EF4444"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Chicago ripples */}
            <mesh position={[0, -18, 0.01]}>
              <ringGeometry args={[8, 9, 32]} />
              <meshBasicMaterial
                color="#F59E0B"
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

export default RiskVisualization;
