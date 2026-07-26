# Kapan Perubahan di WordPress Muncul di Situs

Ada dua mekanisme yang berjalan bersamaan. Keduanya **tidak** butuh build ulang
— konten adalah satu-satunya hal yang berubah tanpa deploy.

| Mekanisme | Kecepatan | Perlu setup |
|---|---|---|
| Timer ISR (bawaan) | ~5 menit, dan baru setelah ada pengunjung | Tidak, sudah aktif |
| Webhook `/api/revalidate` | Beberapa detik | Ya, pasang mu-plugin di WP |

Webhook adalah jalur cepat; timer tetap ada sebagai jaring pengaman kalau
webhook gagal terkirim.

## Timer ISR — dan kenapa sering dikira rusak

Next **tidak** punya proses latar yang menyegarkan halaman sendiri. Regenerasi
dipicu oleh kunjungan, dengan pola *stale-while-revalidate*:

1. Lewat 5 menit, cache ditandai basi.
2. Pengunjung berikutnya **tetap menerima versi lama**, dan kunjungannya
   memicu regenerasi di latar belakang.
3. Pengunjung **setelahnya** baru menerima versi baru.

Jadi kalau Anda publish, tunggu 5 menit, refresh sekali dan tidak berubah — itu
normal. Refresh sekali lagi. Kalau halaman tidak pernah dikunjungi siapa pun,
tidak ada yang diperbarui.

## Webhook — update dalam hitungan detik

### Sisi front-end

Sudah ada di `app/api/revalidate/route.js`. Yang perlu Anda lakukan hanya
menyetel `REVALIDATE_SECRET`:

- di `.env.local` (agar ikut saat build), **dan**
- di Environment variables DirectAdmin (agar terbaca saat runtime).

Nilainya sudah dibuatkan di `.env.local`. Ini **kredensial asli** — jangan
dimasukkan ke `wrangler.jsonc` atau file lain yang ikut ter-commit.

Endpoint menolak request tanpa secret yang benar (401), dan menolak melayani
sama sekali kalau `REVALIDATE_SECRET` belum diset (503) — sengaja tidak
fail-open, karena kalau terbuka siapa pun bisa memaksa situs terus-menerus
menarik ulang data dari CMS.

### Sisi WordPress

1. Buka `docs/wp-revalidate-hook.php`, ubah dua konstanta di atas:
   - `SMKCBM_FRONTEND_URL` → `https://smkcbm.sch.id`
   - `SMKCBM_REVALIDATE_SECRET` → nilai `REVALIDATE_SECRET` yang sama persis
2. Upload ke `wp-content/mu-plugins/smkcbm-revalidate.php` (buat foldernya
   kalau belum ada).

`mu-plugins` = *must-use*: aktif otomatis, tidak muncul di daftar plugin yang
bisa dinonaktifkan tak sengaja, dan tidak hilang saat tema diganti.

### Yang memicu ping

| Aksi di wp-admin | Ping? |
|---|---|
| Draft → Published | ✅ |
| Edit post yang sudah published | ✅ |
| Published → Draft | ✅ |
| Buang ke sampah / hapus permanen | ✅ |
| Draft → Draft (simpan draft) | ❌ tidak terlihat pengunjung |
| Autosave / revisi | ❌ |

Purge-nya sengaja menyeluruh, bukan per-halaman. Menghitung halaman mana saja
yang terpengaruh sebuah post berarti menduplikasi aturan kategori di dua tempat,
dan kalau meleset gejalanya adalah konten basi yang terlihat seperti bug.
Memurnikan semuanya tidak mahal: `revalidateTag` hanya menandai cache basi,
setiap halaman baru dibangun ulang saat dikunjungi.

## Uji coba

```bash
# 1. Route sudah ter-deploy?
curl -s https://smkcbm.sch.id/api/revalidate
# -> {"ok":true,"message":"Revalidation endpoint is live. Use POST."}

# 2. Secret ditolak dengan benar?
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -H "X-Revalidate-Secret: salah" \
  https://smkcbm.sch.id/api/revalidate
# -> 401

# 3. Secret yang benar diterima?
curl -s -X POST \
  -H "X-Revalidate-Secret: <REVALIDATE_SECRET>" \
  https://smkcbm.sch.id/api/revalidate
# -> {"ok":true,"revalidated":true,...}
```

Kalau langkah 3 balas **503**, `REVALIDATE_SECRET` belum ter-set di environment
DirectAdmin (atau aplikasi belum di-restart setelah menambahkannya).

Setelah mu-plugin terpasang: publish satu post, lalu muat `/news`. Harus langsung
muncul. Kalau tidak, cek error log PHP di Hostinger — mu-plugin mencatat
kegagalan dengan awalan `[smkcbm-revalidate]`.

## Syarat yang mudah terlewat

- **`.next/cache` DAN `.next/server/app` harus writable** oleh user yang
  menjalankan Node. Ini terverifikasi dengan pengukuran: saat revalidasi
  berjalan, Next menimpa `.next/server/app/news.html` (mtime-nya berubah), bukan
  hanya menulis ke `.next/cache`. Jadi mengunci seluruh `.next` jadi read-only —
  yang sering disarankan panduan deploy demi keamanan — justru mematikan ISR.
  Kalau read-only, revalidasi gagal tanpa error yang terlihat dan konten membeku
  di snapshot build: persis gejala "sudah publish tapi tidak muncul".
- **`NODE_ENV=production`** harus ter-set, kalau tidak `server.js` menjalankan
  Next dalam mode dev dan build yang diupload diabaikan.
- Post yang dimasukkan ke kategori `program-keahlian` atau `cfa` **tidak** masuk
  feed berita — itu memang disengaja, bukan kegagalan revalidasi.
