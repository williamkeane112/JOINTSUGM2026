# [PROJECT_NAME] — User Flows & Navigation

> **⚠️ NOTE**: Nama project masih belum final. Ganti `[PROJECT_NAME]` saat nama sudah dipilih.

> State transitions, navigation logic, dan conditional flows per tipe user.

---

## 1. Authentication Flow

```
[App Start]
    │
    ├─ Has valid session? ──YES──→ [Dashboard]
    │
    └─ NO
         │
         ├─ [Landing Page]
         │       │
         │       ├─ "Mulai Gratis" ──→ [Register Page]
         │       └─ "Masuk" ──────→ [Login Page]
         │
         ├─ [Register Page]
         │       │
         │       ├─ Submit OK ──→ [Onboarding Step 1]
         │       └─ Has Account ──→ [Login Page]
         │
         └─ [Login Page]
                 │
                 ├─ Login OK + new user ──→ [Onboarding Step 1]
                 ├─ Login OK + existing user + no diagnostic ──→ [Onboarding → Diagnostic]
                 └─ Login OK + existing user + has diagnostic ──→ [Dashboard]
```

---

## 2. Onboarding Flow (New User Only)

```
[Onboarding Step 1 — Sambutan]
    Input: Nama panggilan
    CTA: "Halo Spark!"
    │
    ▼
[Onboarding Step 2 — Setup]
    Pilih kelas (SMP 7/8/9)
    Pilih: "Mulai tes diagnostik" | "Lihat peta dulu"
    │
    ├─ Pilih "Lihat peta dulu" ──→ [Knowledge Map] (kosong, semua 0%)
    │
    └─ Pilih "Mulai tes diagnostik"
             │
             ▼
    [Onboarding Step 3 — Ready]
        CTA: "Mulai Tes Diagnostik"
             │
             ▼
    [Diagnostic Test Page]
```

---

## 3. Diagnostic Test Flow

```
[Diagnostic Test Start]
    - 15 soal pilihan ganda
    - Soal per topik: 3 soal × 5 topik
    │
    ▼
[Per Soal Loop]
    Tampil soal → Pilih jawaban → Klik "Jawab"
    → Feedback singkat (500ms: ✓ atau ✗)
    → Auto-lanjut ke soal berikutnya
    │
    ├─ Soal 1-14: lanjut loop
    │
    └─ Soal 15 (terakhir):
             │
             ▼
    [Test Complete Screen]
        - Animasi Spark celebrating
        - Summary: "Benar X dari 15"
        - XP gained: +50 XP
        - CTA: "Lihat Peta Kemampuanmu →"
             │
             ▼
    [Knowledge Map] (dengan hasil diagnostic)
             │
             ▼
    [Dashboard] (setelah dismiss map / klik dashboard)

INTERUPSI:
    - Klik "Keluar" → Modal konfirmasi
        ├─ "Ya, Keluar" → Dashboard (progress diagnostic HILANG)
        └─ "Lanjutkan" → Kembali ke soal
```

---

## 4. Dashboard Navigation

```
[Dashboard]
    │
    ├─ Klik "Mulai Sekarang" (recommendation card)
    │       └──→ [Topic Detail — recommended topic]
    │
    ├─ Klik topic card di Knowledge Map preview
    │       └──→ [Topic Detail — clicked topic]
    │
    ├─ Klik "Lihat semua →" di Knowledge Map section
    │       └──→ [Knowledge Map Page]
    │
    ├─ Klik achievement badge
    │       └──→ [Profile & Achievements Page]
    │
    └─ Sidebar Navigation
            ├─ Dashboard → [Dashboard] (current)
            ├─ Peta Kemampuan → [Knowledge Map]
            ├─ Belajar → [Learning Path / Last topic]
            └─ AI Tutor → [AI Tutor Page]
```

---

## 5. Knowledge Map Flow

```
[Knowledge Map]
    │
    ├─ Filter tab: "Semua | Belum | In Progress | Dikuasai"
    │       └──→ Filter topic cards in place (no navigation)
    │
    ├─ Klik topic card (UNLOCKED)
    │       └──→ [Topic Detail Page]
    │
    ├─ Klik topic card (LOCKED)
    │       └──→ Modal: "Selesaikan [Prerequisite] dulu (saat ini X%)"
    │               ├─ "Ke [Prerequisite]" → [Topic Detail — prerequisite]
    │               └─ "Tutup" → kembali ke map
    │
    └─ Klik floating "Tanya Spark" button
            └──→ [AI Tutor] (dengan context: "Knowledge Map")
```

---

## 6. Topic Detail & Learning Flow

```
[Topic Detail Page]
    ├─ Tab: Materi
    │       │
    │       ├─ Baca section 1 → "Tandai Selesai" → section 2 unlock
    │       ├─ Baca semua section → +20 XP → Tab Latihan di-highlight
    │       └─ "Mulai Latihan" CTA → [Exercise Mode]
    │
    ├─ Tab: Latihan
    │       └──→ [Exercise Mode] (langsung)
    │
    ├─ Tab: Riwayat
    │       └──→ Show history (no navigation)
    │
    └─ Floating Spark button (kanan bawah)
            └──→ [AI Tutor Slide-over] (overlay, bukan navigate)
```

---

## 7. Exercise / Quiz Flow

```
[Exercise Mode Start]
    - Load 10 adaptive soal berdasarkan mastery level
    - Focused mode: sidebar hidden
    │
    ▼
[Per Soal Loop]
    │
    ├─ Tampil soal
    │
    ├─ User pilih jawaban
    │
    ├─ Klik "Jawab"
    │       │
    │       ├─ BENAR:
    │       │   - Green flash overlay
    │       │   - Spark excited animation
    │       │   - "+15 XP" float up
    │       │   - BKT update (mastery naik)
    │       │   - Show explanation
    │       │   - CTA: "Soal Berikutnya →"
    │       │
    │       └─ SALAH:
    │           - Subtle red flash
    │           - Spark encouraging
    │           - Show correct answer
    │           - Show explanation
    │           - "+2 XP" (tetap reward)
    │           - CTA: "Mengerti, Lanjut"
    │
    ├─ Soal 1-9: lanjut loop
    │
    └─ Soal 10 (terakhir):
             │
             ▼
    [Session End Screen]
        - Spark celebrating (besar)
        - Stats: Benar X/10, XP gained total, Mastery change
        - Check: topic mastered?
        │
        ├─ MASTERED (mastery > 70%):
        │   - Confetti burst
        │   - "🎊 Topik Dikuasai!" badge animation
        │   - Achievement unlock jika ada
        │   - CTA: "Lihat Topik Berikutnya" | "Kembali ke Dashboard"
        │
        └─ NOT YET:
            - "Terus semangat! Mastery: 52% (+7.3%)"
            - CTA: "Lanjut Latihan" | "Kembali ke Dashboard"

INTERUPSI:
    - Klik "← Keluar" → Modal konfirmasi
        ├─ "Ya, Keluar" → [Topic Detail] (progress session TERSIMPAN, mastery ter-update)
        └─ "Lanjutkan" → kembali ke soal
```

---

## 8. AI Tutor Flow

```
[AI Tutor Page]
    │
    ├─ Datang dari Exercise (dengan context soal):
    │   - Left panel auto-populated dengan topic + last question
    │   - Suggested chips: "Kenapa jawabanku salah?" aktif
    │
    ├─ Datang dari Topic Detail (dengan context materi):
    │   - Left panel: topic + current material section
    │   - Suggested chips: "Jelaskan konsep ini"
    │
    └─ Datang dari Dashboard/Nav (tanpa context spesifik):
        - Left panel: show overall progress
        - Suggested chips: generic questions
    │
    ▼
[Chat Interaction Loop]
    User type/klik chip → Send → Spark "thinking" (dots) → Spark responds
    │
    ├─ User klik suggestion chip → pre-filled message → kirim
    ├─ User type bebas → kirim
    └─ Spark response mungkin include:
        - "Mau latihan soal tentang ini?" → CTA chip
        - "Lihat materi ini →" → link ke Topic Detail

DARI AI TUTOR:
    ├─ Klik "Ke materi →" → [Topic Detail — specific section]
    └─ Klik "Latihan sekarang →" → [Exercise Mode — same topic]
```

---

## 9. Profile & Achievements Flow

```
[Profile Page]
    │
    ├─ Klik achievement badge (unlocked)
    │       └──→ Modal: Detail achievement + tanggal unlock + share button
    │
    ├─ Klik achievement badge (locked)
    │       └──→ Modal: "Cara unlock: [requirement]" + CTA ke relevan page
    │
    └─ Edit profile → [Edit Profile Modal/Page]
```

---

## 10. Gamification Event Flows

### Level Up Event
```
[Any Page — XP threshold reached]
    │
    ▼
[Level Up Overlay] (full screen, z-50)
    - Spark celebrating (large animated)
    - "Level UP! 🎉 Kamu sekarang Level [X]!"
    - Level name: "Rising Star"
    - Spark evolution jika milestone level
    - XP needed for next level
    - CTA: "Lanjut Belajar" → dismiss overlay
```

### Achievement Unlock Event
```
[Any Page — achievement condition met]
    │
    ▼
[Toast Notification] (bottom right, 4s)
    - Achievement icon + "Achievement Unlocked!"
    - Achievement name + XP reward
    - Klik toast → [Profile — Achievement section]
```

### Streak Break Warning
```
[App Open — streak at risk (>20h since last session)]
    │
    ▼
[Streak Warning Banner] (top of Dashboard)
    - "🔥 Streak kamu akan berputus! Belajar hari ini untuk mempertahankan 5 hari!"
    - CTA: "Belajar Sekarang" → [Recommended Topic]
    - Dismiss: X button
```

---

## 11. Error & Edge Case States

### No Internet
```
Toast: "Tidak ada koneksi. Beberapa fitur mungkin tidak tersedia."
AI Tutor → disable (needs API)
Exercises → disable submit button
Local mastery display → tetap tampil (cached)
```

### First Time (No Diagnostic)
```
[Dashboard] state = empty
    - Knowledge Map: semua topik 0%, tidak ada rekomendasi BKT
    - Banner: "Mulai tes diagnostik untuk rekomendasi personal! →"
    - Spark: "Aku belum tahu kemampuanmu. Ayo mulai tes! 🎯"
```

### All Topics Mastered
```
[Dashboard] state = completed
    - Circular progress: 100% green, animasi sparkle
    - Spark: "Luar biasa! Kamu telah menguasai semua topik! 🏆"
    - Recommendation card → "Review mode" atau "Advanced challenges"
    - Special achievement: "Matematika Juara" unlock
```

### Session Timeout (Supabase auth expires)
```
[Any Page]
    → Soft redirect ke Login
    → Toast: "Sesimu telah berakhir. Silakan masuk kembali."
    → Setelah login → kembali ke halaman sebelumnya (via state)
```

---

## 12. Page Transition Rules

| From → To | Transition |
|-----------|------------|
| Any → Dashboard | Fade in |
| Dashboard → Topic Detail | Slide left |
| Topic Detail → Exercise | Fade + scale up (focused mode) |
| Exercise → Session End | Crossfade + confetti |
| Session End → Dashboard | Slide right (back) |
| Any → AI Tutor | Slide up (mobile) / crossfade (desktop) |
| Any → Modal | Fade + scale from center |
| Modal → dismiss | Reverse |

---

*Last updated: 2026-10-12*
