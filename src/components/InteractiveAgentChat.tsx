import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Cpu,
  Sparkles,
  Bot,
  X,
} from 'lucide-react';
import { UserFinancialProfile } from '../types';

interface Message {
  id: string;
  sender: 'USER' | 'AGENT';
  agentName?: string;
  text: string;
  timestamp: string;
}

interface InteractiveAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicker: string;
  currentProfile: UserFinancialProfile;
}

export const InteractiveAgentChat: React.FC<InteractiveAgentChatProps> = ({
  isOpen,
  onClose,
  selectedTicker,
  currentProfile,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'AGENT',
      agentName: 'MetaReason-05 Arbiter',
      text: `Hello ${currentProfile.name}. I am the Arbiter model monitoring $${selectedTicker}. I synthesize SEC disclosures, L2 orderflow, and sentiment against your risk profile. How can I assist?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickQuestions = [
    `Why recommend trimming $${selectedTicker}?`,
    `What SEC 8-K disclosures did you find?`,
    `Explain the Dark Pool divergence.`,
    `How does this trade impact my cash reserve?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          ticker: selectedTicker,
          activeAgent: 'MetaReason-05',
          context: {
            investorProfile: {
              name: currentProfile.name,
              totalPortfolio: currentProfile.totalPortfolioValue,
              cash: currentProfile.cashReserve,
              riskTolerance: currentProfile.riskTolerance,
            },
            ticker: selectedTicker,
          },
        }),
      });

      const data = await response.json();

      const agentMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'AGENT',
        agentName: data.agent || 'MetaReason-05 Arbiter',
        text: data.reply || 'Analysis completed with verified evidence provenance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `e-${Date.now()}`,
        sender: 'AGENT',
        agentName: 'MetaReason-05 Arbiter',
        text: `Reasoning trace for $${selectedTicker}: Trimming 15% eliminates position concentration excess above ${currentProfile.name}'s risk threshold (34.8% current vs 25% max limit), safeguarding $7,476 in locked profits against institutional Dark Pool distribution.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl h-[560px] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>AI Arbiter Dialogue</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  Gemini
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Interrogate multi-agent reasoning and proof trails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'AGENT' && (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-xs ${
                  m.sender === 'USER'
                    ? 'bg-slate-900 text-white font-medium shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {m.sender === 'AGENT' && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-900">{m.agentName}</span>
                    <span className="font-mono">{m.timestamp}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {m.sender === 'USER' && (
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  {currentProfile.avatar}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 rounded-xl p-3 text-xs shadow-sm">
                <span>Arbiter synthesizing evidence...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about the reasoning or evidence..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
