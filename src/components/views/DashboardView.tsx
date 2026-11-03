import React from 'react';
import {
  Layers,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types/content';
import { ActiveView } from '../Sidebar';

interface DashboardViewProps {
  setActiveView: (view: ActiveView) => void;
  onOpenNewContentModal: () => void;
  onEditContent: (item: ContentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveView,
  onOpenNewContentModal,
  onEditContent,
}) => {
  const { brandContents, activeBrand, googleUser, connectGoogleCalendar } = useApp();

  const totalContents = brandContents.length;
  const ideationCount = brandContents.filter((c) => c.status === 'Ideation').length;
  const inProgressCount = brandContents.filter(
    (c) => c.status === 'Scripting' || c.status === 'Take Konten' || c.status === 'Editing'
  ).length;
  const scheduledCount = brandContents.filter((c) => c.status === 'Scheduled').length;
  const publishedCount = brandContents.filter((c) => c.status === 'Published').length;

  // Aggregate metrics
  const totalViews = brandContents.reduce((sum, c) => sum + (c.metrics?.views || 0), 0);
  const totalLikes = brandContents.reduce((sum, c) => sum + (c.metrics?.likes || 0), 0);
  const totalSaves = brandContents.reduce((sum, c) => sum + (c.metrics?.saves || 0), 0);
  const totalShares = brandContents.reduce((sum, c) => sum + (c.metrics?.shares || 0), 0);

  // Funnel counts
  const tofuCount = brandContents.filter((c) => c.funnel === 'TOFU').length;
  const mofuCount = brandContents.filter((c) => c.funnel === 'MOFU').length;
  const bofuCount = brandContents.filter((c) => c.funnel === 'BOFU').length;

  const tofuPct = totalContents > 0 ? Math.round((tofuCount / totalContents) * 100) : 0;
  const mofuPct = totalContents > 0 ? Math.round((mofuCount / totalContents) * 100) : 0;
  const bofuPct = totalContents > 0 ? Math.round((bofuCount / totalContents) * 100) : 0;

  // Upcoming scheduled contents
  const upcomingContents = brandContents
    .filter((c) => c.status === 'Scheduled' || c.status === 'Editing' || c.status === 'Take Konten')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
            Brand Workspace
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">{activeBrand.name}</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {activeBrand.niche} · Akun {activeBrand.handle} · Single source of truth untuk perencanaan dan status produksi materi konten.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveView('ai-extractor')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Ekstrak Ide Link</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewContentModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <span>+ Buat Konten</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Database Konten</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{totalContents}</div>
          <p className="text-[11px] text-slate-400">
            <span className="text-sky-400 font-medium">{ideationCount} Ide</span> baru di backlog
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dalam Produksi</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{inProgressCount}</div>
          <p className="text-[11px] text-slate-400">Tahap Scripting, Syuting & Edit</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Terjadwal (Ready)</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">{scheduledCount}</div>
          <p className="text-[11px] text-slate-400">
            {googleUser ? 'Tersambung Google Calendar' : 'Belum sync Google'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sudah Tayang</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{publishedCount}</div>
          <p className="text-[11px] text-slate-400">
            {totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}k Tayangan total` : 'Tracking aktif'}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Marketing Funnel & Production Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Marketing Funnel Distribution (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Struktur Funnel Marketing</h3>
                <p className="text-xs text-slate-400">Distribusi strategi konten berdasarkan pilar pemasaran</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('content-db')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                Lihat di Database <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Funnel Visual Bars */}
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">TOFU (Top of Funnel) — Kesadaran / Awareness</span>
                  <span className="font-mono tabular-nums text-sky-400 font-semibold">
                    {tofuCount} Konten ({tofuPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${tofuPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fokus jangkauan luas, edukasi umum, & relatable hooks</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">MOFU (Middle of Funnel) — Pertimbangan / Consideration</span>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {mofuCount} Konten ({mofuPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${mofuPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fokus membangun kepercayaan, komparasi nilai, & studi kasus</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">BOFU (Bottom of Funnel) — Konversi / Conversion</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                    {bofuCount} Konten ({bofuPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${bofuPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fokus penawaran langsung, promo kuota, & call-to-action tegas</p>
              </div>
            </div>
          </div>

          {/* Quick AI Generator Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/40 border border-violet-800/40 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Butuh Ide Viral Cepat? Gunakan Maul AI</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Generate hook psikologis, naskah lengkap, arahan visual angle kamera, caption, dan 5 hashtag relevan dalam hitungan detik.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('maul-ai')}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium whitespace-nowrap transition-colors"
            >
              Buka Maul AI
            </button>
          </div>
        </div>

        {/* Right Column: Upcoming Schedule & Action Items */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Antrean Eksekusi Terdekat</h3>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className="text-xs text-indigo-400 hover:underline"
              >
                Kalender
              </button>
            </div>

            <div className="space-y-3">
              {upcomingContents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Belum ada jadwal tayang aktif. Tambahkan jadwal di kalender konten.
                </p>
              ) : (
                upcomingContents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onEditContent(item)}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-indigo-400">{item.platform}</span>
                      <span className="font-mono text-slate-400">{item.publishDate}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-1">{item.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>PIC: {item.pic?.name || 'Unassigned'}</span>
                      <span className="text-amber-400 font-medium">{item.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!googleUser && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-300 font-medium">Sinkronkan Jadwal ke Google Calendar?</p>
                <p className="text-[11px] text-slate-400">
                  Hubungkan akun Google agar seluruh jadwal tayang otomatis muncul di kalender HP/laptop Anda.
                </p>
                <button
                  type="button"
                  onClick={connectGoogleCalendar}
                  className="w-full py-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                >
                  Hubungkan Google Calendar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
