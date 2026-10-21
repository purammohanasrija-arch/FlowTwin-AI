import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  AlertOctagon,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Filter,
  Download,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { api } from '../../lib/api.js';
import { MOCK_SUMMARY, MOCK_KPIS } from '../../lib/mockApi.js';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  in_transit: '#8B5CF6',
  delayed: '#EF4444',
  exception: '#F59E0B',
  ready_for_dispatch: '#06B6D4',
  delivered: '#10B981',
};

export const ControlTowerPage: React.FC = () => {
  const [data, setData] = useState<any>(MOCK_SUMMARY);
  const [analytics, setAnalytics] = useState<any>(MOCK_KPIS);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<any>('/dashboard/summary'),
      api.get<any>('/analytics/kpis'),
    ])
      .then(([summaryRes, analyticsRes]) => {
        setData(summaryRes || MOCK_SUMMARY);
        setAnalytics(analyticsRes || MOCK_KPIS);
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setData(MOCK_SUMMARY);
        setAnalytics(MOCK_KPIS);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-mono tracking-wider">INITIALIZING CONTROL TOWER TELEMETRY...</p>
        </div>
      </div>
    );
  }

  const dashboardData = data || MOCK_SUMMARY;
  const { kpis, statusDistribution, carrierPerformance, aiBriefing } = dashboardData;

  const kpiCards = [
    {
      label: 'Total Active Shipments',
      value: kpis.totalShipments,
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      filter: 'all',
      delta: '+12% vs last week',
    },
    {
      label: 'In-Transit Consignments',
      value: kpis.inTransit,
      icon: Truck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      filter: 'in_transit',
      delta: 'Active on 5 corridors',
    },
    {
      label: 'On-Time Delivery Index',
      value: `${kpis.onTimePct}%`,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      delta: '+2.4% SLA retention',
    },
    {
      label: 'Delayed Shipments',
      value: kpis.delayed,
      icon: Clock,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      filter: 'delayed',
      delta: 'Avg delay: +8.4h',
    },
    {
      label: 'Critical Exceptions',
      value: kpis.exceptions,
      icon: AlertOctagon,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      filter: 'exception',
      delta: 'Youngstown mechanical breakdown',
    },
    {
      label: 'Orders at Risk (Score > 60)',
      value: kpis.ordersAtRisk,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      delta: 'Cold-chain & tight SLAs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">Live Logistics Control Tower</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time supply chain telematics, network state estimation, and automated risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/app/simulations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Disruption Lab</span>
          </button>
          <button
            onClick={() => navigate('/app/map')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181B2B] hover:bg-[#20243A] text-gray-200 border border-[#24283E] transition-colors"
          >
            <span>Inspect Map View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Operational Briefing Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[#141624] to-[#121422] border border-purple-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-mono">
                AI Logistics Operations Briefing
              </h2>
              <span className="text-[10px] text-gray-400 font-mono">UPDATED SECONDS AGO</span>
            </div>
            <p className="text-xs text-gray-200 mt-1 leading-relaxed">{aiBriefing}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (kpi.filter) {
                navigate(kpi.filter === 'all' ? '/app/shipments' : `/app/shipments?status=${kpi.filter}`);
              }
            }}
            className={`p-4 rounded-xl bg-[#121422] border ${kpi.borderColor} hover:border-purple-500/40 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400">{kpi.label}</span>
              <div className={`w-7 h-7 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white tracking-tight">{kpi.value}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 font-mono truncate">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Shipment Volume Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Daily Consignment Flow & On-Time Velocity</h2>
              <p className="text-[11px] text-gray-400">Total volume vs. delayed consignments across 7-day rolling window</p>
            </div>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              7-Day Trend
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyVolume || []}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="delayedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2238" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="volume" name="Total Volume" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#volumeGrad)" />
                <Area type="monotone" dataKey="delayed" name="Delayed Orders" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#delayedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Active Status Distribution</h2>
            <p className="text-[11px] text-gray-400">Proportion of monitored shipments by operational state</p>
          </div>
          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {statusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6B7280'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusDistribution.map((item: any) => (
              <div key={item.status} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] || '#6B7280' }} />
                <span className="text-gray-300 capitalize text-[11px]">{item.status.replace('_', ' ')}:</span>
                <span className="font-semibold text-white font-mono text-[11px]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carrier Performance & Hub Throughput Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Carrier Performance Bar Chart */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Carrier On-Time Performance Index</h2>
              <p className="text-[11px] text-gray-400">SLA compliance rate by assigned freight hauler</p>
            </div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carrierPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2238" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" fontSize={11} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="carrier" type="category" stroke="#6B7280" fontSize={11} width={130} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'On-Time SLA']}
                  contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="onTimePct" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Throughput / Capacity */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Facility Capacity & Throughput</h2>
              <p className="text-[11px] text-gray-400">Yard utilization percentages across primary distribution hubs</p>
            </div>
            <span className="text-[10px] font-mono text-gray-400">6 Hubs Tracked</span>
          </div>
          <div className="space-y-3">
            {analytics?.facilityThroughput?.map((fac: any) => (
              <div key={fac.name} className="p-2.5 rounded-lg bg-[#161928] border border-white/[0.04]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{fac.fullName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({fac.name})</span>
                  </div>
                  <span className={`font-mono font-bold text-xs ${fac.utilization > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {fac.utilization}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fac.utilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fac.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
