export type AgentId = 'agent-market' | 'agent-sec' | 'agent-sentiment' | 'agent-portfolio' | 'agent-orchestrator';

export type RecommendationType = 'STRONG_BUY' | 'BUY_DIP' | 'HOLD_ACCUMULATE' | 'TRIM_POSITION' | 'TAKE_PROFIT' | 'HEDGE_RISK' | 'STRONG_SELL';

export type RiskProfile = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'WEALTH_BUILDER';

export interface AgentStatus {
  id: AgentId;
  name: string;
  codename: string;
  role: string;
  status: 'IDLE' | 'ANALYZING' | 'SYNTHESIZING' | 'ALERT';
  iconName: string;
  color: string;
  borderColor: string;
  glowClass: string;
  latencyMs: number;
  confidenceScore: number; // 0 - 100
  lastSignal: string;
  signalDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  activeFactsCount: number;
}

export interface MarketDataPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20: number;
  ema50: number;
  rsi: number;
  agentEvent?: {
    agentId: AgentId;
    title: string;
    type: 'BULL' | 'BEAR' | 'INFO';
  };
}

export interface SecFiling {
  id: string;
  ticker: string;
  formType: '10-K' | '10-Q' | '8-K' | 'FORM-4' | '13-F';
  filedDate: string;
  title: string;
  summary: string;
  extractedRiskScore: number; // 1-100
  sentiment: 'NEGATIVE' | 'POSITIVE' | 'NEUTRAL';
  highlightedQuotes: string[];
  keyDisclosures: {
    category: 'Litigation' | 'Insider Sales' | 'Revenue Restatement' | 'Executive Departure' | 'Patent Grant' | 'Supply Chain';
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  sourceUrl: string;
}

export interface BehavioralSignal {
  id: string;
  ticker: string;
  timestamp: string;
  retailVolumeRatio: number; // % of total volume
  darkPoolAccumulationIndex: number; // 0 - 100
  socialMentions24hChange: number; // % change
  socialSentimentScore: number; // 0 - 100 (50 is neutral)
  fearGreedIndex: number; // 0 - 100
  fomoRiskScore: number; // 0 - 100
  dominantNarrative: string;
  crowdVsInstitutionsDivergence: 'BULLISH_DIVERGENCE' | 'BEARISH_DIVERGENCE' | 'ALIGNED_GREED' | 'ALIGNED_PANIC';
}

export interface PortfolioHolding {
  ticker: string;
  companyName: string;
  shares: number;
  avgEntryPrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  portfolioWeight: number; // %
  targetAllocation: number; // %
  sector: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UserFinancialProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  totalPortfolioValue: number;
  cashReserve: number;
  cashReservePercent: number;
  riskTolerance: RiskProfile;
  timeHorizonYears: number;
  monthlySavingsDeposit: number;
  concentrationLimitPercent: number;
  holdings: PortfolioHolding[];
  recentActivity: {
    id: string;
    date: string;
    type: 'BUY' | 'SELL' | 'REBALANCE' | 'DIVIDEND';
    ticker: string;
    amount: number;
    shares: number;
    price: number;
  }[];
}

export interface JustificationStep {
  stepNumber: number;
  agentId: AgentId;
  agentName: string;
  title: string;
  observation: string;
  reasoning: string;
  evidence: {
    type: 'MARKET_TICK' | 'SEC_CITATION' | 'BEHAVIORAL_METRIC' | 'PORTFOLIO_MATH';
    source: string;
    dataPoint: string;
  }[];
  confidence: number;
  conflictResolved?: string;
}

export interface AutonomousSynthesisResult {
  ticker: string;
  timestamp: string;
  recommendation: RecommendationType;
  overallConfidence: number; // 0 - 100
  executiveSummary: string;
  personalizedReasoning: string;
  riskRewardRatio: string;
  suggestedAction: {
    actionType: 'TRIM' | 'BUY' | 'HEDGE' | 'HOLD';
    recommendedSize: string;
    suggestedStopLoss: number;
    suggestedTarget: number;
    urgency: 'IMMEDIATE' | 'NEXT_TRADING_DAY' | 'MONITOR_ONLY';
  };
  conflictResolutionMatrix: {
    conflictingAgents: [string, string];
    conflictDescription: string;
    arbiterResolution: string;
    weightedFactor: string;
  }[];
  justificationSteps: JustificationStep[];
  agentConsensus: {
    marketAlpha: { score: number; verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; signal: string };
    regulatorySec: { score: number; verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; signal: string };
    behavioralCrowd: { score: number; verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; signal: string };
    portfolioRisk: { score: number; verdict: 'OPTIMAL' | 'OVEREXPOSED' | 'UNDEREXPOSED'; signal: string };
  };
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  text: string;
  detail?: string;
  statusIndicator: 'green' | 'yellow' | 'red' | 'blue';
  codeSnippet?: string;
  citationId?: string;
}

export interface AgentLogsCollection {
  technical: AgentLogEntry[];
  fundamental: AgentLogEntry[];
  sentiment: AgentLogEntry[];
}

export interface CitationChunk {
  id: string;
  title: string;
  documentType: string;
  source: string;
  chunkId: string;
  pageNumber: number;
  filingDate: string;
  similarityScore: number;
  highlightedText: string;
  fullExcerpt: string;
  context: string;
  flaggedCategory?: string;
  riskSeverity?: 'HIGH' | 'MEDIUM' | 'LOW';
  vectorDbId?: string;
}

export interface StressScenario {
  id: string;
  name: string;
  category: 'MACRO' | 'TECH_EARNINGS' | 'REGULATORY_CRACKDOWN' | 'LIQUIDITY_CRUNCH';
  description: string;
  marketImpact: {
    sp500Drop: number;
    techDrop: number;
    volatilitySpike: number;
    tenYearYieldChange: number;
  };
  projectedPortfolioImpact: {
    dollarLoss: number;
    percentageLoss: number;
    vulnerableAssets: string[];
    resilientAssets: string[];
    suggestedCountermeasure: string;
  };
}

export type MLModelArchitecture =
  | 'MULTI_MODAL_ENSEMBLE'
  | 'TEMPORAL_LSTM'
  | 'GRADIENT_BOOST_XGBOOST'
  | 'FINBERT_NLP_REGULATORY'
  | 'CONVEX_MPT_OPTIMIZER';

export interface MLTrainingConfig {
  architecture: MLModelArchitecture;
  epochs: number;
  learningRate: number;
  lookbackDays: number;
  batchSize: number;
  regularizationL2: number;
  featureFlags: {
    orderFlowDelta: boolean;
    technicalMomentum: boolean;
    secFootnoteEmbeddings: boolean;
    darkPoolDivergence: boolean;
    macroYieldCurve: boolean;
  };
}

export interface MLEpochProgress {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  valAccuracy: number;
  f1Score: number;
}

export interface MLModelMetrics {
  accuracy: number; // e.g. 94.7%
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalBacktestTrades: number;
  lastTrainedDate: string;
  status: 'TRAINED_ACCURATE' | 'UNTRAINED' | 'TRAINING';
}

export interface MLFeatureImportance {
  feature: string;
  category: 'ORDERFLOW' | 'REGULATORY' | 'SENTIMENT' | 'TECHNICAL' | 'MACRO';
  weight: number; // 0 - 100%
  description: string;
}

export interface MLInferenceResult {
  ticker: string;
  predictedDirection: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  confidenceScore: number; // 0 - 100%
  targetPrice7D: number;
  lowerConfidenceBound: number;
  upperConfidenceBound: number;
  stopLossRecommended: number;
  projectedAlphaPercent: number;
  keyDrivers: string[];
  trajectoryPoints: {
    day: string;
    historical?: number;
    predictedMean: number;
    upperBand: number;
    lowerBand: number;
  }[];
}
