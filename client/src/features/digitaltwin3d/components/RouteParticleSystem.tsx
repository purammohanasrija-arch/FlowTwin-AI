import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createRouteCurve } from '../utils/geoTo3d.js';

interface RouteParticleSystemProps {
  routes: Array<{
    routeCode: string;
    coordinates: [number, number][];
    routeType: string;
    isClosed?: boolean;
  }>;
  isPlaying: boolean;
  playbackSpeed: number;
  timelineProgress: number; // 0.0 to 1.0
}

const PARTICLES_PER_ROUTE = 5;

export const RouteParticleSystem: React.FC<RouteParticleSystemProps> = ({
  routes,
  isPlaying,
  playbackSpeed,
  timelineProgress,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate spline curves for each route
  const curves = useMemo(() => {
    return routes.map(r => ({
      curve: createRouteCurve(r.coordinates, 0.42),
      isDisrupted: r.isClosed || false,
      isAlt: r.routeType === 'alternative',
    }));
  }, [routes]);

  const totalParticles = curves.length * PARTICLES_PER_ROUTE;

  // Track dynamic time offset when playing
  const timeOffsetRef = useRef(0);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || totalParticles === 0) return;

    if (isPlaying) {
      timeOffsetRef.current += delta * 0.12 * playbackSpeed;
    }

    let instanceIdx = 0;

    curves.forEach((item) => {
      const { curve, isDisrupted, isAlt } = item;

      for (let p = 0; p < PARTICLES_PER_ROUTE; p++) {
        // Compute progress along curve combining timeline scrubber and dynamic flow
        const baseOffset = p / PARTICLES_PER_ROUTE;
        const currentProgress = (baseOffset + timeOffsetRef.current + timelineProgress) % 1.0;

        // Fetch position on 3D curve
        const point = curve.getPointAt(currentProgress);
        const tangent = curve.getTangentAt(currentProgress);

        dummy.position.copy(point);
        dummy.lookAt(point.clone().add(tangent));

        // Scale: elongated pill / photon packet
        const scale = isDisrupted ? 0.08 : isAlt ? 0.12 : 0.18;
        dummy.scale.set(scale, scale, scale * 2.2);

        dummy.updateMatrix();
        mesh.setMatrixAt(instanceIdx, dummy.matrix);

        // Color based on status
        const color = isDisrupted
          ? new THREE.Color('#EF4444')
          : isAlt
          ? new THREE.Color('#10B981')
          : new THREE.Color('#38BDF8');

        mesh.setColorAt(instanceIdx, color);

        instanceIdx++;
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  if (totalParticles === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, totalParticles]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};
