import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High payload limit for base64 screenshots and video thumbnails
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI EXTRACTOR ENDPOINT
app.post('/api/gemini/extract', async (req: Request, res: Response) => {
  try {
    const { url, notes, platform = 'TikTok', brandTone = 'Energetic, Professional & Relatable' } = req.body;

    const prompt = `Anda adalah Maul AI, asisten spesialis Head of Social Media dan Content Strategist profesional.
Tugas Anda adalah mengekstrak ide konten dari referensi berikut menjadi paket materi konten siap produksi untuk platform ${platform} dengan tone '${brandTone}'.

Referensi / Catatan Konten:
URL / Link: ${url || 'Tidak disertakan'}
Catatan / Transkrip / Ringkasan Materi: ${notes || 'Analisis ide konten viral terkini untuk topik ini'}

Ekstrak dan hasilkan data dalam format JSON persis sesuai skema berikut:
1. title: Judul konsep konten yang tajam dan jelas.
2. hook: Hook verbal & teks on-screen 3 detik pertama yang memicu rasa penasaran atau problem-solving.
3. visualAngle: Instruksi pengambilan gambar (framing kamera, ekspresi talent, b-roll, transisi, teks pop-up).
4. script: Naskah skrip lengkap kata demi kata dengan panduan durasi (misal: [00:00-00:05] Hook, [00:05-00:35] Daging/Solusi, [00:35-00:50] Call to Action).
5. caption: Caption postingan yang memancing interaksi komentar dengan paragraf rapi dan CTA.
6. hashtags: Tepat 5 hashtag yang paling relevan dengan niche, platform, dan potensi FYP/Explore.
7. pillar: Salah satu pilar: "Edukasi", "Inspirasi", "Hard Selling", "Behind The Scenes", atau "Entertainment".
8. funnel: Salah satu: "TOFU" (Awareness), "MOFU" (Consideration), atau "BOFU" (Conversion).
9. estimatedDuration: Perkiraan durasi (contoh: "45-60 detik").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            visualAngle: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pillar: { type: Type.STRING },
            funnel: { type: Type.STRING },
            estimatedDuration: { type: Type.STRING },
          },
          required: ['title', 'hook', 'visualAngle', 'script', 'caption', 'hashtags', 'pillar', 'funnel'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/extract:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal mengekstrak ide konten dari referensi',
    });
  }
});

// 2. MAUL AI CONTENT GENERATOR ENDPOINT
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      platform = 'Instagram Reels',
      funnel = 'TOFU',
      pillar = 'Edukasi',
      format = 'Short Video',
      targetAudience = 'Pecinta travel, audiens muda 20-35 tahun',
      brandTone = 'Modern, bersahabat, terpercaya',
      customBrief = '',
    } = req.body;

    const prompt = `Anda adalah Maul AI, Chief Creative Director & Head of Social Media.
Buatkan naskah dan paket produksi konten lengkap dengan spesifikasi berikut:
- Topik Utama: ${topic}
- Platform: ${platform}
- Format: ${format}
- Marketing Funnel: ${funnel} (${funnel === 'TOFU' ? 'Top of Funnel - Awareness' : funnel === 'MOFU' ? 'Middle of Funnel - Consideration' : 'Bottom of Funnel - Conversion'})
- Pilar Konten: ${pillar}
- Target Audiens: ${targetAudience}
- Brand Voice / Tone: ${brandTone}
- Brief Tambahan: ${customBrief || 'Buatkan naskah dengan retensi tinggi dan potensi viral'}

Berikan output dalam JSON dengan:
1. title: Judul konsep konten.
2. hook: Hook utama (sangat memikat).
3. alternativeHooks: Array berisi 2 hook alternatif dengan angle psikologis berbeda (misal: 1 negatif constraint, 1 curiosity).
4. visualAngle: Panduan visual kamera, pencahayaan, shot list, aset b-roll, dan sound style.
5. script: Naskah lengkap siap dibaca talent atau voice over dengan pembagian babak (Hook, Problem, Value, Proof, CTA).
6. caption: Copywriting caption menarik dengan line break yang estetik dan Call to Action.
7. hashtags: Array berisi 5 hashtag paling spesifik dan relevan (contoh: ["#tipsmarketing", "#belajarbisnis", ...]).
8. cta: Call to Action spesifik (misal: "Komen 'MAU' untuk dapat checklist gratis").
9. productionNotes: 2-3 catatan penting untuk tim syuting dan editor video.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            alternativeHooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            visualAngle: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            cta: { type: Type.STRING },
            productionNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'hook', 'visualAngle', 'script', 'caption', 'hashtags', 'cta'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal membuat naskah konten dengan AI',
    });
  }
});

// 3. ANALYTICS & SCREEN RECORD / SCREENSHOT INSPECTOR ENDPOINT
app.post('/api/gemini/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', videoNote = '', manualMetrics } = req.body;

    const parts: any[] = [];

    if (imageBase64) {
      // Clean base64 string if it contains data URI prefix
      const cleanBase64 = imageBase64.includes('base64,')
        ? imageBase64.split('base64,')[1]
        : imageBase64;

      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: cleanBase64,
        },
      });
    }

    const textInstruction = `Anda adalah Maul AI Content Analyst & Social Media Auditor.
Tugas Anda adalah membaca tangkapan layar (screenshot) atau frame rekaman layar (screen record) analitik media sosial (TikTok Analytics, Instagram Insights, atau YouTube Studio).

Data tambahan dari pengguna:
${videoNote ? `Catatan: ${videoNote}` : ''}
${manualMetrics ? `Metrik Awal yang Diketahui: ${JSON.stringify(manualMetrics)}` : ''}

Periksa secara mendalam:
1. Tayangan (Views / Total Plays).
2. Suka (Likes).
3. Bagikan (Shares / Reposts).
4. Simpan (Saves / Bookmarks).
5. Komentar (Comments).
6. Persentase atau Jumlah Tayangan dari Pengikut (Followers) vs Bukan Pengikut (Non-Followers / For You / Explore). Jika tidak tertera jelas, estimasikan secara rasional berdasarkan rasio jangkauan atau sebutkan perkiraannya.
7. Penambahan Pengikut (New Followers gained).
8. Rata-rata Durasi Tonton (Average Watch Time) dan Rasio Selesai Menonton (Watch Full Video rate).
9. Analisis Mengapa Konten Ini Sukses / Gagal (Hook effectiveness, visual pacing, engagement trigger).
10. Rekomendasi Modifikasi & Referensi Konten Bagus Berikutnya: Berikan 3 ide/hook baru yang bisa langsung dibuat untuk memanfaatkan momentum analitik ini.

Keluarkan respon HANYA dalam format JSON terstruktur berikut:`;

    parts.push({ text: textInstruction });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                views: { type: Type.NUMBER, description: 'Total penayangan' },
                likes: { type: Type.NUMBER, description: 'Jumlah like' },
                comments: { type: Type.NUMBER, description: 'Jumlah komentar' },
                shares: { type: Type.NUMBER, description: 'Jumlah share' },
                saves: { type: Type.NUMBER, description: 'Jumlah bookmark / simpan' },
                followersViewsPercentage: { type: Type.NUMBER, description: 'Persentase tayangan dari followers (0-100)' },
                nonFollowersViewsPercentage: { type: Type.NUMBER, description: 'Persentase tayangan dari non-followers (0-100)' },
                followerGrowth: { type: Type.NUMBER, description: 'Jumlah follower baru yang didapat dari konten ini' },
                engagementRate: { type: Type.NUMBER, description: 'Persentase engagement rate' },
                avgWatchTime: { type: Type.STRING, description: 'Rata-rata waktu tonton (misal: 14.2s)' },
                retentionRate: { type: Type.STRING, description: 'Rasio selesai tonton (misal: 28%)' },
              },
              required: ['views', 'likes', 'shares', 'saves', 'followersViewsPercentage', 'nonFollowersViewsPercentage', 'engagementRate'],
            },
            performanceGrade: { type: Type.STRING, description: 'Grade performa: Outstanding, High, Average, Low' },
            summaryAnalysis: { type: Type.STRING, description: 'Ringkasan performa konten dan perilaku audiens' },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Poin-poin keberhasilan konten'
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Kelemahan atau area perbaikan'
            },
            highPerformingReferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING },
                  suggestedHook: { type: Type.STRING },
                  visualAngle: { type: Type.STRING },
                  targetFunnel: { type: Type.STRING },
                },
                required: ['concept', 'suggestedHook', 'visualAngle', 'targetFunnel'],
              },
              description: '3 ide/hook konten turunan yang siap diedit dan dieksekusi'
            },
          },
          required: ['metrics', 'performanceGrade', 'summaryAnalysis', 'keyStrengths', 'areasToImprove', 'highPerformingReferences'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal menganalisis data rekaman layar / metrik',
    });
  }
});

// Configure Vite in development or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
