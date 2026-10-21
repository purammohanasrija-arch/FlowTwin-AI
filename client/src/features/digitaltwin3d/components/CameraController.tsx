import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { geoTo3D } from '../utils/geoTo3d.js';

export type CameraPreset = 'overview' | 'warehouses' | 'vehicles' | 'routes' | 'incidents';

interface CameraControllerProps {
  preset: CameraPreset;
  selectedEntity: any | null;
  isTourActive: boolean;
  onTourComplete?: () => void;
}

const PRESET_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [0, 52, 48],
    target: [0, 0, 0],
  },
  warehouses: {
    pos: [18, 16, 12],
    target: [17, 1, -4], // Chicago / Midwest hub
  },
  vehicles: {
    pos: [-14, 14, 22],
    target: [-12, 1, 15], // Transit route
  },
  routes: {
    pos: [0, 36, 20],
    target: [0, 0, 0],
  },
  incidents: {
    pos: [5, 11, 8],
    target: [3.5, 0.4, 2.5], // I-80 Disruption site
  },
};

// Guided tour waypoints
const TOUR_STOPS = [
  { pos: [-38, 16, 24], target: [-32, 1, 12], duration: 4 }, // West Coast Hub
  { pos: [5, 11, 8], target: [3.5, 0.4, 2.5], duration: 5 },  // I-80 Disruption Barrier
  { pos: [18, 16, 10], target: [17, 1, -4], duration: 4 },   // Chicago Inland Hub
  { pos: [44, 15, 6], target: [39, 1, -2], duration: 4 },    // Port of NY/NJ
  { pos: [0, 52, 48], target: [0, 0, 0], duration: 5 },      // Full System Overview
];

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  selectedEntity,
  isTourActive,
  onTourComplete,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetCamPos = useRef(new THREE.Vector3(0, 52, 48));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Tour state
  const tourIndexRef = useRef(0);
  const tourTimerRef = useRef(0);

  // Update target when preset or selectedEntity changes
  useEffect(() => {
    if (isTourActive) return;

    if (selectedEntity) {
      if (selectedEntity.type === 'facility' && selectedEntity.data?.location) {
        const [x, y, z] = geoTo3D(selectedEntity.data.location.latitude, selectedEntity.data.location.longitude);
        targetLookAt.current.set(x, y + 1, z);
        targetCamPos.current.set(x + 10, y + 12, z + 12);
        return;
      }

      if (selectedEntity.type === 'incident' && selectedEntity.data?.location) {
        const [x, y, z] = geoTo3D(selectedEntity.data.location.latitude, selectedEntity.data.location.longitude);
        targetLookAt.current.set(x, y + 0.5, z);
        targetCamPos.current.set(x + 7, y + 9, z + 8);
        return;
      }

      if (selectedEntity.type === 'vehicle' && selectedEntity.data?.currentLocation) {
        const [x, y, z] = geoTo3D(selectedEntity.data.currentLocation.latitude, selectedEntity.data.currentLocation.longitude);
        targetLookAt.current.set(x, y + 0.5, z);
        targetCamPos.current.set(x + 8, y + 8, z + 8);
        return;
      }
    }

    // Default to preset
    const cfg = PRESET_CONFIGS[preset] || PRESET_CONFIGS.overview;
    targetCamPos.current.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    targetLookAt.current.set(cfg.target[0], cfg.target[1], cfg.target[2]);
  }, [preset, selectedEntity, isTourActive]);

  // Smooth lerp frame loop
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Handle Guided Tour progression
    if (isTourActive) {
      tourTimerRef.current += delta;
      const currentStop = TOUR_STOPS[tourIndexRef.current];

      if (currentStop) {
        targetCamPos.current.set(currentStop.pos[0], currentStop.pos[1], currentStop.pos[2]);
        targetLookAt.current.set(currentStop.target[0], currentStop.target[1], currentStop.target[2]);

        if (tourTimerRef.current >= currentStop.duration) {
          tourTimerRef.current = 0;
          tourIndexRef.current++;
          if (tourIndexRef.current >= TOUR_STOPS.length) {
            tourIndexRef.current = 0;
            onTourComplete?.();
          }
        }
      }
    }

    // Smooth lerp camera position and orbit controls target
    camera.position.lerp(targetCamPos.current, 0.04);
    controlsRef.current.target.lerp(targetLookAt.current, 0.05);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2.1} // Prevent dipping below ground
      minDistance={10}
      maxDistance={120}
    />
  );
};
