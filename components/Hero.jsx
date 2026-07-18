import { SCHOOL, HERO_STATS } from '@/lib/mock-data';

// Full-bleed hero: giant school name over a building photo, with an
// announcement card and (decorative) carousel controls — mirroring the
// reference layout. Replace the .photo block with a real building image:
//   <img src="/images/gedung-cbm.jpg" ... /> inside the same container.
export default function Hero() {
  return (
    <section id="top" className="relative px-3 pt-20 sm:px-4">
      <div className="relative mx-auto max-w-[1320px]">
        <div className="photo relative flex min-h-[74vh] flex-col justify-between rounded-3xl p-6 sm:min-h-[80vh] sm:p-10">
          {/* darken for legibility */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-navy-950/40" />

          {/* top area: wordmark (left) + location, announcement & stat cards (right) */}
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* left: year tag + giant wordmark + subtitle */}
            <div className="flex flex-col">
              <span className="self-start rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                PPDB 2026 / 2027
              </span>
              <h1 className="display-xl mt-6 text-white/95 drop-shadow-sm">
                SMK <br />
                Citra Bangsa
                <br />
                Mandiri
                <br />
                Purwokerto
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-white/80 sm:text-lg">
                {SCHOOL.tagline}
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-4 sm:items-end">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/70 sm:text-right">
                {SCHOOL.city} · Jawa Tengah
              </span>

              {/* Pendaftaran Dibuka card */}
              <div className="w-full rounded-2xl bg-white/95 p-5 text-left backdrop-blur-sm sm:p-6">
                <p className="eyebrow mb-2">Pendaftaran Dibuka</p>
                <p className="text-sm leading-relaxed text-navy-900">
                  Penerimaan Peserta Didik Baru tahun ajaran 2026/2027 telah
                  dibuka. Bergabunglah dengan sekolah kejuruan boarding school
                  terakreditasi <strong>A</strong> di Purwokerto.
                </p>
                <a href="#kontak" className="btn btn-primary mt-4">
                  Daftar Sekarang
                  <span aria-hidden>→</span>
                </a>
              </div>

              {/* stat cards: alumni, mitra, guru, akreditasi */}
              <div className="grid w-full grid-cols-2 gap-3">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.key}
                    className="rounded-2xl bg-white/95 p-4 text-left backdrop-blur-sm"
                  >
                    <p className="text-2xl font-bold leading-none text-navy-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs leading-snug text-navy-900/70">
                      {stat.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom row: carousel controls */}
          <div className="relative flex items-end justify-start">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/90 transition-colors hover:bg-white hover:text-navy-900"
                aria-label="Sebelumnya"
              >
                ←
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/90 transition-colors hover:bg-white hover:text-navy-900"
                aria-label="Berikutnya"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
