import React, { useState } from 'react';
import {
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';

interface GoogleMapsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
}

export const GoogleMapsSetupModal: React.FC<GoogleMapsSetupModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_GOOGLE_MAPS_API_KEY=${inputKey || 'YOUR_GOOGLE_MAPS_API_KEY'}\nVITE_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090D1E] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,245,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2642] bg-[#0C1228]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Google Maps Platform Configuration
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  FlowTwin AI Map Core
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Official Google Maps JavaScript API with <code className="text-cyan-300 font-mono">@vis.gl/react-google-maps</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-gray-300 max-h-[75vh] overflow-y-auto">
          {/* Quick Option 1: Free Maps Demo Key (Zero Cost Prototyping) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-purple-950/40 border border-purple-500/40">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Quickest Path: Instant Maps Demo Key (Zero-Cost Prototyping)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">
                No Billing Required
              </span>
            </div>
            <p className="text-gray-300 mb-3 text-[11px] leading-relaxed">
              Google Maps Platform provides a public <strong>Maps Demo Key</strong> for prototyping and demos. No billing card is needed. It activates Maps JavaScript API, Places API, Routes API, and Geocoding API immediately.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-400 mb-3 text-[11px]">
              <li>
                Open the official{' '}
                <a
                  href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  Google Maps Demo Key Page
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Sign in with any standard Google account and accept the Demo Project Terms.</li>
              <li>Click to generate your key, copy it, and paste it in the field below.</li>
            </ol>
          </div>

          {/* Key Input Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-xs font-bold text-gray-200">
              Active Google Maps API Key
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  placeholder="AIzaSy... (Paste your Google Maps API key here)"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#070A18] border border-[#242E50] text-cyan-200 font-mono text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Save & Apply</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Keys saved here are stored in your local browser storage (<code className="text-gray-400">localStorage</code>) to enable immediate live exploration without restarting Vite.
            </p>
          </form>

          {/* Option 2: Environment File (.env) Configuration */}
          <div className="p-4 rounded-xl bg-[#060914] border border-[#1E2642] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-gray-400" />
                Persistent Configuration via <code className="text-cyan-400 font-mono">.env</code>
              </span>
              <button
                type="button"
                onClick={copyEnvSnippet}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy .env snippet'}</span>
              </button>
            </div>
            <p className="text-gray-400 text-[11px]">
              Add this to <code className="text-gray-200">client/.env</code> or root <code className="text-gray-200">.env</code> so Vite loads it automatically:
            </p>
            <pre className="p-3 rounded-lg bg-black/60 border border-[#1A223A] font-mono text-[11px] text-cyan-300 overflow-x-auto select-all">
{`VITE_GOOGLE_MAPS_API_KEY=${inputKey || 'YOUR_GOOGLE_MAPS_API_KEY'}
VITE_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID`}
            </pre>
          </div>

          {/* Production Checklist & Security Guidelines */}
          <div className="p-4 rounded-xl bg-[#060914] border border-[#1E2642] space-y-2">
            <h3 className="font-bold text-gray-300 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Production Google Cloud Checklist
            </h3>
            <ul className="space-y-1.5 text-gray-400 text-[11px] list-disc list-inside">
              <li>
                <strong>Enable Required APIs</strong> in{' '}
                <a
                  href="https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline"
                >
                  Google Cloud Console
                </a>
                : Maps JavaScript API, Routes API, Places API (New), Geocoding API.
              </li>
              <li>
                <strong>API Key Restrictions:</strong> Restrict your browser key by HTTP referrer (e.g.{' '}
                <code className="text-gray-300">http://localhost:3000/*</code> for development, and your domain for production).
              </li>
              <li>
                <strong>Cost Management:</strong> Usage may incur billing against your Google Cloud account once moved beyond free quotas. Set budget alerts in GCP Billing.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1E2642] bg-[#0C1228]/80 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            Attribution: <code className="text-gray-400">gmp_git_agentskills_v1</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
