import React from 'react';
import {
  Users,
  Flame,
  MessageSquare,
  Layers,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { MOCK_BEHAVIORAL_SIGNALS } from '../data/mockFinancialData';

interface BehavioralSentimentViewProps {
  selectedTicker: string;
  onBackToOverview?: () => void;
}

export const BehavioralSentimentView: React.FC<BehavioralSentimentViewProps> = ({
  selectedTicker,
  onBackToOverview,
}) => {
  const signal =
    MOCK_BEHAVIORAL_SIGNALS[selectedTicker] || MOCK_BEHAVIORAL_SIGNALS.NVDA;

  const comparisonData = [
    { name: 'Retail Sentiment', score: signal.socialSentimentScore, fill: '#334155' },
    { name: 'Retail Volume %', score: signal.retailVolumeRatio, fill: '#64748B' },
    { name: 'FOMO Index', score: signal.fomoRiskScore, fill: '#F59E0B' },
    { name: 'Dark Pool Flow', score: signal.darkPoolAccumulationIndex, fill: '#10B981' },
    { name: 'Fear & Greed', score: signal.fearGreedIndex, fill: '#0F172A' },
  ];

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
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Market Sentiment & Dark Pool
              </h2>
              <p className="text-xs text-slate-500">
                Crowd psychology vs institutional distribution for {selectedTicker}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold self-start sm:self-auto ${
              signal.crowdVsInstitutionsDivergence === 'BEARISH_DIVERGENCE'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {signal.crowdVsInstitutionsDivergence.replace('_', ' ')}
          </span>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> FOMO Index
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">{signal.fomoRiskScore}/100</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> Dark Pool Net
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">{signal.darkPoolAccumulationIndex}/100</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> 24h Social
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">+{signal.socialMentions24hChange}%</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-500" /> Retail Volume
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">{signal.retailVolumeRatio}%</div>
          </div>
        </div>

        {/* Narrative & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Dominant Narrative</span>
            <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
              "{signal.dominantNarrative}"
            </p>
            <p className="text-slate-600 text-xs leading-relaxed pt-1">
              Social euphoria surges as institutional Dark Pool distribution index sits at {signal.darkPoolAccumulationIndex}. Prudence suggests avoiding chases into aggressive vertical breakouts.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-900 mb-2 block">Indicator Matrix</span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 15, left: 30, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={90} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
