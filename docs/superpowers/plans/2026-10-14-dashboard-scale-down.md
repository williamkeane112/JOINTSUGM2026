# Dashboard Scale-Down (Tipografi + Kepadatan) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perkecil tampilan dashboard (font, padding, jarak, tinggi komponen) tanpa mengubah struktur, warna, atau perilaku, sehingga terasa ringkas dan hampir muat di satu layar laptop (1280x800).

**Architecture:** Hanya perubahan class Tailwind di komponen dashboard, ditambah dua class kecil di `src/index.css` (`.btn-sm`, `.badge-sm`) yang tidak mengubah default `.btn-primary`/`.badge-*`. Skala font diturunkan per peran (6 tingkat) dan ukuran tetap (tinggi minimum, avatar, tombol) ikut diturunkan. Area sentuh 44px dipertahankan di layar sentuh lewat varian `pointer-coarse:`. Tidak ada komponen baru dan tidak ada perubahan logika.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4 (`^4.3.3`, mendukung `pointer-coarse:`), Vitest, `playwright-core` + Microsoft Edge untuk screenshot.

**Spec:** Analisis percakapan 2026-10-14 ("Analisa Dashboard Skala"), diringkas di bagian *Skala Target* di bawah. Plan ini mengubah tampilan hasil `docs/superpowers/plans/2026-10-14-dashboard-v2.md`; struktur dan logika v2 dipertahankan.

## Global Constraints

- Lingkup hanya `src/page/dashboard/*`, `src/index.css` (hanya menambah class), dan `scripts/screenshot.mjs`. **Jangan** ubah `Auth.tsx`, `App.tsx`, `src/lib/*`, atau default `.btn-primary`/`.btn-secondary`/`.card`/`.badge-*`.
- Teks tidak boleh lebih kecil dari **12px** (termasuk teks SVG grafik). Label "Dikuasai" di grafik dan penanda hero yang sekarang 11px naik ke 12px.
- Area sentuh minimal 44px di layar sentuh. Di desktop (pointer halus) tampilan boleh 36px, tetapi di layar sentuh tinggi/lebar kontrol interaktif kembali ke ≥ 44px lewat `pointer-coarse:`.
- Warna, kontras, cincin fokus (`:focus-visible` global), urutan DOM, dan teks UI tidak berubah. Tidak ada font baru.
- Badge status tetap memuat teks (status tidak pernah hanya warna).
- **Letter-spacing:** aturan global `h1..h4, .font-display { letter-spacing: -0.03em }` di `index.css` **tidak berlapis (`@layer`)**, sehingga mengalahkan utilitas Tailwind `tracking-*` (utilitas ada di layer). Jangan ubah aturan global itu (akan mengubah Auth). Di dashboard, pakai sufiks important Tailwind: `tracking-[-0.01em]!`. Task 1 membuktikan klaim ini lewat computed style sebelum Task 2 bergantung padanya.
- Lint: `eslint-plugin-react-hooks` v7. Tidak ada commit kecuali user meminta.
- Review visual: server dev sendiri di port bebas (`npm run dev -- --port 5174 --strictPort`), lalu `BASE_URL=http://localhost:5174 npm run screenshot`. Tool baca gambar meng-cache per nama file: salin screenshot ke nama baru sebelum dibaca ulang. Satu putaran verifikasi terbatas (lihat Task 6), bukan loop.

## Skala Target

Enam peran font (semua rem tetap, tidak fluid):

| Peran | Sekarang | Target | Kelas Tailwind |
|---|---|---|---|
| Angka utama hero | 72 / 96px | 48px | `text-5xl` |
| Judul hero | 30 / 36px | 24px | `text-2xl` |
| Sapaan "Halo, …" | 24 / 30px | 20px | `text-xl` |
| Kalimat kunci kartu progres | 24px | 20px | `text-xl` |
| Persen di kartu topik | 30px | 24px | `text-2xl` |
| Judul kartu / seksi | 18px | 16px | `text-base` |
| Nilai statistik | 18px | 16px | `text-base` |
| Deskripsi | 16px | 14px | `text-sm` |
| Label, badge, meta, teks grafik | 11–14px | 12px | `text-xs` / `fontSize={12}` |

Kepadatan:

| Item | Sekarang | Target |
|---|---|---|
| Padding kartu | `p-5 sm:p-6` | `p-4 sm:p-5` |
| Padding hero (`HERO_SURFACE`) | `p-6 sm:p-8` | `p-5 sm:p-6` |
| Jarak antar-kartu / blok | `gap-5`, `space-y-5` | `gap-4`, `space-y-4` |
| Padding vertikal halaman | `py-6 lg:py-8` | `py-5 lg:py-6` |
| Container | `max-w-7xl` | `max-w-6xl` (pilihan saya) |
| Navbar: padding, pill, avatar | `py-3`, `min-h-11`, `size-10` | `py-2`, `h-9` (`pointer-coarse:h-11`), `size-8` |
| Kartu topik | `min-h-40 p-5`, panah `size-10` | `min-h-28 p-4`, panah `size-8` (`pointer-coarse:size-11`) |
| Tombol hero | `min-h-12` | `.btn-sm` (`min-h-10`, `pointer-coarse:min-h-11`) |
| Grafik (tinggi SVG) | 240 / 200px | 200 / 170px |
| Track hero | `h-2.5` | `h-2` |

Perkiraan total tinggi halaman desktop: ±1140px → ±840px. Ini hitungan kasar; Task 6 mengukurnya.

## Review Focus

1. Ukuran font efektif di bawah 12px di elemen mana pun, termasuk teks SVG (Task 1 mengukurnya, Task 6 memverifikasi nol temuan).
2. Letter-spacing dashboard benar-benar berubah (computed style), bukan tertimpa aturan global (Task 1 membuktikan, Task 2 memakai).
3. Auth tidak berubah: `Auth.tsx`, default `.btn-primary`/`.badge-*` tidak tersentuh (Task 2, 6 `git diff --stat`).
4. Kontrol interaktif di layar sentuh tetap ≥ 44px (Task 6 mengukur dengan emulasi `hasTouch`).
5. Nama topik panjang, angka 3 digit, dan viewport 360px tidak membuat overflow horizontal (script screenshot sudah memeriksa overflow).
6. Skenario `empty` dan `done` memakai permukaan hero yang sama, jadi harus ikut mengecil (Task 3).

## File Structure

| File | Aksi | Tanggung jawab |
|---|---|---|
| `scripts/screenshot.mjs` | Ubah | tambah laporan metrik: tinggi halaman, teks < 12px, ukuran target sentuh, letter-spacing judul |
| `src/index.css` | Ubah | tambah `.btn-sm`, `.badge-sm` (class baru saja) |
| `src/page/dashboard/statusStyle.ts` | Ubah | `HERO_SURFACE` lebih rapat |
| `src/page/dashboard/DashboardTopBar.tsx` | Ubah | navbar lebih rendah |
| `src/page/dashboard/Index.tsx` | Ubah | container, jarak, sapaan |
| `src/page/dashboard/HeroCard.tsx`, `EmptyState.tsx` | Ubah | font hero, tombol `.btn-sm`, track |
| `src/page/dashboard/ProgressCard.tsx`, `TopicCard.tsx` | Ubah | font, padding, tinggi minimum |
| `src/page/dashboard/MasteryCurve.tsx` | Ubah | tinggi grafik, teks SVG 12px |

---

### Task 1: Ukur kondisi sekarang (baseline) dan buktikan klaim letter-spacing

**Files:**
- Modify: `scripts/screenshot.mjs`

**Interfaces:**
- Produces: setiap run `npm run screenshot` mencetak per viewport satu baris metrik `metrics <name> <width>px <route> height=<n> small=<n> touch=<n> tracking=<h1|h2 computed>`, dan proses keluar dengan kode 1 bila ada teks < 12px (selain overflow). Task 2–6 memakai output ini sebagai bukti.

- [ ] **Step 1: Tambah fungsi `collectMetrics(page)` di `scripts/screenshot.mjs`** yang menjalankan `page.evaluate` dan mengembalikan:
  - `height`: `document.documentElement.scrollHeight`
  - `small`: jumlah elemen yang menampung teks langsung (node teks non-kosong, atau elemen SVG `<text>`) dengan `parseFloat(getComputedStyle(el).fontSize) < 12`
  - `tracking`: `getComputedStyle(document.querySelector("main h1, main h2")).letterSpacing` (judul pertama dashboard)
  - Cetak sebagai baris `metrics …`; tambah `smallFound` ke kondisi exit code.
- [ ] **Step 2: Tambah mode sentuh** — bila env `TOUCH=1`, buat context dengan `hasTouch: true, isMobile: false` dan hitung `touch`: jumlah `a, button` terlihat di dalam `header` dan `main` yang tinggi atau lebarnya < 44px (pakai `getBoundingClientRect`). Tanpa `TOUCH=1`, `touch=skip`. Catatan: emulasi `pointer: coarse` di Chromium butuh `isMobile`/`hasTouch`; bila `pointer-coarse:` tidak aktif lewat `hasTouch` saja, gunakan `isMobile: true` pada viewport 360px.
- [ ] **Step 3: Jalankan baseline** (server dev port 5174): `BASE_URL=http://localhost:5174 npm run screenshot -- "/dashboard?demo=budi"`.
  Expected: baris `metrics` untuk mobile/tablet/desktop. Catat `height` desktop (±1140), jumlah `small` (> 0 karena label 11px), dan nilai `tracking` (jika `-0.03em` dalam px, mis. `-0.9px` untuk 30px, klaim aturan global menang terbukti karena kelas `tracking-[-0.02em]` di `HeroCard` tidak berlaku).
- [ ] **Step 4: Verifikasi** `npm run lint` dan `npm run test` masih lulus (script bukan bagian bundel).

---

### Task 2: Class kecil bersama dan permukaan hero

**Files:**
- Modify: `src/index.css` (hanya menambah di dalam `@layer components`)
- Modify: `src/page/dashboard/statusStyle.ts`

**Interfaces:**
- Produces:
  - `.btn-sm` — dipakai bersama `.btn-primary`: `padding: 0.5rem 1rem; font-size: 0.875rem; min-height: 2.5rem`, dan di `@media (pointer: coarse)` `min-height: 2.75rem`.
  - `.badge-sm` — dipakai bersama `.badge-*`: `padding: 0.125rem 0.625rem; font-size: 0.75rem`.
  - `HERO_SURFACE` (string) = `"rounded-[var(--radius-card)] bg-[var(--color-night)] p-5 text-[var(--color-cream)] sm:p-6"`.
- Consumes: tidak ada.

- [ ] **Step 1: Tambahkan `.btn-sm` dan `.badge-sm`** di `@layer components` pada `src/index.css`, setelah blok badge. Jangan ubah deklarasi yang sudah ada. Karena `.btn-primary` sudah di layer yang sama dan didefinisikan lebih awal, letakkan `.btn-sm` setelahnya agar menang.
- [ ] **Step 2: Ubah `HERO_SURFACE`** di `statusStyle.ts` sesuai Interfaces.
- [ ] **Step 3: Verifikasi** `git diff --stat` hanya menunjukkan `src/index.css` (penambahan) dan `statusStyle.ts`; `npm run lint && npm run test` lulus.

---

### Task 3: Shell halaman, navbar, hero, dan empty state

**Files:**
- Modify: `src/page/dashboard/Index.tsx`
- Modify: `src/page/dashboard/DashboardTopBar.tsx`
- Modify: `src/page/dashboard/HeroCard.tsx`
- Modify: `src/page/dashboard/EmptyState.tsx`

**Interfaces:**
- Consumes: `HERO_SURFACE`, `.btn-sm` dari Task 2.
- Produces: tidak ada API baru.

- [ ] **Step 1: `Index.tsx`** — `<main>`: `max-w-6xl`, `py-5 lg:py-6`; semua `space-y-5` dan `gap-5` → `space-y-4`/`gap-4`; sapaan `text-xl font-bold` dengan `tracking-[-0.01em]!`; judul seksi "Topikmu" `text-base`; tautan "Jelajahi topik" `text-sm` dengan area sentuh `min-h-9 pointer-coarse:min-h-11`; grid topik `gap-3`.
- [ ] **Step 2: `DashboardTopBar.tsx`** — kontainer `max-w-6xl py-2`; `pill`: `h-9 px-4 text-sm pointer-coarse:h-11`; avatar `size-8 text-xs`; tautan brand `min-h-9 text-base pointer-coarse:min-h-11`, ikon `size={20}`; tombol Keluar `max-sm:min-w-9 pointer-coarse:max-sm:min-w-11`.
- [ ] **Step 3: `HeroCard.tsx`** — judul `text-2xl` (hapus `sm:text-4xl`) dengan `tracking-[-0.01em]!`; angka `text-5xl` dan satuan `%` `text-2xl` (hapus `text-7xl sm:text-8xl` dan `text-4xl sm:text-5xl`); kolom kanan md `minmax(0,15rem)` dan `md:gap-x-8`; track `h-2`, `mt-4 pb-5`; label "Dikuasai" `text-xs`; deskripsi `text-sm`; tombol: `btn-primary btn-sm`, ikon `size={16}`, hapus `min-h-12`. Perbaiki juga baris penutup `</div>        </div>` yang menyatu pada satu baris (format saja).
- [ ] **Step 4: `EmptyState.tsx`** — judul `text-2xl` dengan `tracking-[-0.01em]!`, deskripsi `text-sm`, tombol `btn-primary btn-sm`.
- [ ] **Step 5: Verifikasi** `npm run lint && npm run test` lulus.

---

### Task 4: Kartu progres dan kartu topik

**Files:**
- Modify: `src/page/dashboard/ProgressCard.tsx`
- Modify: `src/page/dashboard/TopicCard.tsx`

**Interfaces:**
- Consumes: `.badge-sm` dari Task 2.
- Produces: tidak ada API baru; props komponen tidak berubah.

- [ ] **Step 1: `ProgressCard.tsx`** — `section`: `card p-4 sm:p-5` (kelas `card` sudah `p-6`; override lewat utilitas setelahnya seperti sekarang); judul `text-base`; kalimat kunci `text-xl` dengan `tracking-[-0.01em]!`; jarak `mt-2`; bar `mt-3`; baris statistik `py-2`, label tetap `text-sm`, nilai `text-base`; `pt-4`.
- [ ] **Step 2: `TopicCard.tsx`** — `cardBase`: `min-h-28 p-4`; nama topik `text-base`; persen `text-2xl`; badge memakai `badge-sm` (hapus override `px-2.5 py-0.5 text-xs` yang berulang); meta `text-xs`; `pt-3`; tombol panah `size-8 pointer-coarse:size-11`, ikon `size={16}`; varian terkunci: ikon `size={16}`, deskripsi `text-sm`.
- [ ] **Step 3: Verifikasi** `npm run lint && npm run test` lulus.

---

### Task 5: Grafik penguasaan

**Files:**
- Modify: `src/page/dashboard/MasteryCurve.tsx`

**Interfaces:**
- Consumes/Produces: tidak ada perubahan props atau tipe.

- [ ] **Step 1: Kartu** — `card p-4 sm:p-5`; judul `text-base`; subjudul `text-xs`; pesan kosong `text-sm`; legenda `text-xs` (sudah), penanda `size-2.5`.
- [ ] **Step 2: Ukuran SVG** — `const height = width < 520 ? 170 : 200`; `PAD = { top: 26, right: 70, bottom: 26, left: 30 }`; semua `fontSize` SVG jadi `12` (sumbu 11→12, "Dikuasai" 12, label nilai 13→12 `fontWeight 700`, label kiri/kanan 12); `y={height - 8}` tetap.
- [ ] **Step 3: Verifikasi** `npm run lint && npm run test` lulus.

---

### Task 6: Satu putaran verifikasi dan catatan

**Files:**
- Modify: `.kiro/steering/session-progress.md` (satu bagian singkat baru di akhir)

- [ ] **Step 1: Jalankan satu batch** (server 5174): `BASE_URL=http://localhost:5174 npm run screenshot` untuk empat skenario dan tiga viewport. Expected: semua baris `ok`, `small=0`, `tracking` tidak lagi `-0.03em` pada judul dashboard (mis. `-0.2px` untuk 20px), tidak ada `OVERFLOW`.
- [ ] **Step 2: Ukuran sentuh** — jalankan `TOUCH=1 BASE_URL=... npm run screenshot -- "/dashboard?demo=budi"`. Expected: `touch=0` di semua viewport.
- [ ] **Step 3: Cek tinggi** — `height` desktop `?demo=budi` dibandingkan baseline Task 1; target ≈ 840px (≤ 900px dianggap lulus; bila lebih, catat angka dan sampaikan ke user, jangan memperkecil lagi tanpa konfirmasi).
- [ ] **Step 4: Baca screenshot** desktop dan mobile `budi` (salin ke nama baru dulu) dan periksa: hierarki hero > kartu > teks kecil terbaca dengan mata disipitkan; spasi antar-kata judul tidak rapat; angka hero tidak terlalu dominan; tidak ada teks terpotong. Satu putaran perbaikan batch bila ada temuan, lalu satu verifikasi ulang, lalu berhenti.
- [ ] **Step 5: Pastikan kebersihan** — `npm run test`, `npm run lint`, `npm run build` lulus; `git diff --stat` tidak memuat `Auth.tsx`, `App.tsx`, `src/lib`; hapus semua salinan screenshot sementara dari `.screenshots/` yang dibuat plan ini.
- [ ] **Step 6: Tambah bagian "Skala dashboard diperkecil (2026-10-14)"** di `session-progress.md`: angka baseline vs hasil (tinggi, jumlah tingkat font), keputusan yang diambil (6 tingkat font, container `max-w-6xl`, `.btn-sm`/`.badge-sm`, sufiks `!` untuk letter-spacing karena aturan global tidak berlapis), dan bahwa umpan balik "kurang suka" belum tentu terselesaikan oleh perubahan ini saja.

---

## Self-Review

- **Cakupan analisis:** skala font (Task 3–5), ukuran tetap (Task 3–4), padding/jarak (Task 3–5), letter-spacing (Task 1, 3–4), area sentuh (Task 2, 3, 4, 6), lingkup Auth (Global Constraints, Task 2, 6). Tidak ada yang tanpa tugas.
- **Konsistensi nama:** `.btn-sm`, `.badge-sm`, `HERO_SURFACE` didefinisikan di Task 2 dan dipakai di Task 3–4.
- **Risiko terbuka:** (1) klaim cascade letter-spacing dibuktikan di Task 1 sebelum dipakai; (2) emulasi `pointer: coarse` di Edge dibatasi, catatan fallback ada di Task 1 Step 2; (3) estimasi tinggi 840px belum terukur.
- **Pilihan saya, bukan keputusan user:** container `max-w-6xl`, enam tingkat font, ambang lulus tinggi ≤ 900px.
