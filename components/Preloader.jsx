'use client';

import { useEffect, useState } from 'react';

// Full-screen academic pre-loader shown on first paint: a graduation-cap
// seal draws itself inside a spinning ring, the wordmark rises, and a gold
// progress bar fills before the overlay fades out and unlocks scrolling.
// Respects prefers-reduced-motion (timings collapse in globals.css).
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  // Hold the overlay for the animation, then trigger the fade-out.
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    document.body.classList.add('is-preloading');
    const hold = reduce ? 300 : 2200;
    const t = setTimeout(() => setDone(true), hold);
    return () => clearTimeout(t);
  }, []);

  // Once fading, restore scroll and unmount after the transition finishes.
  useEffect(() => {
    if (!done) return;
    document.body.classList.remove('is-preloading');
    const t = setTimeout(() => setGone(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      className={`preloader ${done ? 'is-done' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={done}
    >
      <div className="preloader__inner">
        <div className="preloader__seal">
          <svg className="preloader__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" />
          </svg>

          <svg
            className="preloader__cap"
            viewBox="0 0 120 112"
            width="98"
            height="92"
            aria-hidden="true"
          >
            {/* mortarboard */}
            <path className="draw board" pathLength="1" d="M60 16 L114 44 L60 72 L6 44 Z" />
            {/* cap band */}
            <path
              className="draw band"
              pathLength="1"
              d="M34 56 L34 80 Q60 98 86 80 L86 56"
            />
            {/* tassel cord */}
            <path className="draw cord" pathLength="1" d="M114 44 L114 88" />
            {/* tassel bead */}
            <circle className="bead" cx="114" cy="92" r="5" />
          </svg>
        </div>

        <p className="preloader__word">SMK CBM</p>
        <p className="preloader__sub">Citra Bangsa Mandiri · Purwokerto</p>

        <span className="preloader__bar" aria-hidden="true">
          <i />
        </span>
        <span className="sr-only">Memuat halaman…</span>
      </div>
    </div>
  );
}
