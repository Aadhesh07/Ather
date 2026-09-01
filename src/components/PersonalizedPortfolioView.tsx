import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Sliders,
  RefreshCw,
  Lock,
  LogIn,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { UserFinancialProfile } from '../types';
import { MOCK_STRESS_SCENARIOS, MOCK_USER_PROFILES } from '../data/mockFinancialData';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface PersonalizedPortfolioViewProps {
  userProfile: UserFinancialProfile;
  onSelectTicker: (ticker: string) => void;
  onOpenExecutionModal: () => void;
  onBackToOverview?: () => void;
  isLoggedIn?: boolean;
  onOpenLoginModal?: () => void;
  allProfiles?: UserFinancialProfile[];
  onSelectProfile?: (profile: UserFinancialProfile) => void;
}

export const PersonalizedPortfolioView: React.FC<PersonalizedPortfolioViewProps> = ({
  userProfile,
  onSelectTicker,
  onOpenExecutionModal,
  onBackToOverview,
  isLoggedIn = true,
  onOpenLoginModal,
  allProfiles = MOCK_USER_PROFILES,
  onSelectProfile,
}) => {
  const [activePortfolioSubTab, setActivePortfolioSubTab] = useState<
    'holdings' | 'allocation' | 'stress' | 'rebalance'
  >('holdings');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(MOCK_STRESS_SCENARIOS[0].id);

  const activeScenario =
    MOCK_STRESS_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    MOCK_STRESS_SCENARIOS[0];

  const COLORS = ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'];

  const totalHoldingsValue = userProfile.holdings.reduce((acc, h) => acc + h.currentValue, 0);
  const totalCostBasis = userProfile.holdings.reduce((acc, h) => acc + h.shares * h.avgEntryPrice, 0);
  const totalUnrealizedPnl = totalHoldingsValue - totalCostBasis;
  const totalUnrealizedPnlPercent = totalCostBasis > 0 ? (totalUnrealizedPnl / totalCostBasis) * 100 : 0;

  const pieData = userProfile.holdings.map((h) => ({
    name: h.ticker,
    value: h.currentValue,
  }));

  pieData.push({
    name: 'CASH',
    value: userProfile.cashReserve,
  });

  const totalPortfolio = userProfile.totalPortfolioValue;

  const sectorMap: { [key: string]: number } = {};
  userProfile.holdings.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.currentValue;
  });
  sectorMap['Liquid Cash'] = userProfile.cashReserve;

  const sectorData = Object.keys(sectorMap).map((sector) => ({
    sector,
    amount: sectorMap[sector],
    percentage: ((sectorMap[sector] / totalPortfolio) * 100).toFixed(1),
  }));

  // GUEST MODE: 6 PRE-CONFIGURED PERSONAS
  if (!isLoggedIn) {
    return (
      <div className="space-y-6 select-none font-sans">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center relative shadow-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Public Mode • Select a Profile</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore 6 Pre-Configured Investor Profiles
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Switch between retail investors to view risk exposures, position limits, and stress-tested allocations.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Market</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Personas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-300 shadow-sm space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {p.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.title}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {p.riskTolerance}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Net Worth</span>
                    <span className="font-bold text-slate-900 font-mono">{formatCurrency(p.totalPortfolioValue, 0)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Cash</span>
                    <span className="text-slate-700 font-mono">{p.cashReservePercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Horizon</span>
                    <span className="text-slate-700">{p.timeHorizonYears} Yrs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Max Cap</span>
                    <span className="text-slate-900 font-semibold">{p.concentrationLimitPercent}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.holdings.map((h) => (
                    <span
                      key={h.ticker}
                      className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-mono border border-slate-200"
                    >
                      {h.ticker} ({h.portfolioWeight}%)
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectProfile) onSelectProfile(p);
                  if (onOpenLoginModal) onOpenLoginModal();
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Select & Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="space-y-6 select-none font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
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
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {userProfile.name}'s Portfolio
              </h2>
              <p className="text-xs text-slate-500">
                {userProfile.title} • Risk Model: <strong>{userProfile.riskTolerance}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExecutionModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rebalance</span>
          </button>
        </div>

        {/* 4 Financial Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Total Net Worth</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
              {formatCurrency(userProfile.totalPortfolioValue, 0)}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Unrealized P&L</span>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>+{formatCurrency(totalUnrealizedPnl, 0)}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Cash Reserve</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
              {formatCurrency(userProfile.cashReserve, 0)}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Max Single Asset</span>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
              {userProfile.concentrationLimitPercent}%
            </div>
          </div>
        </div>

        {/* Portfolio Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActivePortfolioSubTab('holdings')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer whitespace-nowrap ${
              activePortfolioSubTab === 'holdings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Holdings ({userProfile.holdings.length})</span>
          </button>

          <button
            onClick={() => setActivePortfolioSubTab('allocation')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer whitespace-nowrap ${
              activePortfolioSubTab === 'allocation'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Allocation</span>
          </button>

          <button
            onClick={() => setActivePortfolioSubTab('stress')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-semibold cursor-pointer whitespace-nowrap ${
              activePortfolioSubTab === 'stress'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Stress Test</span>
          </button>
        </div>

        {/* Holdings Table */}
        {activePortfolioSubTab === 'holdings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-semibold">
                  <th className="pb-2.5">Asset</th>
                  <th className="pb-2.5">Shares</th>
                  <th className="pb-2.5">Price</th>
                  <th className="pb-2.5">Value</th>
                  <th className="pb-2.5">P&L</th>
                  <th className="pb-2.5">Weight</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {userProfile.holdings.map((h) => {
                  const isPositive = h.unrealizedPnl >= 0;
                  return (
                    <tr key={h.ticker} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-sans font-bold text-slate-900">
                        {h.ticker} <span className="text-slate-400 font-normal text-xs">{h.companyName}</span>
                      </td>
                      <td className="py-2.5 text-slate-700">{h.shares}</td>
                      <td className="py-2.5 text-slate-900 font-semibold">{formatCurrency(h.currentPrice, 2, h.ticker)}</td>
                      <td className="py-2.5 text-slate-900 font-semibold">{formatCurrency(h.currentValue, 0, h.ticker)}</td>
                      <td className={`py-2.5 font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(h.unrealizedPnl, 0, h.ticker)} ({formatPercent(h.unrealizedPnlPercent)})
                      </td>
                      <td className="py-2.5 text-slate-700 font-sans">{h.portfolioWeight}% / {h.targetAllocation}%</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onSelectTicker(h.ticker)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-sans font-semibold cursor-pointer"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Allocation */}
        {activePortfolioSubTab === 'allocation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 mb-2 block">Asset Allocation</span>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [formatCurrency(val, 0), 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 mb-2 block">Sector Breakdown</span>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <XAxis type="number" stroke="#94A3B8" fontSize={10} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="sector" stroke="#94A3B8" fontSize={10} width={90} />
                    <Tooltip formatter={(val: number) => [formatCurrency(val, 0), 'Exposure']} />
                    <Bar dataKey="amount" fill="#334155" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Stress Test */}
        {activePortfolioSubTab === 'stress' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {MOCK_STRESS_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    selectedScenarioId === s.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Projected Drawdown</span>
                <div className="text-xl font-bold font-mono text-rose-600">
                  -{formatCurrency(activeScenario.projectedPortfolioImpact.dollarLoss, 0)} ({activeScenario.projectedPortfolioImpact.percentageLoss}%)
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900">Recommended Buffer</span>
                <p className="text-slate-600 text-xs">{activeScenario.projectedPortfolioImpact.suggestedCountermeasure}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
