import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AutonomousSynthesisResult, UserFinancialProfile } from '../types';
import { getRecommendationBadge, formatCurrency } from '../utils/formatters';

interface AgentConsensusCardProps {
  synthesis: AutonomousSynthesisResult;
  userProfile: UserFinancialProfile;
  onOpenExecutionModal: () => void;
  onViewJustification: () => void;
  onOpenAiConsult: () => void;
  onNavigateTab?: (tab: string) => void;
  isLoggedIn?: boolean;
  onOpenLoginModal?: () => void;
}

export const AgentConsensusCard: React.FC<AgentConsensusCardProps> = ({
  synthesis,
  userProfile,
  onOpenExecutionModal,
  onViewJustification,
  onOpenAiConsult,
  onNavigateTab,
  isLoggedIn = true,
  onOpenLoginModal,
}) => {
  const [showConflicts, setShowConflicts] = useState(false);
  const badge = getRecommendationBadge(synthesis.recommendation);
  const holding = userProfile.holdings.find((h) => h.ticker === synthesis.ticker);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Banner: Verdict & Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Multi-Agent Verdict • {synthesis.ticker}
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                  synthesis.recommendation.includes('TRIM')
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : synthesis.recommendation.includes('BUY')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {badge.label}
              </span>
              <span className="text-xs text-slate-500">
                Urgency: <strong className="text-slate-800">{synthesis.suggestedAction.urgency}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Swarm Confidence Badge */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block font-medium">Confidence</span>
            <span className="text-sm font-bold font-mono text-slate-900">{synthesis.overallConfidence}%</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Synthesis Executive Summary */}
      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
        <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Executive Summary</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {synthesis.executiveSummary}
        </p>
      </div>

      {/* 4 Agent Signals Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] text-slate-500 font-medium">Orderflow Alpha</div>
          <div className="text-xs font-bold text-emerald-600 font-mono mt-0.5">
            {synthesis.agentConsensus.marketAlpha.verdict}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] text-slate-500 font-medium">SEC Filings</div>
          <div className="text-xs font-bold text-rose-600 font-mono mt-0.5">
            {synthesis.agentConsensus.regulatorySec.verdict}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] text-slate-500 font-medium">Sentiment</div>
          <div className="text-xs font-bold text-amber-600 font-mono mt-0.5">
            {synthesis.agentConsensus.behavioralCrowd.verdict}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] text-slate-500 font-medium">Risk Score</div>
          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
            {synthesis.agentConsensus.portfolioRisk.verdict}
          </div>
        </div>
      </div>

      {/* Personalized Impact Section */}
      {isLoggedIn ? (
        <div className="bg-slate-50/90 border border-slate-200 p-4 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-900">
              Personalized Plan: {userProfile.name}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Target: {holding?.targetAllocation || 20}% • Current: {holding?.portfolioWeight || 34.8}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Action</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {synthesis.suggestedAction.actionType} {synthesis.suggestedAction.recommendedSize.split(' ')[0]}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Stop-Loss</span>
              <span className="font-bold text-rose-600 font-mono mt-0.5 block">
                {formatCurrency(synthesis.suggestedAction.suggestedStopLoss)}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Target</span>
              <span className="font-bold text-emerald-600 font-mono mt-0.5 block">
                {formatCurrency(synthesis.suggestedAction.suggestedTarget)}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Risk / Reward</span>
              <span className="font-bold text-slate-900 font-mono mt-0.5 block">
                {synthesis.riskRewardRatio.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Log in to enable personalized position sizing and stop-loss targets.
          </div>
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shrink-0"
            >
              Log In
            </button>
          )}
        </div>
      )}

      {/* Conflict Resolution Accordion */}
      <div>
        <button
          onClick={() => setShowConflicts(!showConflicts)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>Reconciled Signal Conflicts ({synthesis.conflictResolutionMatrix.length})</span>
          <span className="text-slate-400">
            {showConflicts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showConflicts && (
          <div className="mt-2.5 space-y-2 text-xs">
            {synthesis.conflictResolutionMatrix.map((c, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="font-semibold text-slate-900 text-xs">
                  {c.conflictingAgents[0]} vs {c.conflictingAgents[1]}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{c.conflictDescription}</p>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs text-slate-800">
                  <strong className="text-slate-900">Verdict: </strong>
                  {c.arbiterResolution}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onViewJustification}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={onOpenAiConsult}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ask Arbiter</span>
          </button>
        </div>

        <button
          onClick={isLoggedIn ? onOpenExecutionModal : onOpenLoginModal}
          id="btn-stage-order"
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm ml-auto"
        >
          <span>{isLoggedIn ? 'Stage Order' : 'Log In to Stage'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
