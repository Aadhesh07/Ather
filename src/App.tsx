import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { FlowingTickerTape } from './components/FlowingTickerTape';
import { HeroSection } from './components/HeroSection';
import { AgentSwarmVisualizer } from './components/AgentSwarmVisualizer';
import { MarketChart } from './components/MarketChart';
import { AgentReasoningPanel } from './components/AgentReasoningPanel';
import { ExplainableJustificationTrail } from './components/ExplainableJustificationTrail';
import { SecFilingsIntelligence } from './components/SecFilingsIntelligence';
import { BehavioralSentimentView } from './components/BehavioralSentimentView';
import { PersonalizedPortfolioView } from './components/PersonalizedPortfolioView';
import { MlTrainingStudio } from './components/MlTrainingStudio';
import { InteractiveAgentChat } from './components/InteractiveAgentChat';
import { ExecutionModal } from './components/ExecutionModal';
import { DegradedDataBanner } from './components/DegradedDataBanner';
import { SourceCitationModal } from './components/SourceCitationModal';
import { LoginModal } from './components/LoginModal';
import { StockDetailModal } from './components/StockDetailModal';
import { PlainEnglishExplainer } from './components/PlainEnglishExplainer';
import {
  INITIAL_AGENTS,
  MOCK_USER_PROFILES,
  MOCK_CHART_DATA,
  MOCK_SYNTHESIS_RESULTS,
  INITIAL_AGENT_LOGS,
  MOCK_CITATIONS,
} from './data/mockFinancialData';
import {
  AgentId,
  UserFinancialProfile,
  RiskProfile,
  CitationChunk,
  AgentLogsCollection,
  MLModelMetrics,
} from './types';
import { DEFAULT_MODEL_METRICS } from './utils/mlEngine';
import { useDegradedDataStatus, useMarketData } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
  const [currentProfile, setCurrentProfile] = useState<UserFinancialProfile>(MOCK_USER_PROFILES[0]);
  const [activeRiskProfile, setActiveRiskProfile] = useState<RiskProfile>(currentProfile.riskTolerance);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>('agent-orchestrator');
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState<boolean>(false);
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Stock Detail & Deep Dive Modal State
  const [isStockDetailOpen, setIsStockDetailOpen] = useState<boolean>(false);
  const [stockDetailTicker, setStockDetailTicker] = useState<string>('NVDA');

  // Citation Modal state
  const [selectedCitation, setSelectedCitation] = useState<CitationChunk | null>(null);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);

  // Real-time Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  // Degraded Data Status Hook
  const { isDegraded, toggleDegradedStatus } = useDegradedDataStatus();

  // Agent Logs State
  const [agentLogs, setAgentLogs] = useState<AgentLogsCollection>(
    INITIAL_AGENT_LOGS[selectedTicker] || INITIAL_AGENT_LOGS.NVDA
  );

  // Machine Learning Model Metrics State
  const [trainedMetrics, setTrainedMetrics] = useState<MLModelMetrics>(DEFAULT_MODEL_METRICS);

  // Active chart data
  const rawChartData = MOCK_CHART_DATA[selectedTicker] || MOCK_CHART_DATA.NVDA;
  const { marketData } = useMarketData(selectedTicker, rawChartData);

  // Active synthesis result (fallback to NVDA)
  const baseSynthesis =
    MOCK_SYNTHESIS_RESULTS[selectedTicker] || MOCK_SYNTHESIS_RESULTS.NVDA;

  // Calibrate current synthesis with trained ML accuracy score
  const currentSynthesis = {
    ...baseSynthesis,
    overallConfidence: Math.min(
      98,
      Math.round((baseSynthesis.overallConfidence * 0.5) + (trainedMetrics.accuracy * 0.5))
    ),
  };

  // Sync risk profile when profile changes
  useEffect(() => {
    setActiveRiskProfile(currentProfile.riskTolerance);
  }, [currentProfile]);

  // Simulate market telemetry updates
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          latencyMs: Math.floor(12 + Math.random() * 24),
        }))
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTickerChange = (newTicker: string) => {
    setSelectedTicker(newTicker);
    setAgentLogs(INITIAL_AGENT_LOGS[newTicker] || INITIAL_AGENT_LOGS.NVDA);
  };

  const handleOpenStockDetail = (ticker?: string) => {
    if (ticker) {
      setStockDetailTicker(ticker);
    }
    setIsStockDetailOpen(true);
  };

  // Open Citation Modal
  const handleOpenCitation = (citationId: string) => {
    const citation = MOCK_CITATIONS[citationId];
    if (citation) {
      setSelectedCitation(citation as unknown as CitationChunk);
      setIsCitationModalOpen(true);
    }
  };

  // Step-by-Step Simulation
  const handleTriggerSimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimulationStep(1);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    setTimeout(() => {
      setSimulationStep(2);
      setAgentLogs((prev) => ({
        ...prev,
        technical: [
          {
            id: `t-sim-${Date.now()}`,
            timestamp: timeStr,
            level: 'SUCCESS',
            text: 'Live Calculation Complete: 14-day RSI (68.4) & MACD Crossover (+0.65)',
            detail: 'Volume Delta validated with 142k block ask wall absorption at $130.00.',
            statusIndicator: 'green',
            codeSnippet: 'macd_cross = detect_cross(macd, signal) # True (+0.65)',
          },
          ...prev.technical.slice(0, 3),
        ],
      }));
    }, 800);

    setTimeout(() => {
      setSimulationStep(3);
      setAgentLogs((prev) => ({
        ...prev,
        fundamental: [
          {
            id: `f-sim-${Date.now()}`,
            timestamp: timeStr,
            level: 'WARNING',
            text: 'Querying Vector DB... Retrieved SEC Q3 Chunk #4 (Cosine 0.942)',
            detail: 'Flagged Debt Liability Warning: Contingent liquidity requirement noted.',
            statusIndicator: 'red',
            citationId: 'sebi-q3-chunk-4',
          },
          ...prev.fundamental.slice(0, 3),
        ],
      }));
    }, 1600);

    setTimeout(() => {
      setSimulationStep(4);
      setAgentLogs((prev) => ({
        ...prev,
        sentiment: [
          {
            id: `s-sim-${Date.now()}`,
            timestamp: timeStr,
            level: 'ERROR',
            text: 'Sentiment: +0.12 (Neutral) | Dark Pool Net Outflow: -$140.2M',
            detail: 'Confirmed Bearish Divergence between Retail FOMO (82/100) and Institutional Selling.',
            statusIndicator: 'yellow',
            citationId: 'finra-darkpool',
          },
          ...prev.sentiment.slice(0, 3),
        ],
      }));
    }, 2400);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep(0);
    }, 3000);
  };

  const handleConfirmRebalance = () => {
    setCurrentProfile((prev) => {
      const updatedHoldings = prev.holdings.map((h) => {
        if (h.ticker === selectedTicker) {
          const newShares = Math.max(0, h.shares - 58);
          const newValue = newShares * h.currentPrice;
          return {
            ...h,
            shares: newShares,
            currentValue: newValue,
            portfolioWeight: 29.5,
          };
        }
        return h;
      });

      return {
        ...prev,
        cashReserve: prev.cashReserve + 7476.2,
        cashReservePercent: 18.2,
        holdings: updatedHoldings,
      };
    });
    setIsExecutionModalOpen(false);
  };

  const handleLogin = (profile: UserFinancialProfile) => {
    setCurrentProfile(profile);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTicker={selectedTicker}
        setSelectedTicker={handleTickerChange}
        currentProfile={currentProfile}
        onSelectProfile={setCurrentProfile}
        allProfiles={MOCK_USER_PROFILES}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        agentsOnlineCount={5}
        onSimulateRun={handleTriggerSimulation}
        isSimulating={isSimulating}
        isLoggedIn={isLoggedIn}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenStockSearch={handleOpenStockDetail}
        onOpenPlainEnglish={() => setActiveTab('plain-english')}
      />

      {/* Flowing Ambient Real-time Ticker Tape */}
      <FlowingTickerTape
        selectedTicker={selectedTicker}
        onSelectTicker={handleTickerChange}
        onOpenStockSearch={handleOpenStockDetail}
      />

      {/* Degraded Data Warning Banner */}
      <DegradedDataBanner
        isDegraded={isDegraded}
        onToggleDegraded={toggleDegradedStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* VIEW 1: Overview & Swarm Coordination */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <HeroSection
              selectedTicker={selectedTicker}
              onSelectTicker={handleTickerChange}
              onNavigateTab={setActiveTab}
              onSimulateRun={handleTriggerSimulation}
              isSimulating={isSimulating}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              totalPortfolioValue={currentProfile.totalPortfolioValue}
              onOpenStockSearch={handleOpenStockDetail}
            />

            <AgentSwarmVisualizer
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={(id) => setSelectedAgentId(id)}
              selectedTicker={selectedTicker}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Split Screen: Live Chart + Reasoning & Consensus */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MarketChart
                  ticker={selectedTicker}
                  chartData={marketData}
                />
              </div>

              <div className="lg:col-span-5">
                <AgentReasoningPanel
                  synthesis={currentSynthesis}
                  userProfile={currentProfile}
                  activeRiskProfile={activeRiskProfile}
                  onChangeRiskProfile={(risk) => setActiveRiskProfile(risk)}
                  onOpenExecutionModal={() => setIsExecutionModalOpen(true)}
                  onViewJustification={() => setActiveTab('justification')}
                  onOpenAiConsult={() => setIsAiChatOpen(true)}
                  onOpenCitation={handleOpenCitation}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  agentLogs={agentLogs}
                  isSimulating={isSimulating}
                  simulationStep={simulationStep}
                  onTriggerSimulation={handleTriggerSimulation}
                  isLoggedIn={isLoggedIn}
                  onOpenLoginModal={() => setIsLoginModalOpen(true)}
                />
              </div>
            </div>

            {/* Quick Preview of Transparent Justification Trail */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Autonomous Reasoning Trail (5 Steps)
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('justification')}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Full Trail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                {currentSynthesis.justificationSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveTab('justification')}
                    className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700 font-mono">0{step.stepNumber}</span>
                      <span className="font-mono">{step.confidence}%</span>
                    </div>
                    <div className="font-bold text-slate-900 truncate text-xs">{step.title}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{step.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Plain English Financial Guide (Common Man Mode) */}
        {activeTab === 'plain-english' && (
          <PlainEnglishExplainer
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* VIEW 2: ML Model Training & Accuracy Studio */}
        {activeTab === 'ml-training' && (
          <MlTrainingStudio
            selectedTicker={selectedTicker}
            onSelectTicker={handleTickerChange}
            onApplyTrainedModel={(newMetrics) => setTrainedMetrics(newMetrics)}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* VIEW 2: Portfolio */}
        {activeTab === 'portfolio' && (
          <PersonalizedPortfolioView
            userProfile={currentProfile}
            onSelectTicker={handleTickerChange}
            onOpenExecutionModal={() => setIsExecutionModalOpen(true)}
            onBackToOverview={() => setActiveTab('overview')}
            isLoggedIn={isLoggedIn}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            allProfiles={MOCK_USER_PROFILES}
            onSelectProfile={(p) => {
              setCurrentProfile(p);
              setIsLoggedIn(true);
            }}
          />
        )}

        {/* VIEW 3: Justification */}
        {activeTab === 'justification' && (
          <ExplainableJustificationTrail
            synthesis={currentSynthesis}
            selectedTicker={selectedTicker}
            onOpenAiConsult={() => setIsAiChatOpen(true)}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* VIEW 4: SEC Filings */}
        {activeTab === 'sec' && (
          <SecFilingsIntelligence
            selectedTicker={selectedTicker}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* VIEW 5: Behavioral Sentiment */}
        {activeTab === 'behavioral' && (
          <BehavioralSentimentView
            selectedTicker={selectedTicker}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}
      </main>

      {/* Clean Light Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-3 text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold">AETHER Financial Intelligence</span>
            <span>•</span>
            <span>Autonomous Multi-Agent Consensus</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Active
            </span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentProfile={currentProfile}
      />

      {/* Source Citation Modal */}
      <SourceCitationModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        citation={selectedCitation}
      />

      {/* AI Arbiter Chat Modal */}
      <InteractiveAgentChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        selectedTicker={selectedTicker}
        currentProfile={currentProfile}
      />

      {/* Stock Detail Modal */}
      <StockDetailModal
        isOpen={isStockDetailOpen}
        onClose={() => setIsStockDetailOpen(false)}
        initialTicker={stockDetailTicker}
        onSelectTickerForDashboard={(t) => {
          handleTickerChange(t);
          setIsStockDetailOpen(false);
        }}
        onOpenAiConsult={() => {
          setIsStockDetailOpen(false);
          setIsAiChatOpen(true);
        }}
      />

      {/* Order Execution Modal */}
      <ExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        synthesis={currentSynthesis}
        userProfile={currentProfile}
        onConfirmExecution={handleConfirmRebalance}
      />
    </div>
  );
}
