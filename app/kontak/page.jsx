import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactPanel from '@/components/ContactPanel';
import { SCHOOL } from '@/lib/mock-data';

export const metadata = {
  title: 'Kontak',
  description:
    'Hubungi SMK Citra Bangsa Mandiri Purwokerto — alamat kampus, nomor telepon, email, dan formulir pertanyaan seputar PPDB, program keahlian, serta boarding school.',
};

// Keyless Maps embed (the /maps?output=embed form needs no API key).
const MAP_QUERY = encodeURIComponent(`${SCHOOL.name} ${SCHOOL.city}`);
const MAP_SRC = `https://www.google.com/maps?q=${MAP_QUERY}&hl=id&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

export default function KontakPage() {
  return (
    <>
      <Header />
      <main id="top">
        <ContactPanel />

        <section className="wrap pb-24">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Lokasi</p>
              <h2 className="font-display text-2xl font-black text-navy-900 sm:text-3xl">
                Kampung Pendidikan CBM
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-700/70">
                {SCHOOL.address}
              </p>
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Buka di Google Maps
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-[2rem] ring-1 ring-navy-900/10">
            <iframe
              src={MAP_SRC}
              title={`Peta lokasi ${SCHOOL.name} ${SCHOOL.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[380px] w-full border-0 sm:h-[460px]"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
