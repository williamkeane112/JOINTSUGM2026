# [PROJECT_NAME] — Design System & Prototype Guide

> **Purpose**: Visual reference dokumen ini digunakan untuk Google Stitch prompts, coding reference, dan panduan desain konsisten selama development.
> **Audience**: Developer + Juri (teknis & non-teknis)
> **Device**: Responsive — Desktop-first, Mobile-ready
> **Mode**: Light mode (dark mode Phase 2)

> **⚠️ NOTE**: Nama project masih belum final. Ganti `[PROJECT_NAME]` di seluruh dokumen saat nama sudah dipilih.

---

## 1. Brand Identity & Personality

### Nama & Tagline

- **Nama**: `[PROJECT_NAME]` *(placeholder — nama belum final, bisa: SkillPath AI, LearnFlow, AdaptEdu, dll)*
- **Tagline**: _"Belajar lebih cerdas, bukan lebih keras."_
- **Sub-tagline**: _"Jalurmu. Kecepatanmu. Pemahamanmu."_
- **Alternative taglines** (pilih nanti):
  - _"Belajar yang menyesuaikan denganmu"_
  - _"Setiap siswa, jalur berbeda"_
  - _"Matematika jadi mudah, dengan AI yang paham kamu"_

### Brand Personality

Platform ini bukan sekadar aplikasi belajar yang kaku dan membosankan. Ia terasa seperti:

- **Teman pintar yang sabar** — selalu siap membantu tanpa menghakimi
- **Coach yang adaptif** — tahu kapan harus push, kapan harus slow down
- **Petualangan belajar** — setiap sesi terasa seperti progress, bukan beban

### Tone of Voice

- Encouraging, bukan menggurui
- Casual tapi tetap informatif
- Merayakan keberhasilan kecil ("Bagus! +15 XP 🎉")
- Empati saat siswa salah ("Hampir benar! Mari kita coba lagi 💪")

---

## 2. Maskot & Character System

### Karakter Utama: **Spark** 🌟

Spark adalah AI companion siswa — sosok kecil berbentuk bintang bercahaya dengan ekspresi wajah yang berubah sesuai konteks.

#### Referensi Visual Character

- Bentuk: Bintang 5 sudut yang membulat (rounded star), ukuran ~40x40px di UI
- Warna default: Kuning emas `#F59E0B` dengan glow biru `#3B82F6`
- Mata: Dua lingkaran hitam kecil yang expressif
- Mulut: Kurva sederhana yang berubah (senyum, kaget, semangat)

#### Spark States (Ekspresi per Konteks)

| State         | Ekspresi                      | Kapan Muncul               |
| ------------- | ----------------------------- | -------------------------- |
| `idle`        | Senyum santai, berkedip pelan | Dashboard, waiting         |
| `excited`     | Mata besar, tangan ke atas    | Jawaban benar, streak naik |
| `thinking`    | Dagu ditopang, mata melirik   | AI Tutor sedang generate   |
| `encouraging` | Satu tangan acung jempol      | Jawaban salah, motivasi    |
| `celebrating` | Berputar, bintang beterbangan | Level up, topic mastered   |
| `reading`     | Pegang buku kecil             | Saat membaca materi        |

#### Spark XP Level

Spark juga "leveling up" bersama siswa — tampilannya berevolusi:

- Level 1-5: Spark kecil, berwarna plain
- Level 6-15: Spark punya aura glow kecil
- Level 16-30: Spark punya mahkota kecil
- Level 31+: Spark punya sayap cahaya

---

## 3. Color Palette

### Primary Colors

```
--color-primary-50:  #EFF6FF   /* Background ringan */
--color-primary-100: #DBEAFE   /* Hover states */
--color-primary-400: #60A5FA   /* Lighter actions */
--color-primary-500: #3B82F6   /* Primary action (buttons, links) */
--color-primary-600: #2563EB   /* Hover primary */
--color-primary-700: #1D4ED8   /* Active/pressed */
```

### Semantic Colors

```
/* Mastery Status */
--color-mastered:    #22C55E   /* Green-500 — Mastered (>70%) */
--color-progress:    #F59E0B   /* Amber-500 — In Progress (40-70%) */
--color-weak:        #EF4444   /* Red-500 — Not Mastered (<40%) */
--color-locked:      #9CA3AF   /* Gray-400 — Locked topic */

/* Gamification */
--color-xp:          #8B5CF6   /* Purple-500 — XP points */
--color-streak:      #F97316   /* Orange-500 — Streak fire */
--color-gold:        #F59E0B   /* Amber-500 — Achievement gold */
--color-silver:      #6B7280   /* Gray-500 — Achievement silver */
```

### Neutral Colors

```
--color-bg:          #FAFAFA   /* Page background */
--color-surface:     #FFFFFF   /* Cards, panels */
--color-border:      #E5E7EB   /* Borders */
--color-text-primary: #111827  /* Headings */
--color-text-secondary: #6B7280 /* Body text */
--color-text-muted:  #9CA3AF   /* Placeholder, caption */
```

### Gradient System

```
/* Hero / Onboarding */
--gradient-hero: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #FFF7ED 100%)

/* Card accent (topic mastered) */
--gradient-mastered: linear-gradient(135deg, #22C55E20, #16A34A10)

/* XP Bar */
--gradient-xp: linear-gradient(90deg, #8B5CF6, #3B82F6)

/* Spark glow */
--gradient-spark: radial-gradient(circle, #FEF08A, #F59E0B)
```

---

## 4. Typography

### Font Stack

```css
/* Heading: Playful tapi tetap readable */
font-family-heading: "Plus Jakarta Sans", "Inter", sans-serif;

/* Body: Clean dan readable */
font-family-body: "Inter", system-ui, sans-serif;

/* Monospace: Untuk angka/kode */
font-family-mono: "JetBrains Mono", "Fira Code", monospace;
```

### Type Scale

```
--text-xs:   12px / line-height: 1.5  /* Captions, badges */
--text-sm:   14px / line-height: 1.5  /* Body small, labels */
--text-base: 16px / line-height: 1.6  /* Body text */
--text-lg:   18px / line-height: 1.5  /* Lead text */
--text-xl:   20px / line-height: 1.4  /* Card titles */
--text-2xl:  24px / line-height: 1.3  /* Section headings */
--text-3xl:  30px / line-height: 1.2  /* Page headings */
--text-4xl:  36px / line-height: 1.1  /* Hero headings */
--text-5xl:  48px / line-height: 1.0  /* Landing hero */
```

### Font Weights

```
--font-normal:    400  /* Body */
--font-medium:    500  /* Labels, nav */
--font-semibold:  600  /* Card titles, buttons */
--font-bold:      700  /* Headings */
--font-extrabold: 800  /* Hero text, XP counter */
```

---

## 5. Spacing & Layout

### Spacing Scale (8px base grid)

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### Border Radius

```
--radius-sm:   6px    /* Input fields */
--radius-md:   10px   /* Buttons, small cards */
--radius-lg:   16px   /* Cards */
--radius-xl:   24px   /* Modal, big panels */
--radius-2xl:  32px   /* Hero sections */
--radius-full: 9999px /* Pills, badges, avatars */
```

### Shadows

```
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08)
--shadow-md:  0 4px 12px rgba(0,0,0,0.10)
--shadow-lg:  0 8px 24px rgba(0,0,0,0.12)
--shadow-xl:  0 16px 48px rgba(0,0,0,0.14)

/* Colored shadows untuk gamification */
--shadow-xp:     0 4px 16px rgba(139,92,246,0.30)
--shadow-mastered: 0 4px 16px rgba(34,197,94,0.25)
--shadow-primary:  0 4px 16px rgba(59,130,246,0.30)
```

### Layout Grid

```
/* Desktop */
max-width: 1280px
columns: 12
gutter: 24px
margin: 40px

/* Tablet (768px - 1024px) */
columns: 8
gutter: 20px
margin: 24px

/* Mobile (<768px) */
columns: 4
gutter: 16px
margin: 16px
```

---

## 6. Component Library

### 6.1 Buttons

#### Variants

```
PRIMARY   → bg-primary-500, white text, shadow-primary on hover
SECONDARY → bg-white, border-primary-500, primary-500 text
SUCCESS   → bg-mastered, white text
DANGER    → bg-red-500, white text
GHOST     → transparent, primary text, hover bg-primary-50
XP        → bg-gradient-xp, white text, shadow-xp (untuk reward actions)
```

#### Sizes

```
SM  → px-3 py-1.5 text-sm rounded-md
MD  → px-4 py-2   text-base rounded-md  (default)
LG  → px-6 py-3   text-lg rounded-lg
XL  → px-8 py-4   text-xl rounded-xl   (CTA hero)
```

#### States

- `default` → base style
- `hover` → lift effect (translateY -1px) + stronger shadow
- `active` → press down (translateY 0)
- `loading` → spinner icon kiri + disabled
- `disabled` → opacity 50%, no cursor

### 6.2 Cards

#### Base Card

```
bg-white
rounded-2xl (16px)
border border-gray-100
shadow-md
p-6
transition: shadow 200ms, transform 200ms
hover: shadow-lg, translateY(-2px)
```

#### Topic Card (Knowledge Map)

```
Base card +
Left border: 4px solid [status-color]
Header: topic icon (emoji/svg) + name + difficulty badge
Body: Progress bar + percentage + last practiced
Footer: "Lanjutkan" button atau "Terkunci" state
```

#### Achievement Badge Card

```
Centered layout
Circle icon top (64px, gradient bg)
Title bold
Description muted
Unlocked: full color | Locked: grayscale + overlay
```

#### Stat Card (Dashboard)

```
Icon kiri (32px, colored bg circle)
Label atas (text-sm muted)
Value besar (text-2xl bold, colored)
Trend indicator bawah (↑ +5% this week)
```

### 6.3 Progress Components

#### XP Progress Bar

```
Container: bg-primary-100, rounded-full, h-3
Fill: bg-gradient-xp, rounded-full, transition width 600ms ease
Label kiri: "Level X"
Label kanan: "Y / Z XP"
Animasi: pulse saat XP ditambah
```

#### Topic Mastery Bar

```
Container: bg-gray-100, rounded-full, h-2
Fill: warna sesuai status (green/amber/red)
Percentage label di kanan
```

#### Circular Progress (Dashboard hero)

```
SVG circle, stroke-dasharray animation
Center: percentage besar (text-4xl bold)
Sub: "Overall Mastery"
Warna: stroke sesuai mastery level
```

### 6.4 Badges & Pills

```
MASTERED   → bg-green-100 text-green-700 border-green-200
IN_PROGRESS → bg-amber-100 text-amber-700 border-amber-200
NOT_MASTERED → bg-red-100 text-red-700 border-red-200
LOCKED     → bg-gray-100 text-gray-500 border-gray-200
NEW        → bg-blue-100 text-blue-700 border-blue-200
XP         → bg-purple-100 text-purple-700 border-purple-200

Size: px-3 py-1 text-xs font-semibold rounded-full
```

### 6.5 Input Fields

```
Base:
  border border-gray-300
  rounded-lg (10px)
  px-4 py-3
  text-base
  bg-white
  placeholder: text-gray-400

Focus:
  border-primary-500
  ring-2 ring-primary-200
  outline-none

Error:
  border-red-500
  ring-2 ring-red-100

Icon left/right: absolute, text-gray-400
```

### 6.6 Navigation

#### Sidebar (Desktop)

```
Width: 256px (collapsed: 72px)
bg-white
border-right: 1px solid border-color
shadow-sm

Top: Logo + Spark character (animasi idle)
Nav items: icon + label, rounded-lg, hover bg-primary-50
Active: bg-primary-50 text-primary-600 font-semibold border-l-2 border-primary-500
Bottom: User avatar + name + settings icon
```

#### Bottom Nav (Mobile)

```
Fixed bottom
bg-white
border-top
5 items: Home, Map, Learn, Tutor, Profile
Active: primary color icon + dot indicator
```

#### Top Bar

```
h-16
bg-white
border-bottom
Left: Hamburger (mobile) / Logo (desktop)
Center: Page title
Right: XP counter pill + Streak counter + Notification bell + Avatar
```

### 6.7 Question Card (Diagnostic & Exercise)

```
Container: max-w-2xl, centered
Card: rounded-2xl, p-8, shadow-md

Header:
  - Question number pill (Q 1/15)
  - Topic tag (badge)
  - Timer (jika ada)

Body:
  - Question text (text-xl, line-height relaxed)
  - Visual/equation block (optional)

Options: 4 option buttons
  - Base: border rounded-xl p-4 text-left w-full
  - Hover: border-primary-300 bg-primary-50
  - Selected: border-primary-500 bg-primary-50 font-semibold
  - Correct (after submit): border-green-500 bg-green-50 ✓ icon
  - Wrong (after submit): border-red-500 bg-red-50 ✗ icon

Footer:
  - Progress: "3 dari 15 soal"
  - Button: "Jawab" → active setelah pilih option
```

### 6.8 AI Tutor Chat Bubble

```
User bubble: bg-primary-500 text-white, rounded-2xl rounded-br-sm, max-w-xs, right-aligned
Spark bubble: bg-white border shadow-sm, rounded-2xl rounded-bl-sm, max-w-sm, left-aligned
  + Spark avatar (24px) di pojok kiri bubble

Typing indicator: 3 dots animasi pulse
Timestamp: text-xs text-muted di bawah bubble
```

---

## 7. Page Layouts

### 7.1 Landing / Onboarding Page

**Layout**: Full-page hero, single column, centered
**Sections**:

1. **Hero**: Gradient background (primary → green soft), Spark animasi bounce di tengah, headline besar, 2 CTA buttons (Mulai Gratis / Login)
2. **How It Works**: 3 step cards horizontal — Tes → Peta → Belajar
3. **Social Proof**: "Sudah digunakan 1000+ siswa" + quote card
4. **CTA Bottom**: "Mulai sekarang — gratis"

**Mobile**: Stack vertical, hero full-height

---

### 7.2 Login & Register Page

**Layout**: Split screen (desktop) / Full screen (mobile)

- **Left (desktop)**: Ilustrasi Spark + quotes motivasi berubah
- **Right**: Form card

**Login Form**:

- Email input
- Password input + show/hide toggle
- "Lupa password?" link
- Button: "Masuk" (primary, full-width)
- Divider "atau"
- Google OAuth button
- Link: "Belum punya akun? Daftar"

**Register Form**:

- Nama lengkap
- Email
- Password + konfirmasi
- Button: "Buat Akun" (primary)
- Terms checkbox
- Link: "Sudah punya akun? Masuk"

---

### 7.3 Onboarding Flow (New User)

**Layout**: Fullscreen wizard, step indicator di atas (3 steps)

**Step 1 — Sambutan**:

- Spark animasi masuk dari bawah
- "Hei! Aku Spark, teman belajarmu 👋"
- "Namamu siapa?" → input nama panggilan
- CTA: "Hai Spark!"

**Step 2 — Setup**:

- Kelas/tingkat (SMP 7/8/9)
- Pilihan: "Mulai dari tes diagnostik" atau "Lihat peta dulu"

**Step 3 — Ready**:

- Spark excited animation
- "Semua siap! Yuk mulai petualangan belajarmu"
- CTA: "Mulai Tes Diagnostik" (primary, besar)

---

### 7.4 Diagnostic Test Page

**Layout**: Focused mode — sidebar disembunyikan, max-w-2xl centered

**Header bar**:

- Progress indicator: progress bar + "Soal 5 dari 15"
- Topic tag: "Operasi Dasar"
- Exit button (kanan) dengan konfirmasi modal

**Main**: Question Card (lihat 6.7)

**Transition antar soal**:

- Slide kiri → kanan
- Feedback singkat 500ms (✓ atau ✗ animasi)
- Auto-lanjut setelah feedback

**End Screen**:

- Spark celebrating animation
- "Tes Selesai! 🎉"
- Summary: Benar X dari 15
- XP gained: "+50 XP"
- CTA: "Lihat Peta Kemampuanmu →"

---

### 7.5 Dashboard Page _(UTAMA — fondasi desain)_

**Layout**: Sidebar kiri (256px) + main content area

#### Sidebar

- Logo "SkillPath AI" + Spark icon (idle)
- Nav: Dashboard, Peta Kemampuan, Belajar, AI Tutor
- Bottom: Avatar + nama + level badge

#### Main Content (grid 12 col)

**Row 1 — Greeting Header** (full width)

```
"Selamat pagi, [Nama]! 👋"
Subtitle: "Kamu sudah belajar 3 hari berturut-turut 🔥"
Right: Streak counter + XP counter (animated pills)
```

**Row 2 — Stats Overview** (4 stat cards, 3 col each)

```
Card 1: Overall Mastery — Circular progress 68%
Card 2: XP Total — "1,240 XP" + level bar
Card 3: Streak — "🔥 3 Hari" + calendar mini
Card 4: Topics — "2/5 Dikuasai"
```

**Row 3 — Main Split** (8 col left + 4 col right)

_Left — Recommended Next (8 col)_:

```
Section title: "Rekomendasi Untukmu"
Big card: Topic Card yang direkomendasikan BKT
  - Topic name (text-2xl)
  - Spark quote: "Aku rekomendasikan ini karena nilaimu di sini masih 45% 💡"
  - Mastery bar + percentage
  - Estimated time: "~20 menit"
  - Button: "Mulai Sekarang" (primary, large)
```

_Right — Quick Stats (4 col)_:

```
Recent Activity (3 items):
  - Topic + waktu + XP gained
  - Icon + label + small badge

Spark Tip (card kecil):
  - Spark icon thinking
  - Tip motivasi/belajar singkat
```

**Row 4 — Knowledge Map Preview** (full width)

```
Section: "Peta Kemampuanmu"
Link: "Lihat semua →"
Grid 5 topic cards (horizontal scroll mobile):
  - Masing-masing: Icon + Nama + Status badge + Mastery %
  - Locked: grayscale + lock icon
```

**Row 5 — Achievements** (full width)

```
Section: "Pencapaian Terbaru"
Horizontal scroll: Achievement badge cards
  - Unlocked: full color, animasi shimmer
  - Locked: grayscale, "?" icon
```

#### Mobile Dashboard

- Stack vertical
- Stats: 2x2 grid
- Recommended: full width card
- Knowledge Map: horizontal scroll
- Bottom nav

---

### 7.6 Knowledge Map Page

**Layout**: Full-width, sidebar + main

**Header**:

- "Peta Kemampuanmu" + overall mastery %
- Filter tabs: Semua | Belum | In Progress | Dikuasai

**Map Visualization**:

- Desktop: Grid dengan connector lines antar topic (prerequisites visible)
- Mobile: Vertical list dengan indent untuk prerequisites

**Topic Card (expanded)**:

```
Left border color = status
Icon besar (emoji/svg) 48px
Topic name (text-xl bold)
Description 1 baris
Mastery bar
Status badge
Last practiced date
CTA button (Mulai / Lanjutkan / Review / Terkunci)
```

**Prerequisite Connector**:

```
Arrow/line dari prerequisite ke topic
Locked: line dashed gray
Met: line solid green
```

---

### 7.7 Topic Detail / Learning Page

**Layout**: Sidebar kiri (outline materi) + main content

**Breadcrumb**: Dashboard → Peta → [Nama Topik]

**Topic Header**:

- Icon + Nama + Difficulty badge + Mastery badge
- Mastery progress bar (current %)
- "Spark sedang mempersiapkan materi..." (saat load)

**Content Area**:

```
Tab: Materi | Latihan | Riwayat

[Materi tab]:
  - Learning material sections (accordion-style)
  - Code/formula blocks dengan syntax highlight
  - Example boxes (tinted bg)
  - "Tandai Selesai" button per section

[Latihan tab]:
  - Question cards (adaptive difficulty)
  - Real-time BKT update setelah setiap jawaban
  - Mastery bar animated update
  - "Lihat Penjelasan" → Spark explains

[Riwayat tab]:
  - Timeline jawaban benar/salah
  - XP gained per sesi
  - Mastery trend chart (Recharts)
```

**Floating Spark Button**: Bottom right corner

- Klik → buka AI Tutor slide-over

---

### 7.8 Exercise / Quiz Mode

**Layout**: Focused mode (full screen, hide sidebar)

**Top bar**:

- Exit (kiri)
- Progress pill: "3/10 soal"
- Mastery realtime: "📈 52%" (update tiap soal)
- Streak indicator

**Question area**: Centered, max-w-2xl

**After Answer**:

```
Correct:
  - Green overlay flash
  - Spark excited (bounce animation)
  - "+15 XP" floating number (animasi ke atas)
  - "Benar! 🎉 [Penjelasan singkat]"
  - Button: "Soal Berikutnya →"

Wrong:
  - Red overlay flash (subtle)
  - Spark encouraging
  - "Hampir! Jawaban yang benar adalah [X]"
  - Explanation card (expandable)
  - Button: "Mengerti, Lanjut"
```

**Session End Screen**:

- Full page celebration
- Spark celebrating (large, animated)
- Stats: Benar X/10, XP gained, Mastery change (+7.3%)
- "🎊 Mastery naik dari 45% → 52.3%!"
- Confetti animation (canvas-based atau CSS)
- CTA: "Lanjut Latihan" | "Kembali ke Dashboard"

---

### 7.9 AI Tutor Page

**Layout**: Split — left context panel (320px) + right chat area

**Left Panel — Context**:

```
"Sedang membahas:"
- Topic card mini
- Last question answered
- Current mastery bar

"Spark bisa membantu:"
- Chip buttons: "Jelaskan konsep ini" | "Kenapa jawabanku salah?" | "Berikan contoh lain" | "Hint untuk soal ini"
```

**Right Panel — Chat**:

```
Header: "Spark AI Tutor" + status online dot
Chat area: scroll, message bubbles (6.8)
Input bar:
  - Text input (placeholder: "Tanya Spark apapun tentang [Topik]...")
  - Attach button (optional)
  - Send button (primary)
```

**Empty State** (belum ada percakapan):

```
Spark centered, waving
"Hei! Ada yang bisa aku bantu jelaskan?"
Suggestion chips: 3 quick questions berdasarkan topik aktif
```

---

### 7.10 Profile & Achievements Page

**Layout**: Single column, max-w-3xl centered

**Profile Header**:

```
Avatar (64px) + nama + kelas
Level badge (Level 12 — "Rising Star")
XP bar: 840 / 1000 XP ke level berikutnya
Edit profile link
```

**Stats Grid** (3 col):

- Total XP, Streak terpanjang, Topics dikuasai
- Sesi belajar, Soal dijawab, Akurasi rata-rata

**Achievements Section**:

```
Category tabs: Semua | Milestone | Streak | Mastery | Special

Achievement card grid (3 col desktop, 2 col mobile):
  Unlocked: Full color, tanggal unlock, XP reward
  Locked: Grayscale, hint text, XP reward (grayed)
```

**Learning History**:

- Timeline chart (Recharts) — XP per hari 7 hari terakhir
- Topic progress history

---

## 8. Gamification System

### 8.1 XP (Experience Points)

| Aksi                        | XP                               |
| --------------------------- | -------------------------------- |
| Jawab soal benar            | +15 XP                           |
| Jawab soal salah            | +2 XP (tetap ada reward belajar) |
| Selesai sesi latihan        | +25 XP bonus                     |
| Topik mastered pertama kali | +100 XP                          |
| Streak harian               | +10 XP × hari                    |
| Selesai diagnostic test     | +50 XP                           |
| Tanya AI Tutor              | +5 XP                            |
| Baca materi lengkap         | +20 XP                           |

### 8.2 Level System

| Level | Nama       | XP Required |
| ----- | ---------- | ----------- |
| 1     | Pemula     | 0           |
| 2     | Penjelajah | 100         |
| 3     | Pelajar    | 250         |
| 4     | Penasaran  | 500         |
| 5     | Gigih      | 900         |
| 6     | Cerdas     | 1,400       |
| 7     | Mahir      | 2,100       |
| 8     | Ahli       | 3,000       |
| 9     | Master     | 4,200       |
| 10    | Legenda    | 6,000       |

_Level names dalam Bahasa Indonesia untuk feel lokal_

### 8.3 Streak System

- **Harian streak**: Belajar minimal 1 sesi per hari
- **Visual**: Api 🔥 dengan angka, makin tinggi makin besar animasinya
- **Milestone streak**: 3, 7, 14, 30 hari → achievement unlock + bonus XP
- **Grace period**: 1 hari boleh skip (streak freeze) per minggu

### 8.4 Achievement Badges

#### Kategori Milestone

- 🎯 "Langkah Pertama" — Selesaikan diagnostic test
- 📚 "Pembaca Sejati" — Baca 10 materi
- 💯 "Perfeksionis" — Jawab 10 soal benar berturut-turut
- 🗺️ "Penjelajah Peta" — Kunjungi semua topik

#### Kategori Streak

- 🔥 "3 Hari Semangat" — Streak 3 hari
- 🔥🔥 "Seminggu Penuh" — Streak 7 hari
- ⚡ "Konsisten" — Streak 14 hari
- 👑 "Tak Terhentikan" — Streak 30 hari

#### Kategori Mastery

- ⭐ "Penguasa Operasi Dasar" — Mastered Operasi Dasar
- ⭐ "Raja Pecahan" — Mastered Pecahan
- 🏆 "Matematika Juara" — Mastered semua topik

#### Kategori Special

- 🚀 "Bintang Baru" — Level 5 pertama kali
- 💡 "Ingin Tahu" — Tanya AI Tutor 20x
- 🎓 "Lulus dengan Baik" — Overall mastery >80%

### 8.5 Micro-Interactions & Animations

| Interaksi       | Animasi                                             |
| --------------- | --------------------------------------------------- |
| Jawab benar     | XP number float up + Spark bounce                   |
| Jawab salah     | Subtle shake + Spark encouraging                    |
| Level up        | Full-screen celebration overlay + Spark celebrating |
| Topic mastered  | Confetti burst + badge unlock modal                 |
| Streak naik     | Fire grows bigger + number pulse                    |
| XP bar fill     | Smooth fill + glow at completion                    |
| Card hover      | translateY -2px + shadow increase                   |
| Button click    | Scale 95% → 100%                                    |
| Page transition | Fade + slight slide                                 |
| Spark idle      | Gentle floating (keyframe up-down)                  |

---

## 9. Responsive Breakpoints

```
xs:  < 480px   (small mobile)
sm:  480-768px (mobile)
md:  768-1024px (tablet)
lg:  1024-1280px (laptop)
xl:  > 1280px  (desktop)
```

### Layout Adaptations

| Component       | Desktop            | Tablet              | Mobile            |
| --------------- | ------------------ | ------------------- | ----------------- |
| Navigation      | Sidebar kiri 256px | Sidebar collapsible | Bottom nav        |
| Dashboard stats | 4 columns          | 2x2 grid            | 2x2 grid          |
| Topic cards     | Grid 3 col         | Grid 2 col          | Horizontal scroll |
| Chat layout     | Split panel        | Split panel         | Full screen chat  |
| Question card   | Centered max-w-2xl | Full width padded   | Full screen       |

---

## 10. Accessibility

- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Focus indicators visible (ring-2 ring-primary-500)
- ARIA labels pada semua interactive elements
- Keyboard navigable (Tab order logical)
- Screen reader: semantic HTML (heading hierarchy, landmarks)
- Touch targets minimum 44x44px (mobile)
- Reduced motion: `@media (prefers-reduced-motion: reduce)` untuk semua animasi

---

## 11. Google Stitch Prompts

> **⚠️ IMPORTANT**: Sebelum copy-paste prompt ke Google Stitch, **ganti semua `SkillPath AI` dengan nama final project**.
> Untuk sementara, gunakan `SkillPath AI` atau placeholder `[App Name]` di prompt.

> Copy-paste prompt ini langsung ke Google Stitch untuk generate prototype per halaman.

---

### Prompt 1: Dashboard Page (UTAMA)

```
Design a modern educational learning platform dashboard called "SkillPath AI" with the following specifications:

STYLE: Clean, playful-professional, white background, inspired by Duolingo's gamification but more academic. Use blue (#3B82F6) as primary color, green (#22C55E) for success/mastered states, amber (#F59E0B) for in-progress, and purple (#8B5CF6) for XP/gamification elements.

LAYOUT: Desktop (1280px wide). Left sidebar (256px) + main content area.

SIDEBAR:
- Logo "SkillPath AI" with a small glowing star mascot called "Spark" at the top
- Navigation items with icons: Dashboard (active, blue highlight), Knowledge Map, Learn, AI Tutor
- Bottom: user avatar + name "Budi Santoso" + level badge "Level 7"

MAIN CONTENT (top to bottom):
1. GREETING HEADER: "Selamat pagi, Budi! 👋" in large bold text. Subtitle: "Kamu sudah belajar 3 hari berturut-turut 🔥". Right side: orange streak counter "🔥 3" pill + purple XP counter "⚡ 1,240 XP" pill.

2. STATS ROW (4 equal cards):
   - Card 1: Circular progress chart showing "68%" with label "Overall Mastery", blue ring
   - Card 2: "1,240 XP" large bold purple text, small level progress bar below, "Level 7 → 8"
   - Card 3: "🔥 3 Hari" orange text, small calendar dots showing last 7 days activity
   - Card 4: "2 dari 5" green text, "Topik Dikuasai" label

3. MAIN SPLIT (2/3 + 1/3):
   LEFT (2/3): "Rekomendasi Untukmu" section title. Large recommendation card: topic "Pecahan" with amber left border, mascot Spark saying "Nilaimu 45% — ayo kita tingkatkan! 💡", mastery bar at 45% (amber), "~20 menit" time estimate, big blue "Mulai Sekarang" button.

   RIGHT (1/3): "Aktivitas Terakhir" with 3 recent activity items (each with topic icon, name, time ago, XP gained badge). Below: small "Spark Tip" card with star mascot and motivational text.

4. KNOWLEDGE MAP PREVIEW: "Peta Kemampuanmu" title + "Lihat semua →" link. 5 topic mini-cards in a row: "Operasi Dasar" (green, mastered, 85%), "Pecahan" (amber, in-progress, 45%), "Bilangan Bulat" (green, mastered, 78%), "Persamaan Linear" (red, not mastered, 20%), "Statistika" (gray, locked, 🔒). Each card has status badge and mastery percentage.

5. ACHIEVEMENTS ROW: "Pencapaian Terbaru" title. 4 achievement badge cards: unlocked ones are colorful with icons, locked ones are grayscale with "?" overlay.

TYPOGRAPHY: Plus Jakarta Sans for headings, Inter for body. Use generous white space, rounded corners (16px cards), subtle shadows.

GAMIFICATION FEEL: The interface should feel rewarding and motivating. Progress bars, XP numbers, and streak counters should feel prominent but not overwhelming.
```

---

### Prompt 2: Knowledge Map Page

```
Design a Knowledge Map page for "SkillPath AI", an adaptive math learning platform for middle school students.

STYLE: White background, clean, with a subtle grid pattern. Primary blue (#3B82F6), mastery colors: green for mastered, amber for in-progress, red for not-mastered, gray for locked.

LAYOUT: Desktop 1280px. Same left sidebar as dashboard. Main area has:

HEADER: "Peta Kemampuanmu" (h1 bold) + overall mastery circular badge "Overall: 58%" right-aligned. Below: filter tab bar "Semua | Belum Dikuasai | In Progress | Dikuasai"

MAP AREA: A visual topic dependency map showing 5 math topics as cards connected by arrows showing prerequisites:

Topic cards (large, 280px wide each):
- "Operasi Dasar" (top, no prerequisites) — GREEN border left — 85% mastery — "Dikuasai" green badge — "Review" ghost button
- "Bilangan Bulat" (unlocked, depends on Operasi Dasar) — GREEN — 78% — "Dikuasai"
- "Pecahan" (unlocked, depends on Operasi Dasar) — AMBER border — 45% mastery bar — "In Progress" badge — "Lanjutkan" primary button
- "Persamaan Linear" (unlocked, depends on Bilangan Bulat) — RED border — 20% mastery — "Perlu Diperkuat" badge — "Mulai" primary button
- "Statistika" (LOCKED, depends on Pecahan + Persamaan Linear) — GRAY — locked overlay with padlock icon — "Selesaikan prasyarat dulu" text

Each topic card contains: emoji icon (📐✂️📊), topic name (bold), description (1 line, muted), mastery progress bar, status badge, CTA button.

ARROWS: Dashed gray lines connecting prerequisites to dependent topics. Met prerequisites: solid green arrow. Unmet: dashed gray.

Show Spark mascot in bottom-right corner as floating button "Tanya Spark" with chat bubble.
```

---

### Prompt 3: Diagnostic Test Page

```
Design a Diagnostic Test page for "SkillPath AI" educational platform. This is a focused, distraction-free test-taking interface.

STYLE: Clean white background, minimal UI. The test is the focus. Primary blue (#3B82F6).

LAYOUT: Full page, no sidebar. Centered content, max-width 680px.

TOP BAR (full width, white, border-bottom):
- Left: "SkillPath AI" logo small
- Center: Progress bar (40% filled, blue) with "Soal 6 dari 15" label above
- Right: "Keluar" ghost button (with warning intent)

QUESTION CARD (centered, white, rounded-2xl, shadow-lg, padding 40px):
- TOP: small "Operasi Dasar" topic pill (blue) left, "01:23" timer right (gray)
- QUESTION NUMBER: "Soal 6" in muted small text
- QUESTION TEXT (text-xl, dark, line-height relaxed): "Berapakah hasil dari 3/4 + 1/2?"
- 4 OPTION BUTTONS stacked, full-width, each a bordered rounded-xl card (padding 16px):
  Option A: "1/4"
  Option B: "5/4" — THIS ONE IS SELECTED (blue border, blue-50 background, checkmark circle)
  Option C: "3/8"
  Option D: "2/6"

BOTTOM OF CARD:
- Left: small Spark mascot saying "Ambil waktumu, tidak ada yang buru-buru! 😊"
- Right: "Jawab" button (blue, large, enabled since option selected)

OUTSIDE CARD BOTTOM: small text "Tes ini membantu kami memahami kemampuan awalmu"

OVERALL FEEL: Calm, focused, not stressful. The student should feel safe to explore and answer.
```

---

### Prompt 4: Exercise / Quiz Mode (After Answering)

```
Design an Exercise Mode screen for "SkillPath AI" showing the state AFTER a student answers CORRECTLY.

STYLE: White base, with a celebratory green overlay/flash state. Spark mascot is excited.

LAYOUT: Fullscreen focused mode. No sidebar.

TOP BAR:
- "← Keluar" left
- "Pecahan — Latihan" center
- "📈 52.3% (+7.3%)" right in green pill (mastery just updated!)
- Progress dots: ●●●○○ (3 of 5 done)

QUESTION AREA (same card as before, but now showing answer result):
Question: "Berapakah hasil dari 2/3 + 1/6?"
All 4 options shown, option C "5/6" is highlighted GREEN with checkmark ✓ icon. Option A "1/2" (the wrong answer) shows a subtle gray. Others neutral.

FEEDBACK SECTION (below card, animated in from bottom):
Green tinted card:
- Large Spark mascot (excited, stars around it) + "Benar! 🎉" in large green bold text
- Explanation: "2/3 = 4/6, sehingga 4/6 + 1/6 = 5/6. Menyamakan penyebut adalah kuncinya!"
- Bottom left: "+15 XP" purple badge with up arrow (as if floating up)
- Bottom right: "Soal Berikutnya →" blue button

BACKGROUND: Subtle confetti particles (small colored dots) scattered in background to celebrate.

FLOATING ELEMENT: "+15 XP" text animating upward (CSS animation, show it slightly faded as if mid-animation).
```

---

### Prompt 5: AI Tutor Chat Page

```
Design an AI Tutor chat interface for "SkillPath AI" educational platform featuring "Spark", the AI companion.

STYLE: Clean, modern chat interface. White background. Left panel light gray. Friendly, conversational feel.

LAYOUT: Desktop 1280px. Left sidebar (navigation, same as other pages) + split content area.

CONTENT AREA SPLIT:
LEFT PANEL (320px, light gray bg #F9FAFB, border-right):
  Title: "Konteks Saat Ini" (bold)

  Topic card mini: "Pecahan" amber badge, 45% mastery bar

  Last question: small card showing "2/3 + 1/6 = ?" with student's wrong answer "1/2" crossed out

  "Spark bisa membantu:" section with chip buttons:
  - "Kenapa jawabanku salah?"
  - "Jelaskan konsep ini"
  - "Berikan contoh lain"
  - "Hint untuk soal ini"

  Bottom: small Spark mascot (reading/thinking pose) with "Aku siap membantu! 📚"

RIGHT PANEL (chat area):
  CHAT HEADER: Spark avatar (32px animated star) + "Spark AI Tutor" bold + "Online" green dot

  CHAT MESSAGES (scroll area):
  [Student bubble - right aligned, blue bg]: "Kenapa hasilnya bukan 1/2 ya? Aku pikir 2/3 + 1/6 = 2/9?"

  [Spark bubble - left aligned, white card with shadow]:
  Spark avatar 24px left of bubble.
  Text: "Pertanyaan bagus Budi! 🌟
  Sebelum menjumlahkan pecahan, penyebutnya harus sama dulu.

  2/3 = ?/6 → kita kalikan atas-bawah dengan 2 → 4/6

  Jadi: 4/6 + 1/6 = 5/6

  Ingat: penjumlahan pecahan = samakan penyebut dulu! 💡"

  [Student bubble]: "Oh! Jadi harus disamakan dulu. Kalau 1/2 + 1/3 gimana?"

  [TYPING INDICATOR - left aligned]: Spark avatar + 3 bouncing dots (shows Spark is "thinking")

  CHAT INPUT BAR (bottom, white, border-top):
  - Text input: "Tanya Spark tentang Pecahan..." placeholder
  - Send button (blue, arrow icon)

  OVERALL: Warm, encouraging, feels like chatting with a smart friend who explains patiently.
```

---

### Prompt 6: Onboarding / Welcome Page

```
Design a welcoming onboarding screen for "SkillPath AI", a math learning platform for Indonesian middle school students.

STYLE: Bright, energetic, playful. Gradient background: soft blue-to-green-to-peach gradient (like a sunrise). Large friendly illustrations. Very approachable for 12-15 year olds.

LAYOUT: Fullscreen. Centered content. Step 1 of 3.

TOP: Step indicator — 3 dots, first one filled blue, others gray outline. "Langkah 1 dari 3" small text.

CENTER CONTENT:
- SPARK MASCOT: Large (120px), animated star character with a big smile, waving hand. Yellow/gold with blue glow aura. This is the hero of the screen.
- SPEECH BUBBLE from Spark: "Hei! Aku Spark, teman belajar matematikamu! ⭐"
- MAIN HEADING (text-4xl, dark, bold): "Selamat datang di SkillPath AI!"
- SUBTITLE: "Platform belajar yang menyesuaikan diri dengan kemampuanmu"

FORM AREA (white card, rounded-2xl, shadow, max-w-md):
- Small label: "Siapa namamu?"
- Input field: large, "Nama panggilanmu..." placeholder
- Below input: Spark says "Aku akan memanggil kamu dengan ini! 😊"

BUTTON: "Halo Spark! 👋" — large, full-width, gradient blue button

BOTTOM: "Sudah punya akun? Masuk" link

FEEL: Should feel like the start of an adventure, not a boring sign-up form. Playful but not childish.
```

---

### Prompt 7: Mobile Dashboard

```
Design the MOBILE version (375px iPhone) of the SkillPath AI dashboard.

STYLE: Same color system as desktop — white background, blue primary, green/amber/purple accents.

LAYOUT: Single column, bottom navigation bar.

TOP BAR (fixed, white):
- Left: Hamburger menu icon
- Center: "SkillPath AI" logo
- Right: "🔥 3" fire pill + "⚡ 1,240" XP pill (compact)

CONTENT (scrollable):
1. GREETING: "Pagi, Budi! 👋" (text-2xl) + "3 hari berturut-turut 🔥" subtitle

2. STATS GRID (2x2):
   - Overall Mastery: mini circular "68%" blue
   - XP: "1,240" purple + "Level 7"
   - Streak: "🔥 3 Hari"
   - Topics: "2/5 ⭐"

3. RECOMMENDATION CARD (full width, prominent):
   Amber left border. "Lanjutkan: Pecahan". Spark avatar small. 45% mastery bar. "Mulai →" button blue full-width.

4. TOPIC LIST (horizontal scroll, peek-next):
   5 topic pill cards scrollable: icon + name + % + color dot

5. RECENT ACTIVITY (3 items vertical list):
   Each: colored dot + topic + time + XP badge

BOTTOM NAVIGATION (fixed, white, border-top, 5 tabs):
- 🏠 Beranda (active, blue)
- 🗺️ Peta
- 📚 Belajar
- 🤖 Tutor
- 👤 Profil

Active tab: icon colored blue + label blue + small dot indicator above icon.

FEEL: Native mobile app quality, thumb-friendly, card-heavy layout, generous touch targets.
```

---

## 12. Design Checklist Before Coding

### Visual Consistency

- [ ] Semua warna menggunakan CSS variables (jangan hardcode hex di komponen)
- [ ] Border radius konsisten (pakai design tokens)
- [ ] Shadow levels konsisten (sm/md/lg/xl)
- [ ] Typography scale dipakai, tidak ada ukuran arbitrary

### Gamification

- [ ] XP counter visible di semua halaman (top bar)
- [ ] Streak visible di top bar
- [ ] Spark mascot muncul di ≥3 halaman dengan state berbeda
- [ ] Feedback animasi pada jawaban benar/salah
- [ ] Progress bar menggunakan animasi smooth

### Responsive

- [ ] Sidebar → bottom nav saat mobile
- [ ] Dashboard stats 4-col → 2x2 grid
- [ ] Touch targets ≥44px di semua buttons
- [ ] Text tidak dipotong di mobile

### Accessibility

- [ ] Focus states visible
- [ ] Color tidak satu-satunya indicator (selalu ada label/icon juga)
- [ ] Alt text pada semua images/icons
- [ ] Form labels properly connected ke inputs

---

## 13. Tailwind CSS Custom Classes (tambahan ke index.css)

```css
@layer components {
  /* Gamification */
  .xp-pill {
    @apply bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1;
  }
  .streak-pill {
    @apply bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1;
  }

  /* Topic status cards */
  .topic-card-mastered {
    @apply card border-l-4 border-l-green-500;
  }
  .topic-card-progress {
    @apply card border-l-4 border-l-amber-500;
  }
  .topic-card-weak {
    @apply card border-l-4 border-l-red-500;
  }
  .topic-card-locked {
    @apply card border-l-4 border-l-gray-300 opacity-60;
  }

  /* Stat card */
  .stat-card {
    @apply card flex flex-col items-start gap-2 p-5;
  }

  /* Section heading */
  .section-title {
    @apply text-xl font-bold text-gray-900 mb-4;
  }

  /* Feedback states */
  .feedback-correct {
    @apply bg-green-50 border border-green-200 rounded-xl p-4 text-green-800;
  }
  .feedback-wrong {
    @apply bg-red-50 border border-red-200 rounded-xl p-4 text-red-800;
  }

  /* Chat bubbles */
  .bubble-user {
    @apply bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-xs ml-auto;
  }
  .bubble-spark {
    @apply bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 max-w-sm;
  }

  /* Mastery progress bar */
  .mastery-bar-track {
    @apply w-full bg-gray-100 rounded-full h-2;
  }
  .mastery-bar-fill-mastered {
    @apply bg-green-500 h-2 rounded-full transition-all duration-500;
  }
  .mastery-bar-fill-progress {
    @apply bg-amber-500 h-2 rounded-full transition-all duration-500;
  }
  .mastery-bar-fill-weak {
    @apply bg-red-500 h-2 rounded-full transition-all duration-500;
  }

  /* Floating XP animation */
  .xp-float {
    @apply text-purple-600 font-bold text-lg pointer-events-none;
    animation: floatUp 1s ease-out forwards;
  }

  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-60px);
    }
  }

  /* Spark idle animation */
  .spark-idle {
    animation: sparkFloat 3s ease-in-out infinite;
  }
  @keyframes sparkFloat {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  /* Spark bounce (correct answer) */
  .spark-bounce {
    animation: sparkBounce 0.6s ease;
  }
  @keyframes sparkBounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }
}
```

---

_Dokumen ini adalah living document — update setiap kali ada keputusan desain baru._
_Last updated: 2026-10-12_
