import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { UserFinancialProfile } from '../types';
import { MOCK_USER_PROFILES } from '../data/mockFinancialData';
import { formatCurrency } from '../utils/formatters';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserFinancialProfile) => void;
  currentProfile: UserFinancialProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'credentials'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const customProfile: UserFinancialProfile = {
        ...currentProfile,
        name: email ? email.split('@')[0].replace(/[\._]/g, ' ') : 'Alex Vance',
        title: 'Custom Investor Profile',
      };
      onLogin(customProfile);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleSelectDemoUser = (profile: UserFinancialProfile) => {
    onLogin(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sign In to AETHER
              </h3>
              <p className="text-xs text-slate-500">
                Choose a pre-configured profile or sign in
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-50 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('demo')}
            className={`py-2 text-center rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Investor Profiles ({MOCK_USER_PROFILES.length})
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-2 text-center rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Email Login
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {activeTab === 'demo' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOCK_USER_PROFILES.map((profile) => {
                const isSelected = profile.id === currentProfile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectDemoUser(profile)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-50 border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                            {profile.avatar}
                          </div>
                          <span className="font-bold text-xs text-slate-900">
                            {profile.name}
                          </span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                          {profile.riskTolerance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{profile.title}</p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-900 font-bold">
                        {formatCurrency(profile.totalPortfolioValue, 0)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {profile.holdings.length} Assets
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-3 text-xs max-w-sm mx-auto py-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@aether.ai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
