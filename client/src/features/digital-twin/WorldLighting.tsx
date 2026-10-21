import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const WorldLighting: React.FC = () => {
  const quality = useDigitalTwinStore(s => s.quality);
  const weather = useDigitalTwinStore(s => s.weather);
  const timeOfDay = useDigitalTwinStore(s => s.timeOfDay);
  const isDisruptionActive = useDigitalTwinStore(s => s.isDisruptionActive);
  const incidents = useDigitalTwinStore(s => s.incidents);

  const emergencyLightRef = useRef<THREE.PointLight>(null);
  const pulseLightRef = useRef<THREE.SpotLight>(null);

  // Compute sun angle based on 24h clock
  const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
  const sunX = Math.cos(sunAngle) * 80;
  const sunY = Math.max(15, Math.sin(sunAngle) * 70);
  const sunZ = Math.sin(sunAngle) * 40;

  // Emergency strobe animation
  useFrame(() => {
    const time = performance.now() * 0.006;
    if (emergencyLightRef.current && isDisruptionActive) {
      emergencyLightRef.current.intensity = Math.sin(time) > 0.1 ? 4.5 : 0.8;
    }
    if (pulseLightRef.current && isDisruptionActive) {
      pulseLightRef.current.intensity = 2.0 + Math.sin(time * 1.5) * 1.5;
    }
  });

  const activeIncident = incidents[0];
  const incidentPos = activeIncident ? activeIncident.location.position3D : [4, 0.5, -2];

  return (
    <group name="WorldLighting">
      {/* Deep Obsidian / Indigo Ambient Base */}
      <ambientLight intensity={weather === 'midnight_cyber' ? 0.35 : 0.6} color="#181B34" />

      {/* Hemisphere Light for soft ground bounce */}
      <hemisphereLight
        args={['#00F5FF', '#090A10', weather === 'midnight_cyber' ? 0.45 : 0.7]}
      />

      {/* Main Directional Sun / Moon */}
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={weather === 'clear_day' ? 1.8 : weather === 'golden_hour' ? 1.4 : 0.85}
        color={
          weather === 'golden_hour'
            ? '#FFAA55'
            : weather === 'midnight_cyber'
            ? '#88B0E8'
            : '#FFFFFF'
        }
        castShadow={quality === 'cinematic'}
        shadow-mapSize-width={quality === 'cinematic' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'cinematic' ? 2048 : 1024}
        shadow-camera-near={10}
        shadow-camera-far={180}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0005}
      />

      {/* Volumetric Cyan Spotlight over Pacific Port */}
      <spotLight
        position={[-46, 32, 10]}
        target-position={[-46, 0, 10]}
        intensity={2.2}
        color="#00F5FF"
        angle={0.65}
        penumbra={0.8}
        distance={60}
      />

      {/* Volumetric Violet Spotlight over Chicago Central Mega-Warehouse */}
      <spotLight
        position={[0, 36, -18]}
        target-position={[0, 0, -18]}
        intensity={2.8}
        color="#A855F7"
        angle={0.7}
        penumbra={0.85}
        distance={65}
      />

      {/* Volumetric Emerald Spotlight over New York Atlantic Gateway */}
      <spotLight
        position={[44, 30, -8]}
        target-position={[44, 0, -8]}
        intensity={2.0}
        color="#10B981"
        angle={0.6}
        penumbra={0.75}
        distance={55}
      />

      {/* Volumetric Pink/Magenta Spotlight over Indianapolis Aerotropolis Airport */}
      <spotLight
        position={[22, 28, -32]}
        target-position={[22, 0, -32]}
        intensity={1.8}
        color="#EC4899"
        angle={0.6}
        penumbra={0.8}
        distance={50}
      />

      {/* Active Disruption Red Alert Strobe Light */}
      {isDisruptionActive && (
        <>
          <pointLight
            ref={emergencyLightRef}
            position={[incidentPos[0], incidentPos[1] + 3.5, incidentPos[2]]}
            color="#EF4444"
            intensity={4.0}
            distance={28}
            decay={2}
          />
          <spotLight
            ref={pulseLightRef}
            position={[incidentPos[0], incidentPos[1] + 18, incidentPos[2]]}
            target-position={incidentPos}
            color="#F43F5E"
            intensity={3.2}
            angle={0.4}
            penumbra={0.9}
            distance={35}
          />
        </>
      )}
    </group>
  );
};
