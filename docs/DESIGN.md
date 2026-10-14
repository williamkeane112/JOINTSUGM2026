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
- Warna default: Kuning emas `#E8A33D` dengan glow pink `#FF4F87`
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

> **Dunia visual**: hangat, personal, malam-fokus — pink/violet di atas night & cream, bukan biru-SaaS generik. Diturunkan dari auth page (`src/page/auth/Auth.tsx` + token di `src/index.css`), bukan sebaliknya.

### Brand Core

```
--color-ink:    #17111F   /* Teks utama di atas surface terang */
--color-pink:   #FF4F87   /* Primary action — tombol, link, aksen */
--color-pink-deep: #E62F72 /* Hover/active dari primary */
--color-violet: #6D36BD   /* Aksen sekunder — depth, focus, XP */
--color-night:  #160820   /* Surface gelap — hero, nav malam */
--color-cream:  #FFF7F2   /* Surface terang — page/app background */
```

### Support Neutrals

```
--color-muted:   #766B7F  /* Teks sekunder */
--color-line:    #EADFE4  /* Border, divider */
--color-surface: #FFFFFF  /* Card di atas cream — satu elevasi, bukan ghost card */
```

### Mastery Status

Makna fungsionalnya **tetap merah/kuning/hijau** (jangan diganti pink — nanti user bingung membedakan status dari aksi). Hue-nya dihangatkan agar menyatu dengan dunia pink/violet/cream, bukan `red-500`/`amber-500`/`green-500` Tailwind default.

```
--color-mastered: #1E9E6B  /* 🟢 Mastered (>70%) — emerald hangat */
--color-progress: #E8A33D  /* 🟡 In Progress (40-70%) — amber hangat */
--color-weak:     #E2544B  /* 🔴 Not Mastered (<40%) — koral hangat */
--color-locked:   #AFA3AC  /* Locked topic — netral dari keluarga muted/line */
```

Setiap status punya pasangan tint/ink/line untuk badge (lihat §6.4) — teks badge selalu dicelup dari hue status itu sendiri, **tidak pernah abu-abu generik**.

### Gamification

Memakai ulang hue brand yang sudah ada, bukan menambah warna baru yang tidak bermakna.

```
--color-xp:     var(--color-violet)  /* XP — reuse violet, bukan purple-500 baru */
--color-streak: #F2763C              /* Streak — koral-oranye, beda dari weak & mastered */
--color-gold:   var(--color-progress) /* Achievement gold — reuse amber */
--color-silver: #9C8FA0               /* Achievement silver — dari keluarga violet-muted */
```

### Shadows

Shadow selalu punya offset + blur (bukan halo warna offset-nol — itu dekorasi, bukan depth).

```
--shadow-primary:  0 10px 24px rgba(255, 79, 135, 0.28)
--shadow-violet:   0 10px 24px rgba(109, 54, 189, 0.25)
--shadow-mastered: 0 10px 20px rgba(30, 158, 107, 0.22)
--shadow-card:     0 4px 16px rgba(23, 17, 31, 0.08)
--shadow-card-hover: 0 12px 28px rgba(23, 17, 31, 0.14)
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

### Letter Spacing (tracking)

Tracking rapat memberi karakter pada headline display, tapi ada batas sebelum teks jadi sulit dibaca.

```
--tracking-floor:   -0.04em  /* Batas rapat maksimum — jangan lebih rapat dari ini */
--tracking-display: -0.03em  /* Default untuk h1-h4 (font-display), biasanya terbaca lebih baik dari floor */
--tracking-body:    normal   /* Body text — jangan di-tracking */
```

Numerik (XP counter, skor, timer) pakai `font-variant-numeric: tabular-nums` agar sejajar saat berubah — bukan font monospace sebagai kostum "teknis".

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
--radius-sm:   6px    /* Input fields kecil */
--radius-md:   13px   /* Input fields, buttons — selaras var(--radius-input) */
--radius-lg:   14px   /* Cards — selaras var(--radius-card), craft floor 12-16px */
--radius-xl:   24px   /* Modal, big panels */
--radius-2xl:  32px   /* Hero sections */
--radius-full: 9999px /* Pills, badges, avatars — var(--radius-pill) */
```

### Shadows

Shadow neutral (netral, berbasis ink bukan hitam murni) untuk depth umum; shadow berwarna untuk gamification/status didefinisikan sekali di §3 — rujuk dari sana, jangan duplikasi nilai.

```
--shadow-sm:  0 1px 3px rgba(23,17,31,0.06)
--shadow-md:  0 4px 16px rgba(23,17,31,0.08)   /* = var(--shadow-card) di §3 */
--shadow-lg:  0 12px 28px rgba(23,17,31,0.14)  /* = var(--shadow-card-hover) di §3 */
--shadow-xl:  0 20px 48px rgba(23,17,31,0.18)

/* Shadow berwarna: lihat §3 Shadows (--shadow-primary, --shadow-violet, --shadow-mastered) */
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
PRIMARY   → bg-[var(--color-pink)], white text, shadow-primary; hover bg-[var(--color-pink-deep)]
SECONDARY → bg-transparent, border-[var(--color-pink)], text-[var(--color-pink-deep)]
SUCCESS   → bg-[var(--color-mastered)], white text, shadow-mastered
DANGER    → bg-[var(--color-weak)], white text
GHOST     → transparent, text-[var(--color-pink-deep)], hover bg-[#fff0f5]
XP        → bg-[var(--color-violet)], white text, shadow-violet (untuk reward actions)
```

#### Sizes

```
SM  → px-3 py-1.5 text-sm rounded-[10px]
MD  → px-4 py-2   text-base rounded-[var(--radius-input)]  (default)
LG  → px-6 py-3   text-lg rounded-[var(--radius-input)]
XL  → px-8 py-4   text-xl rounded-[16px]   (CTA hero)
```

#### States

- `default` → base style
- `hover` → lift effect (translateY -1px) + stronger shadow (lihat §3 Shadows)
- `active` → press down (translateY 0)
- `loading` → spinner icon kiri + disabled
- `disabled` → opacity 50%, no cursor

### 6.2 Cards

#### Base Card

```
bg-[var(--color-surface)]
rounded-[var(--radius-card)] (14px)
shadow: var(--shadow-card)       /* satu deklarasi elevasi — shadow saja, bukan border + shadow */
p-6
transition: shadow 200ms, transform 200ms
hover: shadow var(--shadow-card-hover), translateY(-2px)
```

#### Topic Card (Knowledge Map)

```
Base card +
Left border: 4px solid [status-color dari §3 Mastery Status]
Header: topic icon (SVG, bukan emoji) + name + difficulty badge
Body: Progress bar + percentage + last practiced
Footer: "Lanjutkan" button atau "Terkunci" state
```

#### Achievement Badge Card

```
Centered layout
Circle icon top (64px, bg violet/pink sesuai konteks)
Title bold (font-display)
Description muted (var(--color-muted))
Unlocked: full color | Locked: desaturated + overlay var(--color-locked-tint)
```

#### Stat Card (Dashboard)

```
Icon kiri (32px, colored bg circle sesuai status/metric)
Label atas (text-sm var(--color-muted))
Value besar (text-2xl font-display bold, warna sesuai metric)
Trend indicator bawah (↑ +5% minggu ini)
```

### 6.3 Progress Components

#### XP Progress Bar

```
Container: bg-[var(--color-line)], rounded-full, h-3
Fill: bg-[var(--color-violet)], rounded-full, transition width 600ms ease
Label kiri: "Level X"
Label kanan: "Y / Z XP"
Animasi: pulse saat XP ditambah
```

#### Topic Mastery Bar

```
Container: bg-[var(--color-line)], rounded-full, h-2
Fill: warna sesuai status (mastered/progress/weak dari §3)
Percentage label di kanan
```

#### Circular Progress (Dashboard hero)

```
SVG circle, stroke-dasharray animation
Center: percentage besar (text-4xl font-display bold)
Sub: "Overall Mastery"
Warna: stroke sesuai mastery level (§3)
```

### 6.4 Badges & Pills

Teks badge selalu dicelup dari hue status itu sendiri (lihat §3) — tidak pernah abu-abu generik.

```
MASTERED     → bg-[var(--color-mastered-tint)] text-[var(--color-mastered-ink)] border-[var(--color-mastered-line)]
IN_PROGRESS  → bg-[var(--color-progress-tint)] text-[var(--color-progress-ink)] border-[var(--color-progress-line)]
NOT_MASTERED → bg-[var(--color-weak-tint)] text-[var(--color-weak-ink)] border-[var(--color-weak-line)]
LOCKED       → bg-[var(--color-locked-tint)] text-[var(--color-locked-ink)] border-[var(--color-locked-line)]
NEW          → bg-[#f3ecfa] text-[var(--color-violet)] border-[#ddc8f0]
XP           → bg-[#f3ecfa] text-[var(--color-violet)] border-[#ddc8f0]

Size: px-3 py-1 text-xs font-semibold rounded-[var(--radius-pill)]
```

### 6.5 Input Fields

```
Base:
  border border-[var(--color-line)]
  rounded-[var(--radius-input)] (13px)
  px-4 py-3
  text-base
  bg-[var(--color-surface)]
  placeholder: text-[var(--color-muted)]

Focus:
  border-[var(--color-pink)]
  ring-2 ring-[rgba(255,79,135,0.15)]
  outline-none

Error:
  border-[var(--color-weak)]
  ring-2 ring-[var(--color-weak-tint)]

Icon left/right: absolute, text-[var(--color-muted)]
```

### 6.6 Navigation

#### Sidebar (Desktop)

```
Width: 256px (collapsed: 72px)
bg-[var(--color-surface)]
border-right: 1px solid var(--color-line)
shadow: var(--shadow-card)

Top: Logo + Spark character (animasi idle)
Nav items: icon + label, rounded-[var(--radius-input)], hover bg-[#fff0f5]
Active: bg-[#fff0f5] text-[var(--color-pink-deep)] font-semibold border-l-2 border-[var(--color-pink)]
Bottom: User avatar + name + settings icon
```

#### Bottom Nav (Mobile)

```
Fixed bottom
bg-[var(--color-surface)]
border-top: 1px solid var(--color-line)
5 items: Home, Map, Learn, Tutor, Profile
Active: warna var(--color-pink) pada icon + dot indicator
```

#### Top Bar

```
h-16
bg-[var(--color-surface)]
border-bottom: 1px solid var(--color-line)
Left: Hamburger (mobile) / Logo (desktop)
Center: Page title (font-display)
Right: XP counter pill (violet) + Streak counter (coral-orange) + Notification bell + Avatar
```

### 6.7 Question Card (Diagnostic & Exercise)

```
Container: max-w-2xl, centered
Card: rounded-[var(--radius-card)], p-8, shadow: var(--shadow-card)

Header:
  - Question number pill (Q 1/15)
  - Topic tag (badge)
  - Timer (jika ada)

Body:
  - Question text (text-xl, line-height relaxed)
  - Visual/equation block (optional)

Options: 4 option buttons
  - Base: border border-[var(--color-line)] rounded-[var(--radius-input)] p-4 text-left w-full
  - Hover: border-[var(--color-pink)] bg-[#fff0f5]
  - Selected: border-[var(--color-pink)] bg-[#fff0f5] font-semibold
  - Correct (after submit): border-[var(--color-mastered)] bg-[var(--color-mastered-tint)] ✓ icon
  - Wrong (after submit): border-[var(--color-weak)] bg-[var(--color-weak-tint)] ✗ icon

Footer:
  - Progress: "3 dari 15 soal"
  - Button: "Jawab" → active setelah pilih option
```

### 6.8 AI Tutor Chat Bubble

```
User bubble: bg-[var(--color-pink)] text-white, rounded-2xl rounded-br-sm, max-w-xs, right-aligned
Spark bubble: bg-[var(--color-surface)] shadow: var(--shadow-card), rounded-2xl rounded-bl-sm, max-w-sm, left-aligned
  + Spark avatar (24px) di pojok kiri bubble

Typing indicator: 3 dots animasi pulse (warna var(--color-violet))
Timestamp: text-xs text-[var(--color-muted)] di bawah bubble
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
- Focus indicators visible (ring-2 ring-[var(--color-pink)])
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

STYLE: Clean, playful-professional, warm cream background (#FFF7F2), inspired by Duolingo's gamification but more academic. Use pink (#FF4F87) as primary color, green (#1E9E6B) for success/mastered states, amber (#E8A33D) for in-progress, and violet (#6D36BD) for XP/gamification elements.

LAYOUT: Desktop (1280px wide). Left sidebar (256px) + main content area.

SIDEBAR:
- Logo "SkillPath AI" with a small glowing star mascot called "Spark" at the top
- Navigation items with icons: Dashboard (active, pink highlight), Knowledge Map, Learn, AI Tutor
- Bottom: user avatar + name "Budi Santoso" + level badge "Level 7"

MAIN CONTENT (top to bottom):
1. GREETING HEADER: "Selamat pagi, Budi! 👋" in large bold text. Subtitle: "Kamu sudah belajar 3 hari berturut-turut 🔥". Right side: coral-orange streak counter "🔥 3" pill + violet XP counter "⚡ 1,240 XP" pill.

2. STATS ROW (4 equal cards):
   - Card 1: Circular progress chart showing "68%" with label "Overall Mastery", pink ring
   - Card 2: "1,240 XP" large bold violet text, small level progress bar below, "Level 7 → 8"
   - Card 3: "🔥 3 Hari" coral-orange text, small calendar dots showing last 7 days activity
   - Card 4: "2 dari 5" green text, "Topik Dikuasai" label

3. MAIN SPLIT (2/3 + 1/3):
   LEFT (2/3): "Rekomendasi Untukmu" section title. Large recommendation card: topic "Pecahan" with amber left border, mascot Spark saying "Nilaimu 45% — ayo kita tingkatkan! 💡", mastery bar at 45% (amber), "~20 menit" time estimate, big pink "Mulai Sekarang" button.

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

STYLE: Warm cream background (#FFF7F2), clean, with a subtle grid pattern. Primary pink (#FF4F87), mastery colors: green for mastered, amber for in-progress, red for not-mastered, muted violet-gray for locked.

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

STYLE: Clean warm cream background, minimal UI. The test is the focus. Primary pink (#FF4F87).

LAYOUT: Full page, no sidebar. Centered content, max-width 680px.

TOP BAR (full width, cream, border-bottom):
- Left: "SkillPath AI" logo small
- Center: Progress bar (40% filled, pink) with "Soal 6 dari 15" label above
- Right: "Keluar" ghost button (with warning intent)

QUESTION CARD (centered, white, rounded-[14px], shadow soft, padding 40px):
- TOP: small "Operasi Dasar" topic pill (pink) left, "01:23" timer right (muted)
- QUESTION NUMBER: "Soal 6" in muted small text
- QUESTION TEXT (text-xl, dark, line-height relaxed): "Berapakah hasil dari 3/4 + 1/2?"
- 4 OPTION BUTTONS stacked, full-width, each a bordered rounded-[13px] card (padding 16px):
  Option A: "1/4"
  Option B: "5/4" — THIS ONE IS SELECTED (pink border, soft pink-tint background #fff0f5, checkmark circle)
  Option C: "3/8"
  Option D: "2/6"

BOTTOM OF CARD:
- Left: small Spark mascot saying "Ambil waktumu, tidak ada yang buru-buru! 😊"
- Right: "Jawab" button (pink, large, enabled since option selected)

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
- Bottom left: "+15 XP" violet badge with up arrow (as if floating up)
- Bottom right: "Soal Berikutnya →" pink button

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
  [Student bubble - right aligned, pink bg]: "Kenapa hasilnya bukan 1/2 ya? Aku pikir 2/3 + 1/6 = 2/9?"

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
  - Send button (pink, arrow icon)

  OVERALL: Warm, encouraging, feels like chatting with a smart friend who explains patiently.
```

---

### Prompt 6: Onboarding / Welcome Page

```
Design a welcoming onboarding screen for "SkillPath AI", a math learning platform for Indonesian middle school students.

STYLE: Bright, energetic, playful. Gradient background: pink-to-violet-to-cream gradient (deep and warm, like dusk). Large friendly illustrations. Very approachable for 12-15 year olds.

LAYOUT: Fullscreen. Centered content. Step 1 of 3.

TOP: Step indicator — 3 dots, first one filled pink, others cream outline. "Langkah 1 dari 3" small text.

CENTER CONTENT:
- SPARK MASCOT: Large (120px), animated star character with a big smile, waving hand. Gold with pink glow aura. This is the hero of the screen.
- SPEECH BUBBLE from Spark: "Hei! Aku Spark, teman belajar matematikamu! ⭐"
- MAIN HEADING (text-4xl, dark, bold): "Selamat datang di SkillPath AI!"
- SUBTITLE: "Platform belajar yang menyesuaikan diri dengan kemampuanmu"

FORM AREA (white card, rounded-2xl, shadow, max-w-md):
- Small label: "Siapa namamu?"
- Input field: large, "Nama panggilanmu..." placeholder
- Below input: Spark says "Aku akan memanggil kamu dengan ini! 😊"

BUTTON: "Halo Spark! 👋" — large, full-width, gradient pink button

BOTTOM: "Sudah punya akun? Masuk" link

FEEL: Should feel like the start of an adventure, not a boring sign-up form. Playful but not childish.
```

---

### Prompt 7: Mobile Dashboard

```
Design the MOBILE version (375px iPhone) of the SkillPath AI dashboard.

STYLE: Same color system as desktop — cream background, pink primary, green/amber/violet accents.

LAYOUT: Single column, bottom navigation bar.

TOP BAR (fixed, cream):
- Left: Hamburger menu icon
- Center: "SkillPath AI" logo
- Right: "🔥 3" fire pill + "⚡ 1,240" XP pill (compact)

CONTENT (scrollable):
1. GREETING: "Pagi, Budi! 👋" (text-2xl) + "3 hari berturut-turut 🔥" subtitle

2. STATS GRID (2x2):
   - Overall Mastery: mini circular "68%" pink
   - XP: "1,240" violet + "Level 7"
   - Streak: "🔥 3 Hari"
   - Topics: "2/5 ⭐"

3. RECOMMENDATION CARD (full width, prominent):
   Amber left border. "Lanjutkan: Pecahan". Spark avatar small. 45% mastery bar. "Mulai →" button pink full-width.

4. TOPIC LIST (horizontal scroll, peek-next):
   5 topic pill cards scrollable: icon + name + % + color dot

5. RECENT ACTIVITY (3 items vertical list):
   Each: colored dot + topic + time + XP badge

BOTTOM NAVIGATION (fixed, cream, border-top, 5 tabs):
- 🏠 Beranda (active, pink)
- 🗺️ Peta
- 📚 Belajar
- 🤖 Tutor
- 👤 Profil

Active tab: icon colored pink + label pink + small dot indicator above icon.

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
    @apply font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1;
    background: #f3ecfa;
    color: var(--color-violet);
  }
  .streak-pill {
    @apply font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1;
    background: #fde9df;
    color: var(--color-streak);
  }

  /* Topic status cards */
  .topic-card-mastered {
    @apply card;
    border-left: 4px solid var(--color-mastered);
  }
  .topic-card-progress {
    @apply card;
    border-left: 4px solid var(--color-progress);
  }
  .topic-card-weak {
    @apply card;
    border-left: 4px solid var(--color-weak);
  }
  .topic-card-locked {
    @apply card opacity-60;
    border-left: 4px solid var(--color-locked);
  }

  /* Stat card */
  .stat-card {
    @apply card flex flex-col items-start gap-2 p-5;
  }

  /* Section heading */
  .section-title {
    @apply text-xl font-bold mb-4;
    color: var(--color-ink);
    font-family: var(--font-display);
  }

  /* Feedback states */
  .feedback-correct {
    @apply rounded-[13px] p-4 border;
    background: var(--color-mastered-tint);
    border-color: var(--color-mastered-line);
    color: var(--color-mastered-ink);
  }
  .feedback-wrong {
    @apply rounded-[13px] p-4 border;
    background: var(--color-weak-tint);
    border-color: var(--color-weak-line);
    color: var(--color-weak-ink);
  }

  /* Chat bubbles */
  .bubble-user {
    @apply text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-xs ml-auto;
    background: var(--color-pink);
  }
  .bubble-spark {
    @apply rounded-2xl rounded-bl-sm px-4 py-3 max-w-sm;
    background: var(--color-surface);
    box-shadow: var(--shadow-card);
  }

  /* Mastery progress bar */
  .mastery-bar-track {
    @apply w-full rounded-full h-2;
    background: var(--color-line);
  }
  .mastery-bar-fill-mastered {
    @apply h-2 rounded-full transition-all duration-500;
    background: var(--color-mastered);
  }
  .mastery-bar-fill-progress {
    @apply h-2 rounded-full transition-all duration-500;
    background: var(--color-progress);
  }
  .mastery-bar-fill-weak {
    @apply h-2 rounded-full transition-all duration-500;
    background: var(--color-weak);
  }

  /* Floating XP animation */
  .xp-float {
    @apply font-bold text-lg pointer-events-none;
    color: var(--color-violet);
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

## 14. v0.dev Prompt — Dashboard Page (Production Code Generation)

> ⚠️ **SUPERSEDED 2026-10-14 (layout)**: Keputusan terbaru ada di `.kiro/steering/01-mvp-scope.md` §6 — hero gelap "Lanjut dari sini" + daftar `TopicRow` topik yang sudah dimulai + 1 baris ringkasan + top bar tunggal. **Bukan** sidebar + 4 stat card + achievements row seperti prompt §14.3 di bawah. Token warna/tipografi di §14.2 tetap berlaku. Jangan tempel §14.3 apa adanya ke v0.

> **Beda dengan §11 (Google Stitch)**: Stitch menghasilkan mockup visual statis, cocok untuk eksplorasi look & feel. **v0.dev menghasilkan kode React + Tailwind nyata** yang akan dipakai/di-adaptasi langsung di `src/page/dashboard/Index.tsx`. Prompt untuk v0 harus berupa **spesifikasi fungsional yang presisi** (token warna literal, struktur komponen, tipe data, copy exact), bukan deskripsi gambar.

### 14.1 Status Implementasi Saat Ini

Dicek langsung dari kode (bukan asumsi):

- `src/page/dashboard/Index.tsx` **masih placeholder** — hanya kartu "Ini Dashboard" + tombol Logout, memakai Tailwind `slate`/`red` default (belum pakai design tokens project).
- `src/page/auth/Auth.tsx` **sudah production-quality** dan jadi referensi gaya visual: pakai `lucide-react` untuk ikon (`Sparkles`, `Mail`, `LockKeyhole`, `Eye/EyeOff`, `UserRound`, `ArrowRight`), Supabase client dari `src/lib/supabaseClient`, dan hex literal langsung di JSX (`#160820`, `#ff4f87`, dst) — **bukan** CSS var `var(--color-*)` di level komponen (CSS var hanya didefinisikan di `src/index.css` untuk class `.btn-*`/`.card`/`.badge-*`).
- Routing aktual di `src/App.tsx` baru punya: `/` , `/auth`, `/dashboard`, `/topicSelect`. **Belum ada** route `/knowledge-map`, `/learning`, `/ai-tutor` — jadi prompt di bawah mendesain sidebar nav dengan 2 link aktif (Dashboard, Topik) + 2 placeholder (disabled, badge "Segera") agar kode yang di-generate v0 tidak patah saat ditempel.
- Tidak ada komponen `Spark` mascot (SVG/Lottie) yang sudah dibuat — prompt di bawah menggunakan ikon `Sparkles` dari lucide-react sebagai representasi Spark sementara (konsisten dengan Auth.tsx), bukan custom illustration yang perlu di-generate v0 (v0 tidak reliable untuk custom character art).

### 14.2 Design Tokens (literal, untuk ditempel ke prompt v0)

v0 tidak bisa membaca `src/index.css`, jadi semua token harus **hex literal** di dalam prompt itu sendiri:

```
Brand:
  ink:        #17111F
  muted:      #766B7F
  pink:       #FF4F87   (primary)
  pink-deep:  #E62F72   (primary hover)
  violet:     #6D36BD   (secondary / XP)
  cream:      #FFF7F2   (page background)
  surface:    #FFFFFF   (card background)
  line:       #EADFE4   (border/divider)

Mastery status (fungsional merah/kuning/hijau, hue dihangatkan):
  mastered:        #1E9E6B   tint #E3F6EC   ink #136B49   border #BFE8D3
  in-progress:     #E8A33D   tint #FDF1DE   ink #92591A   border #F3D9A6
  not-mastered:    #E2544B   tint #FBE6E4   ink #9C2E27   border #F2C0BC
  locked:          #AFA3AC   tint #F1EDEF   ink #766B7F   border #EADFE4

Gamification:
  xp:      #6D36BD (= violet)
  streak:  #F2763C (coral-orange)

Radius: cards/panels 14px, inputs/buttons 13px, pills 9999px
Shadow card:       0 4px 16px rgba(23,17,31,0.08)
Shadow card hover: 0 12px 28px rgba(23,17,31,0.14)
Shadow primary:    0 10px 24px rgba(255,79,135,0.28)
Font: headings "Plus Jakarta Sans" (letter-spacing -0.03em), body "Inter"
Icons: lucide-react only (no emoji in actual code — emoji only in copy text)
```

### 14.3 Full Prompt — Paste Langsung ke v0

```
Build a React 18 + TypeScript dashboard page component named `DashboardPage` for "SkillPath AI", an adaptive math learning platform for Indonesian middle-school students. Output a single page component plus small sub-components in the same file or adjacent files, using Tailwind CSS utility classes with literal hex values (no shadcn default theme, no CSS variables — use arbitrary value syntax like bg-[#FF4F87]) and `lucide-react` for all icons (no emoji inside JSX icons; emoji only allowed inside text strings).

DESIGN TOKENS (use these exact hex values):
- Background (page): #FFF7F2
- Card surface: #FFFFFF, radius 14px, shadow 0 4px 16px rgba(23,17,31,0.08), hover shadow 0 12px 28px rgba(23,17,31,0.14) with translateY(-2px)
- Primary (pink): #FF4F87, hover #E62F72, button shadow 0 10px 24px rgba(255,79,135,0.28)
- Secondary/XP (violet): #6D36BD
- Streak (coral): #F2763C
- Mastered (green): #1E9E6B, tint bg #E3F6EC, text #136B49, border #BFE8D3
- In-progress (amber): #E8A33D, tint bg #FDF1DE, text #92591A, border #F3D9A6
- Not-mastered (red): #E2544B, tint bg #FBE6E4, text #9C2E27, border #F2C0BC
- Locked (gray-violet): #AFA3AC, tint bg #F1EDEF, text #766B7F, border #EADFE4
- Border/divider: #EADFE4
- Text ink: #17111F, muted text: #766B7F
- Heading font: "Plus Jakarta Sans", body font: "Inter", both loaded via Google Fonts link in head (assume already loaded)

LAYOUT: Desktop-first (1280px container), fully responsive down to 375px mobile. Two-region layout: fixed left sidebar (256px) + scrollable main content. On mobile, sidebar collapses and is replaced by a fixed bottom tab bar with 5 icons.

=== SIDEBAR (desktop only, hidden below lg breakpoint) ===
- Width 256px, white background, right border 1px #EADFE4, full height, flex column, padding 24px.
- Top: logo row — a 36px rounded-xl gradient box (from #FF9AB8 to #FF4F87) containing a white `Sparkles` icon, next to bold text "SkillPath AI" (font-display).
- Nav list below, each item: icon (lucide-react) + label, full width, rounded-[13px], padding 12px 16px, flex row gap 12px:
  - "Dashboard" — icon `LayoutDashboard`, ACTIVE state: background #FFF0F5, text #E62F72, font-semibold, left border 3px solid #FF4F87
  - "Topik Belajar" — icon `BookOpen`, links to /topicSelect, default state: text #17111F, hover background #FFF0F5
  - "Peta Kemampuan" — icon `Map`, DISABLED/placeholder state: text #AFA3AC, cursor not-allowed, with a small pill badge "Segera" (bg #F1EDEF, text #766B7F, text-xs) aligned right
  - "AI Tutor" — icon `Bot`, same disabled/placeholder style as above with "Segera" badge
- Bottom of sidebar (mt-auto): divider line, then a row with a 40px circular avatar (initials placeholder "BS" on violet background #6D36BD text white), name "Budi Santoso" (font-semibold text-sm), and below it a small level pill "Level 7" (bg #F3ECFA text #6D36BD text-xs rounded-full px-2 py-0.5).

=== MOBILE BOTTOM NAV (hidden on lg and above, fixed bottom, visible below lg) ===
- White background, top border 1px #EADFE4, height 64px, 5 equal-width flex items, safe-area padding bottom.
- Icons: `LayoutDashboard` (active, color #FF4F87, small dot indicator above icon), `Map` (muted #AFA3AC), `BookOpen` (muted, links /topicSelect), `Bot` (muted), `UserRound` (muted).

=== MAIN CONTENT (padding 32px desktop, 16px mobile, max-width 1280px, mx-auto) ===

1. GREETING HEADER (flex row, justify-between, items-start, wrap on mobile):
   - Left: heading "Selamat pagi, Budi! 👋" (text-2xl md:text-3xl font-display font-bold text-[#17111F]), subtitle below "Kamu sudah belajar 3 hari berturut-turut 🔥" (text-sm text-[#766B7F] mt-1)
   - Right: two pills side by side, gap 8px: streak pill (bg #FDE9DF text #F2763C, `Flame` icon + "3", rounded-full px-3 py-1.5 text-sm font-semibold) and XP pill (bg #F3ECFA text #6D36BD, `Zap` icon + "1.240 XP", same shape)

2. STATS ROW — 4 equal cards in a `grid grid-cols-2 lg:grid-cols-4 gap-4` (mt-6):
   Each card: white bg, rounded-[14px], shadow (card shadow token), padding 20px, flex column gap 8px.
   - Card A "Overall Mastery": a circular SVG progress ring (size 64px, stroke 6px, track color #EADFE4, progress stroke #FF4F87, 68% filled) with "68%" centered in bold text-lg inside the ring; label below ring "Overall Mastery" text-xs text-[#766B7F]
   - Card B "XP Total": icon `Zap` in a 32px circle bg #F3ECFA text #6D36BD top-left; big number "1.240" text-2xl font-display font-bold text-[#6D36BD]; label "Total XP" text-xs text-[#766B7F]; thin progress bar below (bg #EADFE4 track, #6D36BD fill at 60%) with caption "Level 7 → 8"
   - Card C "Streak": icon `Flame` in 32px circle bg #FDE9DF text #F2763C; big number "3 Hari" text-2xl font-display font-bold text-[#F2763C]; 7 small dots row below representing last 7 days (filled dots #F2763C for active days, empty outline #EADFE4 for inactive)
   - Card D "Topik Dikuasai": icon `Trophy` in 32px circle bg #E3F6EC text #1E9E6B; big number "2/5" text-2xl font-display font-bold text-[#1E9E6B]; label "Topik Dikuasai" text-xs text-[#766B7F]

3. MAIN SPLIT — `grid grid-cols-1 lg:grid-cols-3 gap-6` (mt-6):
   LEFT (lg:col-span-2) — Recommendation card:
     - Section title "Rekomendasi Untukmu" (text-lg font-display font-bold mb-3)
     - Card: white bg, rounded-[14px], shadow-card, padding 24px, LEFT BORDER 4px solid #E8A33D (amber, since this topic is in-progress)
     - Inside: badge-progress pill "In Progress" top-left (bg #FDF1DE text #92591A border #F3D9A6, text-xs rounded-full px-3 py-1 border), topic name "Pecahan" (text-xl font-display font-bold mt-2), a small row with `Sparkles` icon (violet #6D36BD) + italic text "Nilaimu masih 45% — ayo kita tingkatkan! 💡" (text-sm text-[#766B7F])
     - Mastery bar: track bg #EADFE4 h-2 rounded-full, fill #E8A33D width 45% with transition
     - Row below bar: "45% dikuasai" (text-xs text-[#766B7F]) left, "~20 menit" with `Clock` icon right
     - Bottom: full-width button "Mulai Sekarang" with `ArrowRight` icon, bg #FF4F87 text white font-semibold rounded-[13px] py-3, shadow (primary shadow token), hover darkens to #E62F72 and lifts -1px

   RIGHT (lg:col-span-1) — stacked cards:
     - "Aktivitas Terakhir" card (white, rounded-[14px], shadow-card, padding 20px): title text-sm font-semibold mb-3, then 3 list rows each with a small colored dot (status color), topic name text-sm, time-ago text-xs text-[#766B7F], and a small "+15 XP" badge (bg #F3ECFA text #6D36BD text-xs rounded-full px-2 py-0.5) right-aligned
     - "Tip dari Spark" card below (bg #F3ECFA, rounded-[14px], padding 16px): `Sparkles` icon in violet circle 32px, text "Istirahat 5 menit setiap 25 menit belajar bisa bikin otakmu lebih fokus! 🧠" text-sm text-[#6D36BD]

4. KNOWLEDGE MAP PREVIEW (mt-8):
   - Header row: "Peta Kemampuanmu" title (text-lg font-display font-bold) left, "Lihat semua →" link (text-sm text-[#FF4F87] font-semibold, disabled/greyed with cursor-not-allowed since page not built yet) right
   - Horizontal scroll row on mobile (`flex gap-4 overflow-x-auto`), grid on desktop (`lg:grid lg:grid-cols-5 lg:gap-4`), 5 compact topic cards (min-width 160px each), each: colored left border (4px, matching status), icon (`Calculator`, `Divide`, `Hash`, `Equal`, `BarChart3` respectively) in a 36px tinted circle, topic name text-sm font-semibold truncated, status badge below (mastered/progress/not-mastered/locked styles from tokens), mastery percentage text-xs. The 5th card ("Statistika") is LOCKED: grayscale icon, `Lock` icon overlay, badge-locked style, percentage replaced with "Terkunci" text.

5. ACHIEVEMENTS ROW (mt-8, mb-8 to clear bottom nav on mobile):
   - Header "Pencapaian Terbaru" (text-lg font-display font-bold mb-3)
   - `flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4` of 4 achievement cards (white bg, rounded-[14px], shadow-card, padding 16px, text-center, min-width 140px):
     - 2 unlocked: colored circle icon (64px) top-center using `Trophy`/`Flame`/`Target`/`BookOpenCheck`, bold title below, small muted description
     - 2 locked: grayscale circle with `Lock` icon, 50% opacity, title still visible but description replaced with "???"

STATE HANDLING: Accept a typed prop `data: DashboardData` (define the TypeScript interface with fields: `studentName: string`, `streakDays: number`, `totalXp: number`, `level: number`, `overallMastery: number`, `topicsMastered: number`, `totalTopics: number`, `recommendedTopic: { name: string; mastery: number; estimatedMinutes: number; status: "weak"|"progress" }`, `recentActivity: { topic: string; timeAgo: string; xpGained: number }[]`, `knowledgeMapPreview: { name: string; status: "mastered"|"progress"|"weak"|"locked"; mastery: number }[]`, `achievements: { title: string; description: string; unlocked: boolean }[]`). Also handle an EMPTY/first-time state: if `overallMastery === 0` and no diagnostic completed, replace the recommendation card with a banner: "Mulai tes diagnostik untuk rekomendasi personal! →" (bg #FFF0F5 border #FF4F87, button "Mulai Tes Diagnostik").

ACCESSIBILITY: All icon-only buttons need aria-label. Focus states must show a 3px solid #FF4F87 outline with 3px offset. Minimum touch target 44x44px on mobile nav items. Color is never the only status indicator — always pair with text label or icon.

Do not invent a custom mascot illustration — use the `Sparkles` lucide icon wherever "Spark" the mascot is referenced in copy.
```

### 14.4 Prompt Granular (opsional, generate per komponen)

Jika hasil generate full-page kurang presisi, pecah jadi beberapa prompt v0 terpisah lalu compose manual — biasanya kualitas per-komponen lebih tinggi:

1. **`StatCard`** — "Build a reusable React + TS `StatCard` component: props `icon` (ReactNode), `iconBg` (string hex), `iconColor` (string hex), `label` (string), `value` (string), `valueColor` (string hex), optional `children` for extra content below (progress bar / dots / trend). White bg, rounded-14px, shadow `0 4px 16px rgba(23,17,31,0.08)`, padding 20px."
2. **`RecommendationCard`** — props sesuai `recommendedTopic` di atas + `onStart: () => void`. Left border 4px color-coded by `status`.
3. **`TopicMiniCard`** — props `name`, `icon`, `status` (`"mastered"|"progress"|"weak"|"locked"`), `mastery` (number). Styling per status pakai tabel token di §14.2.
4. **`AchievementCard`** — props `title`, `description`, `unlocked` (boolean), `icon`.
5. **`DashboardSidebar`** — props `activePath` (string), `userName`, `level`. Nav items hard-coded sesuai §14.3 (termasuk 2 item disabled dengan badge "Segera").

### 14.5 Setelah Generate — Integrasi ke Kode

- Hasil v0 akan pakai hex literal (`bg-[#FF4F87]`) — boleh dibiarkan, atau diselaraskan ke `var(--color-pink)` dkk di `src/index.css` agar satu sumber kebenaran (lihat §12 checklist "Semua warna menggunakan CSS variables").
- Ganti import ikon menjadi `lucide-react` (sudah jadi dependency karena dipakai di `Auth.tsx`).
- Mock `DashboardData` dulu dengan data statis, baru disambungkan ke `student_progress` + `student_answers` via service layer `src/lib/api/progress.ts` (lihat `skillpath-ai-supabase.md`) setelah BKT algorithm diimplementasikan.
- Sidebar nav "Peta Kemampuan" dan "AI Tutor" tetap **disabled** di kode sampai route-nya benar-benar dibuat di `App.tsx` — jangan link ke path yang belum ada (akan ter-redirect ke `/dashboard` oleh catch-all route saat ini).

---

_Dokumen ini adalah living document — update setiap kali ada keputusan desain baru._
_Last updated: 2026-10-13 — ditambahkan §14 v0.dev Prompt untuk Dashboard Page_
