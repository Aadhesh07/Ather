import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  Sparkles,
  BarChart3,
  Cpu,
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  Flame,
  Target,
  Gauge,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import {
  MLModelArchitecture,
  MLTrainingConfig,
  MLEpochProgress,
  MLModelMetrics,
  MLFeatureImportance,
  MLInferenceResult,
} from '../types';
import {
  DEFAULT_ML_CONFIG,
  INITIAL_FEATURE_IMPORTANCE,
  DEFAULT_MODEL_METRICS,
  generateTrainingEpochs,
  calculateMLInference,
  getArchitectureFeatureImportance,
} from '../utils/mlEngine';
import { formatCurrency, formatPercent, isIndianAsset } from '../utils/formatters';

interface MlTrainingStudioProps {
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
  onApplyTrainedModel?: (metrics: MLModelMetrics) => void;
  onBackToOverview: () => void;
}

const ARCHITECTURES: { id: MLModelArchitecture; name: string; tag: string; description: string }[] = [
  {
    id: 'MULTI_MODAL_ENSEMBLE',
    name: 'Multi-Modal Ensemble (XGBoost + LSTM + FinBERT)',
    tag: 'Production Grade (95.2%)',
    description: 'Combines order flow microstructures, deep sequence recurrent networks, and SEC/SEBI NLP embeddings.',
  },
  {
    id: 'TEMPORAL_LSTM',
    name: 'Temporal Sequence LSTM / TCN',
    tag: 'Momentum Waves',
    description: 'Multi-layer recurrent unit specialized in capturing time-lagged volatility, CVD momentum, and mean reversion.',
  },
  {
    id: 'GRADIENT_BOOST_XGBOOST',
    name: 'Gradient-Boosted Tree (XGBoost)',
    tag: 'Regime Transitions',
    description: 'Non-linear tree ensemble optimizing cross-entropy loss on dark pool divergence and volume imbalances.',
  },
  {
    id: 'FINBERT_NLP_REGULATORY',
    name: 'FinBERT Disclosure Risk Parser',
    tag: 'SEBI & SEC Filings',
    description: '110M parameter Transformer computing semantic cosine distances to regulatory contingent liabilities & Reg 33 audits.',
  },
  {
    id: 'CONVEX_MPT_OPTIMIZER',
    name: 'Convex Portfolio Risk Optimizer',
    tag: 'Portfolio Frontier',
    description: 'Calculates minimum-variance frontier and conditional Value-at-Risk (CVaR 95%) rebalance bounds.',
  },
];

const TEST_TICKERS = [
  'TATAMOTORS.NS',
  'RELIANCE.NS',
  'HDFCBANK.NS',
  'INFY.NS',
  'TCS.NS',
  'NVDA',
  'AAPL',
  'MSFT',
  'TSLA',
  'BTC',
];

export const MlTrainingStudio: React.FC<MlTrainingStudioProps> = ({
  selectedTicker,
  onSelectTicker,
  onApplyTrainedModel,
  onBackToOverview,
}) => {
  const [config, setConfig] = useState<MLTrainingConfig>(DEFAULT_ML_CONFIG);
  const [metrics, setMetrics] = useState<MLModelMetrics>(DEFAULT_MODEL_METRICS);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [epochLogs, setEpochLogs] = useState<MLEpochProgress[]>(() =>
    generateTrainingEpochs(DEFAULT_ML_CONFIG)
  );
  const [activeTestTicker, setActiveTestTicker] = useState<string>(selectedTicker);
  const [deployedToast, setDeployedToast] = useState<boolean>(false);

  // Dynamic feature importance based on active architecture
  const featureImportances = useMemo(() => {
    return getArchitectureFeatureImportance(config.architecture);
  }, [config.architecture]);

  // Calculate current inference on active ticker (currency-aware)
  const inferenceResult: MLInferenceResult = useMemo(() => {
    return calculateMLInference(activeTestTicker, metrics);
  }, [activeTestTicker, metrics]);

  // Handle Live Training Simulation Loop
  const handleStartTraining = () => {
    if (isTraining) return;

    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);

    const generated = generateTrainingEpochs(config);
    let step = 0;
    const total = generated.length;

    const interval = setInterval(() => {
      step++;
      const currentLog = generated[step - 1];
      if (currentLog) {
        setCurrentEpoch(currentLog.epoch);
        setTrainingProgress(Math.round((step / total) * 100));
        setEpochLogs(generated.slice(0, step));
      }

      if (step >= total) {
        clearInterval(interval);
        setIsTraining(false);
        const last = generated[generated.length - 1];
        setMetrics((prev) => ({
          ...prev,
          accuracy: last.valAccuracy,
          precision: Number((last.valAccuracy - 0.8).toFixed(1)),
          recall: Number((last.valAccuracy - 1.4).toFixed(1)),
          f1Score: last.f1Score,
          sharpeRatio: Number((2.72 + (last.valAccuracy - 85) * 0.022).toFixed(2)),
          lastTrainedDate: 'Just now (Optimized Weights Active)',
          status: 'TRAINED_ACCURATE',
        }));
      }
    }, 40);
  };

  const handleDeployWeights = () => {
    if (onApplyTrainedModel) {
      onApplyTrainedModel(metrics);
    }
    setDeployedToast(true);
    setTimeout(() => setDeployedToast(false), 2500);
  };

  const isCurrentIndian = isIndianAsset(activeTestTicker);

  return (
    <div className="space-y-6 font-sans select-none text-slate-800 animate-fade-in">
      {/* Top Header Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ML Model Training & Accuracy Studio
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Production Accuracy: {metrics.accuracy}%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Train, tune hyperparameters, and evaluate multi-modal predictive accuracy across Indian (NSE/BSE) and US equities using order flow microstructures, SEBI/SEC regulatory NLP, and dark pool distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToOverview}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            &larr; Back to Dashboard
          </button>

          <button
            onClick={handleDeployWeights}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Deploy Weights to Swarm</span>
          </button>
        </div>
      </div>

      {/* Deployed Toast Notice */}
      <AnimatePresence>
        {deployedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Trained model weights (Accuracy: {metrics.accuracy}%, Sharpe: {metrics.sharpeRatio}) deployed to live Arbiter swarm!
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">Status: ACTIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Quantitative Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Validation Accuracy</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold font-mono">
              +18.9% vs Base
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {metrics.accuracy}%
          </div>
          <div className="text-[11px] text-slate-500">
            Precision: {metrics.precision}% • Recall: {metrics.recall}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Backtested Sharpe Ratio</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
              Benchmark: 1.15
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {metrics.sharpeRatio}
          </div>
          <div className="text-[11px] text-slate-500">
            Out-of-sample risk-adjusted return
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>F1-Score / ROC-AUC</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
              Calibrated
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {metrics.f1Score} <span className="text-xs font-normal text-slate-400 font-sans">({metrics.rocAuc})</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Balanced class discrimination
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Win Rate / Max DD</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold">
              {metrics.totalBacktestTrades} Trades
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {metrics.winRate}% <span className="text-xs text-rose-600 font-normal font-sans">({metrics.maxDrawdown}%)</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Conservative risk bounds
          </div>
        </div>
      </div>

      {/* Main Grid: Hyperparameter Training Config & Live Convergence Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Architecture Selection & Hyperparameters */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900">Model Configuration</h2>
            </div>
            <button
              onClick={() => setConfig(DEFAULT_ML_CONFIG)}
              className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Model Architecture Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Model Architecture
            </label>
            <div className="space-y-1.5">
              {ARCHITECTURES.map((arch) => {
                const isSelected = config.architecture === arch.id;
                return (
                  <div
                    key={arch.id}
                    onClick={() => setConfig({ ...config, architecture: arch.id })}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold">{arch.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {arch.tag}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {arch.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hyperparameters Range Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
            {/* Epochs */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Training Epochs</span>
                <span className="font-mono font-bold text-slate-900">{config.epochs} Epochs</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={config.epochs}
                onChange={(e) => setConfig({ ...config, epochs: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* Learning Rate */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Learning Rate (η)</span>
                <span className="font-mono font-bold text-slate-900">{config.learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.02"
                step="0.001"
                value={config.learningRate}
                onChange={(e) => setConfig({ ...config, learningRate: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            {/* Feature Flags */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block">Feature Engineering Pipeline</span>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { key: 'orderFlowDelta', label: 'Order Flow Delta (CVD) & NSE/BSE Limit Walls' },
                  { key: 'secFootnoteEmbeddings', label: 'SEBI Reg 33 & SEC 10-K Footnote Liability NLP' },
                  { key: 'darkPoolDivergence', label: 'Dark Pool & Block Institutional Flow' },
                  { key: 'technicalMomentum', label: 'EMA-20/50 Ribbon & 14-Day RSI Divergence' },
                  { key: 'macroYieldCurve', label: 'Macro Sovereign Yield Spread & Volatility Skew' },
                ].map((feat) => {
                  const active = config.featureFlags[feat.key as keyof typeof config.featureFlags];
                  return (
                    <label
                      key={feat.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            featureFlags: {
                              ...config.featureFlags,
                              [feat.key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-800 font-medium">{feat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Button: Train Model */}
          <button
            onClick={handleStartTraining}
            disabled={isTraining}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isTraining
                ? 'bg-amber-50 text-amber-900 border border-amber-300 cursor-wait'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isTraining ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>
                  Optimizing Gradient Descent (Epoch {currentEpoch}/{config.epochs} • {trainingProgress}%)
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Run Model Training Loop</span>
              </>
            )}
          </button>
        </div>

        {/* Right 7 Cols: Convergence Graph & Feature Importance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Convergence Chart */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Training Loss & Validation Accuracy Convergence</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
                    Cross-Entropy Loss
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time progression showing exponential error reduction across epochs
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
                  <span>Train Loss: {epochLogs[epochLogs.length - 1]?.trainLoss || 0.038}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
                  <span>Accuracy: {epochLogs[epochLogs.length - 1]?.valAccuracy || 95.2}%</span>
                </span>
              </div>
            </div>

            {/* Convergence Chart Container */}
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={epochLogs} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="epoch" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis
                    yAxisId="loss"
                    stroke="#94A3B8"
                    fontSize={10}
                    domain={[0, 1]}
                    tickLine={false}
                    tickFormatter={(v) => v.toFixed(2)}
                  />
                  <YAxis
                    yAxisId="acc"
                    orientation="right"
                    stroke="#94A3B8"
                    fontSize={10}
                    domain={[50, 100]}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    yAxisId="loss"
                    type="monotone"
                    dataKey="trainLoss"
                    name="Training Loss"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="loss"
                    type="monotone"
                    dataKey="valLoss"
                    name="Validation Loss"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <Line
                    yAxisId="acc"
                    type="monotone"
                    dataKey="valAccuracy"
                    name="Val Accuracy %"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance Attribution Breakdown */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Feature Importance Attribution (SHAP Values)
                </h3>
                <p className="text-xs text-slate-500">
                  Relative contribution of each mathematical factor for <span className="font-semibold text-slate-800">{ARCHITECTURES.find(a => a.id === config.architecture)?.name}</span>
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                100% Normalized
              </span>
            </div>

            <div className="space-y-3">
              {featureImportances.map((feat) => (
                <div key={feat.feature} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-800 font-semibold">{feat.feature}</span>
                    <span className="font-mono font-bold text-slate-900">{feat.weight}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        feat.category === 'SENTIMENT'
                          ? 'bg-purple-600'
                          : feat.category === 'REGULATORY'
                          ? 'bg-amber-500'
                          : feat.category === 'ORDERFLOW'
                          ? 'bg-emerald-600'
                          : feat.category === 'TECHNICAL'
                          ? 'bg-blue-600'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${feat.weight}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Out-of-Sample Quantitative Inference Lab */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Out-of-Sample Predictive Inference & 7-Day Target Forecast
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live mathematical forecast trajectory with 95% confidence intervals derived from the trained weights
            </p>
          </div>

          {/* Quick Ticker Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {TEST_TICKERS.map((t) => {
              const isInd = isIndianAsset(t);
              const isSelected = activeTestTicker === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setActiveTestTicker(t);
                    onSelectTicker(t);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-sans font-normal opacity-70">
                    {isInd ? '₹' : '$'}
                  </span>
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prediction Summary Header with proper Rupee/Dollar Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-xs block font-medium">Model Direction & Confidence</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold px-2.5 py-0.5 rounded border ${
                  inferenceResult.predictedDirection.includes('BULL')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : inferenceResult.predictedDirection.includes('BEAR')
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {inferenceResult.predictedDirection.replace('_', ' ')}
              </span>
              <span className="font-mono font-bold text-sm text-slate-900">
                {inferenceResult.confidenceScore}% Conf
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-xs block font-medium">
              7-Day Projected Target & Alpha ({isCurrentIndian ? 'NSE/BSE (₹)' : 'US/Global ($)'})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatCurrency(
                  inferenceResult.targetPrice7D,
                  activeTestTicker === 'BTC' ? 0 : 2,
                  activeTestTicker
                )}
              </span>
              <span
                className={`text-xs font-bold font-mono ${
                  inferenceResult.projectedAlphaPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {inferenceResult.projectedAlphaPercent >= 0 ? '+' : ''}
                {formatPercent(inferenceResult.projectedAlphaPercent)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-xs block font-medium">Calibrated Stop-Loss</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-rose-600">
                {formatCurrency(
                  inferenceResult.stopLossRecommended,
                  activeTestTicker === 'BTC' ? 0 : 2,
                  activeTestTicker
                )}
              </span>
              <span className="text-xs text-slate-500">Risk-Adjusted VaR</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Trajectory Chart */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="font-semibold text-slate-800">
              Confidence Interval Trajectory for {activeTestTicker} ({isCurrentIndian ? '₹ INR' : '$ USD'})
            </span>
            <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500/20 rounded inline-block border border-emerald-500" />
                <span>95% Confidence Band</span>
              </span>
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <span className="w-2.5 h-0.5 bg-slate-900 inline-block" />
                <span>Expected Path</span>
              </span>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inferenceResult.trajectoryPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mlConfidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  orientation="right"
                  tickFormatter={(val) => isCurrentIndian ? `₹${val}` : `$${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    formatCurrency(Number(value), activeTestTicker === 'BTC' ? 0 : 2, activeTestTicker),
                    'Price',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  stroke="#10B981"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  fill="url(#mlConfidenceBand)"
                  name="Upper 95% Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="#10B981"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  fill="transparent"
                  name="Lower 95% Bound"
                />
                <Line
                  type="monotone"
                  dataKey="predictedMean"
                  stroke="#0F172A"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0F172A' }}
                  name="Forecast Mean"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Key Drivers Bullet points */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
            Mathematical Drivers & Footnote Audits
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {inferenceResult.keyDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{driver}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
