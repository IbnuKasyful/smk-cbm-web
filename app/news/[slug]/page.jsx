import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPost, getAllPostSlugs } from '@/lib/wordpress';

// Pre-render known article routes; new WP posts render on-demand (ISR).
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Berita tidak ditemukan' };
  return { title: post.title, description: post.excerpt };
}

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

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="pt-28">
        <article className="wrap max-w-3xl py-12 sm:py-16">
          <Link
            href="/news"
            className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
          >
            ← Kembali ke Berita
          </Link>

          <div className="mt-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-gold-600">
            <span>{post.category}</span>
            <span aria-hidden className="text-navy-900/30">·</span>
            <span className="text-navy-700/60">{formatDate(post.date)}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-navy-900 sm:text-5xl sm:leading-[1.05]">
            {post.title}
          </h1>

          <div className="photo mt-10 aspect-[16/9] rounded-2xl">
            {post.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image}
                alt=""
                className="absolute inset-0 h-full w-full rounded-2xl object-cover"
              />
            )}
          </div>

          {/* WordPress returns HTML in post.content; mock data returns plain text. */}
          <div
            className="richtext mt-10"
            dangerouslySetInnerHTML={{
              __html: post.content?.startsWith('<')
                ? post.content
                : `<p>${post.content ?? post.excerpt}</p>`,
            }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
