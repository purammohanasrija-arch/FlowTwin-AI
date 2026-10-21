import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

interface ConnectionDef {
  id: string;
  sourceName: string;
  targetName: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  color: string;
  arcHeight: number;
  label: string;
  isDisrupted?: boolean;
  isBypass?: boolean;
  speed?: number;
}

export const NetworkConnections3D: React.FC = () => {
  const facilities = useDigitalTwinStore(s => s.facilities);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const layers = useDigitalTwinStore(s => s.layers);

  // Derive dynamic 3D connections from current simulation state
  const connections: ConnectionDef[] = useMemo(() => {
    const list: ConnectionDef[] = [];

    const chi = facilities.find(f => f.facilityCode === 'FAC-CHI-01');
    const nyc = facilities.find(f => f.facilityCode === 'FAC-NYC-02');
    const lax = facilities.find(f => f.facilityCode === 'FAC-LAX-03');
    const dal = facilities.find(f => f.facilityCode === 'FAC-DAL-04');
    const atl = facilities.find(f => f.facilityCode === 'FAC-ATL-05');
    const sea = facilities.find(f => f.facilityCode === 'FAC-SEA-06');

    const trk101 = vehicles.find(v => v.vehicleCode === 'TRK-101');
    const trk204 = vehicles.find(v => v.vehicleCode === 'TRK-204');
    const trk305 = vehicles.find(v => v.vehicleCode === 'TRK-305');
    const trk512 = vehicles.find(v => v.vehicleCode === 'TRK-512');

    const air = facilities.find(f => f.facilityCode === 'FAC-AIR-07');
    const rail = facilities.find(f => f.facilityCode === 'FAC-RAIL-08');
    const mfg = facilities.find(f => f.facilityCode === 'FAC-MFG-09');
    const supp = facilities.find(f => f.facilityCode === 'FAC-SUPP-10');

    // 1. Chicago Central Hub -> Tractor TRK-101 (Assigned Dispatch)
    if (chi && trk101) {
      list.push({
        id: 'conn-chi-trk101',
        sourceName: 'Chicago Central Hub',
        targetName: 'Tractor TRK-101 (I-80)',
        sourcePos: [chi.position3D[0], chi.position3D[1] + 4, chi.position3D[2]],
        targetPos: [trk101.position3D[0], trk101.position3D[1] + 2, trk101.position3D[2]],
        color: isDisruptionActive ? '#EF4444' : '#00F5FF',
        arcHeight: 7.5,
        label: isDisruptionActive ? 'I-80 Corridor: Weather Alert' : 'I-80 Express Dispatch',
        isDisrupted: isDisruptionActive,
        speed: isDisruptionActive ? 0.2 : 0.8,
      });
    }

    // 2. Chicago Central Hub -> Tractor TRK-204 (Active Haul)
    if (chi && trk204) {
      list.push({
        id: 'conn-chi-trk204',
        sourceName: 'Chicago Central Hub',
        targetName: 'Tractor TRK-204 (I-70)',
        sourcePos: [chi.position3D[0], chi.position3D[1] + 4, chi.position3D[2]],
        targetPos: [trk204.position3D[0], trk204.position3D[1] + 2, trk204.position3D[2]],
        color: '#06B6D4',
        arcHeight: 6.0,
        label: 'I-70 Active Freight Link',
        speed: 0.6,
      });
    }

    // 3. Pacific Maritime Port -> Tractor TRK-204 (Intermodal Rail Handoff)
    if (lax && trk204) {
      list.push({
        id: 'conn-lax-trk204',
        sourceName: 'Pacific Maritime Port',
        targetName: 'Tractor TRK-204',
        sourcePos: [lax.position3D[0], lax.position3D[1] + 4, lax.position3D[2]],
        targetPos: [trk204.position3D[0], trk204.position3D[1] + 2, trk204.position3D[2]],
        color: '#10B981',
        arcHeight: 9.0,
        label: 'Intermodal Container Feeder',
        speed: 0.5,
      });
    }

    // 4. Tractor TRK-101 -> New York Atlantic Gateway (Scheduled Delivery Target)
    if (trk101 && nyc) {
      list.push({
        id: 'conn-trk101-nyc',
        sourceName: 'Tractor TRK-101',
        targetName: 'New York Atlantic Gateway',
        sourcePos: [trk101.position3D[0], trk101.position3D[1] + 2, trk101.position3D[2]],
        targetPos: [nyc.position3D[0], nyc.position3D[1] + 4, nyc.position3D[2]],
        color: isDisruptionActive ? '#EF4444' : '#3B82F6',
        arcHeight: 8.0,
        label: isDisruptionActive ? 'Delay +4.5h to NY Gateway' : 'Scheduled Inbound: NY Hub',
        isDisrupted: isDisruptionActive,
        speed: isDisruptionActive ? 0.15 : 0.7,
      });
    }

    // 5. Tractor TRK-204 -> New York Atlantic Gateway (Cross-Dock Cargo)
    if (trk204 && nyc) {
      list.push({
        id: 'conn-trk204-nyc',
        sourceName: 'Tractor TRK-204',
        targetName: 'New York Atlantic Gateway',
        sourcePos: [trk204.position3D[0], trk204.position3D[1] + 2, trk204.position3D[2]],
        targetPos: [nyc.position3D[0], nyc.position3D[1] + 4, nyc.position3D[2]],
        color: '#8B5CF6',
        arcHeight: 7.0,
        label: 'Cold-Chain Vaccines Handoff',
        speed: 0.6,
      });
    }

    // 6. Seattle Maritime -> Chicago Central (I-90 Freight Arc)
    if (sea && chi) {
      list.push({
        id: 'conn-sea-chi',
        sourceName: 'Puget Sound Terminal',
        targetName: 'Chicago Mega-Warehouse',
        sourcePos: [sea.position3D[0], sea.position3D[1] + 4, sea.position3D[2]],
        targetPos: [chi.position3D[0], chi.position3D[1] + 4, chi.position3D[2]],
        color: '#0EA5E9',
        arcHeight: 11.0,
        label: 'I-90 Northern Rail Arc (Optimal)',
        speed: 0.5,
      });
    }

    // 7. Dallas Inland Depot -> Atlanta Sorting Center (I-20 Expressway)
    if (dal && atl) {
      list.push({
        id: 'conn-dal-atl',
        sourceName: 'Dallas Inland Depot',
        targetName: 'Atlanta Sorting Center',
        sourcePos: [dal.position3D[0], dal.position3D[1] + 4, dal.position3D[2]],
        targetPos: [atl.position3D[0], atl.position3D[1] + 4, atl.position3D[2]],
        color: '#10B981',
        arcHeight: 7.0,
        label: 'I-20 Southern Industrial Link',
        speed: 0.6,
      });
    }

    // 8. Pacific Maritime Port -> Dallas Inland Depot (I-10 Freight Connector)
    if (lax && dal) {
      list.push({
        id: 'conn-lax-dal',
        sourceName: 'Pacific Maritime Port',
        targetName: 'Dallas Inland Depot',
        sourcePos: [lax.position3D[0], lax.position3D[1] + 4, lax.position3D[2]],
        targetPos: [dal.position3D[0], dal.position3D[1] + 4, dal.position3D[2]],
        color: '#10B981',
        arcHeight: 8.5,
        label: 'I-10 Pacific-Gulf Connector',
        speed: 0.5,
      });
    }

    // 9. Atlanta Sorting Center -> New York Atlantic Gateway (I-85/I-95 Corridor)
    if (atl && nyc) {
      list.push({
        id: 'conn-atl-nyc',
        sourceName: 'Atlanta Sorting Center',
        targetName: 'New York Gateway',
        sourcePos: [atl.position3D[0], atl.position3D[1] + 4, atl.position3D[2]],
        targetPos: [nyc.position3D[0], nyc.position3D[1] + 4, nyc.position3D[2]],
        color: '#06B6D4',
        arcHeight: 8.0,
        label: 'I-85/I-95 Eastern Seaboard Corridor',
        speed: 0.65,
      });
    }

    // 10. Midwest Aerotropolis Cargo Hub -> New York Gateway (Air Cargo Vector)
    if (air && nyc) {
      list.push({
        id: 'conn-air-nyc',
        sourceName: 'Aerotropolis Cargo Hub',
        targetName: 'New York Atlantic Gateway',
        sourcePos: [air.position3D[0], air.position3D[1] + 6, air.position3D[2]],
        targetPos: [nyc.position3D[0], nyc.position3D[1] + 5, nyc.position3D[2]],
        color: '#EC4899',
        arcHeight: 14.0,
        label: 'Priority Air Cargo Vector (4.5h SLA)',
        speed: 0.95,
      });
    }

    // 11. Transcontinental Rail Intermodal Yard -> Chicago Mega-Warehouse
    if (rail && chi) {
      list.push({
        id: 'conn-rail-chi',
        sourceName: 'Kansas Rail Intermodal',
        targetName: 'Chicago Mega-Warehouse',
        sourcePos: [rail.position3D[0], rail.position3D[1] + 4, rail.position3D[2]],
        targetPos: [chi.position3D[0], chi.position3D[1] + 4, chi.position3D[2]],
        color: '#6366F1',
        arcHeight: 6.5,
        label: 'Class-1 Intermodal Rail Link',
        speed: 0.55,
      });
    }

    // 12. Detroit Advanced Manufacturing Plant -> Chicago Central Hub
    if (mfg && chi) {
      list.push({
        id: 'conn-mfg-chi',
        sourceName: 'Detroit AutoTech Plant',
        targetName: 'Chicago Mega-Warehouse',
        sourcePos: [mfg.position3D[0], mfg.position3D[1] + 4, mfg.position3D[2]],
        targetPos: [chi.position3D[0], chi.position3D[1] + 4, chi.position3D[2]],
        color: '#F97316',
        arcHeight: 7.0,
        label: 'Automotive Component Supply Chain',
        speed: 0.6,
      });
    }

    // 13. Rocky Mountain Supplier Depot -> Puget Sound Terminal (Seattle)
    if (supp && sea) {
      list.push({
        id: 'conn-supp-sea',
        sourceName: 'Rocky Mountain Supplier Depot',
        targetName: 'Puget Sound Terminal',
        sourcePos: [supp.position3D[0], supp.position3D[1] + 4, supp.position3D[2]],
        targetPos: [sea.position3D[0], sea.position3D[1] + 4, sea.position3D[2]],
        color: '#14B8A6',
        arcHeight: 8.0,
        label: 'Raw Materials Feeder Vector',
        speed: 0.5,
      });
    }

    // 14. Disruption Epicenter -> TRK-101 (Hazard Blast Radius Connection)
    if (isDisruptionActive && incidents.length > 0 && trk101) {
      const inc = incidents[0];
      list.push({
        id: 'conn-incident-trk101',
        sourceName: inc.title,
        targetName: 'Tractor TRK-101',
        sourcePos: [inc.location.position3D[0], inc.location.position3D[1] + 3, inc.location.position3D[2]],
        targetPos: [trk101.position3D[0], trk101.position3D[1] + 2, trk101.position3D[2]],
        color: '#EF4444',
        arcHeight: 5.0,
        label: 'BLAST RADIUS CASCADE IMPACT',
        isDisrupted: true,
        speed: 1.2,
      });
    }

    // 15. Proposed I-70 Recovery Bypass Link
    if (isDisruptionActive && trk101 && nyc) {
      list.push({
        id: 'conn-recovery-detour',
        sourceName: 'Tractor TRK-101 Bypass',
        targetName: 'New York Gateway via I-70',
        sourcePos: [trk101.position3D[0], trk101.position3D[1] + 2.5, trk101.position3D[2]],
        targetPos: [nyc.position3D[0], nyc.position3D[1] + 4, nyc.position3D[2]],
        color: '#C084FC',
        arcHeight: 12.0,
        label: 'PROPOSED SOUTHERN BYPASS (91% SLA)',
        isBypass: true,
        speed: 0.9,
      });
    }

    return list;
  }, [facilities, vehicles, incidents, isDisruptionActive]);

  if (!layers.routes) return null;

  return (
    <group name="NetworkConnections3D">
      {connections.map(conn => {
        const isHighlighted =
          selectedEntity?.id === conn.id ||
          selectedEntity?.id === 'FAC-CHI-01' ||
          selectedEntity?.id === 'TRK-101' ||
          (selectedEntity && conn.id.includes(selectedEntity.id.toLowerCase()));

        return (
          <ConnectionArcMesh
            key={conn.id}
            connection={conn}
            isHighlighted={!!isHighlighted}
            onSelect={() =>
              selectEntity({
                type: 'route',
                id: conn.id,
                data: conn,
              })
            }
          />
        );
      })}
    </group>
  );
};

interface ConnectionArcMeshProps {
  connection: ConnectionDef;
  isHighlighted: boolean;
  onSelect: () => void;
}

const ConnectionArcMesh: React.FC<ConnectionArcMeshProps> = ({
  connection,
  isHighlighted,
  onSelect,
}) => {
  const pulseBeadRef = useRef<THREE.Mesh>(null);
  const pulseBead2Ref = useRef<THREE.Mesh>(null);
  const auraMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Generate 3D quadratic bezier curve arc between the two entities
  const { curve, tubeGeometry, auraGeometry, midPoint } = useMemo(() => {
    const start = new THREE.Vector3(...connection.sourcePos);
    const end = new THREE.Vector3(...connection.targetPos);

    // Compute mid control point elevated into 3D space
    const midX = (start.x + end.x) / 2;
    const midZ = (start.z + end.z) / 2;
    const elevatedY = Math.max(start.y, end.y) + connection.arcHeight;
    const control = new THREE.Vector3(midX, elevatedY, midZ);

    const crCurve = new THREE.QuadraticBezierCurve3(start, control, end);

    // High visibility laser beam tube
    const tube = new THREE.TubeGeometry(crCurve, 40, isHighlighted ? 0.32 : 0.22, 8, false);

    // Glowing neon volumetric aura sheath
    const aura = new THREE.TubeGeometry(crCurve, 32, isHighlighted ? 0.65 : 0.45, 8, false);

    const mid = crCurve.getPointAt(0.5);

    return {
      curve: crCurve,
      tubeGeometry: tube,
      auraGeometry: aura,
      midPoint: mid,
    };
  }, [connection, isHighlighted]);

  // Animate traveling energy pulses along the parabolic arc
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const speed = (connection.speed || 0.6) * 0.25;

    if (pulseBeadRef.current) {
      const t1 = (performance.now() * 0.001 * speed) % 1.0;
      const pt1 = curve.getPointAt(t1);
      pulseBeadRef.current.position.set(pt1.x, pt1.y, pt1.z);
    }

    if (pulseBead2Ref.current) {
      const t2 = (performance.now() * 0.001 * speed + 0.5) % 1.0;
      const pt2 = curve.getPointAt(t2);
      pulseBead2Ref.current.position.set(pt2.x, pt2.y, pt2.z);
    }

    if (auraMatRef.current) {
      auraMatRef.current.opacity = 0.25 + Math.sin(performance.now() * 0.005) * 0.15;
    }
  });

  return (
    <group
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 1. Core High-Intensity Laser Line */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color={isHighlighted ? '#FFFFFF' : connection.color}
          transparent
          opacity={isHighlighted ? 0.95 : connection.isDisrupted ? 0.9 : 0.75}
        />
      </mesh>

      {/* 2. Outer Volumetric Glowing Aura Sheath */}
      <mesh geometry={auraGeometry}>
        <meshBasicMaterial
          ref={auraMatRef}
          color={connection.color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Primary Traveling Energy Pulse Bead */}
      <mesh ref={pulseBeadRef}>
        <sphereGeometry args={[0.42, 10, 10]} />
        <meshBasicMaterial
          color={connection.isDisrupted ? '#FFAAAA' : '#FFFFFF'}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
        <pointLight
          color={connection.color}
          intensity={connection.isDisrupted ? 3.0 : 2.0}
          distance={6}
          decay={2}
        />
      </mesh>

      {/* 4. Secondary Traveling Energy Pulse Bead */}
      <mesh ref={pulseBead2Ref}>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshBasicMaterial
          color={connection.color}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Floating Connection Holographic Badge */}
      <group position={[midPoint.x, midPoint.y + 1.8, midPoint.z]}>
        <Html center distanceFactor={45} zIndexRange={[20, 0]}>
          <div
            onClick={e => {
              e.stopPropagation();
              onSelect();
            }}
            className={`px-2 py-0.5 rounded-md text-[9px] font-mono whitespace-nowrap backdrop-blur-md border cursor-pointer transition-all ${
              isHighlighted
                ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,245,255,0.6)] scale-110 font-bold'
                : connection.isDisrupted
                ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(239,68,68,0.5)] font-bold'
                : connection.isBypass
                ? 'bg-purple-950/90 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.4)] font-bold'
                : 'bg-[#0E1222]/85 border-[#2E375B] text-gray-300 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connection.isDisrupted
                    ? 'bg-rose-500 animate-ping'
                    : connection.isBypass
                    ? 'bg-purple-400 animate-pulse'
                    : 'bg-cyan-400'
                }`}
              />
              <span className="font-semibold">{connection.label}</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
