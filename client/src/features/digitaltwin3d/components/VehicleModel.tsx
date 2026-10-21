import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Truck, AlertTriangle, BatteryCharging, Gauge } from 'lucide-react';
import { geoTo3D, createRouteCurve } from '../utils/geoTo3d.js';

interface VehicleModelProps {
  vehicle: {
    vehicleCode: string;
    type: string;
    maxWeightKg?: number;
    capacityWeightKg?: number;
    assignedRoute?: {
      roadCorridor: string;
      coordinates: [number, number][];
    };
    currentLocation?: {
      name?: string;
      lat?: number;
      lng?: number;
      latitude?: number;
      longitude?: number;
    };
    status?: string;
  };
  isSelected?: boolean;
  onSelect?: (vehicle: any) => void;
  isPlaying?: boolean;
  playbackSpeed?: number;
  timelineProgress?: number;
  isBreakdownSimulated?: boolean;
  offsetSeed?: number;
}

export const VehicleModel: React.FC<VehicleModelProps> = ({
  vehicle,
  isSelected = false,
  onSelect,
  isPlaying = true,
  playbackSpeed = 1.0,
  timelineProgress = 0,
  isBreakdownSimulated = false,
  offsetSeed = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const hazardRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // Derive status
  const vehicleStatus = vehicle.status || 'in_transit';
  const isBroken = isBreakdownSimulated || vehicleStatus === 'breakdown';
  const maxWeight = vehicle.maxWeightKg ?? vehicle.capacityWeightKg ?? 24000;

  // Spline for route movement if assigned
  const routeCurve = useMemo(() => {
    if (vehicle.assignedRoute?.coordinates && vehicle.assignedRoute.coordinates.length > 1) {
      return createRouteCurve(vehicle.assignedRoute.coordinates, 0.45);
    }
    return null;
  }, [vehicle.assignedRoute]);

  // Fallback static position if no route
  const staticPos = useMemo(() => {
    const lat = vehicle.currentLocation?.lat ?? vehicle.currentLocation?.latitude ?? 39.8283;
    const lng = vehicle.currentLocation?.lng ?? vehicle.currentLocation?.longitude ?? -98.5795;
    return geoTo3D(lat, lng, 0.45);
  }, [vehicle.currentLocation]);

  // Local progress tracker along route
  const progressOffset = useRef((offsetSeed * 0.23) % 1.0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Animate hazard light if breakdown
    if (isBroken && hazardRef.current) {
      const t = state.clock.getElapsedTime();
      hazardRef.current.intensity = Math.sin(t * 8) > 0 ? 2.5 : 0.1;
    }

    if (routeCurve) {
      if (isPlaying && !isBroken) {
        progressOffset.current = (progressOffset.current + delta * 0.03 * playbackSpeed) % 1.0;
      }

      const totalProgress = (progressOffset.current + timelineProgress * 0.5) % 1.0;
      const point = routeCurve.getPointAt(totalProgress);
      const tangent = routeCurve.getTangentAt(totalProgress);

      groupRef.current.position.copy(point);

      // Orient truck forward along route
      const lookTarget = point.clone().add(tangent);
      groupRef.current.lookAt(lookTarget);

      // Slight tilt if broken down
      if (isBroken) {
        groupRef.current.rotation.z = 0.12;
      }
    } else {
      groupRef.current.position.set(staticPos[0], staticPos[1], staticPos[2]);
    }
  });

  // Color scheme based on vehicle type and state
  const isElectric = vehicle.type === 'Electric Semi';
  const cabColor = isBroken ? '#991B1B' : isSelected ? '#7C3AED' : isElectric ? '#059669' : '#2563EB';

  return (
    <group
      ref={groupRef}
      scale={isSelected ? [1.25, 1.25, 1.25] : [1, 1, 1]}
      onClick={e => {
        e.stopPropagation();
        onSelect?.(vehicle);
      }}
      onPointerOver={e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* TRUCK CAB */}
      <mesh position={[0, 0.35, 0.75]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.65]} />
        <meshStandardMaterial
          color={cabColor}
          emissive={isSelected ? '#8B5CF6' : hovered ? '#4F46E5' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.45, 0.95]}>
        <boxGeometry args={[0.48, 0.25, 0.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Headlights (Glowing white/cyan) */}
      <mesh position={[-0.2, 0.22, 1.08]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>
      <mesh position={[0.2, 0.22, 1.08]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>

      {/* Dual Exhaust Stacks */}
      <mesh position={[-0.24, 0.7, 0.45]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
      </mesh>
      <mesh position={[0.24, 0.7, 0.45]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
      </mesh>

      {/* CARGO TRAILER */}
      <mesh position={[0, 0.52, -0.45]} castShadow>
        <boxGeometry args={[0.62, 0.75, 1.7]} />
        <meshStandardMaterial
          color={isBroken ? '#334155' : '#1E293B'}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* Trailer Branding Stripe */}
      <mesh position={[0, 0.52, -0.45]}>
        <boxGeometry args={[0.64, 0.12, 1.72]} />
        <meshStandardMaterial
          color={isElectric ? '#10B981' : '#38BDF8'}
          emissive={isElectric ? '#10B981' : '#38BDF8'}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Wheels (8 wheels: 2 front, 6 trailer/rear) */}
      {[-0.32, 0.32].map((wx, i) => (
        <group key={i}>
          {/* Front cab wheel */}
          <mesh position={[wx, 0.12, 0.75]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
            <meshStandardMaterial color="#0A0A0C" roughness={0.9} />
          </mesh>
          {/* Rear trailer wheels (tandem) */}
          <mesh position={[wx, 0.12, -0.9]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
            <meshStandardMaterial color="#0A0A0C" roughness={0.9} />
          </mesh>
          <mesh position={[wx, 0.12, -1.15]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
            <meshStandardMaterial color="#0A0A0C" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Breakdown Hazard Warning Light */}
      {isBroken && (
        <pointLight
          ref={hazardRef}
          position={[0, 1.3, 0.5]}
          color="#F59E0B"
          distance={8}
          intensity={2}
        />
      )}

      {/* Floating Vehicle HUD Badge */}
      {(hovered || isSelected || isBroken) && (
        <Html position={[0, 1.6, 0]} center distanceFactor={40} zIndexRange={[120, 0]}>
          <div
            onClick={e => {
              e.stopPropagation();
              onSelect?.(vehicle);
            }}
            className={`pointer-events-auto px-2.5 py-1.5 rounded-lg border backdrop-blur-md shadow-xl select-none min-w-[130px] ${
              isBroken
                ? 'bg-red-950/90 border-red-500 shadow-red-500/30'
                : isSelected
                ? 'bg-purple-950/90 border-purple-400 shadow-purple-500/30 ring-2 ring-purple-500/40'
                : 'bg-[#0E101D]/90 border-indigo-400'
            }`}
          >
            <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-white">
              <span className="flex items-center gap-1">
                {isBroken ? (
                  <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                ) : (
                  <Truck className="w-3 h-3 text-cyan-400" />
                )}
                {vehicle.vehicleCode}
              </span>
              <span
                className={`text-[8px] font-semibold px-1 py-0.2 rounded uppercase ${
                  isBroken
                    ? 'bg-red-500/30 text-red-200'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isBroken ? 'BREAKDOWN' : vehicleStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[8px] text-gray-300 mt-0.5">
              <span>{vehicle.type}</span>
              <span>{(maxWeight / 1000).toFixed(1)}t</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
