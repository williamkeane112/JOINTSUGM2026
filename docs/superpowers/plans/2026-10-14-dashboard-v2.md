# Dashboard v2 (Bento + Mastery Curve) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ubah dashboard v1 menjadi layout bento yang lebar dan lebih kaya: navbar pill, hero, kartu progres, grafik penguasaan (dihitung BKT dari riwayat jawaban), dan kartu topik yang terisi sesuai penguasaan, dengan palet yang lebih tenang.

**Architecture:** BKT ditulis sebagai kelas murni di `src/lib/algorithms/bkt.ts` (spesifikasi `.kiro/steering/03-bkt-algorithm.md`) beserta `buildMasteryCurve(answers)`. Dashboard menerima `answerHistory` (daftar benar/salah per topik) dari mock; kurva dan persen mastery topik rekomendasi diturunkan dari riwayat yang sama sehingga angka di hero dan di grafik selalu cocok. Grafik adalah SVG buatan sendiri, tanpa library chart.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4 (token di `src/index.css`), `lucide-react`, `react-router-dom` v7 (`NavLink`), Vitest. Tidak ada dependensi baru.

**Spec:** Percakapan desain 2026-10-14 (diskusi referensi "Swaraloka" di `.kiro/something/7a7730c4eaf18f138ae091a59f45747a.jpg`), `.kiro/steering/01-mvp-scope.md` §6, dan plan dasar `docs/superpowers/plans/2026-10-14-dashboard.md` (v1, sudah terimplementasi). Plan ini menggantikan layout v1 (dua kolom, `SummaryStrip`, `TopicRow`) dan mempertahankan logika v1 (`mastery.ts`, `pickRecommendation`, `summarize`, `topicHref`, `useCountUp`).

## Global Constraints

- Folder halaman `src/page/dashboard/`; logika bersama di `src/lib/`. Komponen satu per file; TypeScript strict; ikon hanya dari `lucide-react`; teks UI Bahasa Indonesia sesuai plan ini.
- Tailwind v4 lewat `@tailwindcss/vite`; pakai token dan class di `src/index.css` (`.card`, `.btn-primary`, `.badge-*`, `--color-*`). Tidak ada warna baru di luar token.
- Ambang status mastery tetap: `< 40` weak, `40..<70` progress, `>= 70` mastered (`src/lib/mastery.ts`). Status selalu punya teks, tidak pernah hanya warna.
- **Palet tenang:** latar `--color-cream`, kartu `.card` putih, satu permukaan gelap (`--color-night`) untuk hero (dan EmptyState). Pink (`--color-pink`) hanya untuk tombol aksi, fokus, dan tautan. Warna status (`--color-mastered|progress|weak` + tint-nya) hanya di: isi latar kartu topik, chip status, segmen progres, penanda zona. Seri data grafik memakai `--color-violet`. Ikon berwarna di kartu ringkasan dihapus.
- **Layout:** kontainer `max-w-7xl` dengan padding `px-4 sm:px-6 lg:px-8`; jarak antar kartu `gap-5`; padding kartu `p-5 sm:p-6`. Urutan DOM sama dengan urutan visual di mobile; di desktop hanya grid yang berubah.
- Judul kartu `font-display` bold; letter-spacing tidak lebih rapat dari `-0.04em`. Target sentuh ≥ 44px. Satu momen animasi saja: count-up hero (sudah ada); grafik dan kartu statis. Hormati `prefers-reduced-motion`.
- Tanpa sidebar, tanpa modal, tanpa gradien dekoratif (satu-satunya `linear-gradient` yang diizinkan adalah hard-stop untuk isi kartu topik).
- Jangan ubah `src/App.tsx`/`ProtectedRoute`, skema database, atau halaman Topik (`/topicSelect`, pekerjaan terpisah). Kolom `questions.source` ditunda.
- Navbar hanya berisi Dashboard dan Topik (keputusan saya: item "Segera" disembunyikan agar tidak terlihat belum jadi).
- Tidak ada langkah commit kecuali user meminta. Lint: `eslint-plugin-react-hooks` v7 menandai `setState` sinkron di `useEffect`.
- Alat review visual sudah terpasang: server dev sendiri di port bebas (`npm run dev -- --port 5174 --strictPort`), lalu `BASE_URL=http://localhost:5174 npm run screenshot`; server dev lama di 5173 punya cache basi, jangan dipakai.

## Review Focus

1. Grafik dengan 0 atau 1 jawaban → pesan kosong, tidak ada SVG rusak/`NaN` (Task 1, 2, 5).
2. Riwayat panjang (mis. 100 jawaban) → grafik hanya menampilkan 30 jawaban terakhir (31 titik), titik terakhir tetap sama dengan hasil penuh (Task 1, 2).
3. Persen mastery di hero sama dengan titik terakhir grafik untuk topik rekomendasi di semua skenario mock (Task 2).
4. Parameter BKT ekstrem (`p_guess = 0`, `p_learned = 1`) → hasil tetap finit di 0–1 (Task 1).
5. `lastPracticedAt` null, tidak valid, atau di masa depan → teks wajar, tidak "NaN hari lalu" (Task 4).
6. Nama topik panjang di kartu topik pada 360px dan 768px → terpotong rapi, tanpa scroll horizontal (Task 4, 6 screenshot).
7. Skenario `empty` dan `done` → tidak ada kartu grafik, tidak ada error (Task 2, 6).
8. Navigasi keyboard: pill navbar dan kartu topik fokus berurutan dan punya cincin fokus; pill aktif memiliki `aria-current="page"` (Task 3).

## File Structure

| File | Aksi | Tanggung jawab |
|---|---|---|
| `src/lib/algorithms/bkt.ts` (+`.test.ts`) | Buat | `BKTModel`, `CurvePoint`, `buildMasteryCurve` |
| `src/page/dashboard/types.ts` | Ubah | tambah `answerHistory` |
| `src/page/dashboard/dashboardLogic.ts` (+test) | Ubah | `curveForRecommendation`, `formatRelativeDay`, tipe `DashboardSummary` |
| `src/page/dashboard/mockData.ts` | Ubah | mock berbasis riwayat jawaban, tanggal relatif |
| `src/page/dashboard/statusStyle.ts` | Ubah | tambah `STATUS_TINT` |
| `src/page/dashboard/DashboardTopBar.tsx` | Tulis ulang | navbar pill + avatar + keluar |
| `src/page/dashboard/ProgressCard.tsx` | Buat | ringkasan (menggantikan `SummaryStrip`) |
| `src/page/dashboard/TopicCard.tsx` | Buat | kartu topik terisi (menggantikan `TopicRow`) |
| `src/page/dashboard/MasteryCurve.tsx` | Buat | kartu grafik SVG |
| `src/page/dashboard/HeroCard.tsx` | Ubah | tata letak dua kolom di ≥ md |
| `src/page/dashboard/Index.tsx` | Tulis ulang | grid bento |
| `SummaryStrip.tsx`, `TopicRow.tsx` | Hapus | digantikan |
| `scripts/screenshot.mjs` | Ubah | tambah viewport tablet 768px |

---

### Task 1: Mesin BKT dan pembuat kurva

**Files:**
- Create: `src/lib/algorithms/bkt.ts`
- Test: `src/lib/algorithms/bkt.test.ts`

**Interfaces:**
- Produces:
  - `export interface BKTParameters { p_learned: number; p_transit: number; p_guess: number; p_slip: number }`
  - `export class BKTModel` — `constructor(params?: Partial<BKTParameters>)` (default 0.0 / 0.1 / 0.25 / 0.1), `update(isCorrect: boolean): number`, `getMasteryPercentage(): number`, `getParameters(): BKTParameters`, `getStatus(): "not_mastered" | "in_progress" | "mastered"`, `isMastered(threshold?: number): boolean` — rumus dan komentar persis seperti di `.kiro/steering/03-bkt-algorithm.md` (penyebut 0 → 0, hasil di-clamp 0–1).
  - `export interface CurvePoint { answer: number; masteryPct: number; correct: boolean | null }`
  - `export const CURVE_INITIAL_P_LEARNED = 0.1` (keputusan saya: awal kurva demo 10%, nilai sebenarnya nanti dari `student_progress`)
  - `export function buildMasteryCurve(answers: boolean[], initialPLearned?: number): CurvePoint[]` — selalu mengembalikan `answers.length + 1` titik; titik 0 = `{ answer: 0, masteryPct: initial*100, correct: null }`; titik ke-i memakai jawaban ke-i.

- [ ] **Step 1: Tulis test gagal** (`bkt.test.ts`):
  - dari `p_learned 0.45`: `update(true)` ≈ `0.7719`, `update(false)` ≈ `0.1885` (`toBeCloseTo(…, 3)`)
  - dari `p_learned 0` dengan `p_guess: 0`: `update(true)` bernilai finit (`Number.isFinite`) dan ≈ `0.1`
  - dari `p_learned 1`: `update(false)` tetap `<= 1` dan `>= 0`
  - `getStatus()` mengikuti ambang 0.4 / 0.7; `getMasteryPercentage()` = `p_learned * 100`
  - `buildMasteryCurve([])` → 1 titik `{ answer: 0, correct: null, masteryPct: 10 }`
  - `buildMasteryCurve([true, false])` → 3 titik, `answer` 0/1/2, `correct` `null/true/false`, `masteryPct` titik 1 > titik 0, titik 2 < titik 1
  - 8 jawaban benar berturut-turut → `masteryPct` tidak pernah turun dan titik terakhir ≥ 70
- [ ] **Step 2: Jalankan** `npx vitest run src/lib/algorithms` → FAIL (modul belum ada).
- [ ] **Step 3: Implementasi** `bkt.ts` sesuai Interfaces.
- [ ] **Step 4: Jalankan ulang** → PASS.

---

### Task 2: Data dashboard berbasis riwayat jawaban

**Files:**
- Modify: `src/page/dashboard/types.ts`, `dashboardLogic.ts`, `mockData.ts`
- Test: `src/page/dashboard/dashboardLogic.test.ts` (tambah; tes v1 tetap hijau)

**Interfaces:**
- Consumes: `buildMasteryCurve`, `CurvePoint` (Task 1)
- Produces:
  - `DashboardData` mendapat `answerHistory: Record<string, boolean[]>` (kunci = `topicId`, urut lama → baru)
  - `export const MAX_CURVE_ANSWERS = 30`
  - `export function curveForRecommendation(data: DashboardData, rec: Recommendation): { topicName: string; points: CurvePoint[] } | null` — `null` jika `rec.kind !== "continue"`; selain itu `buildMasteryCurve(history ?? [])` lalu dipotong ke `MAX_CURVE_ANSWERS + 1` titik terakhir
  - `export function formatRelativeDay(iso: string | null, now?: Date): string` — `null`/tidak valid → `"Belum pernah latihan"`; selisih hari kalender ≤ 0 (termasuk masa depan) → `"Hari ini"`; 1 → `"Kemarin"`; n → `"{n} hari lalu"`
  - `export type DashboardSummary = ReturnType<typeof summarize>`
- Mock: tiap topik yang punya riwayat mendapat `masteryPct = buildMasteryCurve(answers).at(-1).masteryPct` (dibulatkan 1 desimal tidak perlu; dikonsumsi lewat `Math.round`); topik tanpa riwayat (mis. `locked`) memakai angka tetap. `lastPracticedAt` dibuat dari helper `daysAgo(n)` relatif terhadap `new Date()` supaya teks relatif tidak basi. Pita status skenario v1 tetap (budi: weak/progress/mastered/locked; sari: rekomendasi ≠ budi, yaitu Persamaan Linear).

- [ ] **Step 1: Tulis test gagal** (tambahan):
  - `curveForRecommendation(data, { kind: "empty" })` dan `{ kind: "all-mastered" }` → `null`
  - riwayat 100 jawaban → `points.length === 31` dan titik terakhir sama dengan `buildMasteryCurve` penuh
  - topik tanpa riwayat → `points.length === 1`
  - untuk skenario `budi`, `sari`: `Math.round(points.at(-1).masteryPct) === Math.round(rec.topic.masteryPct)`
  - `formatRelativeDay`: `null` → "Belum pernah latihan"; `"bukan-tanggal"` → sama; tanggal sama dengan `now` → "Hari ini"; 1 hari sebelum → "Kemarin"; 3 hari sebelum → "3 hari lalu"; besok → "Hari ini"
- [ ] **Step 2: Jalankan** `npx vitest run src/page/dashboard` → FAIL.
- [ ] **Step 3: Implementasi** perubahan di tiga file.
- [ ] **Step 4: Jalankan ulang** → semua PASS (tes v1 + baru); `npx tsc -b` → tanpa error.

---

### Task 3: Navbar pill

**Files:**
- Rewrite: `src/page/dashboard/DashboardTopBar.tsx`

**Interfaces:**
- Produces: `export default function DashboardTopBar({ studentName }: { studentName: string })`

Spesifikasi:
- `<header>` dengan kontainer `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, latar `--color-cream`, garis bawah `--color-line`; `sm:sticky sm:top-0 sm:z-10` (tidak sticky di mobile).
- Kiri: ikon `Sparkles` (pink) + "SkillPath AI" (`font-display` bold) sebagai `Link` ke `/dashboard`. Tengah/kiri-dekat: `<nav aria-label="Navigasi utama">` dengan dua `NavLink` pill ("Dashboard" → `/dashboard` dengan `end`, "Topik" → `/topicSelect`). Pill: `inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold`. Aktif (`isActive`): `bg-[var(--color-night)] text-[var(--color-cream)]`; tidak aktif: `bg-white text-[var(--color-ink)] ring-1 ring-[var(--color-line)] hover:bg-[#fff0f5]`. `NavLink` memberi `aria-current="page"` otomatis.
- Kanan: avatar lingkaran 40px (`--color-night`, huruf pertama `studentName` huruf kapital, `aria-hidden`) dan tombol "Keluar" bergaya pill tidak aktif dengan ikon `LogOut`. Perilaku logout sama dengan v1 (penjaga klik ganda, `supabase.auth.signOut()`, error di `role="alert"`, sukses → `navigate("/auth", { replace: true })`, label "Keluar..." saat loading).
- Di bawah `sm`: baris 1 = brand + tombol Keluar (avatar disembunyikan); baris 2 = dua pill selebar baris. Urutan DOM: brand, nav, kontrol kanan.

- [ ] **Step 1: Implementasi** sesuai spesifikasi.
- [ ] **Step 2: Verifikasi** `npx tsc -b` dan `npm run lint` → tanpa error. (Pemeriksaan visual di Task 6.)

---

### Task 4: ProgressCard dan TopicCard

**Files:**
- Create: `src/page/dashboard/ProgressCard.tsx`, `TopicCard.tsx`
- Modify: `src/page/dashboard/statusStyle.ts` (tambah `STATUS_TINT: Record<MasteryStatus, string>` → `var(--color-weak-tint)` / `progress-tint` / `mastered-tint`)

**Interfaces:**
- Consumes: `DashTopic`, `DashboardSummary`, `formatRelativeDay`, `topicHref`, `getMasteryStatus`, `clampMastery`, `STATUS_*`
- Produces:
  - `export default function ProgressCard({ topics, summary }: { topics: DashTopic[]; summary: DashboardSummary })`
  - `export default function TopicCard({ topic }: { topic: DashTopic })`

`ProgressCard` (`.card`, tanpa ikon):
- `h2` "Progres belajar".
- Kalimat `font-display text-2xl font-bold`: `"{masteredCount} dari {startedCount} topik dikuasai"`.
- Bar bersegmen: satu segmen per topik tidak terkunci (lebar sama, `gap-1`, tinggi 8px, rounded-full), warna menurut status; wadah `role="img"` dengan `aria-label` "{n} dikuasai, {m} sedang berjalan, {k} perlu dikuatkan".
- `dl` tiga baris dengan pembatas `divide-y`: "Rata-rata penguasaan" → `{overallPct}%`; "Soal dijawab" → `{questionsAnswered}`; "Streak" → `{streakDays} hari` (angka `font-display tabular-nums`).

`TopicCard` (satu `Link` ke `topicHref(topic.id)`, `min-h-36`, `p-5`, radius `--radius-card`, bayangan `--shadow-card`, hover naik 2px + `--shadow-card-hover`):
- Latar = isi sesuai penguasaan: `linear-gradient(to right, {STATUS_TINT[status]} {pct}%, var(--color-surface) {pct}%)` (hard stop, `pct = clampMastery`).
- Isi: nama topik (`font-display text-lg font-bold`, maksimal 2 baris dengan `line-clamp-2`); `{round(pct)}%` (`font-display text-3xl font-bold tabular-nums`); chip `STATUS_BADGE[status]` dengan `STATUS_LABEL[status]`; baris bawah `text-xs` `--color-muted`: `formatRelativeDay(topic.lastPracticedAt)`; di kanan bawah tombol bulat 40px berisi `ArrowRight` (`bg-[var(--color-night)] text-[var(--color-cream)]`, `aria-hidden`).
- `locked`: bukan link (`<div aria-disabled="true">`), latar `--color-locked-tint`, ikon `Lock`, chip `badge-locked` "Terkunci", teks "Terbuka setelah topik prasyaratnya dikuasai", tanpa persen dan tanpa tombol.

- [ ] **Step 1: Implementasi** kedua komponen + `STATUS_TINT`.
- [ ] **Step 2: Verifikasi** `npx tsc -b` dan `npm run lint` → tanpa error. (Visual di Task 6.)

---

### Task 5: MasteryCurve (SVG)

**Files:**
- Create: `src/page/dashboard/MasteryCurve.tsx`

**Interfaces:**
- Consumes: `CurvePoint`
- Produces: `export default function MasteryCurve({ topicName, points }: { topicName: string; points: CurvePoint[] })`

Spesifikasi (`.card`):
- `h2` "Penguasaan per soal"; sub-teks `text-sm` muted berisi nama topik (`topicName`).
- Jika `points.length < 2`: tampilkan hanya pesan "Jawab beberapa soal dan grafik penguasaanmu muncul di sini." (tanpa SVG).
- Selain itu: `<svg viewBox="0 0 640 240" className="w-full h-auto" role="img" aria-label="Grafik penguasaan {topicName}: naik/turun dari {awal}% ke {akhir}% dalam {n} soal">`. Sumbu y 0–100 dengan area gambar berpadding; garis putus-putus horizontal di 40 dan 70 dengan label kecil "40" dan "70" di kanan (warna `--color-muted`); garis data `--color-violet` 2.5px (`stroke-linejoin round`); titik: jawaban benar = lingkaran terisi violet, salah = lingkaran putih dengan tepi violet; titik terakhir lebih besar dan diberi label `"{round}%"` di atasnya. Sumbu x tanpa angka per titik; label "Mulai" di kiri dan "Soal terakhir" di kanan (`text-xs`).
- Legenda di bawah SVG (HTML, bukan SVG): titik terisi "Jawaban benar", titik kosong "Jawaban salah".
- Tidak ada animasi.

- [ ] **Step 1: Implementasi** sesuai spesifikasi (koordinat dihitung dari `points`; pastikan pembagian tidak menghasilkan `NaN` untuk 2 titik).
- [ ] **Step 2: Verifikasi** `npx tsc -b` dan `npm run lint` → tanpa error.

---

### Task 6: Hero dua kolom, grid bento, verifikasi, dokumen

**Files:**
- Modify: `src/page/dashboard/HeroCard.tsx`, `EmptyState.tsx` (hanya jika perlu menyelaraskan padding), `scripts/screenshot.mjs`
- Rewrite: `src/page/dashboard/Index.tsx`
- Delete: `SummaryStrip.tsx`, `TopicRow.tsx`
- Modify: `.kiro/steering/session-progress.md` (status dashboard v2)

Spesifikasi:
- `HeroCard` (kasus `continue`): urutan DOM `h2` → blok mastery (angka count-up + chip + track dengan tanda 40/70) → kalimat alasan → tombol. Di bawah `md` tumpuk berurutan seperti itu; di `md` ke atas grid dua kolom: `h2`, alasan, dan tombol di kolom kiri, blok mastery di kolom kanan (`md:col-start-2 md:row-span-3`). Kasus `all-mastered` tidak berubah.
- `Index.tsx`: `DashboardTopBar studentName={data.studentName}` lalu `<main>` dengan kontainer `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8`. Greeting `h1` "Halo, {studentName}". Jika rekomendasi `empty`: greeting + `EmptyState` (lebar `max-w-2xl`). Selain itu grid `grid gap-5 lg:grid-cols-12`: `HeroCard` (`lg:col-span-8`), `ProgressCard` (`lg:col-span-4`), `MasteryCurve` hanya bila `curveForRecommendation(...)` bukan `null` (`lg:col-span-12`), lalu bagian "Topikmu": `section` `lg:col-span-12` dengan header (`h2` "Topikmu" + tautan "Jelajahi topik" → `/topicSelect`, `min-h-11`) dan `ul` grid `gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` berisi `TopicCard`. `ProgressCard` dan `HeroCard` setinggi sama di ≥ lg (`items-stretch` default grid).
- `screenshot.mjs`: tambah viewport `{ name: "tablet", width: 768, height: 1000 }`.

- [ ] **Step 1: Ubah `HeroCard`, tulis ulang `Index.tsx`, hapus dua file lama, tambah viewport tablet.**
- [ ] **Step 2: Otomatis** — `npm run test` → semua PASS; `npx tsc -b` → exit 0; `npm run lint` → exit 0; `npm run build` → sukses.
- [ ] **Step 3: Review visual** — server dev sendiri di port 5174, lalu `npm run screenshot` (4 skenario × 3 lebar). Expected: semua baris `ok`, exit 0. Baca setiap PNG dengan tool `read` (mode Image) dan periksa: squint test (hero gelap pertama, lalu kurva, lalu kartu topik); margin kiri-kanan di 1280px kecil dan konten mengisi lebar; kartu topik menunjukkan isi berbeda untuk topik berbeda; tidak ada warna selain palet tenang (tanpa ikon ungu/hijau/oranye di ringkasan); navbar mobile dua baris tidak menimpa konten; `empty` hanya `EmptyState`; `done` tanpa kartu grafik; tidak ada teks terpotong yang menghilangkan makna. Perbaiki lalu ulangi sampai bersih.
- [ ] **Step 4: Manual oleh user** (tidak terlihat di screenshot): count-up hero, hover kartu topik, `prefers-reduced-motion`, navigasi Tab (fokus berurutan, cincin pink, `aria-current` di pill aktif).
- [ ] **Step 5: Dokumen** — perbarui bagian status dashboard di `session-progress.md` (layout v2, BKT di `src/lib/algorithms/bkt.ts`, kurva dari riwayat jawaban, cara memakai `?demo=`), lalu `npm run build` sekali lagi.
