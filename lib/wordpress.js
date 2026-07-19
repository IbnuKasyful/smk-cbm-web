// Headless WordPress data layer.
//
// Every exported function tries the WordPress REST API first (when WP_URL is
// set) and transparently falls back to lib/mock-data.js otherwise, so the
// front-end renders fully whether or not the CMS is live yet.
//
// WordPress side expected shape (see WORDPRESS-SETUP.md):
//   - Posts:    default /wp/v2/posts (with _embed for featured image + terms)
//   - Programs: custom post type "program"  -> /wp/v2/program
//   - Events:   custom post type "event"    -> /wp/v2/event
//   - Facilities: custom post type "facility" -> /wp/v2/facility
// ACF fields are read from the `acf` object when the ACF-to-REST option is on.

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

function wpConfigured() {
  return Boolean(WP_URL);
}

async function wpFetch(path, { params = {}, revalidate = REVALIDATE } = {}) {
  const url = new URL(`${WP_URL}/wp-json${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`WP ${res.status} for ${url.pathname}`);
  }
  return res.json();
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// --- Normalizers: map raw WP objects to the shape our components consume ---

function normalizePost(p) {
  const media = p._embedded?.['wp:featuredmedia']?.[0];
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
    image: media?.source_url ?? null,
  };
}

function normalizeProgram(p) {
  const acf = p.acf ?? {};
  const asList = (v) =>
    Array.isArray(v)
      ? v
      : typeof v === 'string'
        ? v.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];
  return {
    id: p.id,
    slug: p.slug,
    name: stripHtml(p.title?.rendered ?? ''),
    short: acf.short_name ?? stripHtml(p.title?.rendered ?? ''),
    field: acf.field ?? '',
    description: acf.description ?? stripHtml(p.excerpt?.rendered ?? ''),
    overview:
      acf.overview ??
      stripHtml(p.content?.rendered ?? '') ??
      acf.description ??
      '',
    competencies: asList(acf.competencies),
    careers: asList(acf.careers),
  };
}

function normalizeEvent(p) {
  const acf = p.acf ?? {};
  const media = p._embedded?.['wp:featuredmedia']?.[0];
  return {
    id: p.id,
    title: stripHtml(p.title?.rendered ?? ''),
    place: acf.place ?? '',
    year: acf.year ?? new Date(p.date).getFullYear().toString(),
    youtubeId: acf.youtube_id ?? null,
    image: media?.source_url ?? null,
  };
}

function normalizeFacility(p) {
  const acf = p.acf ?? {};
  return {
    id: p.id,
    word: acf.word ?? stripHtml(p.title?.rendered ?? ''),
    title: acf.headline ?? stripHtml(p.title?.rendered ?? ''),
    description: acf.description ?? stripHtml(p.excerpt?.rendered ?? ''),
    tag: acf.tag ?? 'Fasilitas Unggulan',
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
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
      params: { per_page: String(limit), _embed: '1' },
    });
    return data.map(normalizePost);
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
    return data[0] ? normalizePost(data[0]) : null;
  } catch (err) {
    console.warn('[wordpress] getPost fell back to mock data:', err.message);
    return POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllPostSlugs() {
  if (!wpConfigured()) return POSTS.map((p) => p.slug);
  try {
    const data = await wpFetch('/wp/v2/posts', {
      params: { per_page: '100', _fields: 'slug' },
    });
    return data.map((p) => p.slug);
  } catch {
    return POSTS.map((p) => p.slug);
  }
}

export async function getPrograms() {
  if (!wpConfigured()) return PROGRAMS;
  try {
    const data = await wpFetch('/wp/v2/program', {
      params: { per_page: '20' },
    });
    return data.map(normalizeProgram);
  } catch (err) {
    console.warn('[wordpress] getPrograms fell back to mock data:', err.message);
    return PROGRAMS;
  }
}

export async function getProgram(slug) {
  if (!wpConfigured()) return PROGRAMS.find((p) => p.slug === slug) ?? null;
  try {
    const data = await wpFetch('/wp/v2/program', {
      params: { slug, _embed: '1' },
    });
    return data[0] ? normalizeProgram(data[0]) : null;
  } catch (err) {
    console.warn('[wordpress] getProgram fell back to mock data:', err.message);
    return PROGRAMS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAllProgramSlugs() {
  if (!wpConfigured()) return PROGRAMS.map((p) => p.slug);
  try {
    const data = await wpFetch('/wp/v2/program', {
      params: { per_page: '100', _fields: 'slug' },
    });
    return data.map((p) => p.slug);
  } catch {
    return PROGRAMS.map((p) => p.slug);
  }
}

export async function getEvents() {
  if (!wpConfigured()) return EVENTS;
  try {
    const data = await wpFetch('/wp/v2/event', {
      params: { per_page: '20', _embed: '1' },
    });
    return data.map(normalizeEvent);
  } catch (err) {
    console.warn('[wordpress] getEvents fell back to mock data:', err.message);
    return EVENTS;
  }
}

export async function getFacilities() {
  if (!wpConfigured()) return FACILITIES;
  try {
    const data = await wpFetch('/wp/v2/facility', {
      params: { per_page: '20', _embed: '1' },
    });
    return data.map(normalizeFacility);
  } catch (err) {
    console.warn('[wordpress] getFacilities fell back to mock data:', err.message);
    return FACILITIES;
  }
}

export async function getCfaItems() {
  if (!wpConfigured()) return CFA_ITEMS;
  try {
    const data = await wpFetch('/wp/v2/cfa', {
      params: { per_page: '100', _embed: '1' },
    });
    return data.map(normalizeCfaItem);
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
    return data[0] ? normalizeCfaItem(data[0]) : null;
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
    return data.map((i) => i.slug);
  } catch {
    return CFA_ITEMS.map((i) => i.slug);
  }
}

// Static content that lives in code (not editorial). Exposed here so pages
// import everything school-related from one module.
export { STATS, REASONS, SCHOOL, CFA };
