import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { api } from '../../lib/api.js';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { WorldEnvironment } from './WorldEnvironment.js';
import { WorldLighting } from './WorldLighting.js';
import { WorldTerrain } from './WorldTerrain.js';
import { WarehouseCluster } from './WarehouseCluster.js';
import { WarehouseInterior } from './WarehouseInterior.js';
import { RouteNetwork } from './RouteNetwork.js';
import { ParticleSystems } from './ParticleSystems.js';
import { VehicleFleet } from './VehicleFleet.js';
import { CargoVisualization } from './CargoVisualization.js';
import { DisruptionEffects } from './DisruptionEffects.js';
import { RiskVisualization } from './RiskVisualization.js';
import { ExplodedSupplyChainGraph } from './ExplodedSupplyChainGraph.js';
import { AIAgentCommandCenter3D } from './AIAgentCommandCenter3D.js';
import { ScenarioRenderer } from './ScenarioRenderer.js';
import { SpatialLabels } from './SpatialLabels.js';
import { CameraDirector } from './CameraDirector.js';
import { SpatialHUD } from './SpatialHUD.js';
import { Loader2, AlertCircle } from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const quality = useDigitalTwinStore(s => s.quality);
  const syncBackendData = useDigitalTwinStore(s => s.syncBackendData);
  const stepSimulation = useDigitalTwinStore(s => s.stepSimulation);
  const isPlaying = useDigitalTwinStore(s => s.isPlaying);

  const [webGLSupported, setWebGLSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Fetch and sync backend operational data
  useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        const [facRes, routeRes, vehRes, plansRes] = await Promise.allSettled([
          api.get<any>('/facilities'),
          api.get<any>('/routes'),
          api.get<any>('/vehicles'),
          api.get<any>('/recovery-plans'),
        ]);

        const facilities = facRes.status === 'fulfilled' ? facRes.value.facilities : undefined;
        const routes = routeRes.status === 'fulfilled' ? routeRes.value.routes : undefined;
        const vehicles = vehRes.status === 'fulfilled' ? vehRes.value.vehicles : undefined;
        const recoveryPlans = plansRes.status === 'fulfilled' ? plansRes.value.plans : undefined;

        syncBackendData({
          facilities,
          routes,
          vehicles,
          recoveryPlans,
        });
      } catch (err) {
        console.warn('Backend live sync fallback to procedural initial data:', err);
      }
    };

    fetchOperationalData();
  }, [syncBackendData]);

  // Simulation clock ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepSimulation(1.5); // Advance simulation clock
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, stepSimulation]);

  if (!webGLSupported) {
    return (
      <div className="w-full h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-[#070913] text-white p-8 rounded-2xl border border-red-900/40 font-mono">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">WebGL Hardware Acceleration Unavailable</h2>
        <p className="text-sm text-gray-400 max-w-md text-center mb-6">
          The 3D Logistics Universe requires WebGL. Please ensure hardware acceleration is enabled in your browser settings.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono"
        >
          Retry WebGL Initialization
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] bg-[#06070D] rounded-2xl border border-[#1A1F36] shadow-2xl overflow-hidden select-none">
      {/* 1. THREE.JS REACT CANVAS (Isolated z-0 stacking context) */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows={quality === 'cinematic'}
          camera={{ position: [0, 48, 56], fov: 45 }}
          dpr={[1, quality === 'cinematic' ? 2 : quality === 'balanced' ? 1.5 : 1]}
          gl={{
            antialias: quality !== 'performance',
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            {/* World Lighting */}
            <WorldLighting />

            {/* Atmospheric Environment & Weather Particles */}
            <WorldEnvironment />

            {/* Camera Director with 10 Modes & Easing */}
            <CameraDirector />

            {/* Procedural World Terrain & Oceans */}
            <WorldTerrain />

            {/* 10 Operational Industrial Facilities */}
            <WarehouseCluster />

            {/* Exploded High-Bay Warehouse Cutaway Interior */}
            <WarehouseInterior />

            {/* Multi-Scale Logistics Corridors & Splines */}
            <RouteNetwork />

            {/* GPU Route Flow Particles */}
            <ParticleSystems />

            {/* Transport Fleet Vehicles with Real Spatial Movement */}
            <VehicleFleet />

            {/* Physical Cargo Visualization & Laser Slicing */}
            <CargoVisualization />

            {/* Active Disruption Shockwaves & Barricades */}
            <DisruptionEffects />

            {/* 3D Capacity Towers & Spatial Risk Heatmap */}
            <RiskVisualization />

            {/* 7-Layer Supply Chain Exploded Dependency Graph */}
            <ExplodedSupplyChainGraph />

            {/* 3D AI Agent Command Center Neural Mesh */}
            <AIAgentCommandCenter3D />

            {/* Scenario Comparison Ghost Overlay */}
            <ScenarioRenderer />

            {/* Floating Spatial HUD Labels */}
            <SpatialLabels />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. SPATIAL HOLOGRAPHIC 2D INTERFACE OVERLAY */}
      <SpatialHUD />
    </div>
  );
};
