# Panduan Integrasi Front-end dengan Back-end WordPress (Headless CMS)

Website SMK CBM (front-end Next.js) terhubung dengan WordPress di
`https://smkcbm.sch.id` secara *headless* melalui REST API.

> **Catatan:** Versi sebelumnya dari dokumen ini menginstruksikan pemasangan
> plugin ACF dan pembuatan custom post type `program`, `event`, dan `facility`.
> Rencana itu **tidak jadi dipakai** — semuanya tidak ada di situs yang
> sebenarnya, dan front-end sudah disesuaikan dengan struktur WordPress yang
> ada sekarang. Lihat bagian 6 untuk rencana lanjutannya.
>
> Dokumen ini adalah ringkasan berbahasa Indonesia. Rujukan teknis yang lebih
> lengkap ada di `WORDPRESS-SETUP.md`.

---

## 1. Konfigurasi Environment Variable

Buat file `.env.local` di folder *root* project:

```env
WP_URL=https://smkcbm.sch.id
CONTACT_FORM_PROVIDER=cf7
CF7_FORM_ID=
```

`lib/wordpress.js` akan mendeteksi `WP_URL`. Jika belum disetel, website
menggunakan data contoh dari `mock-data.js`.

REST API WordPress bisa dibaca publik, jadi **tidak perlu autentikasi** untuk
menampilkan konten. Semua permintaan dilakukan dari sisi server Next.js,
sehingga tidak perlu pengaturan CORS.

---

## 2. Plugin yang Dipakai

Tidak ada plugin baru yang perlu dipasang. Yang relevan dan sudah aktif:

| Plugin | Kegunaan |
|---|---|
| **Contact Form 7** | Form kontak (lihat bagian 4) |
| **Custom Post Type UI** | Sudah terpasang; dipakai bila nanti butuh CPT baru |
| **Elementor / Blocksy** | Tampilan situs WordPress lama |

> **PENTING:** Di **Settings → Permalinks**, pastikan pilihannya **Post name**,
> agar REST API berfungsi.

Plugin **ACF**, **ACF to REST API**, dan **CF7 to REST API** **tidak
diperlukan**. Contact Form 7 versi 6.x sudah menyediakan endpoint REST sendiri.

---

## 3. Sumber Data Tiap Bagian

| Bagian Website | Sumber Data | Status |
|---|---|---|
| **Berita** (`/news`) | `/wp/v2/posts`, kategori `Program Keahlian` dikecualikan | **Aktif** |
| **Program Keahlian** | `/wp/v2/posts` kategori `Program Keahlian` (ID `1`) | **Aktif** (5 dari 6) |
| **CFA** | CPT `cfa` | CPT ada tapi **masih kosong** → data contoh |
| **Kegiatan / Fasilitas** | belum ada | data contoh |

### Kenapa Program digabung dengan data contoh?

Halaman program membutuhkan `field`, `short`, `competencies`, dan `careers`.
Karena ACF tidak dipasang, data terstruktur itu disimpan di `lib/mock-data.js`,
sedangkan **judul, ringkasan, dan isi artikel diambil dari WordPress**.

Pemetaan slug ada di `PROGRAM_SLUG_TO_WP` dalam `lib/wordpress.js`. Ini menjaga
URL program tetap pendek dan stabil walaupun judul postingan diubah di wp-admin.

Program `bisnis-digital` belum punya postingan di WordPress. Untuk
menghubungkannya: buat postingan di kategori `Program Keahlian`, lalu tambahkan
slug-nya ke `PROGRAM_SLUG_TO_WP`.

### Menambah berita baru

Cukup buat postingan biasa di wp-admin. Jangan gunakan kategori
`Program Keahlian` untuk berita, karena kategori itu khusus halaman program.

**Sangat disarankan mengisi *Featured Image*.** Bila kosong, sistem akan
memakai gambar pertama di dalam isi artikel sebagai cadangan, tetapi hasil
potongannya tidak seoptimal *Featured Image*.

---

## 4. Form Kontak

Contact Form 7 sudah aktif dan menyediakan endpoint:

```
/wp-json/contact-form-7/v1/contact-forms/{id}/feedback
```

**Namun belum ada form yang dibuat**, sehingga `CF7_FORM_ID` masih kosong.
Selama kosong, `/api/contact` berjalan dalam mode terima-dan-catat: pesan
divalidasi dan dicatat di log, pengunjung mendapat notifikasi berhasil, tetapi
**email belum terkirim**.

Untuk mengaktifkan:

1. wp-admin → **Contact → Forms** → buat form dengan nama field persis:
   ```
   [text* your-name]
   [email* your-email]
   [tel your-phone]
   [text your-subject]
   [textarea* your-message]
   ```
2. Salin ID angkanya ke `CF7_FORM_ID` di `.env.local`.
3. Pastikan tab **Mail** mengarah ke email sekolah yang aktif.

---

## 5. Domain Gambar di Next.js

Sudah dikonfigurasi di `next.config.mjs` (`smkcbm.sch.id` dan
`**.smkcbm.sch.id`), jadi tidak perlu diubah.

---

## 6. Rencana Lanjutan (Opsional)

Bila nanti sekolah ingin mengelola **Kegiatan**, **Fasilitas**, atau field
program secara mandiri lewat WordPress:

1. Pasang plugin **ACF**.
2. Daftarkan CPT `event` dan `facility` lewat **CPT UI** (aktifkan
   *Show in REST API*).
3. Ganti logika penggabungan di `lib/wordpress.js` dengan pembacaan `acf.*`.

Ini adalah langkah lanjutan, **bukan syarat** — website sudah berfungsi penuh
tanpanya.

---

## Siklus Kerja

1. Tulis berita atau ubah artikel program di `/wp-admin`.
2. Front-end mengambil data via `https://smkcbm.sch.id/wp-json/...`.
3. Perubahan muncul di website paling lambat **5 menit** (mode ISR,
   `REVALIDATE` = 300 detik di `lib/wordpress.js`).
