import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Copy,
  Check,
  PlusCircle,
  Video,
  FileText,
  Hash,
  Clock,
  ArrowRight,
  Flame,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Platform, ContentFormat, MarketingFunnel } from '../../types/content';

export const MaulAIView: React.FC = () => {
  const { activeBrand, addContent, team, showNotification } = useApp();

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [format, setFormat] = useState<ContentFormat>('Short Video');
  const [funnel, setFunnel] = useState<MarketingFunnel>('TOFU');
  const [pillar, setPillar] = useState('Edukasi');
  const [targetAudience, setTargetAudience] = useState('Keluarga muslim muda, pencari paket ibadah dan liburan berkualitas');
  const [brandTone, setBrandTone] = useState('Modern, terpercaya, solutif dan bersahabat');
  const [customBrief, setCustomBrief] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showNotification('Mohon masukkan topik utama konten yang ingin dibuat', 'error');
      return;
    }

    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          format,
          funnel,
          pillar,
          targetAudience,
          brandTone,
          customBrief: customBrief.trim(),
        }),
      });

      const res = await response.json();
      if (!res.success) {
        throw new Error(res.error || 'Gagal memproses naskah dengan Gemini');
      }

      setGeneratedResult(res.data);
      showNotification('Naskah dan paket materi konten berhasil dibuat oleh Maul AI!');
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Terjadi kesalahan saat memproses generator', 'error');
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
    if (!generatedResult) return;

    const assigned = team[0] || {
      name: 'Maulana (Head)',
      email: 'kontenpahalawisata@gmail.com',
      role: 'Head of Sosmed',
    };

    addContent({
      brandId: activeBrand.id,
      title: generatedResult.title || topic,
      platform,
      format,
      pillar,
      funnel,
      status: 'Scripting',
      approvalStatus: 'Draft',
      publishDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      publishTime: '19:30',
      hookText: generatedResult.hook || '',
      visualAngle: generatedResult.visualAngle || '',
      scriptText: generatedResult.script || '',
      caption: generatedResult.caption || '',
      hashtags: generatedResult.hashtags || [],
      pic: {
        name: assigned.name,
        email: assigned.email,
        role: assigned.role,
      },
    });

    showNotification(`Konsep "${generatedResult.title}" berhasil ditambahkan ke Database Konten!`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Maul AI — Asisten Kreatif & Generator Naskah</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Asisten terintegrasi untuk menyusun ide, hook psikologis, naskah kata demi kata, panduan angle visual kamera, caption terstruktur, dan 5 hashtag relevan untuk {activeBrand.name}.
          </p>
        </div>
      </div>

      {/* Input Generator Form */}
      <form onSubmit={handleGenerate} className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Topik Utama / Masalah yang Ingin Dibahas *
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Kesalahan pemula saat pertama kali umroh mandiri vs pakai travel"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Target</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Semua Platform">Semua Platform</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram (Reels)</option>
              <option value="YouTube">YouTube (Shorts)</option>
              <option value="Threads">Threads Post</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Format Konten</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ContentFormat)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Short Video">Short Video (9:16)</option>
              <option value="Reels">Instagram Reels</option>
              <option value="Carousel">Carousel Slides</option>
              <option value="Single Post">Single Post / Feed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Funnel Marketing</label>
            <select
              value={funnel}
              onChange={(e) => setFunnel(e.target.value as MarketingFunnel)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="TOFU">TOFU (Awareness)</option>
              <option value="MOFU">MOFU (Consideration)</option>
              <option value="BOFU">BOFU (Conversion)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilar Konten</label>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Edukasi">Edukasi</option>
              <option value="Inspirasi">Inspirasi</option>
              <option value="Hard Selling">Hard Selling</option>
              <option value="Behind The Scenes">Behind The Scenes</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audiens</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Contoh: Profesional muda, keluarga milenial"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tone Brand</label>
            <input
              type="text"
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              placeholder="Contoh: Bersahabat, berwibawa, modern"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Brief Tambahan / Catatan Khusus (Opsional)
          </label>
          <textarea
            rows={2}
            value={customBrief}
            onChange={(e) => setCustomBrief(e.target.value)}
            placeholder="Contoh: Tambahkan call-to-action untuk daftar promo early bird..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Engine: <strong className="text-slate-300 font-mono">Gemini 3.8 Flash API</strong>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Bot className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menyusun Naskah...' : 'Generate Naskah Konten'}</span>
          </button>
        </div>
      </form>

      {/* Generated Result View */}
      {generatedResult && (
        <div className="p-6 rounded-xl bg-[#0F172A] border border-indigo-900/60 shadow-xl space-y-5 animate-in fade-in duration-300">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                  {funnel}
                </span>
                <span className="text-xs text-slate-400">· {pillar}</span>
                <span className="text-xs text-slate-400">· {platform} ({format})</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1.5">{generatedResult.title}</h3>
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

          {/* Hook Utama & Alternatif */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Hook Utama (Opening 3 Detik)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedResult.hook, 'hook')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hook' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-100 italic leading-relaxed">
              "{generatedResult.hook}"
            </p>

            {generatedResult.alternativeHooks && generatedResult.alternativeHooks.length > 0 && (
              <div className="pt-2 border-t border-slate-900 space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400">Pilihan Hook Alternatif:</span>
                {generatedResult.alternativeHooks.map((alt: string, idx: number) => (
                  <p key={idx} className="text-xs text-slate-300 italic pl-3 border-l-2 border-slate-700">
                    "{alt}"
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Arahan Visual & Shooting Angle */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Arahan Visual & Angle Kamera
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedResult.visualAngle, 'visual')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'visual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'visual' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {generatedResult.visualAngle}
            </p>
          </div>

          {/* Script Naskah Lengkap */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Naskah Skrip Kata Demi Kata
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedResult.script, 'script')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedKey === 'script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'script' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-3.5 rounded border border-slate-800/80">
              {generatedResult.script}
            </pre>
          </div>

          {/* Caption & 5 Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Caption & CTA</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedResult.caption, 'caption')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'caption' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {generatedResult.caption}
              </p>
              {generatedResult.cta && (
                <div className="pt-2 text-[11px] text-indigo-400 font-medium">
                  CTA Utama: {generatedResult.cta}
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-indigo-400" /> 5 Hashtag Relevan
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard((generatedResult.hashtags || []).join(' '), 'tags')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                >
                  {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'tags' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(generatedResult.hashtags || []).map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {generatedResult.productionNotes && (
                <div className="pt-3 border-t border-slate-900 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">Catatan Produksi & Shooting:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    {generatedResult.productionNotes.map((note: string, idx: number) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
