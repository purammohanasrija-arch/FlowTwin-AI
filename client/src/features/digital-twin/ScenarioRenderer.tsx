import React from 'react';
import { Html } from '@react-three/drei';
import { useDigitalTwinStore } from './DigitalTwinStore.js';
import { CheckCircle2, TrendingDown, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const ScenarioRenderer: React.FC = () => {
  const scenarioComparison = useDigitalTwinStore(s => s.scenarioComparison);
  const setScenarioComparison = useDigitalTwinStore(s => s.setScenarioComparison);
  const applyRecoveryPlan = useDigitalTwinStore(s => s.applyRecoveryPlan);
  const approvedRecoveryPlanCode = useDigitalTwinStore(s => s.approvedRecoveryPlanCode);

  if (!scenarioComparison.active) return null;

  const { baselineMetrics, recoveryMetrics } = scenarioComparison;
  const isApproved = !!approvedRecoveryPlanCode;

  return (
    <group name="ScenarioRenderer">
      {/* 1. Translucent Ghost Phantom Route Corridor (I-70 Bypass in Glowing Violet) */}
      <group position={[20, 3.5, 4]}>
        <Html center distanceFactor={35} zIndexRange={[10, 0]} className="pointer-events-auto select-none">
          <div className="w-[360px] p-4 rounded-xl bg-[#0B0E1E]/95 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-xl text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                <h3 className="text-xs font-bold font-mono tracking-wider text-purple-300 uppercase">
                  Scenario Ghost Comparison
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                PLAN-REC-01
              </span>
            </div>

            {/* Metrics Comparison Table */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
              {/* Baseline */}
              <div className="p-2 rounded bg-red-950/40 border border-red-900/60">
                <span className="text-[10px] text-red-400 font-bold block mb-1">
                  CURRENT BASELINE
                </span>
                <div className="text-gray-300 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>Delay:</span>
                    <span className="text-red-400 font-bold">{baselineMetrics.avgDelayHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Shipments:</span>
                    <span className="text-red-400">{baselineMetrics.lateDeliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Compliance:</span>
                    <span className="text-red-400">{baselineMetrics.slaCompliancePct}%</span>
                  </div>
                </div>
              </div>

              {/* Recovery Alternative */}
              <div className="p-2 rounded bg-purple-950/50 border border-purple-500/50">
                <span className="text-[10px] text-purple-300 font-bold block mb-1">
                  I-70 BYPASS PLAN
                </span>
                <div className="text-gray-200 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span>Delay:</span>
                    <span className="text-emerald-400 font-bold">
                      {recoveryMetrics.avgDelayHours}h (-11.4h)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Shipments:</span>
                    <span className="text-emerald-400 font-bold">
                      {recoveryMetrics.lateDeliveries} (-89%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Compliance:</span>
                    <span className="text-emerald-400 font-bold">
                      {recoveryMetrics.slaCompliancePct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyRecoveryPlan('PLAN-REC-01')}
                disabled={isApproved}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  isApproved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                }`}
              >
                {isApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recovery Plan Approved
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Approve Simulated Recovery
                  </>
                )}
              </button>

              <button
                onClick={() => setScenarioComparison({ active: false })}
                className="py-1.5 px-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
