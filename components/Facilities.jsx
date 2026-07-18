'use client';

import { useState } from 'react';

// The big dark facility feature card with a giant word overlay and a
// prev/next stepper (the "Library 02/08" block in the reference).
export default function Facilities({ facilities }) {
  const [index, setIndex] = useState(0);
  const total = facilities.length;
  const current = facilities[index];

  const go = (dir) => setIndex((i) => (i + dir + total) % total);

  return (
    <section id="fasilitas" className="wrap pt-0 pb-[100px]">
      <div className="photo relative min-h-[62vh] overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-navy-950/50" />

        <div className="relative flex min-h-[62vh] flex-col justify-between p-6 sm:p-10">
          {/* top: tag + copy */}
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="w-fit rounded-full bg-gold-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-200">
              {current.tag}
            </span>
            <h2 className="font-display text-2xl font-black leading-tight text-white sm:text-4xl">
              {current.title}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/75">
              {current.description}
            </p>
          </div>

          {/* bottom: counter, giant word, controls */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <span className="font-display text-lg font-bold text-white/90">
                {String(index + 1).padStart(2, '0')}
                <span className="text-white/40">
                  /{String(total).padStart(2, '0')}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/90 transition-colors hover:bg-white hover:text-navy-900"
                aria-label="Fasilitas sebelumnya"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/90 transition-colors hover:bg-white hover:text-navy-900"
                aria-label="Fasilitas berikutnya"
              >
                →
              </button>
            </div>
          </div>

          {/* giant word watermark */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden px-6 sm:px-10">
            <span className="display-huge block translate-y-[18%] select-none text-white/10">
              {current.word}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
