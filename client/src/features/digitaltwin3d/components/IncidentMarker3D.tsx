import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AlertOctagon, Flame, CloudSnow, Construction } from 'lucide-react';
import { geoTo3D } from '../utils/geoTo3d.js';

interface IncidentMarker3DProps {
  incident: {
    incidentCode: string;
    title: string;
    type: string;
    severity: 'minor' | 'moderate' | 'severe' | 'critical';
    location: {
      latitude: number;
      longitude: number;
      description: string;
    };
    expectedDurationHours: number;
    delayImpactHours: number;
  };
  isSelected?: boolean;
  onSelect?: (incident: any) => void;
}

export const IncidentMarker3D: React.FC<IncidentMarker3DProps> = ({
  incident,
  isSelected = false,
  onSelect,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  const [x, y, z] = geoTo3D(
    incident.location.latitude,
    incident.location.longitude,
    0.4
  );

  useFrame(state => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.25);
      ringRef.current.rotation.z = t * 0.8;
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = 2.0 + Math.sin(t * 6) * 1.5;
    }
  });

  return (
    <group
      position={[x, y, z]}
      onClick={e => {
        e.stopPropagation();
        onSelect?.(incident);
      }}
    >
      {/* Red Warning Beacon PointLight */}
      <pointLight ref={beaconRef} color="#EF4444" distance={12} intensity={3} />

      {/* Pulsing Holographic Ground Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.5, 32]} />
        <meshBasicMaterial
          color="#EF4444"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Roadblock Barricade Stand */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 0.2]} />
        <meshStandardMaterial
          color="#7F1D1D"
          emissive="#DC2626"
          emissiveIntensity={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* Hazard Stripes overlay on barrier */}
      {[-0.6, -0.2, 0.2, 0.6].map((sx, i) => (
        <mesh key={i} position={[sx, 0.5, 0.11]}>
          <boxGeometry args={[0.18, 0.58, 0.02]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      ))}

      {/* Flashing Warning Strobe Sphere */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Floating HUD Badge */}
      <Html position={[0, 1.8, 0]} center distanceFactor={35} zIndexRange={[150, 0]}>
        <div
          onClick={e => {
            e.stopPropagation();
            onSelect?.(incident);
          }}
          className={`pointer-events-auto px-2.5 py-1.5 rounded-lg border backdrop-blur-md shadow-xl select-none min-w-[150px] cursor-pointer transition-all ${
            isSelected
              ? 'bg-red-950/95 border-red-500 ring-2 ring-red-500 shadow-red-500/40 scale-105'
              : 'bg-[#180A0A]/90 border-red-500/60 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-red-200">
            <span className="flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
              {incident.title}
            </span>
            <span className="px-1 py-0.2 rounded text-[8px] uppercase font-bold bg-red-500/30 text-red-300">
              {incident.severity}
            </span>
          </div>

          <div className="text-[9px] text-gray-300 mt-0.5">
            {incident.location.description}
          </div>

          <div className="flex items-center justify-between text-[8px] text-red-300 font-medium mt-1 pt-1 border-t border-red-500/20">
            <span>Delay Est:</span>
            <span>+{incident.delayImpactHours}h ({incident.expectedDurationHours}h closure)</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
