import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';

interface LogisticsCityEnvironmentProps {
  quality: 'high' | 'medium' | 'low';
}

export const LogisticsCityEnvironment: React.FC<LogisticsCityEnvironmentProps> = ({
  quality,
}) => {
  // Procedural background urban clusters surrounding the main logistics arteries
  const backgroundBuildings = useMemo(() => {
    const buildings: Array<{
      position: [number, number, number];
      size: [number, number, number];
      color: string;
    }> = [];

    // Clustered near coastlines and perimeter
    const clusters = [
      { cx: -42, cz: 14, count: 18 },  // West Coast / Pacific hub
      { cx: 40, cz: -3, count: 22 },   // East Coast / Atlantic hub
      { cx: 18, cz: -6, count: 16 },   // Great Lakes industrial
      { cx: 2, cz: 16, count: 14 },    // Texas / Southern corridor
      { cx: 24, cz: 15, count: 14 },   // Southeast / Atlanta
    ];

    const colors = ['#0F1222', '#141728', '#181C30', '#1C2038', '#0D101E'];

    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.5 + Math.random() * 5.5;
        const bx = cluster.cx + Math.cos(angle) * radius;
        const bz = cluster.cz + Math.sin(angle) * radius;

        const width = 0.8 + Math.random() * 1.6;
        const depth = 0.8 + Math.random() * 1.6;
        const height = 1.5 + Math.random() * 6.5;

        buildings.push({
          position: [bx, height / 2, bz],
          size: [width, height, depth],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    });

    return buildings;
  }, []);

  return (
    <group>
      {/* Sci-Fi Logistics Grid Floor */}
      <Grid
        position={[0, 0, 0]}
        args={[160, 160]}
        cellSize={2}
        cellThickness={0.8}
        cellColor="#1E1B4B"
        sectionSize={10}
        sectionThickness={1.5}
        sectionColor="#4F46E5"
        fadeDistance={80}
        fadeStrength={1.5}
      />

      {/* Perimeter Procedural Buildings */}
      {quality !== 'low' && (
        <group>
          {backgroundBuildings.map((b, i) => (
            <mesh key={i} position={b.position} receiveShadow={quality === 'high'}>
              <boxGeometry args={b.size} />
              <meshStandardMaterial
                color={b.color}
                roughness={0.7}
                metalness={0.4}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#090A10', 45, 120]} />

      {/* Cinematic Aurora Lighting */}
      <ambientLight intensity={0.65} color="#C4B5FD" />

      {/* Key directional sunlight/moonlight */}
      <directionalLight
        position={[25, 45, 25]}
        intensity={1.2}
        color="#E0E7FF"
        castShadow={quality === 'high'}
        shadow-mapSize={[1024, 1024]}
      />

      {/* Emerald Aurora Fill */}
      <directionalLight
        position={[-30, 25, -20]}
        intensity={0.6}
        color="#10B981"
      />

      {/* Magenta / Violet Rim light */}
      <directionalLight
        position={[0, 15, -40]}
        intensity={0.8}
        color="#8B5CF6"
      />
    </group>
  );
};
