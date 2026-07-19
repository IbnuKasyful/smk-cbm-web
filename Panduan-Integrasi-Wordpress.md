# Panduan Integrasi Front-end dengan Back-end WordPress (Headless CMS)

Website SMK CBM (Front-end Next.js) ini dirancang untuk dapat terhubung dengan WordPress (sebagai sistem CMS Back-end) secara *"Headless"* melalui REST API. 

Berikut adalah penjelasan dan langkah-langkah yang diperlukan agar semua fungsi (seperti Berita, Program Keahlian, Fasilitas, Kegiatan, dsb) dapat berjalan dengan baik dan tersinkronisasi otomatis.

---

## 1. Konfigurasi Environment Variable di Next.js
Agar front-end tahu di mana letak instalasi WordPress Anda, Anda perlu menambahkan URL WordPress di file `.env.local` pada project Next.js Anda.

Buat atau edit file `.env.local` di folder *root* project:
```env
WP_URL=https://cms.website-anda.com
```
*Sistem di `lib/wordpress.js` akan mendeteksi apabila `WP_URL` sudah ada, maka website akan mengambil data langsung dari WordPress. Jika belum disetel, website akan menggunakan data buatan (`mock-data.js`).*

---

## 2. Persiapan Plugin di WordPress
Instal dan aktifkan plugin-plugin berikut di wp-admin WordPress Anda:

1. **Advanced Custom Fields (ACF)** (atau ACF Pro) — Untuk membuat field tambahan seperti deskripsi program, lokasi kegiatan, dll.
2. **ACF to REST API** — Agar data-data custom fields bisa terbaca dan dikirim lewat `/wp-json`.
3. **Custom Post Type UI (CPT UI)** — Untuk membuat jenis pos baru (Program, Fasilitas, Kegiatan) secara mudah.
4. **Contact Form 7 (Opsional)** — Jika Anda ingin form kontak di website tersambung dengan CMS.
5. **CF7 to REST API (Opsional)** — Agar form dari Next.js bisa di-*submit* masuk ke Contact Form 7 via REST API.

> **PENTING:** Masuk ke menu **Settings → Permalinks** di WordPress dan pastikan opsi yang dipilih adalah **Post name**. Jika tidak, REST API tidak akan berfungsi.

---

## 3. Pembuatan Custom Post Types (CPT)
Website ini mengambil data spesifik di luar "Berita" biasa. Buat CPT baru menggunakan plugin **CPT UI**. 
Pastikan setiap CPT yang dibuat memiliki pengaturan **"Show in REST API"** diatur ke **`True`**, dan kolom **"REST API base slug"** disamakan persis dengan "Slug Post Type" di bawah ini:

### A. Program Keahlian
- **Slug Post Type (REST Base):** `program`
- **Gunakan untuk:** Mengelola data kompetensi/jurusan sekolah.

### B. Kegiatan & Prestasi
- **Slug Post Type (REST Base):** `event`
- **Gunakan untuk:** Mendokumentasikan kegiatan atau kalender acara.
- **Dukungan (Supports):** Wajib centang *Featured Image* (Gambar Andalan).

### C. Fasilitas 
- **Slug Post Type (REST Base):** `facility`
- **Gunakan untuk:** Mengelola foto dan galeri fasilitas sekolah.
- **Dukungan (Supports):** Wajib centang *Featured Image* (Gambar Andalan).

### D. Citra Fashion Academy (CFA)
- **Slug Post Type (REST Base):** `cfa`
- **Gunakan untuk:** Menampilkan galeri CFA.
- **Dukungan (Supports):** Wajib centang *Featured Image* dan dukung kategori (Categories taxonomy).

### E. Berita / Artikel
- **Menggunakan bawaan WordPress (Posts).** 
- Pastikan menyematkan *Featured Image* dan mengatur kategori untuk setiap artikel.

---

## 4. Pengaturan Kolom Kustom (ACF Fields)
Gunakan plugin **ACF** untuk membuat Field Groups dan menempelkannya (assign) pada Custom Post Types di atas. **Pastikan "Show in REST API" aktif di pengaturan ACF Group.**

### Field Group untuk "Program" (`program`)
Buat field dengan "Field Name" (nama variabel/slug) yang sama persis seperti ini:
- `short_name` (Tipe: Text) — Nama singkatan jurusan, misal "Klinis & Komunitas".
- `field` (Tipe: Text) — Kelompok keahlian, misal "Kesehatan".
- `description` (Tipe: Text Area) — Ringkasan singkat program.
- `overview` (Tipe: Text Area / WYSIWYG) — Penjelasan detail/mendetail.
- `competencies` (Tipe: Text Area) — Daftar keahlian spesifik (1 baris per poin).
- `careers` (Tipe: Text Area) — Daftar prospek kerja (1 baris per poin).

### Field Group untuk "Kegiatan" (`event`)
- `place` (Tipe: Text) — Tempat pelaksanaan (contoh: "Aula Sekolah").
- `year` (Tipe: Text) — Tahun kegiatan (contoh: "2026").
- `youtube_id` (Tipe: Text) — ID video Youtube jika ada (Opsional, contoh `dQw4w9WgXcQ`).

### Field Group untuk "Fasilitas" (`facility`)
- `word` (Tipe: Text) — Teks tebal / watermark besar visual (contoh: "Laboratorium").
- `headline` (Tipe: Text) — Judul utama (contoh: "Lab Komputer Lengkap").
- `description` (Tipe: Text Area) — Deskripsi dari fasilitas.
- `tag` (Tipe: Text) — Label lencana, defaultnya misal "Fasilitas Unggulan".

---

## 5. Mendaftarkan Domain WordPress pada Next.js
Karena Next.js me-*render* gambar dengan optimasi yang sangat ketat melalui `<Image />`, Anda harus memberitahu Next.js bahwa domain WordPress Anda aman dan diizinkan. 

Buka file `next.config.mjs` di project Front-end Anda, dan tambahkan hostname URL WordPress Anda:
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.website-anda.com', // Ubah dengan nama domain wp Anda
      },
      // hostname lain bila ada ...
    ],
  },
};
export default nextConfig;
```

---

## Kesimpulan Siklus Kerja:
1. Pastikan `WP_URL` di Front-end sudah diatur.
2. Buat berita, program, kegiatan, atau fasilitas melalui admin WordPress (`/wp-admin`). 
3. Front-end (Next.js) akan otomatis meminta data via `https://cms.website-anda.com/wp-json/...`. 
4. Perubahan akan tersinkronisasi di Front-end secara otomatis paling lambat dalam **5 menit** (karena website diatur menggunakan mode ISR dengan *revalidate* setiap 300 detik di dalam file `lib/wordpress.js`).
