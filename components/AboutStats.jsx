import Reveal from './Reveal';
import { HIGHLIGHTS } from '@/lib/mock-data';

// Inline navy line-icons for the highlight cards.
function HighlightIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-9 w-9',
    'aria-hidden': true,
  };
  switch (name) {
    case 'medal':
      return (
        <svg {...common}>
          <path d="M7.5 2.5 10 8" />
          <path d="M16.5 2.5 14 8" />
          <circle cx="12" cy="14.5" r="6" />
          <path d="m12 11.4 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2L8.8 13.7 11 13.4Z" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...common}>
          <rect x="2.5" y="7.5" width="19" height="13" rx="2" />
          <path d="M16 20.5V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14.5" />
          <path d="M2.5 12.5h19" />
        </svg>
      );
    case 'microscope':
      return (
        <svg {...common}>
          <path d="M6 20h8" />
          <path d="M3 22h18" />
          <path d="M14 22a7 7 0 1 0 0-14h-1" />
          <path d="M9 14h2" />
          <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
          <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
        </svg>
      );
    case 'mosque':
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M5 21V10" />
          <path d="M19 21V10" />
          <path d="M7 21v-8h10v8" />
          <path d="M12 5.5c1.8 1.7 3 2.9 3 4.6 0 1.4-1.3 2.4-3 2.4s-3-1-3-2.4c0-1.7 1.2-2.9 3-4.6Z" />
          <path d="M12 3.5V5.5" />
          <path d="M10.5 21v-3.2a1.5 1.5 0 0 1 3 0V21" />
        </svg>
      );
    default:
      return null;
  }
}

// Combines the reference's "About us" statement band with the
// "Sekilas SMK CBM" highlight cards.
export default function AboutStats() {
  return (
    <section id="tentang" className="wrap pt-[50px] pb-[100px]">
      {/* Statement band */}
      <div className="grid gap-8 border-b border-navy-900/10 pb-8 md:grid-cols-[160px_1fr]">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-700/60">
          Visi Kami
        </div>
        <Reveal>
          <p className="font-display text-2xl leading-snug text-navy-900 sm:text-3xl md:text-[2.5rem] md:leading-[1.15]">
            Menjadikan murid <span className="text-[#b7893f]">beriman, sehat, unggul, kompeten, kreatif</span>, serta <span className="text-[#b7893f]">berbudaya lingkungan</span> untuk menghadapi tantangan global.
          </p>
        </Reveal>
      </div>

      {/* Glance */}
      <div className="grid gap-10 pt-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
        <div>
          <h2 className="display-xl text-navy-900">
            Sekilas<br />SMK CBM
          </h2>
          <a href="#program" className="btn btn-primary mt-6">
            Selengkapnya
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {HIGHLIGHTS.map((item, i) => (
            <Reveal key={item.key} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5">
                <span className="text-navy-900">
                  <HighlightIcon name={item.icon} />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold leading-snug text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-700/70">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
