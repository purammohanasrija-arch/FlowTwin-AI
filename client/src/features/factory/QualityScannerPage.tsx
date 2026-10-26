import React, { useState } from 'react';
import {
  Scan,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  RotateCcw,
  Thermometer,
  ShieldCheck,
  Eye,
  Info,
  Layers,
} from 'lucide-react';
import { useChocolateFactoryStore, QualityBatchRecord } from './chocolateFactoryStore.js';

export const QualityScannerPage: React.FC = () => {
  const qualityBatches = useChocolateFactoryStore(s => s.qualityBatches);
  const scanNewBatch = useChocolateFactoryStore(s => s.scanNewBatch);
  const params = useChocolateFactoryStore(s => s.parameters);

  const [selectedBatch, setSelectedBatch] = useState<QualityBatchRecord>(qualityBatches[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanBeamActive, setScanBeamActive] = useState(false);

  const handleScanClick = () => {
    setIsScanning(true);
    setScanBeamActive(true);

    setTimeout(() => {
      const newRecord = scanNewBatch();
      setSelectedBatch(newRecord);
      setIsScanning(false);
      setScanBeamActive(false);
    }, 1200);
  };

  const isPassed = selectedBatch.inspectionResult === 'Passed';
  const isFlagged = selectedBatch.inspectionResult === 'Flagged';
  const isRejected = selectedBatch.inspectionResult === 'Rejected';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Chocolate Quality Scanner
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              SIMULATED DEMO INSPECTION
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Simulated optical surface inspection and seal integrity scanner. Verifies chocolate bar crystallization, surface gloss, mold edge definition, and airtight packaging seal.
          </p>
        </div>

        {/* Scan Batch Action Button */}
        <button
          onClick={handleScanClick}
          disabled={isScanning}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold font-mono text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
        >
          <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Analyzing Infeed Batch...' : 'Scan New Batch'}</span>
        </button>
      </div>

      {/* Main Scanner Stage & Batch Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Optical Inspection Scanner Viewport (Col 1-7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Optical Scanner Station #01
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              Camera Resolution: 4K 120 FPS
            </span>
          </div>

          {/* Simulated Inspection Visualizer Box with laser scan beam */}
          <div className="relative w-full h-64 rounded-xl bg-[#0F0804] border border-amber-500/30 overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Visualizer Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

            {/* Simulated Chocolate Bar Graphic */}
            <div className="relative z-10 w-48 h-28 rounded-lg bg-gradient-to-r from-[#4E2712] via-[#653317] to-[#4E2712] border-2 border-amber-600/60 shadow-2xl flex flex-col justify-between p-3 select-none">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono text-amber-200 font-bold uppercase tracking-wider">
                  ChocoFlow 70%
                </span>
                <span className="text-[8px] font-mono text-amber-400/80">100g</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-10 my-auto">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded bg-[#3A1B0B] border border-amber-900/40" />
                ))}
              </div>
              <div className="flex justify-between items-end text-[7px] font-mono text-amber-300/70">
                <span>{selectedBatch.batchNumber}</span>
                <span>SNAP: OPTIMAL</span>
              </div>
            </div>

            {/* Animated Laser Scanning Beam */}
            {scanBeamActive && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2 transition-all" />
            )}

            {/* Target Reticle Overlay */}
            <div className="absolute inset-6 border border-amber-500/20 rounded-lg pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between text-[9px] font-mono text-amber-400/60">
                <span>[SCANNER_LOCKED]</span>
                <span>GLOSS: 98.2%</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-amber-400/60">
                <span>SURFACE_UNIFORMITY: OK</span>
                <span>TEMP: {selectedBatch.storageTempCelsius}°C</span>
              </div>
            </div>
          </div>

          {/* Quick Disclaimer Label */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Demo Notice:</strong> This quality inspection station uses simulated factory test telemetry. Real optical cameras and physical weight cells are represented digitally.
            </span>
          </div>
        </div>

        {/* Right: Inspection Certificate & Results (Col 8-12) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#160D08] border border-amber-500/25 shadow-xl space-y-5">
          <div className="flex items-start justify-between border-b border-amber-500/15 pb-4">
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Batch Quality Certificate
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {selectedBatch.batchNumber}
              </h3>
              <span className="text-xs text-gray-400 font-mono">{selectedBatch.date}</span>
            </div>

            {/* Overall Verdict Badge */}
            <div
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 ${
                isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isFlagged
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              {isPassed ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>VERDICT: {selectedBatch.inspectionResult.toUpperCase()}</span>
            </div>
          </div>

          {/* Detailed Checked Parameters */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#20120A] border border-amber-500/15">
              <span className="text-gray-300">Recipe / Variety</span>
              <span className="font-mono font-bold text-amber-200">{selectedBatch.recipe}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-[#20120A] border border-amber-500/15">
              <span className="text-gray-300">Chocolate Appearance</span>
              <span className="font-mono font-bold text-white">{selectedBatch.appearance}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-[#20120A] border border-amber-500/15">
              <span className="text-gray-300">Shape & Packaging Seal</span>
              <span className="font-mono font-bold text-white">{selectedBatch.shapeAndSeal}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-[#20120A] border border-amber-500/15">
              <span className="text-gray-300">Storage Temperature</span>
              <span className="font-mono font-bold text-cyan-300">
                {selectedBatch.storageTempCelsius}°C (Target: 16-19°C)
              </span>
            </div>

            {/* Counts: Accepted vs Rejected */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Accepted Bars</span>
                <span className="text-lg font-bold font-mono text-emerald-300">
                  {selectedBatch.acceptedCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400/80 block mt-0.5">Approved for Delivery</span>
              </div>

              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/25">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Rejected Bars</span>
                <span className="text-lg font-bold font-mono text-red-300">
                  {selectedBatch.rejectedCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-red-400/80 block mt-0.5">Diverted to Remelt</span>
              </div>
            </div>

            {selectedBatch.rejectionReason && (
              <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-[11px] text-amber-200">
                <strong>Flag Reason:</strong> {selectedBatch.rejectionReason}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Batch Inspection History Table */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Recent Batch Inspection Logs
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {qualityBatches.length} batches logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] font-mono text-gray-400 border-b border-amber-500/15 uppercase">
              <tr>
                <th className="py-2.5 px-3">Batch Number</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Recipe</th>
                <th className="py-2.5 px-3">Appearance</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Accepted / Rejected</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 font-sans">
              {qualityBatches.map(batch => (
                <tr
                  key={batch.batchNumber}
                  onClick={() => setSelectedBatch(batch)}
                  className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                    selectedBatch.batchNumber === batch.batchNumber ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {batch.batchNumber}
                  </td>
                  <td className="py-3 px-3 text-gray-400 font-mono">{batch.date}</td>
                  <td className="py-3 px-3 text-amber-200">{batch.recipe}</td>
                  <td className="py-3 px-3 text-gray-300">{batch.appearance}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        batch.inspectionResult === 'Passed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {batch.inspectionResult}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-emerald-400">{batch.acceptedCount}</span>
                    <span className="text-gray-500"> / </span>
                    <span className="text-red-400">{batch.rejectedCount}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                      }}
                      className="text-amber-400 hover:text-amber-300 text-xs font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
