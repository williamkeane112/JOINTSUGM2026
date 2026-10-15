# SkillPath AI - Session Progress & Context

> **⚠️ NOTE**: "SkillPath AI" adalah nama placeholder. Nama final belum ditentukan.

**Last Updated**: 2026-10-15 (bagian terbaru ada di paling bawah file ini)  
**Session Started**: 2026-10-11

---

## 📋 Project Status: Planning & Setup Phase

### Current State

- ✅ Project planning document created (`docs/PROJECT_PLAN.md`)
- ✅ Steering files configured for Full Supabase architecture
- ✅ Tailwind CSS v4 installed and configured
- ⏳ Ready to start implementation

---

## 🗂️ What We've Accomplished

### 1. Project Planning & Documentation (Day 1 - Oct 11)

#### Created Comprehensive Planning Document

- **File**: `docs/PROJECT_PLAN.md` (2050 lines)
- **Content**:
  - Executive summary & problem statement
  - MVP scope (5 core features, 3-5 topics)
  - System architecture (3-layer design)
  - Database schema (8 tables with ERD)
  - BKT algorithm implementation guide
  - API design (15+ endpoints)
  - UI/UX mockups (10 pages)
  - 4-week development roadmap
  - Risk assessment & mitigation

**Key Decisions Made**:

- Subject: Matematika SMP only for MVP
- Topics: Operasi Dasar, Pecahan, Persamaan Linear
- Architecture: Full Supabase (no Node.js Express, no Python FastAPI)
- Algorithm: BKT runs client-side in TypeScript
- Timeline: 4 weeks with clear weekly deliverables

---

### 2. Architecture Decisions (Day 1 - Oct 11)

#### Initial Architecture (Before Revision)

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: MySQL
- Algorithm Engine: Python + FastAPI (BKT)
- AI Service: OpenAI/Claude API

#### **FINAL Architecture (After Discussion)**

- ✅ **Frontend**: React 18+ + TypeScript + Vite
- ✅ **Backend**: **Supabase** (Backend as a Service)
  - PostgreSQL database (not MySQL)
  - Supabase Auth with JWT (built-in)
  - Supabase Realtime (optional)
  - Edge Functions (optional for AI proxy)
- ✅ **Algorithm**: **Client-side TypeScript** (not Python)
  - BKT implementation in `/src/lib/algorithms/bkt.ts`
  - Recommendation engine in `/src/lib/algorithms/`
- ✅ **AI Service**: OpenAI/Claude API (direct or via Edge Function)

**Rationale for Supabase**:

- Faster development (no backend boilerplate)
- Built-in auth & JWT
- Free tier sufficient for hackathon MVP
- Real-time capabilities out of the box
- PostgreSQL more powerful than MySQL

---

### 3. Tech Stack Configuration (Day 1 - Oct 11)

#### Tailwind CSS v4 Setup

- ✅ Installed: `tailwindcss` + `@tailwindcss/vite`
- ✅ Configured: `vite.config.ts` with Tailwind plugin
- ✅ Updated: `src/index.css` with Tailwind v4 syntax
- ✅ Created: Custom components (@layer components)
  - `.btn-primary`, `.btn-secondary`, `.btn-success`
  - `.card`, `.card-hover`
  - `.input`
  - `.badge-mastered`, `.badge-progress`, `.badge-not-mastered`, `.badge-locked`
- ✅ Color scheme defined:
  - Primary: blue-500
  - Success: green-500 (mastered)
  - Warning: orange-500 (in progress)
  - Danger: red-500 (not mastered)

**Important**: Using Tailwind CSS **v4** with Vite plugin, NOT PostCSS!

---

### 4. Steering Files Created (Day 1-2 - Oct 11-12)

#### File 1: `docs/PROJECT_PLAN.md`

- Complete project documentation
- Reference for all implementation details

#### File 2: `.kiro/steering/skillpath-ai-supabase.md` (749 lines)

- **Full Supabase architecture** guidelines
- Tech stack with correct versions
- Project structure (`/src/lib/` layout)
- Database schema (PostgreSQL with UUID)
- BKT algorithm (TypeScript implementation)
- Supabase client setup examples
- API service layer patterns
- Coding standards (TypeScript, React, Tailwind v4)
- Environment variables template
- Development workflow (Supabase CLI)
- File naming conventions

**Key Content**:

- Complete BKT TypeScript class with formulas
- Row Level Security (RLS) policies examples
- Service layer abstraction pattern
- What NOT to build (skip list)
- Success criteria for demo

---

## 🎯 Key Decisions & Constraints

### Must Follow

1. **Database**: PostgreSQL (Supabase) with UUID primary keys
2. **Auth**: Supabase Auth (JWT built-in), no custom implementation
3. **BKT**: Client-side TypeScript (no Python backend)
4. **Folder**: `/src/lib/` for all business logic
   - `lib/supabase.ts` - Client init
   - `lib/api/` - Service layer
   - `lib/algorithms/` - BKT & recommendation
   - `lib/types.ts` - TypeScript types
5. **Tailwind**: v4 with `@tailwindcss/vite` plugin
6. **MVP Scope**: 1 subject (Matematika), 3-5 topics only

### Must NOT Do (Skip for MVP)

- ❌ Multiple subjects
- ❌ Teacher dashboard
- ❌ Complex gamification
- ❌ Video call features
- ❌ Mobile app (web only)
- ❌ Separate Node.js/Python backend

---

## 📚 Important Technical Details

### Database Tables (PostgreSQL)

1. `users` - Managed by Supabase Auth (auth.users)
2. `topics` - Subject topics
3. `prerequisites` - Topic dependencies
4. `questions` - Test & exercise questions
5. `student_progress` - BKT state (p_learned, p_guess, p_slip, mastery_level)
6. `student_answers` - Answer history
7. `learning_materials` - Content per topic
8. `ai_conversations` - AI tutor chat history (optional)

**Key**: All tables use `UUID` primary keys, not `INT AUTO_INCREMENT`

### BKT Parameters

- **P(L)**: Probability of mastery (0-1)
- **P(T)**: Learning probability (~0.1)
- **P(G)**: Guess probability (~0.25)
- **P(S)**: Slip probability (~0.1)

### Mastery Thresholds

- Not Mastered: < 0.40 (🔴 red)
- In Progress: 0.40 - 0.70 (🟡 orange)
- Mastered: > 0.70 (🟢 green)

---

## 🔄 What We Discussed But Changed

### Initial Plan vs Final Plan

| Aspect       | Initial            | Final (Current)                 |
| ------------ | ------------------ | ------------------------------- |
| Backend      | Node.js + Express  | ❌ Removed, use Supabase        |
| Database     | MySQL              | PostgreSQL (Supabase)           |
| Algorithm    | Python FastAPI     | TypeScript (client-side)        |
| ORM          | Sequelize/Prisma   | ❌ Not needed, use Supabase SDK |
| HTTP Client  | Axios              | @supabase/supabase-js           |
| Primary Keys | INT AUTO_INCREMENT | UUID                            |
| Auth         | Custom JWT         | Supabase Auth (built-in)        |

---

## 📝 Session History

### Session 1 (Oct 11, 21:49 - 22:52)

- **Topic**: Initial project planning
- **Outcome**: Created comprehensive PROJECT_PLAN.md
- **Key Moment**: Decided on BKT algorithm as core differentiator

### Session 2 (Oct 11, 22:01 - 22:10)

- **Topic**: Tailwind CSS installation
- **Outcome**: Installed Tailwind CSS v4 with Vite plugin
- **Issue Resolved**: Initially tried old PostCSS method, corrected to v4 Vite plugin

### Session 3 (Oct 11, 22:10 - 22:23)

- **Topic**: Steering files explanation
- **Outcome**: Learned about `.kiro/steering/` feature (like CLAUDE.md)

### Session 4 (Oct 11, 22:13 - 22:52)

- **Topic**: Architecture revision to Full Supabase
- **Key Questions Answered**:
  - Backend: Full Supabase (no Node.js)
  - BKT: Client-side TypeScript
  - Database: PostgreSQL with UUID
  - Folder: `/src/lib/` structure
- **Outcome**: Created `skillpath-ai-supabase.md` steering file (749 lines)

### Session 5 (Oct 12, 10:09 - 10:16)

- **Topic**: Session management & context repository
- **Outcome**: Learned about Kiro's auto-save sessions
- **Clarified**: Difference between `/clear` vs `/chat new`

### Session 6 (Oct 12, 10:16 - Current)

- **Topic**: Creating progress tracking file
- **Outcome**: This file!

---

## 🚀 Ready for Next Steps

### Immediate Next Steps (Week 1 - Foundation)

1. **Setup Supabase Project**
   - [ ] Create Supabase account
   - [ ] Initialize new project
   - [ ] Copy project URL & anon key
   - [ ] Create `.env.local` file

2. **Install Dependencies**
   - [ ] `npm install @supabase/supabase-js`
   - [ ] `npm install react-router-dom`
   - [ ] `npm install zustand` (or use Context API)
   - [ ] `npm install react-hook-form zod`
   - [ ] `npm install recharts`

3. **Setup Supabase Client**
   - [ ] Create `src/lib/supabase.ts`
   - [ ] Initialize Supabase client
   - [ ] Test connection

4. **Database Schema**
   - [ ] Create migration files in `supabase/migrations/`
   - [ ] Define all 7 tables with UUID
   - [ ] Setup Row Level Security policies
   - [ ] Seed initial data (3 topics, questions)

5. **BKT Algorithm**
   - [ ] Implement `src/lib/algorithms/bkt.ts`
   - [ ] Test BKT calculations with sample data
   - [ ] Create TypeScript types

---

## 💡 Important Notes for Future Sessions

1. **Always refer to**: `.kiro/steering/skillpath-ai-supabase.md` for guidelines
2. **Database**: PostgreSQL (Supabase) with UUID, NOT MySQL with INT
3. **No Backend**: Don't create `/backend/` folder, everything in `/src/lib/`
4. **BKT Client-Side**: Algorithm runs in browser, not separate service
5. **Tailwind v4**: Use `@import "tailwindcss";` not `@tailwind base;`
6. **MVP Focus**: 1 subject (Matematika), 3-5 topics only

---

## 🎯 Success Criteria (Remember for Demo)

1. **Algorithm Works**: BKT correctly updates mastery based on answers
2. **Personalization Visible**: Different students see different recommendations
3. **AI Tutor Quality**: Context-aware, helpful, stays in scope
4. **UX Smooth**: Clear flow from diagnostic → learning → progress
5. **Technical Solid**: No crashes, proper error handling, responsive design
6. **Security**: RLS policies prevent unauthorized access

---

## 📌 Quick Reference

**Project**: SkillPath AI - Adaptive Learning Platform  
**Timeline**: 4 weeks MVP  
**Current Week**: Week 1 (Foundation)  
**Architecture**: Full Supabase + React + TypeScript  
**Primary Goal**: Prove BKT-based personalization works

**Steering File**: `.kiro/steering/skillpath-ai-supabase.md`  
**Planning Doc**: `docs/PROJECT_PLAN.md`  
**This File**: `.kiro/steering/session-progress.md`

---

## 🎨 Design System Unification (2026-10-13)

### Konteks

Auth page (`src/page/auth/Auth.tsx`) dibangun dari design reference eksternal dengan palet **pink/violet/night/cream** (`#FF4F87`, `#6D36BD`, `#160820`, `#FFF7F2`). Palet ini berbeda total dari design system lama di `docs/DESIGN.md` yang masih **blue-500 generik** (`#3B82F6`) ala SaaS dashboard, lengkap dengan maskot Spark ber-glow biru. `src/index.css` sempat punya dua set token sekaligus (campur blue lama + pink/violet baru), dan 99 referensi warna lama tersebar di 10 file dokumentasi.

### Keputusan

- **Pink `#FF4F87` + violet `#6D36BD` menggantikan biru sebagai brand/primary** di seluruh app — bukan hanya auth page. Alasan: auth page sudah establish identitas visual yang matang (hangat, personal, "belajar di malam hari yang fokus"), lebih distinctive dibanding blue-SaaS default yang jadi "tell" AI-generated.
- **Status mastery (🔴🟡🟢) tetap pakai logika merah/kuning/hijau** — ini semantik fungsional, tidak diganti pink supaya user tidak bingung membedakan status dari aksi. Hue-nya dihangatkan: mastered `#1E9E6B`, in-progress `#E8A33D`, not-mastered `#E2544B` (bukan `green-500`/`amber-500`/`red-500` Tailwind default).
- **Gamification (XP, streak) memakai ulang hue brand** — XP = violet (reuse, bukan purple-500 baru), streak = `#F2763C` koral-oranye.
- **Font**: Plus Jakarta Sans (display/heading) + Inter (body) — sudah ditentukan di DESIGN.md lama tapi **tidak pernah benar-benar di-load** (tidak ada `<link>` Google Fonts di `index.html`). Ini diperbaiki sekaligus.
- **Tracking floor**: headline di Auth.tsx pakai `-0.065em` yang melewati batas kenyamanan baca (-0.04em floor, -0.02 s/d -0.03em ideal). Dicatat sebagai standar baru untuk ke depan; Auth.tsx **tidak diubah** sekarang (di luar scope task ini).

### Yang Diubah

- `src/index.css` — ditulis ulang penuh: token brand (ink/pink/pink-deep/violet/night/cream/line/surface), status mastery dengan pasangan tint/ink/line per status, shadow selalu offset+blur (bukan halo warna offset-nol), radius 12-16px untuk card. Semua class `.btn-*`/`.card*`/`.input`/`.badge-*` pakai token baru.
- `index.html` — load Plus Jakarta Sans + Inter via Google Fonts.
- `docs/DESIGN.md` — §3 Color Palette, §4 Typography (tambah subsection Letter Spacing), §5 radius, §6 Component Library (buttons/cards/progress/badges/input/navigation/diagnostic test/chat bubble), maskot Spark, §11 Google Stitch prompts (7 prompt), §13 Tailwind custom classes code appendix — semua diselaraskan ke token baru.
- `.kiro/steering/skillpath-ai-supabase.md` dan `AGENTS.md` — baris color scheme diperbarui.

### Catatan Proses

- Setup resmi skill `impeccable` (`impeccable context`) gagal karena tidak ada akses jaringan untuk download engine binary. Dilanjutkan dengan membaca context project secara manual + menerapkan `craft-floor.md` secara langsung (shadow offset+blur, radius 12-16px, badge text dicelup dari hue bukan abu-abu generik, dll), sesuai fallback instruction skill tersebut.
- Tidak ada `PRODUCT.md` di project ini; karena task ini adalah penyempurnaan konsistensi pada dunia visual yang sudah ada (bukan surface baru), dilanjutkan tanpa `init`.

## 🖥️ Dashboard Page — v0 Prompt Design (2026-10-13)

### Konteks

Setelah auth page selesai, lanjut ke dashboard page. User minta rancangan `docs/DESIGN.md` yang akan dipakai sebagai prompt untuk **v0.dev** (Vercel) — berbeda dari Google Stitch (§11, image-mockup generator), v0 menghasilkan kode React+Tailwind nyata, jadi perlu spesifikasi fungsional presisi (hex literal, struktur komponen, tipe data, copy exact), bukan deskripsi visual naratif.

### Yang Dicek Sebelum Menulis

- `src/page/dashboard/Index.tsx` — masih **placeholder** (kartu "Ini Dashboard" + tombol Logout, pakai Tailwind `slate`/`red` default, belum pakai design tokens project).
- `src/page/auth/Auth.tsx` — referensi gaya aktual: `lucide-react` untuk ikon, Supabase client dari `src/lib/supabaseClient`, hex literal langsung di JSX (bukan `var(--color-*)` di level komponen — CSS var hanya untuk class `.btn-*`/`.card`/`.badge-*` di `src/index.css`).
- `src/App.tsx` — route aktual baru: `/`, `/auth`, `/dashboard`, `/topicSelect`. **Belum ada** `/knowledge-map`, `/learning`, `/ai-tutor` — jadi desain sidebar harus punya state disabled/"Segera" untuk nav yang belum punya route, supaya kode hasil v0 tidak patah saat ditempel.
- Tidak ada komponen Spark mascot custom (SVG/Lottie) yang sudah dibuat — prompt pakai ikon `Sparkles` dari lucide-react sebagai representasi Spark (v0 tidak reliable untuk custom character illustration).
- `src/index.css` dibaca untuk menarik semua token hex/radius/shadow literal (v0 tidak bisa baca file CSS kita, jadi semua token harus ditulis literal di dalam prompt).

### Yang Ditambahkan ke `docs/DESIGN.md`

Section baru **§14 "v0.dev Prompt — Dashboard Page (Production Code Generation)"**, isi:

- **§14.1** Status implementasi aktual (dicek dari kode, bukan asumsi) — placeholder dashboard, referensi gaya Auth.tsx, route yang tersedia, mascot belum ada komponennya.
- **§14.2** Design tokens literal (hex, radius, shadow, font) — siap tempel ke prompt v0 karena v0 tidak baca `src/index.css`.
- **§14.3** Prompt lengkap siap paste ke v0: struktur sidebar (desktop) + bottom nav (mobile), greeting header, 4 stat cards, recommendation card + aktivitas terakhir + tip Spark, knowledge map preview (5 topic mini-card termasuk 1 locked), achievements row (2 unlocked + 2 locked), definisi TypeScript interface `DashboardData` untuk props, empty-state (belum ada diagnostic test), dan catatan accessibility (focus ring, touch target, color tidak jadi satu-satunya indicator).
- **§14.4** Prompt granular per komponen (`StatCard`, `RecommendationCard`, `TopicMiniCard`, `AchievementCard`, `DashboardSidebar`) sebagai alternatif jika generate full-page kurang presisi — strategi iterasi per-komponen biasanya lebih akurat di v0.
- **§14.5** Catatan integrasi setelah generate: selaraskan hex literal hasil v0 ke CSS var project, ganti ikon ke `lucide-react` (sudah dependency), mock `DashboardData` dulu sebelum disambung ke `student_progress`/`student_answers` via `src/lib/api/progress.ts`, dan jangan aktifkan link sidebar ke route yang belum dibuat.

### Status

Dashboard page **belum di-generate/di-koding** — ini baru tahap desain/spec (`docs/DESIGN.md` §14). Langkah berikutnya: jalankan prompt §14.3 di v0.dev, tempel hasilnya ke `src/page/dashboard/Index.tsx`, lalu sambungkan ke data asli setelah BKT (`src/lib/algorithms/bkt.ts`) dan service layer progress diimplementasikan.

## 🧭 Keputusan Produk & Dashboard (2026-10-14) — SUPERSEDES §14 di DESIGN.md

### Konteks
Sesi brainstorming (skill `brainstorming` dari `~/.agents/skills/`). Sempat dibahas ide "topik + UI halaman digenerate AI per user"; **ditolak** karena terlalu besar untuk deadline dan mengaburkan USP BKT (dua siswa dengan kurikulum berbeda tidak membuktikan adaptivitas). Kembali ke alur yang diusulkan teman user.

### Alur final
`/auth` → `/topicSelect` (katalog topik seeded) → jika topik baru: **diagnostic per topik** (soal AI, di-cache di `questions`, `source='ai'`) → AI menyusun **Journey berlevel** (JSON + Zod, fallback `recommendation.ts`) → Dashboard.

### Keputusan
- Topik = seeded, bukan AI. "Ajukan topik baru" = post-MVP.
- Soal AI digenerate **sekali per topik** (bukan per user), dicek manual → hasil siswa bisa dibandingkan, demo tidak bergantung API.
- AI hanya mengisi JSON; komponen React yang merender. AI tidak menulis UI.
- Dashboard = **opsi A "pintu ke langkah berikutnya"**: hero gelap + daftar topik yang sudah dimulai + ringkasan + 1 top bar. Bentuk akhirnya sudah berevolusi menjadi bento v2 (lihat "Status Dashboard v2" dan "Ringkasan sesi" di bawah); detail awal di `01-mvp-scope.md` §6.
- Dashboard dikerjakan **dengan mock data dulu**, wajib punya empty state.
- Onboarding (nama/kelas) dipangkas demi deadline.

### Belum diputuskan (jangan blok Dashboard)
- Bentuk visual Journey.
- Apakah tiap level Journey punya P(L) sendiri (**asumsi/rekomendasi saya, belum dikonfirmasi user**) → menentukan skema (tabel level / `topics.parent_id`).
- Route belum ada: `/diagnostic`, `/journey`, `/knowledge-map`, `/ai-tutor`. Isi `/topicSelect` belum diverifikasi (file 128 byte, kemungkinan placeholder).

### Dokumen yang disesuaikan hari ini
`01-mvp-scope.md`, `02-database-schema.md` (kolom `questions.source`), `skillpath-ai-supabase.md`, `AGENTS.md`, `docs/USER_FLOWS.md` (§1-4), `docs/DESIGN.md` (§14 diberi catatan superseded).

### Status Dashboard v1 (2026-10-14, mock data) — DIGANTIKAN oleh v2 di bawah; `TopicRow` dan `SummaryStrip` sudah dihapus
- Kode di `src/page/dashboard/`: `Index.tsx`, `DashboardTopBar`, `HeroCard`, `TopicRow`, `SummaryStrip`, `EmptyState`, `useCountUp`, `statusStyle`, `dashboardLogic`, `mockData`, `types`. Logika status mastery bersama di `src/lib/mastery.ts` (ambang: <40 weak, 40..<70 progress, >=70 mastered).
- Ganti skenario mock lewat `/dashboard?demo=budi|sari|empty|done` (`budi` dan `sari` menghasilkan rekomendasi berbeda — bahan demo dua siswa).
- Tes: `npm run test` (Vitest, 24 tes). Review visual: jalankan `npm run dev -- --port 5174 --strictPort`, lalu `BASE_URL=http://localhost:5174 npm run screenshot` (hasil di `.screenshots/`, di-ignore git).
- Deviasi dari plan (alasan: aturan craft-floor): tanpa kicker di atas judul hero; progress ring diganti track mastery dengan tanda di 40 dan 70; `EmptyState` memakai permukaan gelap yang sama dengan hero.
- Belum: data Supabase (`student_progress`), route Journey (tombol hero sementara ke `/topicSelect` lewat `topicHref`), `ProtectedRoute` masih dikomentari di `App.tsx` sehingga `/dashboard` bisa dibuka tanpa login.

### Status Dashboard v2 (2026-10-14, bento + kurva penguasaan, mock data)
- Layout `lg`: hero (8 kolom) + `ProgressCard` (4), `MasteryCurve` (12), lalu grid `TopicCard` (isi latar = persen penguasaan). Container `max-w-6xl` (diperkecil 2026-10-14 malam), navbar pill (Dashboard, Topik, di tengah) di `DashboardTopBar`. Komponen lama `SummaryStrip`/`TopicRow` dihapus.
- BKT kini nyata di `src/lib/algorithms/bkt.ts` (`BKTModel`, `buildMasteryCurve`). Mock di `mockData.ts` dibangun dari string jawaban ("T"/"F"); mastery topik = titik terakhir kurva BKT, jadi angka hero dan grafik selalu sama. Kurva memakai awal P(L)=0.10 (`CURVE_INITIAL_P_LEARNED`) dan 30 jawaban terakhir.
- Tes: `npm run test` (43 tes). Review visual: server dev di port bebas, lalu `BASE_URL=... npm run screenshot` (360/768/1280px × `?demo=budi|sari|empty|done`). Catatan: tool baca gambar meng-cache per nama file; salin ke nama baru bila screenshot diulang.
- Deviasi dari plan: navbar mobile satu baris (brand ikon saja, Keluar ikon saja) agar urutan DOM = urutan visual, bukan dua baris.
- Belum: halaman Topik (`/topicSelect` masih placeholder), data Supabase, route Journey, `ProtectedRoute` masih dikomentari.
- Pembaruan 2026-10-14 (grafik): label grafik memakai kata, bukan angka teknis: sumbu 0/50/100 dan satu garis hijau "Dikuasai" (ketinggian 70). Titik awal (prior P(L)) tidak digambar: grafik berisi satu titik per jawaban, jadi 10 jawaban = 10 titik, dan "Mulai" adalah hasil setelah soal 1. Mock data kini hanya berisi set penuh (`QUESTIONS_PER_SET = 10` jawaban per topik) dan `questionsAnswered` = total jawaban tercatat. Tes: 51.

## 📌 Ringkasan sesi 2026-10-14 (baca ini dulu di sesi berikutnya)

### Yang sudah ada di kode
- `src/lib/mastery.ts` — ambang status UI (<40 weak, 40..<70 progress, >=70 mastered), `clampMastery`, `getMasteryStatus`.
- `src/lib/algorithms/bkt.ts` — `BKTModel`, `buildMasteryCurve(answers)`, `CURVE_INITIAL_P_LEARNED = 0.1`. Dites di `bkt.test.ts`.
- `src/page/dashboard/` — dashboard v2 dengan **mock data**: `Index`, `DashboardTopBar` (navbar pill), `HeroCard`, `ProgressCard`, `MasteryCurve` (SVG), `TopicCard`, `EmptyState`, `useCountUp`, `statusStyle`, `dashboardLogic`, `mockData`, `types`.
- Tes: `npm run test` (Vitest, 51 tes). Visual: `npm run screenshot` (butuh server dev; lihat catatan lingkungan).
- Rencana yang dieksekusi: `docs/superpowers/plans/2026-10-14-dashboard.md` (v1) dan `2026-10-14-dashboard-v2.md`. Tidak ada commit; semua masih di working tree branch `main`.

### Keputusan UI dashboard (hasil diskusi)
- Referensi tampilan dari user: `.kiro/something/7a7730c4eaf18f138ae091a59f45747a.jpg` (dashboard "Swaraloka": navbar pill, grid bento, palet netral). Diambil: struktur dan kelonggarannya; tidak diambil: kartu affiliate, grafik jam belajar.
- Palet tenang: latar cream, kartu putih, satu permukaan gelap (hero). Pink hanya untuk aksi/fokus/tautan. Warna status hanya di isi kartu topik, chip, segmen progres, bar hero. Violet hanya untuk seri data grafik.
- **Siswa tidak melihat angka teknis.** Tidak ada "40"/"70" atau istilah BKT di UI. Grafik memakai sumbu 0/50/100 dan satu garis hijau berlabel kata "Dikuasai".
- Grafik: satu titik per jawaban (10 jawaban = 10 titik), titik terisi = benar, kosong = salah; nilai awal BKT tidak digambar; label kiri "Mulai" (atau "Soal N" bila riwayat dipotong 30 jawaban), kanan "Terbaru".
- Mock hanya berisi set penuh: `QUESTIONS_PER_SET = 10` jawaban per topik; "soal dijawab" = total jawaban tercatat. Aturan produk: semua soal dalam satu sesi (diagnostic) wajib dijawab.
- Navbar hanya Dashboard dan Topik (Peta/AI Tutor disembunyikan sampai route-nya ada).
- Tombol hero dan kartu topik sementara menuju `/topicSelect` lewat `topicHref` (satu-satunya tempat yang diganti saat route Journey ada).

### Umpan balik user yang belum diselesaikan
- User menyatakan (18:46) **masih kurang suka dan kurang setuju** dengan hasil visual dashboard. Bagian yang tidak disukai belum ditanyakan. Tanyakan dulu sebelum mempoles lebih jauh; jangan anggap dashboard sudah final.
- User meminta rumus BKT **dikesampingkan dulu**. Catatan terbuka untuk nanti (lihat juga `03-bkt-algorithm.md`): kurva zigzag karena parameter default belum dikalibrasi (satu jawaban salah bisa menurunkan 72% menjadi 34%); definisi "dikuasai" UI (70%) berbeda dari `isMastered(0.95)`; nilai awal kurva 10% adalah asumsi demo.

### Belum dikerjakan
- Halaman Topik `/topicSelect` (masih placeholder; dua tautan di dashboard bergantung padanya), diagnostic, Journey, Knowledge Map, AI Tutor.
- Data Supabase untuk dashboard (`student_progress`, `student_answers`), migrasi database.
- `ProtectedRoute` masih dikomentari di `App.tsx`, jadi `/dashboard` bisa dibuka tanpa login. Aktifkan sebelum demo.
- Kolom `questions.source` (manual/ai) sudah tercatat di dokumen skema tetapi ditunda oleh user; belum ada migrasi.

### Catatan lingkungan (supaya tidak mengulang masalah)
- Server dev lama di port 5173 punya cache dependensi basi (halaman putih, 504 "Outdated Optimize Dep"). Jalankan server sendiri: `npm run dev -- --port 5174 --strictPort`, lalu `BASE_URL=http://localhost:5174 npm run screenshot`; matikan hanya server yang kita mulai.
- Tool baca gambar meng-cache per nama file: salin screenshot ke nama baru sebelum dibaca ulang.
- Windows PowerShell 5.1: `Get-Content`/`Set-Content` tanpa `-Encoding` merusak karakter non-ASCII (mis. `§`). Edit file teks dengan tool tulis atau `node`, bukan `Set-Content`.
- Browser untuk screenshot: Microsoft Edge yang sudah terpasang lewat `playwright-core` (tanpa unduhan browser).


## Skala dashboard diperkecil (2026-10-14, malam)

- Rencana: `docs/superpowers/plans/2026-10-14-dashboard-scale-down.md` (dieksekusi native, tanpa commit). Hanya `src/page/dashboard/*`, penambahan class di `src/index.css`, dan `scripts/screenshot.mjs`; Auth dan default `.btn-primary`/`.badge-*` tidak disentuh.
- Hasil ukur (`?demo=budi`): tinggi halaman desktop 1143 -> 927px, tablet 1573 -> 1276, mobile 2004 -> 1613. Teks di bawah 12px: 4 -> 0. Target sentuh < 44px (emulasi `TOUCH=1`): 0. Target rencana <= 900px di desktop meleset 27px; tidak diperkecil lagi tanpa konfirmasi user.
- Keputusan: enam tingkat font (12/14/16/20/24/48), container `max-w-6xl`, `.btn-sm` dan `.badge-sm` sebagai modifier, kontrol 36px di desktop dan 44px di layar sentuh lewat `pointer-coarse:`. Panah dekoratif di kartu topik tetap 32px (seluruh kartu adalah tautannya).
- Temuan: aturan global `h1..h4 { letter-spacing: -0.03em }` di `index.css` tidak berlapis, jadi mengalahkan utilitas `tracking-*` (terbukti: h2 hero ber-kelas `tracking-[-0.02em]` tetap terhitung -0.03em). Di dashboard dipakai sufiks important `tracking-[...]!`. Aturan global sengaja tidak diubah karena akan mengubah tampilan Auth (`tracking-[-0.07em]` di h1-nya selama ini tidak berlaku).
- `npm run screenshot` kini mencetak metrik per viewport (tinggi, teks < 12px, letter-spacing) dan keluar dengan kode 1 untuk teks kecil atau target sentuh kecil. Metrik diambil sebelum screenshot penuh (tangkapan penuh mengubah ukuran viewport dan membuat transisi `min-height` terukur setengah jalan).
- Umpan balik "kurang suka" dari user belum tentu terselesaikan oleh perubahan ukuran ini saja; tanyakan bagian lain yang tidak disukai.
- Auth page ikut diperkecil (2026-10-14, malam): h1 cerita `clamp(42,5.2vw,72)` -> `clamp(32,3.7vw,48)` (3 baris -> 2), h2 form `clamp(30,3vw,42)` -> `clamp(24,2.3vw,30)` (1 baris di desktop), orbit 126 -> 96px, form `max-w` 410 -> 380, input `py-3` -> `py-2.5`, teks 11px -> 12px (kicker, "Lupa kata sandi?", catatan bawah). Kelas `tracking-[-0.07em]`/`[-0.065em]` di Auth dihapus karena mati (kalah dari aturan global h1-h4, efektif -0.03em); tampilan tidak berubah dari sisi itu. Warna tab nonaktif dan catatan bawah diganti `--color-muted` (sebelumnya #aaa0a9/#a69ca6, kontras ~2.5:1). Target sentuh (tab, toggle sandi, "Lupa kata sandi?", "Daftar sekarang") >= 44px di layar sentuh. Metrik `/auth`: teks < 12px 4-5 -> 0, target sentuh kecil 5 -> 0. Belum dicek visual: mode Daftar dan pesan sukses/galat.
## Navbar tengah + kartu Jelajahi topik (2026-10-15, dini hari)

- Rencana: `docs/superpowers/plans/2026-10-14-navbar-explore-card.md` (dieksekusi native, tanpa commit).
- Navbar kini grid tiga kolom `minmax(0,1fr) auto minmax(0,1fr)`: brand kiri, pill Dashboard/Topik tepat di tengah (`npm run screenshot` mencetak `navOffset`; baseline 44.6/133/317px di 360/768/1280, sesudah 0.0px di semua viewport dan skenario). Batas: dengan 3 item navigasi pemusatan masih muat di HP 360px (perkiraan); item ke-4 sebaiknya pindah ke bottom nav.
- Tautan "Jelajahi topik" di judul "Topikmu" dihapus. Grid hanya menampilkan topik yang sudah dimulai (`startedTopics`, dites, 55 tes) dan ditutup `ExploreCard` (garis putus-putus, tanpa bayangan, ikon plus). Grid `sm:2 lg:4` kolom; 4 topik dimulai + kartu Jelajahi (skenario `sari`) membuat kartu Jelajahi sendirian di baris kedua; belum diputuskan apakah itu perlu ditangani.
- **Konsekuensi:** kartu topik terkunci tidak lagi tampil di dashboard (data `locked` tetap di tipe dan mock untuk halaman Topik). Bukti "prasyarat mengunci/membuka topik" (kriteria demo #5) belum terlihat di aplikasi mana pun sampai `/topicSelect` dibangun. Cabang terkunci di `TopicCard` dihapus; entri `locked` di `statusStyle.ts` dibiarkan untuk halaman Topik.
- Skrip screenshot: `navOffset` mengukur pill (kiri link pertama sampai kanan link terakhir), bukan kotak `<nav>` yang melebar.
## Diskusi produk, DB, dan tooling (2026-10-14 malam; BELUM ada keputusan akhir konsep)

### Database aktual vs keputusan kita
- DB tim: `.kiro/steering/supabase-db-model.md` + migrasi `supabase/migrations/20261013035717_fullSql.sql` (11 tabel: categories, topics int8, learning_goals, learning_paths, learning_path_steps, materials, quiz_questions, quiz_attempts, student_mastery, step_progress, ai_usage_events). Catatan model juga menyebut `users`, `topic_requests`, `diagnostic_assessments`, `diagnostic_answer_keys` yang TIDAK ada di migrasi yang dibaca (belum diverifikasi ke DB hidup).
- Rancangannya mengarah ke path/langkah/diagnostic **per siswa** (dibuat backend/Edge Function): `student_mastery`, `learning_paths`, `learning_path_steps` hanya punya policy SELECT; `quiz_questions.correct_answer` terbuka ke klien (komentar di migrasi).
- Tiga ketidakcocokan dengan keputusan 14 Okt: (1) soal diagnostic per siswa vs "per topik sekali, cache"; (2) BKT di klien butuh policy INSERT/UPDATE di `student_mastery`; (3) tidak ada tempat template skill/langkah per topik (butuh mis. `topic_skills(topic_id, skill_key, nama, urutan)` bila skill ingin stabil). Belum dijawab user.

### Konsep (user masih bingung; ini usulan saya, bukan keputusan)
- "Skill" = kemampuan kecil dalam satu topik (mis. Pecahan: arti pecahan, pecahan senilai, penjumlahan, perkalian, soal cerita). BKT dihitung per `skill_key`; AI tidak boleh mengarang nama skill per siswa (hasil tidak sebanding) — daftar 4-6 skill per topik ditulis manual, tersembunyi dari UI.
- Setelah diagnostic siswa mendapat: peta kuat/lemah per skill (+tingkat keyakinan; 1-2 soal per skill = kasar), penjelasan singkat AI, pola kesalahan (miskonsepsi), roadmap berurutan (skill kuat dilewati dan alasannya ditampilkan, lemah lebih dulu, "belum yakin" dicek singkat), satu tombol "Mulai". Roadmap hidup: disusun ulang setelah latihan (`generation_version`). Pemilihan/urutan = aturan dari BKT; AI hanya soal dan kalimat alasan.
- User kemudian menyatakan: tunda "langkah"/jalur titik-titik; langsung diagnostic dengan soal "dynamic" lalu roadmap pengajaran. **Pertanyaan terbuka:** "dynamic" = tiap siswa soal berbeda (generate per siswa, lambat/bisa gagal saat demo/tidak sebanding) atau soal berikutnya menyesuaikan jawaban (adaptif dari bank soal; rekomendasi saya)?

### Tooling
- Serena MCP: `.kiro/settings/mcp.json` diperbaiki ke `serena start-mcp-server` (executable lama `serena-mcp-server` sudah tidak ada). Perlu restart sesi Kiro agar tool termuat. Serena membuat folder `.serena/` yang belum ada di `.gitignore`.
- Skill `grill-me` hanya wrapper ke skill `grilling` yang tidak terpasang di `~/.agents/skills`; isinya diambil dari `mattpocock/skills` (putaran pertanyaan bernomor, tiap pertanyaan dengan jawaban rekomendasi). Launcher `impeccable` kini berfungsi (`impeccable.cmd context`); `PRODUCT.md` belum ada.
## Menunggu keputusan user (2026-10-15, dini hari) — mulai dari sini besok

- User menyukai gambar referensi `.kiro/something/b4d3065a-62f3-4cc0-a1d4-1f1942beeadf.jpg` (kartu "Lanjutkan perjalanan belajarmu": nama topik, deskripsi satu kalimat, progres berlabel, satu tombol; plus hero sapaan besar dan 4 kartu statistik) dan ingin mengganti komponen "Lanjut ke Pecahan" (HeroCard) dengannya.
- Pendapat saya: ambil struktur kartu "Lanjutkan" saja; jangan ambil kicker ("UNTUKMU"), ubin sparkle besar, 4 kartu statistik ber-chip "Statistik" (bertentangan dengan keputusan "bukan 4 stat card" dan membatalkan sebagian perkecilan), dan tombol "Lihat Rekomendasi" (ambigu). "Progres materi 85%" bukan penguasaan: pilih satu ukuran per kartu (rekomendasi: penguasaan, berlabel jelas); "Sesi Belajar" tidak ada di data; "Dasar Pemrograman" dianggap placeholder (MVP = Matematika SMP).
- **Pertanyaan terbuka ke user:** bagian mana yang mengganti HeroCard? (1) hanya kartu "Lanjutkan" (rekomendasi saya), (2) kartu itu + hero sapaan besar, (3) semuanya termasuk 4 kartu statistik. Pilihan saya yang belum disetujui: kartu baru berpermukaan terang (isi bertint), tombol utama gelap sebagai jangkar; `ProgressCard` tetap di kanan. Setelah dijawab: tulis plan di `docs/superpowers/plans/`.
- Masih terbuka juga: arti soal "dynamic" pada diagnostic, dan kartu Jelajahi yang sendirian di baris kedua pada skenario `sari`.

## Landing page + perluasan topik (2026-10-15, pagi)
- Brainstorming landing page dimulai (skill brainstorming, frontend-design, impeccable mode Persuade). Belum ada kode; desain akan ditulis di docs/superpowers/specs/ setelah disetujui.
- Route '/' masih placeholder (src/page/Index.tsx). Tidak ada library animasi; aset gambar di repo hanya sisa template Vite. Aset utama yang direncanakan: komponen produk asli (kurva penguasaan, kartu topik) + demo mini interaktif (3-4 soal, BKT sungguhan di browser) + vektor geometris meneruskan orbit Auth. Tidak memakai stok ilustrasi/foto.
- Target landing: mahasiswa/orang yang belajar mandiri; rasa yang dituju: efisien, menarik, tanpa ribet, jalur sesuai kemampuannya. Pesan inti: yang sudah dikuasai dilewati.
- Keputusan perluasan topik: topik tidak lagi terbatas Matematika SMP. Katalog multi-kategori (Pemrograman dasar sampai lanjut, pelajaran SMP, SMA, dll.), tetap seeded (bukan AI per user). Strategi "sedikit tapi dalam": tiap topik yang dibuka harus lengkap (4-6 skill, soal diagnostic+latihan per skill dicek manual, materi singkat); topik yang belum lengkap tidak ditampilkan/ditandai "segera hadir". Jumlah topik final belum diputuskan (kemungkinan 20+). Target pengguna utama bergeser ke mahasiswa/orang dewasa muda yang belajar mandiri (bukan hanya siswa SMP). Topik demo mini di landing page: Dasar Pemrograman. Data saat ini masih hardcoded/mock, belum tersambung ke Supabase.
- Terbuka: nama brand ('SkillPath AI' masih placeholder); skema skill per topik (tidak ada tabel topic_skills; quiz_questions hanya punya skill_key + material_id/step_id, tanpa topic_id).
- Jangan menyalin dari Auth ke landing: kicker di atas judul dan satu kata beraksen di headline.

- (2026-10-15) Spec landing: docs/superpowers/specs/2026-10-15-landing-page-design.md; plan: docs/superpowers/plans/2026-10-15-landing-page.md. Keputusan user: demo tontonan (bukan interaktif), harga Pro "segera hadir" tanpa angka, section: nav, hero, demo, topik, harga, FAQ, penutup+footer. Menunggu persetujuan plan.


## Landing page terimplementasi (2026-10-15, siang)
- Kode di `src/page/landing/` (Nav, Hero+PathPreview, DemoSection, Topics, Pricing, FAQ, Closing, Footer; logika `demoScript.ts` dites, `useDemoPlayback.ts`, `catalog.ts`), `src/lib/brand.ts` (`BRAND_NAME`), `src/page/Index.tsx` merender `LandingPage`, `index.html` (lang id, title, meta description). Tanpa dependensi baru.
- Interaktif di luar spec awal (atas permintaan user "lebih interaktif"): demo bisa di-scrub (stepper kiri + titik), jeda/putar ulang; di frame akhir pengunjung bisa mengganti jawaban Raka (Benar/Salah) dan jalur diurutkan ulang dengan animasi (BKT sungguhan); filter kategori di Topik; FAQ `<details>`. Transisi masuk memakai varian Tailwind `starting:` (tanpa library).
- Verifikasi: build, lint, 62 tes lulus; `npm run screenshot -- /` 360/768/1280: overflow 0, teks <12px 0, target sentuh kecil (TOUCH=1) 0. `navOffset` mobile 180px bukan masalah (nav jangkar disembunyikan < md; metrik itu untuk dashboard).
- Terbuka: klaim "AI Tutor dengan batas harian" di paket Gratis belum benar (AI Tutor belum ada); nama brand; belum ada commit.

- (2026-10-15, siang) Section landing setinggi layar: hero `min-h-svh` di semua ukuran; section lain `lg:min-h-svh` dengan isi di tengah (min-height, bukan tinggi tetap; di bawah lg tinggi alami karena isi lebih tinggi dari layar); penutup + footer berbagi layar terakhir. Panel demo di lg dibagi dua kolom (tahap kiri, meter kanan) agar muat 800px; baris bantuan di bawah meter selalu tampil supaya panel tidak melompat. Terukur di 1280x800/1440x900: tiap section = tinggi layar; 1366x768: Topik 782px (lebih 14px). Tanpa scroll-snap (sengaja).


## Diagnostic adaptif: keputusan (2026-10-15, siang)
- Jumlah soal fleksibel, ditentukan algoritma, bukan AI. BKT per skill (cocok dengan `student_mastery.skill_key`; skill_key harus unik global, mis. `dasar-pemrograman.perulangan`).
- Aturan: min 2 / maks 4 soal per skill; berhenti bila P(L) >= 85% atau <= 20%; maks 20 soal per topik; prior 50%. Ambang berhenti (keyakinan) berbeda dari ambang status UI (40/70).
- Contoh angka bkt.ts dari 50%: B=80, BB=94, SS=13, BS=42, BSS=18.
- AI membuat bank 5-8 soal per skill (dicek manual); algoritma memilih urutan.
- Konsekuensi landing: teks 'Satu soal per skill' di DemoSection tidak akurat lagi; demo Raka perlu memperlihatkan soal tambahan. Belum dikerjakan.


- (2026-10-15) Mesin diagnostic: src/lib/algorithms/diagnostic.ts (startDiagnostic/nextQuestion/answerQuestion/getResults, selang-seling antar-skill, aturan 2-4 soal/skill, stop 85/20, maks 20) + learningPath.ts (dipakai bersama demo landing). Plan: docs/superpowers/plans/2026-10-15-diagnostic-engine.md. Belum ada UI/bank soal.


## Konten & alur belajar (2026-10-15, siang)

- Struktur konten: Topik -> Unit (3-5 per topik) -> Skill (3-5 per unit), tiap skill punya prasyarat (harus skill sebelumnya). `skill_key` global berformat `<topik>.<skill>` (mis. `dasar-pemrograman.variabel`).
- Saat masuk topik, user memilih "Mulai dari awal" (tanpa tes, belajar dari skill pertama) atau "Cek kemampuanku dulu" (satu tes). Tes berjalan bertahap per unit dari Unit 1, berhenti di unit pertama tempat user lemah (unit sesudahnya dianggap belum dikuasai), maks 20 soal. User hanya melihat satu pilihan + satu tes; unit/prasyarat bekerja di belakang layar.
- Alur belajar = mastery learning: skill terbuka setelah prasyaratnya dikuasai; per skill: materi singkat -> contoh -> latihan adaptif sampai BKT yakin; checkpoint campuran di akhir unit; gagal checkpoint di satu skill membuka ulang skill itu.
- Target topik pertama "Dasar Pemrograman": pemula total, Python. Peta 5 unit/17 skill — Fondasi (output, variabel, tipe-data, input-konversi), Ekspresi & keputusan (operator-aritmatika, perbandingan-logika, percabangan), Perulangan (for-range, while, akumulator), Kumpulan data (list-dasar, menelusuri-list, string-urutan), Fungsi (def-return, parameter, return-vs-print, variabel-lokal). `break`/`continue` sengaja dibuang untuk pemula. Demo cukup Unit 1-3.
- Standar kualitas konten (anti AI slop): soal menguji kemampuan (tebak output, tebak error, pilih kode) bukan definisi; tiap pilihan salah mewakili miskonsepsi nyata pemula + feedback spesifik; penjelasan menjawab "kenapa"; semua kode dijalankan untuk verifikasi (`npm run content:verify`, Python); materi pendek berbasis contoh (goal, 3 paragraf, contoh, 2 jebakan, catatan, satu "tebak dulu"); kode materi tidak boleh sama dengan kode soal; bank 8-9 soal per skill; tim adalah penilai akhir.
- Konten disimpan sebagai JSON di `src/content/<topik>/` (`topic.json` + `skills/<skill>.json`, format di `src/content/types.ts`), baru diubah ke seed Supabase setelah skema tim pasti (butuh tabel skill per topik dan relasi soal ke topik/skill — belum ada di `supabase-db-model.md`).
- Skill contoh `skills/variabel.json` (9 soal) sudah ditulis model utama. Menunggu kritik user sebelum panduan gaya (`docs/content-style-guide.md`) dibekukan dan skill lain ditulis.
- Konsekuensi ke mesin (belum dikerjakan): `learningPath.ts` harus mengikuti prasyarat dulu baru penguasaan terendah; `diagnostic.ts` perlu mode bertahap per unit (berhenti di unit lemah) dan mode "Mulai dari awal" (tanpa tes).
- Plan: `docs/superpowers/plans/2026-10-15-content-dasar-pemrograman.md` (T1 format+validator+verifier sedang dikerjakan, T2 skill variabel selesai menunggu kritik, T3-T10 menyusul).


- (2026-10-15) Plan seed data: docs/superpowers/plans/2026-10-15-seed-data.md (JSON repo = sumber kebenaran; 1 materials per skill sebagai jembatan topik->soal; UUID v5 deterministik; upsert idempoten; tanpa DELETE; tes kontrak enum migrasi; 10 soal/skill; policy student_mastery & seed hosted = gated). Belum dieksekusi.
