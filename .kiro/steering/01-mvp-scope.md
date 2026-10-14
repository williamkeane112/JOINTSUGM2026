# MVP Scope & Core Features

> **Purpose**: Quick reference untuk scope MVP dan fitur utama yang WAJIB ada.

---

## Executive Summary

Platform pembelajaran adaptif berbasis AI yang menggunakan algoritma Bayesian Knowledge Tracing (BKT) untuk personalisasi pembelajaran per siswa.

**USP**: Dua siswa dengan kemampuan berbeda akan mendapatkan jalur pembelajaran yang berbeda - sistem secara aktif mengukur, menganalisis, dan menyesuaikan pembelajaran.

---

## Problem Statement

1. **Siswa tidak tahu kelemahan mereka** — tidak aware topik mana yang lemah
2. **Pembelajaran one-size-fits-all** — semua siswa dapat materi sama
3. **Guru kesulitan monitoring individual** — sulit track 30+ siswa
4. **Tidak ada personalisasi** — platform existing hanya materi statis

---

## MVP Focus

**Timeline**: 4 minggu
**Subject**: Matematika SMP (1 subject only)
**Topics**: 3-5 topik (Operasi Dasar, Pecahan, Bilangan Bulat, Persamaan Linear, Statistika)
**Architecture**: Full Supabase (no separate backend)

---

## Core Features (P0 — MUST HAVE)

### 0. Topic Select (`/topicSelect`) — keputusan 2026-10-14
- Topik **bawaan (seeded di tabel `topics`)**, BUKAN dibuat AI. User memilih topik dari katalog.
- Topik yang belum pernah disentuh → diagnostic test topik itu → path disusun → Journey.
- Topik yang sudah pernah disentuh → langsung ke Journey / Dashboard.
- "Ajukan topik baru" = POST-MVP (paling jauh satu form kecil yang menyimpan ke `topic_requests`; tanpa generate apa pun).

### 1. Diagnostic Test (PER TOPIK, bukan global sekali)
- Dipicu saat user pertama kali memasuki sebuah topik (tidak ada baris `student_progress` untuk topik itu)
- ~5-8 soal pilihan ganda, fokus ke satu topik. **Semua soal dalam satu sesi wajib dijawab** sebelum hasil dihitung (keluar di tengah diagnostic = progres hilang, lihat docs/USER_FLOWS.md §3)
- Soal dibuat AI **sekali per topik**, disimpan di `questions` (`source = 'ai'`), dicek manual sebelum dipakai. BUKAN digenerate per user saat runtime → semua siswa dapat bank soal yang sama, hasil bisa dibandingkan, demo tidak bergantung API hidup
- Output: P(L) awal topik tersebut (BKT) → input penyusunan learning path

### 2. Knowledge Map
- Visual peta kemampuan per topik
- Status: 🔴 Not Mastered (<40%), 🟡 In Progress (40-70%), 🟢 Mastered (>70%)
- Shows prerequisites & locked topics
- Recommended next topic berdasarkan BKT

### 3. Adaptive Learning Path (Journey berlevel di dalam topik)
- AI **hanya menyusun urutan + alasan** dari level yang sudah ada; output JSON divalidasi Zod, fallback deterministik dari `recommendation.ts` kalau AI gagal. BKT tetap mesin penentu, AI lapisan penjelas.
- Tampil sebagai journey interaktif (halaman terpisah dari Dashboard)
- Level terbuka karena mastery naik (auto-unlock) — *asumsi saya, belum dikonfirmasi user*: tiap level = skill kecil dengan P(L) sendiri
- Bentuk visual journey **belum diputuskan** — jangan blok pekerjaan Dashboard karenanya
- Adaptive difficulty

### 4. Adaptive Exercises
- Questions adapt to mastery level
- BKT update real-time setelah tiap jawaban
- Immediate feedback dengan explanation

### 5. AI Tutor (Context-Aware)
- Explains concepts dengan konteks materi
- Hints tanpa kasih jawaban langsung
- Step-by-step explanation
- Constrained to curriculum scope

### 6. Progress Dashboard (keputusan 2026-10-14: "pintu ke langkah berikutnya")
- Satu hero gelap (`--color-night`) "Lanjut ke {topik}" = rekomendasi berikutnya + mastery besar (count-up sekali) + 1 tombol
- Kartu progres (kalimat "X dari Y topik dikuasai", bar bersegmen per topik, rata-rata, soal dijawab, streak) — BUKAN 4 stat card
- Grafik penguasaan per soal untuk topik rekomendasi (dihitung BKT dari riwayat jawaban, satu titik per jawaban)
- Grid kartu topik yang sudah dimulai (`TopicCard`: latar terisi sesuai persen penguasaan + chip status + tombol) dan tautan "Jelajahi topik" → `/topicSelect`
- Navbar pill tunggal (Dashboard, Topik, avatar, Keluar) untuk mobile & desktop, BUKAN sidebar; container `max-w-7xl`
- Journey berlevel = halaman terpisah, bukan bagian Dashboard
- Wajib punya empty state (user belum punya topik) & dikerjakan dengan mock data dulu
- Ini menggantikan layout sidebar + 4 stat cards di `docs/DESIGN.md` §14

---

## What NOT to Build (Skip for MVP)

❌ Multiple subjects (Matematika only!)
❌ Teacher dashboard (student view only)
❌ Complex gamification (XP/badges cukup basic)
❌ Video call features
❌ Mobile app (web responsive only)
❌ Custom backend (use Supabase)
❌ Topik yang digenerate AI per user (topik = katalog seeded)
❌ AI menulis JSX/HTML/UI halaman belajar (AI hanya mengisi JSON; komponen React kita yang merender)
❌ Soal digenerate AI per user saat runtime (generate per topik sekali, cache di `questions`)
❌ "Ajukan topik baru" (post-MVP)

---

## Success Criteria (Demo Day)

1. ✅ BKT algorithm works correctly
2. ✅ 2 students show different learning paths
3. ✅ Mastery updates real-time
4. ✅ AI Tutor gives context-aware responses
5. ✅ Prerequisites lock/unlock correctly

---

*Ref: Full specs di `docs/PROJECT_PLAN.md`*
