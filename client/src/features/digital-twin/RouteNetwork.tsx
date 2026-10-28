import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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
  const layers = useDigitalTwinStore(s => s.layers);

  if (!layers.routes) return null;

  return (
    <group name="RouteNetwork">
      {routes.map(route => {
        const isSelected =
          selectedEntity?.type === 'route' && selectedEntity.id === route.routeCode;
        const isHovered =
          hoveredEntity?.type === 'route' && hoveredEntity.id === route.routeCode;
        const isClosed = route.roadCorridor === 'I-80' && isDisruptionActive;

        // Check if route connects to currently selected facility or vehicle
        const isFacilityConnected =
          selectedEntity?.type === 'facility' &&
          (route.origin.name.toLowerCase().includes(selectedEntity.id.toLowerCase()) ||
            route.destination.name.toLowerCase().includes(selectedEntity.id.toLowerCase()) ||
            (selectedEntity.id === 'FAC-CHI-01' && (route.roadCorridor === 'I-80' || route.roadCorridor === 'I-70' || route.roadCorridor === 'I-90')) ||
            (selectedEntity.id === 'FAC-NYC-02' && (route.roadCorridor === 'I-80' || route.roadCorridor === 'I-70')) ||
            (selectedEntity.id === 'FAC-LAX-03' && route.roadCorridor === 'I-10') ||
            (selectedEntity.id === 'FAC-DAL-04' && (route.roadCorridor === 'I-10' || route.roadCorridor === 'I-20')) ||
            (selectedEntity.id === 'FAC-ATL-05' && (route.roadCorridor === 'I-20' || route.roadCorridor === 'I-75')) ||
            (selectedEntity.id === 'FAC-SEA-06' && route.roadCorridor === 'I-90'));

        const isVehicleConnected =
          selectedEntity?.type === 'vehicle' &&
          (route.routeCode === selectedEntity.data?.assignedRouteCode ||
            route.roadCorridor === selectedEntity.data?.assignedRouteCode);

        const isHighlighted = isSelected || isFacilityConnected || isVehicleConnected;

        return (
          <RouteCorridorMesh
            key={route.routeCode}
            route={route}
            isClosed={isClosed}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
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
  isHighlighted: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}

const RouteCorridorMesh: React.FC<RouteCorridorMeshProps> = ({
  route,
  isClosed,
  isSelected,
  isHighlighted,
  isHovered,
  onSelect,
  onHover,
}) => {
  const auraMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const arrowsGroupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Generate smooth Catmull-Rom curve and high-visibility tube geometries
  const { curve, roadbedGeometry, coreGeometry, auraGeometry, midPoint } = useMemo(() => {
    const points = route.splinePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const crCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);

    // 1. Solid physical elevated highway roadbed (radius 0.45)
    const roadbed = new THREE.TubeGeometry(crCurve, 72, 0.45, 12, false);

    // 2. Emissive laser core (radius 0.65)
    const core = new THREE.TubeGeometry(crCurve, 72, 0.65, 12, false);

    // 3. Volumetric outer neon aura halo (radius 1.15)
    const aura = new THREE.TubeGeometry(crCurve, 60, 1.15, 8, false);

    // Calculate mid point along curve for floating label
    const mid = crCurve.getPointAt(0.5);

    return {
      curve: crCurve,
      roadbedGeometry: roadbed,
      coreGeometry: core,
      auraGeometry: aura,
      midPoint: mid,
    };
  }, [route.splinePoints]);

  // Determine route color encoding
  const ribbonColor = useMemo(() => {
    if (isSelected || isHighlighted) return '#FFFFFF';
    if (isClosed) return '#EF4444';
    if (route.isBypassAlternative || route.routeType === 'alternative') return '#A855F7';
    if (route.roadCorridor === 'I-80') return isClosed ? '#EF4444' : '#00F5FF';
    return route.colorCode || '#10B981';
  }, [isSelected, isHighlighted, isClosed, route]);

  // Pre-generate directional chevron positions along curve
  const chevronCount = 5;
  const chevronProgresses = useRef<number[]>([0.1, 0.3, 0.5, 0.7, 0.9]);

  // Frame animation for flow pulse, breathing glow, and moving chevrons
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // 1. Animate breathing halo opacity
    if (auraMatRef.current) {
      const pulseSpeed = isClosed ? 0.008 : 0.004;
      const baseOpacity = isHighlighted ? 0.55 : isClosed ? 0.45 : 0.22;
      auraMatRef.current.opacity = baseOpacity + Math.sin(performance.now() * pulseSpeed) * 0.12;
    }

    // 2. Animate directional chevrons along curve
    if (arrowsGroupRef.current) {
      const speed = (route.flowSpeed || 0.4) * 0.12;
      chevronProgresses.current = chevronProgresses.current.map(p => (p + speed * dt) % 1.0);

      arrowsGroupRef.current.children.forEach((child, i) => {
        const prog = chevronProgresses.current[i] ?? (i / chevronCount);
        const pos = curve.getPointAt(prog);
        const tangent = curve.getTangentAt(prog).normalize();

        child.position.set(pos.x, pos.y + 0.3, pos.z);
        child.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      });
    }

    // 3. Animate single bright energy pulse bead
    if (pulseRef.current) {
      const pulseTime = (performance.now() * 0.0003 * (route.flowSpeed || 0.5)) % 1.0;
      const p = curve.getPointAt(pulseTime);
      pulseRef.current.position.set(p.x, p.y + 0.25, p.z);
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
      {/* 1. Base Road Bed Ribbon (Physical dark highway foundation) */}
      <mesh geometry={roadbedGeometry}>
        <meshStandardMaterial
          color={isClosed ? '#350808' : isHighlighted ? '#182444' : '#0B0F1C'}
          roughness={0.5}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Emissive Glowing Route Energy Core (High visibility neon line) */}
      <mesh geometry={coreGeometry}>
        <meshBasicMaterial
          color={ribbonColor}
          transparent
          opacity={isHighlighted ? 0.95 : isHovered ? 0.9 : isClosed ? 0.85 : 0.7}
        />
      </mesh>

      {/* 3. Outer Neon Glow Sheath (Additive glowing halo) */}
      <mesh geometry={auraGeometry}>
        <meshBasicMaterial
          ref={auraMatRef}
          color={ribbonColor}
          transparent
          opacity={isHighlighted ? 0.5 : 0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Directional Chevron Flow Indicators */}
      <group ref={arrowsGroupRef}>
        {Array.from({ length: chevronCount }).map((_, idx) => (
          <group key={idx}>
            {/* Directional Chevron Cone */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.42, 0.85, 8]} />
              <meshBasicMaterial
                color={ribbonColor}
                transparent
                opacity={isClosed ? 0.9 : 0.75}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Traveling Luminous Energy Pulse Bead */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshBasicMaterial
          color={isClosed ? '#FFAAAA' : '#FFFFFF'}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
        <pointLight
          color={ribbonColor}
          intensity={isHighlighted ? 3.0 : 1.5}
          distance={8}
          decay={2}
        />
      </mesh>

      {/* 6. Disrupted Corridor Hazard Barricade Pylons */}
      {isClosed && (
        <group position={[4, 0.6, -2]}>
          {/* Barrier crossbeam */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[4.2, 0.5, 0.25]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#EF4444"
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Hazard diagonal stripes */}
          <mesh position={[0, 0.9, 0.14]}>
            <planeGeometry args={[4.0, 0.4]} />
            <meshBasicMaterial color="#FACC15" />
          </mesh>
          {/* Pulsing Hazard Flasher Beacons */}
          {[-1.8, 0, 1.8].map((xOffset, idx) => (
            <mesh key={idx} position={[xOffset, 1.4, 0]}>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshBasicMaterial color="#FF2222" />
              <pointLight color="#FF2222" intensity={2.0} distance={6} />
            </mesh>
          ))}
        </group>
      )}

      {/* 7. Alternative Recovery Route Holographic Gateway Beacon */}
      {route.isBypassAlternative && (
        <group position={[22, 1.6, 4]}>
          <mesh>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshBasicMaterial color="#C084FC" />
          </mesh>
          <pointLight color="#C084FC" intensity={3.5} distance={12} />
        </group>
      )}

      {/* 8. Floating Holographic 3D Route Corridor Label */}
      <group position={[midPoint.x, midPoint.y + 3.2, midPoint.z]}>
        <Html center distanceFactor={50} zIndexRange={[15, 0]}>
          <div
            onClick={e => {
              e.stopPropagation();
              onSelect();
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono whitespace-nowrap backdrop-blur-xl border cursor-pointer transition-all duration-200 ${
              isSelected || isHighlighted
                ? 'bg-[#1F1208]/95 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-110 font-bold z-40'
                : isClosed
                ? 'bg-[#290808]/95 border-rose-500 text-rose-200 shadow-[0_0_18px_rgba(239,68,68,0.6)] font-bold animate-pulse'
                : route.isBypassAlternative
                ? 'bg-[#1C0D2E]/95 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#0B0F1C]/90 border-[#232B4E] text-gray-200 hover:border-amber-400/80 hover:bg-[#151122]'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isClosed
                    ? 'bg-rose-500 animate-ping'
                    : route.isBypassAlternative
                    ? 'bg-purple-400 animate-pulse'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="font-extrabold text-amber-200 tracking-wide">
                {route.chocolatePipelineName || route.roadCorridor}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-gray-300">
                {route.roadCorridor}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[9px] text-gray-400 pl-3.5">
              <span
                className={
                  isClosed
                    ? 'text-rose-400 font-bold'
                    : route.isBypassAlternative
                    ? 'text-purple-300 font-bold'
                    : 'text-emerald-400'
                }
              >
                {isClosed
                  ? '⚠️ JACKET FAULT (SOLIDIFYING)'
                  : route.isBypassAlternative
                  ? '🔄 THERMAL BYPASS (32°C)'
                  : '🟢 OPTIMAL FLOW (48°C)'}
              </span>
              {route.ingredientFlow && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-amber-300/80 italic">
                    {route.ingredientFlow.split('(')[0]}
                  </span>
                </>
              )}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
