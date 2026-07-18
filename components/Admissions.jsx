import Reveal from './Reveal';
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

// "Informasi PSB" — admission requirements, required documents, schedule,
// fee, and a registration call-to-action (mirrors smkcbm.sch.id).
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Requirements + documents */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5">
            <h3 className="font-display text-lg font-bold text-navy-900">
              Persyaratan Umum
            </h3>
            <ul className="mt-4 space-y-3">
              {ADMISSION.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700/80">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={90} className="rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(11,21,49,0.06)] ring-1 ring-navy-900/5">
            <h3 className="font-display text-lg font-bold text-navy-900">
              Berkas Pendaftaran
            </h3>
            <ul className="mt-4 space-y-3">
              {ADMISSION.documents.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700/80">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Schedule + fee + CTA */}
        <Reveal
          delay={120}
          className="flex flex-col rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 p-7 text-white ring-1 ring-white/10"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">
            Jadwal &amp; Biaya
          </span>

          <div className="mt-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">
              Jadwal Pendaftaran
            </p>
            <p className="mt-1 font-display text-2xl font-black">
              {ADMISSION.schedule}
            </p>
            <p className="mt-1 text-sm text-white/60">{ADMISSION.scheduleNote}</p>
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

          <a
            href={ADMISSION.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light mt-8 w-full justify-center"
          >
            Daftar Sekarang
            <span aria-hidden>→</span>
          </a>
          <p className="mt-4 text-center text-xs text-white/55">
            Informasi lebih lanjut:{' '}
            <a href={`tel:${SCHOOL.phone.replace(/[^0-9]/g, '')}`} className="font-semibold text-white/80 hover:text-white">
              {SCHOOL.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
