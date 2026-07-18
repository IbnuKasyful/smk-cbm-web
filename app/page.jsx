import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutStats from '@/components/AboutStats';
import Facilities from '@/components/Facilities';
import Programs from '@/components/Programs';
import WhyChoose from '@/components/WhyChoose';
import Admissions from '@/components/Admissions';
import Events from '@/components/Events';
import NewsSection from '@/components/NewsSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

import { getPosts, getPrograms, getEvents, getFacilities } from '@/lib/wordpress';

// Server Component: fetches CMS data at request time (ISR via lib/wordpress.js).
export default async function HomePage() {
  const [posts, programs, events, facilities] = await Promise.all([
    getPosts({ limit: 3 }),
    getPrograms(),
    getEvents(),
    getFacilities(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutStats />
        <Facilities facilities={facilities} />
        <Programs programs={programs} />
        <WhyChoose />
        <Admissions />
        <Events events={events} />
        <NewsSection posts={posts} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
