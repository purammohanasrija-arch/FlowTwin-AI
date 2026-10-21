import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { FacilityNode3D } from './types.js';

interface WarehouseClusterProps {
  onSelectFacility?: (fac: FacilityNode3D) => void;
}

export const WarehouseCluster: React.FC<WarehouseClusterProps> = () => {
  const facilities = useDigitalTwinStore(s => s.facilities);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const hoveredEntity = useDigitalTwinStore(s => s.hoveredEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const setHoveredEntity = useDigitalTwinStore(s => s.setHoveredEntity);
  const toggleWarehouseCutaway = useDigitalTwinStore(s => s.toggleWarehouseCutaway);
  const warehouseCutaway = useDigitalTwinStore(s => s.warehouseCutaway);

  return (
    <group name="WarehouseCluster">
      {facilities.map(facility => {
        const isSelected =
          selectedEntity?.type === 'facility' && selectedEntity.id === facility.facilityCode;
        const isHovered =
          hoveredEntity?.type === 'facility' && hoveredEntity.id === facility.facilityCode;
        const isCutawayTarget =
          warehouseCutaway.active && warehouseCutaway.facilityCode === facility.facilityCode;

        return (
          <FacilityBuildingModel
            key={facility.facilityCode}
            facility={facility}
            isSelected={isSelected}
            isHovered={isHovered}
            isCutawayTarget={isCutawayTarget}
            onSelect={() =>
              selectEntity({
                type: 'facility',
                id: facility.facilityCode,
                data: facility,
              })
            }
            onDoubleClick={() => toggleWarehouseCutaway(facility.facilityCode)}
            onHover={hovering =>
              setHoveredEntity(
                hovering ? { type: 'facility', id: facility.facilityCode } : null
              )
            }
          />
        );
      })}
    </group>
  );
};

interface FacilityBuildingModelProps {
  facility: FacilityNode3D;
  isSelected: boolean;
  isHovered: boolean;
  isCutawayTarget: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onHover: (hovering: boolean) => void;
}

const FacilityBuildingModel: React.FC<FacilityBuildingModelProps> = ({
  facility,
  isSelected,
  isHovered,
  isCutawayTarget,
  onSelect,
  onDoubleClick,
  onHover,
}) => {
  const radarRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  // Status color
  const statusColor =
    facility.status === 'optimal'
      ? '#10B981'
      : facility.status === 'congested'
      ? '#F59E0B'
      : '#EF4444';

  // Animate airport radar / beacons
  useFrame(() => {
    if (radarRef.current) {
      radarRef.current.rotation.y += 0.04;
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = 1.0 + Math.sin(performance.now() * 0.005) * 0.8;
    }
  });

  // If cutaway mode is active for this warehouse, hide the exterior shell so interior renders
  if (isCutawayTarget) {
    return null;
  }

  return (
    <group
      position={facility.position3D}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        onDoubleClick();
      }}
      onPointerOver={e => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* Selection Holographic Base Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10, 10.6, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#00F5FF' : '#A855F7'}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Render specialized architecture depending on category */}
      {facility.facilityCategory === 'coastal_port' && (
        <CoastalPortFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'mega_warehouse' && (
        <MegaWarehouseFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'cross_dock' && (
        <CrossDockFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'inland_depot' && (
        <InlandDepotFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'sorting_center' && (
        <SortingCenterFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'airport_hub' && (
        <AirportHubFacility
          radarRef={radarRef}
          statusColor={statusColor}
          isSelected={isSelected}
        />
      )}

      {facility.facilityCategory === 'rail_terminal' && (
        <RailTerminalFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'manufacturing_plant' && (
        <ManufacturingFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {facility.facilityCategory === 'supplier_facility' && (
        <SupplierDepotFacility statusColor={statusColor} isSelected={isSelected} />
      )}

      {/* Rooftop Status Beacon */}
      <pointLight
        ref={beaconRef}
        position={[0, 7.5, 0]}
        color={statusColor}
        intensity={isSelected ? 3.0 : 1.2}
        distance={18}
      />
      <mesh position={[0, 7.2, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={statusColor} />
      </mesh>
    </group>
  );
};

/* --- 1. COASTAL PORT (Cranes, Container Stacks) --- */
const CoastalPortFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Port Terminal Control Office */}
    <mesh position={[0, 2.2, 0]} castShadow>
      <boxGeometry args={[12, 4.4, 8]} />
      <meshStandardMaterial
        color="#151928"
        roughness={0.4}
        metalness={0.6}
        emissive={isSelected ? '#00F5FF' : '#000000'}
        emissiveIntensity={0.2}
      />
    </mesh>

    {/* Glass Operations Bridge */}
    <mesh position={[0, 4.8, 2]}>
      <boxGeometry args={[8, 1.2, 3]} />
      <meshStandardMaterial
        color="#00F5FF"
        emissive="#00F5FF"
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>

    {/* STS Gantry Crane 1 */}
    <group position={[-5, 0, 7]}>
      {/* Crane Legs */}
      <mesh position={[-1.8, 4, 0]}>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
      <mesh position={[1.8, 4, 0]}>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
      {/* Boom projecting over water */}
      <mesh position={[0, 7.8, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.6, 12]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
    </group>

    {/* STS Gantry Crane 2 */}
    <group position={[5, 0, 7]}>
      <mesh position={[-1.8, 4, 0]}>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
      <mesh position={[1.8, 4, 0]}>
        <boxGeometry args={[0.4, 8, 0.4]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
      <mesh position={[0, 7.8, -3]}>
        <boxGeometry args={[3.2, 0.6, 12]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} />
      </mesh>
    </group>

    {/* Multi-colored 40ft Container Stacks */}
    {[
      { x: -5, z: -8, color: '#3B82F6', h: 1.2 },
      { x: -5, z: -8, color: '#EF4444', h: 2.5 },
      { x: -1, z: -8, color: '#10B981', h: 1.2 },
      { x: -1, z: -8, color: '#F59E0B', h: 2.5 },
      { x: 3, z: -8, color: '#06B6D4', h: 1.2 },
      { x: 3, z: -8, color: '#8B5CF6', h: 2.5 },
      { x: 3, z: -8, color: '#EC4899', h: 3.8 },
    ].map((c, idx) => (
      <mesh key={idx} position={[c.x, c.h, c.z]}>
        <boxGeometry args={[3.2, 1.2, 1.4]} />
        <meshStandardMaterial color={c.color} roughness={0.4} metalness={0.6} />
      </mesh>
    ))}
  </group>
);

/* --- 2. MEGA WAREHOUSE (Chicago Central Automated Hub) --- */
const MegaWarehouseFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Main High-Bay Logistics Hall */}
    <mesh position={[0, 3, 0]} castShadow>
      <boxGeometry args={[20, 6, 14]} />
      <meshStandardMaterial
        color="#151928"
        roughness={0.5}
        metalness={0.5}
        emissive={isSelected ? '#A855F7' : '#000000'}
        emissiveIntensity={0.2}
      />
    </mesh>

    {/* Front Office Glass Atrium */}
    <mesh position={[0, 2.5, 7.2]}>
      <boxGeometry args={[12, 5, 0.6]} />
      <meshStandardMaterial
        color="#00F5FF"
        emissive="#00F5FF"
        emissiveIntensity={0.5}
        transparent
        opacity={0.65}
      />
    </mesh>

    {/* 8 Loading Docks on South Wall */}
    {[-7, -5, -3, -1, 1, 3, 5, 7].map((xOffset, idx) => (
      <group key={idx} position={[xOffset, 1.2, -7.05]}>
        {/* Overhead Door */}
        <mesh>
          <planeGeometry args={[1.4, 2.2]} />
          <meshStandardMaterial color="#0B0D17" metalness={0.9} />
        </mesh>
        {/* Rubber Dock Seals */}
        <mesh position={[-0.75, 0, 0.05]}>
          <boxGeometry args={[0.1, 2.2, 0.15]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0.75, 0, 0.05]}>
          <boxGeometry args={[0.1, 2.2, 0.15]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Dock Guide Light */}
        <mesh position={[0, 1.3, 0.1]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>
    ))}

    {/* Rooftop Solar Panels */}
    {[-6, -2, 2, 6].map((xOffset, idx) => (
      <mesh
        key={idx}
        position={[xOffset, 6.1, -1]}
        rotation={[-0.2, 0, 0]}
      >
        <planeGeometry args={[3.2, 6.5]} />
        <meshStandardMaterial
          color="#1D4ED8"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    ))}

    {/* Rooftop Industrial HVAC Chillers */}
    {[-6, 6].map((xOffset, idx) => (
      <mesh key={idx} position={[xOffset, 6.6, 4]}>
        <boxGeometry args={[2.5, 1.2, 2.5]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
    ))}
  </group>
);

/* --- 3. CROSS DOCK (New York Atlantic Gateway) --- */
const CrossDockFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Long Narrow Cross-Dock Building */}
    <mesh position={[0, 2.5, 0]} castShadow>
      <boxGeometry args={[26, 5, 8]} />
      <meshStandardMaterial
        color="#151928"
        roughness={0.5}
        metalness={0.5}
        emissive={isSelected ? '#10B981' : '#000000'}
        emissiveIntensity={0.2}
      />
    </mesh>

    {/* Double-sided Loading Docks (Front and Back) */}
    {[-10, -6, -2, 2, 6, 10].map((xOffset, idx) => (
      <group key={idx}>
        <mesh position={[xOffset, 1.2, 4.05]}>
          <planeGeometry args={[1.5, 2.2]} />
          <meshStandardMaterial color="#0A0C14" />
        </mesh>
        <mesh position={[xOffset, 1.2, -4.05]}>
          <planeGeometry args={[1.5, 2.2]} />
          <meshStandardMaterial color="#0A0C14" />
        </mesh>
      </group>
    ))}

    {/* High-Mast Yard Floodlight Pylons */}
    {[-14, 14].map((xOffset, idx) => (
      <group key={idx} position={[xOffset, 0, 6]}>
        <mesh position={[0, 5, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 10, 6]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} />
        </mesh>
        <mesh position={[0, 10.2, 0]}>
          <boxGeometry args={[1.2, 0.3, 0.6]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    ))}
  </group>
);

/* --- 4. INLAND DEPOT (Lone Star Dallas) --- */
const InlandDepotFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Main Cross-Dock Terminal */}
    <mesh position={[0, 2.2, 0]} castShadow>
      <boxGeometry args={[14, 4.4, 10]} />
      <meshStandardMaterial
        color="#151928"
        roughness={0.5}
        metalness={0.5}
        emissive={isSelected ? '#8B5CF6' : '#000000'}
        emissiveIntensity={0.2}
      />
    </mesh>
    {/* Bulk Liquid Storage Silo Tanks */}
    {[-4, 0, 4].map((xOffset, idx) => (
      <mesh key={idx} position={[xOffset, 3.5, -7]}>
        <cylinderGeometry args={[1.4, 1.4, 7, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
      </mesh>
    ))}
  </group>
);

/* --- 5. SORTING CENTER (Peach State Atlanta) --- */
const SortingCenterFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* East Wing */}
    <mesh position={[-5, 2.5, 0]}>
      <boxGeometry args={[8, 5, 10]} />
      <meshStandardMaterial color="#151928" metalness={0.6} />
    </mesh>
    {/* West Wing */}
    <mesh position={[5, 2.5, 0]}>
      <boxGeometry args={[8, 5, 10]} />
      <meshStandardMaterial color="#151928" metalness={0.6} />
    </mesh>
    {/* Elevated Enclosed Conveyor Bridge */}
    <mesh position={[0, 3.8, 0]}>
      <boxGeometry args={[6, 1.6, 2.5]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={0.4}
        metalness={0.8}
      />
    </mesh>
  </group>
);

/* --- 6. AIRPORT HUB (Hangar + Control Tower) --- */
const AirportHubFacility: React.FC<{
  radarRef: any;
  statusColor: string;
  isSelected: boolean;
}> = ({ radarRef, statusColor, isSelected }) => (
  <group>
    {/* Aircraft Cargo Hangar (Arch Barrel Roof) */}
    <mesh position={[0, 3, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[7, 7, 14, 16, 1, false, 0, Math.PI]} />
      <meshStandardMaterial
        color="#151928"
        roughness={0.4}
        metalness={0.7}
        side={THREE.DoubleSide}
        emissive={isSelected ? '#EC4899' : '#000000'}
        emissiveIntensity={0.2}
      />
    </mesh>

    {/* Air Traffic Control Tower */}
    <group position={[-10, 0, 5]}>
      {/* Tower Stem */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 12, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* 360 Glass Observation Cab */}
      <mesh position={[0, 12.5, 0]}>
        <cylinderGeometry args={[2.2, 1.8, 1.6, 12]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Rotating Radar Dome */}
      <mesh ref={radarRef} position={[0, 14, 0]}>
        <boxGeometry args={[2.4, 0.4, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  </group>
);

/* --- 7. RAIL TERMINAL --- */
const RailTerminalFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Rail Freight Office */}
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[10, 4, 8]} />
      <meshStandardMaterial color="#151928" metalness={0.7} />
    </mesh>
    {/* Gantry Crane Spanning Tracks */}
    <group position={[0, 0, -6]}>
      <mesh position={[-6, 3.5, 0]}>
        <boxGeometry args={[0.5, 7, 0.5]} />
        <meshStandardMaterial color="#6366F1" />
      </mesh>
      <mesh position={[6, 3.5, 0]}>
        <boxGeometry args={[0.5, 7, 0.5]} />
        <meshStandardMaterial color="#6366F1" />
      </mesh>
      <mesh position={[0, 7.2, 0]}>
        <boxGeometry args={[13, 0.6, 1]} />
        <meshStandardMaterial color="#6366F1" />
      </mesh>
    </group>
  </group>
);

/* --- 8. MANUFACTURING PLANT --- */
const ManufacturingFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Sawtooth Factory Hall */}
    <mesh position={[0, 2.5, 0]}>
      <boxGeometry args={[16, 5, 12]} />
      <meshStandardMaterial color="#151928" metalness={0.6} />
    </mesh>
    {/* Twin Industrial Chimneys */}
    <mesh position={[6, 5, -4]}>
      <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    <mesh position={[6, 5, 4]}>
      <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
  </group>
);

/* --- 9. SUPPLIER DEPOT --- */
const SupplierDepotFacility: React.FC<{ statusColor: string; isSelected: boolean }> = ({
  statusColor,
  isSelected,
}) => (
  <group>
    {/* Warehouse Depot */}
    <mesh position={[0, 2, 0]}>
      <boxGeometry args={[10, 4, 8]} />
      <meshStandardMaterial color="#151928" metalness={0.6} />
    </mesh>
    {/* Outdoor Storage Racks */}
    {[-3, 0, 3].map((zOffset, idx) => (
      <mesh key={idx} position={[-7, 1.2, zOffset]}>
        <boxGeometry args={[3, 2.4, 1.2]} />
        <meshStandardMaterial color="#14B8A6" metalness={0.7} />
      </mesh>
    ))}
  </group>
);
