import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import PostContent from '@/components/PostContent';
import PostGallery from '@/components/PostGallery';
import { getCfaPost, CFA } from '@/lib/wordpress';
import { parseCfaContent } from '@/lib/cfa-content';

export const metadata = {
  title: 'CFA — Competition for Achievement',
  description: CFA.intro,
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

function Chip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-800 ring-1 ring-navy-900/10">
      {icon}
      {children}
    </span>
  );
}

export default async function CfaPage() {
  const post = await getCfaPost();
  const { head, competitions, tail } = parseCfaContent(post?.content ?? '');

  return (
    <>
      <Header />
      <main className="pt-28">
        <article className="wrap max-w-3xl pb-24 pt-8 sm:pt-12">
          <Link
            href="/"
            className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
          >
            ← Kembali ke Beranda
          </Link>

          <p className="eyebrow mt-8">{CFA.subtitle}</p>
          <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] text-navy-900 sm:text-5xl">
            {post?.title || CFA.title}
          </h1>

          {post ? (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Chip>{post.category}</Chip>
                <Chip
                  icon={
                    <svg {...iconProps}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                >
                  {post.author}
                </Chip>
                <Chip
                  icon={
                    <svg {...iconProps}>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  }
                >
                  {fmtDate(post.date)}
                </Chip>
              </div>

              {post.image && (
                <div className="photo relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}

              {competitions.length > 0 ? (
                <>
                  <PostContent
                    html={head}
                    featured={post.image}
                    className="mt-10"
                  />

                  {/* Portrait ratio: these are A4-ish posters, and the default
                      landscape crop would cut away most of each. The schedule
                      and contact details are in small print, so the preview
                      overlay is what makes them readable. */}
                  <PostGallery
                    images={competitions.map((c) => ({
                      src: c.image,
                      alt: `Poster lomba ${c.name} — CFA Vol. 17 SMK CBM 2026`,
                      caption: c.name,
                    }))}
                    aspect="2/3"
                    className="mt-8"
                  />

                  <PostContent
                    html={tail}
                    featured={post.image}
                    className="mt-10"
                  />
                </>
              ) : (
                <PostContent
                  html={post.content}
                  featured={post.image}
                  className="mt-10"
                />
              )}

              <div className="mt-12 border-t border-navy-900/10 pt-8">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-700/60">
                  Bagikan
                </h2>
                <div className="mt-4">
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </>
          ) : (
            <div className="mt-12 rounded-3xl bg-cream px-6 py-16 text-center ring-1 ring-navy-900/5">
              <p className="font-display text-xl font-black text-navy-900">
                Belum ada pengumuman
              </p>
              <p className="mt-2 text-sm text-navy-700/70">
                Informasi mengenai CFA akan segera diumumkan. Nantikan kabar
                selanjutnya di halaman ini.
              </p>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
