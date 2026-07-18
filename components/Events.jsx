import Reveal from './Reveal';
import EventCard from './EventCard';

// Bento-style grid of activity videos. The span pattern below reproduces the
// reference layout for the first six cards: a tall feature card on the left, a
// wide card top-right, two mid cards, then two wide cards along the bottom.
const SPANS = [
  'sm:col-span-2 sm:row-span-2',
  'sm:col-span-4',
  'sm:col-span-2',
  'sm:col-span-2',
  'sm:col-span-3',
  'sm:col-span-3',
];

export default function Events({ events }) {
  return (
    <section id="kegiatan" className="wrap pt-0 pb-[100px]">
      <h2 className="mx-auto mb-14 max-w-2xl text-center font-display text-3xl font-black leading-tight text-navy-900 sm:text-4xl">
        Kegiatan, Prestasi, dan Momen Kebersamaan
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:auto-rows-[220px] sm:grid-cols-6">
        {events.map((event, i) => (
          <Reveal
            key={event.id}
            delay={(i % 3) * 80}
            className={`h-full ${SPANS[i] ?? 'sm:col-span-2'}`}
          >
            <EventCard event={event} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
