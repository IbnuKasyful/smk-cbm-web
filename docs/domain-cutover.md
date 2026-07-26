# Menghubungkan Front-end ke WordPress & Rencana Pindah Domain

## Situasi

| Apa | Di mana | Catatan |
|---|---|---|
| Front-end Next.js | `https://smkcbm.sch.id` (DirectAdmin) | Domain asli sudah dipakai front-end |
| WordPress (CMS produksi) | `https://beige-anteater-777428.hostingersite.com` | Domain sementara Hostinger |

Domain `smkcbm.sch.id` masih tertahan di registrar lama dan baru bisa diklaim
via Hostinger setelah expired. Sampai saat itu, CMS memakai domain sementara.

**Penting:** `smkcbm.sch.id` **bukan lagi** WordPress. Menyetel
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

## Checklist saat domain asli sudah bisa diklaim

Rencanakan agar CMS pindah ke **subdomain** (mis. `cms.smkcbm.sch.id`), bukan
apex — apex sudah dipakai front-end dan keduanya tidak bisa berbagi host yang sama.

1. Arahkan subdomain ke instalasi WordPress di Hostinger.
2. Di wp-admin → Settings → General, ubah *WordPress Address* dan *Site Address*.
3. Jalankan search-replace database untuk URL lama → baru. URL domain sementara
   tertanam di dalam body post dan di media library; tanpa langkah ini gambar
   akan tetap menunjuk host lama. (Hostinger hPanel punya tool ini, atau pakai
   plugin *Better Search Replace*.)
4. Ubah `WP_URL` di: `.env.local`, `wrangler.jsonc`, dan environment DirectAdmin.
5. `npm run build` ulang — host gambar di `next.config.mjs` ikut ter-bake saat
   build, jadi restart saja tidak cukup.
6. Upload + restart.
7. Verifikasi: `curl https://cms.smkcbm.sch.id/wp-json/wp/v2/posts?per_page=1`
   harus balas `200` dengan JSON, bukan HTML.

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
