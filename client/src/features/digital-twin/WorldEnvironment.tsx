import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const WorldEnvironment: React.FC = () => {
  const quality = useDigitalTwinStore(s => s.quality);
  const weather = useDigitalTwinStore(s => s.weather);
  const timeOfDay = useDigitalTwinStore(s => s.timeOfDay);
  const fogDensity = useDigitalTwinStore(s => s.fogDensity);
  const rainIntensity = useDigitalTwinStore(s => s.rainIntensity);

  const rainRef = useRef<THREE.Points>(null);
  const snowRef = useRef<THREE.Points>(null);
  const motesRef = useRef<THREE.Points>(null);
  const steamRef = useRef<THREE.Points>(null);

  // Fog & Sky Colors derived from weather & time of day
  const envColors = useMemo(() => {
    switch (weather) {
      case 'clear_day':
        return {
          fogColor: '#0a1628',
          skyTop: '#0d2244',
          skyBottom: '#050c18',
          gridColor: '#1e3a5f',
        };
      case 'golden_hour':
        return {
          fogColor: '#1a0f1e',
          skyTop: '#3b1d3d',
          skyBottom: '#120815',
          gridColor: '#632c4a',
        };
      case 'heavy_rain':
        return {
          fogColor: '#050a12',
          skyTop: '#0a1420',
          skyBottom: '#020508',
          gridColor: '#162b45',
        };
      case 'storm_blizzard':
        return {
          fogColor: '#08111e',
          skyTop: '#0f1f38',
          skyBottom: '#040912',
          gridColor: '#2b4c7e',
        };
      case 'dense_fog':
        return {
          fogColor: '#0a0e17',
          skyTop: '#111827',
          skyBottom: '#06090e',
          gridColor: '#1f2937',
        };
      case 'extreme_heat':
        return {
          fogColor: '#160d08',
          skyTop: '#2d150a',
          skyBottom: '#0a0503',
          gridColor: '#5c2d12',
        };
      case 'midnight_cyber':
      default:
        return {
          fogColor: '#06070D',
          skyTop: '#0c071a',
          skyBottom: '#040409',
          gridColor: '#181B34',
        };
    }
  }, [weather]);

  // Rain particle buffers (Instanced Points)
  const rainGeometry = useMemo(() => {
    const count = quality === 'cinematic' ? 1400 : 700;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = Math.random() * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
      velocities[i] = 1.2 + Math.random() * 0.8;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    return geom;
  }, [quality]);

  // Snow / Blizzard particles
  const snowGeometry = useMemo(() => {
    const count = quality === 'cinematic' ? 1800 : 900;
    const positions = new Float32Array(count * 3);
    const wander = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = Math.random() * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
      wander[i] = Math.random() * Math.PI * 2;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('wander', new THREE.BufferAttribute(wander, 1));
    return geom;
  }, [quality]);

  // Cyber dust / Ambient motes
  const motesGeometry = useMemo(() => {
    const count = quality === 'cinematic' ? 450 : 200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 1] = 1 + Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 130;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [quality]);

  // Animate weather particles in real-time
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // Rain
    if (rainRef.current && (weather === 'heavy_rain' || weather === 'storm_blizzard')) {
      const posAttr = rainRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const velAttr = rainRef.current.geometry.attributes.velocity as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const vel = velAttr.array as Float32Array;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= vel[i] * 42 * dt;
        pos[i * 3] -= 4.0 * dt; // Wind slant
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 45;
          pos[i * 3] = (Math.random() - 0.5) * 140;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Snow / Blizzard
    if (snowRef.current && weather === 'storm_blizzard') {
      const posAttr = snowRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const wanderAttr = snowRef.current.geometry.attributes.wander as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const wander = wanderAttr.array as Float32Array;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= (4 + Math.sin(wander[i])) * dt * 2.5;
        pos[i * 3] -= 8.5 * dt; // Strong blizzard crosswind
        wander[i] += dt * 2;

        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 42;
          pos[i * 3] = (Math.random() - 0.5) * 150 + 20;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Ambient floating motes
    if (motesRef.current) {
      const posAttr = motesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const count = pos.length / 3;
      const time = performance.now() * 0.0005;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(time + i) * 0.02;
        pos[i * 3] += Math.cos(time + i * 0.5) * 0.015;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group name="WorldEnvironment">
      {/* Background color & exponential fog */}
      <color attach="background" args={[envColors.fogColor]} />
      <fogExp2 attach="fog" args={[envColors.fogColor, fogDensity]} />

      {/* Futuristic Deep Sky Dome */}
      <mesh scale={[-1, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[180, 24, 24]} />
        <meshBasicMaterial
          side={THREE.BackSide}
          color={envColors.skyTop}
          wireframe={quality === 'performance'}
        />
      </mesh>

      {/* Cyberpunk Ground Grid Plane */}
      <gridHelper
        args={[200, 100, '#00F5FF', envColors.gridColor]}
        position={[0, 0.02, 0]}
      />

      {/* Secondary micro-grid for industrial precision */}
      {quality !== 'performance' && (
        <gridHelper
          args={[200, 200, '#A855F7', '#0B0F24']}
          position={[0, 0.01, 0]}
        />
      )}

      {/* Rain Particles */}
      {(weather === 'heavy_rain' || weather === 'storm_blizzard') && (
        <points ref={rainRef} geometry={rainGeometry}>
          <pointsMaterial
            size={quality === 'cinematic' ? 0.35 : 0.25}
            color="#00F5FF"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Blizzard Snow Particles */}
      {weather === 'storm_blizzard' && (
        <points ref={snowRef} geometry={snowGeometry}>
          <pointsMaterial
            size={quality === 'cinematic' ? 0.55 : 0.4}
            color="#E0F2FE"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Ambient Floating Cyan Motes */}
      {quality !== 'performance' && (
        <points ref={motesRef} geometry={motesGeometry}>
          <pointsMaterial
            size={0.4}
            color="#00F5FF"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
