import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentItem } from '../../types/content';

interface CalendarViewProps {
  onOpenNewContentModal: () => void;
  onEditContent: (item: ContentItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNewContentModal,
  onEditContent,
}) => {
  const {
    brandContents,
    activeBrand,
    googleUser,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    isConnectingGoogle,
    syncContentItemToCalendar,
    showNotification,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Default November 2026
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const scheduledContents = brandContents.filter(
    (c) => c.status === 'Scheduled' || c.status === 'Published' || c.publishDate
  );

  const getContentsForDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const result: { item: ContentItem; displayPlatform: string; displayTime?: string }[] = [];

    scheduledContents.forEach((c) => {
      let matchedSpecific = false;
      if (c.platformSchedules?.instagram?.date === dayStr) {
        result.push({ item: c, displayPlatform: 'Instagram', displayTime: c.platformSchedules.instagram.time });
        matchedSpecific = true;
      }
      if (c.platformSchedules?.tiktok?.date === dayStr) {
        result.push({ item: c, displayPlatform: 'TikTok', displayTime: c.platformSchedules.tiktok.time });
        matchedSpecific = true;
      }
      if (c.platformSchedules?.youtubeShorts?.date === dayStr) {
        result.push({ item: c, displayPlatform: 'YT Shorts', displayTime: c.platformSchedules.youtubeShorts.time });
        matchedSpecific = true;
      }
      if (c.platformSchedules?.youtube?.date === dayStr) {
        result.push({ item: c, displayPlatform: 'YouTube', displayTime: c.platformSchedules.youtube.time });
        matchedSpecific = true;
      }
      if (!matchedSpecific && c.publishDate === dayStr) {
        result.push({ item: c, displayPlatform: c.platform, displayTime: c.publishTime });
      }
    });

    return result;
  };

  const handleBulkSync = async () => {
    if (!googleUser) {
      await connectGoogleCalendar();
    }
    const toSync = brandContents.filter((c) => c.status === 'Scheduled');
    if (toSync.length === 0) {
      showNotification('Tidak ada konten berstatus "Scheduled" untuk disinkronkan', 'info');
      setShowBulkConfirmModal(false);
      return;
    }

    setIsBulkSyncing(true);
    let successCount = 0;
    try {
      for (const item of toSync) {
        try {
          await syncContentItemToCalendar(item);
          successCount++;
        } catch (e) {
          console.error(`Failed to sync ${item.title}:`, e);
        }
      }
      showNotification(`${successCount} konten berhasil disinkronkan ke Google Calendar!`);
    } catch (err: any) {
      showNotification(err.message || 'Gagal sinkron massal ke Google Calendar', 'error');
    } finally {
      setIsBulkSyncing(false);
      setShowBulkConfirmModal(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Google Calendar Sync Bar */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Sinkronisasi Google Calendar</h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  googleUser
                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {googleUser ? 'Terhubung' : 'Belum Terhubung'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {googleUser
                ? `Akun aktif: ${googleUser.email} · Jadwal yang di-publish akan langsung muncul di Google Calendar`
                : 'Hubungkan akun Google Anda untuk menyinkronkan jadwal tayang media sosial'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {googleUser ? (
            <>
              <button
                type="button"
                disabled={isBulkSyncing}
                onClick={() => setShowBulkConfirmModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                <span>{isBulkSyncing ? 'Menyinkronkan...' : 'Sinkronkan Semua Jadwal'}</span>
              </button>
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>Buka Kalender</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={disconnectGoogleCalendar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Putuskan koneksi Google Calendar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isConnectingGoogle}
              onClick={connectGoogleCalendar}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>{isConnectingGoogle ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Navigation & Month View */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Month Header Navigation */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h3>
            <button
              type="button"
              onClick={today}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
            >
              Bulan Ini
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/40 text-center text-[11px] font-semibold text-slate-400 py-2">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/60 bg-slate-950/20">
          {/* Leading empty days */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[110px] p-2 bg-slate-950/40 opacity-40" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const contents = getContentsForDay(dayNum);
            const isToday =
              dayNum === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[110px] p-2 transition-colors relative flex flex-col group ${
                  isToday ? 'bg-indigo-950/20' : 'hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-mono font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {dayNum}
                  </span>
                  <button
                    type="button"
                    onClick={onOpenNewContentModal}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-opacity"
                    title={`Tambah konten untuk tanggal ${dayNum} ${monthNames[month]}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Scheduled Contents in this day */}
                <div className="space-y-1 overflow-y-auto flex-1 max-h-[90px]">
                  {contents.map(({ item, displayPlatform, displayTime }, idx) => (
                    <button
                      key={`${item.id}-${displayPlatform}-${idx}`}
                      type="button"
                      onClick={() => onEditContent(item)}
                      className={`w-full text-left p-1.5 rounded text-[10px] font-medium transition-all block border ${
                        item.status === 'Published'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/50'
                          : item.status === 'Scheduled'
                          ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/50 hover:bg-indigo-900/60'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[9px] truncate">{displayPlatform}</span>
                        {displayTime && (
                          <span className="font-mono text-[9px] text-slate-400">{displayTime}</span>
                        )}
                      </div>
                      <p className="truncate mt-0.5">{item.title}</p>
                      {item.googleCalendarEventId && (
                        <div className="flex items-center gap-0.5 text-[8px] text-emerald-400 mt-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> G-Cal
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Sync Confirmation Modal (Required by workspace-integration) */}
      {showBulkConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Konfirmasi Sinkronisasi Jadwal Konten
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Apakah Anda yakin ingin menyinkronkan seluruh materi konten berstatus{' '}
                  <strong className="text-indigo-400">Scheduled</strong> ke akun Google Calendar{' '}
                  <strong className="text-white">({googleUser?.email})</strong>?
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Event jadwal akan dibuat lengkap dengan jam tayang, teks hook, naskah, dan pengingat pop-up otomatis.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isBulkSyncing}
                onClick={() => setShowBulkConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isBulkSyncing}
                onClick={handleBulkSync}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                {isBulkSyncing ? 'Menyinkronkan...' : 'Konfirmasi Sinkronisasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
