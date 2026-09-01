import React from 'react';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { TICKER_DIRECTORY, getStockInfo } from '../data/mockFinancialData';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface FlowingTickerTapeProps {
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
  onOpenStockSearch?: (ticker?: string) => void;
}

const TAPE_TICKERS = [
  'TATAMOTORS.NS',
  'RELIANCE.NS',
  'NVDA',
  'HDFCBANK.NS',
  'AAPL',
  'INFY.NS',
  'MSFT',
  'ICICIBANK.NS',
  'TSLA',
  'BTC',
  'GOOGL',
  'SBIN.NS',
  'AMZN',
  'TCS.NS',
  'META',
];

export const FlowingTickerTape: React.FC<FlowingTickerTapeProps> = ({
  selectedTicker,
  onSelectTicker,
  onOpenStockSearch,
}) => {
  // Duplicate array for seamless infinite looping tape
  const items = [...TAPE_TICKERS, ...TAPE_TICKERS];

  return (
    <div className="relative w-full bg-slate-900 border-b border-slate-800 text-white overflow-hidden py-1.5 select-none font-sans text-xs">
      {/* Left/Right soft fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent z-10" />

      {/* Floating Animated Track */}
      <div className="flex w-max items-center gap-6 animate-ticker-tape hover:[animation-play-state:paused] cursor-pointer">
        {items.map((sym, idx) => {
          const info = TICKER_DIRECTORY[sym] || getStockInfo(sym);
          const isPos = info.change >= 0;
          const isSelected = selectedTicker === sym;

          return (
            <div
              key={`${sym}-${idx}`}
              onClick={() => onSelectTicker(sym)}
              className={`flex items-center gap-2 px-2.5 py-0.5 rounded-md transition-colors ${
                isSelected
                  ? 'bg-slate-800 text-emerald-300 ring-1 ring-emerald-500/50 font-bold'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <span className="font-bold font-sans text-[11px] text-white">{sym}</span>
              <span className="font-mono text-[11px] text-slate-300">
                {formatCurrency(info.price, sym === 'BTC' ? 0 : 2, sym)}
              </span>
              <span
                className={`flex items-center text-[10px] font-mono font-semibold ${
                  isPos ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {isPos ? '+' : ''}
                {formatPercent(info.changePercent)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
