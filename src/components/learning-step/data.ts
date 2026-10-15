import type { LessonSection, LessonStep } from "./types";

export const lessonSteps: LessonStep[] = [
  {
    id: "1",
    title: "Menyiapkan Lab Pengujian yang Aman dan Terisolasi",
    duration: "1 jam 30 menit",
    status: "current",
  },
  {
    id: "2",
    title: "Mengenali Ruang Lingkup dan Aturan Pengujian",
    duration: "1 jam",
    status: "locked",
  },
  {
    id: "3",
    title: "Pengujian Kontrol Akses",
    duration: "1 jam 15 menit",
    status: "locked",
  },
  {
    id: "4",
    title: "Menganalisis Temuan dengan Aman",
    duration: "1 jam",
    status: "locked",
  },
  {
    id: "5",
    title: "Menyusun Laporan Kerentanan",
    duration: "1 jam 15 menit",
    status: "locked",
  },
];

export const lessonSections: LessonSection[] = [
  {
    title: "Mengapa lab harus terisolasi?",
    paragraphs: [
      "Lab pengujian adalah lingkungan terkendali untuk mempelajari perilaku aplikasi dan menguji konfigurasi tanpa mengganggu sistem lain. Lingkungan yang terisolasi membantu membatasi dampak kesalahan selama latihan.",
      "Gunakan aplikasi yang memang disediakan untuk latihan, mesin virtual atau container lokal, serta data fiktif. Jangan menguji sistem publik atau milik pihak lain tanpa izin tertulis dan ruang lingkup yang jelas.",
    ],
    bullets: [
      "Pisahkan lab dari jaringan publik dan sistem produksi.",
      "Gunakan akun serta data khusus untuk latihan.",
      "Siapkan snapshot atau cara memulihkan lingkungan.",
    ],
  },
  {
    title: "Membangun lingkungan latihan",
    paragraphs: [
      "Mulailah dari lingkungan lokal yang sederhana. Pastikan aplikasi latihan berjalan hanya pada alamat dan port yang kamu tentukan, lalu periksa konfigurasi jaringan sebelum memulai aktivitas.",
      "Catat konfigurasi awal, batasan pengujian, dan prosedur penghentian. Dokumentasi ini memudahkan kamu mengulang latihan dengan hasil yang konsisten.",
    ],
    bullets: [
      "Catat aplikasi, versi, alamat lokal, dan port yang digunakan.",
      "Pastikan akses hanya tersedia untuk perangkat atau jaringan lab.",
      "Verifikasi bahwa data yang digunakan bukan data pribadi sungguhan.",
    ],
  },
  {
    title: "Checklist keamanan sebelum praktik",
    paragraphs: [
      "Sebelum menjalankan pengujian, lakukan pemeriksaan singkat untuk memastikan latihan tetap berada dalam batas yang aman dan diizinkan.",
    ],
    bullets: [
      "Target latihan telah ditentukan dan diizinkan.",
      "Lingkungan tidak mengekspos layanan ke internet.",
      "Data dan akun yang digunakan merupakan data fiktif.",
      "Tersedia prosedur untuk menghentikan dan mereset latihan.",
    ],
  },
];
