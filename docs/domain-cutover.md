# Menghubungkan Front-end ke WordPress & Rencana Pindah Domain

## Situasi

| Apa | Di mana | Catatan |
|---|---|---|
| Front-end Next.js | `https://smkcbm.sch.id` (Hostinger, Node.js) | Domain asli dipakai front-end |
| WordPress (CMS produksi) | `https://wp.smkcbm.sch.id` | Pindah dari domain sementara 2026-09-10 |

Cutover sudah dilakukan (lihat *Riwayat cutover* di bawah). Domain sementara
`beige-anteater-777428.hostingersite.com` masih menjadi alias vhost yang sama
sehingga URL lama tidak mati, tetapi seluruh URL yang **dihasilkan** WordPress
sekarang memakai `wp.smkcbm.sch.id`.

**Penting:** `smkcbm.sch.id` **bukan** WordPress. Menyetel
`WP_URL=https://smkcbm.sch.id` membuat semua request CMS mendapat 404 dan
seluruh situs diam-diam jatuh ke `lib/mock-data.js`.

## Bagaimana koneksinya bekerja

Front-end mengambil konten lewat REST API standar WordPress
(`/wp-json/wp/v2/...`) di `lib/wordpress.js`. Endpoint MCP
(`/wp-json/royal-mcp/v1/mcp`) **tidak** dipakai front-end — itu jalur terpisah
untuk agent/AI mengelola konten, dan butuh Bearer token.

Seluruh koneksi digerakkan satu variabel: **`WP_URL`**. Tidak ada nama domain
lain yang di-hardcode:

- `next.config.mjs` menurunkan host gambar dari `WP_URL`.
- `lib/wordpress.js` mencari kategori berdasarkan **slug**, bukan ID angka
  (ID term berbeda di tiap instalasi dan pasti pecah saat pindah).
- `app/api/contact/route.js` menembak CF7 di `WP_URL`.

## Prasyarat konten di WordPress

Buat dua kategori ini di wp-admin → Posts → Categories. Nama boleh apa saja,
**slug-nya yang harus persis**:

| Slug (wajib) | Fungsi |
|---|---|
| `program-keahlian` | Post program keahlian. Dikeluarkan dari feed berita, jadi sumber halaman `/program/*` |
| `cfa` | Pengumuman CFA. Dikeluarkan dari feed berita, jadi sumber halaman `/cfa` |

Post di luar dua kategori itu masuk feed berita `/news`.

Kalau slug belum ada, situs tidak error: program memakai prosa dari
`lib/mock-data.js` dan halaman CFA menampilkan empty state.

Untuk halaman `/program/*`, slug post WordPress harus cocok dengan peta
`PROGRAM_SLUG_TO_WP` di `lib/wordpress.js:59`.

## Deploy ke DirectAdmin

1. Set `WP_URL` di `.env.local` (lokal).
2. `npm run build` — **wajib sebelum upload**. Halaman memakai ISR
   (`revalidate: 300`), jadi konten WordPress ikut ter-bake saat build. Kalau
   `WP_URL` salah/kosong saat build, mock data yang masuk ke `.next`, dan itu
   tidak akan berubah walau env di server sudah benar.
3. Upload hasil build ke DirectAdmin.
4. Set `WP_URL` juga di server — dibutuhkan agar revalidasi 5 menit dan
   `/api/contact` menembak host yang benar:
   - **Node.js Selector**: menu app → *Environment variables* → tambah `WP_URL`.
   - **Jalan via `server.js` manual**: sertakan `.env.local` ke folder deploy,
     atau start dengan `WP_URL=https://... node server.js`.
5. **Restart aplikasi Node.** Env var hanya dibaca saat proses start.

## Riwayat cutover (2026-09-10, selesai)

CMS dipindah ke **subdomain** `wp.smkcbm.sch.id`, bukan apex — apex sudah dipakai
front-end dan keduanya tidak bisa berbagi vhost yang sama.

1. `wp.smkcbm.sch.id` ditempel ke vhost WordPress sebagai **parked/alias domain**
   (`hosting_createWebsiteParkedDomainV1`), bukan subdomain baru. Ini penting:
   WordPress-nya adalah vhost *main* dari paket hosting dan berada di direktori
   `domains/beige-anteater-777428.hostingersite.com/public_html`, jadi tidak ada
   file yang perlu dipindahkan sama sekali. Membuat subdomain sungguhan justru
   akan mengarah ke `domains/smkcbm.sch.id/public_html/wp` yang kosong.
2. Hostinger otomatis membuat record DNS `wp` (ALIAS →
   `wp.smkcbm.sch.id.cdn.hstgr.net`) dan menerbitkan sertifikat Let's Encrypt.
   Sertifikatnya butuh beberapa menit; sebelum terbit, HTTPS gagal di TLS
   handshake sementara HTTP sudah `200` — itu bukan tanda konfigurasi salah.
3. Ubah `siteurl` + `home` dan jalankan search-replace database untuk URL lama →
   baru. URL domain sementara tertanam di body post, `guid`, postmeta, dan
   options; tanpa langkah ini gambar tetap menunjuk host lama.
4. Ubah `WP_URL` di `.env.local` dan `wrangler.jsonc`.
5. `npm run build` ulang — `next.config.mjs` mem-*bake* `WP_URL` (host gambar dan
   `env:`) saat build, jadi restart saja tidak cukup.
6. Deploy + `hosting_clearWebsiteCacheV1`.
7. Verifikasi: `curl https://wp.smkcbm.sch.id/wp-json/wp/v2/posts?per_page=1`
   harus balas `200` dengan JSON yang `link`-nya sudah domain baru.

### Jebakan pada langkah 3

Field *WordPress Address* / *Site Address* di wp-admin → Settings → General
tampil **readonly**, dan Royal MCP menolak `siteurl` (`Option is permanently
denylisted`). Readonly itu **kunci UI dari Hostinger**, bukan tanda
`WP_SITEURL`/`WP_HOME` ada di `wp-config.php` — di instalasi ini kedua konstanta
itu tidak didefinisikan, sehingga menulis langsung ke tabel `options` berhasil.
Periksa konstantanya dulu sebelum menyimpulkan `wp-config.php` perlu diedit.

Search-replace harus sadar-serialisasi: `str_replace` pada blob serialized
merusak prefiks panjangnya. Pakai `maybe_unserialize` → ganti rekursif →
`maybe_serialize`, atau plugin *Better Search Replace*.

Entri `smkcbm.sch.id` di `remotePatterns` (`next.config.mjs`) sengaja
dipertahankan supaya media yang masih menunjuk host lama tetap tampil selama
masa transisi.

## Yang masih terbuka

- **Contact Form 7**: form `1810` ada di situs lama, tidak ada di instalasi
  baru. `CF7_FORM_ID` sengaja dikosongkan — `/api/contact` menerima dan mencatat
  submission (mode demo) sampai form dibuat. Langkah pembuatan form ada di
  `docs/contact-form-7.md`.
- **Migrasi konten**: instalasi Hostinger baru berisi 1 post bawaan
  (`Hello world!`). Konten dari situs lama perlu dipindahkan.
- **Events & Facilities**: belum punya sumber WordPress, masih dari
  `lib/mock-data.js`.
