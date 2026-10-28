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
} from 'lucide-react';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { MOCK_NETWORK_GRAPH } from '../../lib/mockApi.js';

// 1. Custom Connected Facility Node with Active Handles & Cocoa Telemetry
const ConnectedFacilityNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isCongested = data.status === 'congested';
  const isManufacturing = data.type === 'manufacturing';

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[240px] max-w-[260px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_24px_rgba(0,245,255,0.4)] scale-[1.03]'
          : isManufacturing
          ? 'border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
          : isCongested
          ? 'border-rose-500/70 shadow-[0_0_16px_rgba(239,68,68,0.25)]'
          : 'border-emerald-500/50 hover:border-emerald-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />

      {/* Category Pill */}
      {data.category && (
        <div className="flex items-center justify-between text-[9px] font-mono mb-1.5 pb-1 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider">{data.category}</span>
          <span className="text-gray-400">{data.city}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              isManufacturing
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isManufacturing ? '🏭' : '🏢'}
          </div>
          <div>
            <span className="font-bold text-white font-mono truncate max-w-[140px] block" title={data.label}>
              {data.label}
            </span>
            <span className="text-[9px] text-gray-400 font-mono block">{data.code}</span>
          </div>
        </div>
      </div>

      {/* Ingredient / Process Note */}
      {data.ingredient && (
        <div className="text-[10px] text-amber-200/90 font-mono bg-black/40 p-1.5 rounded-lg border border-white/5 mb-2 leading-tight">
          {data.ingredient}
        </div>
      )}

      {/* Utilization & Throughput */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>Capacity Load</span>
          <span className={data.utilization > 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
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
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};

// 2. Custom Connected Vehicle Node with Active Handles
const ConnectedVehicleNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isDelayed = data.status === 'delayed' || data.isDelayed;

  return (
    <div
      className={`p-3 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[220px] max-w-[240px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_20px_rgba(0,245,255,0.3)] scale-[1.02]'
          : isDelayed
          ? 'border-rose-500/70 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
          : 'border-cyan-500/50 hover:border-cyan-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white font-mono block text-xs">{data.label}</span>
            <span className="text-[9px] text-gray-400 font-mono">{data.carrier}</span>
          </div>
        </div>
      </div>

      {/* Cargo & Target Temperature */}
      {data.cargo && (
        <div className="text-[10px] text-cyan-200/90 font-mono bg-black/40 p-1.5 rounded-lg border border-white/5 mb-1.5 leading-tight">
          {data.cargo}
        </div>
      )}

      <div className="text-[10px] font-mono text-gray-300 pt-1 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-gray-400 truncate max-w-[120px]">{data.currentLocation}</span>
        {data.targetTemp && (
          <span className="text-cyan-300 font-bold bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-500/30">
            {data.targetTemp}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
    </div>
  );
};

// 3. Custom Connected Shipment Node with Active Handles
const ConnectedShipmentNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isDelayed = data.delayHours > 0 || data.status === 'delayed' || data.status === 'exception';

  return (
    <div
      className={`p-3 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[220px] max-w-[240px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-purple-400 ring-2 ring-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]'
          : isDelayed
          ? 'border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          : 'border-purple-500/40 hover:border-purple-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />

      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold font-mono text-white text-xs">{data.shipmentId}</span>
        </div>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
            isDelayed
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}
        >
          {data.status?.replace('_', ' ')}
        </span>
      </div>

      <div className="text-[10px] text-purple-200 font-mono truncate mb-1" title={data.cargo}>
        {data.cargo}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.08]">
        <span className="text-gray-400 truncate max-w-[110px]" title={data.destination}>
          {data.destination}
        </span>
        {data.delayHours > 0 ? (
          <span className="text-rose-400 font-bold">+{data.delayHours}h Delay</span>
        ) : (
          <span className="text-emerald-400 font-bold">On Schedule</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-[#070913] hover:!scale-125 !transition-transform"
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
  const [guideOpen, setGuideOpen] = useState(true);

  // Initialize state with default mock graph
  const [nodes, setNodes, onNodesChange] = useNodesState(MOCK_NETWORK_GRAPH.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_NETWORK_GRAPH.edges as Edge[]);

  // Update edges when blast radius is active to highlight hazard cascade
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const isBlastPath =
        isBlastRadiusActive &&
        (edge.id === 'e-tank101-chi' || edge.id === 'e-chi-sh1043');

      const isSelected = selectedEntity && (edge.id.includes(selectedEntity.id) || edge.source === selectedEntity.id || edge.target === selectedEntity.id);

      return {
        ...edge,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isBlastPath ? '#EF4444' : isSelected ? '#00F5FF' : edge.style?.stroke || '#3B82F6',
          width: 16,
          height: 16,
        },
        style: {
          ...edge.style,
          stroke: isBlastPath ? '#EF4444' : isSelected ? '#00F5FF' : edge.style?.stroke,
          strokeWidth: isBlastPath ? 4 : isSelected ? 3.5 : edge.style?.strokeWidth || 2.5,
          filter: isBlastPath ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))' : undefined,
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
  }, [edges, isBlastRadiusActive, selectedEntity]);

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
      {/* 1. TOP SWIMLANE PIPELINE GUIDE */}
      <div className="absolute top-16 left-6 right-6 z-10 pointer-events-none hidden md:grid grid-cols-3 gap-4">
        <div className="px-3.5 py-1.5 rounded-xl bg-[#090D1E]/90 border border-emerald-500/30 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono font-bold text-emerald-300">
            1. INGREDIENT INTAKE (COCOA / DAIRY / SUGAR)
          </span>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#090D1E]/90 border border-cyan-500/30 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-cyan-300">
            2. HEATED & CLIMATE-CONTROLLED TRANSIT
          </span>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#090D1E]/90 border border-purple-500/30 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-[11px] font-mono font-bold text-purple-300">
            3. REGIONAL FULFILLMENT & COLD VAULTS
          </span>
        </div>
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
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={2.2}
      >
        {/* Subtle Cyber Grid Background */}
        <Background color="#1D2444" gap={24} size={1.5} />

        {/* Tactical Dark Controls */}
        <Controls className="!bg-[#0D1127]/90 !border !border-[#242C50] !rounded-xl !shadow-2xl !text-white overflow-hidden !m-4" />

        {/* Synchronized Dark MiniMap */}
        <MiniMap
          className="!bg-[#090D1E]/95 !border !border-[#222B50] !rounded-2xl !shadow-2xl !bottom-4 !right-4 overflow-hidden"
          nodeColor={node => {
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
                <span>How This Network Flows</span>
              </div>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
              Follow the flow from <strong>Raw Material Intake</strong> on the left, through 
              <strong> Heated Jacketed Tankers</strong> (45°C), into the 
              <strong> Chicago Processing Campus</strong>, and outbound to East Coast 
              <strong> Cold Storage Vaults</strong> (16°C).
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sourcing Hubs
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Liquid Tankers (45°C)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Central Factory
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Regional Vaults
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090D1E]/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-[#090D1E] shadow-xl"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Network Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};
