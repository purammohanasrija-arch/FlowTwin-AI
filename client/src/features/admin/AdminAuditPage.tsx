import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/authContext.js';

export const AdminAuditPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'users'>('audit');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get<{ events: any[] }>('/admin/audit-events').catch(() => ({ events: [] })),
      user?.role === 'Administrator' ? api.get<{ users: any[] }>('/admin/users').catch(() => ({ users: [] })) : Promise.resolve({ users: [] }),
    ])
      .then(([auditRes, usersRes]) => {
        setAuditEvents(auditRes.events || []);
        setUsers(usersRes.users || []);
      })
      .finally(() => setIsLoading(false));
  }, [user?.role]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Security & Immutable Audit Trail</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25">
            GOVERNANCE LOGS
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Cryptographically recorded actions, operational approvals, role changes, and authorization telemetry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#24283E]">
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Audit Trail ({auditEvents.length})</span>
        </button>

        {user?.role === 'Administrator' && (
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'users'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({users.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'audit' ? (
        <div className="rounded-xl bg-[#121422] border border-[#24283E] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E101B] border-b border-[#24283E] text-gray-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator / Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2238]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">Loading audit trail...</td>
                  </tr>
                ) : auditEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">No audit events recorded yet.</td>
                  </tr>
                ) : (
                  auditEvents.map(evt => (
                    <tr key={evt._id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                        {new Date(evt.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{evt.actorName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{evt.actorRole}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-purple-300 text-[11px]">
                        {evt.action}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-300">{evt.entityType.toUpperCase()}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{evt.entityId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                            evt.outcome === 'success'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {evt.outcome}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-400 text-[10px] max-w-xs truncate">
                        {JSON.stringify(evt.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Users List Tab */
        <div className="rounded-xl bg-[#121422] border border-[#24283E] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E101B] border-b border-[#24283E] text-gray-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2238]">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[10px] text-gray-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-purple-300">{u.role}</td>
                  <td className="py-3 px-4 text-gray-300">{u.department || 'Operations'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
