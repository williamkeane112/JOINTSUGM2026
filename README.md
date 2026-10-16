# SkillPath AI — Supabase Migration Guide

Panduan mengelola migration Supabase menggunakan Supabase CLI, termasuk memeriksa status migration, menghapus catatan migration dari database remote, dan menyinkronkan migration lokal dengan database online.

## 1. Persyaratan

Pastikan sudah tersedia:

- Node.js dan npm
- Git
- Proyek Supabase yang aktif
- Folder `supabase/` di root proyek
- Akses ke proyek Supabase dan kredensial yang diperluka

## 2. Inisialisai Awal
- jalankan git clone
```bash
git clone link repo
```
lalu npm install
```bash
npm install
```

## 3. Instalasi Supabase CLI

Jika Supabase CLI belum tersedia di proyek, jalankan:

```bash
npm install -D supabase
```

Periksa instalasi:

```bash
npx supabase --version
```

## 4. Login ke Supabase

Login menggunakan akun Supabase:

```bash
npx supabase login
```

Jika folder konfigurasi Supabase belum tersedia, inisialisasikan:

```bash
npx supabase init
```

Jangan menjalankan `init` jika proyek sudah memiliki konfigurasi `supabase/config.toml`.

## 5. Hubungkan Proyek Supabase

Hubungkan proyek lokal ke database Supabase online:

```bash
npx supabase link --project-ref PROJECT_REF
```
Ganti `PROJECT_REF` dengan project reference dari Supabase Dashboard.

Untuk mencari project ref perlu membuat supabase terlebih dahulu lalu pergi ke **Project Settings -> general**
<img width="979" height="655" alt="image" src="https://github.com/user-attachments/assets/0621c70e-ecef-4c4e-80f3-6fa8c45eac6b" />
disana akan terlihat **Project ID** dan bisa di copy

## 6. Periksa Migration

Tampilkan daftar migration lokal dan remote:

```bash
npx supabase migration list
```

Pastikan timestamp pada nama file sesuai dengan riwayat migration yang tercatat di database remote.

## 7. Menjalankan Migration ke Database Online

Sebelum menerapkan perubahan, simulasikan terlebih dahulu:

```bash
npx supabase db push --dry-run
```

Jika perubahan yang akan diterapkan sudah benar, jalankan:

```bash
npx supabase db push
```

**Catatan:** Dokumentasi ini mencatat prosedur pengelolaan riwayat migration untuk SkillPath AI. Keberhasilan sinkronisasi tetap harus diverifikasi menggunakan `npx supabase migration list` dan pemeriksaan database.
