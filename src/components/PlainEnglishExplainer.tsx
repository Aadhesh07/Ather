import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileText,
  Activity,
  ShieldCheck,
  Zap,
  Scale,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface PlainEnglishExplainerProps {
  onNavigateTab?: (tab: string) => void;
  onCloseModal?: () => void;
  isModal?: boolean;
}

interface TermItem {
  id: string;
  term: string;
  category: 'Technical' | 'Regulatory' | 'Sentiment' | 'Risk & Portfolio' | 'AI & Swarm';
  shortDefinition: string;
  simpleAnalogy: string;
  realWorldExample: string;
  whyItMattersToYou: string;
  iconName: string;
  color: string;
}

const GLOSSARY_TERMS: TermItem[] = [
  {
    id: 'rsi',
    term: 'RSI (Relative Strength Index)',
    category: 'Technical',
    shortDefinition: 'A score from 0 to 100 measuring whether a stock has moved too fast up or down.',
    simpleAnalogy: 'Think of it as a speedometer in your car. If speed is over 70, you are going too fast and might need to hit the brakes (Overbought). If under 30, you have slowed down a lot and might speed back up (Oversold).',
    realWorldExample: 'If Tata Motors jumps rapidly in 3 days, its RSI goes to 75. The AI warns: "Wait for a slight dip before buying."',
    whyItMattersToYou: 'Prevents you from buying at the absolute peak out of FOMO (Fear of Missing Out).',
    iconName: 'Activity',
    color: 'emerald',
  },
  {
    id: 'macd',
    term: 'MACD (Moving Average Convergence Divergence)',
    category: 'Technical',
    shortDefinition: 'A momentum indicator comparing short-term vs long-term price trends.',
    simpleAnalogy: 'Think of it as a traffic light for price direction. When the green fast line crosses above the red slow line (a "Bullish Crossover"), buyers have taken the steering wheel.',
    realWorldExample: 'When MACD crossed positive on TATAMOTORS.NS at ₹974, it signaled strong buyer interest pushing the stock higher.',
    whyItMattersToYou: 'Helps you catch the start of a healthy upward trend with greater confidence.',
    iconName: 'TrendingUp',
    color: 'blue',
  },
  {
    id: 'sebi-rag',
    term: 'SEBI Filings & Vector RAG Search',
    category: 'Regulatory',
    shortDefinition: 'Government-mandated disclosures analyzed instantly by AI vector search.',
    simpleAnalogy: 'Every listed company must submit official report cards to the market regulator (SEBI in India, SEC in the US). Our AI reads the tiny footnote text so you do not get surprised by hidden debts or pending lawsuits.',
    realWorldExample: 'Our ChromaDB AI searched 150 pages of Tata Motors filings in 12 milliseconds to confirm the NCLT demerger approval and JLR order backlog.',
    whyItMattersToYou: 'Guarantees that your investments are backed by real, audited regulatory truth rather than internet rumors.',
    iconName: 'FileText',
    color: 'purple',
  },
  {
    id: 'sentiment-finbert',
    term: 'Market Sentiment & FinBERT AI',
    category: 'Sentiment',
    shortDefinition: 'AI scanning thousands of news headlines and posts to calculate overall market mood.',
    simpleAnalogy: 'A digital crowd thermometer. It reads news from Economic Times, Moneycontrol, and social media to see if people are calm, optimistic, or panicking.',
    realWorldExample: 'Scanned 24 recent headlines for Reliance Industries and found 76% positive sentiment regarding new green energy factories.',
    whyItMattersToYou: 'Tells you what the general public is feeling so you do not trade blindly against major news sentiment.',
    iconName: 'Brain',
    color: 'amber',
  },
  {
    id: 'dark-pool',
    term: 'Dark Pools & Institutional Order Flow',
    category: 'Technical',
    shortDefinition: 'Private exchanges where giant institutional investors (mutual funds, banks) trade huge blocks.',
    simpleAnalogy: 'A whale tracking radar. Big investment funds trade behind closed doors so their huge orders do not immediately rock the boat. When our AI sees "Bearish Divergence", it means institutions are quietly selling while small traders are buying.',
    realWorldExample: 'Detecting -$140M in dark pool block sales while retail social media was cheering a stock peak.',
    whyItMattersToYou: 'Protects you from being the "exit liquidity" for giant Wall Street or Dalal Street funds.',
    iconName: 'Layers',
    color: 'rose',
  },
  {
    id: 'risk-profile',
    term: 'Conservative vs. Aggressive Risk Profile',
    category: 'Risk & Portfolio',
    shortDefinition: 'Your personal financial shield setting deciding how much safety vs growth you want.',
    simpleAnalogy: 'Shield vs. Sword. Conservative prioritizes protecting your hard-earned money and avoiding drops; Aggressive goes after bigger gains while accepting occasional bumpy price rides.',
    realWorldExample: 'When you flip to Conservative, the system recommends holding extra cash and taking profits on over-concentrated stocks.',
    whyItMattersToYou: 'Ensures every AI recommendation matches your actual comfort level and financial life stage.',
    iconName: 'ShieldCheck',
    color: 'indigo',
  },
  {
    id: 'var-concentration',
    term: 'Portfolio Concentration & Value at Risk (VaR)',
    category: 'Risk & Portfolio',
    shortDefinition: 'A math check to ensure you never put too many eggs into one single basket.',
    simpleAnalogy: 'If one stock makes up 35% of your total money and that company has a bad day, your whole savings take a heavy hit. Our system warns you when one stock gets too big.',
    realWorldExample: 'If Nvidia or Tata Motors grows to 35% of your portfolio, the AI suggests trimming 10-15% into cash buffer.',
    whyItMattersToYou: 'Keeps one bad event from destroying your overall investment portfolio.',
    iconName: 'Scale',
    color: 'teal',
  },
  {
    id: 'arbiter-synthesis',
    term: 'Autonomous Arbiter & Multi-Agent Swarm',
    category: 'AI & Swarm',
    shortDefinition: 'Specialized AI agents that debate price, filings, news, and risk before giving a verdict.',
    simpleAnalogy: 'A roundtable of 4 expert advisors: one charts the price, one reads the legal filings, one reads the news, and one protects your wallet. The Arbiter is the chief judge who weighs all facts before saying BUY, HOLD, or AVOID.',
    realWorldExample: 'If Technical Agent says "Buy" but SEBI Agent finds an unverified debt footnote, the Arbiter reduces the rating to "Hold on dips" for safety.',
    whyItMattersToYou: 'You get a balanced, transparent, multi-angle decision instead of relying on a single simplistic tip.',
    iconName: 'Sparkles',
    color: 'amber',
  },
];

export const PlainEnglishExplainer: React.FC<PlainEnglishExplainerProps> = ({
  onNavigateTab,
  onCloseModal,
  isModal = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTermId, setExpandedTermId] = useState<string>('rsi');

  const categories = ['ALL', 'Technical', 'Regulatory', 'Sentiment', 'Risk & Portfolio', 'AI & Swarm'];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.simpleAnalogy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`space-y-6 ${isModal ? 'p-1' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Plain English Financial Guide</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Complex Financial Terms, Explained Simply
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            No confusing jargon or dense Wall Street speak. Learn how indicators, SEBI filings, vector AI, and risk scores work using everyday analogies.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search any term (e.g. RSI, SEBI, Dark Pool, Risk)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
          const isExpanded = expandedTermId === term.id;
          return (
            <div
              key={term.id}
              onClick={() => setExpandedTermId(isExpanded ? '' : term.id)}
              className={`bg-white border rounded-2xl p-5 transition-all cursor-pointer shadow-sm ${
                isExpanded
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {term.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {term.term}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                </div>
              </div>

              {/* Short Definition */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-3 leading-relaxed">
                {term.shortDefinition}
              </p>

              {/* Analogy Box */}
              <div className="mt-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simple Analogy</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {term.simpleAnalogy}
                </p>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-3 animate-fade-in text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      Real-World Scenario:
                    </span>
                    <p className="text-slate-800 bg-emerald-50/60 border border-emerald-200/60 p-2.5 rounded-lg leading-relaxed">
                      {term.realWorldExample}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      Why it matters to you:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {term.whyItMattersToYou}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Interactive Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-bold text-slate-900">
            Aether 7 Design Promise for Every Investor
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          You never have to guess what an acronym means. Every chart, recommendation, and log entry is backed by transparent step-by-step logic, verified government filings, and clear plain English explanations.
        </p>
      </div>
    </div>
  );
};
