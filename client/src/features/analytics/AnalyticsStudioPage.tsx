import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Clock,
  Truck,
  Shield,
  Layers,
  FileText,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../../lib/api.js';
import { MOCK_KPIS, MOCK_SUMMARY } from '../../lib/mockApi.js';

export const AnalyticsStudioPage: React.FC = () => {
  const [data, setData] = useState<any>(MOCK_KPIS);
  const [dashboardData, setDashboardData] = useState<any>(MOCK_SUMMARY);
  const [timeRange, setTimeRange] = useState('7d');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<any>('/analytics/kpis'),
      api.get<any>('/dashboard/summary'),
    ])
      .then(([analyticsRes, summaryRes]) => {
        if (analyticsRes) setData(analyticsRes);
        if (summaryRes) setDashboardData(summaryRes);
      })
      .catch(err => console.error(err));
  }, [timeRange]);

  const exportReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Analytics Studio & Executive Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Fleet velocity indices, carrier SLA benchmark scorecards, and corridor disruption history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="bg-[#121422] border border-[#24283E] rounded-lg px-3 py-1.5 text-xs text-white"
          >
            <option value="7d">Last 7 Days Rolling</option>
            <option value="30d">Last 30 Days (Monthly SLA)</option>
            <option value="90d">Q4 Operating Review</option>
          </select>

          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Top Velocity Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Average Transit Time</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">18.5 Hours</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">-1.2h vs DOT baseline</div>
        </div>
        <div className="p-4 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="text-[10px] text-gray-400 font-mono uppercase">On-Time SLA Percentage</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {dashboardData?.kpis?.onTimePct || '91.2'}%
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Contractual target: 90.0%</div>
        </div>
        <div className="p-4 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Estimated Detour Miles</div>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">4,280 km</div>
          <div className="text-[10px] text-gray-400 mt-0.5">I-80 & Midwest Weather Detours</div>
        </div>
        <div className="p-4 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Cost of Operational Delays</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">$18,450 USD</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Demurrage & Penalty Reserves</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Volume Area */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E]">
          <h2 className="text-sm font-semibold text-white mb-1">Consignment Volume Trends</h2>
          <p className="text-[11px] text-gray-400 mb-4">Total shipments versus delays over rolling period</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dailyVolume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2238" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', fontSize: '11px' }} />
                <Area type="monotone" dataKey="volume" name="Total Dispatched" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="delayed" name="Delayed Consignments" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Distribution Histogram */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E]">
          <h2 className="text-sm font-semibold text-white mb-1">Transit Delay Variance Distribution</h2>
          <p className="text-[11px] text-gray-400 mb-4">Categorized histogram of delay magnitudes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.delayDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2238" vertical={false} />
                <XAxis dataKey="range" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', fontSize: '11px' }} />
                <Bar dataKey="count" name="Shipment Count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Printable Executive Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0E101B] border border-[#24283E] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  FlowTwin AI Executive Logistics Brief
                </h2>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300 font-mono">
              <div className="p-3 rounded bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div>DATE: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
                <div>CLASSIFICATION: RESTRICTED OPERATIONAL INTELLIGENCE</div>
                <div>AUDIT ENGINE: FLOWTWIN MULTI-AGENT VERIFIED</div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white uppercase tracking-wider">1. Network Health Summary</h3>
                <p className="text-gray-400 leading-relaxed">
                  Currently supervising 34 active enterprise consignments across US Interstate corridors (I-80, I-10, I-90, I-75). The aggregate on-time delivery metric stands at {dashboardData?.kpis?.onTimePct || '91.2'}%, satisfying the corporate minimum threshold of 90%.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white uppercase tracking-wider">2. Disruption Corridor Exposure</h3>
                <p className="text-gray-400 leading-relaxed">
                  Active severe weather holds along the I-80 corridor have generated +10.0 hours transit throttle on 8 consignments. Mitigating recovery routes via I-70 south loops have reduced projected late deliveries by 72% under Recovery Plan Gamma.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white uppercase tracking-wider">3. Regulatory & HOS Compliance</h3>
                <p className="text-gray-400 leading-relaxed">
                  Validation Agent confirmed 100% compliance across FMCSA driver rest mandates and 80,000 lbs gross weight ratings across all assigned alternate carriers.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] text-gray-300 text-xs hover:text-white"
              >
                Close
              </button>
              <button
                onClick={exportReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
