import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { ChocolateFactoryScene } from './ChocolateFactoryScene.js';
import { MachineDetailsModal, SelectedFactoryEntity } from './MachineDetailsModal.js';
import { FactoryFloor2DFallback } from './FactoryFloor2DFallback.js';
import { useChocolateFactoryStore } from '../chocolateFactoryStore.js';
import {
  RotateCcw,
  Eye,
  Box,
  Layers,
  Sparkles,
  Maximize2,
  Sliders,
  Play,
  Pause,
  Info,
} from 'lucide-react';

export const ChocolateFactoryCanvas: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<SelectedFactoryEntity | null>(null);

  const selectedZone = useChocolateFactoryStore(s => s.selectedZone);
  const selectZone = useChocolateFactoryStore(s => s.selectZone);
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);
  const startProduction = useChocolateFactoryStore(s => s.startProduction);
  const pauseProduction = useChocolateFactoryStore(s => s.pauseProduction);

  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        setViewMode('2d');
      }
    } catch {
      setWebGLSupported(false);
      setViewMode('2d');
    }
  }, []);

  const handleResetCamera = () => {
    selectZone('all');
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
  };

  const handleZoneClick = (zone: string, targetPos?: [number, number, number]) => {
    selectZone(zone);
    if (controlsRef.current && targetPos) {
      controlsRef.current.target.set(targetPos[0], targetPos[1], targetPos[2]);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] min-h-[580px] bg-[#0C0704] rounded-2xl border border-amber-500/25 shadow-2xl overflow-hidden select-none flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Zone Jump Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1A0E08]/90 border border-amber-500/30 backdrop-blur-md shadow-xl overflow-x-auto max-w-full">
          <button
            onClick={() => handleZoneClick('all', [0, 0, 0])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Full Factory
          </button>
          <button
            onClick={() => handleZoneClick('storage', [-24, 0, -12])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'storage'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            1. Raw Materials
          </button>
          <button
            onClick={() => handleZoneClick('production', [-5, 0, -12])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'production'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            2. Chocolate Making
          </button>
          <button
            onClick={() => handleZoneClick('packaging', [14, 0, -12])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'packaging'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            3. Packaging
          </button>
          <button
            onClick={() => handleZoneClick('cold_storage', [-16, 0, 10])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'cold_storage'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            4. Cold Storage
          </button>
          <button
            onClick={() => handleZoneClick('delivery', [14, 0, 10])}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedZone === 'delivery'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            5. Loading Docks
          </button>
        </div>

        {/* Right: Quick Action Buttons (Reset Camera, 2D/3D Toggle, Run/Pause) */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Start/Pause Factory */}
          <button
            onClick={isRunning ? pauseProduction : startProduction}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-lg transition-all ${
              isRunning
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Production: Active' : 'Start Factory'}</span>
          </button>

          {/* Reset Camera */}
          {viewMode === '3d' && (
            <button
              onClick={handleResetCamera}
              title="Reset camera position"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-amber-200 bg-[#1A0E08]/90 hover:bg-[#2A170D] border border-amber-500/30 backdrop-blur-md transition-all shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Camera</span>
            </button>
          )}

          {/* 3D / 2D Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#1A0E08]/90 border border-amber-500/30 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setViewMode('3d')}
              disabled={!webGLSupported}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              3D
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              2D Floor Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area: 3D Scene or 2D Blueprint */}
      {viewMode === '3d' ? (
        <div className="w-full h-full">
          <Canvas
            shadows
            camera={{ position: [0, 42, 52], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <PerspectiveCamera makeDefault position={[0, 42, 52]} fov={42} />
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.06}
              minDistance={15}
              maxDistance={110}
              maxPolarAngle={Math.PI / 2.05} // Keep camera above floor
            />
            <Suspense fallback={null}>
              <ChocolateFactoryScene
                onSelectEntity={entity => setSelectedEntity(entity)}
                selectedEntityId={selectedEntity?.id || null}
              />
            </Suspense>
          </Canvas>

          {/* Bottom Left Tip */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#160D08]/85 border border-amber-500/20 text-[11px] text-amber-200/80 font-mono backdrop-blur-sm">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Click any machine, tank, conveyor, or truck to view operating details. Drag to rotate 360°.</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto p-4 sm:p-6 pt-16">
          <FactoryFloor2DFallback onSelectEntity={entity => setSelectedEntity(entity)} />
        </div>
      )}

      {/* Machine Details Inspector Drawer / Modal */}
      <MachineDetailsModal
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onTriggerAction={action => {
          alert(`Diagnostic test completed for ${selectedEntity?.name}. Machine telemetries verified optimal.`);
        }}
      />
    </div>
  );
};

export default ChocolateFactoryCanvas;
