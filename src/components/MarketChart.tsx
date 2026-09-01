import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { TimeframeOption } from '../utils/timeframeData';
import { formatCurrency, formatPercent, isIndianAsset } from '../utils/formatters';
import { useLiveMarketChart } from '../services/api';
import { getStockInfo } from '../data/mockFinancialData';

interface MarketChartProps {
  ticker: string;
  onTriggerAgentAnalysis?: () => void;
}

export const MarketChart: React.FC<MarketChartProps> = ({
  ticker,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M');
  const { data: chartResponse, isLoading, isLive } = useLiveMarketChart(ticker, timeframe);

  const fallbackInfo = useMemo(() => getStockInfo(ticker), [ticker]);
  const isINR = isIndianAsset(ticker);

  const currentPrice = chartResponse?.currentPrice ?? fallbackInfo.price;
  const previousClose = chartResponse?.previousClose ?? fallbackInfo.price;
  const periodDiff = chartResponse?.change ?? (currentPrice - previousClose);
  const periodDiffPercent = chartResponse?.changePercent ?? (previousClose > 0 ? (periodDiff / previousClose) * 100 : 0);
  const isPositive = periodDiff >= 0;

  const dayHigh = chartResponse?.dayHigh ?? fallbackInfo.high52;
  const dayLow = chartResponse?.dayLow ?? fallbackInfo.low52;
  const fiftyTwoHigh = chartResponse?.fiftyTwoWeekHigh ?? fallbackInfo.high52;
  const fiftyTwoLow = chartResponse?.fiftyTwoWeekLow ?? fallbackInfo.low52;

  const chartPoints = chartResponse?.points || [];

  // Range Slider Calculation for Groww style
  const calculateSliderPercent = (low: number, high: number, current: number) => {
    if (high <= low) return 50;
    const clamped = Math.max(low, Math.min(high, current));
    return Math.min(100, Math.max(0, ((clamped - low) / (high - low)) * 100));
  };

  const dayRangePercent = calculateSliderPercent(dayLow, dayHigh, currentPrice);
  const yearRangePercent = calculateSliderPercent(fiftyTwoLow, fiftyTwoHigh, currentPrice);

  const prices = chartPoints.map((p) => p.price);
  const rawMin = prices.length > 0 ? Math.min(...prices) : dayLow;
  const rawMax = prices.length > 0 ? Math.max(...prices) : dayHigh;
  const spread = rawMax - rawMin || 1;
  const yMin = Math.max(0, Number((rawMin - spread * 0.05).toFixed(2)));
  const yMax = Number((rawMax + spread * 0.05).toFixed(2));

  // Custom Groww-Style Clean Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700 text-xs z-50">
          <div className="text-[11px] text-slate-400 font-medium mb-0.5">{data.time}</div>
          <div className="text-sm font-bold font-mono text-white">
            {formatCurrency(data.price, ticker === 'BTC' ? 0 : 2, ticker)}
          </div>
          {data.volume && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              Vol: {data.volume}M
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header Section: Stock Info & Groww-style Prominent Price */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {ticker}
            </h1>
            <span className="text-sm font-medium text-slate-500">
              {chartResponse?.name || fallbackInfo.name}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/80">
              {chartResponse?.exchange || fallbackInfo.exchange || 'NSE'}
            </span>
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                <CheckCircle2 className="w-3 h-3 text-slate-400" />
                Market Feed
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-2 flex-wrap">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              {formatCurrency(currentPrice, ticker === 'BTC' ? 0 : 2, ticker)}
            </span>
            <div
              className={`inline-flex items-center text-sm font-bold font-mono px-2 py-0.5 rounded-md ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-0.5" />
              )}
              {isPositive ? '+' : ''}
              {formatCurrency(periodDiff, ticker === 'BTC' ? 0 : 2, ticker)} ({formatPercent(periodDiffPercent)})
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              • {timeframe === '1D' ? 'Today' : `Past ${timeframe}`}
            </span>
          </div>
        </div>

        {/* Groww Timeframe Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs self-start">
          {(['1D', '1W', '1M', '1Y', '5Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as TimeframeOption)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Groww Interactive Area Chart */}
      <div className="h-[290px] w-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
              <span>Fetching market data...</span>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growwChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10B981' : '#F43F5E'}
                  stopOpacity={0.16}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10B981' : '#F43F5E'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              dy={5}
            />

            <YAxis
              domain={[yMin, yMax]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const prefix = isINR ? '₹' : '$';
                return `${prefix}${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(v < 10 ? 2 : 0)}`;
              }}
              orientation="right"
              dx={5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#059669' : '#E11D48'}
              strokeWidth={2.2}
              fillOpacity={1}
              fill="url(#growwChartGradient)"
              isAnimationActive={true}
              animationDuration={500}
            />

            {/* Baseline reference */}
            <ReferenceLine
              y={previousClose}
              stroke="#CBD5E1"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Groww Signature: Today's Range & 52-Week Range Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
        {/* Day's Range */}
        <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Today's Low</span>
            <span className="text-slate-400 font-normal">Day's Range</span>
            <span>Today's High</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-900">{formatCurrency(dayLow, 2, ticker)}</span>
            <div className="flex-1 relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 bg-emerald-500 rounded-full"
                style={{ width: `${dayRangePercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{formatCurrency(dayHigh, 2, ticker)}</span>
          </div>
        </div>

        {/* 52-Week Range */}
        <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>52W Low</span>
            <span className="text-slate-400 font-normal">52-Week Range</span>
            <span>52W High</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-900">{formatCurrency(fiftyTwoLow, 2, ticker)}</span>
            <div className="flex-1 relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 bg-slate-800 rounded-full"
                style={{ width: `${yearRangePercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{formatCurrency(fiftyTwoHigh, 2, ticker)}</span>
          </div>
        </div>
      </div>

      {/* Groww Clean Fundamentals Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">Prev Close</span>
          <span className="font-bold text-slate-900 font-mono mt-0.5 block">{formatCurrency(previousClose, 2, ticker)}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">Market Cap</span>
          <span className="font-bold text-slate-900 font-mono mt-0.5 block">{fallbackInfo.marketCap}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">P/E Ratio</span>
          <span className="font-bold text-slate-900 font-mono mt-0.5 block">{fallbackInfo.peRatio ? `${fallbackInfo.peRatio}x` : 'N/A'}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">Beta (5Y)</span>
          <span className="font-bold text-slate-900 font-mono mt-0.5 block">{fallbackInfo.beta}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">Sector</span>
          <span className="font-bold text-slate-900 mt-0.5 block truncate">{fallbackInfo.sector}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <span className="text-slate-500 block text-[11px] font-medium">Avg Volume</span>
          <span className="font-bold text-slate-900 font-mono mt-0.5 block">{fallbackInfo.avgVolume}</span>
        </div>
      </div>
    </div>
  );
};
