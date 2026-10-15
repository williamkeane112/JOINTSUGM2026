# Diagnostic Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mesin sesi diagnostic adaptif per topik: memilih soal berikutnya, menghentikan skill yang sudah pasti, dan menghasilkan penguasaan per skill + jalur belajar.

**Architecture:** Logika murni immutable di `src/lib/algorithms/diagnostic.ts`, memakai `BKTModel` per skill (satu model/skill, prior dari `rules.prior`). Aturan penyusunan jalur belajar (skip yang sudah mastered, urutkan sisanya dari mastery terendah) dipindah ke `src/lib/algorithms/learningPath.ts` yang generik, lalu dipakai ulang oleh `src/page/landing/demoScript.ts` (`buildDemoPath`) supaya tidak ada dua implementasi aturan yang sama.

**Tech Stack:** TypeScript strict, Vitest. Tidak ada dependensi baru, tidak ada React, tidak ada Supabase.

**Spec:** keputusan di `.kiro/steering/01-mvp-scope.md` §1 ("Diagnostic Test") dan `.kiro/steering/session-progress.md` bagian "Diagnostic adaptif: keputusan (2026-10-15)" — jumlah soal fleksibel per skill (BKT), min 2/maks 4 soal per skill, berhenti bila P(L) >= 85% atau <= 20%, maks 20 soal per topik, prior 50%.

---

## Global Constraints

- TypeScript strict, fungsi murni (tidak ada side effect, tidak mutate input/state).
- Tidak ada React, tidak ada Supabase, tidak ada dependensi npm baru.
- Hanya file yang didaftarkan di bawah yang boleh disentuh.
- Gunakan tool tulis file (bukan `Set-Content`/PowerShell) untuk semua perubahan.
- Jangan commit.

## Review Focus

1. `isSkillDone`/`nextQuestion` mengikuti urutan prioritas yang persis sesuai spec (asked >= max, lalu bank habis, lalu stop karena yakin) — bukan urutan lain yang kebetulan menghasilkan hasil sama di sebagian kasus.
2. `answerQuestion` tidak pernah memodifikasi `state` lama (progress map dan array di-copy, bukan di-push langsung).
3. Angka BKT (94/13/42 dkk di task 2) dihitung ulang manual dari rumus `bkt.ts`, bukan ditebak — kalau beda, laporkan, jangan diam-diam mengubah aturan.
4. `buildLearningPath` generik benar-benar dipakai ulang oleh `demoScript.ts` (tidak ada duplikasi logika skip/urutkan).
5. Tidak ada import React/Supabase yang menyelinap, dan file di luar daftar tidak tersentuh.

## File Structure

| File | Status | Isi |
| --- | --- | --- |
| `src/lib/algorithms/learningPath.ts` | baru | `PathCandidate`, `LearningPath<T>`, `buildLearningPath` generik |
| `src/lib/algorithms/learningPath.test.ts` | baru | Tes untuk kasus campuran, seri (tie), semua mastered, kosong, tidak mutasi input |
| `src/lib/algorithms/diagnostic.ts` | baru | Mesin sesi diagnostic adaptif (lihat API di bawah) |
| `src/lib/algorithms/diagnostic.test.ts` | baru | 11 kelompok tes sesuai skenario di bawah |
| `src/page/landing/demoScript.ts` | ubah | `buildDemoPath` memanggil `buildLearningPath` dari `learningPath.ts` |
| `.kiro/steering/session-progress.md` | ubah | tambah 1 bullet di akhir file |

---

## Task 1 — `learningPath.ts`

- [ ] Tulis `learningPath.test.ts`: kasus campuran (sebagian mastered di tengah urutan input, bukan hanya di awal/akhir), seri mastery sama (urutan input dipertahankan), semua mastered (`steps` kosong), input kosong, dan input tidak termutasi (snapshot sebelum/sesudah).
- [ ] Jalankan `npm run test -- learningPath` dan pastikan gagal (fungsi belum ada).
- [ ] Implementasikan `buildLearningPath<T extends PathCandidate>(items)`: `skipped` = item berstatus `"mastered"` dalam urutan input; `steps` = sisanya, diurutkan `masteryPct` naik dengan tie-break urutan input (stable, pakai index helper, jangan andalkan stabilitas `Array.sort` bawaan).
- [ ] Jalankan ulang tes sampai lulus.

## Task 2 — `diagnostic.ts`

API, interface, dan aturan persis seperti yang diberikan di instruksi tugas (lihat riwayat percakapan / commit pesan tugas ini): `DiagnosticSkill`, `BankQuestion`, `DiagnosticRules`, `DEFAULT_DIAGNOSTIC_RULES`, `DiagnosticAnswer`, `SkillProgress`, `DiagnosticState`, `SkillResult`, `DiagnosticResults`, serta `startDiagnostic`, `isSkillDone`, `isDiagnosticDone`, `nextQuestion`, `answerQuestion`, `getResults`. Beri JSDoc ringkas di tiap export, termasuk catatan bahwa ambang berhenti (0.85/0.20 = keyakinan) berbeda dari ambang status UI (40/70 di `mastery.ts`).

- [ ] Tulis `diagnostic.test.ts` dengan helper `run(state, decide)` dan 11 kelompok skenario: interleaving, semua benar (94%), semua salah (13%), ragu-ragu (42%, belum selesai), batas maks per skill (asked 4, tidak yakin), batas maks total (20 soal, skill 1-2 asked 4, skill 3-6 asked 3), bank habis (1 soal dan 0 soal), `answerQuestion` melempar error (id salah / sudah selesai) + state lama tidak termutasi, `startDiagnostic` melempar error (skills kosong, key dobel, id dobel, skillKey tak dikenal), `getResults` path (skipped/steps), aturan custom lewat `Partial`.
- [ ] Jalankan `npm run test -- diagnostic` dan pastikan gagal (modul belum ada).
- [ ] Implementasikan `diagnostic.ts` sesuai aturan persis dari instruksi (urutan pengecekan di `isSkillDone`, pemilihan skill fewest-asked dengan tie curriculum order di `nextQuestion`, copy immutable di `answerQuestion`).
- [ ] Hitung manual angka BKT yang disebut di tes (94/13/42) dari rumus `bkt.ts` sebelum menulis assertion; jika beda, laporkan di Self-Review, jangan ubah aturan diam-diam.
- [ ] Jalankan ulang tes sampai semua lulus.
- [ ] Ubah `demoScript.ts`: impor `buildLearningPath` dari `learningPath.ts`; `buildDemoPath` memanggil fungsi itu langsung (hapus implementasi lama yang duplikat). Jalankan `npm run test -- demoScript` — harus tetap lulus tanpa ubah tes lama.

## Task 3 — Catatan sesi

- [ ] Tambahkan satu bullet di **akhir** `.kiro/steering/session-progress.md` yang merangkum mesin diagnostic yang dibuat, mengacu ke plan ini, dan menyebut bahwa UI/bank soal belum ada.

---

## Self-Review

- Semua tes baru (`learningPath.test.ts`, `diagnostic.test.ts`) dan tes lama (`demoScript.test.ts`, `bkt.test.ts`) hijau lewat `npm run test`.
- `npx tsc -b` bersih (strict mode, tidak ada `any` implisit).
- `npx eslint src/lib/algorithms src/page/landing/demoScript.ts` bersih.
- Tidak ada file di luar daftar "File Structure" yang berubah.
- Tidak ada import React/Supabase/dependensi baru di file yang ditambahkan.
- Catat di laporan akhir angka BKT mana (jika ada) yang berbeda dari ekspektasi awal instruksi dan bagaimana itu diselesaikan (dihitung ulang, bukan aturan diubah diam-diam).

## Execution Handoff

Subagent-driven; model utama meninjau. Task 1 dan Task 2 bisa dikerjakan berurutan oleh satu pekerja (Task 2 bergantung pada `learningPath.ts` dari Task 1); Task 3 independen dan bisa menyusul kapan saja setelah Task 1-2 selesai dan diverifikasi.
