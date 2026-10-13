# 📍 Documentation Navigation Guide

> **Purpose**: Quick reference untuk tahu file mana yang berisi info apa.

---

## 🗂️ Struktur Dokumen

```
JOINTSUGM2026/
├── 📄 README.md                           (Vite template — project setup)
├── 📄 AGENTS.md                           (Kiro agent instructions)
│
├── 📁 docs/                                (Reference Documents — Human-Readable)
│   ├── 📘 PROJECT_PLAN.md                 (Full project spec — 2050 lines, read once)
│   ├── 🎨 DESIGN.md                       (UI/UX design system + Google Stitch prompts)
│   └── 🗺️ USER_FLOWS.md                   (Navigation flows, state transitions)
│
└── 📁 .kiro/steering/                      (AI Context — Auto-loaded oleh Kiro)
    ├── 00-NAVIGATION.md                   (This file — dokumentasi guide)
    ├── 01-mvp-scope.md                    (MVP scope + core features)
    ├── 02-database-schema.md              (PostgreSQL/Supabase schema + RLS)
    ├── 03-bkt-algorithm.md                (BKT TypeScript implementation)
    ├── skillpath-ai-supabase.md           (Tech stack + architecture guidelines)
    └── session-progress.md                (Session history & progress tracking)
```

---

## 🔍 Cari Info Spesifik? Buka File Ini:

| Mau Tahu Tentang | Buka File | Section |
|------------------|-----------|---------|
| **Scope MVP & fitur wajib** | `01-mvp-scope.md` | Core Features |
| **Database schema & RLS** | `02-database-schema.md` | Core Tables |
| **BKT algorithm formula** | `03-bkt-algorithm.md` | TypeScript Implementation |
| **Tech stack (React/Supabase)** | `skillpath-ai-supabase.md` | Tech Stack |
| **UI design & colors** | `docs/DESIGN.md` | Section 3-6 |
| **Google Stitch prompts** | `docs/DESIGN.md` | Section 11 |
| **User flows & navigation** | `docs/USER_FLOWS.md` | All sections |
| **API endpoints** | `docs/PROJECT_PLAN.md` | API Design (line ~700) |
| **Folder structure** | `skillpath-ai-supabase.md` | Project Structure |
| **Progress history** | `session-progress.md` | Session History |

---

## 📂 Folder Purpose

### `docs/` — Reference Documents (dibaca manual saat perlu)
- **PROJECT_PLAN.md** → Dokumen lengkap, baca sekali di awal
- **DESIGN.md** → Buka saat coding UI
- **USER_FLOWS.md** → Buka saat implement routing/navigation

### `.kiro/steering/` — AI Context (auto-loaded ke Kiro tiap session)
- **00-NAVIGATION.md** → Guide ini
- **01-mvp-scope.md** → Quick reference MVP
- **02-database-schema.md** → Database reference
- **03-bkt-algorithm.md** → Algorithm reference
- **skillpath-ai-supabase.md** → Full tech guidelines (749 lines)
- **session-progress.md** → Progress tracking

---

## 🚀 Quick Start per Task

### "Mau mulai coding UI"
1. Buka `docs/DESIGN.md` → Section 3-6 (colors, typography, components)
2. Buka `docs/USER_FLOWS.md` → Section yang relevan (e.g., Dashboard flow)
3. Reference: `01-mvp-scope.md` untuk feature requirements

### "Mau setup database"
1. Buka `02-database-schema.md` → Core Tables
2. Create migration files di `supabase/migrations/`
3. Reference: `skillpath-ai-supabase.md` → Database Schema section

### "Mau implement BKT"
1. Buka `03-bkt-algorithm.md` → TypeScript Implementation
2. Create file di `src/lib/algorithms/bkt.ts`
3. Test dengan sample data

### "Mau design prototype di Google Stitch"
1. Buka `docs/DESIGN.md` → Section 11 (Google Stitch Prompts)
2. Copy-paste prompt per halaman
3. Replace `SkillPath AI` dengan nama final

---

## 📏 File Size Reference

| File | Lines | Size | Load Time |
|------|-------|------|-----------|
| PROJECT_PLAN.md | 2050 | 79 KB | ⏳ Heavy (reference only) |
| DESIGN.md | 1268 | 41 KB | ⏳ Medium (open when coding) |
| skillpath-ai-supabase.md | 749 | 25 KB | ✅ Auto-loaded |
| USER_FLOWS.md | 371 | 12 KB | ✅ Auto-loaded |
| AGENTS.md | ~300 | 8.6 KB | ✅ Auto-loaded |
| session-progress.md | ~250 | 9.5 KB | ✅ Auto-loaded |
| 02-database-schema.md | 196 | ~7 KB | ✅ Auto-loaded |
| 03-bkt-algorithm.md | 187 | ~6 KB | ✅ Auto-loaded |
| 01-mvp-scope.md | 91 | ~3 KB | ✅ Auto-loaded |

---

## 🔗 Cross-References

Jika file menyebut "Ref: ...", cek:
- `Ref: Full specs di docs/PROJECT_PLAN.md` → Detail lengkap di PROJECT_PLAN
- `Ref: DESIGN.md` → Design system & UI components
- `Ref: USER_FLOWS.md` → Navigation logic

---

*Last updated: 2026-10-12*
