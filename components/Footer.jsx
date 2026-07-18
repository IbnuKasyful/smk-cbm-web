import { SCHOOL } from '@/lib/mock-data';

const COLUMNS = [
  {
    title: 'Jelajahi',
    links: [
      { label: 'Tentang Kami', href: '#tentang' },
      { label: 'Program Keahlian', href: '#program' },
      { label: 'Fasilitas', href: '#fasilitas' },
    ],
  },
  {
    title: 'PPDB',
    links: [
      { label: 'Informasi Pendaftaran', href: '#kontak' },
      { label: 'Alur PPDB', href: '#kontak' },
      { label: 'Boarding School', href: '#fasilitas' },
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Berita', href: '#berita' },
      { label: 'Kegiatan', href: '#kegiatan' },
      { label: 'Kontak', href: '#kontak' },
    ],
  },
];

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
                  className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/15 text-xs font-semibold capitalize text-white/70 transition-colors hover:bg-white hover:text-navy-900"
                  aria-label={name}
                >
                  {name[0].toUpperCase()}
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
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
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
