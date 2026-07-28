import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import QuestionForm from '@/components/QuestionForm';
import NewsCategories from '@/components/NewsCategories';
import { getPosts } from '@/lib/wordpress';

export const metadata = {
  title: 'Berita',
  description:
    'Berita, artikel, dan kegiatan terbaru dari SMK Citra Bangsa Mandiri Purwokerto.',
};

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

export default async function NewsIndex() {
  const posts = await getPosts({ limit: 24 });

  const [featured, ...rest] = posts;
  const spotlight = posts.slice(0, 3);
  const sideList = rest.slice(0, 3);
  const popular = posts.slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold-200/50 via-cream to-cream"
          />
          <div className="wrap relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
            <Reveal>
              <p className="eyebrow mb-4">Ruang Berita</p>
              <h1 className="font-display text-4xl font-black leading-[1.02] text-navy-900 sm:text-5xl lg:text-6xl">
                Kabar &amp; cerita
                <br />
                dari SMK CBM
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-navy-700/70">
                Ikuti perjalanan, prestasi, dan kegiatan warga sekolah — dari
                laboratorium, asrama, hingga aksi nyata di masyarakat. Semua
                cerita kami rangkum di satu tempat.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Both this and "Semua berita" below open the archive grid,
                    where every article is filterable and paginated. */}
                <Link href="/news/arsip" className="btn btn-primary">
                  Baca berita terbaru
                  <span aria-hidden>→</span>
                </Link>
                <Link href="/#kegiatan" className="btn btn-outline">
                  Lihat kegiatan
                </Link>
              </div>
            </Reveal>

            {/* Overlapping photo collage — echoes the reference's stair panels.
                Each student breaks out of the top of their navy frame for a 3D,
                pop-out-of-the-card look. The frame clips only its own grid
                pattern; the cut-out figure lives on a separate, unclipped layer.
                Plain images (no hyperlink): purely decorative hero visuals. */}
            <Reveal delay={120} className="hidden sm:block">
              <div className="flex items-end justify-center gap-4">
                {[
                  { src: '/images/girl1_news.png', height: 'h-[116%]' },
                  { src: '/images/boy_news.png', height: 'h-[122%]' },
                  { src: '/images/girl2_news.png', height: 'h-[116%]' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`relative w-1/3 ${i === 1 ? '-translate-y-8' : 'translate-y-4'
                      }`}
                  >
                    {/* Navy card — overflow-hidden clips the grid, not the student */}
                    <div className="relative aspect-[3/5] overflow-hidden rounded-[2rem] bg-gradient-to-b from-navy-800 to-navy-950 shadow-lg shadow-navy-900/20 ring-1 ring-navy-900/10">
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:26px_26px]"
                      />
                      {/* Soft glow rising behind the figure's head */}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.16),transparent_70%)]"
                      />
                    </div>
                    {/* Cut-out figure pops above the top edge of the card */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt=""
                      className={`pointer-events-none absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_20px_25px_rgba(15,23,42,0.35)] ${item.height}`}
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Sorotan (Popular works) ---------------- */}
        {spotlight.length > 0 && (
          <section className="wrap py-14 sm:py-16">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-black text-navy-900 sm:text-4xl">
                Sorotan
              </h2>
              <Link
                href="#terbaru"
                aria-label="Ke berita terbaru"
                className="grid h-12 w-12 place-items-center rounded-full border border-navy-800/15 text-navy-900 transition-colors hover:border-navy-800 hover:bg-navy-800 hover:text-white"
              >
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {spotlight.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <Link
                    href={`/news/${post.slug}`}
                    className="group flex items-center gap-4"
                  >
                    <Thumb
                      post={post}
                      className="h-16 w-16 shrink-0 rounded-full ring-1 ring-navy-900/10"
                      imgClass="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-xs text-navy-700/50">
                        {post.author} · {post.category}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- Featured + side list ---------------- */}
        {featured && (
          <section className="wrap pb-14 sm:pb-16">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <Reveal>
                <Link
                  href={`/news/${featured.slug}`}
                  className="group relative block overflow-hidden rounded-3xl"
                >
                  <Thumb
                    post={featured}
                    className="aspect-[16/11] w-full"
                    imgClass="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent"
                  />
                  <div className="absolute left-6 top-6 flex gap-2">
                    <span className="rounded-full bg-gold-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-900">
                      Unggulan
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-900">
                      {featured.category}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/75 sm:line-clamp-2">
                      {featured.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                      <span>{formatDate(featured.date)}</span>
                      <span aria-hidden>·</span>
                      <span>{featured.author}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>

              <div className="flex flex-col divide-y divide-navy-900/10">
                {sideList.map((post, i) => (
                  <Reveal key={post.id} delay={i * 90}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="group flex gap-4 py-5 first:pt-0"
                    >
                      <Thumb
                        post={post}
                        className="h-24 w-28 shrink-0 rounded-xl ring-1 ring-navy-900/10"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-navy-700/50">
                          <span>{formatDate(post.date)}</span>
                          <span aria-hidden>·</span>
                          <span>{post.author}</span>
                        </div>
                        <h4 className="mt-1 font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                          {post.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-navy-700/60">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Berita Terbaru (editorial rows, filterable) ---------------- */}
        {rest.length > 0 && (
          <section id="terbaru" className="wrap border-t border-navy-900/10 py-16">
            <h2 className="mb-12 font-display text-3xl font-black text-navy-900 sm:text-4xl">
              Berita &amp; Artikel Terbaru
            </h2>

            <NewsCategories posts={rest} />
          </section>
        )}

        {/* ---------------- Paling Populer ---------------- */}
        {popular.length > 0 && (
          <section className="wrap border-t border-navy-900/10 py-16">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-black text-navy-900 sm:text-4xl">
                Paling Populer
              </h2>
              <Link href="/news/arsip" className="btn btn-outline">
                Semua berita
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {popular.map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
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
                      <div className="flex items-center gap-2 text-[11px] text-navy-700/50">
                        <span>{formatDate(post.date)}</span>
                        <span aria-hidden>·</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="mt-2 font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-700/70">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- CTA band ---------------- */}
        <section className="bg-gold-200/40">
          <div className="wrap py-14 text-center">
            <p className="font-display text-2xl font-black text-navy-900 sm:text-3xl">
              Punya pertanyaan atau kabar untuk dibagikan?
            </p>
            <QuestionForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
