// Headless WordPress data layer.
//
// Every exported function tries the WordPress REST API first (when WP_URL is
// set) and transparently falls back to lib/mock-data.js otherwise, so the
// front-end renders fully whether or not the CMS is reachable.
//
// IMPORTANT — this layer is written against the *actual* schema of
// smkcbm.sch.id, which is a stock WordPress install (Elementor + Blocksy):
//
//   - News      -> default /wp/v2/posts, minus the "Program Keahlian"
//                  category (those are program descriptions, not news).
//   - Programs  -> the same /wp/v2/posts, filtered to the "Program Keahlian"
//                  category. WordPress supplies the prose; the structured
//                  editorial fields (competencies, careers, field grouping)
//                  live in mock-data.js and are merged in by slug, because
//                  the site has no ACF plugin to hold them.
//   - CFA       -> the `cfa` custom post type exists but is currently empty,
//                  so it falls back to mock data until it is populated.
//   - Events /
//     Facilities-> no WordPress source exists yet. These stay on mock data.
//
// There are deliberately NO `acf.*` reads here: ACF is not installed on this
// site, so any such field would always be undefined.

import {
  POSTS,
  PROGRAMS,
  EVENTS,
  FACILITIES,
  CFA,
  CFA_ITEMS,
  STATS,
  REASONS,
  SCHOOL,
} from './mock-data';

const WP_URL = process.env.WP_URL?.replace(/\/$/, '');

// Revalidate cached CMS responses every 5 minutes (ISR).
const REVALIDATE = 300;

// Category holding the program-keahlian write-ups. These are excluded from the
// news feed and used as the source for the program pages.
const PROGRAM_CATEGORY_ID = 1; // "Program Keahlian"

// Maps our canonical program slug (used in the site's URLs) to the slug of the
// WordPress post that holds its prose. Keeping our own slugs keeps the program
// URLs short and stable even if the posts are retitled in wp-admin.
// `bisnis-digital` has no WordPress post yet, so it renders from mock data.
const PROGRAM_SLUG_TO_WP = {
  'keperawatan-caregiving': 'layanan-penunjang-keperawatan-dan-caregiving',
  'laboratorium-medik': 'program-keahlian-analis-kesehatan',
  kefarmasian:
    'konsentrasi-keahlian-layanan-penunjang-kefarmasian-klinis-dan-komunitas',
  perhotelan: 'program-keahlian-perhotelan-dan-pariwisata',
  kuliner: 'program-keahlian-kuliner',
};

function wpConfigured() {
  return Boolean(WP_URL);
}

// Transient statuses worth retrying: shared hosting returns 503/429 when a
// production build fires many requests in parallel. Without a retry the
// fallback below would silently bake mock content into a static page.
const RETRY_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wpFetch(path, { params = {}, revalidate = REVALIDATE } = {}) {
  const url = new URL(`${WP_URL}/wp-json${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (res.ok) return res.json();
      lastError = new Error(`WP ${res.status} for ${url.pathname}`);
      if (!RETRY_STATUS.has(res.status)) throw lastError;
    } catch (err) {
      lastError = err;
    }
    if (attempt < MAX_ATTEMPTS) {
      await sleep(400 * 2 ** (attempt - 1)); // 400ms, 800ms
    }
  }
  throw lastError;
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Most posts on this site have no featured image, but the editors do embed
// images in the body. Fall back to the first one so news cards aren't blank.
function firstContentImage(html = '') {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function featuredImage(p) {
  return (
    p._embedded?.['wp:featuredmedia']?.[0]?.source_url ??
    firstContentImage(p.content?.rendered ?? '') ??
    null
  );
}

// --- Normalizers: map raw WP objects to the shape our components consume ---

function normalizePost(p) {
  const terms = p._embedded?.['wp:term']?.flat() || [];
  return {
    id: p.id,
    slug: p.slug,
    title: stripHtml(p.title?.rendered ?? ''),
    excerpt: stripHtml(p.excerpt?.rendered ?? ''),
    content: p.content?.rendered ?? '',
    date: p.date,
    category: terms.find((t) => t.taxonomy === 'category')?.name ?? 'Berita',
    author: p._embedded?.author?.[0]?.name ?? 'Humas SMK CBM',
    image: featuredImage(p),
  };
}

// Merges a WordPress post onto the structured program metadata in mock-data.
// The mock entry is the base (it holds competencies/careers/field, which have
// nowhere to live in WordPress without ACF); WordPress wins for the prose.
function mergeProgram(base, wpPost) {
  if (!wpPost) return base;
  const overview = stripHtml(wpPost.content?.rendered ?? '');
  const excerpt = stripHtml(wpPost.excerpt?.rendered ?? '');
  return {
    ...base,
    wpId: wpPost.id,
    name: stripHtml(wpPost.title?.rendered ?? '') || base.name,
    description: excerpt || base.description,
    overview: overview || base.overview,
    content: wpPost.content?.rendered ?? '',
    image: featuredImage(wpPost),
  };
}

function normalizeCfaItem(p) {
  const terms = p._embedded?.['wp:term']?.flat() || [];
  return {
    id: p.id,
    slug: p.slug,
    title: stripHtml(p.title?.rendered ?? ''),
    category: terms.find((t) => t.taxonomy === 'category')?.name ?? 'CFA',
    author: p._embedded?.author?.[0]?.name ?? 'Panitia CFA',
    date: p.date,
    image: featuredImage(p) ?? '',
    tags: terms.filter((t) => t.taxonomy === 'post_tag').map((t) => t.name),
    excerpt: stripHtml(p.excerpt?.rendered ?? ''),
    content: p.content?.rendered ?? '',
  };
}

// --- Public API ------------------------------------------------------------

export async function getPosts({ limit = 3 } = {}) {
  if (!wpConfigured()) return POSTS.slice(0, limit);
  try {
    const data = await wpFetch('/wp/v2/posts', {
      params: {
        per_page: String(Math.min(limit, 100)),
        categories_exclude: String(PROGRAM_CATEGORY_ID),
        _embed: '1',
      },
    });
    const posts = data.map(normalizePost);
    return posts.length ? posts : POSTS.slice(0, limit);
  } catch (err) {
    console.warn('[wordpress] getPosts fell back to mock data:', err.message);
    return POSTS.slice(0, limit);
  }
}

export async function getPost(slug) {
  if (!wpConfigured()) return POSTS.find((p) => p.slug === slug) ?? null;
  try {
    const data = await wpFetch('/wp/v2/posts', {
      params: { slug, _embed: '1' },
    });
    if (data[0]) return normalizePost(data[0]);
    return POSTS.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.warn('[wordpress] getPost fell back to mock data:', err.message);
    return POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPostSlugs() {
  if (!wpConfigured()) return POSTS.map((p) => p.slug);
  try {
    const data = await wpFetch('/wp/v2/posts', {
      params: {
        per_page: '100',
        categories_exclude: String(PROGRAM_CATEGORY_ID),
        _fields: 'slug',
      },
    });
    const slugs = data.map((p) => p.slug);
    return slugs.length ? slugs : POSTS.map((p) => p.slug);
  } catch {
    return POSTS.map((p) => p.slug);
  }
}

// Fetches the program-category posts once and indexes them by WP slug.
async function fetchProgramPosts() {
  const data = await wpFetch('/wp/v2/posts', {
    params: {
      per_page: '20',
      categories: String(PROGRAM_CATEGORY_ID),
      _embed: '1',
    },
  });
  return new Map(data.map((p) => [p.slug, p]));
}

export async function getPrograms() {
  if (!wpConfigured()) return PROGRAMS;
  try {
    const byWpSlug = await fetchProgramPosts();
    return PROGRAMS.map((base) =>
      mergeProgram(base, byWpSlug.get(PROGRAM_SLUG_TO_WP[base.slug]))
    );
  } catch (err) {
    console.warn('[wordpress] getPrograms fell back to mock data:', err.message);
    return PROGRAMS;
  }
}

export async function getProgram(slug) {
  const base = PROGRAMS.find((p) => p.slug === slug) ?? null;
  if (!base || !wpConfigured()) return base;
  const wpSlug = PROGRAM_SLUG_TO_WP[slug];
  if (!wpSlug) return base; // no WordPress counterpart (e.g. bisnis-digital)
  try {
    const data = await wpFetch('/wp/v2/posts', {
      params: { slug: wpSlug, _embed: '1' },
    });
    return mergeProgram(base, data[0]);
  } catch (err) {
    console.warn('[wordpress] getProgram fell back to mock data:', err.message);
    return base;
  }
}

// Program routes are defined by the front-end, not the CMS: every program has
// a mock entry, and only some have a WordPress post behind them.
export async function getAllProgramSlugs() {
  return PROGRAMS.map((p) => p.slug);
}

// No WordPress source for these yet — see the note at the top of this file.
export async function getEvents() {
  return EVENTS;
}

export async function getFacilities() {
  return FACILITIES;
}

export async function getCfaItems() {
  if (!wpConfigured()) return CFA_ITEMS;
  try {
    const data = await wpFetch('/wp/v2/cfa', {
      params: { per_page: '100', _embed: '1' },
    });
    // The CPT exists but is empty today; keep the section populated until it
    // has real entries.
    return data.length ? data.map(normalizeCfaItem) : CFA_ITEMS;
  } catch (err) {
    console.warn('[wordpress] getCfaItems fell back to mock data:', err.message);
    return CFA_ITEMS;
  }
}

export async function getCfaItem(slug) {
  if (!wpConfigured()) return CFA_ITEMS.find((i) => i.slug === slug) ?? null;
  try {
    const data = await wpFetch('/wp/v2/cfa', {
      params: { slug, _embed: '1' },
    });
    if (data[0]) return normalizeCfaItem(data[0]);
    return CFA_ITEMS.find((i) => i.slug === slug) ?? null;
  } catch (err) {
    console.warn('[wordpress] getCfaItem fell back to mock data:', err.message);
    return CFA_ITEMS.find((i) => i.slug === slug) ?? null;
  }
}

export async function getAllCfaSlugs() {
  if (!wpConfigured()) return CFA_ITEMS.map((i) => i.slug);
  try {
    const data = await wpFetch('/wp/v2/cfa', {
      params: { per_page: '100', _fields: 'slug' },
    });
    return data.length ? data.map((i) => i.slug) : CFA_ITEMS.map((i) => i.slug);
  } catch {
    return CFA_ITEMS.map((i) => i.slug);
  }
}

// Static content that lives in code (not editorial). Exposed here so pages
// import everything school-related from one module.
export { STATS, REASONS, SCHOOL, CFA };
