import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { MOCK_SEC_FILINGS } from '../data/mockFinancialData';

interface SecFilingsIntelligenceProps {
  selectedTicker: string;
  onBackToOverview?: () => void;
}

export const SecFilingsIntelligence: React.FC<SecFilingsIntelligenceProps> = ({
  selectedTicker,
  onBackToOverview,
}) => {
  const [selectedFilingId, setSelectedFilingId] = useState<string>(MOCK_SEC_FILINGS[0].id);
  const [filterFormType, setFilterFormType] = useState<string>('ALL');

  const tickerFilings = MOCK_SEC_FILINGS.filter(
    (f) =>
      (f.ticker === selectedTicker || f.ticker === 'NVDA') &&
      (filterFormType === 'ALL' || f.formType === filterFormType)
  );

  const activeFiling = MOCK_SEC_FILINGS.find((f) => f.id === selectedFilingId) || MOCK_SEC_FILINGS[0];

  const getRiskScoreBadge = (score: number) => {
    if (score >= 65) {
      return (
        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> Risk {score}/100
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Risk {score}/100
        </span>
      );
    }
    return (
      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" /> Risk {score}/100
      </span>
    );
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
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                SEC Regulatory Disclosures
              </h2>
              <p className="text-xs text-slate-500">
                Automated 10-K, 10-Q & 8-K footnote extraction for {selectedTicker}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['ALL', '8-K', '10-Q', 'FORM-4'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterFormType(type)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterFormType === type
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Filings Feed + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Filings Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {tickerFilings.map((filing) => {
              const isSelected = filing.id === activeFiling.id;
              return (
                <button
                  key={filing.id}
                  onClick={() => setSelectedFilingId(filing.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 border-slate-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 text-xs font-mono">
                        {filing.formType}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">${filing.ticker}</span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {filing.filedDate.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {filing.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {filing.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Deep Inspection Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-slate-500 block mb-0.5">
                  {activeFiling.formType} • Filed {activeFiling.filedDate}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{activeFiling.title}</h3>
              </div>
              <div>{getRiskScoreBadge(activeFiling.extractedRiskScore)}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Executive Synthesis
              </span>
              <p className="text-xs sm:text-sm text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                {activeFiling.summary}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                Material Footnote Excerpt
              </span>
              <div className="space-y-2">
                {activeFiling.highlightedQuotes.map((quote, i) => (
                  <blockquote
                    key={i}
                    className="border-l-2 border-amber-500 bg-white p-3 rounded-r-xl text-slate-700 text-xs leading-relaxed italic border border-slate-200"
                  >
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>EDGAR Record</span>
              <a
                href={activeFiling.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open SEC Filing</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
