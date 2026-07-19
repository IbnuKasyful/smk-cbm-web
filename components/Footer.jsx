import Link from 'next/link';
import { SCHOOL } from '@/lib/mock-data';

const COLUMNS = [
  {
    title: 'Jelajahi',
    links: [
      { label: 'Tentang Kami', href: '/tentang' },
      { label: 'Program Keahlian', href: '/#program' },
      { label: 'Fasilitas', href: '/fasilitas' },
    ],
  },
  {
    title: 'PPDB',
    links: [
      { label: 'Informasi Pendaftaran', href: '/#psb' },
      { label: 'Alur PPDB', href: '/#psb' },
      { label: 'Boarding School', href: '/fasilitas' },
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Berita', href: '/news' },
      { label: 'CFA', href: '/cfa' },
      { label: 'Kontak', href: '/kontak' },
    ],
  },
];

function SocialIcon({ name, className }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className,
    'aria-hidden': true,
  };
  switch (name.toLowerCase()) {
    case 'facebook':
      return (
        <svg {...commonProps}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...commonProps}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...commonProps}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return <span>{name[0].toUpperCase()}</span>;
  }
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="wrap pt-16">
        <div className="grid gap-10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-black">SMK CBM</div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {SCHOOL.name} {SCHOOL.city} — {SCHOOL.tagline}.
            </p>
            <div className="mt-6 flex gap-3">
              {Object.entries(SCHOOL.socials).map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/15 text-white/70 transition-colors hover:bg-white hover:text-navy-900"
                  aria-label={name}
                >
                  <SocialIcon name={name} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{SCHOOL.address}</p>
          <p>Telp. {SCHOOL.phone}</p>
        </div>
      </div>

      {/* Giant watermark wordmark, like the reference footer */}
      <div className="overflow-hidden px-3">
        <span className="display-huge block translate-y-[22%] select-none bg-gradient-to-b from-white/15 to-white/[0.02] bg-clip-text text-center text-transparent">
          SMK CBM
        </span>
      </div>

      <div className="wrap py-6 text-center text-xs text-white/35">
        © {new Date().getFullYear()} {SCHOOL.name}. Hak cipta dilindungi.
      </div>
    </footer>
  );
}
