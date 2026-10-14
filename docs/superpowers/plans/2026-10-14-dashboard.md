# Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun halaman `/dashboard` yang responsive (mobile 360px → desktop 1280px), menarik tapi hanya 5 komponen: satu hero gelap "Lanjut dari sini", daftar topik yang sudah dimulai, satu baris ringkasan, satu top bar, dan empty state.

**Architecture:** Logika murni (status mastery, pemilihan rekomendasi, ringkasan) dipisah dari komponen supaya bisa dites dengan Vitest. Data sementara dari mock (`?demo=` untuk ganti skenario); tidak ada pembacaan Supabase. `TopicRow` satu komponen untuk mobile dan desktop; layout berubah hanya lewat grid CSS.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4 (token di `src/index.css`), `lucide-react`, `react-router-dom` v7, Vitest (baru, devDependency).

**Spec:** `.kiro/steering/01-mvp-scope.md` §6 "Progress Dashboard" + keputusan di `.kiro/steering/session-progress.md` ("Keputusan Produk & Dashboard 2026-10-14"). Tidak ada dokumen desain terpisah di `docs/superpowers/specs/` — sengaja dilewati karena deadline; plan ini memuat keputusan yang dibutuhkan.

## Global Constraints

- Folder halaman: `src/page/dashboard/` (project memakai `page`, BUKAN `pages`). Logika bersama di `src/lib/`.
- Tailwind v4 lewat `@tailwindcss/vite`. Pakai token/class yang sudah ada di `src/index.css` (`.btn-primary`, `.card`, `.badge-mastered`, `.badge-progress`, `.badge-not-mastered`, `.badge-locked`, `var(--color-night)`, dll). Jangan tambah warna baru, jangan `blue-500`/`green-500`.
- Ambang status mastery (persen 0–100): `< 40` weak, `>= 40 dan < 70` progress, `>= 70` mastered. (Keputusan saya: batas 70 tepat = mastered, mengikuti `getStatus()` di `03-bkt-algorithm.md` yang memakai `p_learned < 0.7`.)
- Status tidak boleh hanya warna: selalu ada teks badge. Label: weak "Perlu dikuatkan", progress "Sedang berjalan", mastered "Dikuasai", locked "Terkunci".
- Semua teks UI Bahasa Indonesia, persis seperti di plan ini.
- TypeScript strict, satu komponen per file, ikon dari `lucide-react`, tanpa dependensi runtime baru. Vitest dipasang sebagai devDependency dengan versi pinned (`npm install -D -E vitest`).
- Headline: `letter-spacing` tidak lebih rapat dari `-0.04em` (h1–h4 sudah `-0.03em` dari `index.css`; jangan override lebih rapat).
- Touch target ≥ 44px. Hormati `prefers-reduced-motion`.
- Jangan ubah `src/App.tsx`, `ProtectedRoute`, atau skema database. Fitur kolom `questions.source` (manual/ai) ditunda — tidak disentuh plan ini.
- Jangan commit kecuali user meminta (tidak ada langkah commit di plan ini).
- Lint: `eslint-plugin-react-hooks` v7 menandai `setState` sinkron di dalam `useEffect`; turunkan nilai awal lewat initializer `useState` atau set state di callback `requestAnimationFrame`.
- Alat review visual sudah terpasang (`playwright-core` pinned, `scripts/screenshot.mjs`, `npm run screenshot`); jangan pasang alat tambahan.

## Review Focus

Input/kondisi yang tidak disebut spec tapi paling mungkin merusak, dengan perilaku yang wajar:

1. Daftar topik kosong → empty state, tidak ada `NaN%` di ringkasan (Task 2 test, Task 5 verifikasi `?demo=empty`).
2. Semua topik sudah ≥ 70% → hero berubah jadi "Semua topikmu sudah dikuasai", CTA ke `/topicSelect` (Task 2 test, Task 4).
3. Mastery tepat di batas (39.99, 40, 69.99, 70) → status sesuai ambang di atas (Task 1 test).
4. Mastery tidak valid (`NaN`, negatif, >100) → di-clamp ke 0–100; bar tidak melebihi lebar kontainer (Task 1 test).
5. Nama topik panjang di layar 360px → terpotong rapi (`truncate`), tidak ada scroll horizontal (Task 3 & 5 verifikasi manual).
6. `prefers-reduced-motion` aktif → angka langsung tampil nilai akhir, tanpa count-up (Task 4 verifikasi manual).

## File Structure

| File | Tanggung jawab |
|---|---|
| `src/lib/mastery.ts` (+`.test.ts`) | Ambang & fungsi status mastery, clamp. Dipakai ulang oleh Knowledge Map/BKT nanti |
| `src/page/dashboard/types.ts` | Tipe `DashTopic`, `DashboardData`, `Recommendation` |
| `src/page/dashboard/dashboardLogic.ts` (+`.test.ts`) | `pickRecommendation`, `summarize`, `topicHref` |
| `src/page/dashboard/mockData.ts` | `getMockDashboard(scenario)` — 4 skenario |
| `src/page/dashboard/useCountUp.ts` | Hook animasi angka sekali saat mount |
| `src/page/dashboard/TopicRow.tsx` | Satu baris topik (nama, bar, badge) |
| `src/page/dashboard/SummaryStrip.tsx` | Satu baris 3 angka ringkasan |
| `src/page/dashboard/EmptyState.tsx` | Tampilan user belum punya topik |
| `src/page/dashboard/DashboardTopBar.tsx` | Top bar tunggal + logout |
| `src/page/dashboard/HeroCard.tsx` | Hero gelap "Lanjut dari sini" |
| `src/page/dashboard/Index.tsx` | Merakit halaman (ditulis ulang, menggantikan placeholder) |

---

### Task 1: Vitest + status mastery

**Files:**
- Modify: `package.json` (script `"test": "vitest run"`, devDependency `vitest`)
- Create: `src/lib/mastery.ts`
- Test: `src/lib/mastery.test.ts`

**Interfaces:**
- Produces:
  - `export type MasteryStatus = "weak" | "progress" | "mastered"`
  - `export const MASTERY_THRESHOLDS: { progress: 40; mastered: 70 }`
  - `export function clampMastery(value: number): number` — non-finite → 0, lainnya dibatasi 0–100
  - `export function getMasteryStatus(masteryPct: number): MasteryStatus` — meng-clamp dulu

- [ ] **Step 1: Install** — `npm install -D -E vitest`, tambah script `test`. Expected: `npx vitest run` berjalan (belum ada test → "No test files found" tidak masalah).
- [ ] **Step 2: Tulis test gagal** di `mastery.test.ts`:
  - `getMasteryStatus(39.99) === "weak"`, `(40) === "progress"`, `(69.99) === "progress"`, `(70) === "mastered"`, `(100) === "mastered"`, `(0) === "weak"`
  - `clampMastery(NaN) === 0`, `(-5) === 0`, `(140) === 100`, `(55.5) === 55.5`
  - `getMasteryStatus(NaN) === "weak"`
- [ ] **Step 3: Jalankan** `npx vitest run src/lib/mastery.test.ts` → FAIL (modul belum ada).
- [ ] **Step 4: Implementasi** `mastery.ts` sesuai Interfaces.
- [ ] **Step 5: Jalankan ulang** → PASS semua.

---

### Task 2: Tipe, logika dashboard, mock data

**Files:**
- Create: `src/page/dashboard/types.ts`, `dashboardLogic.ts`, `mockData.ts`
- Test: `src/page/dashboard/dashboardLogic.test.ts`

**Interfaces:**
- Consumes: `getMasteryStatus`, `clampMastery` dari `src/lib/mastery.ts`
- Produces:
  ```ts
  export interface DashTopic { id: string; name: string; masteryPct: number; locked: boolean; lastPracticedAt: string | null }
  export interface DashboardData { studentName: string; topics: DashTopic[]; questionsAnswered: number; streakDays: number }
  export type Recommendation =
    | { kind: "continue"; topic: DashTopic }
    | { kind: "all-mastered" }
    | { kind: "empty" }
  export function pickRecommendation(topics: DashTopic[]): Recommendation
  export function summarize(data: DashboardData): { overallPct: number; startedCount: number; masteredCount: number; questionsAnswered: number; streakDays: number }
  export function topicHref(topicId: string): string   // sementara selalu "/topicSelect" (route journey belum ada); satu-satunya tempat yang diganti nanti
  export type DemoScenario = "budi" | "sari" | "empty" | "done"
  export function getMockDashboard(scenario: string | null): DashboardData  // scenario tak dikenal / null → "budi"
  ```

Aturan `pickRecommendation`: ambil topik `!locked`; kosong → `empty`; dari situ kandidat = mastery < 70; ada → `continue` dengan mastery terendah (seri → yang muncul lebih dulu di array); tidak ada → `all-mastered`.
Aturan `summarize`: `overallPct` = rata-rata `clampMastery(masteryPct)` topik `!locked`, dibulatkan, `0` jika tidak ada; `startedCount` = jumlah `!locked`; `masteredCount` = status mastered.

Mock (nama & angka tepatnya bebas, syarat di test): `budi` = 3 topik, termasuk satu mastered, satu <40, satu 40–70 + satu topik `locked`; `sari` = rekomendasi **berbeda** dari budi; `empty` = `topics: []`; `done` = semua ≥ 70.

- [ ] **Step 1: Tulis test gagal** `dashboardLogic.test.ts`:
  - `pickRecommendation([])` → `{ kind: "empty" }`
  - semua `locked` → `empty`
  - memilih mastery terendah di antara unlocked <70; mengabaikan topik locked meski lebih rendah
  - seri → elemen pertama
  - semua ≥70 → `all-mastered`
  - `summarize` dengan `topics: []` → `overallPct === 0` (bukan NaN), `startedCount === 0`
  - `summarize` meng-clamp (`masteryPct: 140` dihitung 100) dan mengabaikan locked
  - `getMockDashboard("budi")` dan `getMockDashboard("sari")` menghasilkan `pickRecommendation(...).topic.id` berbeda
  - `getMockDashboard("empty")` → `pickRecommendation` = `empty`; `("done")` → `all-mastered`; `(null)` sama dengan `("budi")`
- [ ] **Step 2: Jalankan** `npx vitest run src/page/dashboard` → FAIL.
- [ ] **Step 3: Implementasi** ketiga file sesuai Interfaces & aturan di atas.
- [ ] **Step 4: Jalankan ulang** → PASS.

---

### Task 3: Komponen daun — TopicRow, SummaryStrip, EmptyState

**Files:**
- Create: `src/page/dashboard/TopicRow.tsx`, `SummaryStrip.tsx`, `EmptyState.tsx`

**Interfaces:**
- Consumes: `DashTopic`, `topicHref`, `getMasteryStatus`, `clampMastery`
- Produces:
  - `export default function TopicRow({ topic }: { topic: DashTopic })`
  - `export default function SummaryStrip({ overallPct, questionsAnswered, streakDays }: { overallPct: number; questionsAnswered: number; streakDays: number })`
  - `export default function EmptyState()`

Spesifikasi:
- `TopicRow`: seluruh baris adalah `<Link to={topicHref(topic.id)}>` (tinggi min 56px); isi: nama (`truncate`), `{pct}%` (`tabular-nums`, `font-display`), bar tipis (lebar = `clampMastery(pct)%`, warna `var(--color-mastered|progress|weak)` menurut status), badge dengan class `.badge-*` + label status. Jika `topic.locked`: bukan link (`<div aria-disabled="true">`), badge `badge-locked` "Terkunci", bar kosong, teks `--color-locked-ink`.
- `SummaryStrip`: satu `.card` dengan 3 kolom sama lebar: "Progres" `{overallPct}%`, "Soal dijawab" `{questionsAnswered}`, "Streak" `{streakDays} hari`; angka `font-display tabular-nums`; ikon `Target`, `CheckCheck`, `Flame` (warna streak `var(--color-streak)`). Harus muat di 360px tanpa overflow.
- `EmptyState`: `.card`, ikon `Sparkles`, judul "Belum ada topik yang kamu mulai", isi "Pilih satu topik, jawab beberapa soal singkat, dan kami susun jalur belajarmu.", tombol `.btn-primary` ke `/topicSelect` berlabel "Pilih topik".

- [ ] **Step 1: Implementasi ketiga komponen** sesuai spesifikasi.
- [ ] **Step 2: Verifikasi** `npx tsc -b` → tanpa error; `npm run lint` → tanpa error di file baru. (Pemeriksaan visual dilakukan di Task 5 setelah dirakit.)

---

### Task 4: HeroCard + useCountUp

**Files:**
- Create: `src/page/dashboard/useCountUp.ts`, `HeroCard.tsx`

**Interfaces:**
- Consumes: `Recommendation`, `getMasteryStatus`, `clampMastery`, `topicHref`
- Produces:
  - `export function useCountUp(target: number, durationMs?: number): number` — default 800ms, easing ease-out-cubic, mulai dari 0 saat mount (dan saat `target` berubah), mengembalikan integer; jika `window.matchMedia("(prefers-reduced-motion: reduce)").matches` langsung `Math.round(target)`; batalkan `requestAnimationFrame` saat unmount.
  - `export default function HeroCard({ recommendation }: { recommendation: Exclude<Recommendation, { kind: "empty" }> })`

Spesifikasi `HeroCard` (latar `var(--color-night)`, teks `var(--color-cream)`, radius 16px, padding `p-6 sm:p-8`):
- `continue`: kicker "LANJUT DARI SINI" (kecil, uppercase, tracking lebar, warna pink); nama topik sebagai `h2` besar; angka mastery besar `{countUp}%` (`font-display`, `tabular-nums`, ≥ `text-6xl`); cincin SVG progres di sisi angka (trek `rgba(255,255,255,0.12)`, goresan warna status); badge status dengan teks; kalimat alasan "Penguasaanmu paling rendah di sini, dan syaratnya sudah terpenuhi."; tombol `.btn-primary` "Lanjutkan belajar" + ikon `ArrowRight` → `topicHref(topic.id)`.
- `all-mastered`: kicker "KERJA BAGUS"; judul "Semua topikmu sudah dikuasai"; kalimat "Siap tantangan baru? Pilih topik berikutnya."; tombol "Tambah topik" → `/topicSelect`.
- Cincin dan angka diberi `aria-hidden`; informasi yang sama tersedia sebagai teks ("{pct}% dikuasai") untuk pembaca layar.

- [ ] **Step 1: Implementasi `useCountUp`** sesuai Interfaces (patuhi catatan lint react-hooks v7 di Global Constraints).
- [ ] **Step 2: Implementasi `HeroCard`** sesuai spesifikasi.
- [ ] **Step 3: Verifikasi** `npx tsc -b` dan `npm run lint` → tanpa error.

---

### Task 5: DashboardTopBar, rakit Index, verifikasi, sinkron dokumen

**Files:**
- Create: `src/page/dashboard/DashboardTopBar.tsx`
- Modify (tulis ulang): `src/page/dashboard/Index.tsx`
- Modify: `docs/USER_FLOWS.md` (§4 baris "Nav lain ... disabled 'Segera'"), `.kiro/steering/session-progress.md` (status dashboard)

**Interfaces:**
- Consumes: semua komponen & logika Task 1–4
- Produces: `export default function DashboardTopBar()` (tanpa props)

Spesifikasi:
- `DashboardTopBar`: `<header>` lengket di atas (`sticky top-0`), latar `var(--color-cream)` dengan garis bawah `var(--color-line)`; kiri: ikon `Sparkles` + "SkillPath AI" (`font-display`); kanan: link "Topik" → `/topicSelect` dan tombol "Keluar". Logout memakai perilaku placeholder lama: `supabase.auth.signOut()`, penjaga klik ganda (`loading`), saat gagal tampilkan `error.message` dalam elemen `role="alert"` di bawah bar, saat sukses `navigate("/auth", { replace: true })`; label tombol "Keluar" → "Keluar..." saat loading. Item nav untuk route yang belum ada (Peta, AI Tutor) **tidak ditampilkan** (keputusan saya, agar bar muat di 360px).
- `Index.tsx`: baca `?demo=` via `useSearchParams` → `getMockDashboard`; `pickRecommendation` + `summarize` dihitung dari data. Urutan DOM (sama untuk semua breakpoint): TopBar → sapaan (`h1` "Halo, {studentName}") → `HeroCard` atau `EmptyState` → `SummaryStrip` → kartu "Topikmu" berisi daftar `TopicRow` + baris tautan "+ Tambah topik" (→ `/topicSelect`, tinggi min 56px). Jika `pickRecommendation` mengembalikan `empty` (topik kosong atau semuanya locked): tampilkan `EmptyState` saja (tanpa hero/ringkasan/daftar). Layout: kontainer `mx-auto max-w-5xl px-4 sm:px-6 py-6`; `lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-6` dengan kolom kiri = sapaan + hero + ringkasan, kolom kanan = kartu "Topikmu"; di bawah `lg` semua satu kolom. Beri komentar `// TODO: ganti getMockDashboard dengan data Supabase (student_progress)` di satu tempat.
- Dokumen: ganti baris USER_FLOWS §4 menjadi "Top bar: Dashboard, Topik, Keluar; Peta/AI Tutor ditambahkan saat route-nya ada"; tambahkan satu paragraf status di `session-progress.md` (dashboard terimplementasi dengan mock, cara pakai `?demo=budi|sari|empty|done`, yang belum: data Supabase, route journey).

- [ ] **Step 1: Implementasi `DashboardTopBar`.**
- [ ] **Step 2: Tulis ulang `Index.tsx`** sesuai spesifikasi.
- [ ] **Step 3: Otomatis** — jalankan `npm run test` → semua PASS; `npm run build` → sukses tanpa error TS; `npm run lint` → tanpa error.
- [ ] **Step 4: Review visual (otomatis + saya baca gambar)** — alat sudah terpasang sebelum eksekusi: devDependency `playwright-core` (pinned), `scripts/screenshot.mjs`, script `npm run screenshot`, dan `.screenshots/` di `.gitignore`. Memakai Microsoft Edge yang sudah ada (`BROWSER_CHANNEL=chrome` untuk Chrome); tidak ada unduhan browser.
  - Jalankan dev server **sendiri** di port bebas agar tidak terganggu server lama yang cache dependensinya basi (terjadi 2026-10-14: server di 5173 menghasilkan halaman putih karena 504 "Outdated Optimize Dep" setelah `npm install`): `npm run dev -- --port 5174 --strictPort`, lalu `BASE_URL=http://localhost:5174 npm run screenshot`. Matikan hanya server yang kita mulai.
  - Skrip memotret 4 skenario (`budi`, `sari`, `empty`, `done`) × 2 lebar (360px, 1280px) ke `.screenshots/`, dan exit code 1 bila ada overflow horizontal. Expected: semua baris `ok`, exit 0.
  - Baca setiap PNG dengan tool `read` (mode Image) dan periksa: hero gelap menjadi titik fokus; `budi` dan `sari` menampilkan topik hero **berbeda**; badge selalu ber-teks; nama topik terpotong rapi tanpa merusak baris; `empty` hanya `EmptyState` tanpa `NaN`; `done` menampilkan "Semua topikmu sudah dikuasai"; urutan mobile = TopBar → sapaan → hero → ringkasan → Topikmu; desktop = dua kolom. Perbaiki temuan, ulangi sampai bersih.
  - Batas: screenshot statis tidak menunjukkan count-up, hover, atau reduced-motion — dua hal itu dicek manual oleh user di browser (reduced motion: DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, angka hero harus langsung final), plus tab keyboard: setiap link/tombol menampilkan focus ring pink.
- [ ] **Step 5: Perbarui dua dokumen** sesuai spesifikasi, lalu `npm run build` sekali lagi.
