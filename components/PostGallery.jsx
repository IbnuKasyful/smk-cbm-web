'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';

// A run of post images laid out as an even grid, each opening a full-size
// preview. Thumbnails are cropped to one ratio so the grid stays tidy no matter
// what mix of portrait and landscape the editor uploaded; the overlay always
// shows the whole, uncropped image, so the crop never hides anything.
//
// Flex rather than CSS grid: a trailing row of one looks broken pinned to the
// left, and `justify-center` centres it. See PosterPreview for the single-image
// PPDB variant this shares its interaction model with.

// Thumbnail width per row-count, mirroring a 2- and 3-column grid with the
// gap subtracted (gap-4 = 1rem below `sm`, gap-6 = 1.5rem from `sm`).
function itemWidth(count) {
  if (count === 1) return 'w-full';
  if (count === 2) return 'w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)]';
  return 'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)]';
}

function Icon({ d, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export default function PostGallery({ images = [], aspect = '4/3', className = '' }) {
  // `null` means closed; an index means that image is open.
  const [openAt, setOpenAt] = useState(null);

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (delta) =>
      setOpenAt((i) =>
        i === null ? i : (i + delta + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openAt, close, step]);

  if (!images.length) return null;

  const width = itemWidth(images.length);
  const many = images.length > 1;
  const current = openAt === null ? null : images[openAt];

  return (
    <>
      <ul className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${className}`}>
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`} className={width}>
            <figure>
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                aria-haspopup="dialog"
                className="group block w-full focus:outline-none"
              >
                <span
                  className="photo relative block overflow-hidden rounded-2xl ring-1 ring-navy-900/10 transition-shadow group-hover:shadow-[0_20px_40px_-16px_rgba(11,21,49,0.35)] group-focus-visible:ring-2 group-focus-visible:ring-navy-800"
                  style={{ aspectRatio: aspect }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || img.caption || ''}
                    fill
                    sizes="(min-width: 640px) 320px, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-navy-900">
                      <Icon
                        d="m21 21-4.3-4.3M11 8v6M8 11h6"
                        className="h-3.5 w-3.5"
                      />
                      Perbesar
                    </span>
                  </span>
                </span>
                <span className="sr-only">
                  {img.caption
                    ? `Buka pratinjau ${img.caption}`
                    : 'Buka pratinjau ukuran penuh'}
                </span>
              </button>
              {/* Outside the button: a <figcaption> is not phrasing content and
                  would make the button invalid. */}
              {img.caption && (
                <figcaption className="mt-3 text-center text-sm font-bold leading-snug text-navy-900">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      {/* Portalled to <body>: an ancestor with a transform (.reveal) would
          otherwise become the containing block and shrink `fixed inset-0`. */}
      {current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption || current.alt || 'Pratinjau gambar'}
            onClick={close}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Tutup pratinjau"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-navy-900 sm:right-6 sm:top-6"
            >
              <Icon d="M18 6 6 18M6 6l12 12" />
            </button>

            {many && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Gambar sebelumnya"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-navy-900 sm:left-6"
                >
                  <Icon d="m15 18-6-6 6-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Gambar berikutnya"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-navy-900 sm:right-6"
                >
                  <Icon d="m9 18 6-6-6-6" />
                </button>
              </>
            )}

            {/* A plain <img>: the point of the overlay is the untouched
                original, and next/image would need intrinsic dimensions that
                CMS markup does not reliably carry. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt || current.caption || ''}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />

            {(current.caption || many) && (
              <p className="mt-4 max-w-2xl text-center text-sm text-white/80">
                {current.caption}
                {current.caption && many && <span aria-hidden> · </span>}
                {many && (
                  <span className="tabular-nums">
                    {openAt + 1}/{images.length}
                  </span>
                )}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
