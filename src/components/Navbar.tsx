import React, { useState } from 'react';
import {
  Layers,
  GitFork,
  FileCheck2,
  PieChart,
  ShieldCheck,
  Search,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
  Lock,
  Brain,
  BookOpen,
} from 'lucide-react';
import { UserFinancialProfile } from '../types';
import { formatCurrency } from '../utils/formatters';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  currentProfile: UserFinancialProfile;
  onSelectProfile: (profile: UserFinancialProfile) => void;
  allProfiles: UserFinancialProfile[];
  onOpenAiChat: () => void;
  agentsOnlineCount: number;
  onSimulateRun?: () => void;
  isSimulating?: boolean;
  isLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenStockSearch?: (ticker?: string) => void;
  onOpenPlainEnglish?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedTicker,
  currentProfile,
  onSelectProfile,
  allProfiles,
  onOpenAiChat,
  isLoggedIn,
  onOpenLoginModal,
  onLogout,
  onOpenStockSearch,
  onOpenPlainEnglish,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 select-none transition-colors">
      {/* Top Banner for Public Mode if not logged in */}
      {!isLoggedIn && (
        <div className="bg-slate-900 text-white px-4 py-1.5 text-center text-xs font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Public Market Intelligence Mode (Live Market Data Connected)
          </span>
          <button
            onClick={onOpenLoginModal}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Log in to customize portfolio risk &rarr;
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-slate-800 transition-all shadow-sm">
              <span className="font-sans font-black text-sm text-emerald-400 tracking-tighter">Æ7</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  AETHER
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  Intelligence
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Navigation Links with Plain English Guide as LAST tab */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Market & AI
          </button>

          <button
            onClick={() => setActiveTab('ml-training')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ml-training'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>ML Studio</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-1 py-0.2 rounded border border-emerald-200">
              95.2%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sec')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'sec'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            SEBI & SEC Filings
          </button>

          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'behavioral'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Sentiment
          </button>

          <button
            onClick={() => setActiveTab('justification')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'justification'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Audit Trail
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {isLoggedIn ? (
              <span>Portfolio</span>
            ) : (
              <>
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Portfolios (6)</span>
              </>
            )}
          </button>

          {/* LAST TAB: Plain English Guide */}
          <button
            onClick={() => setActiveTab('plain-english')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'plain-english'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/60 text-emerald-800 font-semibold'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Explain in Plain English</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Global Stock Search */}
          {onOpenStockSearch && (
            <button
              onClick={() => onOpenStockSearch(selectedTicker)}
              id="nav-stock-search-btn"
              className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search Stock</span>
            </button>
          )}

          {/* Ask AI Arbiter */}
          <button
            onClick={onOpenAiChat}
            id="nav-ai-chat-btn"
            className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer hidden md:flex"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ask Arbiter</span>
          </button>

          {/* Login or User Profile */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                id="nav-profile-selector"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-800 shadow-sm transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentProfile.avatar}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-900 text-xs leading-none">{currentProfile.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {formatCurrency(currentProfile.totalPortfolioValue, 0)}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-slate-800 animate-fade-in"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Active Profile</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      Online
                    </span>
                  </div>

                  <div className="py-2.5 px-2 border-b border-slate-100">
                    <div className="font-bold text-sm text-slate-900">{currentProfile.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{currentProfile.title}</div>
                    <div className="flex items-center justify-between text-xs text-slate-700 font-mono mt-2">
                      <span>Value: {formatCurrency(currentProfile.totalPortfolioValue, 0)}</span>
                      <span className="text-slate-600 text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-sans font-medium">
                        {currentProfile.riskTolerance}
                      </span>
                    </div>
                  </div>

                  {/* Switch Persona */}
                  <div className="py-2 space-y-1 max-h-56 overflow-y-auto">
                    <div className="px-2 pb-1 text-[10px] uppercase font-semibold text-slate-400">
                      Switch Persona (6 Available)
                    </div>
                    {allProfiles.map((p) => {
                      const isSelected = p.id === currentProfile.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProfile(p);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-100 border border-slate-200 text-slate-900 font-medium'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {p.avatar}
                              </span>
                              <span className="font-bold text-xs">{p.name}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              {p.riskTolerance}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Log Out */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              id="nav-login-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 flex items-center gap-1 border-t border-slate-200 overflow-x-auto text-xs font-sans py-1.5 scrollbar-none bg-slate-50/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'overview' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Market</span>
        </button>

        <button
          onClick={() => setActiveTab('ml-training')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'ml-training' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-emerald-600" />
          <span>ML Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('sec')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'sec' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>SEBI & SEC</span>
        </button>

        <button
          onClick={() => setActiveTab('behavioral')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'behavioral' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Sentiment</span>
        </button>

        <button
          onClick={() => setActiveTab('justification')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'justification' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
            activeTab === 'portfolio' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Portfolio</span>
        </button>

        {/* Mobile Last Item: Plain English Guide */}
        <button
          onClick={() => setActiveTab('plain-english')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'plain-english' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-emerald-700 bg-emerald-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Explain in Plain English</span>
        </button>
      </div>
    </header>
  );
};

