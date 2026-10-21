import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { AiCopilotDrawer } from '../copilot/AiCopilotDrawer.js';
import { Sparkles } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090A10] text-[#F3F4F6] flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header onToggleCopilot={() => setCopilotOpen(prev => !prev)} copilotOpen={copilotOpen} />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Copilot Toggle Button (Sticky on bottom right) */}
      {!copilotOpen && (
        <button
          onClick={() => setCopilotOpen(true)}
          className="fixed bottom-6 right-6 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 transition-all z-30 flex items-center gap-2 border border-purple-400/30"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          <span>Ask FlowTwin Copilot</span>
        </button>
      )}

      {/* Persistent AI Copilot Drawer */}
      <AiCopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};
