'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Interactive, scroll-driven journey timeline.
// - The gold rail "draws" downward as the section scrolls through the viewport.
// - Each milestone fades/slides in (staggered) when it enters view.
// - The milestone nearest the viewport anchor auto-activates; hover/click
//   overrides it. Active milestone lifts, glows, and reveals its description.
// - Honors prefers-reduced-motion (no transforms, everything visible).
export default function JourneyTimeline({ items }) {
  const railRef = useRef(null);
  const itemRefs = useRef([]);
  const userPicked = useRef(false);

  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(() => items.map(() => false));
  const [reduced, setReduced] = useState(false);

  // Reduced-motion: show everything, skip the entrance animation.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setVisible(items.map(() => true));
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [items]);

  // Staggered entrance as each milestone enters view.
  useEffect(() => {
    if (reduced) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number(entry.target.dataset.idx);
          setVisible((v) => {
            if (v[idx]) return v;
            const next = [...v];
            next[idx] = true;
            return next;
          });
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -15% 0px' }
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [reduced]);

  // Scroll-linked rail fill + auto-active milestone.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const anchor = window.innerHeight * 0.42;
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      setProgress(p);

      if (!userPicked.current) {
        let best = 0;
        let bestDist = Infinity;
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - anchor);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pick = useCallback((i) => {
    userPicked.current = true;
    setActive(i);
  }, []);

  return (
    <ol ref={railRef} className="relative mt-14">
      {/* Rail track */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-[15px] top-3 w-[2px] rounded bg-navy-900/10"
      />
      {/* Rail fill (draws down on scroll) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[15px] top-3 w-[2px] rounded bg-gradient-to-b from-gold-400 to-gold-600"
        style={{
          height: `calc((100% - 24px) * ${progress})`,
          transition: reduced ? 'none' : 'height 120ms linear',
        }}
      />

      {items.map((item, i) => {
        const isActive = active === i;
        const reached = i <= active;
        const shown = reduced || visible[i];
        return (
          <li
            key={item.key}
            ref={(el) => (itemRefs.current[i] = el)}
            data-idx={i}
            className="relative pb-10 pl-12 last:pb-0 sm:pl-14"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(22px)',
              transition: reduced
                ? 'none'
                : `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
            }}
          >
            {/* Milestone dot / control */}
            <button
              type="button"
              onClick={() => pick(i)}
              onMouseEnter={() => pick(i)}
              onFocus={() => pick(i)}
              aria-pressed={isActive}
              aria-label={`${item.step}: ${item.title}`}
              className="absolute left-[15px] top-0 z-10 grid -translate-x-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              {/* Pulse halo on the active dot */}
              {isActive && !reduced && (
                <span className="absolute h-9 w-9 animate-ping rounded-full bg-gold-500/30" />
              )}
              <span
                className={`relative grid place-items-center rounded-full ring-4 ring-cream transition-all duration-300 ${
                  isActive
                    ? 'h-7 w-7 bg-gold-500 shadow-[0_0_0_4px_rgba(200,161,90,0.25)]'
                    : reached
                      ? 'h-5 w-5 bg-gold-500'
                      : 'h-5 w-5 bg-navy-900/20'
                }`}
              >
                <span
                  className={`rounded-full bg-white transition-all duration-300 ${
                    isActive ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'
                  }`}
                />
              </span>
            </button>

            {/* Content card */}
            <div
              onMouseEnter={() => pick(i)}
              className={`cursor-pointer rounded-2xl px-5 py-4 transition-all duration-300 ${
                isActive
                  ? 'bg-white shadow-[0_12px_30px_-12px_rgba(11,21,49,0.25)] ring-1 ring-gold-500/30'
                  : 'ring-1 ring-transparent hover:bg-white/60'
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  reached ? 'text-gold-600' : 'text-navy-700/40'
                }`}
              >
                {item.step}
              </span>
              <h3
                className={`mt-1 font-display text-xl font-bold transition-colors ${
                  isActive ? 'text-navy-900' : 'text-navy-900/80'
                }`}
              >
                {item.title}
              </h3>
              {/* Description collapses for inactive items */}
              <div
                className="grid transition-all duration-500 ease-out"
                style={{
                  gridTemplateRows: isActive ? '1fr' : '0fr',
                  opacity: isActive ? 1 : 0,
                }}
              >
                <p className="overflow-hidden text-sm leading-relaxed text-navy-700/70">
                  <span className="block pt-2">{item.description}</span>
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
