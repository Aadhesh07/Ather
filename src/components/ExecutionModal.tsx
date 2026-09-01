import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AutonomousSynthesisResult, UserFinancialProfile } from '../types';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  synthesis: AutonomousSynthesisResult;
  userProfile: UserFinancialProfile;
  onConfirmExecution: () => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  synthesis,
  userProfile,
  onConfirmExecution,
}) => {
  const [isExecuted, setIsExecuted] = useState(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsExecuted(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0F172A', '#10B981', '#64748B'],
    });
    setTimeout(() => {
      onConfirmExecution();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Order Execution
              </h3>
              <p className="text-xs text-slate-500">
                Guardrail-verified rebalance for {userProfile.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isExecuted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Order Executed Successfully
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Trimmed 58 Shares of ${synthesis.ticker} at ~$128.90 ($7,476.20 proceeds).
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 text-left">
              <div>• Cash buffer expanded from 13.0% to 18.2%</div>
              <div>• Position weight lowered to safety target</div>
              <div>• Portfolio downside VaR reduced</div>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-xl text-xs cursor-pointer transition-colors mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">{synthesis.suggestedAction.actionType} Ticket</span>
                <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                  Smart Routed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Asset</span>
                  <span className="font-bold text-slate-900">${synthesis.ticker}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Size</span>
                  <span className="font-semibold text-slate-700">58 Shares</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Price</span>
                  <span className="font-semibold text-slate-700 font-mono">$128.90</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Proceeds</span>
                  <span className="font-bold text-emerald-700 font-mono">$7,476.20</span>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold text-[10px] uppercase block mb-1">Pre-Trade</span>
                <div className="text-slate-700">{synthesis.ticker}: <strong className="text-rose-600">34.8%</strong></div>
                <div className="text-slate-700">Cash: $18,500 (13.0%)</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-semibold text-[10px] uppercase block mb-1">Post-Trade</span>
                <div className="text-slate-700">{synthesis.ticker}: <strong className="text-emerald-600">29.5%</strong></div>
                <div className="text-slate-700">Cash: $25,976 (18.2%)</div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer transition-colors text-xs shadow-sm"
              >
                Execute ($7,476.20)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
