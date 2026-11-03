import React, { useState } from 'react';
import {
  BarChart3,
  Upload,
  Video,
  FileImage,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { activeBrand, addContent, team, showNotification } = useApp();

  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/png');
  const [videoNote, setVideoNote] = useState('');

  // Manual or editable metric fields
  const [manualViews, setManualViews] = useState(342500);
  const [manualLikes, setManualLikes] = useState(28900);
  const [manualShares, setManualShares] = useState(6200);
  const [manualSaves, setManualSaves] = useState(11400);
  const [manualFollowersPct, setManualFollowersPct] = useState(15);
  const [manualNonFollowersPct, setManualNonFollowersPct] = useState(85);
  const [manualGrowth, setManualGrowth] = useState(1820);

  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/png');
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setUploadedImageBase64(result);
      showNotification(`File "${file.name}" berhasil diunggah`);
    };

    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setReportData(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64 || undefined,
          mimeType,
          videoNote,
          manualMetrics: {
            views: manualViews,
            likes: manualLikes,
            shares: manualShares,
            saves: manualSaves,
            followersViewsPercentage: manualFollowersPct,
            nonFollowersViewsPercentage: manualNonFollowersPct,
            followerGrowth: manualGrowth,
          },
        }),
      });

      const res = await response.json();
      if (!res.success) {
        throw new Error(res.error || 'Gagal menganalisis screen record/metrik');
      }

      setReportData(res.data);
      if (res.data.metrics) {
        setManualViews(res.data.metrics.views ?? manualViews);
        setManualLikes(res.data.metrics.likes ?? manualLikes);
        setManualShares(res.data.metrics.shares ?? manualShares);
        setManualSaves(res.data.metrics.saves ?? manualSaves);
        setManualFollowersPct(res.data.metrics.followersViewsPercentage ?? manualFollowersPct);
        setManualNonFollowersPct(res.data.metrics.nonFollowersViewsPercentage ?? manualNonFollowersPct);
        setManualGrowth(res.data.metrics.followerGrowth ?? manualGrowth);
      }
      showNotification('Laporan analisis performa berhasil dihasilkan oleh Gemini!');
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Terjadi kesalahan saat analisis', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptReference = (reference: any) => {
    const assigned = team[0] || {
      name: 'Maulana (Head)',
      email: 'kontenpahalawisata@gmail.com',
      role: 'Head of Sosmed',
    };

    addContent({
      brandId: activeBrand.id,
      title: reference.concept,
      platform: 'TikTok',
      format: 'Short Video',
      pillar: 'Edukasi',
      funnel: (reference.targetFunnel as any) || 'TOFU',
      status: 'Ideation',
      approvalStatus: 'Draft',
      publishDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      publishTime: '20:00',
      hookText: reference.suggestedHook,
      visualAngle: reference.visualAngle,
      scriptText: `[Draft ide turunan dari hasil analitik]\nHook: ${reference.suggestedHook}\nAngle: ${reference.visualAngle}`,
      caption: `Referensi baru berdasarkan insight performa tertinggi ${activeBrand.name}.`,
      hashtags: ['#pahalawisata', '#kontenviral', '#traveltips', '#foryou', '#trending2026'],
      pic: {
        name: assigned.name,
        email: assigned.email,
        role: assigned.role,
      },
    });

    showNotification(`Ide "${reference.concept}" berhasil disimpan ke Database Konten!`);
  };

  // Calculations for graphs
  const followersCount = Math.round((manualViews * manualFollowersPct) / 100);
  const nonFollowersCount = Math.round((manualViews * manualNonFollowersPct) / 100);
  const engagementRate = manualViews > 0
    ? (((manualLikes + manualShares + manualSaves) / manualViews) * 100).toFixed(2)
    : '0';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Analitik Performa & Screen Record Inspector</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unggah rekaman layar (screen recording) atau tangkapan layar analitik TikTok / Instagram / YouTube. AI Gemini akan membaca metrik tayangan, memisahkan penonton followers vs non-followers, serta menyajikan rekomendasi referensi konten bagus siap edit.
          </p>
        </div>
      </div>

      {/* Upload & Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Upload Box */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3.5">
          <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload Screen Record / Screenshot Metrik</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Unggah gambar bukti insight (PNG, JPG, WebP) atau frame video screen record media sosial.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/60 min-h-[140px]">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {imagePreview ? (
              <div className="space-y-2 text-center">
                <img
                  src={imagePreview}
                  alt="Tangkapan Layar Metrik"
                  referrerPolicy="no-referrer"
                  className="max-h-36 rounded-md mx-auto object-contain border border-slate-700"
                />
                <p className="text-[11px] text-emerald-400 font-medium">Klik untuk ganti file</p>
              </div>
            ) : (
              <div className="text-center space-y-1.5">
                <FileImage className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-medium text-slate-300">Pilih file tangkapan layar atau video</p>
                <p className="text-[10px] text-slate-400">TikTok Analytics, IG Insights, atau YouTube Studio</p>
              </div>
            )}
          </label>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Catatan Konteks Konten (Opsional)
            </label>
            <input
              type="text"
              value={videoNote}
              onChange={(e) => setVideoNote(e.target.value)}
              placeholder="Contoh: Video ini diposting jam 19.30 malam, target FYP non-followers"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Manual/Fine-tune Metric Form */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">Parameter Metrik Konten</h3>
            <span className="text-[10px] text-slate-400">Bisa disesuaikan manual</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Tayangan (Views)</label>
              <input
                type="number"
                value={manualViews}
                onChange={(e) => setManualViews(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Likes (Suka)</label>
              <input
                type="number"
                value={manualLikes}
                onChange={(e) => setManualLikes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Saves (Simpan)</label>
              <input
                type="number"
                value={manualSaves}
                onChange={(e) => setManualSaves(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Shares (Bagikan)</label>
              <input
                type="number"
                value={manualShares}
                onChange={(e) => setManualShares(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Views Followers (%)</label>
              <input
                type="number"
                value={manualFollowersPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualFollowersPct(val);
                  setManualNonFollowersPct(100 - val);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Views Non-Followers (%)</label>
              <input
                type="number"
                value={manualNonFollowersPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualNonFollowersPct(val);
                  setManualFollowersPct(100 - val);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono tabular-nums text-slate-100"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleAnalyze}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menganalisis dengan Gemini Vision...' : 'Analisis Performa dengan AI'}</span>
          </button>
        </div>
      </div>

      {/* Laporan dalam Bentuk Angka & Grafik */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Laporan Metrik Kinerja Konten</h3>
            <p className="text-xs text-slate-400">Ringkasan penayangan, rasio audiens terpisah, dan engagement rate</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded">
              Engagement Rate: <strong className="font-mono">{engagementRate}%</strong>
            </span>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" /> Tayangan Total
            </span>
            <div className="text-lg font-bold text-white font-mono tabular-nums">
              {manualViews.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-slate-400">Views penayangan</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-pink-400 flex items-center gap-1">
              <Heart className="w-3 h-3" /> Likes (Suka)
            </span>
            <div className="text-lg font-bold text-pink-400 font-mono tabular-nums">
              {manualLikes.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-slate-400">
              {manualViews > 0 ? `${((manualLikes / manualViews) * 100).toFixed(1)}% rasio` : '-'}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <Bookmark className="w-3 h-3" /> Saves (Simpan)
            </span>
            <div className="text-lg font-bold text-amber-400 font-mono tabular-nums">
              {manualSaves.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-slate-400">Indikator konten bernilai</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-sky-400 flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Shares (Bagikan)
            </span>
            <div className="text-lg font-bold text-sky-400 font-mono tabular-nums">
              {manualShares.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-slate-400">Pemicu viralitas</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 col-span-2 md:col-span-1">
            <span className="text-[10px] text-indigo-400 flex items-center gap-1">
              <Users className="w-3 h-3" /> Follower Baru
            </span>
            <div className="text-lg font-bold text-indigo-400 font-mono tabular-nums">
              +{manualGrowth.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-slate-400">Konversi ke pengikut</p>
          </div>
        </div>

        {/* Visual Charts: Followers vs Non-Followers Breakdown */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">
                Rasio Tayangan: Followers vs Non-Followers (FYP / Explore)
              </h4>
              <p className="text-[11px] text-slate-400">
                Pemisahan audiens yang sudah mengikuti dan audiens baru yang terjangkau
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-400">
              {manualNonFollowersPct > 70 ? 'Viral Reach Tinggi (FYP Dominant)' : 'Audience Loyal'}
            </span>
          </div>

          {/* Dual Bar Chart */}
          <div className="space-y-2">
            <div className="flex h-6 rounded-lg overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all duration-500"
                style={{ width: `${manualFollowersPct}%` }}
                title={`Followers: ${manualFollowersPct}%`}
              >
                {manualFollowersPct >= 10 && `${manualFollowersPct}%`}
              </div>
              <div
                className="bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all duration-500"
                style={{ width: `${manualNonFollowersPct}%` }}
                title={`Non-Followers: ${manualNonFollowersPct}%`}
              >
                {manualNonFollowersPct >= 10 && `${manualNonFollowersPct}% Non-Followers`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-400 font-medium">Followers (Pengikut Anda)</span>
                  <strong className="font-mono tabular-nums text-white">{manualFollowersPct}%</strong>
                </div>
                <p className="text-sm font-bold text-white font-mono mt-1">
                  {followersCount.toLocaleString('id-ID')} Views
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Penonton dari feed & notifikasi profil</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Non-Followers (Audiens Baru)</span>
                  <strong className="font-mono tabular-nums text-white">{manualNonFollowersPct}%</strong>
                </div>
                <p className="text-sm font-bold text-white font-mono mt-1">
                  {nonFollowersCount.toLocaleString('id-ID')} Views
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Terjangkau lewat For You Page / Explore</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance Diagnosis & Recommendations */}
        {reportData && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Diagnosis & Analisis Hasil AI
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Grade: {reportData.performanceGrade || 'High Performance'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {reportData.summaryAnalysis}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Keunggulan Konten (Faktor Keberhasilan)
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                    {(reportData.keyStrengths || []).map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Area Peningkatan / Optimasi
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                    {(reportData.areasToImprove || []).map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Referensi Konten Bagus yang Bisa Diedit */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Referensi Konten Bagus Hasil Analisis (Siap Diedit & Dijadwalkan)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Klik tombol "Jadikan Konten" untuk langsung memasukkan ide turunan ini ke Content Database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(reportData.highPerformingReferences || []).map((ref: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-indigo-400">Ide Turunan #{idx + 1}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {ref.targetFunnel}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-white">{ref.concept}</h5>
                      <p className="text-[11px] text-amber-400/90 italic line-clamp-2">
                        "{ref.suggestedHook}"
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        Angle: {ref.visualAngle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdoptReference(ref)}
                      className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Jadikan Konten</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
