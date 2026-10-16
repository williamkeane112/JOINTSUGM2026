# SkillPath AI - Agent Instructions

This is a **hackathon project** for an adaptive learning platform using Bayesian Knowledge Tracing (BKT). Timeline: **4 weeks MVP**.

---

## Aturan Kerja Agent (efisiensi & biaya) — BACA PERTAMA

Bagian ini mengatur *cara* agent bekerja. Berlaku untuk model apa pun yang sedang aktif (Opus, Sonnet, dst.).

### 1. Selalu cek skills dulu

Folder skills: `C:\Users\Lenovo\.agents\skills\` (tidak otomatis dimuat Kiro; **harus dibaca manual** dengan tool `read`).

Sebelum tugas non-trivial (plan, UI, debug, eksekusi multi-langkah):

1. Lihat daftar folder skills (daftar bisa berubah; jangan percaya snapshot).
2. Baca `SKILL.md` skill yang relevan **sampai habis**, termasuk file referensi yang ditautkan.
3. Terapkan metodologinya. Sebut singkat skill mana yang dipakai.

Pemetaan cepat:

| Situasi | Skill |
| --- | --- |
| Ide/fitur baru, belum jelas | `brainstorming`, `grill-me` |
| Menulis plan | `writing-plans` |
| Menjalankan plan yang sudah ada | `executing-plans`, `subagent-driven-development` |
| Beberapa pekerjaan independen | `dispatching-parallel-agents` |
| UI / frontend | `frontend-design`, `impeccable` (fallback: `impeccable/reference/craft-floor.md`) |
| Bug / tes gagal | `systematic-debugging`, `diagnose` |
| Fitur / perbaikan bug | `test-driven-development` |
| Sebelum menyatakan selesai | `verification-before-completion` |
| Review | `requesting-code-review`, `receiving-code-review` |
| Cabang / worktree | `using-git-worktrees`, `finishing-a-development-branch` |

Catatan: `grill-me` hanya wrapper ke skill `grilling` yang tidak terpasang; pakai isinya sebagai putaran pertanyaan bernomor dengan jawaban rekomendasi.

### 2. Pemisahan peran: model mahal berpikir, model murah mengetik

Prinsip: **tahap berpikir pakai model utama (mahal); tahap mekanis pakai subagent berbasis model lebih murah.**

Model utama (yang sedang dipakai user) mengerjakan sendiri:
- Brainstorming, keputusan arsitektur/produk, menulis plan.
- **Menulis kode implementasi yang menentukan kualitas hasil, terutama UI** (lihat "Aturan kode UI" di bawah).
- Debugging yang akar masalahnya belum diketahui.
- Review akhir dan keputusan lulus/tidak.
- Apa pun yang butuh penilaian atau trade-off.

#### Aturan kode UI (WAJIB model utama yang menulis)

Semua kode yang menentukan tampilan dan rasa pakai ditulis dan di-*write* langsung oleh model utama, **tidak boleh didelegasikan**, walaupun plan-nya sudah ada:
- Komponen/halaman React baru dan perubahan visual (`src/page/**`, `src/components/**`): layout, hierarki, spacing, tipografi, warna, bayangan, radius, animasi/transisi, state kosong/loading/galat, responsif, aksesibilitas.
- Perubahan `src/index.css` (token, class `.btn-*`, `.card`, `.badge-*`, dst.) dan copy/teks yang tampil ke pengguna.
- Perbaikan polesan visual setelah review screenshot.
Alasan: kualitas desain (kedalaman, kerapian, kecantikan) tidak bisa diturunkan menjadi diff mekanis; model murah cenderung menghasilkan tampilan generik. Sebelum menulis, baca skill `frontend-design` dan `impeccable` (§1).

Subagent murah **boleh** menyentuh area UI hanya untuk hal non-visual: menjalankan `npm run screenshot` dan melaporkan metriknya, menjalankan tes/lint/build, atau rename/pindah file tanpa mengubah isi tampilan.

Delegasikan ke subagent model murah (`model` di stage `subagent`) bila **semua** ini benar:
- Sudah ada plan / spesifikasi tertulis (mis. `docs/superpowers/plans/*.md`) atau instruksi yang sudah final.
- Pekerjaannya mekanis dan **bukan kode UI**: logika non-visual yang sudah dirinci (util, tipe, service `src/lib/api/`, migrasi dari SQL yang sudah ditulis), rename, memindah file, menambah tes dari kasus yang sudah dirinci, memperbarui dokumen, menjalankan `npm run test` / `build` / `lint` dan melaporkan hasilnya.
- Keluarannya bisa diverifikasi (tes, build, atau diff kecil).

Jangan didelegasikan (kerjakan sendiri): kode UI (di atas), perubahan 1-2 baris (overhead subagent lebih mahal dari hasilnya), tugas yang masih butuh keputusan desain, dan perubahan keamanan (RLS, auth).

### 3. Cara mendelegasikan dengan benar

- Pakai tool `subagent`, role `kiro_default`, isi `model` dengan model **terkecil/termurah yang tersedia** (kelas Haiku; mis. `claude-haiku-*`). Nama ID persisnya cek lewat `/model`; jangan menebak. Jika ID tidak valid, pakai model satu tingkat di atasnya, bukan model utama.
- Model dengan kapabilitas lebih rendah hanya dipakai untuk eksekusi. Naikkan ke model menengah (kelas Sonnet) bila tugas menyentuh banyak file yang saling bergantung atau subagent murah gagal dua kali.
- Subagent **tidak berbagi konteks** dengan agent utama dan **tidak bisa memanggil subagent lain**. Prompt tiap stage harus berdiri sendiri:
  1. Tujuan satu kalimat.
  2. Path file yang boleh disentuh (dan yang dilarang).
  3. Kode/diff/langkah persis yang harus ditulis, atau path plan + nomor task yang dikerjakan.
  4. Aturan proyek yang relevan (Tailwind v4, strict TypeScript, tidak ada folder `backend/`, dsb.).
  5. Perintah verifikasi yang harus dijalankan dan kriteria lulus.
  6. Format laporan: file yang diubah, hasil perintah, hal yang tidak bisa diselesaikan.
- Pekerjaan independen (mis. beberapa komponen berbeda) → beberapa stage paralel tanpa `depends_on`; satu stage per file/modul. Pekerjaan yang saling bergantung → pakai `depends_on`.
- Subagent bisa meminta persetujuan tool; beri tahu user bila pipeline tampak macet (`ctrl+g` untuk memantau).
- Fail-fast: satu stage gagal membatalkan stage saudara yang masih berjalan. Jangan memasukkan tugas tak terkait dalam satu pipeline.

### 4. Agent utama tetap bertanggung jawab atas hasil

Hasil subagent adalah **klaim**, bukan bukti. Setelah subagent selesai, agent utama wajib:
1. Membaca diff / file yang diubah (cukup bagian yang relevan, bukan seluruh file).
2. Menjalankan sendiri `npm run test`, `npm run build`, `npm run lint` bila kode berubah (lihat skill `verification-before-completion`).
3. Memperbaiki sendiri selisih kecil; kalau selisihnya besar, tulis ulang instruksi dan delegasikan lagi (maksimal dua kali, lalu kerjakan sendiri).
4. Baru melaporkan "selesai" ke user dengan bukti (output tes/build).

### 5. Hemat konteks dan biaya

- Pakai tool pencari (`grep`, `glob`, `code`) untuk menemukan lokasi, lalu baca hanya bagian yang perlu (`offset`/`limit`). Jangan membaca `docs/PROJECT_PLAN.md` (2050 baris) utuh kecuali diminta.
- Penelusuran luas (banyak file, banyak kandidat) → delegasikan ke subagent murah dengan permintaan ringkasan pendek, supaya konteks utama tetap bersih.
- Gabungkan edit yang saling terkait, baru jalankan build/tes sekali.
- Pemanggilan tool yang independen dijalankan paralel dalam satu blok.
- Catat keputusan dan status penting di bagian bawah `.kiro/steering/session-progress.md` (bukan di percakapan), agar sesi berikutnya tidak mengulang pekerjaan.
- Jangan membuat file markdown baru kecuali diminta atau diwajibkan skill (mis. plan di `docs/superpowers/plans/`).
- Jangan commit kecuali user meminta.

### 6. Alur standar untuk fitur baru

1. Cek skills (§1) → `brainstorming` bila belum jelas → **model utama** menulis plan di `docs/superpowers/plans/YYYY-MM-DD-nama.md` (`writing-plans`).
2. User menyetujui plan.
3. Eksekusi plan (`executing-plans` / `subagent-driven-development`): task mekanis → **subagent murah**, task yang butuh penilaian → model utama.
4. Model utama meninjau diff, menjalankan tes/build, dan (untuk UI) `npm run screenshot` (lihat catatan lingkungan di `session-progress.md`).
5. `verification-before-completion` → laporkan ke user.



---

## Project Identity

**Name**: SkillPath AI  
**Type**: Adaptive Learning Web Application  
**Core Innovation**: Bayesian Knowledge Tracing (BKT) algorithm for personalized learning paths  
**Target**: Hackathon MVP (4 weeks)  
**Subject**: Multi-kategori (Pemrograman, pelajaran SMP/SMA, dll.) — seed "sedikit tapi dalam"; tiap topik dibuka hanya kalau isinya lengkap (keputusan 2026-10-15)

---

## Architecture Overview

### Full Supabase Stack (NO separate backend!)
- **Frontend**: React 18+ + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Algorithm**: Client-side TypeScript (BKT runs in browser)
- **AI Service**: OpenAI/Claude API (direct or via Edge Function)

### Critical: NO Node.js Express, NO Python FastAPI
All business logic lives in `/src/lib/`:
- `lib/supabase.ts` - Supabase client
- `lib/api/` - Service layer (auth, topics, progress, etc.)
- `lib/algorithms/` - BKT, recommendation engine
- `lib/types.ts` - TypeScript types

---

## Core Features (P0 - MUST HAVE)

1. **Topic Select** (`/topicSelect`, topik seeded) → **Diagnostic Test per topik** (~5-8 soal, bank soal AI di-cache) → AI menyusun Journey berlevel → initial mastery per topik (detail: `.kiro/steering/01-mvp-scope.md`)
2. **Knowledge Map** - Visual representation with 🔴🟡🟢 status
3. **Adaptive Learning Path** - Recommends topics based on mastery + prerequisites
4. **Adaptive Exercises** - Questions adjust to student level, BKT updates in real-time
5. **AI Tutor** - Context-aware explanations, hints (no direct answers)
6. **Progress Dashboard** - Overall progress, topic breakdown, recommendations

---

## Database Schema (PostgreSQL)

### Core Tables: rancangan awal (7 tabel, UUID)
> **DB aktual berbeda dari daftar ini.** Pegang `.kiro/steering/supabase-db-model.md` dan `supabase/migrations/` saat menulis kode data: `topics`/`categories` memakai `int8`, ada `learning_goals`, `learning_paths`, `learning_path_steps`, `quiz_questions`, `quiz_attempts`, `student_mastery` (per `skill_key`), `step_progress`. Tidak ada `student_progress`/`student_answers`.
1. `users` - Managed by Supabase Auth (auth.users)
2. `topics` - Subject topics (contoh lama/hardcoded: Operasi Dasar, Pecahan, Persamaan Linear — katalog sekarang multi-kategori, lihat keputusan 2026-10-15)
3. `prerequisites` - Topic dependencies
4. `questions` - Test & exercise questions (JSONB options)
5. `student_progress` - BKT state (p_learned, p_guess, p_slip, mastery_level)
6. `student_answers` - Answer history
7. `learning_materials` - Content per topic

### IMPORTANT: Row Level Security (RLS)
ALL tables MUST have RLS policies:
```sql
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON student_progress FOR SELECT
USING (auth.uid() = user_id);
```

---

## BKT Algorithm (Client-Side TypeScript)

### Location: `/src/lib/algorithms/bkt.ts`

### Core Parameters
- **P(L)**: Probability of mastery (0-1)
- **P(T)**: Learning rate (~0.1)
- **P(G)**: Guess probability (~0.25)
- **P(S)**: Slip probability (~0.1)

### Update Formulas
```typescript
// After CORRECT answer:
P(L|correct) = P(L) * (1 - P(S)) / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]

// After WRONG answer:
P(L|wrong) = P(L) * P(S) / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]

// Apply learning:
P(L_new) = P(L|answer) + (1 - P(L|answer)) * P(T)
```

### Mastery Thresholds
- 🔴 Not Mastered: < 40%
- 🟡 In Progress: 40-70%
- 🟢 Mastered: > 70%

---

## Coding Standards

### TypeScript/React
- Use TypeScript **strict mode**
- Functional components with hooks only
- PascalCase for components, camelCase for files
- Destructure props, use async/await
- One component per file, focused and single-purpose

### Tailwind CSS v4 (CRITICAL!)
- Uses `@tailwindcss/vite` plugin, NOT PostCSS
- Custom classes in `src/index.css` (@layer components):
  - `.btn-primary`, `.btn-secondary`, `.btn-success`
  - `.card`, `.card-hover`
  - `.input`
  - `.badge-mastered`, `.badge-progress`, `.badge-not-mastered`, `.badge-locked`
- Color scheme (lihat `docs/DESIGN.md` §3): pink `#FF4F87` (primary), violet `#6D36BD` (secondary/XP), warm emerald `#1E9E6B` (mastered), warm amber `#E8A33D` (in progress), warm coral `#E2544B` (not mastered) — **bukan** `blue-500`/`green-500` Tailwind default

### Supabase Patterns
- Always use Supabase JS Client, not raw SQL
- Handle auth with `supabase.auth.onAuthStateChange()`
- Use RLS policies for security
- Validate data with Zod before insert/update

---

## What NOT to Build (Skip for MVP)

❌ Topik/kategori yang belum lengkap isinya (seed "sedikit tapi dalam" — keputusan 2026-10-15; multi-kategori boleh, tapi tidak ditampilkan/ditandai "segera hadir" sampai lengkap)  
❌ Teacher dashboard  
❌ Complex gamification (XP, leaderboard)  
❌ Video call features  
❌ Mobile app (web only)  
❌ Separate Node.js/Python backend  
❌ Custom auth (use Supabase Auth)  

---

## File Organization Rules

### Frontend Structure
```
src/
├── components/        # UI components (diagnostic, knowledge-map, learning, ai-tutor, dashboard)
├── page/             # Page-level components (nama folder aktual: src/page/; dashboard/ sudah ada, auth/, TopicSelected/)
├── lib/              # ⚠️ ALL business logic here!
│   ├── supabase.ts          # Client init
│   ├── api/                 # Service layer
│   │   ├── auth.ts
│   │   ├── topics.ts
│   │   ├── progress.ts
│   │   ├── questions.ts
│   │   └── aiTutor.ts
│   ├── algorithms/          # BKT & recommendation
│   │   ├── bkt.ts
│   │   ├── recommendation.ts
│   │   └── prerequisite.ts
│   └── types.ts             # TypeScript types
├── hooks/            # Custom React hooks
└── utils/            # Helper functions
```

### Supabase Structure
```
supabase/
├── migrations/       # Database schema (numbered SQL files)
└── functions/        # Edge Functions (optional)
```

### ⚠️ DO NOT CREATE:
- ❌ `/backend/` folder
- ❌ `/api/` folder at root
- ❌ `/server/` folder
- ❌ `/algorithm-engine/` folder

---

## Development Workflow

### Initial Setup Commands
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install other dependencies
npm install react-router-dom zustand react-hook-form zod recharts

# Setup Supabase project (after creating on supabase.com)
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### Environment Variables (.env.local)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-key  # or VITE_ANTHROPIC_API_KEY
```

---

## When Generating Code

### Always Check:
1. ✅ Using Supabase client, not fetch/axios
2. ✅ UUID for primary keys, not INT
3. ✅ RLS policies enabled
4. ✅ TypeScript strict mode
5. ✅ Tailwind v4 syntax (`@import "tailwindcss";`)
6. ✅ Code in `/src/lib/` not `/backend/`
7. ✅ BKT calculations client-side

### Never Do:
1. ❌ Create Express server
2. ❌ Create Python FastAPI service
3. ❌ Use MySQL (PostgreSQL only)
4. ❌ Use Axios (use Supabase client)
5. ❌ Custom JWT implementation
6. ❌ INT AUTO_INCREMENT (use UUID)

---

## Testing Checklist

### Before Committing
- [ ] Frontend starts: `npm run dev`
- [ ] Unit tests pass: `npm run test`
- [ ] Build and lint pass: `npm run build`, `npm run lint`
- [ ] Visual review: server dev di port bebas (`npm run dev -- --port 5174 --strictPort`), lalu `BASE_URL=http://localhost:5174 npm run screenshot`
- [ ] Supabase connection works
- [ ] Auth flow: register/login/logout
- [ ] BKT calculations correct with sample data
- [ ] Tailwind classes render
- [ ] RLS policies work (can't access other users' data)

### For Demo Day
- [ ] 2 students show different diagnostic results
- [ ] Different learning paths based on mastery
- [ ] Mastery increases after correct answers
- [ ] AI Tutor gives context-aware responses
- [ ] Prerequisites lock/unlock correctly

---

## Success Criteria (Demo Day)

1. **Algorithm Works** - BKT correctly calculates mastery
2. **Personalization Visible** - Different students → different paths
3. **AI Tutor Quality** - Context-aware, helpful, no direct answers
4. **UX Smooth** - Clear flow: diagnostic → learning → progress
5. **Technical Solid** - No crashes, proper errors, responsive
6. **Security** - RLS prevents unauthorized access

---

## Priority Order

1. **Algorithm Accuracy** > Feature Completeness > UI Polish
2. **Core P0 Features** > Nice-to-haves
3. **Working Demo** > Perfect Code
4. **Supabase Integration** > Custom Backend

---

## Reference Documents

- **Planning**: `docs/PROJECT_PLAN.md` (2050 lines) - Complete technical specs
- **Guidelines**: `.kiro/steering/skillpath-ai-supabase.md` (749 lines) - Architecture & patterns
- **Progress**: `.kiro/steering/session-progress.md` - What's been done
- **Navigation**: `.kiro/steering/00-NAVIGATION.md` - Where to find what
- **MVP Scope**: `.kiro/steering/01-mvp-scope.md` - Core features quick ref
- **Database**: `.kiro/steering/02-database-schema.md` - PostgreSQL schema
- **Algorithm**: `.kiro/steering/03-bkt-algorithm.md` - BKT implementation

> **💡 TIP**: Baca `00-NAVIGATION.md` untuk tahu file mana yang berisi info apa.

---

## Quick Reminders

- **Timeline**: 4 weeks MVP (currently Week 1)
- **Architecture**: Full Supabase (no separate backend)
- **Database**: PostgreSQL with UUID
- **Algorithm**: Client-side TypeScript (not Python)
- **Tailwind**: v4 with Vite plugin
- **Scope**: Multi-kategori topik, seed "sedikit tapi dalam" (keputusan 2026-10-15, lihat `session-progress.md`)
- **Goal**: Prove BKT-based personalization works

---

## Communication Style

When helping with this project:
- Be direct and concise
- Focus on MVP scope (skip nice-to-haves)
- Reference steering files for details
- Verify Supabase patterns (no backend folder!)
- Always use TypeScript strict mode
- Keep BKT algorithm client-side
- Use Tailwind v4 syntax

---

**Last Updated**: 2026-10-15  
**Status**: Week 1 — Dashboard v2 (mock data, sudah diperkecil, navbar tengah, kartu Jelajahi topik) dan Auth (diperkecil) terimplementasi; belum final menurut user. Konsep diagnostic/roadmap belum diputuskan. Halaman Topik, diagnostic, roadmap, dan data Supabase belum. Scope topik diperluas ke multi-kategori (keputusan 2026-10-15). Brainstorming landing page sedang berjalan. Lihat bagian paling bawah `session-progress.md`.
