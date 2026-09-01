import React from 'react';
import {
  FileText,
  X,
  Sparkles,
  ShieldAlert,
  Database,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { CitationChunk } from '../types';

interface SourceCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: CitationChunk | null;
}

export const SourceCitationModal: React.FC<SourceCitationModalProps> = ({
  isOpen,
  onClose,
  citation,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !citation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${citation.title} (${citation.source})\nChunk: ${citation.chunkId}\nExcerpt: "${citation.fullExcerpt}"`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {citation.chunkId}
                </span>
                <span className="text-xs text-slate-500">
                  Page {citation.pageNumber} • Filed {citation.filingDate}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {citation.title}
              </h3>
              <p className="text-xs text-slate-500">
                {citation.source}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs font-sans">
          {/* Vector RAG Provenance */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono text-[11px]">{citation.vectorDbId || 'qdrant-sec-01'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Match:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {(citation.similarityScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Retrieved Excerpt */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Document Excerpt
            </span>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed text-xs space-y-2.5">
              <div className="p-2.5 bg-amber-50 border-l-2 border-amber-500 rounded-r-lg text-amber-900 font-medium text-xs">
                "{citation.highlightedText}"
              </div>
              <p className="text-slate-700">
                {citation.fullExcerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors font-medium"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Excerpt'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
