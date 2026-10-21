import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle,
  Filter,
  MessageSquare,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { MOCK_ALERTS } from '../../lib/mockApi.js';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>(MOCK_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNoteAlert, setActiveNoteAlert] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const fetchAlerts = () => {
    setIsLoading(true);
    api.get<{ alerts: any[] }>('/alerts')
      .then(res => {
        if (res && Array.isArray(res.alerts)) {
          setAlerts(res.alerts);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateStatus = async (alertCode: string, status: string) => {
    try {
      await api.patch(`/alerts/${alertCode}`, { status });
      fetchAlerts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddNote = async (alertCode: string) => {
    if (!noteInput.trim()) return;
    try {
      await api.patch(`/alerts/${alertCode}`, { note: noteInput });
      setNoteInput('');
      setActiveNoteAlert(null);
      fetchAlerts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Operational Alerts & Triage Center</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Automated event correlation for corridor disruptions, mechanical delays, and SLA deadlines.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-[#121422] border border-[#24283E] rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#121422] border border-[#24283E] rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading alerts telemetry...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-[#121422] rounded-xl border border-[#24283E]">
            No alerts found matching filter.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert._id}
              className={`p-4 rounded-xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-rose-500/5 border-rose-500/30'
                  : alert.severity === 'warning'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-[#121422] border-[#24283E]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {alert.severity === 'critical' ? (
                      <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-cyan-400 shrink-0" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{alert.title}</span>
                      <span className="font-mono text-[10px] text-gray-400">({alert.alertCode})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1">{alert.message}</p>

                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {alert.assignedTo && <span>Assignee: {alert.assignedTo}</span>}
                      {alert.linkedEntityId && (
                        <span className="text-purple-400 font-semibold">Target: {alert.linkedEntityId}</span>
                      )}
                    </div>

                    {/* Operational Notes */}
                    {alert.notes && alert.notes.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.06] space-y-1">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          Triage Notes:
                        </span>
                        {alert.notes.map((n: string, i: number) => (
                          <div key={i} className="text-[11px] text-gray-300 italic">
                            {n}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.alertCode, 'resolved')}
                      className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold transition-colors"
                    >
                      Resolve
                    </button>
                  )}

                  {alert.linkedEntityType === 'shipment' && (
                    <button
                      onClick={() => navigate(`/app/shipments?search=${alert.linkedEntityId}`)}
                      className="px-2.5 py-1 rounded bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Inspect Shipment</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {alert.linkedEntityType === 'scenario' && (
                    <button
                      onClick={() => navigate('/app/simulations')}
                      className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Inspect Scenario</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveNoteAlert(activeNoteAlert === alert.alertCode ? null : alert.alertCode)}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-colors"
                    title="Add Triage Note"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note input drawer */}
              {activeNoteAlert === alert.alertCode && (
                <div className="mt-3 pt-3 border-t border-white/[0.08] flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter operator note..."
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    className="flex-1 bg-[#0A0B12] border border-[#24283E] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => handleAddNote(alert.alertCode)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
