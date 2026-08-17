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

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82c-1.05-1.03-1.63-2.42-1.63-3.82h-3.02v13.42a2.7 2.7 0 1 1-2.7-2.7c.28 0 .55.04.8.12V9.79a5.72 5.72 0 0 0-.8-.06 5.72 5.72 0 1 0 5.72 5.72V8.35a8.7 8.7 0 0 0 5.03 1.6V6.94a5.66 5.66 0 0 1-3.4-1.12z" />
    </svg>
  );
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

          {/* Why choose this program */}
          {program.whyChoose?.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-black text-navy-900">
                Kenapa Pilih Program {program.short} di SMK CBM?
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {program.whyChoose.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5"
                  >
                    <h3 className="font-display text-base font-bold text-navy-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-700/80">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social media */}
          {program.socials && Object.keys(program.socials).length > 0 && (
            <div className="mt-12 rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5 sm:p-8">
              <h2 className="font-display text-xl font-bold text-navy-900">
                Lihat Aktivitas {program.short} di Media Sosial
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {program.socials.instagram && (
                  <a
                    href={program.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {program.socials.tiktok && (
                  <a
                    href={program.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
                  >
                    <TikTokIcon className="h-4 w-4" />
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {program.faqs?.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-black text-navy-900">
                Pertanyaan yang Sering Diajukan
              </h2>
              <div className="mt-6 space-y-3">
                {program.faqs.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5"
                  >
                    <summary className="cursor-pointer list-none font-display text-base font-bold text-navy-900 marker:content-none">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-navy-700/80">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

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
