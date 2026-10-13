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

### 1. Diagnostic Test
- 10-15 soal pilihan ganda
- Maps kemampuan awal per topik
- Output: Knowledge map dengan mastery %

### 2. Knowledge Map
- Visual peta kemampuan per topik
- Status: 🔴 Not Mastered (<40%), 🟡 In Progress (40-70%), 🟢 Mastered (>70%)
- Shows prerequisites & locked topics
- Recommended next topic berdasarkan BKT

### 3. Adaptive Learning Path
- Rekomendasi berbeda per siswa
- Auto-unlock based on prerequisites
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

### 6. Progress Dashboard
- Overall progress %
- Topic breakdown
- Recommended next topic
- Recent activities

---

## What NOT to Build (Skip for MVP)

❌ Multiple subjects (Matematika only!)
❌ Teacher dashboard (student view only)
❌ Complex gamification (XP/badges cukup basic)
❌ Video call features
❌ Mobile app (web responsive only)
❌ Custom backend (use Supabase)

---

## Success Criteria (Demo Day)

1. ✅ BKT algorithm works correctly
2. ✅ 2 students show different learning paths
3. ✅ Mastery updates real-time
4. ✅ AI Tutor gives context-aware responses
5. ✅ Prerequisites lock/unlock correctly

---

*Ref: Full specs di `docs/PROJECT_PLAN.md`*
