import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Search,
  Zap,
  Globe,
  BookOpen,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { TICKER_DIRECTORY, getStockInfo } from '../data/mockFinancialData';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface HeroSectionProps {
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
  onNavigateTab: (tab: string) => void;
  onSimulateRun: () => void;
  isSimulating: boolean;
  onOpenAiChat: () => void;
  totalPortfolioValue: number;
  onOpenStockSearch: (initialTicker?: string) => void;
}

const HIGHLIGHT_TICKERS = [
  'TATAMOTORS.NS',
  'RELIANCE.NS',
  'HDFCBANK.NS',
  'INFY.NS',
  'NVDA',
  'AAPL',
  'TSLA',
  'BTC',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedTicker,
  onSelectTicker,
  onNavigateTab,
  onSimulateRun,
  isSimulating,
  onOpenAiChat,
  onOpenStockSearch,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const allTickerKeys = Object.keys(TICKER_DIRECTORY);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      const q = localSearch.trim();
      const match = allTickerKeys.find(
        (t) =>
          t.toLowerCase() === q.toLowerCase() ||
          TICKER_DIRECTORY[t]?.name.toLowerCase().includes(q.toLowerCase())
      );
      if (match) {
        onSelectTicker(match);
      } else {
        onSelectTicker(q.toUpperCase());
      }
      setLocalSearch('');
    }
  };

  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 select-none shadow-sm space-y-6">
      {/* Top Tag & Main Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-Time Market Intelligence Swarm • NSE / BSE & Global Equities</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Autonomous Financial Intelligence
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto font-normal">
          Real-time orderflow, SEBI & SEC filings, behavioral sentiment, and transparent portfolio risk analysis in one unified workspace.
        </p>

        {/* Explain Terms in Plain English as prominent action */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => onNavigateTab('plain-english')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Explain Complex Terms in Plain English</span>
          </button>
        </div>
      </div>

      {/* Stock Search Bar */}
      <div className="max-w-lg mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Indian or global stock (e.g. TATAMOTORS.NS, RELIANCE.NS, NVDA, AAPL)..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Action & Timeframe Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
        {HIGHLIGHT_TICKERS.map((sym) => {
          const data = TICKER_DIRECTORY[sym] || getStockInfo(sym);
          const isPos = data.change >= 0;
          const isSelected = selectedTicker === sym;
          const isINR = sym.endsWith('.NS') || sym.endsWith('.BO');

          return (
            <button
              key={sym}
              onClick={() => onSelectTicker(sym)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="font-bold font-sans">{sym}</span>
              <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                {isINR ? `₹${data.price.toFixed(2)}` : formatCurrency(data.price, sym === 'BTC' ? 0 : 2)}
              </span>
              <span
                className={`flex items-center text-[10px] font-semibold ${
                  isSelected
                    ? isPos ? 'text-emerald-400' : 'text-rose-400'
                    : isPos ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {formatPercent(data.changePercent)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

