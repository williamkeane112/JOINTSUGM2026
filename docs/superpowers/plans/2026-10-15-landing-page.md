# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti placeholder route `/` dengan landing page pendek yang membuktikan jalur adaptif lewat demo tontonan berbasis BKT.

**Architecture:** Halaman statis di `src/page/landing/`, satu komponen per section; logika demo murni di `demoScript.ts` (dites), pemutaran di hook `useDemoPlayback`; `src/page/Index.tsx` hanya merender `LandingPage`. Tanpa data Supabase.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4, lucide-react, Vitest.

**Spec:** docs/superpowers/specs/2026-10-15-landing-page-design.md

## Global Constraints (one line each)

- Tanpa dependensi baru.
- Brand hanya via `BRAND_NAME`.
- Hanya file di tabel File Structure + `index.html` (title & meta description). Auth, dashboard, `.btn-*` default tidak diubah.
- Skala font 12/14/16/20/24/48 + display hero clamp(36px,5vw,60px); tracking judul dengan sufiks `!`.
- Kontrol 44px pointer-coarse / 36px desktop; teks < 12px = 0.
- Copy Bahasa Indonesia persis seperti spec.
- Kode UI ditulis model utama (AGENTS.md §2); task logika boleh subagent murah.
- Tidak commit tanpa diminta user.

## Review Focus

1. Angka demo harus berasal dari BKTModel (80/21), bukan hardcode di komponen.
2. Demo: timer dibersihkan saat unmount/jeda; tidak main ulang saat scroll balik; reduced-motion langsung frame akhir.
3. Status benar/salah tidak hanya warna (ikon + kata).
4. Navbar jangkar & fokus keyboard terlihat di atas latar night.
5. Mobile 360px: PathPreview & panel demo tidak overflow; kode tidak meluber (overflow-x-auto).

## File Structure

| File | Aksi | Tanggung jawab |
| --- | --- | --- |
| `src/lib/brand.ts` | create | `export const BRAND_NAME = "SkillPath AI"` (placeholder) |
| `src/page/landing/demoScript.ts` | create | data soal, `DEMO_PRIOR`, `computeSkillResults`, `buildDemoPath`, `DEMO_FRAME_COUNT` |
| `src/page/landing/demoScript.test.ts` | create | tes logika demo |
| `src/page/landing/catalog.ts` | create | `CATALOG: Category[]` dengan flag `available` |
| `src/page/landing/useDemoPlayback.ts` | create | frame, playing, toggle, replay; IntersectionObserver; reduced-motion |
| `src/page/landing/LandingNav.tsx`, `HeroSection.tsx`, `PathPreview.tsx`, `DemoSection.tsx`, `TopicsSection.tsx`, `PricingSection.tsx`, `FaqSection.tsx`, `ClosingSection.tsx`, `LandingFooter.tsx`, `LandingPage.tsx` | create | section UI |
| `src/page/Index.tsx` | modify | render `LandingPage` |
| `index.html` | modify | `<title>` "{BRAND} — Belajar yang belum kamu kuasai", meta description |

## Tasks

### Task 1 (subagent murah boleh): brand.ts + demoScript.ts + demoScript.test.ts

**Files:**
- `src/lib/brand.ts` (create)
- `src/page/landing/demoScript.ts` (create)
- `src/page/landing/demoScript.test.ts` (create)

**Interfaces:**
```ts
type DemoSkill = {
  key: 'variabel' | 'kondisi' | 'perulangan' | 'fungsi';
  name: string;
  question: { code: string; options: string[]; correct: string; chosen: string };
};
const DEMO_SKILLS: DemoSkill[];
const DEMO_PRIOR = 0.5;
function computeSkillResults(skills: DemoSkill[]): {
  key: string; name: string; correct: boolean; masteryPct: number; status: MasteryStatus;
}[]; // pakai BKTModel + getMasteryStatus, masteryPct dibulatkan
function buildDemoPath(results: ReturnType<typeof computeSkillResults>): {
  skipped: typeof results; steps: typeof results;
};
const DEMO_FRAME_COUNT = 6;
```

**Steps:**
- [ ] Tulis tes gagal (hasil 80/80/21/21; status mastered/mastered/weak/weak; skipped = [variabel, kondisi]; steps = [perulangan, fungsi]; seri pakai urutan kurikulum; tiap `chosen` dan `correct` ada di `options`)
- [ ] Jalankan `npm run test -- src/page/landing` (harus gagal)
- [ ] Implementasikan `brand.ts` dan `demoScript.ts`
- [ ] Jalankan `npm run test -- src/page/landing` lagi (harus lulus)

### Task 2 (subagent murah boleh): catalog.ts sesuai spec §Topik

**Files:**
- `src/page/landing/catalog.ts` (create)

**Interfaces:**
```ts
type Category = {
  name: string;
  topics: { name: string; available: boolean }[];
};
const CATALOG: Category[];
```

**Steps:**
- [ ] Implementasikan `CATALOG` sesuai spec §Topik (Pemrograman, Matematika SMP, SMA; flag `available`)
- [ ] Verifikasi `npx tsc -b`

### Task 3 (subagent murah boleh): useDemoPlayback.ts

**Files:**
- `src/page/landing/useDemoPlayback.ts` (create)

**Interfaces:**
```ts
function useDemoPlayback(
  ref: React.RefObject<Element>,
  frameCount: number,
  intervalMs?: number, // default 2000
): { frame: number; playing: boolean; finished: boolean; toggle: () => void; replay: () => void };
```

**Steps:**
- [ ] Mulai pemutaran sekali saat elemen >= 40% terlihat (IntersectionObserver)
- [ ] Berhenti otomatis di frame akhir
- [ ] `prefers-reduced-motion` -> langsung frame akhir, `playing = false`
- [ ] Bersihkan timer & observer saat unmount/jeda
- [ ] Tes dengan fake timers bila memungkinkan; minimal `npx tsc -b`

### Task 4 (MODEL UTAMA): LandingNav + HeroSection + PathPreview

**Files:**
- `src/page/landing/LandingNav.tsx` (create)
- `src/page/landing/HeroSection.tsx` (create)
- `src/page/landing/PathPreview.tsx` (create)

**Steps:**
- [ ] `LandingNav`: brand kiri, tautan jangkar (#cara-kerja, #topik, #harga, #faq) di tengah (sembunyi < md), kanan "Masuk" + tombol kecil "Mulai belajar"
- [ ] `HeroSection`: latar night + orbit dekoratif, headline, sub, tombol "Mulai belajar" (`/auth`) + tautan "Lihat cara kerjanya" (#cara-kerja)
- [ ] `PathPreview`: pakai `computeSkillResults`/`buildDemoPath` untuk isi kartu "Jalur Raka · Dasar Pemrograman" (Variabel & Kondisi dicoret + chip "Dilewati"; Perulangan langkah 1, Fungsi langkah 2)
- [ ] Rakit di dalam `HeroSection` (PathPreview di kanan, bawah di mobile)

### Task 5 (MODEL UTAMA): DemoSection

**Files:**
- `src/page/landing/DemoSection.tsx` (create)

**Steps:**
- [ ] Kiri: 3 langkah berurutan ("Pilih topik", "Jawab beberapa soal", "Dapat jalur sendiri"), langkah aktif disorot sesuai `frame` dari `useDemoPlayback`
- [ ] Kanan: panel tahap — kartu soal (kode monospace + 4 pilihan, pilihan Raka ditandai benar/salah dengan ikon + kata), daftar 4 skill dengan bar penguasaan terisi sesuai `computeSkillResults`, lalu jalur akhir dari `buildDemoPath`
- [ ] Tombol "Jeda/Lanjutkan" dan "Putar ulang" terhubung ke `toggle`/`replay`
- [ ] Ringkasan hasil akhir sebagai teks sr-only (bukan aria-live per frame)
- [ ] Overflow-x-auto untuk blok kode di mobile 360px

### Task 6 (MODEL UTAMA): sisa section + rakit halaman

**Files:**
- `src/page/landing/TopicsSection.tsx` (create)
- `src/page/landing/PricingSection.tsx` (create)
- `src/page/landing/FaqSection.tsx` (create)
- `src/page/landing/ClosingSection.tsx` (create)
- `src/page/landing/LandingFooter.tsx` (create)
- `src/page/landing/LandingPage.tsx` (create)
- `src/page/Index.tsx` (modify)
- `index.html` (modify)

**Steps:**
- [ ] `TopicsSection`: render `CATALOG` dikelompokkan per kategori sebagai daftar (bukan grid kartu sama), status "Tersedia"/"Segera hadir" dari `available`
- [ ] `PricingSection`: paket Gratis (daftar fitur + tombol "Mulai belajar") dan Pro (chip "Segera hadir", tanpa angka harga, tanpa tombol)
- [ ] `FaqSection`: native `<details>/<summary>`, 5 pertanyaan sesuai spec, placeholder `{BRAND}` diisi `BRAND_NAME`
- [ ] `ClosingSection`: kalimat penutup + tombol "Mulai belajar"
- [ ] `LandingFooter`: brand, "© 2026", tautan Masuk, tautan GitHub
- [ ] `LandingPage`: rakit semua section sesuai urutan spec
- [ ] `src/page/Index.tsx`: render `LandingPage`
- [ ] `index.html`: `<title>` "{BRAND} — Belajar yang belum kamu kuasai" dan meta description

### Task 7 (verifikasi, subagent boleh menjalankan)

**Steps:**
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] Jalankan server `npm run dev -- --port 5174 --strictPort`
- [ ] `BASE_URL=http://localhost:5174 npm run screenshot -- /` dan ulangi dengan `TOUCH=1`
- [ ] Laporkan metrik (teks <12px = 0, target sentuh kecil = 0, tanpa overflow)
- [ ] Model utama meninjau screenshot dan memoles

## Self-Review

1. Angka demo berasal dari `BKTModel` (80/21) lewat `computeSkillResults`, bukan hardcode di komponen — ditegakkan oleh Task 1 (tes) dan dipakai ulang di Task 4/5.
2. Demo: `useDemoPlayback` (Task 3) wajib membersihkan timer/observer saat unmount/jeda, tidak mengulang pemutaran setelah selesai sekali, dan langsung ke frame akhir pada `prefers-reduced-motion`.
3. Status benar/salah di `DemoSection` (Task 5) ditandai ikon + kata, bukan warna saja.
4. `LandingNav` (Task 4) memakai tautan jangkar native dengan fokus keyboard terlihat di atas latar night (kontras >= 4.5:1 dijaga lewat token pink/cream, bukan warna baru).
5. Mobile 360px: `PathPreview` dan panel `DemoSection` dites lewat screenshot Task 7 (termasuk `TOUCH=1`); blok kode memakai `overflow-x-auto` agar tidak meluber.

## Execution Handoff

Subagent-driven (task 1-3, 7) + native model utama (task 4-6) — sesuai AGENTS.md §2.
