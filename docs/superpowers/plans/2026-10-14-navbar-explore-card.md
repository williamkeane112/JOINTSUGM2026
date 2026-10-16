# Navbar Tengah + Kartu "Jelajahi topik" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pindahkan navigasi dashboard (Dashboard, Topik) ke tengah navbar, hapus tautan "Jelajahi topik" di judul "Topikmu", dan ganti kartu topik terkunci di grid dengan satu kartu "Jelajahi topik" di slot terakhir.

**Architecture:** Navbar memakai grid tiga kolom `minmax(0,1fr) auto minmax(0,1fr)` agar navigasi tepat di tengah layar. Grid topik hanya menampilkan topik yang sudah dimulai (helper murni `startedTopics`, diuji) dan ditutup oleh komponen baru `ExploreCard`. Data `locked` tetap ada di tipe dan mock (halaman Topik nanti memakainya); dashboard hanya berhenti menampilkannya.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4 (`pointer-coarse:`), `lucide-react`, Vitest, `playwright-core` + Edge untuk skrip screenshot.

**Spec:** Diskusi 2026-10-14 malam: (1) navigasi di tengah, setuju; (2) kartu terkunci diganti kartu Jelajahi topik, topik terkunci pindah ke halaman Topik nanti. Melanjutkan `docs/superpowers/plans/2026-10-14-dashboard-scale-down.md` (skala, `.btn-sm`, `tracking-[...]!`, `pointer-coarse:` dipakai ulang).

## Global Constraints

- Lingkup: `src/page/dashboard/*`, `scripts/screenshot.mjs`, dan dua dokumen steering di Task 5. **Jangan** ubah `Auth.tsx`, `App.tsx`, `src/lib/*`, `types.ts`, atau `mockData.ts` (data `locked` dipertahankan untuk halaman Topik).
- Skala dari plan scale-down tetap berlaku: judul kartu `text-base`, meta `text-xs`, teks tidak di bawah 12px, `min-h-28 p-4` untuk kartu, pill 36px (`pointer-coarse:` 44px), letter-spacing judul memakai sufiks `!` (`tracking-[-0.01em]!`) karena aturan global h1-h4 tidak berlapis.
- Satu deklarasi elevasi per kartu: `ExploreCard` memakai border putus-putus **tanpa** bayangan. Radius mengikuti `--radius-card`.
- Area sentuh: seluruh `ExploreCard` adalah tautan (≥ 44px tinggi); kontrol navbar tetap `h-9 pointer-coarse:h-11`.
- Urutan DOM navbar = urutan visual: brand, navigasi, akun.
- Teks UI Bahasa Indonesia: "Jelajahi topik" (judul kartu), "Mulai topik baru" (keterangan).
- Tidak ada commit kecuali user meminta. Lint: `eslint-plugin-react-hooks` v7.
- Review visual: server dev sendiri di port bebas (`npm run dev -- --port 5174 --strictPort`), lalu `BASE_URL=http://localhost:5174 npm run screenshot`; salin screenshot ke nama baru sebelum dibaca ulang; matikan hanya server yang kita mulai. Satu putaran verifikasi terbatas.

## Review Focus

1. Navigasi tetap di tengah pada 360px dengan dua item, tanpa overflow horizontal (Task 1, 4).
2. Siswa tanpa topik yang dimulai: hanya `EmptyState`, tanpa grid dan tanpa `ExploreCard` (Task 3, 4).
3. Semua topik sudah dimulai (skenario `done`, tanpa terkunci): `ExploreCard` tetap kartu terakhir (Task 4).
4. `ExploreCard` tidak terbaca sebagai topik: tanpa persen, badge, atau isi latar status (Task 2, 4 baca screenshot).
5. Fokus keyboard pada `ExploreCard` terlihat, nama aksesibel jelas, area sentuh ≥ 44px (Task 4 `TOUCH=1`).
6. Grid 4 kolom di `lg`: 3 topik + kartu Jelajahi muat satu baris; 2 kolom di `sm`; 1 kolom di mobile (Task 3, 4).
7. `startedTopics` mempertahankan urutan dan tidak mengubah array masukan (Task 2).

## File Structure

| File | Aksi | Tanggung jawab |
|---|---|---|
| `scripts/screenshot.mjs` | Ubah | metrik baru `navOffset`: jarak tengah `header nav` ke tengah viewport |
| `src/page/dashboard/DashboardTopBar.tsx` | Ubah | grid tiga kolom, navigasi di tengah |
| `src/page/dashboard/dashboardLogic.ts` (+test) | Ubah | tambah `startedTopics`; dipakai `pickRecommendation` dan `summarize` |
| `src/page/dashboard/ExploreCard.tsx` | Buat | kartu ajakan "Jelajahi topik" ke `/topicSelect` |
| `src/page/dashboard/TopicCard.tsx` | Ubah | hapus cabang terkunci (tidak lagi dirender) |
| `src/page/dashboard/ProgressCard.tsx` | Ubah | pakai `startedTopics` |
| `src/page/dashboard/Index.tsx` | Ubah | hapus tautan di judul, grid hanya topik dimulai + `ExploreCard` |
| `.kiro/steering/01-mvp-scope.md`, `.kiro/steering/session-progress.md` | Ubah | selaraskan deskripsi dashboard |

---

### Task 1: Metrik pemusatan navigasi (gagal dulu)

**Files:**
- Modify: `scripts/screenshot.mjs`

**Interfaces:**
- Produces: `collectMetrics` mengembalikan `navOffset: number | null` = `Math.abs(navCenterX - window.innerWidth / 2)` untuk `header nav` (null bila tidak ada). Baris `metrics …` mencetak `navOffset=<n>px`. Proses keluar kode 1 bila `navOffset > 1` pada rute `/dashboard` yang memiliki navbar. Dipakai Task 4 sebagai bukti.

- [ ] **Step 1: Tambah `navOffset`** di `collectMetrics`: `const nav = document.querySelector("header nav")`; hitung dari `getBoundingClientRect()` (tengah = `left + width/2`; bandingkan dengan `document.documentElement.clientWidth / 2`, bukan `innerWidth`, agar scrollbar tidak menggeser). Tambah ke output dan flag `navOffCenter ||= offset > 1`, masukkan ke kondisi `process.exit`.
- [ ] **Step 2: Jalankan baseline** (server 5174): `BASE_URL=http://localhost:5174 npm run screenshot -- "/dashboard?demo=budi"`. Expected: `navOffset` jauh di atas 1px pada desktop (navigasi sekarang rata kiri) dan exit code 1. Ini membuktikan pemeriksaan bisa gagal.

---

### Task 2: Helper `startedTopics` (TDD)

**Files:**
- Modify: `src/page/dashboard/dashboardLogic.ts`
- Test: `src/page/dashboard/dashboardLogic.test.ts`

**Interfaces:**
- Produces: `export function startedTopics(topics: DashTopic[]): DashTopic[]` — mengembalikan topik dengan `locked === false`, urutan asli, array baru (masukan tidak berubah). `pickRecommendation` dan `summarize` memakainya menggantikan filter inline.

- [ ] **Step 1: Tulis test gagal** di blok `describe("startedTopics")`: (a) `startedTopics([])` → `[]`; (b) campuran `a`(terbuka), `b`(terkunci), `c`(terbuka) → ids `["a","c"]` berurutan; (c) semua terkunci → `[]`; (d) array masukan tidak termutasi (panjang dan isi sama setelah panggilan) dan hasil bukan referensi array yang sama.
- [ ] **Step 2: Jalankan** `npx vitest run src/page/dashboard/dashboardLogic.test.ts`. Expected: FAIL (`startedTopics` belum diekspor).
- [ ] **Step 3: Implementasi** `startedTopics` di `dashboardLogic.ts`; ganti `topics.filter((topic) => !topic.locked)` di `pickRecommendation` dan `data.topics.filter(...)` di `summarize` dengan helper itu.
- [ ] **Step 4: Jalankan** `npm run test`. Expected: semua lulus (51 + 4 baru = 55), tidak ada tes lama yang berubah.

---

### Task 3: `ExploreCard`, grid, dan penghapusan tautan judul

**Files:**
- Create: `src/page/dashboard/ExploreCard.tsx`
- Modify: `src/page/dashboard/TopicCard.tsx`, `src/page/dashboard/ProgressCard.tsx`, `src/page/dashboard/Index.tsx`

**Interfaces:**
- Consumes: `startedTopics` (Task 2).
- Produces: `export default function ExploreCard()` — tanpa props; `<Link to="/topicSelect">`.

- [ ] **Step 1: `ExploreCard.tsx`** — `Link` ke `/topicSelect`. Kelas dasar: `flex min-h-28 flex-col rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-line)] p-4 text-[var(--color-ink)] transition-colors hover:border-[var(--color-pink)] hover:bg-[var(--color-surface)]` (tanpa bayangan). Isi: judul "Jelajahi topik" (`font-display text-base font-bold tracking-[-0.01em]!`), keterangan "Mulai topik baru" (`mt-1 text-xs text-[var(--color-muted)]`), dan di bawah (`mt-auto pt-3`) lingkaran `size-8` berisi ikon `Plus` `size={16}` (lucide), `aria-hidden`, warna `--color-pink-deep` di atas `--color-surface` dengan ring `--color-line` (bukan `--color-night`, agar tidak terbaca sebagai kartu topik).
- [ ] **Step 2: `TopicCard.tsx`** — hapus cabang `if (topic.locked) { … }` beserta impor `Lock`, `STATUS_LABEL` bila tidak lagi dipakai (`STATUS_LABEL` masih dipakai badge status); biarkan `statusStyle.ts` apa adanya (entri `locked` dipakai halaman Topik nanti).
- [ ] **Step 3: `ProgressCard.tsx`** — ganti `topics.filter((topic) => !topic.locked)` dengan `startedTopics(topics)`.
- [ ] **Step 4: `Index.tsx`** — hapus `<Link … Jelajahi topik>` dari baris judul (judul "Topikmu" berdiri sendiri; sesuaikan wadah dari `flex … justify-between` bila tinggal satu anak) dan hapus impor `ArrowRight`/`Link` yang tidak lagi dipakai. Grid: `const started = startedTopics(data.topics)`; render `started.map(...)` ke `<li><TopicCard/></li>` lalu satu `<li className="flex [&>*]:flex-1"><ExploreCard /></li>` di akhir; kelas grid menjadi `grid gap-3 sm:grid-cols-2 lg:grid-cols-4` (hapus `xl:grid-cols-4`).
- [ ] **Step 5: Verifikasi** `npm run lint && npm run test`. Expected: lulus tanpa peringatan impor tak terpakai.

---

### Task 4: Navbar tengah dan verifikasi visual (satu putaran)

**Files:**
- Modify: `src/page/dashboard/DashboardTopBar.tsx`

**Interfaces:**
- Consumes/Produces: tidak ada perubahan props (`studentName: string`).

- [ ] **Step 1: Kerangka navbar** — wadah dalam: `mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 lg:px-8`. Brand: `justify-self-start`, hapus `sm:mr-3`. `<nav>`: hapus `flex-1`, tetap `flex items-center gap-2`. Blok akun: tambah `justify-self-end`. Urutan DOM tetap.
- [ ] **Step 2: Batch verifikasi** (server 5174): `npm run test`, `npm run lint`, `npm run build`; lalu `BASE_URL=… npm run screenshot` (4 skenario × 3 viewport) dan `TOUCH=1 BASE_URL=… npm run screenshot`. Expected: tanpa `OVERFLOW`, `small=0`, `touch=0`, `navOffset` ≤ 1px di semua viewport dan skenario.
- [ ] **Step 3: Baca screenshot** desktop dan mobile `budi` serta desktop `done` (salin ke nama baru dulu): navigasi di tengah; 3 kartu topik + kartu Jelajahi sebaris di desktop; `ExploreCard` jelas berbeda dari kartu topik; tidak ada kartu terkunci; judul "Topikmu" tanpa tautan. Satu putaran perbaikan batch bila ada temuan, satu verifikasi ulang, lalu berhenti.

---

### Task 5: Dokumen dan kebersihan

**Files:**
- Modify: `.kiro/steering/01-mvp-scope.md`, `.kiro/steering/session-progress.md`

- [ ] **Step 1: `01-mvp-scope.md` §6** — ubah baris "Grid kartu topik … dan tautan 'Jelajahi topik'" menjadi grid topik yang sudah dimulai yang ditutup kartu "Jelajahi topik" (topik terkunci tidak tampil di dashboard); ubah baris navbar: navigasi di tengah.
- [ ] **Step 2: `session-progress.md`** — tambah bagian singkat bertanggal: keputusan (kartu Jelajahi menggantikan kartu terkunci; topik terkunci pindah ke halaman Topik), konsekuensi (**bukti prasyarat terkunci/terbuka belum terlihat di aplikasi sampai `/topicSelect` dibangun**; kriteria demo #5 bergantung padanya), batas navigasi tengah di HP (maks. 3 item sebelum perlu bottom nav).
- [ ] **Step 3: Kebersihan** — matikan server 5174 yang kita mulai, hapus salinan screenshot sementara dari `.screenshots/`, `git diff --stat` tidak memuat `Auth.tsx`, `App.tsx`, `src/lib`, `types.ts`, `mockData.ts`.

---

## Self-Review

- **Cakupan:** navigasi tengah (Task 1, 4), tautan judul dihapus + kartu Jelajahi menggantikan kartu terkunci (Task 3), grid 4 kolom (Task 3), dokumen (Task 5). Tidak ada kebutuhan tanpa tugas.
- **Konsistensi nama:** `startedTopics` (Task 2) dipakai di Task 3; `ExploreCard` dibuat dan dipakai di Task 3; `navOffset` dibuat di Task 1 dan diverifikasi di Task 4.
- **Pilihan saya, bukan keputusan user:** grid `lg:grid-cols-4` (agar 3 topik + Jelajahi sebaris), ikon Plus berwarna pink-deep di atas permukaan putih (bukan `--color-night`), `statusStyle.ts` dibiarkan memuat entri `locked`.
- **Risiko terbuka:** pemusatan navigasi di 360px dengan dua item masih perkiraan sampai Task 4 mengukur; item navigasi ketiga di HP akan memecahkan pemusatan (dicatat di Task 5).
