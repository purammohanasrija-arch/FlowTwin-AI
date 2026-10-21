import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const WorldTerrain: React.FC = () => {
  const quality = useDigitalTwinStore(s => s.quality);
  const weather = useDigitalTwinStore(s => s.weather);
  const waterRef = useRef<THREE.Mesh>(null);

  // Procedural Ocean Water Plane
  const waterGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(50, 160, 40, 40);
  }, []);

  // Animate ocean water subtle waves
  useFrame(() => {
    if (waterRef.current) {
      const time = performance.now() * 0.0015;
      const posAttr = waterRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const zWave = Math.sin(u * 0.15 + time) * Math.cos(v * 0.12 + time * 0.8) * 0.35;
        posAttr.setZ(i, zWave);
      }
      posAttr.needsUpdate = true;
      waterRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group name="WorldTerrain">
      {/* 1. Main Industrial Ground Baseplate */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial
          color="#080912"
          roughness={0.88}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Coastal Ocean on Western Shore (X: -65) */}
      <group position={[-65, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={waterRef} geometry={waterGeometry}>
          <meshStandardMaterial
            color="#041B33"
            emissive="#004D7A"
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.8}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Ocean Shoreline Foam Edge */}
        <mesh position={[24.8, 0, 0.02]}>
          <planeGeometry args={[0.8, 160]} />
          <meshBasicMaterial
            color="#00F5FF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 3. Port Pier Jetties & Deep-Water Quay Berths */}
      <group position={[-46, 0.1, 10]}>
        {/* Main Concrete Pier Berth */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[14, 0.3, 34]} />
          <meshStandardMaterial color="#1E2338" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Quay Edge Hazard Stripes */}
        <mesh position={[-6.9, 0.31, 0]}>
          <boxGeometry args={[0.3, 0.02, 34]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Mooring Bollards */}
        {[-14, -7, 0, 7, 14].map((zOffset, idx) => (
          <mesh key={idx} position={[-6.5, 0.45, zOffset]}>
            <cylinderGeometry args={[0.2, 0.25, 0.35, 8]} />
            <meshStandardMaterial color="#FACC15" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 4. Second Coastal Terminal Pier (Puget Sound -42, 0, -32) */}
      <group position={[-42, 0.1, -32]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[12, 0.3, 24]} />
          <meshStandardMaterial color="#1E2338" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[-5.9, 0.31, 0]}>
          <boxGeometry args={[0.3, 0.02, 24]} />
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#00F5FF"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* 5. Aerotropolis Airport Runway System (Indianapolis Cargo Hub: [22, 0, -32]) */}
      <group position={[24, 0.02, -34]}>
        {/* Runway Main Asphalt Strip (Length: 52, Width: 5.5) */}
        <mesh rotation={[-Math.PI / 2, 0, -0.2]}>
          <planeGeometry args={[54, 5.5]} />
          <meshStandardMaterial color="#11131C" roughness={0.9} />
        </mesh>
        {/* Runway Threshold White Markings */}
        {[-24, -22, -20, 20, 22, 24].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0.04, 0]} rotation={[-Math.PI / 2, 0, -0.2]}>
            <planeGeometry args={[1.8, 0.35]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        {/* Runway Centerline Dashes */}
        {[-15, -10, -5, 0, 5, 10, 15].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0.04, 0]} rotation={[-Math.PI / 2, 0, -0.2]}>
            <planeGeometry args={[2.5, 0.2]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        {/* Green Runway Threshold Lights */}
        {[-2.6, 2.6].map((zOffset, idx) => (
          <group key={idx}>
            <mesh position={[-25, 0.1, zOffset]}>
              <sphereGeometry args={[0.15, 6, 6]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <mesh position={[25, 0.1, zOffset]}>
              <sphereGeometry args={[0.15, 6, 6]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Transcontinental Rail Line Bed (Gravel ballast & Steel rails) */}
      <group position={[0, 0.02, -2]}>
        {/* Gravel Ballast Path */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[110, 2.2]} />
          <meshStandardMaterial color="#1F2433" roughness={0.95} />
        </mesh>
        {/* Dual Steel Rail Tracks */}
        <mesh position={[0, 0.08, -0.55]}>
          <boxGeometry args={[110, 0.08, 0.08]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0.55]}>
          <boxGeometry args={[110, 0.08, 0.08]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Perimeter Mountains & Topological Relief Ridges */}
      {/* North Mountain Ridge */}
      <mesh position={[0, 4, -75]}>
        <coneGeometry args={[18, 12, 5]} />
        <meshStandardMaterial color="#0A0C18" roughness={0.95} />
      </mesh>
      <mesh position={[-35, 6, -70]}>
        <coneGeometry args={[24, 15, 6]} />
        <meshStandardMaterial color="#0B0E1E" roughness={0.95} />
      </mesh>
      <mesh position={[38, 5, -72]}>
        <coneGeometry args={[20, 14, 5]} />
        <meshStandardMaterial color="#0A0D1B" roughness={0.95} />
      </mesh>

      {/* East Mountain Ridge */}
      <mesh position={[75, 5, 0]}>
        <coneGeometry args={[22, 14, 5]} />
        <meshStandardMaterial color="#080A14" roughness={0.95} />
      </mesh>
      <mesh position={[70, 7, -35]}>
        <coneGeometry args={[26, 16, 6]} />
        <meshStandardMaterial color="#090B16" roughness={0.95} />
      </mesh>
      <mesh position={[68, 6, 35]}>
        <coneGeometry args={[24, 15, 5]} />
        <meshStandardMaterial color="#090B16" roughness={0.95} />
      </mesh>

      {/* 8. Holographic Region Perimeter Pylons */}
      {[
        [-58, 2, -58],
        [-58, 2, 58],
        [58, 2, -58],
        [58, 2, 58],
        [0, 2, -65],
        [0, 2, 65],
      ].map((pos, idx) => (
        <group key={idx} position={[pos[0], pos[1], pos[2]]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.4, 4, 6]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshBasicMaterial color="#00F5FF" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
