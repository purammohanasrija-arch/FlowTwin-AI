import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { CameraMode } from './types.js';

export const CameraDirector: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const cameraMode = useDigitalTwinStore(s => s.cameraMode);
  const cameraTarget = useDigitalTwinStore(s => s.cameraTarget);
  const cameraLookAt = useDigitalTwinStore(s => s.cameraLookAt);
  const followedVehicleId = useDigitalTwinStore(s => s.followedVehicleId);
  const vehicles = useDigitalTwinStore(s => s.vehicles);
  const isTourActive = useDigitalTwinStore(s => s.isTourActive);
  const setCameraMode = useDigitalTwinStore(s => s.setCameraMode);

  // Executive flyover waypoints
  const tourWaypoints = [
    { target: [0, 52, 60], lookAt: [0, 0, 0] },
    { target: [-46, 22, 28], lookAt: [-46, 0, 10] }, // Port
    { target: [0, 18, 4], lookAt: [0, 0, -18] }, // Chicago Warehouse
    { target: [4, 12, 14], lookAt: [4, 0.6, -2] }, // Blizzard Incident
    { target: [22, 18, -14], lookAt: [22, 0, -32] }, // Airport
    { target: [44, 20, 12], lookAt: [44, 0, -8] }, // NY Gateway
  ];

  const [tourIndex, setTourIndex] = useState(0);
  const tourTimerRef = useRef(0);

  // Keyboard navigation state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // 1. Executive Flyover Tour autonomous progression
    if (isTourActive || cameraMode === 'executive_flyover') {
      tourTimerRef.current += dt;
      if (tourTimerRef.current > 7.0) {
        tourTimerRef.current = 0;
        setTourIndex(prev => (prev + 1) % tourWaypoints.length);
      }
      const currentWP = tourWaypoints[tourIndex];
      const targetPos = new THREE.Vector3(...currentWP.target);
      const lookAtPos = new THREE.Vector3(...currentWP.lookAt);

      camera.position.lerp(targetPos, 0.04);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAtPos, 0.05);
        controlsRef.current.update();
      }
      return;
    }

    // 2. Follow Vehicle Chase Camera
    if (cameraMode === 'follow_vehicle' && followedVehicleId) {
      const veh = vehicles.find(v => v.vehicleCode === followedVehicleId);
      if (veh) {
        // Position camera behind vehicle based on heading
        const chaseDistance = 14;
        const chaseHeight = 6.5;
        const angle = veh.rotationY || 0;
        const offsetX = -Math.sin(angle) * chaseDistance;
        const offsetZ = -Math.cos(angle) * chaseDistance;

        const targetPos = new THREE.Vector3(
          veh.position3D[0] + offsetX,
          veh.position3D[1] + chaseHeight,
          veh.position3D[2] + offsetZ
        );
        const lookPos = new THREE.Vector3(
          veh.position3D[0],
          veh.position3D[1] + 1.2,
          veh.position3D[2]
        );

        camera.position.lerp(targetPos, 0.06);
        if (controlsRef.current) {
          controlsRef.current.target.lerp(lookPos, 0.08);
          controlsRef.current.update();
        }
        return;
      }
    }

    // 3. Smooth Lerp to target position for incident focus, warehouse inspect, overview, etc.
    if (cameraMode !== 'freefly') {
      const targetPos = new THREE.Vector3(...cameraTarget);
      const lookPos = new THREE.Vector3(...cameraLookAt);

      const isInteracting = controlsRef.current && controlsRef.current.state !== -1;
      if (!isInteracting) {
        if (camera.position.distanceTo(targetPos) > 0.05) {
          camera.position.lerp(targetPos, 0.05);
        }
        if (controlsRef.current && controlsRef.current.target.distanceTo(lookPos) > 0.05) {
          controlsRef.current.target.lerp(lookPos, 0.06);
          controlsRef.current.update();
        }
      }
    }

    // 4. WASD / Arrow Free-Fly Movement
    const moveSpeed = 35 * dt;
    if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
      camera.translateZ(-moveSpeed);
    }
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
      camera.translateZ(moveSpeed);
    }
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
      camera.translateX(-moveSpeed);
    }
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
      camera.translateX(moveSpeed);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent going below ground
      minDistance={6}
      maxDistance={140}
    />
  );
};
