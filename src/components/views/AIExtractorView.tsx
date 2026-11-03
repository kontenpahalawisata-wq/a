import React, { useState } from 'react';
import {
  Sparkles,
  Link2,
  Copy,
  Check,
  PlusCircle,
  ArrowRight,
  Video,
  Hash,
  Eye,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Platform } from '../../types/content';

export const AIExtractorView: React.FC = () => {
  const { activeBrand, addContent, team, showNotification } = useApp();

  const [referenceUrl, setReferenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [brandTone, setBrandTone] = useState('Energetic, Mengedukasi & Relatable');

  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceUrl.trim() && !notes.trim()) {
      showNotification('Masukkan minimal link referensi atau catatan ide konten', 'error');
      return;
    }

    setIsLoading(true);
    setExtractedData(null);

    try {
      const response = await fetch('/api/gemini/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: referenceUrl.trim(),
          notes: notes.trim(),
          platform,
          brandTone,
        }),
      });

      const res = await response.json();
      if (!res.success) {
        throw new Error(res.error || 'Gagal mengekstrak data dari Gemini API');
      }

      setExtractedData(res.data);
      showNotification('Ekstraksi ide konten berhasil diselesaikan oleh Gemini!');
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Terjadi kesalahan saat memproses ekstraksi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showNotification('Teks berhasil disalin ke clipboard');
  };

  const handleSaveToDatabase = () => {
    if (!extractedData) return;

    const assigned = team[0] || {
      name: 'Maulana (Head)',
      email: 'kontenpahalawisata@gmail.com',
      role: 'Head of Sosmed',
    };

    addContent({
      brandId: activeBrand.id,
      title: extractedData.title || 'Konten Ekstraksi Referensi',
      platform,
      format: platform === 'Instagram' ? 'Reels' : 'Short Video',
      pillar: extractedData.pillar || 'Edukasi',
      funnel: (extractedData.funnel as any) || 'TOFU',
      status: 'Ideation',
      approvalStatus: 'Draft',
      publishDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      publishTime: '19:00',
      hookText: extractedData.hook || '',
      visualAngle: extractedData.visualAngle || '',
      scriptText: extractedData.script || '',
      caption: extractedData.caption || '',
      hashtags: extractedData.hashtags || [],
      referenceUrl: referenceUrl || undefined,
      pic: {
        name: assigned.name,
        email: assigned.email,
        role: assigned.role,
      },
    });

    showNotification(`Materi "${extractedData.title}" berhasil disimpan ke Database Konten!`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">AI Content Extractor (Powered by Gemini)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ekstrak ide viral secara otomatis dari link referensi kompetitor, konten populer TikTok/Reels, atau catatan ringkas menjadi Hook, Naskah Script, Arahan Visual, Caption, dan 5 Hashtag.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleExtract} className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Link Referensi Konten (TikTok, IG Reels, YouTube, atau Blog Inspirasi)
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@creator/video/... atau link referensi materi"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-violet-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Catatan Tambahan / Transkrip Konten / Angle yang Mau Ditiru
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Ambil cara dia membuat hook di 3 detik pertama dengan visual zoom-in, tapi sesuaikan untuk niche travel luxury Pahala Wisata..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-violet-500"
            >
              <option value="Semua Platform">Semua Platform</option>
              <option value="TikTok">TikTok Video</option>
              <option value="Instagram">Instagram Reels</option>
              <option value="YouTube">YouTube Shorts</option>
              <option value="Threads">Threads Post</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Voice / Tone</label>
            <input
              type="text"
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              placeholder="Contoh: Bersahabat, Luxury, Otoritatif, Serius tapi Santai"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Model: <strong className="text-slate-300 font-mono">gemini-3.8-flash</strong> (Ekstraksi instan)
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Sedang Mengekstrak Ide...' : 'Ekstrak dengan Gemini'}</span>
          </button>
        </div>
      </form>

      {/* Extracted Results View */}
      {extractedData && (
        <div className="p-6 rounded-xl bg-[#0F172A] border border-violet-900/60 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-950/60 text-violet-300 border border-violet-800/40">
                  {extractedData.funnel || 'TOFU'}
                </span>
                <span className="text-xs text-slate-400">· {extractedData.pillar || 'Edukasi'}</span>
                {extractedData.estimatedDuration && (
                  <span className="text-xs text-slate-400">· Durasi: {extractedData.estimatedDuration}</span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">{extractedData.title}</h3>
            </div>

            <button
              type="button"
              onClick={handleSaveToDatabase}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan ke Database Konten</span>
            </button>
          </div>

          {/* Hook 3 Detik */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Hook Pembuka (0-3 Detik Pertama)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(extractedData.hook, 'hook')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hook' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-sm font-medium text-slate-100 italic leading-relaxed">
              "{extractedData.hook}"
            </p>
          </div>

          {/* Arahan Visual & Shooting Angle */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Arahan Visual & Shooting Angle
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(extractedData.visualAngle, 'visual')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'visual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'visual' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {extractedData.visualAngle}
            </p>
          </div>

          {/* Script Naskah Lengkap */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Naskah Skrip Lengkap (Scriptwriting)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(extractedData.script, 'script')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'script' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/80">
              {extractedData.script}
            </pre>
          </div>

          {/* Caption & 5 Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Caption Postingan & CTA</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(extractedData.caption, 'caption')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'caption' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {extractedData.caption}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-violet-400" /> 5 Hashtag Relevan
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard((extractedData.hashtags || []).join(' '), 'tags')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'tags' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(extractedData.hashtags || []).map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-violet-950/40 text-violet-300 border border-violet-800/40 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
