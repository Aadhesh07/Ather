import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TICKER_DIRECTORY, getStockInfo, StockInfo } from '../data/mockFinancialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { getTimeframeData, TimeframeOption } from '../utils/timeframeData';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTicker?: string;
  onSelectTickerForDashboard: (ticker: string) => void;
  onOpenAiConsult?: (ticker: string) => void;
}

const CATEGORIES = [
  'All Stocks',
  'Mega-Cap',
  'AI & Semis',
  'Software & Cloud',
  'Fintech & Crypto',
  'Consumer & Auto',
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  isOpen,
  onClose,
  initialTicker = 'NVDA',
  onSelectTickerForDashboard,
  onOpenAiConsult,
}) => {
  const [activeTicker, setActiveTicker] = useState<string>(initialTicker);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Stocks');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M');

  React.useEffect(() => {
    if (initialTicker) {
      setActiveTicker(initialTicker);
    }
  }, [initialTicker, isOpen]);

  const allTickers = useMemo(() => Object.keys(TICKER_DIRECTORY), []);

  const filteredTickers = useMemo(() => {
    let list = allTickers;

    if (selectedCategory !== 'All Stocks') {
      list = list.filter((sym) => {
        const item = TICKER_DIRECTORY[sym];
        return item && item.category === selectedCategory;
      });
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((sym) => {
      const item = TICKER_DIRECTORY[sym];
      return (
        sym.toLowerCase().includes(q) ||
        (item && item.name.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory, allTickers]);

  const isCustomSearch = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const cleanQ = searchQuery.trim().toUpperCase();
    return !allTickers.includes(cleanQ) && filteredTickers.length === 0;
  }, [searchQuery, allTickers, filteredTickers]);

  const stockInfo: StockInfo = useMemo(() => {
    return getStockInfo(activeTicker);
  }, [activeTicker]);

  const chartData = useMemo(() => {
    return getTimeframeData(activeTicker, timeframe);
  }, [activeTicker, timeframe]);

  const firstPoint = chartData[0];
  const lastPoint = chartData[chartData.length - 1];
  const startPrice = firstPoint ? firstPoint.price : stockInfo.price;
  const currentPrice = lastPoint ? lastPoint.price : stockInfo.price;
  const periodDiff = currentPrice - startPrice;
  const periodDiffPercent = startPrice > 0 ? (periodDiff / startPrice) * 100 : 0;
  const isPeriodPositive = periodDiff >= 0;

  const prices = chartData.map((d) => d.price);
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const spread = rawMax - rawMin || 1;
  const minDomain = Math.max(0, Number((rawMin - spread * 0.08).toFixed(1)));
  const maxDomain = Number((rawMax + spread * 0.08).toFixed(1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Stock Deep Dive
              </h2>
              <p className="text-[11px] text-slate-500">
                Live pricing, moving averages & fundamental valuation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Search & Categories */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stocks or tickers (NVDA, AAPL, TSLA, BTC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isCustomSearch && (
              <div
                onClick={() => setActiveTicker(searchQuery.trim().toUpperCase())}
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between cursor-pointer"
              >
                <span className="text-xs font-semibold text-emerald-900">
                  Analyze ${searchQuery.trim().toUpperCase()}
                </span>
                <span className="text-xs text-emerald-700 font-bold">Select &rarr;</span>
              </div>
            )}

            {/* Quick stock pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {filteredTickers.map((sym) => {
                const s = TICKER_DIRECTORY[sym] || getStockInfo(sym);
                const active = activeTicker === sym;
                const positive = s.change >= 0;
                return (
                  <button
                    key={sym}
                    onClick={() => setActiveTicker(sym)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer whitespace-nowrap font-medium ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>${sym}</span>
                    <span className={active ? 'text-slate-300' : 'text-slate-400'}>
                      {formatCurrency(s.price, sym === 'BTC' ? 0 : 2)}
                    </span>
                    <span className={positive ? 'text-emerald-500' : 'text-rose-500'}>
                      {positive ? '+' : ''}{formatPercent(s.changePercent)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stock Hero Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-lg font-bold text-slate-900">${activeTicker}</span>
                <span className="text-xs text-slate-500">{stockInfo.name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-slate-200 text-slate-700 font-medium">
                  {stockInfo.sector}
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {formatCurrency(currentPrice, activeTicker === 'BTC' ? 0 : 2)}
                </span>
                <span className={`text-xs font-bold font-mono flex items-center ${isPeriodPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPeriodPositive ? '+' : ''}{formatCurrency(periodDiff, activeTicker === 'BTC' ? 0 : 2)} ({formatPercent(periodDiffPercent)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectTickerForDashboard(activeTicker);
                  onClose();
                }}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-sm"
              >
                <span>Set on Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              {onOpenAiConsult && (
                <button
                  onClick={() => {
                    onOpenAiConsult(activeTicker);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>AI Arbiter</span>
                </button>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between pb-1 text-xs">
              <span className="font-semibold text-slate-700">Price Chart</span>
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200">
                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                      timeframe === tf ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="modalGrowwGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPeriodPositive ? '#00D09C' : '#EB5B3C'} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={isPeriodPositive ? '#00D09C' : '#EB5B3C'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis domain={[minDomain, maxDomain]} stroke="#94A3B8" fontSize={9} orientation="right" tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPeriodPositive ? '#00D09C' : '#EB5B3C'}
                    strokeWidth={2}
                    fill="url(#modalGrowwGradient)"
                  />
                  <Line type="monotone" dataKey="ema20" stroke="#F59E0B" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fundamentals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Market Cap</span>
              <span className="font-bold text-slate-900">{stockInfo.marketCap}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">P/E Ratio</span>
              <span className="font-bold text-slate-900">{stockInfo.peRatio || 'N/A'}x</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">52W High/Low</span>
              <span className="font-bold text-slate-900">${stockInfo.low52} - ${stockInfo.high52}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Beta</span>
              <span className="font-bold text-slate-900">{stockInfo.beta}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
