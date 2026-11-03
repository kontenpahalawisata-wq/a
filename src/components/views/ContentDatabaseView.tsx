import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Copy,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Video,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ContentItem,
  Platform,
  ProductionStatus,
  MarketingFunnel,
  ApprovalStatus,
} from '../../types/content';

interface ContentDatabaseViewProps {
  onOpenNewContentModal: () => void;
  onEditContent: (item: ContentItem) => void;
}

export const ContentDatabaseView: React.FC<ContentDatabaseViewProps> = ({
  onOpenNewContentModal,
  onEditContent,
}) => {
  const {
    brandContents,
    activeBrand,
    updateContent,
    duplicateContent,
    deleteContent,
    exportCSV,
    googleUser,
    syncContentItemToCalendar,
    showNotification,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedFunnel, setSelectedFunnel] = useState<string>('All');
  const [selectedApproval, setSelectedApproval] = useState<string>('All');

  // Filter logic
  const filteredContents = useMemo(() => {
    return brandContents.filter((item) => {
      // Platform match
      if (selectedPlatform !== 'All') {
        if (selectedPlatform === 'Semua Platform') {
          if (item.platform !== 'Semua Platform') return false;
        } else {
          if (item.platform !== selectedPlatform && item.platform !== 'Semua Platform') return false;
        }
      }
      // Status match
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      // Funnel match
      if (selectedFunnel !== 'All' && item.funnel !== selectedFunnel) return false;
      // Approval match
      if (selectedApproval !== 'All' && item.approvalStatus !== selectedApproval) return false;
      // Search keyword match in title, hook, script, hashtags, or PIC
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = (item.title || '').toLowerCase().includes(query);
        const inHook = (item.hookText || '').toLowerCase().includes(query);
        const inScript = (item.scriptText || '').toLowerCase().includes(query);
        const inPillar = (item.pillar || '').toLowerCase().includes(query);
        const inPic = (item.pic?.name || '').toLowerCase().includes(query);
        const inTags = (item.hashtags || []).some((t) => t.toLowerCase().includes(query));
        if (!inTitle && !inHook && !inScript && !inPillar && !inPic && !inTags) return false;
      }
      return true;
    });
  }, [brandContents, selectedPlatform, selectedStatus, selectedFunnel, selectedApproval, searchQuery]);

  const platformBadgeStyle = (platform: Platform) => {
    switch (platform) {
      case 'Semua Platform':
        return 'text-indigo-300 bg-indigo-950/60 border border-indigo-700/60';
      case 'TikTok':
        return 'text-slate-100 bg-slate-800/90 border border-slate-700';
      case 'Instagram':
        return 'text-pink-300 bg-pink-950/40 border border-pink-800/50';
      case 'YouTube':
        return 'text-rose-300 bg-rose-950/40 border border-rose-800/50';
      case 'Threads':
        return 'text-indigo-300 bg-indigo-950/40 border border-indigo-800/50';
    }
  };

  const statusBadgeStyle = (status: ProductionStatus) => {
    switch (status) {
      case 'Ideation':
        return 'text-sky-300 bg-sky-950/40 border border-sky-800/50';
      case 'Scripting':
        return 'text-violet-300 bg-violet-950/40 border border-violet-800/50';
      case 'Take Konten':
        return 'text-amber-300 bg-amber-950/40 border border-amber-800/50';
      case 'Editing':
        return 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/50';
      case 'Scheduled':
        return 'text-indigo-300 bg-indigo-950/40 border border-indigo-800/50';
      case 'Published':
        return 'text-emerald-300 bg-emerald-950/40 border border-emerald-800/50';
    }
  };

  const approvalBadgeStyle = (approval: ApprovalStatus) => {
    switch (approval) {
      case 'Draft':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      case 'Waiting Review':
        return 'text-amber-400 bg-amber-950/30 border-amber-800/40';
      case 'Approved':
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40';
      case 'Revision':
        return 'text-rose-400 bg-rose-950/30 border-rose-800/40';
      case 'Ready to Shoot':
        return 'text-blue-400 bg-blue-950/30 border-blue-800/40';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Advanced Filters Bar */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci di Judul, Hook 3 detik, Naskah, atau PIC..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Unduh CSV</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewContentModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Konten Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/60 text-xs">
          {/* Platform Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Platform:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              {['All', 'Semua Platform', 'TikTok', 'Instagram', 'YouTube', 'Threads'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedPlatform === p
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'All' ? 'Semua' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="All">Semua Status Produksi</option>
              <option value="Ideation">Ideation</option>
              <option value="Scripting">Scripting</option>
              <option value="Take Konten">Take Konten (Syuting)</option>
              <option value="Editing">Editing</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Funnel Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Funnel:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              {['All', 'TOFU', 'MOFU', 'BOFU'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFunnel(f)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedFunnel === f
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f === 'All' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters button if any filter active */}
          {(selectedPlatform !== 'All' ||
            selectedStatus !== 'All' ||
            selectedFunnel !== 'All' ||
            selectedApproval !== 'All' ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedPlatform('All');
                setSelectedStatus('All');
                setSelectedFunnel('All');
                setSelectedApproval('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-indigo-400 hover:underline ml-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Content Database Table */}
      <div className="bg-[#0F172A] border border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-4 min-w-[280px]">Judul Konten & Hook Visual</th>
                <th className="py-3 px-3 min-w-[130px]">Platform & Format</th>
                <th className="py-3 px-3 min-w-[140px]">Pilar & Funnel</th>
                <th className="py-3 px-3 min-w-[150px]">Status Produksi</th>
                <th className="py-3 px-3 min-w-[130px]">Approval</th>
                <th className="py-3 px-3 min-w-[130px]">Jadwal & PIC</th>
                <th className="py-3 px-4 text-right min-w-[100px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-medium text-slate-300">Tidak ada konten yang sesuai filter</p>
                      <p className="text-[11px] text-slate-400">
                        Coba ubah kata kunci pencarian atau buat materi konten baru untuk brand ini.
                      </p>
                      <button
                        type="button"
                        onClick={onOpenNewContentModal}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Buat Konten Baru
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContents.map((content) => {
                  return (
                    <tr
                      key={content.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      {/* Judul Konten & Hook */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => onEditContent(content)}
                            className="font-semibold text-slate-100 hover:text-indigo-400 text-left transition-colors line-clamp-2 block"
                          >
                            {content.title || content.hookText}
                          </button>
                          {content.hookText && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              <span className="text-amber-400/90 font-medium">Hook:</span>{' '}
                              "{content.hookText}"
                            </p>
                          )}
                          {content.visualAngle && (
                            <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                              <span className="text-slate-400">Angle:</span> {content.visualAngle}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Platform & Format */}
                      <td className="py-3.5 px-3 align-top">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${platformBadgeStyle(
                              content.platform
                            )}`}
                          >
                            {content.platform}
                          </span>
                          <p className="text-[11px] text-slate-400 truncate">{content.format}</p>
                        </div>
                      </td>

                      {/* Pilar & Funnel (Clean unboxed metadata) */}
                      <td className="py-3.5 px-3 align-top">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-200">{content.pillar}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <span
                              className={`font-semibold ${
                                content.funnel === 'TOFU'
                                  ? 'text-sky-400'
                                  : content.funnel === 'MOFU'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {content.funnel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {content.funnel === 'TOFU'
                                ? 'Awareness'
                                : content.funnel === 'MOFU'
                                ? 'Consideration'
                                : 'Conversion'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Produksi (Editable Select right in row!) */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={content.status}
                          onChange={(e) =>
                            updateContent(content.id, {
                              status: e.target.value as ProductionStatus,
                            })
                          }
                          className={`w-full px-2 py-1 rounded text-[11px] font-medium bg-slate-950 border focus:outline-hidden focus:border-indigo-500 cursor-pointer ${statusBadgeStyle(
                            content.status
                          )}`}
                        >
                          <option value="Ideation">Ideation</option>
                          <option value="Scripting">Scripting</option>
                          <option value="Take Konten">Take Konten</option>
                          <option value="Editing">Editing</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Published">Published</option>
                        </select>
                        {content.status === 'Scheduled' && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-400">
                            <Clock className="w-3 h-3" />
                            <span>Siap tayang</span>
                          </div>
                        )}
                      </td>

                      {/* Approval Status (Editable Select) */}
                      <td className="py-3.5 px-3 align-top">
                        <select
                          value={content.approvalStatus}
                          onChange={(e) =>
                            updateContent(content.id, {
                              approvalStatus: e.target.value as ApprovalStatus,
                            })
                          }
                          className={`w-full px-2 py-1 rounded text-[11px] font-medium bg-slate-950 border focus:outline-hidden focus:border-indigo-500 cursor-pointer ${approvalBadgeStyle(
                            content.approvalStatus
                          )}`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Waiting Review">Waiting Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Revision">Revision</option>
                          <option value="Ready to Shoot">Ready to Shoot</option>
                        </select>
                      </td>

                      {/* Jadwal & PIC */}
                      <td className="py-3.5 px-3 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-slate-200 font-mono tabular-nums text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{content.publishDate}</span>
                          </div>
                          {content.platformSchedules && (
                            <div className="flex flex-wrap gap-1 text-[9px] font-mono pt-0.5">
                              {content.platformSchedules.instagram?.date && (
                                <span className="px-1 py-0.2 rounded bg-pink-950/40 text-pink-300 border border-pink-800/40" title={`Instagram: ${content.platformSchedules.instagram.date} ${content.platformSchedules.instagram.time || ''}`}>
                                  IG:{content.platformSchedules.instagram.date.slice(5)}
                                </span>
                              )}
                              {content.platformSchedules.tiktok?.date && (
                                <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700" title={`TikTok: ${content.platformSchedules.tiktok.date} ${content.platformSchedules.tiktok.time || ''}`}>
                                  TT:{content.platformSchedules.tiktok.date.slice(5)}
                                </span>
                              )}
                              {content.platformSchedules.youtubeShorts?.date && (
                                <span className="px-1 py-0.2 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40" title={`Shorts: ${content.platformSchedules.youtubeShorts.date} ${content.platformSchedules.youtubeShorts.time || ''}`}>
                                  SH:{content.platformSchedules.youtubeShorts.date.slice(5)}
                                </span>
                              )}
                              {content.platformSchedules.youtube?.date && (
                                <span className="px-1 py-0.2 rounded bg-red-950/40 text-red-300 border border-red-800/40" title={`YouTube: ${content.platformSchedules.youtube.date} ${content.platformSchedules.youtube.time || ''}`}>
                                  YT:{content.platformSchedules.youtube.date.slice(5)}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-[11px] text-slate-400 truncate">
                            PIC: <span className="text-slate-300 font-medium">{content.pic?.name || 'Unassigned'}</span>
                          </p>
                          {content.googleCalendarEventId && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                              <CheckCircle2 className="w-2.5 h-2.5" /> G-Calendar Sync
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEditContent(content)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit materi konten"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateContent(content.id)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Duplikasi ide konten"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus konten "${content.title}"?`)) {
                                deleteContent(content.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Hapus konten"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Menampilkan <strong className="text-slate-200 font-mono">{filteredContents.length}</strong> dari{' '}
            <strong className="text-slate-200 font-mono">{brandContents.length}</strong> total materi konten {activeBrand.name}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Format: Tabular figures</span>
          </div>
        </div>
      </div>
    </div>
  );
};
