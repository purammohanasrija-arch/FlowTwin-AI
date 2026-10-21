import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Network,
  Layers,
  Building,
  Truck,
  Package,
  AlertTriangle,
  X,
  Zap,
  Info,
  Box,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { MOCK_NETWORK_GRAPH } from '../../lib/mockApi.js';
import { useNavigate } from 'react-router-dom';

// Custom Node for Facilities
const FacilityNode = ({ data }: { data: any }) => (
  <div className="p-3.5 rounded-xl bg-[#121422] border-2 border-emerald-500/40 text-white shadow-xl min-w-[200px]">
    <div className="flex items-center justify-between text-xs mb-1.5">
      <div className="flex items-center gap-1.5">
        <Building className="w-4 h-4 text-emerald-400" />
        <span className="font-bold text-white truncate max-w-[120px]">{data.label}</span>
      </div>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
        {data.code}
      </span>
    </div>
    <div className="text-[11px] text-gray-400 flex items-center justify-between">
      <span>Utilization:</span>
      <span className={`font-mono font-bold ${data.utilization > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
        {data.utilization}%
      </span>
    </div>
  </div>
);

// Custom Node for Vehicles
const VehicleNode = ({ data }: { data: any }) => (
  <div className="p-3 rounded-xl bg-[#121422] border-2 border-cyan-500/40 text-white shadow-xl min-w-[180px]">
    <div className="flex items-center justify-between text-xs mb-1">
      <div className="flex items-center gap-1.5">
        <Truck className="w-4 h-4 text-cyan-400" />
        <span className="font-bold text-white font-mono">{data.label}</span>
      </div>
      <span className="text-[10px] font-mono text-cyan-300 capitalize">{data.status}</span>
    </div>
    <div className="text-[10px] text-gray-400 truncate">{data.carrier}</div>
  </div>
);

// Custom Node for Shipments
const ShipmentNode = ({ data }: { data: any }) => {
  const isDelayed = data.delayHours > 0 || data.status === 'delayed';
  return (
    <div
      className={`p-3 rounded-xl bg-[#121422] border-2 text-white shadow-xl min-w-[200px] ${
        isDelayed ? 'border-rose-500/50' : 'border-purple-500/40'
      }`}
    >
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1.5">
          <Package className={`w-4 h-4 ${isDelayed ? 'text-rose-400' : 'text-purple-400'}`} />
          <span className="font-bold font-mono text-white">{data.shipmentId}</span>
        </div>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            isDelayed ? 'bg-rose-500/15 text-rose-300' : 'bg-purple-500/15 text-purple-300'
          }`}
        >
          {data.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div className="text-[10px] text-gray-400 truncate">{data.cargo}</div>
      {data.delayHours > 0 && (
        <div className="text-[10px] text-rose-400 font-mono font-semibold mt-1">
          +{data.delayHours}h Delay
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  facilityNode: FacilityNode,
  vehicleNode: VehicleNode,
  shipmentNode: ShipmentNode,
};

export const DigitalTwinPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(MOCK_NETWORK_GRAPH.nodes as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(MOCK_NETWORK_GRAPH.edges as any[]);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isBlastRadiusActive, setIsBlastRadiusActive] = useState(false);

  useEffect(() => {
    api.get<any>('/network')
      .then(res => {
        if (res && res.nodes && res.nodes.length > 0) {
          setNodes(res.nodes);
          setEdges(res.edges || []);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const toggleBlastRadius = () => {
    setIsBlastRadiusActive(!isBlastRadiusActive);
    // Highlight edges affected by delay
    setEdges(prevEdges =>
      prevEdges.map(edge => {
        if (!isBlastRadiusActive) {
          const isDelayed = edge.style?.stroke === '#EF4444';
          return {
            ...edge,
            animated: true,
            style: {
              ...edge.style,
              stroke: isDelayed ? '#EF4444' : '#374151',
              strokeWidth: isDelayed ? 4 : 1,
            },
          };
        } else {
          return {
            ...edge,
            style: {
              ...edge.style,
              strokeWidth: 2,
            },
          };
        }
      })
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] rounded-xl border border-[#24283E] flex flex-col relative overflow-hidden bg-[#090A10]">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#0E101B]/90 backdrop-blur-md p-2.5 rounded-xl border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-white">Supply Chain Digital Twin</span>
        </div>

        <button
          onClick={toggleBlastRadius}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            isBlastRadiusActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
              : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/[0.08]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isBlastRadiusActive ? 'Blast Radius Active' : 'Trace Disruption Blast Radius'}</span>
        </button>

        <button
          onClick={() => navigate('/app/twin-3d')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 transition-all ml-1"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Launch Ultra 3D Universe</span>
        </button>
      </div>

      {/* Network Legend Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#0E101B]/90 backdrop-blur-md p-3 rounded-xl border border-white/[0.08] shadow-2xl text-xs space-y-1.5 pointer-events-none">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Topology Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-gray-300 text-[11px]">Primary Logistics Facility (Tier 1/2)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-gray-300 text-[11px]">Carrier Fleet Asset (Interstate Tractor)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-gray-300 text-[11px]">Active Consignment Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-rose-500" />
          <span className="text-gray-300 text-[11px]">Disrupted / Delayed Route Edge</span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1E2238" gap={20} size={1} />
        <Controls className="bg-[#121422] border border-[#24283E] text-white rounded-lg overflow-hidden fill-white" />
        <MiniMap
          nodeColor={node => {
            if (node.type === 'facilityNode') return '#10B981';
            if (node.type === 'vehicleNode') return '#06B6D4';
            return '#8B5CF6';
          }}
          className="bg-[#0E101B] border border-[#24283E] rounded-lg overflow-hidden"
        />
      </ReactFlow>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-20 w-80 bg-[#10121C]/95 backdrop-blur-md border border-[#24283E] rounded-xl shadow-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <span className="text-xs font-semibold text-purple-300 font-mono">Entity Telemetry</span>
            <button onClick={() => setSelectedNode(null)} className="p-1 rounded text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-white text-sm">
              {selectedNode.data.label || selectedNode.data.shipmentId}
            </div>
            <pre className="p-2.5 rounded bg-black/40 text-[10px] font-mono text-gray-300 overflow-x-auto">
              {JSON.stringify(selectedNode.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
