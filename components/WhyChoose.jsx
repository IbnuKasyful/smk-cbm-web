import Reveal from './Reveal';
import { REASONS } from '@/lib/mock-data';

const ICONS = {
  award: (
    <path d="M12 15a5 5 0 100-10 5 5 0 000 10zm0 0v6l-3-2-3 2m9-6v6l3-2 3 2" />
  ),
  users: (
    <path d="M9 11a3 3 0 100-6 3 3 0 000 6zm7 0a3 3 0 100-6M3 20a6 6 0 0112 0m2-6a6 6 0 015 6" />
  ),
  handshake: (
    <path d="M7 11l3-3 4 4 3-3M3 12l4 4a2 2 0 003 0l1-1 2 2a2 2 0 003 0l3-3" />
  ),
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

// The dark "Legacy of Excellence" section with a highlighted card and
// three icon features.
export default function WhyChoose() {
  return (
    <section className="wrap pt-0 pb-[100px]">
      <div className="rounded-3xl bg-ink p-6 text-white sm:p-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">
            Mengapa SMK CBM
          </p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-[2.75rem] sm:leading-[1.1]">
            Warisan Keunggulan, Masa Depan Penuh Peluang
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Feature grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            {REASONS.map((reason, i) => (
              <Reveal
                key={reason.title}
                delay={i * 90}
                className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                  <Icon name={reason.icon} />
                </span>
                <h3 className="mt-2 text-lg font-semibold">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {reason.description}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Highlight card */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 p-7 ring-1 ring-white/10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
                Sistem Boarding School
              </span>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Pendidikan berbasis asrama memadukan penguatan akademik,
                keterampilan vokasi, dan pembinaan karakter Islami selama 24 jam —
                menumbuhkan kedisiplinan, kemandirian, dan akhlak mulia.
              </p>
            </div>
            <a href="#kontak" className="btn btn-light mt-8 w-fit">
              Pelajari Lebih Lanjut
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
