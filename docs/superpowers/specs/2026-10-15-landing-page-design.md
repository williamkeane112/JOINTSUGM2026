# Landing Page — Desain

## Maksud

Meyakinkan mahasiswa/orang yang belajar mandiri untuk mulai memakai app. Rasa: efisien, menarik, tanpa ribet, jalur sesuai kemampuannya. Pesan inti: yang sudah kamu kuasai dilewati. Satu aksi utama: "Mulai belajar" -> `/auth` (Auth sudah guest-protected; user login otomatis ke dashboard). (Diputuskan user, 2026-10-15.)

## Tujuan / Bukan tujuan / Anti-tujuan

- **Tujuan**: halaman pendek; demo tontonan yang membuktikan adaptivitas dengan BKT sungguhan; responsif 360/768/1280; aksesibel.
- **Bukan tujuan**: demo interaktif (pengunjung menjawab) — ditunda; data Supabase; waitlist/pembayaran; Spark mascot custom.
- **Anti-tujuan**: testimoni/statistik pengguna palsu; angka harga; kicker/eyebrow di atas judul; satu kata beraksen di headline; gradient text; stok foto/ilustrasi gaya sketsa; animasi fade-up di setiap section; deretan kartu ikon+judul+teks berukuran sama.

## Batasan

- React 19 + TS strict + Tailwind v4 (token di `src/index.css`). Tidak ada dependensi baru (tanpa library animasi). Ikon: lucide-react.
- Nama brand masih placeholder: semua teks brand lewat satu konstanta `BRAND_NAME` di `src/lib/brand.ts`.
- Skala font dashboard: 12/14/16/20/24/48 + display hero `clamp(36px, 5vw, 60px)`. Tracking judul memakai sufiks `!` (aturan global h1-h4 -0.03em mengalahkan utilitas).
- Kontrol >= 44px di layar sentuh (`pointer-coarse:`), 36px desktop. Kontras teks >= 4.5:1.
- Urutan DOM = urutan visual.

## Dunia visual (keputusan saya, disetujui lewat diskusi)

- Meneruskan Auth/dashboard: latar cream `#FFF7F2`, teks ink `#17111F`, muted `#766B7F`, satu permukaan gelap night `#160820` (hero) dengan dekorasi orbit geometris dari Auth. Pink `#FF4F87` hanya untuk aksi/fokus/tautan. Violet `#6D36BD` hanya untuk data. Warna status (mastered `#1E9E6B`, progress `#E8A33D`, weak `#E2544B`) hanya untuk status skill.
- Font: Plus Jakarta Sans (judul), Inter (isi). Monospace hanya untuk potongan kode nyata di soal.
- Satu momen animasi: demo. Bagian lain statis.
- Cek pola AI: bukan cream+serif+terracotta (kita sans + pink); risiko "gelap + aksen neon" dibatasi dengan hanya hero yang gelap dan pink hanya di tombol.

## Susunan halaman (urutan)

1. **Navbar** (di dalam hero, teks terang): brand kiri; tautan jangkar "Cara kerja" (`#cara-kerja`), "Topik" (`#topik`), "Harga" (`#harga`), "FAQ" (`#faq`) di tengah (sembunyi < md); kanan "Masuk" (`/auth`) + tombol kecil "Mulai belajar".
2. **Hero** (night): headline "Yang sudah kamu kuasai, kami lewati." Sub: "Cek kemampuanmu di satu topik, lalu pelajari hanya bagian yang belum. Mulai dari Dasar Pemrograman." Tombol "Mulai belajar" (`/auth`) + tautan teks "Lihat cara kerjanya" (`#cara-kerja`). Kanan (bawah di mobile): `PathPreview` — kartu terang statis "Jalur Raka · Dasar Pemrograman" berisi 4 skill hasil akhir demo: Variabel & Kondisi dicoret dengan chip "Dilewati", Perulangan (langkah 1) & Fungsi (langkah 2).
3. **Demo** (`id=cara-kerja`, cream): judul "Lihat jalur Raka tersusun". Kiri: 3 langkah berurutan (penomoran sah karena memang berurutan): "Pilih topik", "Jawab beberapa soal", "Dapat jalur sendiri" — langkah aktif disorot. Kanan: panel tahap: kartu soal (kode + 4 pilihan, pilihan Raka ditandai benar/salah dengan ikon + kata, bukan warna saja), daftar 4 skill dengan bar penguasaan yang terisi sesuai hasil BKT, lalu jalur akhir. Main otomatis sekali saat 40% terlihat (IntersectionObserver), ~2 detik per frame. Tombol "Jeda/Lanjutkan" dan "Putar ulang" (WCAG 2.2.2). `prefers-reduced-motion`: langsung frame akhir. Ringkasan hasil akhir tersedia sebagai teks (sr-only) untuk pembaca layar; tidak memakai aria-live per frame.
4. **Topik** (`id=topik`): dikelompokkan per kategori sebagai daftar (bukan grid kartu sama): Pemrograman (Dasar Pemrograman — Tersedia; Struktur Data, Pemrograman Web — Segera hadir), Matematika SMP (Pecahan, Persamaan Linear — Segera hadir), SMA (Fisika Dasar — Segera hadir). Status lewat flag `available` di `catalog.ts` agar tim mudah mengubah saat seed nyata masuk.
5. **Harga** (`id=harga`): 2 paket. Gratis: semua topik yang tersedia, cek kemampuan tiap topik, jalur belajar yang menyesuaikan, AI Tutor dengan batas harian; tombol "Mulai belajar". Pro: chip "Segera hadir", TANPA angka harga dan tanpa tombol: AI Tutor tanpa batas, topik lanjutan, riwayat belajar lengkap.
6. **FAQ** (`id=faq`): native `<details>/<summary>`, 5 pertanyaan:
   - (a) "Apakah gratis?" — Ya, paket Gratis bisa dipakai sekarang; Pro segera hadir.
   - (b) "Topik apa saja yang ada?" — Mulai dari Dasar Pemrograman; katalog bertambah ke pemrograman lanjut, SMP, dan SMA. Topik baru dibuka setelah soalnya lengkap dan dicek.
   - (c) "Kalau aku sudah paham sebagian, harus mulai dari awal?" — Tidak. Ada cek kemampuan singkat di awal topik; skill yang sudah kamu kuasai dilewati.
   - (d) "Apa bedanya dengan bertanya ke ChatGPT?" — ChatGPT menjawab pertanyaanmu. {BRAND} mencatat apa yang sudah dan belum kamu kuasai dari setiap jawaban, lalu menyusun urutan belajarmu. AI membantu menjelaskan, bukan menentukan jalur.
   - (e) "Seberapa akurat cek kemampuan dari beberapa soal?" — Itu perkiraan awal. Makin banyak latihan, makin tepat, dan jalurmu disusun ulang.
7. **Penutup** (cream): satu kalimat "Mulai dari yang belum kamu kuasai." + tombol "Mulai belajar". Footer: brand, "© 2026", tautan Masuk, GitHub (https://github.com/williamkeane112/JOINTSUGM2026).

## Demo Raka (logika, dihitung, bukan dikarang)

- 4 skill Dasar Pemrograman, 1 soal per skill, contoh Python:
  1. Variabel: `x = 5` / `x = x + 2` / `print(x)`; pilihan 5, 7, 52, Error; benar 7; Raka 7 (benar).
  2. Kondisi: `nilai = 75` / `if nilai >= 70: print("Lulus")` / `else: print("Ulang")`; pilihan Lulus, Ulang, Lulus Ulang, Error; benar Lulus; Raka Lulus (benar).
  3. Perulangan: `for i in range(3):` / `    print(i)`; pilihan "0 1 2", "1 2 3", "0 1 2 3", "3"; benar "0 1 2"; Raka "1 2 3" (salah, miskonsepsi umum).
  4. Fungsi: `def dobel(n):` / `    return n * 2` / `print(dobel(4))`; pilihan 8, 4, 44, None; benar 8; Raka 4 (salah).
- Penguasaan per skill = `new BKTModel({ p_learned: DEMO_PRIOR }).update(isCorrect)` dengan `DEMO_PRIOR = 0.5` (diagnostic: belum ada bukti, netral). Hasil yang diharapkan (dibulatkan): benar -> 80, salah -> 21. Status via `getMasteryStatus`.
- Jalur: skill berstatus mastered -> "Dilewati"; sisanya diurutkan penguasaan naik, seri = urutan kurikulum. Hasil: Perulangan (1), Fungsi (2).
- Frame: 0 = topik dipilih; 1..4 = soal ke-n dijawab (bar skill ke-n terisi); 5 = jalur akhir.

## Diserahkan ke pembangun

Spacing detail, bentuk orbit hero, transisi antar-frame (opacity/transform 200-300ms ease-out), copy mikro yang tidak disebut di atas.

## Terbuka

Nama brand final; klaim "AI Tutor dengan batas harian" harus benar sebelum demo (AI Tutor belum dibangun); flag `available` katalog harus diperbarui saat seed nyata masuk.
