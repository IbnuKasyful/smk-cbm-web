import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Facilities from '@/components/Facilities';
import FacilityGallery from '@/components/FacilityGallery';
import { getFacilities } from '@/lib/wordpress';
import { FACILITY_LIST, SCHOOL } from '@/lib/mock-data';

export const metadata = {
  title: 'Fasilitas',
  description:
    'Fasilitas SMK Citra Bangsa Mandiri Purwokerto — laboratorium kesehatan, lab komputer, dapur praktik, ruang perhotelan, asrama boarding school, masjid, perpustakaan, dan fasilitas penunjang lainnya.',
};

export default async function FasilitasPage() {
  const facilities = await getFacilities();

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
            Fasilitas
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-black leading-[1.05] text-navy-900 sm:text-6xl">
            Fasilitas berstandar industri
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-700/70 sm:text-lg">
            {SCHOOL.name} menyediakan laboratorium, ruang praktik, dan fasilitas
            asrama yang menunjang pembelajaran vokasi sekaligus pembinaan
            karakter Islami setiap hari.
          </p>
        </section>

        {/* ---------- Featured facility carousel ---------- */}
        <div className="mt-14">
          <Facilities facilities={facilities} />
        </div>

        {/* ---------- Facility bento gallery ---------- */}
        <section className="wrap pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black text-navy-900 sm:text-3xl">
                Galeri Fasilitas
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-700/60">
                Ruang belajar, laboratorium, dan sarana penunjang di kampus SMK
                CBM.
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-700/70 ring-1 ring-navy-900/10">
              {FACILITY_LIST.length} fasilitas
            </span>
          </div>

          <FacilityGallery facilities={FACILITY_LIST} />
        </section>

        {/* ---------- CTA ---------- */}
        <section className="wrap pb-24">
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-ink p-9 text-white sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <h2 className="font-display text-2xl font-black sm:text-3xl">
                Ingin melihat fasilitas secara langsung?
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Kunjungi kampus SMK CBM atau hubungi kami untuk informasi lebih
                lanjut seputar fasilitas dan penerimaan siswa baru.
              </p>
            </div>
            <Link href="/#kontak" className="btn btn-light flex-none">
              Hubungi Kami
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
