import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  Node,
  Edge,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Building2,
  Truck,
  Package,
  AlertTriangle,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Thermometer,
  Layers,
  HelpCircle,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { MOCK_NETWORK_GRAPH } from '../../lib/mockApi.js';

// 1. Custom Facility Node with Cocoa Telemetry
const ConnectedFacilityNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isCongested = data.status === 'congested';
  const isManufacturing = data.type === 'manufacturing' || id === 'FAC-CHI-01';

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[250px] max-w-[270px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_24px_rgba(0,245,255,0.4)] scale-[1.03]'
          : isManufacturing
          ? 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/40'
          : isCongested
          ? 'border-rose-500/70 shadow-[0_0_16px_rgba(239,68,68,0.25)]'
          : 'border-emerald-500/50 hover:border-emerald-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3.5 !h-3.5 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913]"
      />

      {/* Category Pill */}
      {data.category && (
        <div className="flex items-center justify-between text-[9px] font-mono mb-1.5 pb-1 border-b border-white/10">
          <span className={`font-bold uppercase tracking-wider ${isManufacturing ? 'text-amber-300' : 'text-emerald-400'}`}>
            {isManufacturing ? '⭐ FACTORY CORE' : data.category}
          </span>
          <span className="text-gray-400">{data.city}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
              isManufacturing
                ? 'bg-gradient-to-tr from-amber-500 to-amber-700 text-white shadow-amber-500/30'
                : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isManufacturing ? '🏭' : data.type === 'port' ? '🚢' : '🏢'}
          </div>
          <div>
            <span className="font-bold text-white font-mono truncate max-w-[150px] block" title={data.label}>
              {data.label}
            </span>
            <span className="text-[9px] text-gray-400 font-mono block">{data.code}</span>
          </div>
        </div>
      </div>

      {/* Ingredient / Process Note */}
      {data.ingredient && (
        <div className="text-[10px] text-amber-100 font-mono bg-black/50 p-2 rounded-xl border border-white/10 mb-2 leading-relaxed">
          {data.ingredient}
        </div>
      )}

      {/* Utilization & Capacity */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>Capacity Load</span>
          <span className={data.utilization > 80 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
            {data.utilization}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#141A38] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all rounded-full ${
              data.utilization > 80
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-teal-500 to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, data.utilization)}%` }}
          />
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1.5 border-t border-white/[0.08]">
        <span className="text-cyan-300 font-bold">{data.throughput || 320} kg/h</span>
        {data.temperature && (
          <span className="text-amber-300 font-bold flex items-center gap-0.5">
            <Thermometer className="w-3 h-3 text-amber-400" />
            {data.temperature.split(' ')[0]}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3.5 !h-3.5 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913]"
      />
    </div>
  );
};

// 2. Custom Connected Vehicle Node
const ConnectedVehicleNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isDelayed = data.status === 'delayed' || data.isDelayed;

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[240px] max-w-[260px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_20px_rgba(0,245,255,0.3)] scale-[1.02]'
          : isDelayed
          ? 'border-rose-500/80 shadow-[0_0_20px_rgba(239,68,68,0.35)] animate-pulse'
          : 'border-cyan-500/60 hover:border-cyan-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3.5 !h-3.5 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white font-mono block text-xs">{data.label}</span>
            <span className="text-[9px] text-gray-400 font-mono">{data.carrier}</span>
          </div>
        </div>
      </div>

      {/* Cargo & Target Temperature */}
      {data.cargo && (
        <div className="text-[10px] text-cyan-100 font-mono bg-black/50 p-2 rounded-xl border border-white/10 mb-2 leading-relaxed">
          {data.cargo}
        </div>
      )}

      <div className="text-[10px] font-mono text-gray-300 pt-1.5 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-gray-400 truncate max-w-[130px]">{data.currentLocation}</span>
        {data.targetTemp && (
          <span className="text-cyan-300 font-bold bg-cyan-950/90 px-2 py-0.5 rounded-lg border border-cyan-500/40 shadow-sm">
            {data.targetTemp}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3.5 !h-3.5 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};

// 3. Custom Connected Shipment Node
const ConnectedShipmentNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isDelayed = data.delayHours > 0 || data.status === 'delayed';

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[240px] max-w-[260px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-purple-400 ring-2 ring-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]'
          : isDelayed
          ? 'border-rose-500/70 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
          : 'border-purple-500/50 hover:border-purple-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3.5 !h-3.5 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold font-mono text-white text-xs">{data.shipmentId}</span>
            <span className="text-[9px] text-gray-400 font-mono block">{data.batchWeight}</span>
          </div>
        </div>
        <span
          className={`text-[9px] font-mono px-2 py-0.5 rounded-lg font-bold uppercase ${
            isDelayed
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}
        >
          {data.status?.replace('_', ' ')}
        </span>
      </div>

      <div className="text-[10px] text-purple-100 font-mono bg-black/50 p-2 rounded-xl border border-white/10 mb-2 leading-relaxed" title={data.cargo}>
        {data.cargo}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.08]">
        <span className="text-gray-400 truncate max-w-[120px]" title={data.destination}>
          {data.destination}
        </span>
        {data.delayHours > 0 ? (
          <span className="text-rose-400 font-bold">+{data.delayHours}h Weather</span>
        ) : (
          <span className="text-emerald-400 font-bold">On Schedule (18°C)</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3.5 !h-3.5 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#070913]"
      />
    </div>
  );
};

const nodeTypes = {
  facilityNode: ConnectedFacilityNode,
  vehicleNode: ConnectedVehicleNode,
  shipmentNode: ConnectedShipmentNode,
};

interface ConnectedNetworkGraph2DProps {
  onSelectEntity?: (entity: any) => void;
  isBlastRadiusActive?: boolean;
}

export const ConnectedNetworkGraph2D: React.FC<ConnectedNetworkGraph2DProps> = ({
  onSelectEntity,
  isBlastRadiusActive,
}) => {
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const triggerDisruption = useDigitalTwinStore(s => s.triggerDisruption);
  const resolveDisruption = useDigitalTwinStore(s => s.resolveDisruption);
  const incidents = useDigitalTwinStore(s => s.incidents);
  const [guideOpen, setGuideOpen] = useState(true);

  // Initialize state with default mock graph
  const [nodes, setNodes, onNodesChange] = useNodesState(MOCK_NETWORK_GRAPH.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_NETWORK_GRAPH.edges as Edge[]);

  const handleToggleFreezeHazard = () => {
    if (isDisruptionActive) {
      const activeInc = incidents[0];
      if (activeInc) {
        resolveDisruption(activeInc.incidentCode);
      }
    } else {
      triggerDisruption({
        title: 'I-80 Blizzard Road Closure & Pipe Freeze',
        affectedCorridor: 'I-80',
        severity: 'critical',
      });
    }
  };

  // Update edges when blast radius is active to highlight hazard cascade
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const isBlastPath =
        (isDisruptionActive || isBlastRadiusActive) &&
        (edge.id === 'e-tank101-chi' || edge.id === 'e-chi-sh1043');

      const isSelected = selectedEntity && (edge.id.includes(selectedEntity.id) || edge.source === selectedEntity.id || edge.target === selectedEntity.id);

      return {
        ...edge,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isBlastPath ? '#EF4444' : isSelected ? '#00F5FF' : edge.style?.stroke || '#3B82F6',
          width: 18,
          height: 18,
        },
        style: {
          ...edge.style,
          stroke: isBlastPath ? '#EF4444' : isSelected ? '#00F5FF' : edge.style?.stroke,
          strokeWidth: isBlastPath ? 4.5 : isSelected ? 4 : edge.style?.strokeWidth || 3,
          filter: isBlastPath ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' : undefined,
        },
        labelStyle: {
          fill: isBlastPath ? '#FFAAAA' : '#CBD5E1',
          fontWeight: 700,
          fontFamily: 'monospace',
          fontSize: 10,
        },
        labelBgStyle: {
          fill: '#080B1E',
          fillOpacity: 0.95,
          stroke: isBlastPath ? '#EF4444' : '#1E2548',
          strokeWidth: 1,
          rx: 6,
          ry: 6,
        },
      };
    });
  }, [edges, isDisruptionActive, isBlastRadiusActive, selectedEntity]);

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      let type: 'facility' | 'vehicle' | 'cargo' = 'facility';
      if (node.type === 'vehicleNode') type = 'vehicle';
      if (node.type === 'shipmentNode') type = 'cargo';

      const entity = {
        type,
        id: node.id,
        data: node.data,
      };

      selectEntity(entity as any);
      if (onSelectEntity) onSelectEntity(entity);
    },
    [selectEntity, onSelectEntity]
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const entity = {
        type: 'route',
        id: edge.id,
        data: {
          name: edge.label || edge.id,
          sourceName: edge.source,
          targetName: edge.target,
          label: edge.label,
          roadCorridor: edge.id.includes('tank101') ? 'I-80' : 'I-70',
          isDisrupted: edge.id.includes('sh1043'),
        },
      };

      selectEntity(entity as any);
      if (onSelectEntity) onSelectEntity(entity);
    },
    [selectEntity, onSelectEntity]
  );

  return (
    <div className="w-full h-full relative bg-[#070913] select-none">
      {/* 1. TOP PIPELINE EXPLAINER BANNER (Clear, Self-Explanatory) */}
      <div className="absolute top-16 left-6 right-6 z-10 pointer-events-none hidden md:flex items-center justify-between gap-4">
        {/* 4 Swimlane Badges */}
        <div className="grid grid-cols-4 gap-3.5 flex-1 pointer-events-auto">
          {/* Zone 1 */}
          <div className="px-3.5 py-2 rounded-xl bg-[#090D1E]/95 border border-emerald-500/40 backdrop-blur-xl shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#10B981]" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-mono font-extrabold text-emerald-300 block truncate">
                1. GLOBAL SOURCING
              </span>
              <span className="text-[9px] text-gray-400 font-sans block truncate">
                Cocoa Beans, Dairy & Pure Sugar
              </span>
            </div>
          </div>

          {/* Zone 2 */}
          <div className="px-3.5 py-2 rounded-xl bg-[#090D1E]/95 border border-cyan-500/40 backdrop-blur-xl shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_#06B6D4] animate-pulse" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-mono font-extrabold text-cyan-300 block truncate">
                2. HEATED TRANSIT (45°C)
              </span>
              <span className="text-[9px] text-gray-400 font-sans block truncate">
                Jacketed Tankers (Anti-Solidify)
              </span>
            </div>
          </div>

          {/* Zone 3 */}
          <div className="px-3.5 py-2 rounded-xl bg-[#090D1E]/95 border border-amber-500/50 backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_#F59E0B]" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-mono font-extrabold text-amber-300 block truncate">
                3. CHICAGO FACTORY
              </span>
              <span className="text-[9px] text-amber-200/80 font-sans block truncate">
                Conching (48°C) & Tempering (31°C)
              </span>
            </div>
          </div>

          {/* Zone 4 */}
          <div className="px-3.5 py-2 rounded-xl bg-[#090D1E]/95 border border-purple-500/40 backdrop-blur-xl shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0 shadow-[0_0_8px_#A855F7]" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-mono font-extrabold text-purple-300 block truncate">
                4. COLD VAULTS (16°C)
              </span>
              <span className="text-[9px] text-gray-400 font-sans block truncate">
                Packaged Bars & 34 Supermarkets
              </span>
            </div>
          </div>
        </div>

        {/* Freeze Disruption Simulation Trigger */}
        <button
          type="button"
          onClick={handleToggleFreezeHazard}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer pointer-events-auto shrink-0 shadow-lg ${
            isDisruptionActive
              ? 'bg-rose-500/25 text-rose-200 border-rose-500 shadow-rose-500/30 ring-1 ring-rose-500'
              : 'bg-black/60 text-amber-300 hover:text-white border-amber-500/40 hover:bg-amber-950/40'
          }`}
          title="Simulate jacket heater failure on I-80 corridor"
        >
          <Zap className={`w-3.5 h-3.5 ${isDisruptionActive ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          <span>{isDisruptionActive ? '⚠️ Freeze Active (I-80 Detour)' : '⚡ Simulate Tanker Freeze'}</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2.0}
      >
        {/* Subtle Cyber Grid Background */}
        <Background color="#1D2444" gap={28} size={1.5} />

        {/* Tactical Dark Controls */}
        <Controls className="!bg-[#0D1127]/90 !border !border-[#242C50] !rounded-xl !shadow-2xl !text-white overflow-hidden !m-4" />

        {/* Synchronized Dark MiniMap */}
        <MiniMap
          className="!bg-[#090D1E]/95 !border !border-[#222B50] !rounded-2xl !shadow-2xl !bottom-4 !right-4 overflow-hidden"
          nodeColor={node => {
            if (node.id === 'FAC-CHI-01') return '#F59E0B';
            if (node.type === 'facilityNode') return '#10B981';
            if (node.type === 'vehicleNode') return '#00F5FF';
            if (node.type === 'shipmentNode') return '#A855F7';
            return '#6366F1';
          }}
          maskColor="rgba(7, 9, 19, 0.85)"
        />
      </ReactFlow>

      {/* 2. BOTTOM FLOATING GUIDE & EXPLAINER CARD */}
      <div className="absolute bottom-5 left-5 z-20 pointer-events-auto max-w-sm">
        {guideOpen ? (
          <div className="p-3.5 rounded-2xl bg-[#090D1E]/95 border border-amber-500/30 shadow-2xl backdrop-blur-xl text-xs font-mono space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>How This Value Stream Flows</span>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
              Follow the flow strictly from left to right:
              <br />
              <strong>1. Global Sourcing:</strong> Raw cocoa beans arrive at Long Beach; milk & sugar from Midwest co-ops.
              <br />
              <strong>2. Heated Transit:</strong> Liquid cocoa butter is kept at <strong>45°C</strong> so it never cools or clogs.
              <br />
              <strong>3. Chicago Factory:</strong> 10-stage processing converts ingredients into chocolate bars (28,450 kg/day).
              <br />
              <strong>4. Cold Vaults:</strong> Finished confections travel at <strong>16°C</strong> to regional stores.
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sourcing Hubs
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Heated Tankers (45°C)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Chicago Factory Core
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Regional Cold Vaults
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090D1E]/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-[#090D1E] shadow-xl cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Supply Chain Flow Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};
