import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Sliders,
  TrendingDown,
  Clock,
  DollarSign,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Copy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../../lib/api.js';
import { MOCK_SIMULATIONS } from '../../lib/mockApi.js';
import { useNavigate } from 'react-router-dom';

export const DisruptionLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<any[]>(MOCK_SIMULATIONS);
  const [activeScenario, setActiveScenario] = useState<any | null>(MOCK_SIMULATIONS[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Form State for new simulation
  const [scenarioName, setScenarioName] = useState('I-80 Commercial Corridor Severe Winter Closure');
  const [disruptionType, setDisruptionType] = useState<string>('road_closure');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('critical');
  const [durationHours, setDurationHours] = useState<number>(10);
  const [corridor, setCorridor] = useState<string>('I-80');
  const [capacityDrop, setCapacityDrop] = useState<number>(50);

  const fetchScenarios = () => {
    api.get<{ simulations: any[] }>('/simulations')
      .then(res => {
        if (res && Array.isArray(res.simulations) && res.simulations.length > 0) {
          setScenarios(res.simulations);
          setActiveScenario((prev: any) => prev ? (res.simulations.find((s: any) => s._id === prev._id) || res.simulations[0]) : res.simulations[0]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    try {
      const res: any = await api.post('/simulations', {
        name: scenarioName,
        description: `Configured in Disruption Lab: ${disruptionType} on ${corridor || 'regional hub'} for ${durationHours}h (${severity} severity)`,
        disruption: {
          type: disruptionType,
          title: scenarioName,
          routeCorridor: corridor,
          severity,
          durationHours,
          capacityDropPercentage: capacityDrop,
        },
      });

      fetchScenarios();
      setActiveScenario(res.scenario);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Prepare comparison data for charts
  const comparisonData = scenarios.slice(0, 4).map(sc => ({
    name: sc.name.length > 22 ? sc.name.slice(0, 20) + '...' : sc.name,
    delayHours: sc.metrics?.averageDelayHours || 0,
    costUSD: Math.round((sc.metrics?.estimatedExtraCostUSD || 0) / 1000), // in $k
    lateOrders: sc.metrics?.projectedLateDeliveries || 0,
    affected: sc.metrics?.directlyAffectedShipments || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Disruption Simulation Laboratory</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25">
              DETERMINISTIC SIMULATION ENGINE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Introduce hypothetical supply chain shocks, model corridor delays, and generate multi-objective recovery alternatives.
          </p>
        </div>

        {activeScenario && (
          <button
            onClick={() => navigate('/app/recovery')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Recovery Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Grid: Parameters on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Scenario Builder Form */}
        <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Scenario Parameters</h2>
            </div>
            <span className="text-[10px] font-mono text-gray-400">CONFIGURATOR</span>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 font-medium">Scenario Title</label>
              <input
                type="text"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                className="w-full mt-1.5 bg-[#0A0B12] border border-[#24283E] rounded-lg p-2 text-white focus:border-purple-500/50"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium">Disruption Archetype</label>
              <select
                value={disruptionType}
                onChange={e => setDisruptionType(e.target.value)}
                className="w-full mt-1.5 bg-[#0A0B12] border border-[#24283E] rounded-lg p-2 text-white focus:border-purple-500/50"
              >
                <option value="road_closure">Major Road Closure / Interstate Hold</option>
                <option value="vehicle_breakdown">Tractor Mechanical Breakdown</option>
                <option value="warehouse_outage">Hub / Warehouse Capacity Outage</option>
                <option value="severe_weather">Regional Blizzard / Hurricane Advisory</option>
                <option value="port_delay">Maritime Port Gate Congestion</option>
                <option value="carrier_capacity_reduction">Carrier Strike / Capacity Drop</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 font-medium">Corridor / Hub</label>
                <select
                  value={corridor}
                  onChange={e => setCorridor(e.target.value)}
                  className="w-full mt-1.5 bg-[#0A0B12] border border-[#24283E] rounded-lg p-2 text-white focus:border-purple-500/50"
                >
                  <option value="I-80">I-80 Midwest-Northeast</option>
                  <option value="I-10">I-10 Southwest Transcon</option>
                  <option value="I-90">I-90 Pacific Northwest</option>
                  <option value="I-75">I-75 Southeast Freight</option>
                  <option value="FAC-CHI-01">Chicago Central Park</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium">Severity Level</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as any)}
                  className="w-full mt-1.5 bg-[#0A0B12] border border-[#24283E] rounded-lg p-2 text-white focus:border-purple-500/50"
                >
                  <option value="low">Low Impact</option>
                  <option value="medium">Medium Variance</option>
                  <option value="high">High Severity</option>
                  <option value="critical">Critical Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-gray-300">
                <label className="font-medium">Disruption Duration (Hours)</label>
                <span className="font-mono text-purple-400 font-bold">{durationHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="48"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
                className="w-full mt-2 accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                <span>1h</span>
                <span>12h</span>
                <span>24h</span>
                <span>48h</span>
              </div>
            </div>

            {disruptionType === 'warehouse_outage' && (
              <div>
                <div className="flex items-center justify-between text-gray-300">
                  <label className="font-medium">Capacity Drop Percentage</label>
                  <span className="font-mono text-amber-400 font-bold">{capacityDrop}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={capacityDrop}
                  onChange={e => setCapacityDrop(Number(e.target.value))}
                  className="w-full mt-2 accent-amber-500 cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Running Mathematical Engine...' : 'Run Deterministic Simulation'}</span>
            </button>
          </form>

          {/* Saved Scenarios List */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Simulation Scenarios ({scenarios.length})
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {scenarios.map(sc => (
                <button
                  key={sc._id}
                  onClick={() => setActiveScenario(sc)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    activeScenario?._id === sc._id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2 font-medium">{sc.name}</span>
                  <span className="text-[10px] font-mono text-gray-500 shrink-0">
                    +{sc.metrics?.averageDelayHours}h
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Impact Metrics & Scenario Comparison */}
        <div className="lg:col-span-2 space-y-6">
          {activeScenario ? (
            <>
              {/* Scenario Impact Scorecards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#121422] border border-rose-500/30">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Average Delay</span>
                    <Clock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
                    +{activeScenario.metrics?.averageDelayHours}h
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Max: +{activeScenario.metrics?.maxDelayHours}h</div>
                </div>

                <div className="p-4 rounded-xl bg-[#121422] border border-amber-500/30">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Affected Orders</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                    {activeScenario.metrics?.directlyAffectedShipments}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {activeScenario.metrics?.projectedLateDeliveries} projected late deliveries
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#121422] border border-purple-500/30">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Extra Cost (USD)</span>
                    <DollarSign className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
                    ${(activeScenario.metrics?.estimatedExtraCostUSD || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Detours + Driver Demurrage</div>
                </div>

                <div className="p-4 rounded-xl bg-[#121422] border border-emerald-500/30">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Recovery Feasibility</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                    {activeScenario.metrics?.recoveryFeasibilityScore} / 100
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Candidate plans available</div>
                </div>
              </div>

              {/* Multi-Scenario Comparison Bar Chart */}
              <div className="p-5 rounded-xl bg-[#121422] border border-[#24283E]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Scenario Delay & Cost Impact Comparison</h2>
                    <p className="text-[11px] text-gray-400">Comparing active scenarios across delays (hours) and extra costs ($k)</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2238" vertical={false} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
                      <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#10121C', borderColor: '#24283E', borderRadius: '8px', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="delayHours" name="Avg Delay (Hours)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="costUSD" name="Estimated Cost ($k USD)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lateOrders" name="Late Deliveries" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Underlying Mathematical Assumptions Panel */}
              <div className="p-4 rounded-xl bg-[#0E101B] border border-[#24283E] space-y-2 text-xs">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-mono">
                  Grounding Assumptions & Formula Limits
                </div>
                <ul className="space-y-1 text-gray-300 list-disc list-inside text-[11px]">
                  {activeScenario.assumptions?.map((ass: string, i: number) => (
                    <li key={i}>{ass}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-[#121422] rounded-xl border border-[#24283E]">
              Select or run a simulation scenario to view impact metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
