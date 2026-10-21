import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { CargoItem3D } from './types.js';

export const CargoVisualization: React.FC = () => {
  const cargoItems = useDigitalTwinStore(s => s.cargoItems);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const scanLaserRef = useRef<THREE.Mesh>(null);

  // Animated laser scan plane that sweeps vertically
  useFrame(() => {
    if (scanLaserRef.current) {
      const time = performance.now() * 0.003;
      scanLaserRef.current.position.y = 0.8 + Math.sin(time) * 0.7;
    }
  });

  // Position cargo near origin facilities or along vehicle routes
  return (
    <group name="CargoVisualization">
      {cargoItems.map((cargo, idx) => {
        const isSelected =
          selectedEntity?.type === 'cargo' && selectedEntity.id === cargo.id;

        // Position cargo near Chicago Central staging area or Port
        const basePos: [number, number, number] =
          idx === 0
            ? [-4.5, 0.45, -12]
            : idx === 1
            ? [-2.5, 0.45, -12]
            : idx === 2
            ? [-0.5, 0.45, -12]
            : idx === 3
            ? [-44, 0.45, 4]
            : [10, 0.45, 0];

        return (
          <group
            key={cargo.id}
            position={basePos}
            onClick={e => {
              e.stopPropagation();
              selectEntity({
                type: 'cargo',
                id: cargo.id,
                data: cargo,
              });
            }}
          >
            {/* 3D Cargo Unit Object */}
            {cargo.cargoType === 'container_40ft' ? (
              <mesh castShadow>
                <boxGeometry args={[1.6, 1.4, 3.8]} />
                <meshStandardMaterial
                  color="#2563EB"
                  roughness={0.4}
                  metalness={0.6}
                  emissive={isSelected ? '#00F5FF' : '#000000'}
                  emissiveIntensity={isSelected ? 0.4 : 0}
                />
              </mesh>
            ) : cargo.cargoType === 'reefer_crate' ? (
              <mesh castShadow>
                <boxGeometry args={[1.4, 1.3, 2.2]} />
                <meshStandardMaterial
                  color="#0284C7"
                  roughness={0.3}
                  metalness={0.7}
                  emissive={isSelected ? '#00F5FF' : '#002B4D'}
                  emissiveIntensity={0.3}
                />
              </mesh>
            ) : (
              <group>
                {/* Wooden Pallet */}
                <mesh position={[0, -0.35, 0]}>
                  <boxGeometry args={[1.2, 0.12, 1.2]} />
                  <meshStandardMaterial color="#78350F" />
                </mesh>
                {/* Stretch-wrapped box pallet */}
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[1.05, 0.9, 1.05]} />
                  <meshStandardMaterial
                    color={cargo.priority === 'critical' ? '#EF4444' : '#10B981'}
                    roughness={0.4}
                  />
                </mesh>
              </group>
            )}

            {/* Laser Scanner Slicing Plane when selected */}
            {isSelected && (
              <group>
                <mesh ref={scanLaserRef} position={[0, 0.8, 0]}>
                  <planeGeometry args={[2.4, 2.4]} />
                  <meshBasicMaterial
                    color="#00F5FF"
                    transparent
                    opacity={0.45}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
                {/* Selection Ring */}
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.4, 1.6, 16]} />
                  <meshBasicMaterial color="#00F5FF" side={THREE.DoubleSide} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};
