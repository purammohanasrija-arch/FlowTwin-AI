import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { ExplodedLayerId, GraphLayoutMode } from './types.js';

interface ExplodedNodeDef {
  id: string;
  name: string;
  layer: number;
  layerId: ExplodedLayerId;
  color: string;
  entityType: 'supplier' | 'manufacturing' | 'facility' | 'vehicle' | 'route' | 'shipment' | 'document' | 'incident';
  status: 'optimal' | 'congested' | 'delayed' | 'critical' | 'verified';
  metric: string;
  geoPos: [number, number, number]; // Ground position when collapsed
  data: any;
}

interface ExplodedLinkDef {
  fromId: string;
  toId: string;
  color: string;
  isCritical?: boolean;
  flowSpeed?: number;
}

// 7 Defined Logical Chocolate Process Layers
const LAYERS_INFO: {
  level: number;
  id: ExplodedLayerId;
  name: string;
  subtitle: string;
  color: string;
}[] = [
  { level: 1, id: 'suppliers', name: '1. Single-Origin Cocoa & Sugar Estates', subtitle: 'Criollo/Trinitario Bean Plantations, Pure Cane Sugar, Vanilla', color: '#14B8A6' },
  { level: 2, id: 'manufacturing', name: '2. Cocoa Butter Press & Winnowing', subtitle: '500-Bar Hydraulic Fat Presses & Nib Separators', color: '#F97316' },
  { level: 3, id: 'warehouses', name: '3. Conching Vats & Tempering Plants', subtitle: '48h Conching Tanks, Tempering Loops & Gold Vaults', color: '#3B82F6' },
  { level: 4, id: 'transport', name: '4. Heated Jacketed Pipelines & Fleets', subtitle: 'Continuous Heated Corridors & Steam-Jacketed Tankers', color: '#8B5CF6' },
  { level: 5, id: 'cargo', name: '5. Artisan Batches & Couverture Runs', subtitle: '72% Dark Couverture, Praline Truffles & Liquid Cocoa Butter', color: '#00F5FF' },
  { level: 6, id: 'documents', name: '6. Viscosity & Temper Metrology Docs', subtitle: 'Beta-V Crystal Curves, HACCP Cleanroom & Fair-Trade Certs', color: '#10B981' },
  { level: 7, id: 'disruptions', name: '7. Viscosity Freeze & Thermal Hazards', subtitle: 'Pipe Heater Failures, Solidification & Recirculation Detours', color: '#EF4444' },
];

export const ExplodedSupplyChainGraph: React.FC = () => {
  const explodedGraph = useDigitalTwinStore(s => s.explodedGraph);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const setBlastRadiusNode = useDigitalTwinStore(s => s.setBlastRadiusNode);

  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Nodes across all 7 layers with chocolate manufacturing context
  const nodes: ExplodedNodeDef[] = useMemo(
    () => [
      // Layer 1: Suppliers
      {
        id: 'SUPP-ROCKY',
        name: 'Hacienda San José Criollo Estate',
        layer: 1,
        layerId: 'suppliers',
        color: '#14B8A6',
        entityType: 'supplier',
        status: 'optimal',
        metric: '99.2% Single-Origin Criollo',
        geoPos: [-30, 0, -26],
        data: { supplierCode: 'SUPP-ROCKY', location: 'Los Ríos, Ecuador', material: 'Fermented Criollo Cocoa Beans' },
      },
      {
        id: 'SUPP-DETROIT',
        name: 'Madagascar Bourbon Vanilla & Sugar Mill',
        layer: 1,
        layerId: 'suppliers',
        color: '#14B8A6',
        entityType: 'supplier',
        status: 'optimal',
        metric: '100% Organic Cane Sugar',
        geoPos: [36, 0, 28],
        data: { supplierCode: 'SUPP-DETROIT', location: 'Sambava, Madagascar', material: 'Grade-A Bourbon Vanilla Beans' },
      },
      {
        id: 'SUPP-PACIFIC',
        name: 'Alpine Grass-Fed Dairy Solids',
        layer: 1,
        layerId: 'suppliers',
        color: '#14B8A6',
        entityType: 'supplier',
        status: 'optimal',
        metric: '99.8% Spray-Dried Milk Solids',
        geoPos: [-42, 0, -32],
        data: { supplierCode: 'SUPP-PACIFIC', location: 'Bernese Oberland', material: 'Whole Milk Powder & Anhydrous Milkfat' },
      },

      // Layer 2: Manufacturing
      {
        id: 'MFG-PLANT-01',
        name: 'Stage 4: Cocoa Butter Hydraulic Press Unit',
        layer: 2,
        layerId: 'manufacturing',
        color: '#F97316',
        entityType: 'manufacturing',
        status: 'optimal',
        metric: '500-Bar Extraction Active',
        geoPos: [-12, 0, -10],
        data: { facilityCode: 'MFG-PLANT-01', location: 'Cocoa Butter Press Bay' },
      },
      {
        id: 'MFG-PLANT-02',
        name: 'Stage 9: Praline Enrobing & Bar Molding Line',
        layer: 2,
        layerId: 'manufacturing',
        color: '#F97316',
        entityType: 'manufacturing',
        status: 'congested',
        metric: '92% Molding Capacity',
        geoPos: [20, 0, 10],
        data: { facilityCode: 'MFG-PLANT-02', location: 'Molding & Enrobing Plant' },
      },

      // Layer 3: Warehouses & Hubs
      {
        id: 'FAC-CHI-01',
        name: 'Stage 6: Conching & Refining Plant',
        layer: 3,
        layerId: 'warehouses',
        color: '#3B82F6',
        entityType: 'facility',
        status: 'congested',
        metric: '86.4% Tank Load (72.4°C)',
        geoPos: [0, 0, -18],
        data: { facilityCode: 'FAC-CHI-01', type: 'Conching & Refining Plant' },
      },
      {
        id: 'FAC-NYC-02',
        name: 'Stage 10: Packaging & Cold Vault',
        layer: 3,
        layerId: 'warehouses',
        color: '#3B82F6',
        entityType: 'facility',
        status: 'optimal',
        metric: '18.0°C Vault Storage',
        geoPos: [44, 0, -8],
        data: { facilityCode: 'FAC-NYC-02', type: 'Packaging & Vault' },
      },
      {
        id: 'FAC-LAX-03',
        name: 'Stage 1: Raw Bean Silos & Harbor',
        layer: 3,
        layerId: 'warehouses',
        color: '#06B6D4',
        entityType: 'facility',
        status: 'optimal',
        metric: '750 Bags/h Silo Inbound',
        geoPos: [-46, 0, 10],
        data: { facilityCode: 'FAC-LAX-03', type: 'Cocoa Bean Harbor Berth' },
      },
      {
        id: 'FAC-AIR-07',
        name: 'Stage 5: Dairy & Sugar Blending Hub',
        layer: 3,
        layerId: 'warehouses',
        color: '#EC4899',
        entityType: 'facility',
        status: 'optimal',
        metric: '600 kg/h Micro-Refining',
        geoPos: [22, 0, -32],
        data: { facilityCode: 'FAC-AIR-07', type: 'Ingredient Blending Facility' },
      },

      // Layer 4: Transport Fleet & Corridors
      {
        id: 'TRK-101',
        name: 'Tanker TK-101 (Liquid Dark Couverture)',
        layer: 4,
        layerId: 'transport',
        color: '#EF4444',
        entityType: 'vehicle',
        status: 'delayed',
        metric: 'Viscosity Spike (Jacket Cold)',
        geoPos: [4, 0.5, -2],
        data: { vehicleCode: 'TRK-101', carrier: 'Jacketed Couverture Tankers', isDelayed: true },
      },
      {
        id: 'TRK-204',
        name: 'Shuttle TRK-204 (Finished Artisan Bars)',
        layer: 4,
        layerId: 'transport',
        color: '#8B5CF6',
        entityType: 'vehicle',
        status: 'optimal',
        metric: '18°C Controlled Transit',
        geoPos: [14, 0.5, 4],
        data: { vehicleCode: 'TRK-204', carrier: 'Climate Express Logistics' },
      },
      {
        id: 'CORR-I80',
        name: 'Jacketed Pipe Main Section (Stage 6 -> Stage 10)',
        layer: 4,
        layerId: 'transport',
        color: '#EF4444',
        entityType: 'route',
        status: 'critical',
        metric: 'HEATER FAULT (Solidifying 16.5°C)',
        geoPos: [2, 0.5, -6],
        data: { routeCode: 'ROUTE-I80-MW', isClosed: true },
      },
      {
        id: 'CORR-I70',
        name: 'South Heated Jacketed Bypass Pipe (32°C Loop)',
        layer: 4,
        layerId: 'transport',
        color: '#A855F7',
        entityType: 'route',
        status: 'optimal',
        metric: 'BYPASS ACTIVE (Flow Restored)',
        geoPos: [12, 0.5, 6],
        data: { routeCode: 'ROUTE-I70-BYPASS', isAlternative: true },
      },

      // Layer 5: Shipments & Consignments
      {
        id: 'SH-1042',
        name: 'SH-1042: Artisan 72% Dark Couverture Mass',
        layer: 5,
        layerId: 'cargo',
        color: '#00F5FF',
        entityType: 'shipment',
        status: 'delayed',
        metric: 'Target Temp 48°C (+16.5h Freeze Delay)',
        geoPos: [4, 1, -2],
        data: { shipmentId: 'SH-1042', targetTemp: '48°C', valueUSD: 240000 },
      },
      {
        id: 'SH-1043',
        name: 'SH-1043: Pure Deodorized Cocoa Butter Run',
        layer: 5,
        layerId: 'cargo',
        color: '#00F5FF',
        entityType: 'shipment',
        status: 'optimal',
        metric: 'Liquid Butter (42°C)',
        geoPos: [16, 1, 2],
        data: { shipmentId: 'SH-1043', targetTemp: '42°C', valueUSD: 185000 },
      },
      {
        id: 'SH-1045',
        name: 'SH-1045: Roasted Cocoa Nibs & Powder Sacks',
        layer: 5,
        layerId: 'cargo',
        color: '#00F5FF',
        entityType: 'shipment',
        status: 'optimal',
        metric: 'Moisture < 1.2% (SLA 99.8%)',
        geoPos: [-8, 1, -6],
        data: { shipmentId: 'SH-1045', targetTemp: '20°C', valueUSD: 95000 },
      },

      // Layer 6: Documentation & Customs
      {
        id: 'DOC-BOL-01',
        name: 'Single-Origin Criollo Fair-Trade Certificate',
        layer: 6,
        layerId: 'documents',
        color: '#10B981',
        entityType: 'document',
        status: 'verified',
        metric: 'Organic & Fair-Trade Cleared',
        geoPos: [-4, 1.5, -4],
        data: { docId: 'DOC-BOL-01', title: 'Fair-Trade Origin Certification' },
      },
      {
        id: 'DOC-TEMP-01',
        name: 'Beta Form-V Crystal Tempering Curve (31.5°C)',
        layer: 6,
        layerId: 'documents',
        color: '#10B981',
        entityType: 'document',
        status: 'optimal',
        metric: 'Tempering Index 4.8 (Glossy Snap)',
        geoPos: [4, 1.5, -4],
        data: { docId: 'DOC-TEMP-01', title: 'Tempering Spectrometry Log' },
      },
      {
        id: 'DOC-HAZ-01',
        name: 'Conching Viscosity Metrology (3,450 cP)',
        layer: 6,
        layerId: 'documents',
        color: '#F59E0B',
        entityType: 'document',
        status: 'verified',
        metric: 'Rheometer Viscosity Verified',
        geoPos: [14, 1.5, 4],
        data: { docId: 'DOC-HAZ-01', title: 'Couverture Viscosity Telemetry' },
      },

      // Layer 7: Disruptions & Hazards
      {
        id: 'INC-BLIZZ-01',
        name: 'Jacketed Line Section 4 Thermal Freeze Hazard',
        layer: 7,
        layerId: 'disruptions',
        color: '#EF4444',
        entityType: 'incident',
        status: 'critical',
        metric: 'Solidification Alert (+16.5h Delay)',
        geoPos: [4, 2, -2],
        data: { incidentCode: 'INC-BLIZZ-01', severity: 'critical' },
      },
      {
        id: 'INC-CONG-02',
        name: 'Conching Vat #3 Agitator Shear Torque Warning',
        layer: 7,
        layerId: 'disruptions',
        color: '#F59E0B',
        entityType: 'incident',
        status: 'congested',
        metric: 'Viscosity Rise (Torque 94%)',
        geoPos: [0, 2, -18],
        data: { incidentCode: 'INC-CONG-02', severity: 'medium' },
      },
    ],
    []
  );

  // Cross-layer dependency edges
  const links: ExplodedLinkDef[] = useMemo(
    () => [
      // Layer 1 -> Layer 2
      { fromId: 'SUPP-ROCKY', toId: 'MFG-PLANT-01', color: '#14B8A6' },
      { fromId: 'SUPP-DETROIT', toId: 'MFG-PLANT-02', color: '#14B8A6' },
      { fromId: 'SUPP-PACIFIC', toId: 'MFG-PLANT-01', color: '#14B8A6' },

      // Layer 2 -> Layer 3
      { fromId: 'MFG-PLANT-01', toId: 'FAC-CHI-01', color: '#F97316' },
      { fromId: 'MFG-PLANT-02', toId: 'FAC-CHI-01', color: '#F97316' },
      { fromId: 'MFG-PLANT-01', toId: 'FAC-AIR-07', color: '#F97316' },

      // Layer 3 -> Layer 4
      { fromId: 'FAC-CHI-01', toId: 'TRK-101', color: '#3B82F6' },
      { fromId: 'FAC-CHI-01', toId: 'TRK-204', color: '#3B82F6' },
      { fromId: 'TRK-101', toId: 'CORR-I80', color: '#EF4444', isCritical: true },
      { fromId: 'TRK-101', toId: 'CORR-I70', color: '#A855F7' },
      { fromId: 'TRK-204', toId: 'FAC-NYC-02', color: '#3B82F6' },

      // Layer 4 -> Layer 5
      { fromId: 'TRK-101', toId: 'SH-1042', color: '#00F5FF', isCritical: true },
      { fromId: 'TRK-204', toId: 'SH-1043', color: '#00F5FF' },
      { fromId: 'FAC-AIR-07', toId: 'SH-1045', color: '#00F5FF' },

      // Layer 5 -> Layer 6
      { fromId: 'SH-1042', toId: 'DOC-BOL-01', color: '#10B981', isCritical: true },
      { fromId: 'SH-1042', toId: 'DOC-TEMP-01', color: '#10B981', isCritical: true },
      { fromId: 'SH-1043', toId: 'DOC-HAZ-01', color: '#F59E0B' },

      // Layer 5 / 4 -> Layer 7 (Disruptions)
      { fromId: 'CORR-I80', toId: 'INC-BLIZZ-01', color: '#EF4444', isCritical: true },
      { fromId: 'SH-1042', toId: 'INC-BLIZZ-01', color: '#EF4444', isCritical: true },
      { fromId: 'FAC-CHI-01', toId: 'INC-CONG-02', color: '#F59E0B' },
    ],
    []
  );

  // Compute blast radius ancestors and descendants
  const blastRadiusNodeIds = useMemo(() => {
    const targetId = explodedGraph.highlightedBlastRadiusNodeId || selectedEntity?.id;
    if (!targetId) return null;

    const set = new Set<string>();
    set.add(targetId);

    // Forward traverse (descendants)
    const queue = [targetId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      links.forEach(link => {
        if (link.fromId === curr && !set.has(link.toId)) {
          set.add(link.toId);
          queue.push(link.toId);
        }
      });
    }

    // Backward traverse (ancestors)
    const backQueue = [targetId];
    while (backQueue.length > 0) {
      const curr = backQueue.shift()!;
      links.forEach(link => {
        if (link.toId === curr && !set.has(link.fromId)) {
          set.add(link.fromId);
          backQueue.push(link.fromId);
        }
      });
    }

    return set;
  }, [explodedGraph.highlightedBlastRadiusNodeId, selectedEntity?.id, links]);

  // Compute target 3D layout coordinates based on mode & explosionSpread
  const layoutMode = explodedGraph.layoutMode || 'stacked';
  const spread = explodedGraph.explosionSpread ?? 1.0;

  const targetPositions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();

    // Count nodes per layer for angular / linear distribution
    const layerNodesCount = new Map<number, number>();
    const layerNodesIndex = new Map<string, number>();

    nodes.forEach(n => {
      const count = layerNodesCount.get(n.layer) || 0;
      layerNodesIndex.set(n.id, count);
      layerNodesCount.set(n.layer, count + 1);
    });

    nodes.forEach(node => {
      const idx = layerNodesIndex.get(node.id) || 0;
      const count = layerNodesCount.get(node.layer) || 1;
      const L = node.layer;

      let target: [number, number, number] = [0, 0, 0];

      if (layoutMode === 'stacked') {
        // Stratified 3D Exploded Planes
        // At spread == 0, nodes collapse smoothly to their geographical positions on the map!
        const geo = node.geoPos;
        const explodedY = (L - 1) * 11.5 * spread;
        const explodedX = ((idx - (count - 1) / 2) * 16) + (L % 2 === 0 ? 3 : -3);
        const explodedZ = (idx % 2 === 0 ? -6 : 6) + (L * 1.5 - 6);

        target = [
          THREE.MathUtils.lerp(geo[0], explodedX, spread),
          THREE.MathUtils.lerp(geo[1] + 0.5, explodedY, spread),
          THREE.MathUtils.lerp(geo[2], explodedZ, spread),
        ];
      } else if (layoutMode === 'radial') {
        // Cylindrical Orbital Ring Layout
        const ringRadius = 14 + (L - 1) * 3.6;
        const ringY = (L - 1) * 8.2 * spread;
        const angle = ((2 * Math.PI * idx) / count) + (L * 0.42);

        target = [
          Math.cos(angle) * ringRadius,
          ringY,
          Math.sin(angle) * ringRadius,
        ];
      } else if (layoutMode === 'dag_tree') {
        // Hierarchical 3D Flow DAG Tree (Left-to-Right Pipeline)
        const xPos = (L - 4) * 14.5 * spread;
        const yPos = ((idx - (count - 1) / 2) * 8.5) + 26;
        const zPos = Math.sin(idx * 1.6 + L) * 9;

        target = [xPos, yPos, zPos];
      } else {
        // Force-Clustered Physics Layout
        const baseY = (L - 1) * 10 * spread;
        const angle = (idx / count) * Math.PI * 2 + (L * 0.7);
        const dist = 12 + Math.sin(L * 2) * 5;

        target = [
          Math.cos(angle) * dist,
          baseY,
          Math.sin(angle) * dist,
        ];
      }

      posMap.set(node.id, target);
    });

    return posMap;
  }, [nodes, layoutMode, spread]);

  // Current interpolated positions for ultra-smooth 60fps transitions
  const currentPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // Data flow pulse packet simulation (travels along links)
  const [pulseTime, setPulseTime] = useState(0);

  useFrame((_, delta) => {
    if (!explodedGraph.active) return;
    const dt = Math.min(delta, 0.1);

    // Auto rotate if active
    if (explodedGraph.autoRotate && groupRef.current) {
      groupRef.current.rotation.y += dt * 0.15;
    }

    // Advance pulse packet clock
    if (explodedGraph.linkFlowActive) {
      setPulseTime(prev => (prev + dt * 1.8) % 1.0);
    }

    // Interpolate positions toward target
    nodes.forEach(node => {
      const targetArr = targetPositions.get(node.id) || [0, 0, 0];
      const targetVec = new THREE.Vector3(...targetArr);
      let curr = currentPositionsRef.current.get(node.id);

      if (!curr) {
        curr = targetVec.clone();
        currentPositionsRef.current.set(node.id, curr);
      } else {
        curr.lerp(targetVec, 0.12);
      }
    });
  });

  if (!explodedGraph.active) return null;

  return (
    <group ref={groupRef} name="ExplodedSupplyChainGraph">
      {/* 1. SEVEN HOLOGRAPHIC SPATIAL LAYER FLOORS (In Stacked Mode) */}
      {layoutMode === 'stacked' &&
        LAYERS_INFO.map(layer => {
          const isLayerSoloed =
            explodedGraph.activeLayer &&
            explodedGraph.activeLayer !== 'all' &&
            explodedGraph.activeLayer === layer.id;
          const isAnySolo =
            explodedGraph.activeLayer && explodedGraph.activeLayer !== 'all';
          const layerOpacity = isLayerSoloed ? 0.3 : isAnySolo ? 0.02 : 0.08;
          const layerElevation = (layer.level - 1) * 11.5 * spread;

          return (
            <group key={layer.id} position={[0, layerElevation, 0]}>
              {/* Holographic Wireframe Grid Floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[74, 46, 14, 10]} />
                <meshBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={layerOpacity}
                  wireframe
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Glowing Laser Border Frame */}
              <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(74, 46)]} />
                <lineBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={isLayerSoloed ? 0.8 : 0.4}
                />
              </lineSegments>

              {/* Holographic Corner Accent Brackets */}
              {[-37, 37].map(cx =>
                [-23, 23].map(cz => (
                  <mesh key={`${cx}-${cz}`} position={[cx, 0.1, cz]}>
                    <boxGeometry args={[1.8, 0.2, 1.8]} />
                    <meshBasicMaterial color={layer.color} transparent opacity={0.7} />
                  </mesh>
                ))
              )}

              {/* 3D Billboard Layer Title on Floating Floor */}
              <group position={[-35, 0.4, 21]}>
                <Html
                  center={false}
                  distanceFactor={55}
                  zIndexRange={[5, 0]}
                  className="pointer-events-none select-none"
                >
                  <div
                    className={`px-3 py-1 rounded-lg backdrop-blur-md border text-[11px] font-mono whitespace-nowrap transition-all ${
                      isLayerSoloed
                        ? 'bg-purple-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,245,255,0.4)] scale-105'
                        : 'bg-[#0A0D1E]/80 border-[#232B4E] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="font-bold uppercase tracking-wider">
                        {layer.name}
                      </span>
                      <span className="text-gray-400 font-normal">
                        — {layer.subtitle}
                      </span>
                    </div>
                  </div>
                </Html>
              </group>
            </group>
          );
        })}

      {/* 2. RADIAL ORBIT CONCENTRIC CYLINDER RINGS (In Radial Mode) */}
      {layoutMode === 'radial' &&
        LAYERS_INFO.map(layer => {
          const ringRadius = 14 + (layer.level - 1) * 3.6;
          const ringY = (layer.level - 1) * 8.2 * spread;

          return (
            <group key={layer.id} position={[0, ringY, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[ringRadius - 0.2, ringRadius + 0.2, 64]} />
                <meshBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

      {/* 3. 3D CURVED DEPENDENCY LINKS & ANIMATED ENERGY PULSES */}
      {links.map((link, idx) => {
        const fromNode = nodes.find(n => n.id === link.fromId);
        const toNode = nodes.find(n => n.id === link.toId);
        if (!fromNode || !toNode) return null;

        const p1 = currentPositionsRef.current.get(fromNode.id) || new THREE.Vector3(...(targetPositions.get(fromNode.id) || [0, 0, 0]));
        const p2 = currentPositionsRef.current.get(toNode.id) || new THREE.Vector3(...(targetPositions.get(toNode.id) || [0, 0, 0]));

        // Calculate smooth 3D control point with arching elevation
        const midX = (p1.x + p2.x) / 2 + (idx % 2 === 0 ? 2 : -2);
        const midY = Math.max(p1.y, p2.y) + 3.0;
        const midZ = (p1.z + p2.z) / 2;
        const control = new THREE.Vector3(midX, midY, midZ);

        const curve = new THREE.QuadraticBezierCurve3(p1, control, p2);
        const points = curve.getPoints(24);
        const geom = new THREE.BufferGeometry().setFromPoints(points);

        // Check if link is highlighted by selection, hover, or blast radius
        const isHovered =
          hoveredNodeId === link.fromId || hoveredNodeId === link.toId;
        const isSelected =
          selectedEntity?.id === link.fromId || selectedEntity?.id === link.toId;
        const isBlast =
          blastRadiusNodeIds?.has(link.fromId) && blastRadiusNodeIds?.has(link.toId);

        const isHighlighted = isHovered || isSelected || isBlast || link.isCritical;

        // Position of data packet pulse sphere along bezier curve
        const pulsePos = curve.getPoint((pulseTime + idx * 0.12) % 1.0);

        return (
          <group key={`link-${idx}`}>
            {/* The dependency spline line */}
            <line {...({ geometry: geom } as any)}>
              <lineBasicMaterial
                color={isBlast ? '#EF4444' : link.color}
                transparent
                opacity={isHighlighted ? 0.95 : blastRadiusNodeIds ? 0.12 : 0.3}
                linewidth={isHighlighted ? 3 : 1}
              />
            </line>

            {/* Flow packet traveling along spline */}
            {explodedGraph.linkFlowActive && (
              <mesh position={pulsePos}>
                <sphereGeometry args={[isHighlighted ? 0.45 : 0.28, 12, 12]} />
                <meshBasicMaterial
                  color={isBlast ? '#EF4444' : link.color}
                  transparent
                  opacity={isHighlighted ? 0.95 : 0.6}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 4. INTERACTIVE 3D NODES ON PLANES */}
      {nodes.map(node => {
        const isSelected = selectedEntity?.id === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isBlast = blastRadiusNodeIds?.has(node.id);
        const isDimmed = blastRadiusNodeIds !== null && !isBlast;

        const isLayerFiltered =
          explodedGraph.activeLayer &&
          explodedGraph.activeLayer !== 'all' &&
          explodedGraph.activeLayer !== node.layerId;

        if (isLayerFiltered) return null;

        const currentPos = currentPositionsRef.current.get(node.id) || new THREE.Vector3(...(targetPositions.get(node.id) || [0, 0, 0]));

        return (
          <group
            key={node.id}
            position={currentPos}
            onClick={e => {
              e.stopPropagation();
              selectEntity({
                type: node.entityType as any,
                id: node.id,
                data: node.data,
              });
              setBlastRadiusNode(node.id);
            }}
            onPointerOver={e => {
              e.stopPropagation();
              setHoveredNodeId(node.id);
            }}
            onPointerOut={() => setHoveredNodeId(null)}
          >
            {/* Holographic Glowing Central Geometry */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
              {node.entityType === 'incident' ? (
                <octahedronGeometry args={[1.5, 0]} />
              ) : node.entityType === 'shipment' ? (
                <dodecahedronGeometry args={[1.3, 0]} />
              ) : node.entityType === 'facility' ? (
                <boxGeometry args={[1.7, 1.7, 1.7]} />
              ) : (
                <boxGeometry args={[1.3, 1.3, 1.3]} />
              )}
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={
                  isSelected || isBlast ? 0.95 : isHovered ? 0.7 : 0.35
                }
                metalness={0.7}
                roughness={0.2}
                transparent={isDimmed}
                opacity={isDimmed ? 0.25 : 1.0}
              />
            </mesh>

            {/* Orbiting Gyroscope Halo Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.7, 2.1, 24]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={isSelected || isBlast ? 0.95 : isHovered ? 0.7 : 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Pulsating Blast Radius Shockwave Wave */}
            {(isBlast || isSelected) && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.3, 2.6, 24]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Floating 3D Spatial Badge Label */}
            <group position={[0, 2.2, 0]}>
              <Html
                center
                distanceFactor={40}
                zIndexRange={[10, 0]}
                className="pointer-events-auto select-none"
              >
                <div
                  onClick={() => {
                    selectEntity({
                      type: node.entityType as any,
                      id: node.id,
                      data: node.data,
                    });
                    setBlastRadiusNode(node.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap backdrop-blur-xl border cursor-pointer transition-all ${
                    isSelected || isBlast
                      ? 'bg-purple-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(0,245,255,0.5)] scale-110'
                      : isHovered
                      ? 'bg-[#0E1222]/90 border-purple-400 text-white scale-105'
                      : 'bg-[#090D1E]/80 border-[#232B4E] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'optimal' || node.status === 'verified'
                          ? 'bg-emerald-400'
                          : node.status === 'congested'
                          ? 'bg-amber-400'
                          : 'bg-red-400 animate-ping'
                      }`}
                    />
                    <span>{node.id}</span>
                    <span className="text-gray-400 font-normal">| {node.name.split(':')[0]}</span>
                    <span
                      className={`text-[9px] font-semibold px-1 rounded ${
                        node.status === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-cyan-500/15 text-cyan-300'
                      }`}
                    >
                      {node.metric}
                    </span>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default ExplodedSupplyChainGraph;
