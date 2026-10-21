import React, { useCallback, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { MOCK_NETWORK_GRAPH } from '../../lib/mockApi.js';

// 1. Custom Connected Facility Node with Active Handles
const ConnectedFacilityNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const isCongested = data.status === 'congested';

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[220px] transition-all backdrop-blur-xl ${
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-[0_0_20px_rgba(0,245,255,0.3)] scale-[1.02]'
          : isCongested
          ? 'border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
          : 'border-emerald-500/50 hover:border-emerald-400'
      }`}
    >
      {/* Input Target Handles */}
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

      {/* Header */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white font-mono truncate max-w-[130px]" title={data.label}>
            {data.label}
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
          {data.code}
        </span>
      </div>

      {/* Utilization Bar */}
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
        <span>{data.city || 'Hub Facility'}</span>
        <span className="text-cyan-300 font-bold">{data.throughput || 320} units/h</span>
      </div>

      {/* Output Source Handles */}
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
      className={`p-3 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[200px] transition-all backdrop-blur-xl ${
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
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white font-mono block">{data.label}</span>
            <span className="text-[9px] text-gray-400 font-mono">{data.carrier}</span>
          </div>
        </div>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
            isDelayed
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {data.status || 'in_transit'}
        </span>
      </div>

      <div className="text-[10px] font-mono text-gray-300 pt-1.5 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-gray-400">Position:</span>
        <span className="text-gray-200 truncate max-w-[130px]">{data.currentLocation || 'In Transit'}</span>
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
      className={`p-3 rounded-2xl bg-[#0C1024]/95 border-2 text-white shadow-2xl min-w-[210px] transition-all backdrop-blur-xl ${
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
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isDelayed
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold font-mono text-white">{data.shipmentId}</span>
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

      <div className="text-[10px] text-gray-300 font-mono truncate mb-1" title={data.cargo}>
        {data.cargo}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.08]">
        <span className="text-gray-400">Dest: {data.destination}</span>
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

  // Initialize state with default mock graph
  const [nodes, setNodes, onNodesChange] = useNodesState(MOCK_NETWORK_GRAPH.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_NETWORK_GRAPH.edges as Edge[]);

  // Update edges when blast radius is active to highlight hazard cascade
  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const isBlastPath =
        isBlastRadiusActive &&
        (edge.id === 'e-chi-trk101' || edge.id === 'e-trk101-sh1042' || edge.id === 'e-trk101-nyc');

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
          strokeWidth: isBlastPath ? 4 : isSelected ? 3.5 : edge.style?.strokeWidth || 2,
          filter: isBlastPath ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))' : undefined,
        },
        labelStyle: {
          fill: isBlastPath ? '#FFAAAA' : '#94A3B8',
          fontWeight: 700,
          fontFamily: 'monospace',
          fontSize: 10,
        },
        labelBgStyle: {
          fill: '#080B1E',
          fillOpacity: 0.9,
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
          roadCorridor: edge.id.includes('trk101') ? 'I-80' : 'I-70',
          isDisrupted: edge.id.includes('trk101'),
        },
      };

      selectEntity(entity as any);
      if (onSelectEntity) onSelectEntity(entity);
    },
    [selectEntity, onSelectEntity]
  );

  return (
    <div className="w-full h-full relative bg-[#070913] select-none">
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
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
    </div>
  );
};
