import Link from 'next/link';
import Reveal from './Reveal';

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// The "Discover the Latest News" three-card row. Data comes from WordPress
// posts (or mock fallback). Each card links to /news/[slug].
export default function NewsSection({ posts }) {
  return (
    <section id="berita" className="wrap pt-0 pb-[100px]">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-black leading-tight text-navy-900 sm:text-4xl">
          Berita Terbaru dari SMK CBM
        </h2>
        <Link href="/news" className="btn btn-outline">
          Semua Berita
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 90}>
            <Link href={`/news/${post.slug}`} className="group flex h-full flex-col">
              <div className="photo aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-navy-900/10">
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-navy-700/50">
                <span>{formatDate(post.date)}</span>
                <span className="truncate pl-3">{post.author}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                {post.title}
              </h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
