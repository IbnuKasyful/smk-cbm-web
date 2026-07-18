# WordPress Back-end Setup (Headless CMS)

This front-end reads content from a standard WordPress install via the REST
API (`/wp-json`). WordPress runs "headless" — editors use `wp-admin`, but
visitors only ever see the Next.js site.

## 1. Plugins to install

| Plugin | Purpose |
|--------|---------|
| **Advanced Custom Fields (ACF)** | Structured fields for programs/events/facilities |
| **ACF to REST API** *(or ACF Pro 6.x native REST)* | Exposes `acf` fields in `/wp-json` |
| **Custom Post Type UI** | Register the CPTs below without code |
| **Contact Form 7** | Contact / PPDB enquiry form |
| **CF7 to REST API** | Lets the Next.js `/api/contact` route submit CF7 forms |
| **JWT Auth** *(optional)* | If you later need authenticated writes |

> Also enable pretty permalinks (Settings → Permalinks → Post name) so REST
> routes resolve.

## 2. Custom Post Types

Register these with CPT UI. All must have **"Show in REST API" = true** and a
REST base matching the slug below (the front-end expects these exact bases).

### `program` (Program Keahlian)
REST base: `program`. ACF fields:
- `short_name` (text) — short label, e.g. "Kefarmasian Klinis & Komunitas"
- `field` (text) — grouping, e.g. "Kesehatan", "Pariwisata"
- `description` (textarea)

### `event` (Kegiatan & Prestasi)
REST base: `event`. Supports Featured Image. ACF fields:
- `place` (text) — location label
- `year` (text)
- `size` (select: `md`, `lg`) — controls card height in the masonry grid

### `facility` (Fasilitas Unggulan)
REST base: `facility`. Supports Featured Image. ACF fields:
- `word` (text) — the giant watermark word, e.g. "Farmasi"
- `headline` (text) — feature title
- `description` (textarea)
- `tag` (text) — badge label, default "Fasilitas Unggulan"

### Posts (Berita)
Uses the built-in `post` type + categories. Set a Featured Image per article;
it flows in through `_embed`.

## 3. Field exposure check

Confirm data is visible (replace host):

```
https://cms.smkcbm.sch.id/wp-json/wp/v2/posts?_embed
https://cms.smkcbm.sch.id/wp-json/wp/v2/program
https://cms.smkcbm.sch.id/wp-json/wp/v2/event?_embed
https://cms.smkcbm.sch.id/wp-json/wp/v2/facility?_embed
```

Each `program`/`event`/`facility` item should include an `acf: { … }` object.
If `acf` is missing, install/enable "ACF to REST API".

## 4. Contact Form 7

Create a form in **Contact → Forms** with these field names (the `/api/contact`
route maps to them):

```
[text* your-name]
[email* your-email]
[tel your-phone]
[text your-subject]
[textarea* your-message]
```

Note the form's numeric ID (in the shortcode) and put it in `.env.local`:

```
WP_URL=https://cms.smkcbm.sch.id
CONTACT_FORM_PROVIDER=cf7
CF7_FORM_ID=123
```

CF7 REST endpoint used:
`/wp-json/contact-form-7/v1/contact-forms/{id}/feedback`

## 5. CORS / security

Because submissions and reads are proxied **server-side** by Next.js
(`lib/wordpress.js` and `app/api/contact`), the browser never calls WordPress
directly — so you don't need permissive CORS. Keep `wp-admin` behind auth and,
ideally, restrict REST write access.

## 6. Going live

1. Point `WP_URL` at the production CMS.
2. Add the CMS hostname to `remotePatterns` in `next.config.mjs` (for media).
3. Content edited in WordPress appears on the site within the ISR window
   (5 min, configurable via `REVALIDATE` in `lib/wordpress.js`), or instantly
   if you wire up on-demand revalidation.
