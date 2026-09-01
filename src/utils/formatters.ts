export function isIndianAsset(tickerOrAsset?: string): boolean {
  if (!tickerOrAsset) return false;
  const upper = tickerOrAsset.toUpperCase();
  return (
    upper.endsWith('.NS') ||
    upper.endsWith('.BO') ||
    upper === 'INR' ||
    ['TATAMOTORS', 'RELIANCE', 'HDFCBANK', 'INFY', 'TCS', 'ICICIBANK', 'NIFTY', 'SENSEX'].includes(
      upper.replace('.NS', '').replace('.BO', '')
    )
  );
}

export function formatCurrency(
  value: number,
  decimals: number = 2,
  tickerOrAsset?: string
): string {
  const isINR = isIndianAsset(tickerOrAsset);

  if (isINR) {
    if (Math.abs(value) >= 100_000_000) {
      return `₹${(value / 100_000_000).toFixed(decimals)} Cr`;
    }
    if (Math.abs(value) >= 100_000) {
      return `₹${(value / 100_000).toFixed(decimals)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  if (Math.abs(value) >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(decimals)}T`;
  }
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getSignalColorClass(verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'POSITIVE' | 'NEGATIVE' | 'OPTIMAL' | 'OVEREXPOSED' | 'UNDEREXPOSED'): string {
  switch (verdict) {
    case 'BULLISH':
    case 'POSITIVE':
    case 'OPTIMAL':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    case 'BEARISH':
    case 'NEGATIVE':
    case 'OVEREXPOSED':
      return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
    case 'NEUTRAL':
    case 'UNDEREXPOSED':
    default:
      return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
  }
}

export function getRecommendationBadge(recommendation: string): { label: string; color: string; border: string; bg: string } {
  switch (recommendation) {
    case 'STRONG_BUY':
      return { label: 'STRONG BUY', color: 'text-emerald-300', border: 'border-emerald-500', bg: 'bg-emerald-500/20' };
    case 'BUY_DIP':
      return { label: 'ACCUMULATE DIP', color: 'text-cyan-300', border: 'border-cyan-500', bg: 'bg-cyan-500/20' };
    case 'HOLD_ACCUMULATE':
      return { label: 'HOLD & MONITOR', color: 'text-blue-300', border: 'border-blue-500', bg: 'bg-blue-500/20' };
    case 'TRIM_POSITION':
      return { label: 'TRIM POSITION (PROFIT HARVEST)', color: 'text-amber-300', border: 'border-amber-500', bg: 'bg-amber-500/20' };
    case 'TAKE_PROFIT':
      return { label: 'TAKE PROFIT', color: 'text-amber-300', border: 'border-amber-500', bg: 'bg-amber-500/20' };
    case 'HEDGE_RISK':
      return { label: 'HEDGE EXPOSURE', color: 'text-purple-300', border: 'border-purple-500', bg: 'bg-purple-500/20' };
    case 'STRONG_SELL':
      return { label: 'DEFENSIVE EXIT', color: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-500/20' };
    default:
      return { label: recommendation, color: 'text-slate-300', border: 'border-slate-500', bg: 'bg-slate-500/20' };
  }
}
