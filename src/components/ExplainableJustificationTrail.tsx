import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Sparkles,
  GitFork,
  ArrowLeft,
} from 'lucide-react';
import { AutonomousSynthesisResult, AgentId } from '../types';

interface ExplainableJustificationTrailProps {
  synthesis: AutonomousSynthesisResult;
  selectedTicker: string;
  onOpenAiConsult?: () => void;
  onBackToOverview?: () => void;
}

export const ExplainableJustificationTrail: React.FC<ExplainableJustificationTrailProps> = ({
  synthesis,
  selectedTicker,
  onOpenAiConsult,
  onBackToOverview,
}) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const getAgentBadge = (id: AgentId) => {
    switch (id) {
      case 'agent-market':
        return { label: 'Orderflow Alpha', color: 'text-emerald-700', bg: 'bg-emerald-50' };
      case 'agent-sec':
        return { label: 'SEC Disclosures', color: 'text-rose-700', bg: 'bg-rose-50' };
      case 'agent-sentiment':
        return { label: 'Market Sentiment', color: 'text-amber-700', bg: 'bg-amber-50' };
      case 'agent-portfolio':
        return { label: 'Portfolio Risk', color: 'text-blue-700', bg: 'bg-blue-50' };
      case 'agent-orchestrator':
        return { label: 'Arbiter Consensus', color: 'text-purple-700', bg: 'bg-purple-50' };
      default:
        return { label: 'Specialist Agent', color: 'text-slate-700', bg: 'bg-slate-100' };
    }
  };

  const filteredSteps = synthesis.justificationSteps.filter((step) => {
    return selectedAgentFilter === 'ALL' || step.agentId === selectedAgentFilter;
  });

  const exportAuditTrail = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(synthesis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Audit-Trail-${selectedTicker}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 select-none font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <GitFork className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Audit Trail & Justification
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic decision log for {selectedTicker}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditTrail}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
            {onOpenAiConsult && (
              <button
                onClick={onOpenAiConsult}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask Arbiter</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'ALL', label: 'All (5)' },
            { id: 'agent-market', label: 'Orderflow' },
            { id: 'agent-sec', label: 'SEC Filings' },
            { id: 'agent-sentiment', label: 'Sentiment' },
            { id: 'agent-portfolio', label: 'Portfolio' },
            { id: 'agent-orchestrator', label: 'Arbiter' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedAgentFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedAgentFilter === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-3">
        {filteredSteps.map((step) => {
          const isExpanded = expandedSteps.includes(step.stepNumber);
          const badge = getAgentBadge(step.agentId);

          return (
            <div key={step.stepNumber} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">
                    0{step.stepNumber}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${badge.bg} ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-slate-500 font-semibold">{step.confidence}%</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-100 bg-slate-50/50">
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Observation</span>
                    <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {step.observation}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Reasoning</span>
                    <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {step.reasoning}
                    </p>
                  </div>

                  {step.evidence && step.evidence.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Evidence</span>
                      <div className="space-y-1.5">
                        {step.evidence.map((ev, i) => (
                          <div key={i} className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-xs">
                            <span className="text-slate-700">
                              <strong className="text-slate-900">{ev.source}: </strong>
                              {ev.dataPoint}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
