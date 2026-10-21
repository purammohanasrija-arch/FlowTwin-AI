import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { createRouteCurve } from '../utils/geoTo3d.js';

interface ShipmentRoute3DProps {
  route: {
    routeCode: string;
    name: string;
    roadCorridor: string;
    distanceKm: number;
    durationHours: number;
    routeType: 'planned' | 'observed' | 'simulated' | 'alternative';
    isClosed?: boolean;
    coordinates: [number, number][];
  };
  isDisrupted?: boolean;
  isSelected?: boolean;
  onSelect?: (route: any) => void;
}

export const ShipmentRoute3D: React.FC<ShipmentRoute3DProps> = ({
  route,
  isDisrupted = false,
  isSelected = false,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  // Generate 3D spline curve from coordinates
  const curve = useMemo(() => {
    return createRouteCurve(route.coordinates, 0.35);
  }, [route.coordinates]);

  // Generate TubeGeometry along the curve for glowing artery
  const tubeGeometry = useMemo(() => {
    const isAlt = route.routeType === 'alternative';
    const radius = isSelected ? 0.35 : hovered ? 0.28 : isAlt ? 0.18 : 0.22;
    return new THREE.TubeGeometry(curve, 64, radius, 8, false);
  }, [curve, isSelected, hovered, route.routeType]);

  // Roadbed ribbon geometry underneath the glowing conduit
  const roadbedGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.45, 4, false);
  }, [curve]);

  // Color selection
  const isAlternative = route.routeType === 'alternative';
  const routeColor = isDisrupted || route.isClosed
    ? '#EF4444' // Crimson for disruption
    : isSelected
    ? '#8B5CF6' // Vivid purple for selection
    : isAlternative
    ? '#10B981' // Emerald for alternative route
    : '#06B6D4'; // Cyan for standard active route

  return (
    <group
      onClick={e => {
        e.stopPropagation();
        onSelect?.(route);
      }}
      onPointerOver={e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Dark Highway Roadbed Viaduct */}
      <mesh geometry={roadbedGeometry}>
        <meshStandardMaterial
          color="#0B0E1B"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing Energy Conduit / Corridor Line */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={routeColor}
          emissive={routeColor}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1.2 : isDisrupted ? 1.4 : 0.8}
          transparent
          opacity={isAlternative ? 0.85 : 0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Pulsing Disruption Glow Aura if disrupted */}
      {(isDisrupted || route.isClosed) && (
        <mesh geometry={tubeGeometry} scale={[1.4, 1.4, 1.4]}>
          <meshBasicMaterial
            color="#EF4444"
            transparent
            opacity={0.35}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
};
