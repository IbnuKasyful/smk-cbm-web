# SMK CBM — Headless Website

Front-end for **SMK Citra Bangsa Mandiri Purwokerto**, redesigned in an
Oxford-inspired editorial style. Built with **Next.js 15 (App Router)** and
powered by a **headless WordPress** back-end for articles, programs, events,
and the contact form.

While WordPress isn't connected, the site renders from `lib/mock-data.js`, so
you can develop the UI immediately.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Architecture

```
Browser ──► Next.js (SSR/ISR)  ──►  WordPress REST API  (wp-json/…)
             │  lib/wordpress.js         posts, program, event, facility CPTs
             │  falls back to ──► lib/mock-data.js  (when WP_URL is unset)
             └─ /api/contact ──►  Contact Form 7 / WPForms  (form submission)
```

- **`lib/wordpress.js`** — all CMS reads. Tries WordPress first, falls back to
  mock data, so the front-end never breaks if the CMS is down or unconfigured.
- **`lib/mock-data.js`** — verified, factual placeholder content (name,
  address, phone, accreditation A, the six real program keahlian, socials).
  No fabricated statistics.
- **`app/api/contact/route.js`** — server-side form proxy to WordPress.

## Connecting WordPress

1. Copy env and fill in your CMS URL:
   ```bash
   cp .env.local.example .env.local
   # set WP_URL=https://cms.smkcbm.sch.id
   ```
2. Set up the CMS following **`WORDPRESS-SETUP.md`** (custom post types,
   ACF fields, Contact Form 7).
3. Restart `npm run dev`. Content now comes live from WordPress; remove or keep
   `lib/mock-data.js` as the safety fallback.

## Sections (mapped from the reference design)

| Reference block            | This site                          | Source          |
|----------------------------|------------------------------------|-----------------|
| Hero wordmark              | `Hero` — "SMK CBM" over building    | static          |
| Oxford at a Glance         | `AboutStats` — Akreditasi A, 6 prog | static (facts)  |
| Library feature            | `Facilities` — Lab Farmasi, dll     | WP `facility`   |
| Academic Programs          | `Programs` — 6 program keahlian     | WP `program`    |
| Legacy of Excellence       | `WhyChoose` — boarding, mitra       | static          |
| Lectures / Events          | `Events` — kegiatan & prestasi      | WP `event`      |
| Latest News                | `NewsSection` + `/news`             | WP `posts`      |
| Contact form               | `ContactForm` → `/api/contact`      | WP CF7          |

## Replacing placeholder images

Photo areas use CSS gradient placeholders (`.photo`). Drop real photos into
`public/images/` and swap the `.photo` divs for `<img>` / `next/image`, or set
featured images in WordPress (they flow in automatically via `_embed`).

## Notes

- Copy is in Bahasa Indonesia and uses only verified public facts.
- Fonts (Inter + Fraunces) load via `<link>` with a CSS fallback, so the
  project builds offline.
- Colors/tokens live in `tailwind.config.js` (`navy`, `gold`, `cream`).
