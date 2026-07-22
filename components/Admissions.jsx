import Reveal from './Reveal';
import PosterPreview from './PosterPreview';
import { ADMISSION, SCHOOL } from '@/lib/mock-data';

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

// Always-open information card. Header stays for scanning; content is never
// hidden behind a toggle.
function InfoCard({ title, hint, dark = false, children }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${
        dark
          ? 'bg-gradient-to-br from-navy-700 to-navy-900 text-white ring-1 ring-white/10'
          : 'bg-white shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5'
      }`}
    >
      <div className="flex items-center justify-between gap-4 p-6">
        <span className="min-w-0">
          <span
            className={`block font-display text-lg font-bold ${
              dark ? 'text-white' : 'text-navy-900'
            }`}
          >
            {title}
          </span>
          {hint && (
            <span
              className={`mt-1 block text-xs ${
                dark ? 'text-white/55' : 'text-navy-700/55'
              }`}
            >
              {hint}
            </span>
          )}
        </span>
      </div>

      <div
        className={`border-t px-6 py-5 ${
          dark ? 'border-white/10' : 'border-navy-900/5'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// "Informasi PSB" — poster on the left, collapsible detail cards on the right.
export default function Admissions() {
  return (
    <section id="psb" className="wrap pt-0 pb-[100px]">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow">Informasi PSB</p>
        <h2 className="mt-3 font-display text-3xl font-black leading-tight text-navy-900 sm:text-4xl">
          Pendaftaran Siswa Baru Tahun Ajaran {ADMISSION.year}
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700/70">
          Mari bergabung dengan SMK Citra Bangsa Mandiri Purwokerto. Berikut
          persyaratan, berkas, dan jadwal penerimaan peserta didik baru.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-12">
        {/* Left: PPDB poster (click to enlarge) */}
        <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:mx-0 lg:max-w-none">
          <PosterPreview
            src={ADMISSION.posterUrl}
            alt={`Poster PPDB ${SCHOOL.shortName} Tahun Ajaran ${ADMISSION.year}`}
            width={1130}
            height={1600}
          />
        </Reveal>

        {/* Right: collapsible information cards */}
        <div className="flex flex-col gap-4">
          <Reveal>
            <InfoCard
              title="Persyaratan Umum"
              hint={`${ADMISSION.requirements.length} ketentuan dasar`}
            >
              <ul className="space-y-3">
                {ADMISSION.requirements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-navy-700/80"
                  >
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </Reveal>

          <Reveal delay={90}>
            <InfoCard
              title="Berkas Pendaftaran"
              hint={`${ADMISSION.documents.length} dokumen yang perlu disiapkan`}
            >
              <ul className="space-y-3">
                {ADMISSION.documents.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-navy-700/80"
                  >
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </Reveal>

          <Reveal delay={180}>
            <InfoCard
              dark
              title="Jadwal & Biaya"
              hint={`${ADMISSION.schedule} · ${ADMISSION.registrationFee}`}
            >
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                  Jadwal Pendaftaran
                </p>
                <p className="mt-1 font-display text-2xl font-black">
                  {ADMISSION.schedule}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {ADMISSION.scheduleNote}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                  Biaya Pendaftaran
                </p>
                <p className="mt-1 font-display text-2xl font-black">
                  {ADMISSION.registrationFee}
                </p>
                <p className="mt-1 text-sm text-white/60">{ADMISSION.feeNote}</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <a
                  href={ADMISSION.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full justify-center bg-gold-500 text-navy-900 hover:bg-gold-400"
                >
                  Daftar Sekarang
                  <span aria-hidden>→</span>
                </a>
                <p className="mt-4 text-center text-xs text-white/60">
                  Informasi lebih lanjut:{' '}
                  <a
                    href={`tel:${SCHOOL.phone.replace(/[^0-9]/g, '')}`}
                    className="font-semibold text-white hover:text-gold-400"
                  >
                    {SCHOOL.phone}
                  </a>
                </p>
              </div>
            </InfoCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
