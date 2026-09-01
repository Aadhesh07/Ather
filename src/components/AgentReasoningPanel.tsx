import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Scale,
  ShieldCheck,
  FileText,
  Activity,
  Users,
  Database,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
  Play,
  ArrowRight,
  BookOpen,
  Timer,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  AutonomousSynthesisResult,
  UserFinancialProfile,
  RiskProfile,
  AgentLogsCollection,
} from '../types';
import { getRecommendationBadge, formatCurrency } from '../utils/formatters';

interface AgentReasoningPanelProps {
  synthesis: AutonomousSynthesisResult;
  userProfile: UserFinancialProfile;
  activeRiskProfile: RiskProfile;
  onChangeRiskProfile: (risk: RiskProfile) => void;
  onOpenExecutionModal: () => void;
  onViewJustification: () => void;
  onOpenAiConsult: () => void;
  onOpenCitation: (citationId: string) => void;
  onNavigateTab?: (tab: string) => void;
  agentLogs: AgentLogsCollection;
  isSimulating: boolean;
  simulationStep: number;
  onTriggerSimulation: () => void;
  isLoggedIn?: boolean;
  onOpenLoginModal?: () => void;
}

export const AgentReasoningPanel: React.FC<AgentReasoningPanelProps> = ({
  synthesis,
  userProfile,
  activeRiskProfile,
  onChangeRiskProfile,
  onOpenExecutionModal,
  onViewJustification,
  onOpenAiConsult,
  onOpenCitation,
  onNavigateTab,
  agentLogs,
  isSimulating,
  simulationStep,
  onTriggerSimulation,
  isLoggedIn = true,
  onOpenLoginModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'consensus' | 'technical' | 'fundamental' | 'sentiment'
  >('consensus');
  const [showConflicts, setShowConflicts] = useState(false);

  const isConservative = activeRiskProfile === 'CONSERVATIVE';
  const isAggressive = activeRiskProfile === 'AGGRESSIVE';

  const dynamicConfidence = isConservative
    ? Math.max(synthesis.overallConfidence - 14, 76)
    : isAggressive
    ? Math.min(synthesis.overallConfidence + 4, 96)
    : synthesis.overallConfidence;

  const dynamicVerdict = isConservative
    ? 'TRIM_POSITION'
    : isAggressive
    ? 'HOLD_ACCUMULATE'
    : synthesis.recommendation;

  const badge = getRecommendationBadge(dynamicVerdict);
  const holding = userProfile.holdings.find((h) => h.ticker === synthesis.ticker);
  const isINR = synthesis.ticker.endsWith('.NS') || synthesis.ticker.endsWith('.BO');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm space-y-0">
      {/* Top Bar with Agent Tabs & Actions */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 p-4 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Scale className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <span>Reasoning Logs & Signals</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                {synthesis.ticker} Multi-Agent Swarm
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('plain-english')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                title="Explain all terms in plain English"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Plain English</span>
              </button>
            )}

            <button
              onClick={onTriggerSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer self-start sm:self-auto ${
                isSimulating
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
              }`}
            >
              {isSimulating ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Swarm Step {simulationStep || 1}/4...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-slate-700 fill-slate-700" />
                  <span>Simulate Run</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Interactive Sub-Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveSubTab('consensus')}
            className={`px-3 py-2 border-b-2 font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              activeSubTab === 'consensus'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Consensus & Verdict
          </button>

          <button
            onClick={() => setActiveSubTab('technical')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              activeSubTab === 'technical'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Technical</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
              {agentLogs.technical.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('fundamental')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              activeSubTab === 'fundamental'
                ? 'border-purple-600 text-purple-800 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-600" />
            <span>SEBI & SEC RAG</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
              {agentLogs.fundamental.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sentiment')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer transition-colors whitespace-nowrap ${
              activeSubTab === 'sentiment'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Sentiment</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
              {agentLogs.sentiment.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {activeSubTab === 'consensus' && (
          <div className="space-y-4">
            {/* Real-Time Performance & Telemetry Tracker */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Pipeline Latency</span>
                <span className="font-bold font-mono text-slate-900">14 ms</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Risk Exposure</span>
                <span className="font-bold font-mono text-slate-900">{holding?.portfolioWeight || 34.8}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Model Accuracy</span>
                <span className="font-bold font-mono text-emerald-600">94.7%</span>
              </div>
            </div>

            {/* Risk Toggle */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Risk Profile Shield:
                </span>
              </div>

              <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 text-xs shadow-inner">
                {(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => onChangeRiskProfile(r)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      activeRiskProfile === r
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Verdict Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    dynamicVerdict.includes('TRIM')
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {badge.label}
                </span>
                <span className="text-xs text-slate-500">
                  Urgency: <strong className="text-slate-800">{synthesis.suggestedAction.urgency}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confidence: <strong>{dynamicConfidence}%</strong></span>
              </div>
            </div>

            {/* Parallel 3-Feed Status Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Technical Momentum</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  RSI: 64.2 • MACD Crossover (+0.65)
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>SEBI RAG Excerpt</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Reg 33 Demerger Note (0.95 Cosine)
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>FinBERT Sentiment</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  +0.64 Bullish (76% Positive)
                </div>
              </div>
            </div>

            {/* Citations Excerpt */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onOpenCitation(isINR ? 'sebi-tatamotors-q3' : 'sebi-q3-chunk-4')}
                className="flex items-center gap-1 text-xs bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-purple-600" />
                <span>{isINR ? 'SEBI Reg 33 Demerger Filing' : 'SEBI Note 14.2 Excerpt'}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </button>
              <button
                onClick={() => onOpenCitation('sec-8k-item7')}
                className="flex items-center gap-1 text-xs bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-slate-500" />
                <span>SEC 8-K Disclosure</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Technical Sub-tab */}
        {activeSubTab === 'technical' && (
          <div className="space-y-2 text-xs">
            {agentLogs.technical.map((log) => (
              <div key={log.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{log.text}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                {log.detail && <p className="text-slate-600 text-xs pl-3">{log.detail}</p>}
                {log.codeSnippet && (
                  <pre className="bg-slate-900 text-emerald-400 text-[10px] p-2 rounded-lg font-mono overflow-x-auto">
                    {log.codeSnippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Fundamental Sub-tab */}
        {activeSubTab === 'fundamental' && (
          <div className="space-y-2 text-xs">
            {agentLogs.fundamental.map((log) => (
              <div key={log.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{log.text}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                {log.detail && <p className="text-slate-600 text-xs pl-3">{log.detail}</p>}
                {log.citationId && (
                  <button
                    onClick={() => onOpenCitation(log.citationId!)}
                    className="text-purple-700 hover:text-purple-900 text-[11px] font-semibold underline pl-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Verified SEBI Citation Chunk</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sentiment Sub-tab */}
        {activeSubTab === 'sentiment' && (
          <div className="space-y-2 text-xs">
            {agentLogs.sentiment.map((log) => (
              <div key={log.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{log.text}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                {log.detail && <p className="text-slate-600 text-xs pl-3">{log.detail}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

