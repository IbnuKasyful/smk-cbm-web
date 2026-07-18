'use client';

import { useEffect, useRef, useState } from 'react';

// A single bento cell: the YouTube video plays as the card's cover — muted,
// looping, autoplaying, cropped to fill. Playback only starts once the card
// scrolls into view (so six iframes don't all load at once). A corner button
// toggles sound via the YouTube iframe API (postMessage).
export default function EventCard({ event }) {
  const id = event.youtubeId;
  const rootRef = useRef(null);
  const iframeRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const src = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`
    : null;

  function command(func) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*'
    );
  }

  function toggleSound(e) {
    e.stopPropagation();
    if (muted) {
      command('unMute');
      command('playVideo');
    } else {
      command('mute');
    }
    setMuted((m) => !m);
  }

  return (
    <article
      ref={rootRef}
      className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl bg-navy-900"
    >
      {inView && src && (
        <div className="embed-cover">
          <iframe
            ref={iframeRef}
            src={src}
            title={event.title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      )}

      {/* legibility gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />

      {/* click anywhere on the card opens the video on YouTube in a new tab */}
      {id && (
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0"
          aria-label={`Tonton di YouTube: ${event.title}`}
        />
      )}

      {/* sound toggle */}
      {src && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-sm transition-colors hover:bg-navy-950/80"
          aria-label={muted ? 'Aktifkan suara' : 'Bisukan'}
          aria-pressed={!muted}
        >
          {muted ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M19 5a9 9 0 0 1 0 14" />
            </svg>
          )}
        </button>
      )}

      {/* caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/60">
          <span>{event.place}</span>
          <span aria-hidden>·</span>
          <span>{event.year}</span>
        </div>
        <h3 className="text-base font-semibold leading-snug text-white">
          {event.title}
        </h3>
      </div>
    </article>
  );
}
