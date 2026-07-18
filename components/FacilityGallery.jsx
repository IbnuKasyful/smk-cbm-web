'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Line-icon paths keyed by the `icon` field on each facility item.
const ICON_PATHS = {
  flask: <path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3M7.5 14h9" />,
  heart: <path d="M12 20s-7-4.4-9.2-8.6A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 9.2 5.4C19 15.6 12 20 12 20z" />,
  microscope: <path d="M6 18h9M8 13a5 5 0 1 0 8 3M10.5 4.5l3 3-2 2-3-3zM7.5 7.5 4 11" />,
  monitor: <path d="M3 4h18v12H3zM8 20h8M12 16v4" />,
  utensils: <path d="M4 3v7a2 2 0 0 0 4 0V3M6 3v18M15 3c-1.5 1-2 3-2 5s.5 3 2 3v10" />,
  bed: <path d="M3 8v10M3 12h18v6M21 18v-4a2 2 0 0 0-2-2H10V9a1 1 0 0 1 1-1h6M6.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />,
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10" />,
  mosque: <path d="M12 2c2 2 4 3.5 4 6 0 1.5-1.8 2.5-4 2.5S8 9.5 8 8c0-2.5 2-4 4-6zM5 21v-7a2 2 0 0 1 2-2M19 21v-7a2 2 0 0 0-2-2M5 21h14M9 21v-3a3 3 0 0 1 6 0v3" />,
  book: <path d="M4 4v15a1 1 0 0 0 1 1h14V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM8 4v14" />,
  board: <path d="M3 4h18v12H3zM12 16v3M8 8h8M8 11h5" />,
  ball: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 9h17M3.5 15h17M9 3.5c-3 3-3 14 0 17M15 3.5c3 3 3 14 0 17" />,
  cup: <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8zM16 9h2a2 2 0 0 1 0 4h-2M6 4h1M9 4h1M12 4h1" />,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.87M17 4.13a3.5 3.5 0 0 1 0 6.74" />,
  store: <path d="M3 9l1.5-5h15L21 9M4 9v10h16V9M4 9h16M9 19v-6h6v6" />,
  leaf: <path d="M4 20c0-8 6-14 16-14 0 10-6 15-14 15a5 5 0 0 1-2-1zM9 15c2-3 4-4 7-5" />,
};

function FacilityIcon({ name, className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name] ?? ICON_PATHS.home}
    </svg>
  );
}

// Bento span pattern (repeats). Feature tiles are larger; the rest fill in
// with grid-flow-dense so the mosaic packs without gaps.
function bentoSpan(i) {
  switch (i % 6) {
    case 0:
      return 'sm:col-span-2 sm:row-span-2';
    case 2:
      return 'sm:row-span-2';
    case 4:
      return 'lg:col-span-2';
    default:
      return '';
  }
}

export default function FacilityGallery({ facilities }) {
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;
  const total = facilities.length;
  const current = isOpen ? facilities[openIndex] : null;

  const closeBtnRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const open = (i) => {
    lastFocusedRef.current = document.activeElement;
    setOpenIndex(i);
  };
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir) => setOpenIndex((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  );

  // Keyboard shortcuts + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  // Return focus to the tile that opened the lightbox once it closes.
  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus?.();
      lastFocusedRef.current = null;
    }
  }, [isOpen]);

  return (
    <>
      <div className="grid auto-rows-[168px] grid-flow-dense grid-cols-2 gap-4 sm:auto-rows-[190px] sm:grid-cols-3 lg:grid-cols-4">
        {facilities.map((f, i) => (
          <figure
            key={f.key}
            className={`photo group relative overflow-hidden rounded-2xl ring-1 ring-navy-900/10 ${bentoSpan(i)}`}
          >
            {/* Real photo goes here later: set `photo` on the item. */}
            {f.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.photo}
                alt={f.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Legibility gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-transparent" />

            {/* Icon badge */}
            <div className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors group-hover:bg-gold-500 group-hover:text-white group-hover:ring-gold-400">
              <FacilityIcon name={f.icon} />
            </div>

            {/* Placeholder hint (hidden once a real photo is added) */}
            {!f.photo && (
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
                Foto
              </span>
            )}

            {/* Caption */}
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                {f.category}
              </span>
              <h3 className="mt-1 font-display text-base font-bold leading-tight text-white sm:text-lg">
                {f.title}
              </h3>
              <p className="mt-1 max-h-0 overflow-hidden text-xs leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                {f.description}
              </p>
            </figcaption>

            {/* Full-tile click target opens the preview */}
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Lihat pratinjau ${f.title}`}
              className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            />
          </figure>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau ${current.title}`}
        >
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            onClick={close}
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-navy-950 shadow-2xl ring-1 ring-white/10">
            {/* Image / placeholder */}
            <div className="photo relative aspect-[16/10] max-h-[58vh] w-full flex-none">
              {current.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.photo}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

              {!current.photo && (
                <span className="absolute inset-0 grid place-items-center text-sm font-medium uppercase tracking-[0.3em] text-white/25">
                  Foto
                </span>
              )}

              {/* Counter */}
              <span className="absolute left-5 top-5 rounded-full bg-navy-950/40 px-3 py-1 font-display text-sm font-bold text-white/90 backdrop-blur-sm">
                {String(openIndex + 1).padStart(2, '0')}
                <span className="text-white/40">
                  /{String(total).padStart(2, '0')}
                </span>
              </span>

              {/* Close */}
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Tutup pratinjau"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-navy-950/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Prev / next */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Fasilitas sebelumnya"
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-navy-950/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Fasilitas berikutnya"
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-navy-950/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start gap-4 overflow-y-auto p-6 sm:p-8">
              <div className="hidden h-12 w-12 flex-none place-items-center rounded-xl bg-gold-500/15 text-gold-300 ring-1 ring-gold-400/30 sm:grid">
                <FacilityIcon name={current.icon} />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  {current.category}
                </span>
                <h3 className="mt-1 font-display text-2xl font-black leading-tight text-white sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
