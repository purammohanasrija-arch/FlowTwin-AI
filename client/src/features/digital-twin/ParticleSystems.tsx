import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDigitalTwinStore } from './DigitalTwinStore.js';

export const ParticleSystems: React.FC = () => {
  const routes = useDigitalTwinStore(s => s.routes);
  const layers = useDigitalTwinStore(s => s.layers);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);
  const playbackSpeed = useDigitalTwinStore(s => s.playbackSpeed);
  const quality = useDigitalTwinStore(s => s.quality);

  const particlesRef = useRef<THREE.Points>(null);

  // Pre-generate spline curves
  const curves = useMemo(() => {
    return routes
      .filter(r => r.splinePoints && r.splinePoints.length >= 2)
      .map(r => {
        const points = r.splinePoints.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        return {
          curve: new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2),
          routeCode: r.routeCode,
          speed: r.flowSpeed || 0.4,
          isBypass: r.isBypassAlternative,
          isClosed: r.isClosed,
        };
      });
  }, [routes]);

  // Total particle count
  const particlesPerRoute = quality === 'cinematic' ? 40 : 20;
  const totalCount = curves.length * particlesPerRoute;

  // Initial particle buffers
  const { geometry, offsets, speeds, curveIndices } = useMemo(() => {
    const pos = new Float32Array(totalCount * 3);
    const cols = new Float32Array(totalCount * 3);
    const offs = new Float32Array(totalCount);
    const spds = new Float32Array(totalCount);
    const cIdx = new Uint16Array(totalCount);

    let idx = 0;
    curves.forEach((cItem, cIndex) => {
      for (let p = 0; p < particlesPerRoute; p++) {
        const t = p / particlesPerRoute;
        const pt = cItem.curve.getPointAt(t);

        pos[idx * 3] = pt.x;
        pos[idx * 3 + 1] = pt.y + 0.3;
        pos[idx * 3 + 2] = pt.z;

        offs[idx] = t;
        spds[idx] = cItem.speed * (0.8 + Math.random() * 0.4);
        cIdx[idx] = cIndex;

        // Color coding
        if (cItem.isClosed) {
          cols[idx * 3] = 0.94; // Red
          cols[idx * 3 + 1] = 0.26;
          cols[idx * 3 + 2] = 0.26;
        } else if (cItem.isBypass) {
          cols[idx * 3] = 0.66; // Violet
          cols[idx * 3 + 1] = 0.33;
          cols[idx * 3 + 2] = 0.97;
        } else {
          cols[idx * 3] = 0.0; // Cyan
          cols[idx * 3 + 1] = 0.96;
          cols[idx * 3 + 2] = 1.0;
        }

        idx++;
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return {
      geometry: geom,
      offsets: offs,
      speeds: spds,
      curveIndices: cIdx,
    };
  }, [curves, particlesPerRoute, totalCount]);

  // Animate flow particles along spline curves
  useFrame((_, delta) => {
    if (!particlesRef.current || !isPlaying) return;

    const dt = Math.min(delta, 0.1);
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < totalCount; i++) {
      const cIndex = curveIndices[i];
      const curveItem = curves[cIndex];
      if (!curveItem) continue;

      offsets[i] = (offsets[i] + speeds[i] * dt * 0.15 * playbackSpeed) % 1.0;
      const pt = curveItem.curve.getPointAt(offsets[i]);

      pos[i * 3] = pt.x;
      pos[i * 3 + 1] = pt.y + 0.35;
      pos[i * 3 + 2] = pt.z;
    }

    posAttr.needsUpdate = true;
  });

  if (!layers.particles) return null;

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={quality === 'cinematic' ? 0.45 : 0.32}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
