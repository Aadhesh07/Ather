import React from 'react';
import {
  Activity,
  FileText,
  Users,
  ShieldAlert,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AgentStatus, AgentId } from '../types';

interface AgentSwarmVisualizerProps {
  agents: AgentStatus[];
  selectedAgentId: AgentId | null;
  onSelectAgent: (id: AgentId) => void;
  selectedTicker: string;
  onNavigateTab?: (tab: string) => void;
}

export const AgentSwarmVisualizer: React.FC<AgentSwarmVisualizerProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  selectedTicker,
  onNavigateTab,
}) => {
  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'agent-market':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'agent-sec':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'agent-sentiment':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'agent-portfolio':
        return <ShieldAlert className="w-4 h-4 text-blue-600" />;
      case 'agent-orchestrator':
        return <Cpu className="w-4 h-4 text-amber-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-700" />;
    }
  };

  const getAgentTabTarget = (id: AgentId): string => {
    switch (id) {
      case 'agent-market':
        return 'overview';
      case 'agent-sec':
        return 'sec';
      case 'agent-sentiment':
        return 'behavioral';
      case 'agent-portfolio':
        return 'portfolio';
      case 'agent-orchestrator':
        return 'justification';
      default:
        return 'overview';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 font-sans select-none relative overflow-hidden">
      {/* Ambient background flowing light shimmer */}
      <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 bg-gradient-to-br from-emerald-100/30 via-slate-100/20 to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 bg-gradient-to-tr from-amber-100/30 via-slate-100/20 to-transparent rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Multi-Agent Swarm</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold">
                ${selectedTicker}
              </span>
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Neural Pipeline Active</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            4 Specialist micro-agents streaming continuous probabilistic signals into Arbiter
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-slate-700 font-semibold">18ms Latency</span>
          </div>
          <span className="font-semibold text-slate-700 hidden sm:inline">Swarm Synchronized</span>
        </div>
      </div>

      {/* Flowing Agent Grid with Motion Card Interactivity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {agents.slice(0, 4).map((agent, index) => {
          const isSelected = selectedAgentId === agent.id;
          const tabTarget = getAgentTabTarget(agent.id);

          return (
            <motion.div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-50 to-white border-slate-400 shadow-md ring-1 ring-slate-900/10'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Top Accent Flow Line on Active Card */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-slate-800 to-amber-500" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center relative">
                      {getAgentIcon(agent.id)}
                      {/* Flowing micro radar pulse */}
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-60" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{agent.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{agent.codename}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      agent.signalDirection === 'BULLISH'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : agent.signalDirection === 'BEARISH'
                        ? 'text-rose-700 bg-rose-50 border-rose-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {agent.signalDirection}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2.5 line-clamp-2 leading-relaxed">
                  {agent.role}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[10px] font-mono text-slate-500">
                  Conf: <strong className="text-slate-900">{agent.confidenceScore}%</strong>
                </div>

                {onNavigateTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(tabTarget);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
