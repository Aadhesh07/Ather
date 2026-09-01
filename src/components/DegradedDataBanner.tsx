import React from 'react';
import { AlertTriangle, Database, RefreshCw, X } from 'lucide-react';

interface DegradedDataBannerProps {
  isDegraded: boolean;
  onToggleDegraded: () => void;
  onDismiss?: () => void;
}

export const DegradedDataBanner: React.FC<DegradedDataBannerProps> = ({
  isDegraded,
  onToggleDegraded,
  onDismiss,
}) => {
  if (!isDegraded) {
    return (
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs flex items-center justify-between gap-3 text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 font-semibold">Live Market & SEC Feed:</span>
          <span className="text-emerald-700 font-medium">Connected</span>
        </div>
        <button
          onClick={onToggleDegraded}
          className="text-slate-400 hover:text-slate-600 underline text-[11px] cursor-pointer"
        >
          Simulate Interruption
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-sans text-amber-900 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-semibold">
          Live feed unavailable — using cached vector snapshot.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDegraded}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Restore Feed</span>
        </button>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-amber-600 hover:text-amber-900 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
