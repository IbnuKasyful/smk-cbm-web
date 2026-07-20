'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

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

// Interactive article list for the news page. The category tabs are built from
// the real WordPress categories carried on each post, and clicking one filters
// the rows below to that category (the "Semua" tab shows everything).
export default function NewsCategories({ posts = [] }) {
  const categories = useMemo(
    () => ['Semua', ...new Set(posts.map((p) => p.category).filter(Boolean))],
    [posts]
  );
  const [active, setActive] = useState('Semua');

  const filtered =
    active === 'Semua'
      ? posts
      : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Category filter bar, sourced from the posts' WordPress categories. */}
      <div className="no-scrollbar mb-12 flex gap-8 overflow-x-auto border-b border-navy-900/10 pb-6 text-sm">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`whitespace-nowrap font-medium transition-colors ${
                isActive
                  ? 'text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-8'
                  : 'text-navy-700/50 hover:text-navy-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-12">
        {filtered.map((post, i) => (
          <Reveal key={post.id} delay={(i % 2) * 90}>
            <article
              className={`grid items-center gap-6 sm:grid-cols-2 sm:gap-10 ${
                i % 2 === 1 ? 'sm:[&>a]:order-2' : ''
              }`}
            >
              <Link
                href={`/news/${post.slug}`}
                className="group block overflow-hidden rounded-2xl"
              >
                <Thumb
                  post={post}
                  className="aspect-[16/10] w-full"
                  imgClass="transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div>
                <p className="eyebrow mb-3">{post.category}</p>
                <Link href={`/news/${post.slug}`} className="group">
                  <h3 className="font-display text-2xl font-black leading-tight text-navy-900 group-hover:text-navy-700 sm:text-[1.75rem]">
                    {post.title}
                  </h3>
                </Link>
                <div className="mt-3 flex items-center gap-3 text-xs text-navy-700/50">
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{post.author}</span>
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-navy-700/70">
                  {post.excerpt}
                </p>
                <Link
                  href={`/news/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:text-gold-600"
                >
                  Baca selengkapnya
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          </Reveal>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-navy-700/60">
            Belum ada berita pada kategori ini.
          </p>
        )}
      </div>
    </>
  );
}
