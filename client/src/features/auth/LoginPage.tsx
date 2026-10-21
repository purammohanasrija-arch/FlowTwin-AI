import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('manager@flowtwin.ai');
  const [password, setPassword] = useState('DemoPass123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: string, demoEmail: string) => {
    switchRole(role as any);
    login(demoEmail, 'DemoPass123!')
      .then(() => navigate('/app/dashboard'))
      .catch(() => navigate('/app/dashboard')); // graceful fallback
  };

  return (
    <div className="min-h-screen bg-[#090A10] flex items-center justify-center p-6 selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-400 p-0.5 shadow-xl shadow-purple-500/20 mb-2">
            <div className="w-full h-full bg-[#0E101B] rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FlowTwin AI Portal</h1>
          <p className="text-xs text-gray-400">Autonomous Supply Chain Intelligence & Command Center</p>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-2xl bg-[#121422] border border-[#24283E] shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 font-medium">Enterprise Email</label>
              <div className="relative mt-1.5">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0A0B12] border border-[#24283E] rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-medium">Password</label>
              <div className="relative mt-1.5">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0A0B12] border border-[#24283E] rounded-lg pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Control Tower'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Role Login Shortcuts */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">
              Or Fast-Login via Synthetic Role:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Logistics Manager', 'manager@flowtwin.ai')}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/[0.06] text-left transition-colors"
              >
                <div className="font-semibold">Logistics Manager</div>
                <div className="text-[10px] text-gray-500">Signoff & Dispatch</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Administrator', 'admin@flowtwin.ai')}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/[0.06] text-left transition-colors"
              >
                <div className="font-semibold">Administrator</div>
                <div className="text-[10px] text-gray-500">Security & Users</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Operations Analyst', 'analyst@flowtwin.ai')}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/[0.06] text-left transition-colors"
              >
                <div className="font-semibold">Operations Analyst</div>
                <div className="text-[10px] text-gray-500">Simulations & Lab</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Viewer', 'viewer@flowtwin.ai')}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/[0.06] text-left transition-colors"
              >
                <div className="font-semibold">Viewer</div>
                <div className="text-[10px] text-gray-500">Read-Only KPI View</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
