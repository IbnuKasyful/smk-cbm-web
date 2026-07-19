import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import { getCfaItem, getCfaItems, getAllCfaSlugs } from '@/lib/wordpress';

export async function generateStaticParams() {
  const slugs = await getAllCfaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getCfaItem(slug);
  if (!item) return { title: 'Lomba tidak ditemukan' };
  return { title: item.title, description: item.excerpt };
}

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// ~200 words per minute over the stripped article body.
function readingTime(html = '') {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function Chip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-800 ring-1 ring-navy-900/10">
      {icon}
      {children}
    </span>
  );
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-3.5 w-3.5',
  'aria-hidden': true,
};

export default async function CfaArticlePage({ params }) {
  const { slug } = await params;
  const item = await getCfaItem(slug);
  if (!item) notFound();

  const all = await getCfaItems();
  const related = all.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-28">
        <div className="wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          {/* ---------- Article ---------- */}
          <article>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs text-navy-700/55"
            >
              <Link href="/" className="transition-colors hover:text-navy-900">
                Beranda
              </Link>
              <span aria-hidden>•</span>
              <Link href="/cfa" className="transition-colors hover:text-navy-900">
                CFA
              </Link>
              <span aria-hidden>•</span>
              <span className="font-semibold text-navy-900">{item.category}</span>
            </nav>

            <h1 className="mt-4 font-display text-3xl font-black leading-[1.1] text-navy-900 sm:text-[2.75rem]">
              {item.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Chip
                icon={
                  <svg {...iconProps}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              >
                {item.author}
              </Chip>
              <Chip>{item.category}</Chip>
              <Chip
                icon={
                  <svg {...iconProps}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                }
              >
                {readingTime(item.content)} menit baca
              </Chip>
              <Chip
                icon={
                  <svg {...iconProps}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                }
              >
                {fmtDate(item.date)}
              </Chip>
            </div>

            <div className="photo relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              )}
            </div>

            <div
              className="prose-cfa mt-10"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-cream p-6 ring-1 ring-navy-900/5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-700/60">
                Bagikan
              </h2>
              <div className="mt-4">
                <ShareButtons title={item.title} />
              </div>

              {item.tags?.length > 0 && (
                <>
                  <h2 className="mt-8 border-t border-navy-900/10 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-navy-700/60">
                    Tag
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-800 ring-1 ring-navy-900/10"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {related.length > 0 && (
                <>
                  <h2 className="mt-8 border-t border-navy-900/10 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-navy-700/60">
                    Lomba Lainnya
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link href={`/cfa/${r.slug}`} className="group flex gap-3">
                          <span className="photo relative h-14 w-20 flex-none overflow-hidden rounded-xl">
                            {r.image && (
                              <Image
                                src={r.image}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[11px] text-navy-700/55">
                              {fmtDate(r.date)}
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold leading-snug text-navy-900 transition-colors group-hover:text-gold-600">
                              {r.title}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Link href="/cfa" className="btn btn-outline mt-8 w-full justify-center">
                Lihat semua lomba
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
