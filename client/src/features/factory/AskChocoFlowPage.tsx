import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useChocolateFactoryStore } from './chocolateFactoryStore.js';
import { api } from '../../lib/api.js';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendation?: string;
}

const PRESET_QUESTIONS = [
  'Why is production low today?',
  'Do we have enough cocoa for today’s orders?',
  'Which machine needs attention?',
  'Why are deliveries delayed?',
  'How can we reduce chocolate waste?',
  'What happens if customer orders increase by 20%?',
  'What should I do about a warm storage room?',
];

export const AskChocoFlowPage: React.FC = () => {
  const params = useChocolateFactoryStore(s => s.parameters);
  const results = useChocolateFactoryStore(s => s.results);
  const activeProblem = useChocolateFactoryStore(s => s.activeProblem);
  const stages = useChocolateFactoryStore(s => s.stages);
  const isRunning = useChocolateFactoryStore(s => s.isProductionRunning);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your ChocoFlow Chocolate Factory Assistant. I monitor our live ingredient silos, roasting drums, tempering crystallization, packaging conveyors, and delivery fleet. Ask me any question about factory operations!',
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Grounded Answer Generator: uses current live simulation state
  const generateGroundedAnswer = (query: string): { reply: string; recommendation?: string } => {
    const q = query.toLowerCase();

    if (q.includes('why is production low') || q.includes('production low')) {
      if (!isRunning) {
        return {
          reply: 'Factory production is currently paused by the master control switch. The lines are on standby waiting for operator resume.',
          recommendation: 'Click "Start Factory" or "Resume Production" in the top bar to resume continuous manufacturing.',
        };
      }
      if (params.machineEfficiencyPct < 75) {
        return {
          reply: `Production is restricted because machine efficiency is currently down to ${params.machineEfficiencyPct}%. This lowers our daily output from ${params.productionCapacityBarsPerHour * 8} bars down to approximately ${results.estimatedProductionBars} bars.`,
          recommendation: 'Check the Tempering Unit and Flow Wrapper machines. Clear any belt build-up and recalibrate cooling loops.',
        };
      }
      if (params.cocoaStockKg < 1500) {
        return {
          reply: `Production is bottle-necked by our raw cocoa reserve. We only have ${params.cocoaStockKg} kg of cocoa remaining, which limits the batch sizing.`,
          recommendation: 'Request an emergency cocoa bean transfer in the Warehouse tab or switch recipe allocation to Milk Chocolate.',
        };
      }
      return {
        reply: `Current production is running at ${results.estimatedProductionBars.toLocaleString()} bars/day, fulfilling ${results.ordersCompleted} orders with ${params.machineEfficiencyPct}% efficiency. No critical bottleneck is detected.`,
      };
    }

    if (q.includes('enough cocoa') || q.includes('cocoa stock') || q.includes('cocoa for')) {
      const cocoaNeeded = params.dailyOrders * 0.05;
      const hasEnough = params.cocoaStockKg >= cocoaNeeded;
      return {
        reply: `Today’s customer orders require approximately ${Math.round(cocoaNeeded)} kg of cocoa beans (50g per bar). Our silos currently hold ${params.cocoaStockKg.toLocaleString()} kg of cocoa. ${
          hasEnough
            ? `Yes! We have an ample surplus of ${Math.round(params.cocoaStockKg - cocoaNeeded)} kg.`
            : `Warning: We are facing a deficit of ${Math.round(cocoaNeeded - params.cocoaStockKg)} kg to complete all orders today.`
        }`,
        recommendation: hasEnough
          ? 'Maintain standard roaster feeds.'
          : 'Place an immediate replenishment order in the Warehouse section or adjust daily order allocations.',
      };
    }

    if (q.includes('machine needs attention') || q.includes('which machine') || q.includes('maintenance')) {
      const needsAttentionStage = stages.find(s => s.status === 'Needs Attention');
      if (activeProblem?.id === 'machine_breakdown') {
        return {
          reply: 'The Continuous Multi-Stage Chocolate Temperer (Stage 2) requires immediate attention! Its cooling circuit pump failed, driving temperature up to 34.8°C and risking crystal destabilization.',
          recommendation: 'Engage backup chiller heat exchanger and dispatch maintenance technician with the seal kit.',
        };
      }
      if (needsAttentionStage) {
        return {
          reply: `${needsAttentionStage.name} (${needsAttentionStage.machineName}) is flagged as Needs Attention. Operating parameter: ${JSON.stringify(needsAttentionStage.operatingValues)}.`,
          recommendation: 'Open the 3D Factory or Production Workflow page to inspect the diagnostic readings.',
        };
      }
      return {
        reply: 'All machinery—including Roasters, 5-Roll Conches, Continuous Temperers, and Flow Wrappers—are operating within standard nominal tolerances with 0 active mechanical alarms.',
      };
    }

    if (q.includes('why are deliveries delayed') || q.includes('delivery delayed') || q.includes('trucks delayed')) {
      return {
        reply: `Average truck delay is currently ${params.averageTruckDelayHours} hours. We have ${params.availableTrucks} refrigerated trucks active. ${
          results.expectedDeliveryDelaysHours > 1
            ? 'Delays are exacerbated by regional arterial highway congestion and truck loading queues.'
            : 'Deliveries are proceeding with minimal delay well within customer delivery windows.'
        }`,
        recommendation: 'Assign standby trucks to pending store orders in the Deliveries tab or utilize the southern expressway bypass.',
      };
    }

    if (q.includes('reduce chocolate waste') || q.includes('waste')) {
      return {
        reply: `Our current rejection rate is ${params.qualityRejectionPct}%, creating approximately ${results.estimatedRejectedBars} rejected bars per day. In chocolate manufacturing, clean rejected bars are not wasted—they are sanitary remelted and blended into subsequent batches.`,
        recommendation: 'To lower rejections below 1.5%, maintain tempering Zone 3 working temperature at exactly 31.5°C and ensure foil wrapping tension is calibrated at 14.2 N.',
      };
    }

    if (q.includes('customer orders increase by 20%') || q.includes('20%') || q.includes('orders increase')) {
      const newOrders = Math.round(params.dailyOrders * 1.2);
      const capacityBars = params.productionCapacityBarsPerHour * 8 * (params.machineEfficiencyPct / 100);
      const canHandle = capacityBars >= newOrders;
      return {
        reply: `If orders rise by 20% from ${params.dailyOrders} to ${newOrders.toLocaleString()} bars/day: Our current machine throughput can deliver ${Math.round(capacityBars).toLocaleString()} bars. ${
          canHandle
            ? 'The factory can easily absorb this surge during standard 8-hour shift operations.'
            : `Capacity would fall short by ${Math.round(newOrders - capacityBars)} bars, causing delays unless extra shifts are scheduled.`
        }`,
        recommendation: canHandle
          ? 'Confirm ingredient inventory and pre-stage shipping cartons.'
          : 'Schedule a 2-hour voluntary overtime shift and review Plan C (High Customer Demand) in Compare Factory Plans.',
      };
    }

    if (q.includes('warm storage') || q.includes('warm room') || q.includes('temperature too high') || q.includes('storage room')) {
      return {
        reply: `Cold storage is currently at ${params.coldStorageTempCelsius.toFixed(1)}°C. If temperature exceeds 21°C, cocoa butter crystals melt and migrate to the surface, causing permanent greyish fat bloom and ruined texture.`,
        recommendation: '1. Activate auxiliary HVAC cooling units immediately.\n2. Keep all warehouse dock doors sealed.\n3. Spot-check top carton layers for surface bloom.',
      };
    }

    // Default intelligent response grounded in current metrics
    return {
      reply: `Regarding "${query}": ChocoFlow AI is monitoring ${results.estimatedProductionBars.toLocaleString()} bars produced today across 7 workflow stages with ${results.ordersCompleted} orders completed and ${params.availableTrucks} trucks active. Current storage temperature is ${params.coldStorageTempCelsius}°C with ${params.cocoaStockKg.toLocaleString()}kg cocoa in stock.`,
      recommendation: 'You can test specific operational adjustments using the Factory Parameters sliders or Disruption Simulator.',
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Try server-side AI endpoint first, fallback to grounded local rules
    try {
      const res: any = await api.post('/ai/chat', {
        message: textToSend.trim(),
        context: {
          chocolateFactory: {
            parameters: params,
            results,
            activeProblem,
          },
        },
      });

      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: res.reply,
            timestamp: 'Just now',
          },
        ]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback seamlessly to deterministic rule-based grounded engine
    }

    // Deterministic simulation grounded answer
    setTimeout(() => {
      const grounded = generateGroundedAnswer(textToSend);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: grounded.reply,
          recommendation: grounded.recommendation,
          timestamp: 'Just now',
        },
      ]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Ask ChocoFlow — Factory AI Assistant
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              GROUNDED IN LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            Type any question in plain English. ChocoFlow AI evaluates real-time chocolate factory variables—from cocoa stocks to tempering crystallization—and provides clear, practical explanations.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                sender: 'assistant',
                text: 'Chat history cleared. How can I assist with chocolate production or logistics today?',
                timestamp: 'Just now',
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-white bg-white/5 border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Questions Pills */}
      <div className="p-4 rounded-2xl bg-[#1A0E08] border border-amber-500/20 space-y-2">
        <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pq)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#25140B] text-amber-200 hover:text-white hover:bg-amber-600/30 border border-amber-500/25 transition-all text-left"
            >
              {pq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 rounded-2xl bg-[#160D08] border border-amber-500/25 shadow-xl flex flex-col h-[480px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shrink-0 shadow-md">
                    <div className="w-full h-full bg-[#180E09] rounded-[10px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-amber-500 text-black font-medium font-sans rounded-br-none shadow-md shadow-amber-500/20'
                      : 'bg-[#21140D] text-gray-200 border border-amber-500/20 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.recommendation && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono text-[11px]">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recommended Factory Action</span>
                      </div>
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                        {msg.recommendation}
                      </p>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] font-mono mt-1 ${
                      isUser ? 'text-black/60 text-right' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 p-0.5 shrink-0">
                    <div className="w-full h-full bg-[#1A0E08] rounded-[10px] flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600/30 p-0.5 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div className="p-3 rounded-2xl bg-[#21140D] border border-amber-500/20 text-xs text-amber-300/80 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Evaluating factory telemetry & formulas...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="mt-4 pt-4 border-t border-amber-500/15 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask a question in plain English (e.g. Do we have enough cocoa for today's orders?)"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 bg-black/40 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors font-sans"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition-all disabled:opacity-40 shadow-lg shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
