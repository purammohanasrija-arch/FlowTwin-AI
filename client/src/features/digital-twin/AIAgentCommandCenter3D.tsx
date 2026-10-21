import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { AIAgentNodeState } from './types.js';

export const AIAgentCommandCenter3D: React.FC = () => {
  const aiAgents = useDigitalTwinStore(s => s.aiAgents);
  const layers = useDigitalTwinStore(s => s.layers);
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const selectEntity = useDigitalTwinStore(s => s.selectEntity);
  const aiCopilot = useDigitalTwinStore(s => s.aiCopilot);

  const pulseRef = useRef<THREE.Mesh>(null);

  // Animate pulse between communicating agents
  useFrame(() => {
    if (pulseRef.current) {
      const time = performance.now() * 0.003;
      pulseRef.current.position.x = Math.sin(time) * 14;
      pulseRef.current.position.z = Math.cos(time) * 12;
    }
  });

  if (!layers.ai_nodes) return null;

  const orchestrator = aiAgents.find(a => a.name === 'Orchestrator') || aiAgents[0];

  return (
    <group name="AIAgentCommandCenter3D">
      {/* 1. Connecting Neural Laser Beams from Central Orchestrator to Satellites */}
      {aiAgents.map(agent => {
        if (agent.name === 'Orchestrator') return null;

        const points = [
          new THREE.Vector3(...orchestrator.position3D),
          new THREE.Vector3(...agent.position3D),
        ];
        const geom = new THREE.BufferGeometry().setFromPoints(points);

        const isActive =
          aiCopilot.isProcessing &&
          aiCopilot.activeCommunicationPair?.includes(agent.name);

        return (
          <line key={agent.id} {...({ geometry: geom } as any)}>
            <lineBasicMaterial
              color={isActive ? '#00F5FF' : '#6366F1'}
              transparent
              opacity={isActive ? 0.95 : 0.35}
              linewidth={isActive ? 3 : 1}
            />
          </line>
        );
      })}

      {/* 2. Communication Packet Pulse traveling between agents */}
      {aiCopilot.isProcessing && (
        <mesh ref={pulseRef} position={[0, 29, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#00F5FF" />
          <pointLight color="#00F5FF" intensity={3.0} distance={10} />
        </mesh>
      )}

      {/* 3. Individual AI Agent Spatial Nodes */}
      {aiAgents.map(agent => {
        const isSelected =
          selectedEntity?.type === 'ai_agent' && selectedEntity.id === agent.id;

        const nodeColor =
          agent.status === 'alert'
            ? '#EF4444'
            : agent.status === 'running'
            ? '#00F5FF'
            : '#10B981';

        return (
          <group
            key={agent.id}
            position={agent.position3D}
            onClick={e => {
              e.stopPropagation();
              selectEntity({
                type: 'ai_agent',
                id: agent.id,
                data: agent,
              });
            }}
          >
            {/* Holographic Polyhedral Core */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <octahedronGeometry args={[agent.name === 'Orchestrator' ? 2.0 : 1.4, 0]} />
              <meshStandardMaterial
                color={nodeColor}
                emissive={nodeColor}
                emissiveIntensity={isSelected || aiCopilot.isProcessing ? 0.9 : 0.45}
                metalness={0.8}
                roughness={0.2}
                wireframe={isSelected}
              />
            </mesh>

            {/* Orbiting Orbital Ring */}
            <mesh rotation={[-Math.PI / 3, 0, 0]}>
              <torusGeometry
                args={[agent.name === 'Orchestrator' ? 2.8 : 2.0, 0.08, 8, 24]}
              />
              <meshBasicMaterial
                color={nodeColor}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* Glowing Node Point Light */}
            <pointLight
              color={nodeColor}
              intensity={isSelected ? 2.5 : 1.2}
              distance={12}
            />
          </group>
        );
      })}
    </group>
  );
};
