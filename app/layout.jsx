import './globals.css';
import { SCHOOL } from '@/lib/mock-data';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  metadataBase: new URL('https://smkcbm.sch.id'),
  icons: {
    icon: '/icon.png',
  },
  title: {
    default: `${SCHOOL.name} ${SCHOOL.city} — ${SCHOOL.tagline}`,
    template: `%s — ${SCHOOL.shortName}`,
  },
  description:
    'SMK Citra Bangsa Mandiri Purwokerto — sekolah kejuruan boarding school terakreditasi A dengan enam program keahlian di bidang kesehatan, bisnis digital, dan pariwisata.',
  keywords: [
    'SMK CBM',
    'SMK Citra Bangsa Mandiri',
    'SMK Purwokerto',
    'boarding school Banyumas',
    'PPDB SMK Purwokerto',
  ],
  openGraph: {
    title: `${SCHOOL.name} ${SCHOOL.city}`,
    description: SCHOOL.tagline,
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport = {
  themeColor: '#0b1531',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Loaded via <link> (not next/font) so the project builds without
            network access; falls back to the CSS stack in tailwind.config.js. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Preloader />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
