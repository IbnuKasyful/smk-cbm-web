import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCfaItems, CFA } from '@/lib/wordpress';

export const metadata = {
  title: 'CFA — Competition for Achievement',
  description: CFA.intro,
};

const PER_PAGE = 9;

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

function Card({ item }) {
  return (
    <article className="group">
      <Link href={`/cfa/${item.slug}`} className="block">
        <div className="photo relative aspect-[4/3] overflow-hidden rounded-2xl">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="absolute inset-x-0 bottom-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              {item.category}
            </span>
          )}
        </div>
        <h2 className="mt-4 text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-gold-600">
          {item.title}
        </h2>
      </Link>
      <p className="mt-1.5 text-xs text-navy-700/60">
        oleh <span className="text-gold-600">{item.author}</span> pada{' '}
        <span className="text-gold-600">{fmtDate(item.date)}</span>
      </p>
    </article>
  );
}

function Pagination({ page, totalPages }) {
  if (totalPages < 2) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const base =
    'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors';

  return (
    <nav
      aria-label="Navigasi halaman"
      className="mt-14 flex items-center justify-center gap-2 sm:justify-end"
    >
      {page > 1 ? (
        <Link href={`/cfa?page=${page - 1}`} className={`${base} text-navy-800 hover:bg-navy-900/5`}>
          <span aria-hidden>←</span> Sebelumnya
        </Link>
      ) : (
        <span className={`${base} text-navy-900/25`} aria-disabled="true">
          <span aria-hidden>←</span> Sebelumnya
        </span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`/cfa?page=${p}`}
          aria-current={p === page ? 'page' : undefined}
          className={`${base} ${
            p === page
              ? 'bg-navy-900 text-white'
              : 'text-navy-800 hover:bg-navy-900/5'
          }`}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={`/cfa?page=${page + 1}`}
          className={`${base} bg-gold-400 text-navy-900 hover:bg-gold-500`}
        >
          Berikutnya <span aria-hidden>→</span>
        </Link>
      ) : (
        <span className={`${base} text-navy-900/25`} aria-disabled="true">
          Berikutnya <span aria-hidden>→</span>
        </span>
      )}
    </nav>
  );
}

export default async function CfaPage({ searchParams }) {
  const items = await getCfaItems();
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  const requested = Number((await searchParams)?.page) || 1;
  const page = Math.min(Math.max(1, requested), totalPages);
  const visible = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="wrap pb-24 pt-8 sm:pt-12">
          <Link
            href="/"
            className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
          >
            ← Kembali ke Beranda
          </Link>

          <p className="eyebrow mt-8">{CFA.subtitle}</p>
          <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] text-navy-900 sm:text-5xl">
            {CFA.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-navy-700/70 sm:text-base">
            {CFA.intro}
          </p>

          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} />
        </section>
      </main>
      <Footer />
    </>
  );
}
