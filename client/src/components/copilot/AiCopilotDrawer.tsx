import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCw,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/authContext.js';
import { useNavigate } from 'react-router-dom';
import { AgentExecutionStep } from '../../shared/types.js';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedShipmentIds?: string[];
  suggestedAction?: any;
}

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chat' | 'telemetry'>('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [telemetrySteps, setTelemetrySteps] = useState<AgentExecutionStep[]>([]);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: `Hello ${user?.name || 'Operator'}, I am your **FlowTwin AI Logistics Copilot**.\n\nI monitor telemetry across all active North American corridors, warehouse capacities, and disruption scenarios. How can I assist you with operational intelligence today?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Which shipments are currently delayed?',
    'Why is shipment SH-1042 at risk?',
    'What is the impact of a 10-hour road closure on I-80?',
    'Which warehouse has the highest utilization?',
    'Explain active recovery plan recommendation',
  ];

  // Fetch agent telemetry
  const fetchTelemetry = async () => {
    try {
      const res = await api.get<{ telemetry: AgentExecutionStep[] }>('/ai/telemetry');
      setTelemetrySteps(res.telemetry || []);
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetry();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res: any = await api.post('/ai/chat', {
        message: text,
        context: {
          currentPage: window.location.pathname,
        },
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: res.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedShipmentIds: res.suggestedShipmentIds,
        suggestedAction: res.suggestedAction,
      };

      setMessages(prev => [...prev, assistantMsg]);
      fetchTelemetry();
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          content: `Unable to complete AI inquiry: ${err.message}. Deterministic fallback active.`,
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const runAutonomousWorkflow = async () => {
    setIsRunningWorkflow(true);
    try {
      await api.post('/ai/run-autonomous-recovery');
      await fetchTelemetry();
      setActiveTab('telemetry');
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningWorkflow(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-[#0E101B] border-l border-[#24283E] shadow-2xl z-40 flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#24283E] flex items-center justify-between bg-[#121422]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">FlowTwin Copilot</h2>
            <p className="text-[10px] text-gray-400 font-mono">MULTI-AGENT INTELLIGENCE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#24283E] bg-[#0A0B12]">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Operational Chat</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('telemetry');
            fetchTelemetry();
          }}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'telemetry'
              ? 'border-purple-500 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Agent Telemetry</span>
          {telemetrySteps.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' ? (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-[#161928] border border-[#24283E] text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Clickable suggested shipment buttons */}
                  {msg.suggestedShipmentIds && msg.suggestedShipmentIds.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-gray-400 w-full font-medium">Referenced Consignments:</span>
                      {msg.suggestedShipmentIds.map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            onClose();
                            navigate(`/app/shipments?search=${id}`);
                          }}
                          className="px-2 py-1 rounded bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 font-mono text-[11px] font-semibold transition-colors"
                        >
                          {id} ↗
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action card */}
                  {msg.suggestedAction && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-emerald-300">{msg.suggestedAction.title}</div>
                        <div className="text-[10px] text-gray-400">{msg.suggestedAction.description}</div>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          if (msg.suggestedAction.actionType === 'approve_plan') {
                            navigate('/app/recovery');
                          } else {
                            navigate(`/app/shipments?search=${msg.suggestedAction.payload.shipmentId}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-500 text-black font-semibold text-[10px] hover:bg-emerald-400 transition-colors shrink-0 ml-2"
                      >
                        Execute
                      </button>
                    </div>
                  )}

                  <div className="mt-1 text-[9px] text-gray-400 text-right">{msg.timestamp}</div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-purple-300">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-spin">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-mono text-[11px]">Evaluating supply chain telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          /* Multi-Agent Orchestrator Telemetry Tab */
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-purple-300">Multi-Agent Orchestration</h4>
                <p className="text-[10px] text-gray-400">Autonomous workflow & tool validation trace</p>
              </div>
              <button
                onClick={runAutonomousWorkflow}
                disabled={isRunningWorkflow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
              >
                <Play className={`w-3 h-3 ${isRunningWorkflow ? 'animate-spin' : ''}`} />
                <span>Run Pipeline</span>
              </button>
            </div>

            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
              Live Agent Execution Steps:
            </div>

            {telemetrySteps.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">
                No recent agent runs. Click &quot;Run Pipeline&quot; to execute autonomous recovery workflow.
              </div>
            ) : (
              telemetrySteps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#141624] border border-[#24283E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-white">{step.agentName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400">{step.durationMs}ms</span>
                  </div>
                  <div className="text-[11px] text-gray-300">{step.inputSummary}</div>
                  <div className="text-[10px] text-emerald-400 font-mono bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10">
                    {step.outputSummary}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts (Only on chat tab) */}
      {activeTab === 'chat' && (
        <div className="p-3 border-t border-[#24283E] bg-[#0A0B12]/80 space-y-1.5">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suggested Inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-white/[0.06] hover:border-purple-500/30 text-left transition-colors truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      {activeTab === 'chat' && (
        <div className="p-3 border-t border-[#24283E] bg-[#121422]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask FlowTwin Copilot..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#0A0B12] border border-[#24283E] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
