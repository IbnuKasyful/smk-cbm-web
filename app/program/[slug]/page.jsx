import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProgram, getPrograms, getAllProgramSlugs } from '@/lib/wordpress';

// Pre-render each program route; unknown slugs render on-demand (ISR).
export async function generateStaticParams() {
  const slugs = await getAllProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: 'Program tidak ditemukan' };
  return {
    title: program.name,
    description: program.description,
  };
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default async function ProgramPage({ params }) {
  const { slug } = await params;
  const [program, all] = await Promise.all([getProgram(slug), getPrograms()]);
  if (!program) notFound();

  const others = all.filter((p) => p.slug !== program.slug);

  return (
    <>
      <Header />
      <main className="pt-28">
        <article className="wrap py-12 sm:py-16">
          <Link
            href="/#program"
            className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
          >
            ← Kembali ke Program Keahlian
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            {program.field}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-tight text-navy-900 sm:text-5xl sm:leading-[1.05]">
            {program.name}
          </h1>

          {/* Featured image from the WordPress post; falls back to the branded
              gradient placeholder (.photo) when the post has no image. */}
          <div className="photo relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl">
            {program.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={program.image}
                alt={program.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>

          {program.content ? (
            <div
              className="richtext mt-6 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: program.content }}
            />
          ) : (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-navy-700/80 sm:text-lg">
              {program.overview || program.description}
            </p>
          )}

          {/* Detail columns */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {program.competencies?.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5 sm:p-8">
                <h2 className="font-display text-xl font-bold text-navy-900">
                  Kompetensi yang Dipelajari
                </h2>
                <ul className="mt-5 space-y-3">
                  {program.competencies.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700/80">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {program.careers?.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5 sm:p-8">
                <h2 className="font-display text-xl font-bold text-navy-900">
                  Prospek Karier
                </h2>
                <ul className="mt-5 space-y-3">
                  {program.careers.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700/80">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 p-7 text-white ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                Tertarik dengan program ini?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Daftarkan dirimu di penerimaan siswa baru SMK CBM.
              </p>
            </div>
            <Link href="https://forms.gle/YyrDErLk5noScudh8" className="btn btn-light flex-none">
              Daftar Sekarang
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Other programs */}
          {others.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-black text-navy-900">
                Program Keahlian Lainnya
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/program/${p.slug}`}
                    className="group rounded-2xl bg-white p-6 ring-1 ring-navy-900/5 transition-shadow hover:shadow-lg"
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-gold-600">
                      {p.field}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                      {p.short}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                      Lihat Detail <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
