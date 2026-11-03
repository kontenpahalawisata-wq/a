import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ContentItem,
  Platform,
  ContentFormat,
  MarketingFunnel,
  ProductionStatus,
  ApprovalStatus,
} from '../types/content';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToEdit?: ContentItem | null;
}

export const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  contentToEdit,
}) => {
  const {
    activeBrand,
    addContent,
    updateContent,
    deleteContent,
    team,
    googleUser,
    syncContentItemToCalendar,
    showNotification,
  } = useApp();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [format, setFormat] = useState<ContentFormat>('Short Video');
  const [pillar, setPillar] = useState('Edukasi');
  const [funnel, setFunnel] = useState<MarketingFunnel>('TOFU');
  const [status, setStatus] = useState<ProductionStatus>('Ideation');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Draft');
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [publishTime, setPublishTime] = useState('19:00');
  const [hookText, setHookText] = useState('');
  const [visualAngle, setVisualAngle] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [picEmail, setPicEmail] = useState('');

  // Jadwal posting terpisah tiap platform (Instagram, TikTok, YouTube Shorts, YouTube)
  const [instagramDate, setInstagramDate] = useState(new Date().toISOString().split('T')[0]);
  const [instagramTime, setInstagramTime] = useState('12:00');
  const [tiktokDate, setTiktokDate] = useState(new Date().toISOString().split('T')[0]);
  const [tiktokTime, setTiktokTime] = useState('19:30');
  const [shortsDate, setShortsDate] = useState(new Date().toISOString().split('T')[0]);
  const [shortsTime, setShortsTime] = useState('18:00');
  const [youtubeDate, setYoutubeDate] = useState(new Date().toISOString().split('T')[0]);
  const [youtubeTime, setYoutubeTime] = useState('16:00');

  // Confirmation modal state for Google Calendar sync
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (contentToEdit) {
      setTitle(contentToEdit.title || '');
      setPlatform(contentToEdit.platform);
      setFormat(contentToEdit.format);
      setPillar(contentToEdit.pillar);
      setFunnel(contentToEdit.funnel);
      setStatus(contentToEdit.status);
      setApprovalStatus(contentToEdit.approvalStatus);
      setPublishDate(contentToEdit.publishDate);
      setPublishTime(contentToEdit.publishTime || '19:00');
      setHookText(contentToEdit.hookText);
      setVisualAngle(contentToEdit.visualAngle || '');
      setScriptText(contentToEdit.scriptText || '');
      setCaption(contentToEdit.caption || '');
      setHashtagsStr((contentToEdit.hashtags || []).join(', '));
      setPicEmail(contentToEdit.pic?.email || (team[0]?.email ?? ''));

      // Pre-fill platform schedules
      setInstagramDate(contentToEdit.platformSchedules?.instagram?.date || contentToEdit.publishDate);
      setInstagramTime(contentToEdit.platformSchedules?.instagram?.time || '12:00');
      setTiktokDate(contentToEdit.platformSchedules?.tiktok?.date || contentToEdit.publishDate);
      setTiktokTime(contentToEdit.platformSchedules?.tiktok?.time || '19:30');
      setShortsDate(contentToEdit.platformSchedules?.youtubeShorts?.date || contentToEdit.publishDate);
      setShortsTime(contentToEdit.platformSchedules?.youtubeShorts?.time || '18:00');
      setYoutubeDate(contentToEdit.platformSchedules?.youtube?.date || contentToEdit.publishDate);
      setYoutubeTime(contentToEdit.platformSchedules?.youtube?.time || '16:00');
    } else {
      // Defaults for new item
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setPlatform('TikTok');
      setFormat('Short Video');
      setPillar('Edukasi');
      setFunnel('TOFU');
      setStatus('Ideation');
      setApprovalStatus('Draft');
      setPublishDate(today);
      setPublishTime('19:00');
      setHookText('');
      setVisualAngle('');
      setScriptText('');
      setCaption('');
      setHashtagsStr('#pahalawisata, #traveltips, #foryou, #liburan, #viral2026');
      setPicEmail(team[0]?.email || '');

      setInstagramDate(today);
      setInstagramTime('12:00');
      setTiktokDate(today);
      setTiktokTime('19:30');
      setShortsDate(today);
      setShortsTime('18:00');
      setYoutubeDate(today);
      setYoutubeTime('16:00');
    }
  }, [contentToEdit, isOpen, team]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !hookText.trim()) {
      showNotification('Mohon isi Judul Konten atau Hook terlebih dahulu', 'error');
      return;
    }

    const assignedMember =
      team.find((m) => m.email === picEmail) || {
        name: 'Maulana (Head)',
        email: picEmail || 'kontenpahalawisata@gmail.com',
        role: 'Head of Sosmed',
      };

    const parsedHashtags = hashtagsStr
      .split(/[, ]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
      .slice(0, 5);

    const platformSchedules = {
      instagram: { date: instagramDate, time: instagramTime },
      tiktok: { date: tiktokDate, time: tiktokTime },
      youtubeShorts: { date: shortsDate, time: shortsTime },
      youtube: { date: youtubeDate, time: youtubeTime },
    };

    if (contentToEdit) {
      updateContent(contentToEdit.id, {
        title: title.trim() || hookText.slice(0, 40),
        platform,
        format,
        pillar,
        funnel,
        status,
        approvalStatus,
        publishDate,
        publishTime,
        platformSchedules,
        hookText,
        visualAngle,
        scriptText,
        caption,
        hashtags: parsedHashtags,
        pic: {
          name: assignedMember.name,
          email: assignedMember.email,
          role: assignedMember.role,
        },
      });
    } else {
      addContent({
        brandId: activeBrand.id,
        title: title.trim() || hookText.slice(0, 40),
        platform,
        format,
        pillar,
        funnel,
        status,
        approvalStatus,
        publishDate,
        publishTime,
        platformSchedules,
        hookText,
        visualAngle,
        scriptText,
        caption,
        hashtags: parsedHashtags,
        pic: {
          name: assignedMember.name,
          email: assignedMember.email,
          role: assignedMember.role,
        },
      });
    }
    onClose();
  };

  const handleConfirmGoogleSync = async () => {
    if (!contentToEdit) return;
    setIsSyncing(true);
    try {
      await syncContentItemToCalendar(contentToEdit);
      setShowSyncConfirm(false);
    } catch (err: any) {
      showNotification(err.message || 'Gagal sinkron ke Google Calendar', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h3 className="text-base font-semibold text-white">
              {contentToEdit ? 'Edit Materi & Status Konten' : 'Buat Materi Konten Baru'}
            </h3>
            <p className="text-xs text-slate-400">
              Brand: <span className="text-indigo-400 font-medium">{activeBrand.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Judul Konten */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Judul Konten / Konsep Utama *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: 3 Hidden Spot di Cappadocia Turki yang Jarang Diketahui"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Platform, Format, Pilar, Funnel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Platform Target</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Semua Platform">Semua Platform</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram (IG)</option>
                <option value="YouTube">YouTube</option>
                <option value="Threads">Threads</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Format Konten</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ContentFormat)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Short Video">Short Video (9:16)</option>
                <option value="Reels">Instagram Reels</option>
                <option value="Carousel">Carousel Slides</option>
                <option value="Single Post">Single Post / Feed</option>
                <option value="Long Video">Long Video (16:9)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Pilar Konten</label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Edukasi">Edukasi / Tips</option>
                <option value="Inspirasi">Inspirasi / Storytelling</option>
                <option value="Hard Selling">Hard Selling / Promo</option>
                <option value="Behind The Scenes">Behind The Scenes</option>
                <option value="Entertainment">Entertainment / Relatable</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Funnel Marketing</label>
              <select
                value={funnel}
                onChange={(e) => setFunnel(e.target.value as MarketingFunnel)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="TOFU">TOFU (Awareness)</option>
                <option value="MOFU">MOFU (Consideration)</option>
                <option value="BOFU">BOFU (Conversion)</option>
              </select>
            </div>
          </div>

          {/* Hook & Visual Angle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Hook Konten (3 Detik Pertama) *
              </label>
              <textarea
                rows={3}
                required
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                placeholder="Kalimat pembuka verbal & teks pop-up yang membuat penonton berhenti scrolling..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Arahan Visual & Shooting Angle
              </label>
              <textarea
                rows={3}
                value={visualAngle}
                onChange={(e) => setVisualAngle(e.target.value)}
                placeholder="Panduan shot camera, framing POV, b-roll footage, ekspresi talent, motion graphics..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Naskah / Script Lengkap */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Naskah Lengkap (Scriptwriting)
            </label>
            <textarea
              rows={4}
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Tulis naskah kata demi kata lengkap dengan pembagian timing [00:00-00:05]..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>

          {/* Caption & 5 Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Caption Postingan</label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Copywriting caption dan Call to Action..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">5 Hashtag Relevan</label>
              <textarea
                rows={3}
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
                placeholder="#pahalawisata, #liburanturki, #tipsjalan, #foryou, #viral"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Pisahkan dengan koma atau spasi</p>
            </div>
          </div>

          {/* Status Produksi, Approval, Jadwal, PIC */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Status Produksi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductionStatus)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Ideation">Ideation (Ide)</option>
                <option value="Scripting">Scripting (Naskah)</option>
                <option value="Take Konten">Take Konten (Syuting)</option>
                <option value="Editing">Editing (Edit)</option>
                <option value="Scheduled">Scheduled (Terjadwal)</option>
                <option value="Published">Published (Tayang)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Approval Head</label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Draft">Draft</option>
                <option value="Waiting Review">Waiting Review</option>
                <option value="Approved">Approved</option>
                <option value="Revision">Revision</option>
                <option value="Ready to Shoot">Ready to Shoot</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Jadwal Tanggal</label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Jam Tayang & PIC</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-24 px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500 font-mono"
                />
                <select
                  value={picEmail}
                  onChange={(e) => setPicEmail(e.target.value)}
                  className="flex-1 px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-indigo-500 truncate"
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.email}>
                      {m.name} ({m.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Jadwal Posting Terpisah (Instagram, TikTok, YouTube Shorts, YouTube) */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Jadwal Tanggal Posting Platform Terpisah
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tentukan tanggal dan jam penayangan spesifik untuk masing-masing media sosial secara terpisah
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInstagramDate(publishDate);
                  setTiktokDate(publishDate);
                  setShortsDate(publishDate);
                  setYoutubeDate(publishDate);
                  setInstagramTime(publishTime);
                  setTiktokTime(publishTime);
                  setShortsTime(publishTime);
                  setYoutubeTime(publishTime);
                  showNotification('Jadwal seluruh platform diselaraskan dengan tanggal utama');
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Samakan ke Jadwal Utama
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Jadwal Posting Instagram */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-pink-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-pink-400">
                    Jadwal Posting Instagram
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">IG Reels/Post</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tanggal Posting IG</label>
                  <input
                    type="date"
                    value={instagramDate}
                    onChange={(e) => setInstagramDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Jam Tayang IG</label>
                  <input
                    type="time"
                    value={instagramTime}
                    onChange={(e) => setInstagramTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Jadwal Posting TikTok */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-200">
                    Jadwal Posting TikTok
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">FYP Window</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tanggal Posting TikTok</label>
                  <input
                    type="date"
                    value={tiktokDate}
                    onChange={(e) => setTiktokDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Jam Tayang TikTok</label>
                  <input
                    type="time"
                    value={tiktokTime}
                    onChange={(e) => setTiktokTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Jadwal Posting Short */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-400">
                    Jadwal Posting Short
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">YT Shorts</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tanggal Posting Shorts</label>
                  <input
                    type="date"
                    value={shortsDate}
                    onChange={(e) => setShortsDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Jam Tayang Shorts</label>
                  <input
                    type="time"
                    value={shortsTime}
                    onChange={(e) => setShortsTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Jadwal Posting YouTube */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-red-400">
                    Jadwal Posting YouTube
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">Video Utama</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Tanggal Posting YouTube</label>
                  <input
                    type="date"
                    value={youtubeDate}
                    onChange={(e) => setYoutubeDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Jam Tayang YouTube</label>
                  <input
                    type="time"
                    value={youtubeTime}
                    onChange={(e) => setYoutubeTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-100 font-mono focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Google Calendar Sync Card (if editing an existing scheduled item) */}
          {contentToEdit && (
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-200">Integrasi Google Calendar</p>
                  <p className="text-[11px] text-slate-400">
                    {contentToEdit.googleCalendarEventId
                      ? 'Konten ini sudah tersinkron ke Google Calendar.'
                      : 'Sinkronkan jadwal ini langsung ke Google Calendar Anda.'}
                  </p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowSyncConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
                >
                  {contentToEdit.googleCalendarEventId ? 'Sinkronkan Ulang' : 'Kirim ke Kalender'}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {contentToEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Hapus materi "${contentToEdit.title}" dari database?`)) {
                    deleteContent(contentToEdit.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-medium px-2.5 py-1.5 rounded hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Konten</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
              >
                {contentToEdit ? 'Simpan Perubahan' : 'Tambahkan ke Database'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal for Google Calendar Mutation (Required by workspace-integration) */}
      {showSyncConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Konfirmasi Sinkronisasi Google Calendar
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Apakah Anda ingin menambahkan atau memperbarui event jadwal konten{' '}
                  <strong className="text-white">"{title || hookText.slice(0, 30)}"</strong> pada tanggal{' '}
                  <strong className="text-indigo-400">{publishDate} pukul {publishTime} WIB</strong> ke dalam akun Google Calendar Anda?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isSyncing}
                onClick={() => setShowSyncConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleConfirmGoogleSync}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                {isSyncing ? 'Menyinkronkan...' : 'Konfirmasi & Sinkronkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
