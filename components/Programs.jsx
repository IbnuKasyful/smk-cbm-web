'use client';

import Link from 'next/link';
import { useState } from 'react';

// The numbered "Academic Programs" list, expandable per row (accordion).
export default function Programs({ programs }) {
  const [active, setActive] = useState(0);

  return (
    <section id="program" className="wrap pt-0 pb-[100px]">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-3">Program Keahlian</p>
        <h2 className="font-display text-3xl font-black leading-tight text-navy-900 sm:text-4xl">
          Ragam{' '}
          <span className="text-gold-600">Program Keahlian</span> untuk Setiap
          Minat dan Cita-cita
        </h2>
      </div>

      <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
        {programs.map((program, i) => {
          const open = active === i;
          return (
            <div key={program.id}>
              <button
                type="button"
                onClick={() => setActive(open ? -1 : i)}
                className="group flex w-full items-center gap-4 py-6 text-left sm:gap-8"
                aria-expanded={open}
              >
                <span className="w-8 font-display text-sm font-bold text-navy-700/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-navy-900 sm:text-xl">
                    {program.short}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-gold-600">
                    {program.field}
                  </span>
                </span>
                <span
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border transition-all ${
                    open
                      ? 'rotate-90 border-navy-800 bg-navy-800 text-white'
                      : 'border-navy-900/15 text-navy-900 group-hover:border-navy-800'
                  }`}
                  aria-hidden
                >
                  →
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  open ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="max-w-2xl pl-12 sm:pl-16">
                    <p className="text-sm leading-relaxed text-navy-700/80">
                      {program.description}
                    </p>
                    <Link
                      href={`/program/${program.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-600"
                    >
                      Lihat Detail Program <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
