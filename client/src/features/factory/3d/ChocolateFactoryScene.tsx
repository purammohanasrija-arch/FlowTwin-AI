import React from 'react';
import { RawMaterialsZone } from './RawMaterialsZone.js';
import { ChocolateProductionZone } from './ChocolateProductionZone.js';
import { PackagingZone } from './PackagingZone.js';
import { WarehouseStorageZone } from './WarehouseStorageZone.js';
import { DeliveryDockZone } from './DeliveryDockZone.js';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';

interface ChocolateFactorySceneProps {
  onSelectEntity: (entity: any) => void;
  selectedEntityId: string | null;
}

export const ChocolateFactoryScene: React.FC<ChocolateFactorySceneProps> = ({
  onSelectEntity,
  selectedEntityId,
}) => {
  const selectedZone = useChocolateFactoryStore(s => s.selectedZone);

  return (
    <group>
      {/* 1. Factory Main Concrete Slab Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[90, 60]} />
        <meshStandardMaterial
          color="#160E09" // Rich dark industrial chocolate slate
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Grid Floor Lines for Industrial Digital Twin Aesthetic */}
      <gridHelper args={[90, 45, '#78350F', '#2E1910']} position={[0, 0.01, 0]} />

      {/* 2. Factory Outer Structural Columns & Yellow Hazard Safety Strips */}
      {[-38, -12, 12, 38].map((x, i) =>
        [-24, 0, 24].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 5, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 10, 0.8]} />
              <meshStandardMaterial color="#2B1A12" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Safety Yellow Base Band */}
            <mesh position={[0, -4.5, 0]}>
              <boxGeometry args={[0.85, 1.0, 0.85]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.5} />
            </mesh>
          </group>
        ))
      )}

      {/* 3. Interior Connecting Conveyor Duct between Zones */}
      {/* Conveyor from Raw Materials to Production Line */}
      <mesh position={[-15, 1.2, -12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 4.5, 12]} />
        <meshStandardMaterial color="#B45309" metalness={0.8} />
      </mesh>

      {/* Conveyor from Production to Packaging */}
      <mesh position={[4.5, 1.2, -12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 4.5, 12]} />
        <meshStandardMaterial color="#B45309" metalness={0.8} />
      </mesh>

      {/* 4. The 5 Factory Functional Areas */}
      {/* Area 1: Raw Materials (Cocoa, Sugar, Milk) */}
      <RawMaterialsZone
        onSelectEntity={onSelectEntity}
        isSelected={selectedZone === 'storage' || selectedEntityId === 'raw-materials-zone'}
      />

      {/* Area 2: Chocolate Making (Roasting, Conching, Mixing, Tempering, Moulding) */}
      <ChocolateProductionZone
        onSelectEntity={onSelectEntity}
        isSelected={selectedZone === 'production' || selectedEntityId === 'production-zone'}
      />

      {/* Area 3: Packaging & Boxing Area */}
      <PackagingZone
        onSelectEntity={onSelectEntity}
        isSelected={selectedZone === 'packaging' || selectedEntityId === 'packaging-zone'}
      />

      {/* Area 4: Cold Storage Warehouse */}
      <WarehouseStorageZone
        onSelectEntity={onSelectEntity}
        isSelected={selectedZone === 'cold_storage' || selectedEntityId === 'warehouse-zone'}
      />

      {/* Area 5: Loading Docks & Refrigerated Logistics Bay */}
      <DeliveryDockZone
        onSelectEntity={onSelectEntity}
        isSelected={selectedZone === 'delivery' || selectedEntityId === 'delivery-zone'}
      />

      {/* 5. Ambient Factory Atmosphere & Volumetric Lighting */}
      <ambientLight intensity={0.65} color="#FFFBEB" />
      
      {/* Warm Golden Directional Sun & High-Bay Industrial Lights */}
      <directionalLight
        position={[25, 45, 30]}
        intensity={1.3}
        color="#FEF3C7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />

      {/* Soft warm fill lights over machinery */}
      <pointLight position={[-5, 12, -12]} color="#FDE68A" intensity={0.9} distance={30} />
      <pointLight position={[14, 12, -12]} color="#F59E0B" intensity={0.8} distance={30} />
      <pointLight position={[-16, 12, 10]} color="#38BDF8" intensity={0.7} distance={30} />
      <pointLight position={[14, 12, 10]} color="#FCD34D" intensity={0.9} distance={30} />
    </group>
  );
};
