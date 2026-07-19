'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';

// PPDB poster with a click-to-enlarge lightbox. Rendered as a real <button>
// so it stays keyboard reachable; the overlay closes on Escape or backdrop.
export default function PosterPreview({ src, alt, width, height }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    // Prevent the page behind the overlay from scrolling.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-navy-900/10 transition-shadow hover:shadow-[0_20px_40px_-16px_rgba(11,21,49,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-800"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 360px, 100vw"
          className="h-auto w-full"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-navy-900">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
            </svg>
            Klik untuk perbesar
          </span>
        </span>
      </button>

      {/* Portalled to <body>: an ancestor with a transform (.reveal) would
          otherwise become the containing block and shrink `fixed inset-0`. */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Tutup pratinjau"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-navy-900 sm:right-6 sm:top-6"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Stop clicks on the image itself from closing the overlay. */}
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              onClick={(e) => e.stopPropagation()}
              sizes="(min-width: 640px) 80vh, 100vw"
              className="max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>,
          document.body
        )}
    </>
  );
}
