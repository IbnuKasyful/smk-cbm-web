import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPosts } from '@/lib/wordpress';

export const metadata = {
  title: 'Berita',
  description: 'Berita dan kegiatan terbaru dari SMK Citra Bangsa Mandiri Purwokerto.',
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

export default async function NewsIndex() {
  const posts = await getPosts({ limit: 24 });

  return (
    <>
      <Header />
      <main className="pt-28">
        <div className="wrap py-12 sm:py-16">
          <p className="eyebrow mb-3">Informasi</p>
          <h1 className="font-display text-4xl font-black text-navy-900 sm:text-5xl">
            Berita &amp; Kegiatan
          </h1>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5 transition-shadow hover:shadow-lg"
              >
                <div className="photo aspect-[16/10]">
                  {post.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-gold-600">
                    {post.category} · {formatDate(post.date)}
                  </div>
                  <h2 className="text-lg font-semibold leading-snug text-navy-900">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-700/70">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
