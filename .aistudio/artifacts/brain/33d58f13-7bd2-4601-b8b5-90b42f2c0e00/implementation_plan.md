# Maul Head Of Sosmed — Content Database & Studio Management System

Sistem manajemen produksi konten media sosial komprehensif untuk Head of Social Media, tim kreatif, dan agensi. Mengintegrasikan database konten yang dinamis, papan Kanban produksi, kalender tersinkronisasi Google Calendar, asisten AI Gemini (Extractor & Maul AI Creator), analitik performa berbasis screen record / metrik, dan penugasan PIC tim via email.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan yang Telah Dikonfirmasi Pengguna:**
> - **Integrasi Google Calendar**: Menggunakan otentikasi Google Workspace OAuth resmi untuk sinkronisasi dua arah jadwal konten ke Google Calendar pengguna.
> - **Tema Visual Dashboard**: Dark Studio bernuansa modern slate (`#090D16` / `#0F172A`) dengan aksen indigo (`#6366F1`) dan violet (`#8B5CF6`), dirancang presisi dengan tipografi modern dan nol elemen "AI slop".
> - **Input Analisis Screen Record & Metrik**: Menyediakan input multimodal ganda: upload screen recording / screenshot metrik media sosial (dianalisis dengan Gemini 3.8 Flash Vision) plus formulir koreksi metrik interaktif dan grafik performa visual.

---

## 1. Overview & Core Concept

- **Tujuan Aplikasi**: Menyediakan satu pusat komando (Single Source of Truth) bagi Head of Social Media dan agensi untuk mengorganisir ide, penulisan skrip, syuting, editing, persetujuan (approval), hingga jadwal tayang multi-platform (TikTok, Instagram, YouTube, Threads) untuk multi-brand.
- **Target Pengguna**: Head of Social Media, Content Creators, Scriptwriters, Video Editors, dan Social Media Specialist / Agency Account Managers.
- **Nilai Utama**:
  1. *Kecepatan Produksi*: Ideasi instan dan ekstraksi referensi link dengan Gemini API menjadi format siap produksi (Hook, Script, Angle Visual, Caption, 5 Hashtag).
  2. *Ketertiban Pipeline*: Pelacakan status terstruktur mulai dari Ideation hingga Published dengan filter funnel marketing (TOFU, MOFU, BOFU).
  3. *Kerapihan Jadwal*: Sinkronisasi Google Calendar memastikan tidak ada konten yang tertinggal atau terlambat tayang.
  4. *Evaluasi Terukur*: Analisis video screen recording hasil analitik TikTok/IG/YouTube untuk membedah penayangan followers vs non-followers serta rekomendasi perbaikan berbasis AI.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Multi-Brand Switcher & Ringkasan Studio**:
   - Pengguna beralih antar brand di sidebar (misal: "Pahala Wisata", "Maul Creative Studio", "Brand Klien").
   - Header menampilkan status kuota produksi bulan berjalan, konten ready to shoot, dan status sinkronisasi Google Calendar.
2. **Eksplorasi & Filter Content Database**:
   - Filter cepat berdasarkan Platform (TikTok, IG, YouTube, Threads), Status (Ideation, Scripting, Take Konten, Editing, Scheduled, Published), dan Funnel (TOFU, MOFU, BOFU).
   - Pencarian kata kunci real-time pada Hook, Judul, Skrip, atau PIC.
   - Tabel responsif dengan inline edit status, modal detail lengkap, dan ekspor CSV data rekapan konten dalam satu klik.
3. **Produksi & Kanban Pipeline**:
   - Tampilan kolom drag-and-drop status produksi. Kartu konten memperlihatkan platform, thumbnail/visual angle, PIC terhubung, dan funnel tag.
4. **Kalender Konten & Google Calendar Sync**:
   - Grid kalender bulanan dan mingguan interaktif.
   - Tombol "Hubungkan Google Calendar" via Google OAuth. Konten yang dijadwalkan dapat disinkronkan langsung ke kalender akun Google pengguna, lengkap dengan notifikasi jadwal tayang.
5. **AI Studio (Maul AI & AI Extractor)**:
   - *AI Extractor*: Masukkan URL referensi atau teks inspirasi; Gemini API mengekstrak hook psikologis, naskah konten, arahan visual/angle, caption engaged, dan 5 hashtag relevan, lalu tombol "Simpan ke Database Konten" langsung mengisi draft konten.
   - *Maul AI Assistant*: Generator naskah khusus dengan tone brand, formula hook (curiosity gap, problem-agitate, relatable), dan format platform tertentu.
6. **Analitik Performa & Screen Record Inspector**:
   - Pengguna mengunggah video screen record analitik TikTok/Instagram/YouTube atau tangkapan layar wawasan.
   - Gemini Vision memindai angka: Tayangan (Views), Likes, Shares, Saves, serta rasio penonton Followers vs Non-Followers.
   - Visualisasi grafik perbandingan metrik, conversion rate, dan kartu rekomendasi AI ("Konten Berperforma Tinggi & Referensi Modifikasi").
7. **Undang Tim & Penugasan PIC**:
   - Modal undang anggota tim via email, menetapkan peran (PIC Ideation, Scriptwriter, Talent/Shooter, Editor, Approver).

### Visual Identity & Theme
- **Aesthetic Direction**: *Dark Studio Pro* — antarmuka workstation kreatif yang terfokus, bernuansa gelap elegan ala DaVinci Resolve / Linear / Figma Dark, menghindari warna neon murahan dan mengutamakan keterbacaan data tinggi.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Slate Gelap `#090D16` dengan kontras panel `#0F172A`.
  - *Structural Surfaces (30%)*: Border hairline `#1E293B`, kartu `#131C31`, hover `#1E293B/70`.
  - *Accent Budget (10%)*: Indigo `#6366F1` untuk aksi primer, Violet `#8B5CF6` untuk fitur AI, Emerald `#10B981` untuk status Published/Approved, Amber `#F59E0B` untuk status Take Konten / In Review.
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` / `Outfit` (bersih, berwibawa, modern).
  - Body Prose: `Plus Jakarta Sans` (14px–15px, keterbacaan tinggi).
  - Metrik & Data: Tabular figures `font-mono tabular-nums` (`#94A3B8` / `#F8FAFC`).
  - Nol teks pill dekoratif pada metadata; menggunakan pemisah tipografis natural (`·`).

---

## 3. Key Product Decisions & Trade-Offs

- **Integrasi Google Calendar**:
  - *Pilihan*: Menggunakan Firebase Auth Google Provider dengan scope `https://www.googleapis.com/auth/calendar.events` yang telah teruji pada skill `workspace-integration`. Pengguna dapat menghubungkan akun Google mereka secara mulus langsung dari antarmuka kalender.
  - *Alasan*: Pengguna mendapatkan kalender asli yang terintegrasi di Google Calendar ponsel/laptop mereka tanpa perlu aplikasi pihak ketiga tambahan.
- **Arsitektur Gemini API**:
  - *Pilihan*: Model `gemini-3.8-flash` dipanggil melalui endpoint server-side proxy aman (`/api/gemini/extract`, `/api/gemini/generate`, `/api/gemini/analyze`) dengan SDK `@google/genai` resmi.
  - *Alasan*: Menjamin keamanan `GEMINI_API_KEY` di server (tidak pernah bocor ke browser), mendukung respon JSON terstruktur (`responseSchema`), serta kemampuan multimodal untuk analisis screen record/screenshot.
- **State Management & Multi-Brand**:
  - *Pilihan*: Local persistence reaktif (`localStorage` engine dengan initial pre-populated dummy data industri kreatif Indonesia + sinkronisasi real-time).
  - *Alasan*: Memberikan pengalaman siap pakai seketika (zero cold-start), data dapat diedit penuh tanpa delay jaringan, dan aman dari kegagalan database pihak ketiga.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MAUL HEAD OF SOSMED (FRONTEND)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   Sidebar Navigation  │  │        Top Studio Status Bar          │  │
│  │ ───────────────────── │  │ ───────────────────────────────────── │  │
│  │ • Brand Switcher      │  │ • Brand Name • Active Pipeline Count  │  │
│  │ • Dashboard           │  │ • Google Calendar Link Status         │  │
│  │ • Content Database    │  │ • Quick "+ Tambah Konten" Action      │  │
│  │ • Kanban Pipeline     │  └───────────────────────────────────────┘  │
│  │ • Kalender Konten     │                                             │
│  │ • Maul AI & Extractor │  ┌───────────────────────────────────────┐  │
│  │ • Analitik & Report   │  │             View Router               │  │
│  │ • Tim & PIC           │  │  [Dashboard | Table | Kanban | ... ]  │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
  ┌─────────────────────────────┐         ┌─────────────────────────────┐
  │      Google Workspace       │         │    Server-Side Gemini API   │
  │   OAuth & Calendar API      │         │     (Express / Node.js)     │
  │ ─────────────────────────── │         │ ─────────────────────────── │
  │ • GoogleAuthProvider Scopes │         │ • POST /api/gemini/extract  │
  │ • List & Create Events      │         │ • POST /api/gemini/generate │
  │ • calendar.googleapis.com   │         │ • POST /api/gemini/analyze  │
  └─────────────────────────────┘         └──────────────┬──────────────┘
                                                         │
                                          ┌──────────────▼──────────────┐
                                          │     Google GenAI SDK        │
                                          │      gemini-3.8-flash       │
                                          └─────────────────────────────┘
```

### Data Model & Entities

```typescript
// Entitas Konten Utama
interface ContentItem {
  id: string;
  brandId: string;
  title: string;              // Judul materi
  hookText: string;           // Hook naskah
  visualAngle: string;        // Arahan visual / shooting angle
  scriptText: string;         // Naskah lengkap
  caption: string;            // Caption postingan
  hashtags: string[];         // 5 hashtag relevan
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Threads';
  format: 'Short Video' | 'Reels' | 'Carousel' | 'Single Post' | 'Long Video';
  pillar: string;             // Edukasi, Inspirasi, Hard Selling, BTS, Entertainment
  funnel: 'TOFU' | 'MOFU' | 'BOFU';
  status: 'Ideation' | 'Scripting' | 'Take Konten' | 'Editing' | 'Scheduled' | 'Published';
  approvalStatus: 'Draft' | 'Waiting Review' | 'Approved' | 'Revision' | 'Ready to Shoot';
  publishDate: string;        // YYYY-MM-DD
  publishTime?: string;       // HH:mm
  googleCalendarEventId?: string;
  pic: {
    name: string;
    email: string;
    role: string;
  };
  metrics?: {
    views: number;
    likes: number;
    shares: number;
    saves: number;
    followersViews: number;
    nonFollowersViews: number;
    followerGrowth: number;
  };
}

// Brand Multi-Tenancy
interface Brand {
  id: string;
  name: string;
  handle: string;
  category: string;
}

// Anggota Tim
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Head of Sosmed' | 'Scriptwriter' | 'Talent / Shooter' | 'Video Editor' | 'Analyst';
  assignedCount: number;
}
```

### Interactive Component & State Mapping

1. **Content Database Table View**:
   - State: `searchQuery`, `selectedPlatform`, `selectedStatus`, `selectedFunnel`, `sortOrder`.
   - Handlers: Quick inline status dropdown update, bulk select, CSV export trigger, edit modal with auto-save.
2. **Kanban Pipeline Board**:
   - 6 Kolom: Ideation $\rightarrow$ Scripting $\rightarrow$ Take Konten $\rightarrow$ Editing $\rightarrow$ Scheduled $\rightarrow$ Published.
   - Handlers: Drag or move card between status columns with immediate state update and timeline recording.
3. **Google Calendar Sync & In-App Calendar**:
   - State: `currentMonth`, `scheduledContents`, `googleAuthStatus`, `isSyncing`.
   - Handlers: "Sync to Google Calendar" batch/single event creation with user confirmation modal.
4. **Maul AI & AI Extractor Studio**:
   - Inputs: Link URL / inspirasi topik, persona brand, target platform.
   - Handlers: POST ke backend `/api/gemini/extract` atau `/api/gemini/generate`, streaming / loader animasi, output terstruktur (Hook, Script, Visual Angle, Caption, 5 Hashtag), tombol 1-klik "Masukkan ke Database".
5. **Screen Record Analytics & Report**:
   - Inputs: Upload file video/foto rekaman layar analitik TikTok/IG/YouTube, atau isi form cepat.
   - Handlers: POST base64 ke `/api/gemini/analyze`, visualisasi perbandingan followers vs non-followers dengan chart bar/donut, perhitungan engagement rate, dan rekomendasi perbaikan hook/pacing.
6. **Undang Tim Modal**:
   - Inputs: Email, Nama, Role.
   - Handlers: Simpan ke daftar tim, generate undangan simulasi email, dan langsung muncul di pilihan PIC setiap konten.
