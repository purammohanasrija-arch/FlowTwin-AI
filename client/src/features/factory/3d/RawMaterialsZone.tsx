import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';

interface RawMaterialsZoneProps {
  onSelectEntity: (entity: {
    id: string;
    name: string;
    type: string;
    purpose: string;
    status: string;
    operatingValues: Record<string, string | number>;
    description: string;
  }) => void;
  isSelected: boolean;
}

export const RawMaterialsZone: React.FC<RawMaterialsZoneProps> = ({ onSelectEntity, isSelected }) => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const groupRef = useRef<THREE.Group>(null);

  const handleClickZone = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'raw-materials-zone',
      name: 'Raw Material Intake & Storage Zone',
      type: 'Ingredient Storage',
      purpose: 'Store, meter, and quality-verify raw cocoa beans, crystalline sugar, and milk concentrate before production.',
      status: params.cocoaStockKg < 1500 ? 'Needs Attention (Low Cocoa)' : 'Running',
      operatingValues: {
        'Cocoa Beans Available': `${params.cocoaStockKg.toLocaleString()} kg`,
        'Sugar Inventory': `${params.sugarStockKg.toLocaleString()} kg`,
        'Milk Concentrate': `${params.milkStockLitres.toLocaleString()} L`,
        'Intake Moisture': '4.1% (Safe < 6%)',
        'Storage Climate': '20.5°C / 50% RH',
      },
      description: 'The raw material bay houses single-origin organic cocoa beans in jute sacks and climate silos, food-grade sugar silos, and jacketed dairy tanks.',
    });
  };

  const handleClickCocoaSilo = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'cocoa-silo',
      name: 'Cocoa Bean Storage Silo & Hoppers',
      type: 'Dry Storage Silo',
      purpose: 'Store roasted and unroasted Ecuadorian single-origin cocoa beans with automated vacuum feed to roasters.',
      status: params.cocoaStockKg < 1500 ? 'Low Stock Warning' : 'Optimal',
      operatingValues: {
        'Current Stock': `${params.cocoaStockKg.toLocaleString()} kg`,
        'Daily Consumption Rate': '270 kg/day',
        'Moisture Content': '4.2%',
        'Days of Supply Left': `${Math.max(1, Math.round(params.cocoaStockKg / 270))} days`,
      },
      description: 'Insulated steel silo with dehumidified nitrogen blanket prevents mold and preserves volatile aroma precursor compounds.',
    });
  };

  const handleClickMilkTank = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'milk-tank',
      name: 'Jacketed Milk Ingredient Tank',
      type: 'Liquid Storage Vessel',
      purpose: 'Store fresh condensed milk and whey concentrate at 4°C with continuous paddle agitation.',
      status: 'Optimal',
      operatingValues: {
        'Milk Stock': `${params.milkStockLitres.toLocaleString()} L`,
        'Jacket Temperature': '3.8°C',
        'Agitator Speed': '45 RPM',
        'Viscosity': '180 cP',
      },
      description: 'Sanitary 316L stainless steel tank with CIP (Clean-In-Place) sanitation loop and dual temperature sensors.',
    });
  };

  const handleClickSugarSilo = (e: any) => {
    e.stopPropagation();
    onSelectEntity({
      id: 'sugar-silo',
      name: 'Fine Crystalline Sugar Silo',
      type: 'Bulk Powder Silo',
      purpose: 'Store ultra-fine caster sugar with pneumatic rotary airlock feeders.',
      status: 'Optimal',
      operatingValues: {
        'Sugar Stock': `${params.sugarStockKg.toLocaleString()} kg`,
        'Grain Microns': '120 µm',
        'Flowability Index': '94%',
        'Fill Level': `${Math.min(100, Math.round((params.sugarStockKg / 3000) * 100))}%`,
      },
      description: 'Pneumatically vibrated cone base prevents sugar bridging and ensures constant flow into refining mixers.',
    });
  };

  return (
    <group ref={groupRef} position={[-24, 0, -12]} onClick={handleClickZone}>
      {/* Zone Floor Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 14]} />
        <meshStandardMaterial
          color={isSelected ? '#78350F' : '#2D180F'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Zone Perimeter Guardrails (Caramel/Gold) */}
      <mesh position={[0, 0.5, -6.8]}>
        <boxGeometry args={[15.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[-7.8, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.1, 13.6]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>

      {/* Floating Spatial Label */}
      <Html position={[0, 6.5, 0]} center distanceFactor={28}>
        <div className="pointer-events-none select-none px-3 py-1.5 rounded-lg bg-[#1E100A]/90 border border-amber-500/40 shadow-xl backdrop-blur-md flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-200 tracking-wider uppercase font-mono">
              Raw Materials Storage
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-amber-100/80 font-mono mt-0.5">
            <span>Cocoa: {params.cocoaStockKg.toLocaleString()}kg</span>
            <span>•</span>
            <span>Sugar: {params.sugarStockKg.toLocaleString()}kg</span>
            <span>•</span>
            <span>Milk: {params.milkStockLitres.toLocaleString()}L</span>
          </div>
        </div>
      </Html>

      {/* 1. COCOA BEAN SILO (Large cylindrical tank in deep cocoa bronze) */}
      <group position={[-4, 0, -2]} onClick={handleClickCocoaSilo}>
        {/* Main Silo Body */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <cylinderGeometry args={[2.2, 2.2, 7, 24]} />
          <meshStandardMaterial color="#5C3317" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Conical Roof */}
        <mesh position={[0, 7.8, 0]} castShadow>
          <coneGeometry args={[2.3, 1.6, 24]} />
          <meshStandardMaterial color="#78350F" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Support Legs */}
        {[-1.6, 1.6].map((x, i) =>
          [-1.6, 1.6].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 1, z]}>
              <cylinderGeometry args={[0.12, 0.12, 2, 8]} />
              <meshStandardMaterial color="#382114" metalness={0.8} />
            </mesh>
          ))
        )}
        {/* Level Indicator Stripe */}
        <mesh position={[0, 4.2, 2.22]}>
          <boxGeometry args={[0.3, 4, 0.05]} />
          <meshStandardMaterial color="#F59E0B" emissive="#B45309" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 2. SUGAR SILO (Tall cream/silver cylinder) */}
      <group position={[3.5, 0, -2.5]} onClick={handleClickSugarSilo}>
        <mesh position={[0, 3.2, 0]} castShadow>
          <cylinderGeometry args={[1.8, 1.8, 6.4, 24]} />
          <meshStandardMaterial color="#ECE4D8" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 7.1, 0]} castShadow>
          <coneGeometry args={[1.9, 1.4, 24]} />
          <meshStandardMaterial color="#D5C7B4" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Feed pipe to ground */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.6, 12]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.9} />
        </mesh>
      </group>

      {/* 3. MILK INGREDIENT TANK (Stainless steel jacketed vat) */}
      <group position={[3.5, 0, 3]} onClick={handleClickMilkTank}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[1.6, 1.6, 4, 20]} />
          <meshStandardMaterial color="#D1D5DB" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Top Dome */}
        <mesh position={[0, 4.1, 0]} castShadow>
          <sphereGeometry args={[1.6, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#E5E7EB" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Blue Sanitary Piping */}
        <mesh position={[1.7, 2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.5} />
        </mesh>
      </group>

      {/* 4. COCOA BEAN SACKS ON PALLETS (Stacked burlap sacks) */}
      <group position={[-4, 0, 3]}>
        {/* Wooden Pallet */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[3.2, 0.3, 2.4]} />
          <meshStandardMaterial color="#92400E" roughness={0.9} />
        </mesh>
        {/* Sacks Layer 1 */}
        {[-0.9, 0, 0.9].map((x, i) => (
          <mesh key={i} position={[x, 0.55, 0]} castShadow>
            <boxGeometry args={[0.85, 0.5, 1.8]} />
            <meshStandardMaterial color="#A16207" roughness={0.95} />
          </mesh>
        ))}
        {/* Sacks Layer 2 */}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 1.05, 0]} castShadow>
            <boxGeometry args={[0.9, 0.5, 1.7]} />
            <meshStandardMaterial color="#854D0E" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
