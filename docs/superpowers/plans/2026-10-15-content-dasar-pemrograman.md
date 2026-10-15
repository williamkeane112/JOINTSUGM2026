# Konten Dasar Pemrograman Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Isi topik Dasar Pemrograman (17 skill) dengan materi dan bank soal berkualitas yang terverifikasi, dan sesuaikan mesin diagnostic dengan struktur unit + prasyarat.

**Architecture:** JSON di `src/content`, dicek `validateContent.ts` (Vitest) dan `scripts/verify-content.mjs` (menjalankan Python); mesin di `src/lib/algorithms`.

**Tech Stack:** JSON, TypeScript, Vitest, Python 3.12 untuk verifikasi.

**Spec:** keputusan di `.kiro/steering/session-progress.md` bagian "Konten & alur belajar (2026-10-15)".

---

## Global Constraints

- Isi konten (materi + soal) ditulis/disunting oleh **model utama**, bukan subagent — ini bukan diff mekanis, kualitasnya menentukan hasil demo (lihat `AGENTS.md` §2 "Aturan kode UI", prinsip yang sama berlaku untuk konten).
- Subagent **boleh** membuat draf awal dari panduan gaya yang sudah dibekukan (T3), tapi model utama meninjau dan menyunting tiap soal sebelum dianggap selesai — draf subagent adalah klaim, bukan bukti.
- Semua kode contoh pada materi dan soal harus benar-benar dijalankan (Python 3.12 via `scripts/verify-content.mjs`), bukan ditebak manual.
- `skill_key` global memakai format `<topik>.<skill>` (mis. `dasar-pemrograman.variabel`); tidak boleh ada duplikat.
- Tidak membuat tabel/migrasi Supabase baru sampai skema tim pasti (T10 ditunda).
- Jangan commit kecuali diminta user.
- Gunakan tool tulis file (bukan `Set-Content`/PowerShell) untuk semua perubahan.

## Review Focus

1. Tiap soal menguji kemampuan (tebak output, tebak error, pilih kode) — bukan definisi/istilah yang bisa dihafal tanpa paham.
2. Tiap pilihan jawaban salah mewakili miskonsepsi nyata pemula, bukan pengisi acak, dan punya feedback spesifik untuk miskonsepsi itu.
3. Kode di materi tidak sama (atau mirip persis) dengan kode di soal untuk skill yang sama — mencegah siswa menjawab lewat pattern-matching, bukan paham.
4. Semua contoh kode (materi dan soal) sudah diverifikasi jalan oleh `scripts/verify-content.mjs` sebelum skill dianggap selesai — tidak ada kode yang "kelihatannya benar" tapi belum dieksekusi.
5. Prasyarat antar-skill konsisten dengan urutan unit (skill di unit N tidak mensyaratkan skill di unit N+1 atau skill yang belum ditulis).
6. `skill_key` unik secara global dan konsisten dengan format `<topik>.<skill>` di semua file yang menyebutnya (`topic.json`, bank soal, `learningPath.ts`, `diagnostic.ts`).

## File Structure

| File | Status | Isi |
| --- | --- | --- |
| `src/content/types.ts` | T1 | Tipe `Topic`, `Unit`, `Skill`, `SkillContent`, `Question`, `QuestionOption` |
| `src/content/validateContent.ts` | T1 | Validator terstruktur (skema, prasyarat valid, skill_key unik) |
| `src/content/validateContent.test.ts` | T1 | Vitest untuk validator |
| `scripts/verify-content.mjs` | T1 | Jalankan Python untuk tiap blok kode materi/soal, lapor kode yang gagal |
| `package.json` | T1 | tambah script `content:verify` |
| `src/content/dasar-pemrograman/topic.json` | T1/T4-T6/T9 | Metadata topik: 5 unit, 17 skill, urutan, prasyarat |
| `src/content/dasar-pemrograman/skills/variabel.json` | T2 (selesai) | Contoh skill: materi + 9 soal |
| `src/content/dasar-pemrograman/skills/output.json` | T4 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/tipe-data.json` | T4 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/input-konversi.json` | T4 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/operator-aritmatika.json` | T5 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/perbandingan-logika.json` | T5 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/percabangan.json` | T5 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/for-range.json` | T6 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/while.json` | T6 | Materi + bank soal |
| `src/content/dasar-pemrograman/skills/akumulator.json` | T6 | Materi + bank soal |
| `docs/content-style-guide.md` | T3 | Panduan gaya materi + soal, dibekukan setelah kritik user atas `variabel.json` |
| `src/lib/algorithms/learningPath.ts` | T7 | Urutan: prasyarat dulu, baru penguasaan terendah |
| `src/lib/algorithms/diagnostic.ts` | T8 | Mode bertahap per unit, mode "Mulai dari awal" |
| `src/content/dasar-pemrograman/skills/list-dasar.json` dkk. (Unit 4-5, 8 skill) | T9 | Setelah demo |
| `supabase/migrations/*` | T10 | Seed, menunggu skema tim |

---

## Task 1 — Format konten + validator + verifier (sedang dikerjakan)

- [ ] Tulis `src/content/types.ts`: `Topic` (id, nama, units), `Unit` (id, nama, order, skills), `Skill` (skill_key, nama, prerequisite skill_key[], order), `SkillContent` (goal, 3 paragraf materi, contoh kode, 2 jebakan, catatan, satu "tebak dulu"), `Question` (tipe tebak-output/tebak-error/pilih-kode, kode, pilihan, pilihan benar, feedback per pilihan salah, penjelasan).
- [ ] Tulis `validateContent.ts`: cek skema sesuai tipe, `skill_key` format `<topik>.<skill>` dan unik global, prasyarat merujuk skill_key yang ada dan ada di unit yang sama atau lebih awal, bank soal 8-9 per skill.
- [ ] Tulis `validateContent.test.ts` dengan kasus valid dan beberapa kasus gagal (duplikat skill_key, prasyarat ke skill yang belum ada, bank soal kurang dari 8).
- [ ] Tulis `scripts/verify-content.mjs`: baca semua `skills/*.json` di bawah `src/content/<topik>/`, ekstrak blok kode materi dan soal, jalankan tiap blok lewat `python` (subprocess), tangkap stdout/exit code, bandingkan dengan output yang diharapkan di JSON (field terpisah, bukan parsing komentar), laporkan file+index yang gagal dan keluar dengan kode bukan nol bila ada kegagalan.
- [ ] Tambah script `"content:verify": "node scripts/verify-content.mjs"` di `package.json`.
- [ ] Jalankan `npm run test -- validateContent` dan `npm run content:verify` (seharusnya lulus walau konten baru kosong/minimal).

## Task 2 — Skill contoh variabel (selesai, menunggu kritik)

- [x] `src/content/dasar-pemrograman/skills/variabel.json` sudah ditulis model utama (materi + 9 soal).
- [ ] Setelah user memberi kritik: catat perubahan yang diminta di Self-Review plan ini sebelum lanjut ke T3.

## Task 3 — Bekukan panduan gaya

- [ ] Setelah kritik user atas `variabel.json` diterima dan diterapkan, tulis `docs/content-style-guide.md`: struktur materi (goal, 3 paragraf, contoh, 2 jebakan, catatan, 1 "tebak dulu"), struktur soal (tipe, pilihan salah = miskonsepsi + feedback, penjelasan menjawab "kenapa"), aturan kode materi vs soal tidak boleh sama, jumlah soal per skill (8-9).
- [ ] Minta review singkat user atas panduan sebelum dipakai menulis skill lain.

## Task 4 — Unit 1 sisa: output, tipe-data, input-konversi

- [ ] Model utama menulis materi + 8-9 soal untuk `output.json`, `tipe-data.json`, `input-konversi.json` mengikuti `docs/content-style-guide.md`.
- [ ] Subagent boleh membuat draf awal per skill dari panduan gaya; model utama menyunting tiap soal.
- [ ] Jalankan `npm run test -- validateContent` dan `npm run content:verify` untuk ketiga file; perbaiki kode yang gagal dijalankan.
- [ ] Perbarui `topic.json`: daftarkan Unit 1 (4 skill: output, variabel, tipe-data, input-konversi) dengan prasyarat berurutan.

## Task 5 — Unit 2: operator-aritmatika, perbandingan-logika, percabangan

- [ ] Sama seperti Task 4 untuk 3 skill Unit 2.
- [ ] Prasyarat: `percabangan` mensyaratkan `perbandingan-logika`; `perbandingan-logika` dan `operator-aritmatika` mensyaratkan skill Unit 1 yang relevan (`tipe-data`, `variabel`).
- [ ] Jalankan `npm run test` dan `npm run content:verify`.

## Task 6 — Unit 3: for-range, while, akumulator

- [ ] Sama seperti Task 4 untuk 3 skill Unit 3.
- [ ] Prasyarat: `akumulator` mensyaratkan `for-range` dan `operator-aritmatika`; `while` mensyaratkan `percabangan`.
- [ ] Jalankan `npm run test` dan `npm run content:verify`.
- [ ] Setelah Task 4-6 selesai: Unit 1-3 (10 skill) cukup untuk demo.

## Task 7 — `learningPath.ts` berbasis prasyarat

- [ ] Ubah aturan urutan: skill dengan prasyarat belum dikuasai tidak boleh direkomendasikan lebih dulu dari prasyaratnya, walau mastery-nya lebih rendah. Di antara skill yang prasyaratnya terpenuhi, urutkan dari penguasaan terendah (aturan lama).
- [ ] Tulis/ubah tes di `learningPath.test.ts`: kasus skill bermastery rendah tapi prasyarat belum terpenuhi tidak muncul lebih dulu dari prasyaratnya.
- [ ] Jalankan `npm run test -- learningPath`.

## Task 8 — Diagnostic bertahap per unit + mode "Mulai dari awal"

- [ ] Tambah mode baru di `diagnostic.ts`: "Mulai dari awal" (tidak menjalankan tes, langsung set semua skill ke status belum dikuasai, mulai dari skill pertama Unit 1).
- [ ] Ubah mode tes ("Cek kemampuanku dulu") agar berjalan per unit berurutan dari Unit 1: tes skill-skill dalam satu unit, bila unit itu dianggap lemah (mayoritas skill di bawah ambang keyakinan) maka unit-unit sesudahnya otomatis dianggap belum dikuasai tanpa diuji; maks 20 soal total tetap berlaku.
- [ ] Tulis tes skenario: unit awal kuat lalu lemah di unit tengah (unit setelah unit lemah tidak diuji), semua unit kuat (tes sampai akhir atau sampai 20 soal), mode "Mulai dari awal" tidak memanggil `nextQuestion` sama sekali.
- [ ] Jalankan `npm run test -- diagnostic`.

## Task 9 — Unit 4-5 (setelah demo)

- [ ] Tulis materi + bank soal untuk Unit 4 (list-dasar, menelusuri-list, string-urutan) dan Unit 5 (def-return, parameter, return-vs-print, variabel-lokal), 8 skill total, mengikuti `docs/content-style-guide.md`.
- [ ] Perbarui `topic.json` dengan Unit 4-5 dan prasyaratnya (`list-dasar` mensyaratkan `for-range`; `def-return` mensyaratkan `percabangan` dan `akumulator`).
- [ ] Jalankan `npm run test` dan `npm run content:verify` untuk seluruh 17 skill.

## Task 10 — Seed Supabase (menunggu skema tim)

- [ ] Setelah tim menyediakan tabel skill-per-topik dan relasi soal ke topik/skill (lihat catatan terbuka di `.kiro/steering/supabase-db-model.md`), tulis skrip konversi JSON `src/content/` → migrasi seed SQL.
- [ ] Verifikasi jumlah baris yang di-insert cocok dengan jumlah skill (17) dan soal (17 × 8-9) di JSON sumber.

---

## Self-Review

- `npm run test` hijau untuk semua tes baru (`validateContent.test.ts`, `learningPath.test.ts`, `diagnostic.test.ts`) dan tes lama yang tersentuh.
- `npm run content:verify` hijau untuk setiap skill yang ditulis (semua blok kode materi dan soal benar-benar dijalankan Python, bukan ditebak).
- Tiap skill yang selesai sudah melewati Review Focus di atas (soal menguji kemampuan bukan definisi, pilihan salah = miskonsepsi + feedback, kode materi != kode soal, prasyarat konsisten, skill_key unik dan berformat benar).
- Tidak ada file di luar "File Structure" yang berubah per task; tidak ada tabel Supabase baru dibuat sebelum T10.
- Catat di laporan akhir tiap task: skill mana yang masih menunggu kritik/review user sebelum dianggap final.

## Execution Handoff

Subagent-driven dengan batas tegas: penulisan/penyuntingan konten (materi, soal, panduan gaya) **wajib model utama**; subagent (model termurah yang tersedia) hanya mengerjakan bagian mekanis — T1 (validator, verifier, tipe), draf awal mentah untuk T4/T5/T6/T9 (ditinjau ulang oleh model utama sebelum dianggap selesai), T7-T8 (logika mesin, bukan konten), dan menjalankan `npm run test`/`npm run content:verify` untuk melaporkan hasil. T2 sudah selesai, menunggu kritik user — jangan lanjut ke T3 sebelum kritik itu diterima dan diterapkan. T4-T6 berurutan (tiap task menambah ke `topic.json` yang sama); T9-T10 ditunda sampai pemicu masing-masing (setelah demo; setelah skema tim pasti).
