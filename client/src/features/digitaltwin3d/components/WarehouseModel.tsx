import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { geoTo3D } from '../utils/geoTo3d.js';
import { Building2, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';

interface WarehouseModelProps {
  facility: {
    facilityCode: string;
    name: string;
    type: string;
    location?: {
      name?: string;
      lat?: number;
      lng?: number;
      latitude?: number;
      longitude?: number;
      city?: string;
      state?: string;
      address?: string;
    };
    totalCapacityUnits?: number;
    capacityTeu?: number;
    currentUtilizationUnits?: number;
    utilizationPercentage?: number;
    currentUtilization?: number;
    status?: string;
  };
  isSelected: boolean;
  onSelect: (facility: any) => void;
  showLabels: boolean;
}

export const WarehouseModel: React.FC<WarehouseModelProps> = ({
  facility,
  isSelected,
  onSelect,
  showLabels,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Safe coordinate resolution
  const lat = facility.location?.lat ?? facility.location?.latitude ?? 39.8283;
  const lng = facility.location?.lng ?? facility.location?.longitude ?? -98.5795;
  const [x, y, z] = geoTo3D(lat, lng, 0);

  // Safe capacity and utilization resolution
  const capacity = facility.totalCapacityUnits ?? facility.capacityTeu ?? 15000;
  const utilization = facility.utilizationPercentage ?? facility.currentUtilization ?? 72;
  const facilityStatus = facility.status || 'optimal';

  // Status color mappings
  const statusColor =
    facilityStatus === 'disrupted'
      ? '#EF4444' // Red
      : facilityStatus === 'congested' || utilization >= 85
      ? '#F59E0B' // Amber
      : '#10B981'; // Emerald

  // Beacon pulse animation
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    if (beaconRef.current) {
      beaconRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.2);
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.5;
    }
  });

  const locationText = facility.location?.city && facility.location?.state
    ? `${facility.location.city}, ${facility.location.state}`
    : facility.location?.name || 'Continental Hub';

  return (
    <group
      ref={groupRef}
      position={[x, y, z]}
      onClick={e => {
        e.stopPropagation();
        onSelect(facility);
      }}
      onPointerOver={e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Pedestal / Concrete Apron */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.2, 8]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#1E2238' : '#121422'}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Holographic Status Ring */}
      <mesh ref={ringRef} position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.3, 3.5, 32]} />
        <meshBasicMaterial
          color={statusColor}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Terminal Building */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.6, 2.6]} />
        <meshStandardMaterial
          color={isSelected ? '#2A2E4E' : hovered ? '#222642' : '#181A2D'}
          emissive={isSelected ? '#8B5CF6' : hovered ? '#4F46E5' : '#000000'}
          emissiveIntensity={isSelected ? 0.35 : hovered ? 0.2 : 0}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Secondary Warehouse Extension */}
      <mesh position={[1.4, 0.75, 1.4]} castShadow>
        <boxGeometry args={[1.8, 1.1, 1.6]} />
        <meshStandardMaterial color="#141728" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Illuminated Roof Solar Panels */}
      <mesh position={[0, 1.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.2]} />
        <meshStandardMaterial
          color="#1E1B4B"
          emissive="#38BDF8"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Loading Dock Bay Doors (Roll-up illuminated doors) */}
      {[-1.2, -0.4, 0.4, 1.2].map((dockX, i) => (
        <mesh key={i} position={[dockX, 0.45, 1.32]}>
          <boxGeometry args={[0.55, 0.7, 0.05]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive={i % 2 === 0 ? '#10B981' : '#F59E0B'}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}

      {/* Parked Cargo Trailers at docks */}
      <mesh position={[-1.2, 0.4, 2.0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 1.1]} />
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </mesh>
      <mesh position={[0.4, 0.4, 2.0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 1.1]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.4} />
      </mesh>

      {/* Stacked Intermodal Containers */}
      <mesh position={[-1.6, 0.3, -1.0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.4]} />
        <meshStandardMaterial color="#0284C7" />
      </mesh>
      <mesh position={[-1.6, 0.8, -1.0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.4]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[-1.6, 0.3, 0.5]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.4]} />
        <meshStandardMaterial color="#059669" />
      </mesh>

      {/* Communication Antenna / Radar Mast */}
      <mesh position={[1.5, 2.5, -0.9]}>
        <cylinderGeometry args={[0.03, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} />
      </mesh>

      {/* Flashing Beacon on Antenna Top */}
      <mesh ref={beaconRef} position={[1.5, 3.3, -0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>

      {/* Floating HUD Label */}
      {showLabels && (
        <Html
          position={[0, 3.8, 0]}
          center
          distanceFactor={45}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={e => {
              e.stopPropagation();
              onSelect(facility);
            }}
            className={`pointer-events-auto cursor-pointer transition-all duration-200 select-none ${
              hovered || isSelected ? 'scale-105 z-50' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div
              className={`px-2.5 py-1.5 rounded-lg border backdrop-blur-md shadow-xl flex flex-col gap-1 min-w-[140px] ${
                isSelected
                  ? 'bg-[#121424]/95 border-purple-500 shadow-purple-500/25 ring-2 ring-purple-500/30'
                  : hovered
                  ? 'bg-[#0E101D]/90 border-indigo-400 shadow-indigo-500/20'
                  : 'bg-[#0B0D18]/85 border-[#1E2238] shadow-black/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[11px] font-bold text-white tracking-tight flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-purple-400 shrink-0" />
                  {facility.name}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: statusColor }}
                />
              </div>

              {/* City & Type */}
              <div className="flex items-center justify-between text-[9px] text-gray-400">
                <span className="truncate max-w-[90px]">{locationText}</span>
                <span className="capitalize text-gray-300 font-medium">
                  {facility.type ? facility.type.replace('_', ' ') : 'Hub'}
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-0.5 border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(utilization, 100)}%`,
                    backgroundColor: statusColor,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[8px] text-gray-400">
                <span>Capacity:</span>
                <span className="font-semibold text-gray-200">
                  {utilization}% ({capacity.toLocaleString()} units)
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
