'use client';

import { useEffect, useRef } from 'react';

// Decorative cursor: a gold dot that tracks the pointer exactly, plus a ring
// that eases behind it and grows over interactive elements. Runs entirely on
// refs + requestAnimationFrame (no re-renders). Skipped on touch/coarse
// pointers and when the user prefers reduced motion.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    // target = live pointer position; ring eases toward it each frame.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let raf = 0;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const interactive = (el) =>
      el?.closest?.('a, button, [role="button"], input, textarea, select, label');

    const onOver = (e) => {
      if (interactive(e.target)) {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
      }
    };
    const onOut = (e) => {
      if (interactive(e.target) && !interactive(e.relatedTarget)) {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
      }
    };
    const onDown = () => ring.classList.add('is-clicking');
    const onUp = () => ring.classList.remove('is-clicking');

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
