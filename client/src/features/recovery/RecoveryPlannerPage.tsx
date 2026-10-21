import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { MOCK_RECOVERY_PLANS } from '../../lib/mockApi.js';
import { useAuth } from '../../lib/authContext.js';

export const RecoveryPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>(MOCK_RECOVERY_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(MOCK_RECOVERY_PLANS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  const fetchPlans = () => {
    setIsLoading(true);
    api.get<{ plans: any[] }>('/recovery-plans')
      .then(res => {
        if (res && Array.isArray(res.plans) && res.plans.length > 0) {
          setPlans(res.plans);
          setSelectedPlan((prev: any) => prev ? (res.plans.find((p: any) => p.planCode === prev.planCode) || res.plans[0]) : res.plans[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleApprovalAction = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);

    try {
      const res: any = await api.post(`/recovery-plans/${selectedPlan.planCode}/approve`, {
        decision: approvalDecision,
        reviewNotes,
      });

      if (approvalDecision === 'approve') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#10B981', '#06B6D4'],
        });
      }

      setApprovalModalOpen(false);
      fetchPlans();
      setSelectedPlan(res.plan);
    } catch (err: any) {
      alert(`Approval action failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isManagerOrAdmin = user?.role === 'Administrator' || user?.role === 'Logistics Manager';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Recovery Planner & Approval Engine</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AGENT D & E ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Multi-objective trade-off balancing, constraint verification, and human-in-the-loop operational signoff.
          </p>
        </div>

        {selectedPlan && selectedPlan.approvalStatus === 'pending_review' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setApprovalDecision('reject');
                setApprovalModalOpen(true);
              }}
              disabled={!isManagerOrAdmin}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-all disabled:opacity-40"
              title={!isManagerOrAdmin ? 'Only Logistics Manager or Admin can sign off' : ''}
            >
              Reject Plan
            </button>
            <button
              onClick={() => {
                setApprovalDecision('approve');
                setApprovalModalOpen(true);
              }}
              disabled={!isManagerOrAdmin}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all disabled:opacity-40"
              title={!isManagerOrAdmin ? 'Only Logistics Manager or Admin can sign off' : ''}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Synchronize Simulation</span>
            </button>
          </div>
        )}
      </div>

      {/* Role permission warning if viewer or analyst */}
      {!isManagerOrAdmin && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              Your active role is <b>{user?.role}</b> (Read-Only Signoff). Switch to <b>Logistics Manager</b> in the top right header to authorize operational plans.
            </span>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Plan Cards on Left */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Available Candidate Plans ({plans.length})
          </div>
          {plans.map(plan => (
            <div
              key={plan._id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlan?._id === plan._id
                  ? 'bg-purple-600/15 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-[#121422] border-[#24283E] text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono text-purple-400 font-bold">{plan.planCode}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                    plan.approvalStatus === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : plan.approvalStatus === 'rejected'
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {plan.approvalStatus.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-semibold text-white text-xs">{plan.title}</h3>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{plan.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] font-mono">
                <div>
                  <span className="text-gray-500">Recovered:</span>
                  <span className="text-emerald-400 ml-1 font-bold">
                    {plan.projectedRecoveryMetrics?.recoveredOnTimeDeliveries} orders
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Delay Saved:</span>
                  <span className="text-purple-400 ml-1 font-bold">
                    -{plan.projectedRecoveryMetrics?.reducedDelayHours}h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Plan In-Depth Dossier on Right */}
        <div className="lg:col-span-2 space-y-5">
          {selectedPlan ? (
            <div className="p-6 rounded-xl bg-[#121422] border border-[#24283E] space-y-6">
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedPlan.title}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {selectedPlan.strategyCategory.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedPlan.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-gray-500 font-mono">SCENARIO TARGET</div>
                  <div className="text-xs text-purple-300 font-medium">{selectedPlan.scenarioName}</div>
                </div>
              </div>

              {/* Multi-Objective Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[#161928] border border-emerald-500/30">
                  <div className="text-gray-400 text-[10px]">On-Time Saved</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {selectedPlan.projectedRecoveryMetrics?.recoveredOnTimeDeliveries} Orders
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#161928] border border-purple-500/30">
                  <div className="text-gray-400 text-[10px]">Delay Reduction</div>
                  <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                    -{selectedPlan.projectedRecoveryMetrics?.reducedDelayHours} Hours
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#161928] border border-cyan-500/30">
                  <div className="text-gray-400 text-[10px]">Net Expedite Cost</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                    ${(selectedPlan.projectedRecoveryMetrics?.netCostUSD || 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#161928] border border-amber-500/30">
                  <div className="text-gray-400 text-[10px]">Feasibility Score</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                    {selectedPlan.projectedRecoveryMetrics?.feasibilityScore} / 100
                  </div>
                </div>
              </div>

              {/* Proposed Operational Actions */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Proposed Dispatch & Routing Actions
                </div>
                <div className="space-y-2">
                  {selectedPlan.proposedActions?.map((action: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#161928] border border-white/[0.04] flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{action.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
                            {action.shipmentId}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{action.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-emerald-400 font-mono font-semibold">-{action.timeSavingsHours}h delay</div>
                        <div className="text-[10px] text-gray-500 font-mono">+${action.costDeltaUSD} USD</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hard Constraints Verification (Agent E) */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Operational Constraint Validation (Agent E)</span>
                  <span className="text-[10px] font-mono text-emerald-400">ALL CONSTRAINTS SATISFIED</span>
                </div>
                <div className="divide-y divide-[#1E2238] border border-[#24283E] rounded-xl overflow-hidden bg-[#161928]">
                  {selectedPlan.constraintsChecked?.map((c: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{c.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Audit Trail */}
              {selectedPlan.approvedBy && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <UserCheck className="w-4 h-4" />
                    <span>Signed off by {selectedPlan.approvedBy} on {new Date(selectedPlan.approvedAt).toLocaleString()}</span>
                  </div>
                  {selectedPlan.reviewNotes && (
                    <p className="text-gray-300 mt-1 italic">&quot;{selectedPlan.reviewNotes}&quot;</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-[#121422] rounded-xl border border-[#24283E]">
              Select a candidate recovery plan to review actions and operational constraints.
            </div>
          )}
        </div>
      </div>

      {/* Manager Approval Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#10121C] border border-[#24283E] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">
              {approvalDecision === 'approve' ? 'Authorize Recovery Plan' : 'Reject Recovery Plan'}
            </h2>
            <p className="text-xs text-gray-300">
              You are authorizing operational dispatch synchronization for plan <b>{selectedPlan?.planCode}</b> ({selectedPlan?.title}).
            </p>

            <div>
              <label className="text-xs text-gray-400">Reviewer Notes (Recorded in Immutable Audit Trail)</label>
              <textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder="e.g. Approved team-driver detour due to urgent customer delivery SLA."
                rows={3}
                className="w-full mt-1.5 bg-[#161928] border border-[#24283E] rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setApprovalModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] text-gray-300 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprovalAction}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white font-semibold text-xs shadow-md transition-all ${
                  approvalDecision === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                }`}
              >
                {isSubmitting ? 'Recording Audit...' : 'Confirm Operational Signoff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
