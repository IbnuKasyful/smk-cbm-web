# Template Contact Form 7 — SMK CBM

Form ini harus memakai **nama field persis seperti di bawah**, karena
`app/api/contact/route.js` mengirim payload dengan key `your-name`,
`your-email`, `your-phone`, `your-subject`, `your-message`.
Kalau nama field diubah di wp-admin, submit dari website akan gagal dengan
`validation_failed`.

Setelah form dibuat, salin **ID form** (angka di shortcode
`[contact-form-7 id="1810" ...]`) ke env `CF7_FORM_ID`.

Catatan penting:

- Hanya `your-name`, `your-email`, dan `your-message` yang wajib (`*`).
  `your-phone` dan `your-subject` **tidak boleh** wajib — front-end
  mengizinkan keduanya kosong, dan CF7 akan menolak submission kalau field
  wajib dikirim kosong.
- Jangan menambah field wajib baru (mis. `[acceptance]`, CAPTCHA, atau
  `[quiz]`) tanpa ikut memperbarui route API — field itu tidak akan pernah
  terisi oleh request dari server Next.js.

---

## Tab "Form"

```
<div class="cbm-row">
  <p class="cbm-field">
    <label for="cbm-name">Nama Lengkap <span class="cbm-req">*</span></label>
    [text* your-name id:cbm-name autocomplete:name placeholder "Nama depan dan nama belakang"]
  </p>

  <p class="cbm-field">
    <label for="cbm-email">Email <span class="cbm-req">*</span></label>
    [email* your-email id:cbm-email autocomplete:email placeholder "nama@email.com"]
  </p>
</div>

<div class="cbm-row">
  <p class="cbm-field">
    <label for="cbm-phone">Nomor Telepon</label>
    [tel your-phone id:cbm-phone autocomplete:tel placeholder "+62 8xx xxxx xxxx"]
  </p>

  <p class="cbm-field">
    <label for="cbm-subject">Subjek</label>
    [text your-subject id:cbm-subject placeholder "Contoh: Informasi PPDB 2026"]
  </p>
</div>

<p class="cbm-field">
  <label for="cbm-message">Pesan <span class="cbm-req">*</span></label>
  [textarea* your-message id:cbm-message rows:5 placeholder "Tulis pesan Anda..."]
</p>

<p class="cbm-submit">
  [submit class:cbm-btn "Kirim Pesan"]
</p>
```

## Tab "Mail"

**To**

```
info@smkcbm.sch.id
```

**From**

```
SMK Citra Bangsa Mandiri <wordpress@smkcbm.sch.id>
```

> Gunakan domain sendiri di alamat `From` agar tidak ditolak SPF/DKIM.
> Nama pengirim asli tetap terbaca lewat `Reply-To`.

**Subject**

```
[Website] [your-subject] — dari [your-name]
```

**Additional headers**

```
Reply-To: [your-email]
```

**Message body**

```
Pesan baru dari formulir website smkcbm.sch.id

Nama     : [your-name]
Email    : [your-email]
Telepon  : [your-phone]
Subjek   : [your-subject]

Pesan:
[your-message]

--
Dikirim dari [_site_title] ([_site_url])
Waktu: [_date] [_time]
IP pengirim: [_remote_ip]
```

Biarkan **"Use HTML content type"** tidak dicentang (body di atas plain text).

### Mail (2) — auto-reply ke pengirim (opsional)

Centang **"Mail (2)"** lalu isi:

- **To**: `[your-email]`
- **From**: `SMK Citra Bangsa Mandiri <info@smkcbm.sch.id>`
- **Subject**: `Terima kasih telah menghubungi SMK Citra Bangsa Mandiri`
- **Additional headers**: `Reply-To: info@smkcbm.sch.id`
- **Message body**:

```
Halo [your-name],

Terima kasih telah menghubungi SMK Citra Bangsa Mandiri.
Pesan Anda sudah kami terima dan tim kami akan menghubungi Anda kembali
pada jam kerja (Senin–Sabtu, 07.00–15.00 WIB).

Ringkasan pesan Anda:
Subjek : [your-subject]
Pesan  : [your-message]

Salam,
SMK Citra Bangsa Mandiri
Telp. (0281) 7771967 — info@smkcbm.sch.id
```

## Tab "Messages"

Pesan bawaan CF7 sudah cukup; ganti tiga yang paling sering muncul agar
berbahasa Indonesia:

| Kondisi | Teks |
| --- | --- |
| Sender's message was sent successfully | Terima kasih! Pesan Anda telah terkirim. |
| Sender's message failed to send | Maaf, terjadi kesalahan. Pesan gagal terkirim. |
| There is a field that the sender must fill in | Mohon lengkapi kolom ini. |
| Sender doesn't enter the correct email address | Format alamat email tidak valid. |

## Tab "Additional Settings"

Kosongkan. Jangan aktifkan `skip_mail: on` — website mengandalkan CF7
mengirim email sungguhan (route API hanya meneruskan, tidak menyimpan apa pun).

---

## CSS opsional (Appearance → Customize → Additional CSS)

Hanya diperlukan kalau form ini juga ditampilkan di halaman WordPress.
Kalau form hanya dipakai sebagai endpoint untuk website Next.js, CSS ini
boleh dilewati.

```css
.cbm-row { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
@media (max-width: 640px) { .cbm-row { grid-template-columns: 1fr; } }
.cbm-field label { display: block; margin-bottom: .4rem; font-size: .8rem; font-weight: 600; color: #0f1e3d; }
.cbm-req { color: #b91c1c; }
.cbm-field input, .cbm-field textarea {
  width: 100%; padding: .75rem 1rem; font-size: .875rem;
  border: 1px solid rgba(15,30,61,.15); border-radius: .75rem; background: #fff;
}
.cbm-field input:focus, .cbm-field textarea:focus {
  outline: none; border-color: #1b2f5c; box-shadow: 0 0 0 3px rgba(27,47,92,.1);
}
.cbm-field textarea { resize: none; }
.cbm-btn {
  padding: .8rem 1.6rem; border: 0; border-radius: 999px; cursor: pointer;
  background: #0f1e3d; color: #fff; font-weight: 700; font-size: .875rem;
}
.cbm-btn:hover { background: #1b2f5c; }
```

---

## Verifikasi setelah form dibuat

1. Simpan form, salin ID-nya ke `CF7_FORM_ID` (dan pastikan `WP_URL` +
   `CONTACT_FORM_PROVIDER=cf7` sudah terisi).
2. Uji langsung ke endpoint REST CF7 (ganti `1810` dengan ID form Anda):

```bash
curl -X POST "https://smkcbm.sch.id/wp-json/contact-form-7/v1/contact-forms/1810/feedback" \
  -H "User-Agent: Mozilla/5.0" \
  -F "_wpcf7=1810" \
  -F "_wpcf7_unit_tag=wpcf7-f1810-o1" \
  -F "your-name=Uji Coba" \
  -F "your-email=test@example.com" \
  -F "your-phone=" \
  -F "your-subject=Tes" \
  -F "your-message=Pesan uji coba"
```

Respons yang diharapkan: `{"status":"mail_sent", ...}`.
Kalau muncul `validation_failed`, cek `invalid_fields` pada respons — biasanya
ada field yang keliru ditandai wajib. Kalau muncul `spam`, header `User-Agent`
belum terkirim.
