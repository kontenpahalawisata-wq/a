import React from 'react';
import {
  Download,
  Plus,
  Calendar,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from './Sidebar';

interface TopHeaderProps {
  activeView: ActiveView;
  onOpenNewContentModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeView,
  onOpenNewContentModal,
}) => {
  const { activeBrand, brandContents, exportCSV, googleUser } = useApp();

  const viewTitles: Record<ActiveView, string> = {
    dashboard: 'Studio Overview & Pipeline',
    'content-db': 'Content Database Master',
    kanban: 'Produksi Konten',
    calendar: 'Kalender Konten & Sinkronisasi',
    'ai-extractor': 'AI Content Extractor (Gemini)',
    'maul-ai': 'Maul AI Creative Assistant',
    analytics: 'Analitik & Screen Record Inspector',
    team: 'Manajemen Tim & PIC Konten',
  };

  const scheduledCount = brandContents.filter((c) => c.status === 'Scheduled').length;
  const publishedCount = brandContents.filter((c) => c.status === 'Published').length;
  const inProgressCount = brandContents.filter(
    (c) => c.status === 'Scripting' || c.status === 'Take Konten' || c.status === 'Editing'
  ).length;

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md px-6 flex items-center justify-between gap-8 sticky top-0 z-30 select-none">
      {/* Zone 1: Breadcrumbs & Current View Title */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-semibold text-slate-400 truncate hidden sm:inline">
          {activeBrand.name}
        </span>
        <span className="text-slate-400 hidden sm:inline" aria-hidden="true">
          /
        </span>
        <h2 className="text-sm font-semibold text-white truncate">
          {viewTitles[activeView]}
        </h2>

        {/* Quiet status badges */}
        <div className="hidden lg:flex items-center gap-3 pl-3 ml-2 border-l border-slate-800 text-xs text-slate-400">
          <span>
            <strong className="text-slate-200 font-mono tabular-nums">{brandContents.length}</strong> Total
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>
            <strong className="text-amber-400 font-mono tabular-nums">{inProgressCount}</strong> Produksi
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>
            <strong className="text-indigo-400 font-mono tabular-nums">{scheduledCount}</strong> Terjadwal
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span>
            <strong className="text-emerald-400 font-mono tabular-nums">{publishedCount}</strong> Tayang
          </span>
        </div>
      </div>

      {/* Zone 2 & 3: Primary Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {googleUser && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px]">{googleUser.email}</span>
          </div>
        )}

        <button
          type="button"
          onClick={exportCSV}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors"
          title="Ekspor rekap data konten ke format CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Ekspor CSV</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewContentModal}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Konten</span>
        </button>
      </div>
    </header>
  );
};
