import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { getAllPosts } from '@/lib/wordpress';

export const metadata = {
  title: 'Semua Berita',
  description:
    'Arsip lengkap berita, artikel, dan kegiatan SMK Citra Bangsa Mandiri Purwokerto.',
};

// A 3-column grid reads best in whole rows.
const PER_PAGE = 9;

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// Fallback image tile: shows the post's featured image when present, otherwise
// the branded `.photo` gradient placeholder (same pattern as NewsSection).
function Thumb({ post, className = '', imgClass = '' }) {
  return (
    <div className={`photo ${className}`}>
      {post?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${imgClass}`}
        />
      )}
    </div>
  );
}

// Category names are authored in WordPress and can carry spaces, accents, or
// slashes, so they are slugified before going into `?kategori=` and matched
// back through the same function.
function toSlug(name = '') {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Filter and pagination both live in the URL rather than in component state:
// every view of the archive is linkable, shareable, and crawlable, and the
// whole page stays a server component.
export default async function NewsArchive({ searchParams }) {
  const { kategori = '', halaman = '1' } = await searchParams;
  const posts = await getAllPosts();

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  // An unknown ?kategori= falls back to showing everything instead of an
  // empty grid.
  const activeCategory = categories.find((c) => toSlug(c) === kategori) ?? null;
  const activeSlug = activeCategory ? toSlug(activeCategory) : '';

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(
    Math.max(Number.parseInt(halaman, 10) || 1, 1),
    totalPages
  );
  const start = (page - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  // Page 1 and the "Semua" category are the defaults, so they are left out of
  // the query string to keep the canonical URL clean. The hash returns the
  // reader to the grid instead of the top of the page.
  function hrefFor({ nextPage = 1, nextCategory = activeSlug } = {}) {
    const params = new URLSearchParams();
    if (nextCategory) params.set('kategori', nextCategory);
    if (nextPage > 1) params.set('halaman', String(nextPage));
    const query = params.toString();
    return `/news/arsip${query ? `?${query}` : ''}#daftar`;
  }

  // At most five numbered pages around the current one; the arrows cover the
  // rest so the control never wraps on mobile.
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => windowStart + i
  );

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* ---------------- Page head ---------------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold-200/50 via-cream to-cream"
          />
          <div className="wrap relative py-14 sm:py-16">
            <Link
              href="/news"
              className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
            >
              ← Kembali ke Berita
            </Link>
            <p className="eyebrow mb-4 mt-8">Arsip</p>
            <h1 className="font-display text-4xl font-black leading-[1.02] text-navy-900 sm:text-5xl">
              Semua berita &amp; artikel
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-700/70">
              Seluruh kabar dari SMK CBM dalam satu daftar. Saring berdasarkan
              kategori untuk menemukan cerita yang Anda cari.
            </p>
          </div>
        </section>

        {/* ---------------- Filter + grid ---------------- */}
        <section id="daftar" className="wrap scroll-mt-24 pb-16">
          <div className="no-scrollbar mb-8 flex gap-8 overflow-x-auto border-b border-navy-900/10 pb-6 text-sm">
            {[null, ...categories].map((cat) => {
              const slug = cat ? toSlug(cat) : '';
              const isActive = slug === activeSlug;
              return (
                <Link
                  key={slug || 'semua'}
                  href={hrefFor({ nextCategory: slug })}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap font-medium transition-colors ${
                    isActive
                      ? 'text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-8'
                      : 'text-navy-700/50 hover:text-navy-700'
                  }`}
                >
                  {cat ?? 'Semua'}
                </Link>
              );
            })}
          </div>

          {filtered.length > 0 ? (
            <>
              <p className="mb-8 text-xs text-navy-700/50">
                Menampilkan {start + 1}–{start + visible.length} dari{' '}
                {filtered.length} artikel
                {activeCategory ? ` di kategori ${activeCategory}` : ''}
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 3) * 90}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5 transition-shadow hover:shadow-lg"
                    >
                      <Thumb
                        post={post}
                        className="aspect-[16/10]"
                        imgClass="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="flex flex-1 flex-col p-6">
                        <p className="eyebrow mb-2">{post.category}</p>
                        <h2 className="font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-700/70">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-2 pt-2 text-[11px] text-navy-700/50">
                          <span>{formatDate(post.date)}</span>
                          <span aria-hidden>·</span>
                          <span>{post.author}</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <p className="py-10 text-sm text-navy-700/60">
              Belum ada berita pada kategori ini.
            </p>
          )}

          {/* ---------------- Pagination ---------------- */}
          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman"
              className="mt-14 flex items-center justify-center gap-2"
            >
              {page > 1 ? (
                <Link
                  href={hrefFor({ nextPage: page - 1 })}
                  rel="prev"
                  aria-label="Halaman sebelumnya"
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-800/15 text-navy-900 transition-colors hover:border-navy-800 hover:bg-navy-800 hover:text-white"
                >
                  <span aria-hidden>←</span>
                </Link>
              ) : (
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-800/10 text-navy-900/25"
                >
                  ←
                </span>
              )}

              {pageNumbers.map((n) => {
                const isActive = n === page;
                return (
                  <Link
                    key={n}
                    href={hrefFor({ nextPage: n })}
                    aria-current={isActive ? 'page' : undefined}
                    className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-navy-800 text-white'
                        : 'border border-navy-800/15 text-navy-900 hover:border-navy-800 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}

              {page < totalPages ? (
                <Link
                  href={hrefFor({ nextPage: page + 1 })}
                  rel="next"
                  aria-label="Halaman berikutnya"
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-800/15 text-navy-900 transition-colors hover:border-navy-800 hover:bg-navy-800 hover:text-white"
                >
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-800/10 text-navy-900/25"
                >
                  →
                </span>
              )}
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
