import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { VehicleSimulationState, RouteCorridor3D } from './types.js';

export const VehicleFleet: React.FC = () => {
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const routes = useDigitalTwinStore(s => s.routes);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const hoveredEntity = useDigitalTwinStore(s => s.hoveredEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const setHoveredEntity = useDigitalTwinStore(s => s.setHoveredEntity);
  const timelineProgress = useDigitalTwinStore(s => s.timelineProgress);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);

  // Precompute CatmullRom curves for each route corridor
  const routeCurves = useMemo(() => {
    const curves: Record<string, THREE.CatmullRomCurve3> = {};
    routes.forEach(route => {
      if (route.splinePoints && route.splinePoints.length >= 2) {
        const points = route.splinePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        curves[route.routeCode] = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
      }
    });
    return curves;
  }, [routes]);

  return (
    <group name="VehicleFleet">
      {vehicles.map((vehicle, idx) => {
        const isSelected =
          selectedEntity?.type === 'vehicle' && selectedEntity.id === vehicle.vehicleCode;
        const isHovered =
          hoveredEntity?.type === 'vehicle' && hoveredEntity.id === vehicle.vehicleCode;
        const curve = routeCurves[vehicle.assignedRouteCode] || Object.values(routeCurves)[0];

        return (
          <VehicleInstance
            key={vehicle.vehicleCode}
            vehicle={vehicle}
            routeCurve={curve}
            indexOffset={idx * 0.18}
            timelineProgress={timelineProgress}
            isPlaying={isPlaying}
            isDisruptionActive={isDisruptionActive}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() =>
              selectEntity({
                type: 'vehicle',
                id: vehicle.vehicleCode,
                data: vehicle,
              })
            }
            onHover={h =>
              setHoveredEntity(
                h ? { type: 'vehicle', id: vehicle.vehicleCode } : null
              )
            }
          />
        );
      })}
    </group>
  );
};

interface VehicleInstanceProps {
  vehicle: VehicleSimulationState;
  routeCurve?: THREE.CatmullRomCurve3;
  indexOffset: number;
  timelineProgress: number;
  isPlaying: boolean;
  isDisruptionActive: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

const VehicleInstance: React.FC<VehicleInstanceProps> = ({
  vehicle,
  routeCurve,
  indexOffset,
  timelineProgress,
  isPlaying,
  isDisruptionActive,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headLightRef = useRef<THREE.SpotLight>(null);

  // Compute animated position along spline curve
  useFrame(() => {
    if (!groupRef.current) return;

    if (routeCurve) {
      let t: number;

      // Delayed vehicle stopped at blizzard road barrier
      if (vehicle.isDelayedByDisruption && isDisruptionActive) {
        t = 0.38; // Locked at Omaha incident marker
      } else if (vehicle.vehicleModelType === 'cargo_ship') {
        t = 0.96; // Moored at container berth
      } else {
        // Continuous smooth traversal
        t = (timelineProgress * 1.5 + indexOffset) % 1.0;
      }

      const currentPos = routeCurve.getPointAt(t);
      const tangent = routeCurve.getTangentAt(t);

      groupRef.current.position.copy(currentPos);

      // Align heading with path tangent
      const angle = Math.atan2(tangent.x, tangent.z);
      groupRef.current.rotation.y = angle;
    }
  });

  return (
    <group
      ref={groupRef}
      position={vehicle.position3D}
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
      {/* Selection Holographic Reticle */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.5, 24]} />
            <meshBasicMaterial
              color={isSelected ? '#00F5FF' : '#A855F7'}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color="#00F5FF" intensity={2.0} distance={6} />
        </group>
      )}

      {/* Render appropriate 3D model */}
      {vehicle.vehicleModelType === 'semi_truck' && (
        <SemiTruckModel isDelayed={vehicle.isDelayedByDisruption} />
      )}

      {vehicle.vehicleModelType === 'reefer' && (
        <ReeferTruckModel isDelayed={vehicle.isDelayedByDisruption} />
      )}

      {vehicle.vehicleModelType === 'delivery_van' && <DeliveryVanModel />}

      {vehicle.vehicleModelType === 'container_carrier' && <ContainerCarrierModel />}

      {vehicle.vehicleModelType === 'freight_train' && <FreightTrainModel />}

      {vehicle.vehicleModelType === 'cargo_ship' && <CargoShipModel />}

      {vehicle.vehicleModelType === 'cargo_aircraft' && <CargoAircraftModel />}

      {/* Headlights illumination cone */}
      <spotLight
        ref={headLightRef}
        position={[0, 0.6, 1.6]}
        target-position={[0, 0, 8]}
        color="#F8FAFC"
        intensity={1.8}
        angle={0.45}
        penumbra={0.6}
        distance={14}
      />
    </group>
  );
};

/* --- 1. SEMI TRUCK (Dry Van 53ft) --- */
const SemiTruckModel: React.FC<{ isDelayed?: boolean }> = ({ isDelayed }) => (
  <group scale={[0.8, 0.8, 0.8]}>
    {/* Tractor Cab */}
    <mesh position={[0, 0.9, 1.6]} castShadow>
      <boxGeometry args={[1.4, 1.4, 1.8]} />
      <meshStandardMaterial color={isDelayed ? '#EF4444' : '#2563EB'} metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Windshield */}
    <mesh position={[0, 1.2, 2.45]} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[1.2, 0.6]} />
      <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={0.4} />
    </mesh>
    {/* Chrome Grill */}
    <mesh position={[0, 0.7, 2.52]}>
      <boxGeometry args={[1.1, 0.6, 0.05]} />
      <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* 53ft Dry Van Trailer */}
    <mesh position={[0, 1.3, -1.2]} castShadow>
      <boxGeometry args={[1.5, 1.8, 4.2]} />
      <meshStandardMaterial color="#F8FAFC" roughness={0.4} metalness={0.3} />
    </mesh>
    {/* Rubber Wheels (Tractor & Tandem Axles) */}
    {[-0.8, 0.8].map(x =>
      [-2.8, -2.0, 1.0, 2.0].map(z => (
        <mesh key={`${x}-${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
      ))
    )}
  </group>
);

/* --- 2. REEFER TRUCK (Cold-Chain) --- */
const ReeferTruckModel: React.FC<{ isDelayed?: boolean }> = ({ isDelayed }) => (
  <group scale={[0.8, 0.8, 0.8]}>
    {/* Cab */}
    <mesh position={[0, 0.9, 1.6]} castShadow>
      <boxGeometry args={[1.4, 1.4, 1.8]} />
      <meshStandardMaterial color={isDelayed ? '#EF4444' : '#0284C7'} metalness={0.7} />
    </mesh>
    {/* Reefer Insulated Trailer */}
    <mesh position={[0, 1.3, -1.2]} castShadow>
      <boxGeometry args={[1.5, 1.8, 4.2]} />
      <meshStandardMaterial color="#F1F5F9" roughness={0.3} metalness={0.4} />
    </mesh>
    {/* ThermoKing Refrigeration Unit on Front Bulkhead */}
    <mesh position={[0, 1.7, 0.95]}>
      <boxGeometry args={[0.9, 0.7, 0.3]} />
      <meshStandardMaterial color="#0284C7" metalness={0.8} />
    </mesh>
    {/* Digital Temperature Status LED (-20°C Glowing Cyan) */}
    <mesh position={[0.3, 1.8, 1.12]}>
      <planeGeometry args={[0.2, 0.1]} />
      <meshBasicMaterial color="#00F5FF" />
    </mesh>
    {/* Wheels */}
    {[-0.8, 0.8].map(x =>
      [-2.8, -2.0, 1.0, 2.0].map(z => (
        <mesh key={`${x}-${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 12]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      ))
    )}
  </group>
);

/* --- 3. DELIVERY VAN --- */
const DeliveryVanModel: React.FC = () => (
  <group scale={[0.7, 0.7, 0.7]}>
    {/* Body */}
    <mesh position={[0, 0.8, 0]} castShadow>
      <boxGeometry args={[1.2, 1.3, 3.0]} />
      <meshStandardMaterial color="#E2E8F0" roughness={0.4} metalness={0.5} />
    </mesh>
    {/* Curved Front Windshield */}
    <mesh position={[0, 1.0, 1.45]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[1.0, 0.5]} />
      <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={0.5} />
    </mesh>
    {/* Wheels */}
    {[-0.65, 0.65].map(x =>
      [-1.0, 1.0].map(z => (
        <mesh key={`${x}-${z}`} position={[x, 0.28, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 10]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      ))
    )}
  </group>
);

/* --- 4. CONTAINER CARRIER TRUCK --- */
const ContainerCarrierModel: React.FC = () => (
  <group scale={[0.8, 0.8, 0.8]}>
    {/* Cab */}
    <mesh position={[0, 0.9, 1.8]}>
      <boxGeometry args={[1.4, 1.4, 1.6]} />
      <meshStandardMaterial color="#10B981" metalness={0.7} />
    </mesh>
    {/* Flatbed Skeleton Trailer */}
    <mesh position={[0, 0.5, -1.0]}>
      <boxGeometry args={[1.4, 0.2, 4.4]} />
      <meshStandardMaterial color="#334155" metalness={0.9} />
    </mesh>
    {/* 40ft Sea-Land Shipping Container on Chassis */}
    <mesh position={[0, 1.35, -1.0]}>
      <boxGeometry args={[1.4, 1.5, 4.2]} />
      <meshStandardMaterial color="#F59E0B" roughness={0.5} metalness={0.5} />
    </mesh>
    {/* Wheels */}
    {[-0.8, 0.8].map(x =>
      [-2.8, -2.0, 1.2, 2.2].map(z => (
        <mesh key={`${x}-${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 12]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      ))
    )}
  </group>
);

/* --- 5. FREIGHT TRAIN (Locomotive + Well-Cars) --- */
const FreightTrainModel: React.FC = () => (
  <group scale={[0.8, 0.8, 0.8]}>
    {/* Diesel-Electric Locomotive */}
    <group position={[0, 0.9, 3.5]}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 1.7, 4.5]} />
        <meshStandardMaterial color="#EAB308" metalness={0.8} />
      </mesh>
      {/* Cab Windshield */}
      <mesh position={[0, 0.5, 2.26]}>
        <planeGeometry args={[1.2, 0.4]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
      {/* Front Cowcatcher */}
      <mesh position={[0, -0.6, 2.3]}>
        <boxGeometry args={[1.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>
    </group>

    {/* Double-Stack Container Well-Car 1 */}
    <group position={[0, 0.8, -1.8]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.3, 5.0]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Lower Container */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.4, 1.2, 4.4]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>
      {/* Upper Container (Double-Stack) */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1.4, 1.2, 4.4]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
    </group>

    {/* Double-Stack Container Well-Car 2 */}
    <group position={[0, 0.8, -7.2]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.3, 5.0]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.4, 1.2, 4.4]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1.4, 1.2, 4.4]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
    </group>
  </group>
);

/* --- 6. CONTAINER CARGO SHIP --- */
const CargoShipModel: React.FC = () => (
  <group scale={[0.8, 0.8, 0.8]}>
    {/* Ship Hull (Length: 24, Width: 4.8) */}
    <mesh position={[0, 1.5, 0]} castShadow>
      <boxGeometry args={[4.8, 3.0, 24]} />
      <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.7} />
    </mesh>
    {/* Bow Point */}
    <mesh position={[0, 1.5, 13]}>
      <coneGeometry args={[2.4, 3, 4]} />
      <meshStandardMaterial color="#1E293B" metalness={0.7} />
    </mesh>
    {/* Deck Container Blocks */}
    {[-1.2, 1.2].map(x =>
      [-6, -2, 2, 6, 10].map(z => (
        <mesh key={`${x}-${z}`} position={[x, 3.8, z]}>
          <boxGeometry args={[1.8, 1.6, 3.2]} />
          <meshStandardMaterial
            color={
              z % 2 === 0 ? '#3B82F6' : z % 3 === 0 ? '#10B981' : '#F59E0B'
            }
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
      ))
    )}
    {/* Bridge Superstructure on Stern */}
    <group position={[0, 4.5, -9]}>
      <mesh>
        <boxGeometry args={[4.2, 4.0, 3.5]} />
        <meshStandardMaterial color="#F8FAFC" metalness={0.4} />
      </mesh>
      {/* Bridge Glass Windows */}
      <mesh position={[0, 1.5, 1.76]}>
        <planeGeometry args={[3.8, 0.8]} />
        <meshBasicMaterial color="#00F5FF" />
      </mesh>
      {/* Radar Mast & Funnel Exhaust */}
      <mesh position={[0, 2.8, -0.5]}>
        <cylinderGeometry args={[0.4, 0.6, 2.0, 8]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
    </group>
  </group>
);

/* --- 7. CARGO AIRCRAFT (Freighter Jet) --- */
const CargoAircraftModel: React.FC = () => (
  <group scale={[0.9, 0.9, 0.9]}>
    {/* Fuselage Cylinder */}
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[1.1, 1.1, 12, 16]} />
      <meshStandardMaterial color="#F8FAFC" metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Cockpit Nose Cone */}
    <mesh position={[0, 0, 6.8]} rotation={[-Math.PI / 2, 0, 0]}>
      <coneGeometry args={[1.1, 1.8, 16]} />
      <meshStandardMaterial color="#F8FAFC" metalness={0.7} />
    </mesh>
    {/* Cockpit Glass */}
    <mesh position={[0, 0.4, 6.5]}>
      <boxGeometry args={[0.8, 0.3, 0.6]} />
      <meshBasicMaterial color="#00F5FF" />
    </mesh>
    {/* Swept Wings */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[14, 0.15, 2.6]} />
      <meshStandardMaterial color="#E2E8F0" metalness={0.6} />
    </mesh>
    {/* Twin Underwing Turbofan Engines */}
    {[-3.5, 3.5].map((xOffset, idx) => (
      <mesh key={idx} position={[xOffset, -0.6, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2.2, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>
    ))}
    {/* Vertical Tail Fin */}
    <mesh position={[0, 1.6, -5]}>
      <boxGeometry args={[0.15, 2.5, 2.0]} />
      <meshStandardMaterial color="#EC4899" />
    </mesh>
    {/* Wingtip Navigation Lights */}
    <mesh position={[-7, 0, 0]}>
      <sphereGeometry args={[0.12, 6, 6]} />
      <meshBasicMaterial color="#EF4444" /> {/* Port Red */}
    </mesh>
    <mesh position={[7, 0, 0]}>
      <sphereGeometry args={[0.12, 6, 6]} />
      <meshBasicMaterial color="#10B981" /> {/* Starboard Green */}
    </mesh>
  </group>
);
