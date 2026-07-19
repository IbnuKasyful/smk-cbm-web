# WordPress Back-end (Headless CMS)

This front-end reads content from the existing WordPress install at
`https://smkcbm.sch.id` via the REST API (`/wp-json`). WordPress runs
"headless" — editors use `wp-admin`, visitors see the Next.js site.

> **This document describes the site as it actually is.** An earlier version of
> this file specified ACF plus `program` / `event` / `facility` custom post
> types. None of that exists on the live site, and the front-end no longer
> expects it. See "Deferred" at the bottom.

## 1. Connection

```
WP_URL=https://smkcbm.sch.id
```

That is the only variable required to pull content. The REST API is publicly
readable, so no authentication is needed for reads. Reads are proxied
server-side by `lib/wordpress.js`, so the browser never calls WordPress
directly and no CORS configuration is required.

Media hosts are already whitelisted in `next.config.mjs` (`smkcbm.sch.id` and
`**.smkcbm.sch.id`).

## 2. How each section is sourced

| Section | Source | Status |
|---|---|---|
| **News** (`/news`) | `/wp/v2/posts`, excluding the `Program Keahlian` category and the 2021 demo posts | **Live** |
| **Programs** (`/program/[slug]`) | `/wp/v2/posts` filtered to the `Program Keahlian` category (id `1`), merged onto structured fields in `lib/mock-data.js` | **Live** (5 of 6) |
| **CFA** (`/cfa`) | `cfa` custom post type | CPT exists but is **empty** → mock data |
| **Events** | none | mock data |
| **Facilities** | none | mock data |

### Why programs merge with mock data

A program page needs `field`, `short`, `competencies[]` and `careers[]`. With
no ACF plugin installed there is nowhere in WordPress to store them, so those
fields live in `lib/mock-data.js` while WordPress supplies the title, excerpt
and body prose. `PROGRAM_SLUG_TO_WP` in `lib/wordpress.js` maps our canonical
URL slug to the WordPress post slug — this keeps program URLs short and stable
even if a post is retitled in wp-admin.

`bisnis-digital` has no WordPress post yet and renders entirely from mock data.
To connect it, publish a post in the `Program Keahlian` category and add its
slug to `PROGRAM_SLUG_TO_WP`.

### Featured images

Most posts have no featured image, so `lib/wordpress.js` falls back to the
first `<img>` in the post body. **Setting a proper featured image in wp-admin
always produces a better crop** and is the recommended fix.

## 3. WordPress clean-up

### Done

1. **Six lorem-ipsum demo posts from 2021 moved to Trash** (`hello-world`,
   `massa-vitae-…`, `venenatis-urna-…`, `donec-adipiscing-…`,
   `turpis-tincidunt-…`, `vulputate-dignissim-…`). They are recoverable from
   wp-admin → Posts → Trash. The temporary `DEMO_SLUGS` denylist has been
   removed from `lib/wordpress.js` accordingly.
2. **Featured images set** on the three 2026 news posts, reusing the
   screenshots already embedded in each post body.
3. **The `/contact/` page has been de-demoed** — the fake address, emails,
   phone numbers, lorem text and "$29 per month" pricing block were replaced
   with the real school details.

   Note: this page is Elementor-built. Editing `_elementor_data` is not enough
   on its own — Elementor caches rendered HTML in the `_elementor_element_cache`
   post meta, which must be deleted before changes appear on the front end.

### Still outstanding

1. **The `cfa` CPT is empty** — the front-end shows mock CFA entries until it
   is populated.
2. **Empty layout blocks on `/contact/`.** The old pricing and newsletter
   sections were reworded rather than removed, because their Elementor widgets
   (`icon-list`, `button`, two `wpforms` widgets referencing forms 298/299 from
   the uninstalled WPForms plugin) can only be deleted in the Elementor editor.
   The wpforms widgets render nothing.
3. **Elementor assets still hotlink to `startersites.io`** — several background
   and content images on `/contact/` point at the demo theme's CDN rather than
   the school's own media library.

None of the outstanding items affect the headless front-end; they only affect
the legacy WordPress site while it remains publicly reachable.

## 4. Contact form

Contact Form 7 6.1.6 is active and exposes its REST endpoint natively:

```
/wp-json/contact-form-7/v1/contact-forms/{id}/feedback
```

The separate "CF7 to REST API" plugin is **not** needed on CF7 6.x.

However, **no CF7 form has been created yet**, so `CF7_FORM_ID` is blank and
`/api/contact` runs in accept-and-log mode: submissions are validated and
logged, the visitor gets a success response, but no email is sent. To go live:

1. wp-admin → Contact → Forms → add a form with exactly these field names:
   ```
   [text* your-name]
   [email* your-email]
   [tel your-phone]
   [text your-subject]
   [textarea* your-message]
   ```
2. Put its numeric ID in `.env.local` as `CF7_FORM_ID`.
3. Confirm the form's Mail tab points at a real school inbox.

## 5. Deferred: the CPT + ACF model

If the school later wants events, facilities, or richer program fields edited
in WordPress rather than in code, the path is: install ACF, register the CPTs
with the already-installed Custom Post Type UI (Show in REST = true), then
replace the merge logic in `lib/wordpress.js` with direct `acf.*` reads. That
is a deliberate future step, not a prerequisite — the site is fully functional
without it.

## 6. Cache / publishing latency

Responses are cached with ISR for 5 minutes (`REVALIDATE` in
`lib/wordpress.js`). Edits in wp-admin appear on the site within that window.
Transient `429/503` responses from the shared host are retried up to 3 times
with backoff, so a busy build doesn't silently fall back to mock content.
