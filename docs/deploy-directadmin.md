# Deploy ke DirectAdmin — Langkah Detail

Setup yang diasumsikan: aplikasi Node berjalan lewat `server.js` (custom server
Next.js) di DirectAdmin, di-manage Node.js Selector / Passenger.

## Apakah `.next` harus di-upload ulang setiap build?

**Ya, wajib.** Ini bukan sekadar file statis — konten WordPress ikut tertanam
di dalamnya. Halaman memakai ISR (`revalidate: 300`), jadi setiap halaman
di-render saat build dan hasilnya disimpan sebagai HTML di
`.next/server/app/`. Contoh nyata dari build terakhir: `news.html` sudah berisi
judul post yang diambil dari WordPress.

Konsekuensinya: kalau `.next` tidak di-upload ulang, server tetap menyajikan
snapshot lama — termasuk konten mock, kalau `WP_URL` salah saat build itu dibuat.

Selain itu `BUILD_ID` berubah tiap build, dan nama file chunk di `.next/static`
di-hash dari isinya. HTML baru menunjuk chunk baru; kalau `static` tidak ikut
ter-update, browser dapat 404 dan halaman gagal hydrate.

### Tapi jangan upload seluruh folder `.next`

Ukurannya 420 MB, padahal yang dibutuhkan produksi hanya ~13 MB:

| Isi `.next` | Ukuran | Upload? | Alasan |
|---|---|---|---|
| `dev/` | 327 MB | ❌ | Sisa `next dev`. Tidak pernah dibaca di produksi |
| `cache/` | 84 MB | ❌ | Cache build lokal. Di server, folder ini dibuat sendiri dan harus mulai kosong |
| `server/` | 9,8 MB | ✅ | HTML prerender + kode server |
| `build/` | 0,8 MB | ✅ | |
| `static/` | 0,8 MB | ✅ | Chunk browser |
| `*.json` (manifest) | ~80 KB | ✅ | `BUILD_ID`, `prerender-manifest.json`, dll |
| `trace`, `trace-build` | 9 KB | ❌ | Telemetri build |

`.next/dev` hanya ada karena `next dev` pernah dijalankan di folder yang sama.

### Yang TIDAK perlu di-upload tiap kali

| Item | Kapan perlu diperbarui |
|---|---|
| `node_modules/` (~292 MB) | Hanya saat `package.json` / `package-lock.json` berubah |
| `public/` | Hanya saat asetnya berubah |
| `server.js`, `next.config.mjs` | Hanya saat file itu diubah |
| `.env.local` | Hanya saat env berubah (mis. domain CMS pindah) |

Jadi deploy rutin = **~4 MB zip**, bukan 300 MB.

## Prasyarat sekali saja

1. **Node 20.9+.** Next 16.2.10 menetapkan `engines.node >= 20.9.0`. Cek versi
   di Node.js Selector; kalau masih 18, app gagal start.
2. **Folder app jangan bisa diakses web.** Pastikan root aplikasi Node berada di
   luar `public_html`, atau Apache tidak menyajikannya sebagai file statis —
   kalau tidak, `.env.local` bisa diunduh siapa saja.
3. **`.next/cache` dan `.next/server/app` harus writable** oleh user yang
   menjalankan Node. Keduanya dipakai ISR: `cache` untuk hasil fetch, dan
   `server/app` untuk HTML yang di-render ulang — terverifikasi, mtime
   `news.html` berubah setiap kali revalidasi berjalan. Jangan mengunci `.next`
   jadi read-only: revalidasi akan gagal diam-diam dan konten membeku di
   snapshot build.

## Deploy pertama kali (full)

```powershell
# 1. Pastikan .env.local sudah benar (WP_URL menunjuk WordPress, BUKAN smkcbm.sch.id)
# 2. Build — konten WordPress ter-bake di langkah ini
npm run build

# 3. Paket bundle bersih -> .\deploy\ dan .\deploy.zip (~4 MB)
powershell -ExecutionPolicy Bypass -File .\scripts\package-deploy.ps1
```

Lalu:

4. Upload `deploy.zip` ke **root folder aplikasi** di DirectAdmin, extract di sana.

   ⚠️ **Jangan extract ke dalam folder `.next`.** `deploy.zip` bukan isi `.next`
   — di dalamnya sudah ada folder `.next` beserta saudara-saudaranya:

   ```
   deploy.zip
   ├── .next/          <- folder, bukan isinya
   ├── public/
   ├── server.js
   ├── package.json
   ├── package-lock.json
   ├── next.config.mjs
   └── .env.local
   ```

   Hasil akhir yang benar di server:

   ```
   /home/<user>/<app>/        <- extract di sini
   ├── .next/
   ├── node_modules/          <- dari `npm ci`, tidak ikut zip
   ├── public/
   ├── server.js
   └── ...
   ```

   Kalau di-extract ke dalam `.next`, hasilnya `.next/.next/...` dan Next tidak
   menemukan build sama sekali.

   Catatan: `.next` dan `.env.local` diawali titik. Sebagian klien FTP
   menyembunyikan file bertitik secara default — aktifkan "show hidden files"
   supaya Anda bisa memastikan keduanya benar-benar terupload.
5. Install dependency **di server** (jangan upload `node_modules` dari Windows —
   binary `@next/swc` bersifat per-platform, versi Windows tidak jalan di Linux):

   ```
   npm ci --omit=dev
   ```

   Di Node.js Selector ada tombol *Run NPM Install*; kalau pakai SSH, jalankan
   perintah di atas dari folder aplikasi.
6. Set environment variable di panel — **Environment variables**:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `WP_URL` | `https://beige-anteater-777428.hostingersite.com` |
   | `CONTACT_FORM_PROVIDER` | `cf7` |
   | `CF7_FORM_ID` | *(kosong sampai form dibuat)* |

   Menyetelnya di panel lebih andal daripada mengandalkan `.env.local`, karena
   Next hanya memuat `.env.local` otomatis lewat CLI-nya — `node server.js`
   biasa tidak melakukannya.
7. Set **Application startup file** = `server.js`.
8. Start aplikasi.

## Deploy rutin (setelah ubah kode atau ingin tarik konten WP terbaru)

```powershell
npm run build
powershell -ExecutionPolicy Bypass -File .\scripts\package-deploy.ps1
```

Di server:

1. **Stop** aplikasi Node dulu. Mengganti file saat app berjalan membuat sebagian
   request membaca build lama dan sebagian build baru.
2. **Hapus folder `.next` lama**, jangan ditimpa/merge. Merge meninggalkan HTML
   dari route yang sudah dihapus dan chunk yatim.
3. Upload + extract `deploy.zip`.
4. Kalau `package.json` tidak berubah, **lewati** `npm ci` — `node_modules` yang
   lama tetap dipakai.
5. **Start** aplikasi.

Restart wajib: proses Node menyimpan build di memori, file baru tidak terbaca
sampai proses di-start ulang.

## Verifikasi setelah deploy

```bash
# BUILD_ID di server harus sama dengan yang dicetak skrip paket
curl -s https://smkcbm.sch.id/news | grep -o 'Hello world' | head -1

# CMS masih terjangkau dari server (harus JSON, bukan HTML)
curl -s -o /dev/null -w "%{http_code}\n" \
  https://beige-anteater-777428.hostingersite.com/wp-json/wp/v2/posts?per_page=1
```

Kalau halaman berita menampilkan konten mock (nama-nama dari
`lib/mock-data.js`), berarti `WP_URL` salah **saat build**, bukan saat runtime —
perbaiki `.env.local`, build ulang, upload ulang.

## Catatan: `output: 'standalone'`

Next bisa menghasilkan bundle mandiri yang sudah memangkas `node_modules` hanya
ke yang benar-benar dipakai — biasanya memotong 292 MB dependency jadi puluhan
MB, dan menghilangkan kebutuhan `npm ci` di server. Konsekuensinya: Next membuat
`server.js` sendiri, jadi `server.js` custom yang ada sekarang tidak lagi
dipakai, dan `public/` serta `.next/static` harus disalin manual ke folder
standalone. Belum diaktifkan — pertimbangkan kalau upload `node_modules`
terasa berat.
