// Headless WordPress data layer.
//
// Every exported function tries the WordPress REST API first (when WP_URL is
// set) and transparently falls back to lib/mock-data.js otherwise, so the
// front-end renders fully whether or not the CMS is reachable.
//
// IMPORTANT — this layer is written against a stock WordPress install
// (Elementor + Blocksy), and is deliberately host-agnostic: nothing here names
// a domain. The CMS currently lives on a temporary Hostinger domain and will
// move to smkcbm.sch.id once that domain can be claimed, so the whole
// connection is driven by the single WP_URL env var. Categories are resolved
// by *slug*, never by numeric ID, because IDs are per-install and would break
// on the move. See docs/domain-cutover.md.
//
//   - News      -> default /wp/v2/posts, minus the "Program Keahlian"
//                  category (those are program descriptions, not news).
//   - Programs  -> the same /wp/v2/posts, filtered to the "Program Keahlian"
//                  category. WordPress supplies the prose; the structured
//                  editorial fields (competencies, careers, field grouping)
//                  live in mock-data.js and are merged in by slug, because
//                  the site has no ACF plugin to hold them.
//   - CFA       -> regular /wp/v2/posts filtered to the "CFA" category. Those
//                  posts are shown only on the CFA page and are excluded from
//                  the news feed. Falls back to mock data only if WP is
//                  unreachable; an empty category renders an empty state.
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

// Revalidate cached CMS responses every 5 minutes (ISR). This is the fallback
// path: /api/revalidate purges the cache immediately when WordPress pings it,
// and this timer covers the case where that webhook never arrives.
const REVALIDATE = 300;

// Cache tag applied to every CMS response, so a single revalidateTag(CMS_TAG)
// purges the Data Cache for all of them at once. Invalidating the route alone
// would not be enough: the page would re-render but still read the fetch it had
// already cached, and serve stale content.
export const CMS_TAG = 'wp';

// Slugs of the two special categories. Slugs are authored in wp-admin and can
// be carried across installs; numeric term IDs cannot, which is why they are
// looked up at request time instead of hardcoded.
//
//   - Program Keahlian -> program write-ups. Excluded from the news feed and
//     used as the source for the program pages.
//   - CFA -> Competition for Achievement announcements. Drive the CFA page and
//     are likewise kept out of the news feed.
//
// A slug that does not exist on the connected site resolves to null, which
// degrades gracefully (see resolveCategories below) rather than mis-filtering.
const PROGRAM_CATEGORY_SLUG = 'program-keahlian';
const CFA_CATEGORY_SLUG = 'cfa';

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
      const res = await fetch(url, { next: { revalidate, tags: [CMS_TAG] } });
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

// Resolves the two special category slugs to the term IDs this install uses.
// Missing slugs come back as null. Next dedupes and caches the underlying
// fetch, so calling this from several data functions costs one request per
// revalidation window, not one per call.
async function resolveCategories() {
  try {
    const data = await wpFetch('/wp/v2/categories', {
      params: {
        slug: `${PROGRAM_CATEGORY_SLUG},${CFA_CATEGORY_SLUG}`,
        per_page: '10',
        _fields: 'id,slug',
      },
    });
    const bySlug = new Map(data.map((c) => [c.slug, c.id]));
    return {
      program: bySlug.get(PROGRAM_CATEGORY_SLUG) ?? null,
      cfa: bySlug.get(CFA_CATEGORY_SLUG) ?? null,
    };
  } catch (err) {
    console.warn('[wordpress] category lookup failed:', err.message);
    return { program: null, cfa: null };
  }
}

// `categories_exclude` must be omitted entirely when neither category exists —
// passing an empty string makes WordPress reject the request.
function excludeParam({ program, cfa }) {
  const ids = [program, cfa].filter(Boolean);
  return ids.length ? { categories_exclude: ids.join(',') } : {};
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
    // Only an explicitly set featured image becomes the page hero — no falling
    // back to the first in-body photo, so an unset featured image shows none.
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
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
        ...excludeParam(await resolveCategories()),
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
        ...excludeParam(await resolveCategories()),
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
// Returns an empty index when the category does not exist on this install, so
// the programs fall back to their mock prose instead of pulling in every post.
async function fetchProgramPosts() {
  const { program } = await resolveCategories();
  if (!program) return new Map();
  const data = await wpFetch('/wp/v2/posts', {
    params: {
      per_page: '20',
      categories: String(program),
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

// The CFA page shows a single announcement: the latest post in the CFA
// category, rendered inline. CFA is a competition announcement (pengumuman
// lomba), not a portfolio of past results — any CFA-related news lives in the
// general news feed instead.
export async function getCfaPost() {
  if (!wpConfigured()) return CFA_ITEMS[0] ?? null;
  try {
    const { cfa } = await resolveCategories();
    // No CFA category on this install: render the empty state. Fetching
    // without the filter would surface an unrelated post as the announcement.
    if (!cfa) return null;
    const data = await wpFetch('/wp/v2/posts', {
      params: {
        per_page: '1',
        categories: String(cfa),
        _embed: '1',
      },
    });
    // An empty category yields null (the page renders an empty state), not
    // mock content.
    return data[0] ? normalizeCfaItem(data[0]) : null;
  } catch (err) {
    console.warn('[wordpress] getCfaPost fell back to mock data:', err.message);
    return CFA_ITEMS[0] ?? null;
  }
}

// Static content that lives in code (not editorial). Exposed here so pages
// import everything school-related from one module.
export { STATS, REASONS, SCHOOL, CFA };
