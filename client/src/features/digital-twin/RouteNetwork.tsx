import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { RouteCorridor3D } from './types.js';

export const RouteNetwork: React.FC = () => {
  const routes = useDigitalTwinStore(s => s.routes);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const hoveredEntity = useDigitalTwinStore(s => s.hoveredEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const setHoveredEntity = useDigitalTwinStore(s => s.setHoveredEntity);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);

  return (
    <group name="RouteNetwork">
      {routes.map(route => {
        const isSelected =
          selectedEntity?.type === 'route' && selectedEntity.id === route.routeCode;
        const isHovered =
          hoveredEntity?.type === 'route' && hoveredEntity.id === route.routeCode;
        const isClosed = route.roadCorridor === 'I-80' && isDisruptionActive;

        return (
          <RouteCorridorMesh
            key={route.routeCode}
            route={route}
            isClosed={isClosed}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() =>
              selectEntity({
                type: 'route',
                id: route.routeCode,
                data: route,
              })
            }
            onHover={h =>
              setHoveredEntity(h ? { type: 'route', id: route.routeCode } : null)
            }
          />
        );
      })}
    </group>
  );
};

interface RouteCorridorMeshProps {
  route: RouteCorridor3D;
  isClosed: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}

const RouteCorridorMesh: React.FC<RouteCorridorMeshProps> = ({
  route,
  isClosed,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const flowMeshRef = useRef<THREE.Mesh>(null);

  // Generate smooth tube geometry along spline points
  const { tubeGeometry, curve } = useMemo(() => {
    const points = route.splinePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const crCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
    const geom = new THREE.TubeGeometry(crCurve, 64, 0.22, 8, false);
    return { tubeGeometry: geom, curve: crCurve };
  }, [route.splinePoints]);

  // Determine route ribbon color
  const ribbonColor = useMemo(() => {
    if (isSelected) return '#FFFFFF';
    if (isClosed) return '#EF4444';
    if (route.isBypassAlternative || route.routeType === 'alternative') return '#A855F7';
    if (route.roadCorridor === 'I-80') return isClosed ? '#EF4444' : '#00F5FF';
    return route.colorCode || '#10B981';
  }, [isSelected, isClosed, route]);

  // Animate route flow pulse along texture offset
  useFrame(() => {
    if (flowMeshRef.current && flowMeshRef.current.material) {
      const mat = flowMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat.map) {
        mat.map.offset.x -= 0.015 * (route.flowSpeed || 0.4);
      }
    }
  });

  return (
    <group
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={e => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* 1. Base Road Bed Ribbon */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={isClosed ? '#450A0A' : '#0B0F1C'}
          roughness={0.6}
          metalness={0.7}
        />
      </mesh>

      {/* 2. Emissive Glowing Route Energy Core */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color={ribbonColor}
          transparent
          opacity={isSelected ? 0.95 : isClosed ? 0.8 : 0.65}
          wireframe={isSelected}
        />
      </mesh>

      {/* 3. Closed Route Roadblock Barrier Pylons */}
      {isClosed && (
        <group position={[4, 0.6, -2]}>
          {/* Barrier crossbeam */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[3.2, 0.4, 0.2]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#EF4444"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Hazard diagonal stripes */}
          <mesh position={[0, 0.8, 0.11]}>
            <planeGeometry args={[3.0, 0.3]} />
            <meshBasicMaterial color="#FACC15" />
          </mesh>
          {/* Blinking Hazard Warning Beacons */}
          {[-1.4, 1.4].map((xOffset, idx) => (
            <mesh key={idx} position={[xOffset, 1.2, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          ))}
        </group>
      )}

      {/* 4. Alternative Recovery Route Holographic Indicator */}
      {route.isBypassAlternative && (
        <group position={[22, 1.4, 4]}>
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#A855F7" />
          </mesh>
          <pointLight color="#A855F7" intensity={2.5} distance={10} />
        </group>
      )}
    </group>
  );
};
