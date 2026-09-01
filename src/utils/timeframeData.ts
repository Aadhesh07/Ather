import { MarketDataPoint, AgentId } from '../types';
import { getStockInfo } from '../data/mockFinancialData';

export type TimeframeOption = '1D' | '1W' | '1M' | '3M' | '1Y';

/**
 * Generates realistic, authentic multi-timeframe market chart data for any ticker.
 * Accurately spans 52-week ranges for 1Y, monthly cycles for 1M/3M, weekly for 1W, and intraday for 1D.
 */
export function getTimeframeData(
  ticker: string,
  timeframe: TimeframeOption
): MarketDataPoint[] {
  const stock = getStockInfo(ticker);

  const currentPrice = stock.price;
  const high52 = stock.high52 || currentPrice * 1.2;
  const low52 = stock.low52 || currentPrice * 0.75;
  const isPos = stock.change >= 0;

  switch (timeframe) {
    case '1D': {
      // Intraday from 09:30 to 16:00 EDT
      const openPrice = currentPrice - stock.change;
      const times = [
        '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00',
        '14:30', '15:00', '15:30', '16:00'
      ];

      return times.map((t, idx) => {
        const progress = idx / (times.length - 1);
        const wave = Math.sin(idx * 0.8) * (stock.price * 0.008);
        const price = Number((openPrice + (currentPrice - openPrice) * progress + wave).toFixed(2));
        const ema20 = Number((price * 0.995 + Math.sin(idx * 0.5) * 0.5).toFixed(2));
        const ema50 = Number((openPrice + (price - openPrice) * 0.7).toFixed(2));
        const rsi = Math.round(48 + Math.sin(idx * 0.6) * 18 + (isPos ? 8 : -8));
        const volume = Number((2.5 + Math.abs(Math.sin(idx)) * 6.5).toFixed(1));

        let agentEvent = undefined;
        if (idx === 3) {
          agentEvent = {
            agentId: 'agent-market' as AgentId,
            title: `Orderflow Surge: ${ticker} block buy $14.2M at ${t}`,
            type: 'BULL' as const,
          };
        } else if (idx === 7) {
          agentEvent = {
            agentId: 'agent-sentiment' as AgentId,
            title: `Sentiment Shift: Retail volume ratio peak at ${t}`,
            type: 'INFO' as const,
          };
        } else if (idx === 11 && !isPos) {
          agentEvent = {
            agentId: 'agent-sec' as AgentId,
            title: `Institutional Dark Pool outflow flagged`,
            type: 'BEAR' as const,
          };
        }

        return {
          time: t,
          price,
          open: Number((price - 0.3).toFixed(2)),
          high: Number((price + 0.6).toFixed(2)),
          low: Number((price - 0.5).toFixed(2)),
          close: price,
          volume,
          ema20,
          ema50,
          rsi,
          agentEvent,
        };
      });
    }

    case '1W': {
      // 5 trading days: Mon, Tue, Wed, Thu, Fri (multiple checkpoints per day)
      const weekPoints = [
        { time: 'Mon 09:30', factor: -0.028 },
        { time: 'Mon 16:00', factor: -0.015 },
        { time: 'Tue 11:00', factor: -0.008 },
        { time: 'Tue 16:00', factor: 0.005 },
        { time: 'Wed 11:00', factor: 0.018 },
        { time: 'Wed 16:00', factor: 0.012 },
        { time: 'Thu 11:00', factor: -0.004 },
        { time: 'Thu 16:00', factor: 0.008 },
        { time: 'Fri 11:00', factor: 0.022 },
        { time: 'Fri 16:00', factor: 0.0 }, // current price
      ];

      return weekPoints.map((pt, idx) => {
        const price = Number((currentPrice * (1 + pt.factor * (isPos ? 1 : -1))).toFixed(2));
        const ema20 = Number((price * 0.992).toFixed(2));
        const ema50 = Number((price * 0.985).toFixed(2));
        const rsi = Math.round(52 + pt.factor * 400);
        const volume = Number((18 + Math.sin(idx) * 12).toFixed(1));

        let agentEvent = undefined;
        if (idx === 4) {
          agentEvent = {
            agentId: 'agent-market' as AgentId,
            title: `Mid-week Breakout test on high volume`,
            type: isPos ? ('BULL' as const) : ('BEAR' as const),
          };
        }

        return {
          time: pt.time,
          price,
          open: Number((price - 0.8).toFixed(2)),
          high: Number((price + 1.4).toFixed(2)),
          low: Number((price - 1.1).toFixed(2)),
          close: price,
          volume,
          ema20,
          ema50,
          rsi: Math.max(25, Math.min(85, rsi)),
          agentEvent,
        };
      });
    }

    case '1M': {
      // Past 30 days (~10 discrete timestamps across the month)
      const dates = [
        'Aug 01', 'Aug 04', 'Aug 07', 'Aug 11', 'Aug 14',
        'Aug 18', 'Aug 21', 'Aug 25', 'Aug 28', 'Aug 31'
      ];
      const startFactor = isPos ? -0.065 : 0.075;

      return dates.map((d, idx) => {
        const progress = idx / (dates.length - 1);
        const curve = Math.sin(progress * Math.PI) * (isPos ? 0.04 : -0.04);
        const price = Number((currentPrice * (1 + startFactor * (1 - progress) + curve)).toFixed(2));
        const ema20 = Number((price * 0.994).toFixed(2));
        const ema50 = Number((price * 0.988).toFixed(2));
        const rsi = Math.round(45 + progress * 20 + Math.sin(idx) * 8);
        const volume = Number((24 + Math.cos(idx) * 15).toFixed(1));

        let agentEvent = undefined;
        if (idx === 4) {
          agentEvent = {
            agentId: 'agent-sec' as AgentId,
            title: `Form 10-Q Quarterly Filing Disclosed`,
            type: 'INFO' as const,
          };
        }

        return {
          time: d,
          price,
          open: Number((price - 1.5).toFixed(2)),
          high: Number((price + 2.8).toFixed(2)),
          low: Number((price - 2.2).toFixed(2)),
          close: price,
          volume,
          ema20,
          ema50,
          rsi: Math.max(30, Math.min(80, rsi)),
          agentEvent,
        };
      });
    }

    case '3M': {
      // Past quarter (~10 checkpoints)
      const dates = [
        'Jun 01', 'Jun 12', 'Jun 24', 'Jul 05', 'Jul 16',
        'Jul 28', 'Aug 08', 'Aug 18', 'Aug 26', 'Aug 31'
      ];
      const startFactor = isPos ? -0.14 : 0.12;

      return dates.map((d, idx) => {
        const progress = idx / (dates.length - 1);
        const dip = Math.sin(progress * Math.PI * 2) * 0.035;
        const price = Number((currentPrice * (1 + startFactor * (1 - progress) + dip)).toFixed(2));
        const ema20 = Number((price * 0.99).toFixed(2));
        const ema50 = Number((price * 0.978).toFixed(2));
        const rsi = Math.round(50 + (isPos ? 12 : -10) + Math.sin(idx) * 10);
        const volume = Number((28 + Math.sin(idx * 2) * 14).toFixed(1));

        let agentEvent = undefined;
        if (idx === 3) {
          agentEvent = {
            agentId: 'agent-portfolio' as AgentId,
            title: `Quarterly Portfolio Allocation Rebalance`,
            type: 'BULL' as const,
          };
        }

        return {
          time: d,
          price,
          open: Number((price - 2.2).toFixed(2)),
          high: Number((price + 3.8).toFixed(2)),
          low: Number((price - 3.1).toFixed(2)),
          close: price,
          volume,
          ema20,
          ema50,
          rsi: Math.max(30, Math.min(80, rsi)),
          agentEvent,
        };
      });
    }

    case '1Y': {
      // 12 Months: Realistic 52-Week span matching high52 and low52
      const months = [
        "Sep '25", "Oct '25", "Nov '25", "Dec '25",
        "Jan '26", "Feb '26", "Mar '26", "Apr '26",
        "May '26", "Jun '26", "Jul '26", "Aug '26"
      ];

      // Build trajectory anchored at low52 and climbing toward high52 / currentPrice
      return months.map((m, idx) => {
        const progress = idx / (months.length - 1);
        // Start near low52 + 10%, peak around month 9 (May/Jun), and land at currentPrice
        const base = low52 + (currentPrice - low52) * progress;
        const seasonalSwing = Math.sin(progress * Math.PI) * ((high52 - low52) * 0.25);
        const price = Number((idx === months.length - 1 ? currentPrice : Math.min(high52, Math.max(low52, base + seasonalSwing))).toFixed(2));
        const ema20 = Number((price * 0.98).toFixed(2));
        const ema50 = Number((price * 0.95).toFixed(2));
        const rsi = Math.round(55 + (price - low52) / (high52 - low52) * 25);
        const volume = Number((32 + Math.sin(idx) * 18).toFixed(1));

        let agentEvent = undefined;
        if (idx === 5) {
          agentEvent = {
            agentId: 'agent-market' as AgentId,
            title: `Q1 Major Cycle Pivot & Institutional Inflow`,
            type: 'BULL' as const,
          };
        } else if (idx === 9) {
          agentEvent = {
            agentId: 'agent-orchestrator' as AgentId,
            title: `52-Week High Range Resistance Test`,
            type: 'INFO' as const,
          };
        }

        return {
          time: m,
          price,
          open: Number((price * 0.98).toFixed(2)),
          high: Number((price * 1.025).toFixed(2)),
          low: Number((price * 0.965).toFixed(2)),
          close: price,
          volume,
          ema20,
          ema50,
          rsi: Math.max(30, Math.min(85, rsi)),
          agentEvent,
        };
      });
    }
  }
}
