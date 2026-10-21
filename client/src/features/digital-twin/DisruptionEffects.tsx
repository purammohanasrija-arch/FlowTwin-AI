import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { IncidentRecord3D } from './types.js';

export const DisruptionEffects: React.FC = () => {
  const incidents = useDigitalTwinStore(s => s.incidents);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);

  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const vortexRef = useRef<THREE.Mesh>(null);

  // Shockwave expansion animation
  useFrame(() => {
    const time = performance.now() * 0.002;

    if (ring1Ref.current) {
      const scale1 = ((time * 3) % 12) + 0.5;
      ring1Ref.current.scale.set(scale1, scale1, 1);
      const mat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - scale1 / 12);
    }

    if (ring2Ref.current) {
      const scale2 = (((time * 3) + 4) % 12) + 0.5;
      ring2Ref.current.scale.set(scale2, scale2, 1);
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - scale2 / 12);
    }

    if (ring3Ref.current) {
      const scale3 = (((time * 3) + 8) % 12) + 0.5;
      ring3Ref.current.scale.set(scale3, scale3, 1);
      const mat = ring3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - scale3 / 12);
    }

    if (vortexRef.current) {
      vortexRef.current.rotation.y += 0.02;
    }
  });

  if (!isDisruptionActive || incidents.length === 0) return null;

  return (
    <group name="DisruptionEffects">
      {incidents.map(incident => {
        const isSelected =
          selectedEntity?.type === 'incident' && selectedEntity.id === incident.incidentCode;
        const pos = incident.location.position3D;

        return (
          <group
            key={incident.incidentCode}
            position={pos}
            onClick={e => {
              e.stopPropagation();
              selectEntity({
                type: 'incident',
                id: incident.incidentCode,
                data: incident,
              });
            }}
          >
            {/* 1. Expanding Shockwave Ground Rings */}
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
              <mesh ref={ring1Ref}>
                <ringGeometry args={[0.9, 1.15, 32]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh ref={ring2Ref}>
                <ringGeometry args={[0.9, 1.15, 32]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh ref={ring3Ref}>
                <ringGeometry args={[0.9, 1.15, 32]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>

            {/* 2. Swirling Weather / Blizzard Vortex Dome */}
            {incident.type === 'severe_weather' && (
              <mesh ref={vortexRef} position={[0, 4, 0]}>
                <sphereGeometry args={[9, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  emissive="#0284C7"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.18}
                  wireframe
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* 3. Floating Holographic Hazard Beacon Diamond */}
            <group position={[0, 3.2, 0]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 0.2]} />
                <meshStandardMaterial
                  color="#EF4444"
                  emissive="#EF4444"
                  emissiveIntensity={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Exclamation Symbol in Center */}
              <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[0.18, 0.5, 0.05]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0, -0.4, 0.12]}>
                <boxGeometry args={[0.18, 0.18, 0.05]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>

            {/* 4. Hazard Barricade with Warning Lamps */}
            <group position={[0, 0.6, 0]}>
              <mesh>
                <boxGeometry args={[3.4, 0.8, 0.2]} />
                <meshStandardMaterial color="#B91C1C" />
              </mesh>
              <mesh position={[0, 0, 0.11]}>
                <planeGeometry args={[3.2, 0.6]} />
                <meshBasicMaterial color="#FACC15" />
              </mesh>
              {/* Flashing Strobe Lights */}
              {[-1.5, 1.5].map((xOffset, idx) => (
                <group key={idx} position={[xOffset, 0.6, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshBasicMaterial color="#EF4444" />
                  </mesh>
                  <pointLight color="#EF4444" intensity={2.0} distance={8} />
                </group>
              ))}
            </group>
          </group>
        );
      })}
    </group>
  );
};
