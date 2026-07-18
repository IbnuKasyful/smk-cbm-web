import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Teachers from '@/components/Teachers';
import JourneyTimeline from '@/components/JourneyTimeline';
import {
  ABOUT,
  SCHOOL,
  HERO_STATS,
  HIGHLIGHTS,
  JOURNEY,
  REASONS,
  SAMBUTAN,
  TEACHERS,
} from '@/lib/mock-data';

export const metadata = {
  title: 'Tentang Kami',
  description:
    'Profil SMK Citra Bangsa Mandiri Purwokerto — sekolah kejuruan boarding school terakreditasi A dengan enam program keahlian, visi, misi, sambutan kepala sekolah, dan tenaga pendidik.',
};

const PARTNERS = [
  'Rumah Sakit',
  'Apotek',
  'Laboratorium Medik',
  'Perhotelan',
  'Industri Kuliner',
  'Digital Marketing',
  'UMKM',
];

// Line-icon paths keyed by the `icon` field on each HIGHLIGHTS item.
const ICON_PATHS = {
  medal: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5 7 22l5-3 5 3-1.5-7.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 18h9M8 13a5 5 0 1 0 8 3M10.5 4.5l3 3-2 2-3-3zM7.5 7.5 4 11" />
    </>
  ),
  mosque: (
    <>
      <path d="M12 2c2 2 4 3.5 4 6 0 1.5-1.8 2.5-4 2.5S8 9.5 8 8c0-2.5 2-4 4-6zM5 21v-7a2 2 0 0 1 2-2M19 21v-7a2 2 0 0 0-2-2M5 21h14M9 21v-3a3 3 0 0 1 6 0v3" />
    </>
  ),
};

function HighlightIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {ICON_PATHS[name] ?? ICON_PATHS.medal}
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
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function TentangPage() {
  return (
    <>
      <Header />
      <main className="pt-28">
        {/* ---------- Hero ---------- */}
        <section className="wrap pt-8 text-center sm:pt-12">
          <Link
            href="/"
            className="text-sm font-medium text-navy-700/70 transition-colors hover:text-navy-900"
          >
            ← Kembali ke Beranda
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            Tentang Kami
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-black leading-[1.05] text-navy-900 sm:text-6xl">
            Tempat karakter bertemu kompetensi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-700/70 sm:text-lg">
            {SCHOOL.tagline}. {SCHOOL.name} memadukan pendidikan vokasi
            berstandar industri dengan pembinaan karakter Islami di lingkungan
            boarding school.
          </p>

          {/* Image + stat collage */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="photo aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-auto" />
            <div className="grid gap-4">
              <div className="flex flex-col justify-end rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 p-6 text-left text-navy-950 shadow-lg">
                <div className="font-display text-4xl font-black">A</div>
                <p className="mt-1 text-sm font-semibold">
                  Akreditasi Unggul (BAN-S/M)
                </p>
              </div>
              <div className="photo aspect-[4/3] overflow-hidden rounded-3xl" />
            </div>
            <div className="grid gap-4">
              <div className="photo aspect-[4/3] overflow-hidden rounded-3xl" />
              <div className="flex flex-col justify-end rounded-3xl bg-ink p-6 text-left text-white shadow-lg">
                <div className="font-display text-4xl font-black">6</div>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  Program Keahlian
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Intro + stats ---------- */}
        <section className="mt-24 bg-white py-20">
          <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-black leading-tight text-navy-900 sm:text-4xl">
                Mendidik generasi unggul untuk semua
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-navy-700/80">
                {ABOUT.intro.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-950 ring-1 ring-navy-900/10">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${ABOUT.videoId}?rel=0`}
                title={`Video Profil ${SCHOOL.name}`}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="wrap mt-14 grid grid-cols-2 gap-8 border-t border-navy-900/10 pt-10 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.key}>
                <div className="font-display text-4xl font-black text-navy-900">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm leading-snug text-navy-700/60">
                  {stat.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Core values ---------- */}
        <section className="wrap py-20 text-center">
          <h2 className="font-display text-3xl font-black text-navy-900 sm:text-4xl">
            Nilai &amp; Keunggulan Kami
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-700/70">
            Fondasi yang kami pegang dalam membina setiap peserta didik menuju
            masa depan yang profesional dan berkarakter.
          </p>
          <div className="mt-12 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.key}>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-200 text-gold-600">
                  <HighlightIcon name={item.icon} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Partners strip ---------- */}
        <section className="wrap pb-20 text-center">
          <p className="text-sm text-navy-700/60">
            Didukung kemitraan luas dengan dunia usaha &amp; dunia industri
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {PARTNERS.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy-800 ring-1 ring-navy-900/10"
              >
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* ---------- Visi & Misi ---------- */}
        <section className="bg-white py-20">
          <div className="wrap grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-cream p-8 ring-1 ring-navy-900/5 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                Visi
              </p>
              <h2 className="mt-3 font-display text-2xl font-black text-navy-900">
                Arah yang kami tuju
              </h2>
              <p className="mt-5 text-base leading-relaxed text-navy-700/80">
                {ABOUT.visi}
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-8 text-white ring-1 ring-white/10 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-400">
                Misi
              </p>
              <h2 className="mt-3 font-display text-2xl font-black">
                Langkah kami wujudkan
              </h2>
              <ul className="mt-5 space-y-3">
                {ABOUT.misi.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-white/80"
                  >
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Journey ---------- */}
        <section className="wrap py-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
              Perjalanan Kami
            </p>
            <h2 className="mt-3 font-display text-3xl font-black text-navy-900 sm:text-4xl">
              Jejak langkah SMK CBM
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-700/70">
              Perjalanan tumbuh menjadi sekolah vokasi boarding school yang
              unggul, berkarakter, dan diakui mutunya.
            </p>
          </div>

          <JourneyTimeline items={JOURNEY} />
        </section>

        {/* ---------- Sambutan Kepala Sekolah ---------- */}
        <section className="bg-white py-20">
          <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                Sambutan Kepala Sekolah
              </p>
              <h2 className="mt-3 font-display text-3xl font-black text-navy-900 sm:text-4xl">
                Salam dari kepala sekolah
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-navy-700/80">
                {SAMBUTAN.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="mt-6">
                <p className="font-display text-lg font-bold text-navy-900">
                  {SAMBUTAN.name}
                </p>
                <p className="text-sm text-gold-600">{SAMBUTAN.role}</p>
              </div>
            </div>

            <div className="order-first lg:order-none">
              <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy-800 ring-1 ring-navy-900/10">
                {SAMBUTAN.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={SAMBUTAN.photo}
                    alt={SAMBUTAN.name}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="photo absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-6xl font-black text-white/25">
                      {initials(SAMBUTAN.name)}
                    </span>
                  </div>
                )}
              </figure>
            </div>
          </div>
        </section>

        {/* ---------- Tenaga Pendidik (kept) ---------- */}
        <div className="wrap">
          <Teachers teachers={TEACHERS} />
        </div>

        {/* ---------- Why choose (extra credibility) ---------- */}
        <section className="wrap py-20">
          <div className="grid gap-8 sm:grid-cols-3">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl bg-white p-7 ring-1 ring-navy-900/5"
              >
                <h3 className="font-display text-lg font-bold text-navy-900">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-700/70">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="wrap pb-24">
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-ink p-9 text-white sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <h2 className="font-display text-2xl font-black sm:text-3xl">
                Ingin bergabung dengan SMK CBM?
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Pelajari informasi penerimaan siswa baru tahun ajaran
                2026/2027 dan mulai langkah menuju masa depan profesional.
              </p>
            </div>
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSc3Fpb22YfUTF4GnwQEd5LvtTTl9pduG7-9JdHYfUtTAONQLA/viewform" className="btn btn-light flex-none">
              Daftar Sekarang
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
