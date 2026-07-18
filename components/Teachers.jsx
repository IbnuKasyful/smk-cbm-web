'use client';

import { useRef } from 'react';

// Initials for the placeholder avatar (e.g. "Nama Guru" → "NG").
function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function TeacherCard({ teacher }) {
  return (
    <figure className="group relative aspect-[3/4] w-44 flex-none snap-start overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-navy-900/10 sm:w-52">
      {teacher.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={teacher.photo}
          alt={teacher.name}
          className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
        />
      ) : (
        <div className="photo absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-black text-white/25">
            {initials(teacher.name)}
          </span>
        </div>
      )}

      {/* Name/role plate */}
      <figcaption className="absolute inset-x-2 bottom-2 rounded-xl bg-gradient-to-t from-navy-950/95 to-navy-900/70 p-3 backdrop-blur-sm ring-1 ring-white/10">
        <p className="text-sm font-bold leading-tight text-white">
          {teacher.name}
        </p>
        <p className="mt-0.5 text-xs leading-tight text-gold-400">
          {teacher.role}
        </p>
      </figcaption>
    </figure>
  );
}

function Arrow({ dir = 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

export default function Teachers({ teachers }) {
  const trackRef = useRef(null);

  function scrollBy(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            Tenaga Pendidik
          </p>
          <h2 className="mt-2 font-display text-2xl font-black text-navy-900">
            Guru &amp; Instruktur SMK CBM
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            aria-label="Sebelumnya"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-900 hover:text-white"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            aria-label="Berikutnya"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-900 hover:text-white"
          >
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div className="relative mt-6">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-1 pb-2"
        >
          {teachers.map((t) => (
            <TeacherCard key={t.key} teacher={t} />
          ))}
        </div>
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent" />
      </div>
    </section>
  );
}
