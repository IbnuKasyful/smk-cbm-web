'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROGRAMS } from '@/lib/mock-data';

const DAFTAR_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc3Fpb22YfUTF4GnwQEd5LvtTTl9pduG7-9JdHYfUtTAONQLA/viewform';

const NAV = [
  { label: 'Tentang', href: '/tentang' },
  {
    label: 'Program Keahlian',
    href: '#program',
    children: PROGRAMS.map((p) => ({
      label: p.short,
      href: `/program/${p.slug}`,
      field: p.field,
    })),
  },
  { label: 'Fasilitas', href: '/fasilitas' },
  { label: 'CFA', href: '/cfa' },
  { label: 'Berita', href: '/news' },
  { label: 'Kontak', href: '/kontak' },
];

function Chevron({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Collapse the mobile panel whenever navigation happens.
  useEffect(() => {
    setOpen(false);
    setSubOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // The panel only exists below lg — drop it when the viewport grows past it.
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (e) => e.matches && setOpen(false);

    // Lock the page behind the panel so only the menu scrolls.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,21,49,0.08)]'
          : 'bg-transparent'
        }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-3 sm:gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-navy-900 sm:gap-2.5">
          <Image src="/logo.png" alt="Logo SMK CBM" width={48} height={48} className="h-9 w-auto shrink-0 object-contain sm:h-10" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-base font-black tracking-tight sm:text-lg">
              SMK CBM
            </span>
            <span className="truncate text-[9px] font-medium uppercase tracking-[0.14em] text-navy-700/70 sm:text-[10px] sm:tracking-[0.16em]">
              Citra Bangsa Mandiri
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-navy-800/80 transition-colors hover:text-navy-900 group-hover:text-navy-900"
                >
                  {item.label}
                  <Chevron className="group-hover:rotate-180" />
                </a>
                {/* Dropdown (pt-3 bridges the hover gap) */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-72 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-16px_rgba(11,21,49,0.35)] ring-1 ring-navy-900/10">
                    {item.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className="flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-cream"
                      >
                        <span className="text-sm font-semibold text-navy-900">
                          {c.label}
                        </span>
                        <span className="text-xs text-navy-700/60">
                          {c.field}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-800/80 transition-colors hover:text-navy-900"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* While the hamburger is showing (below lg) both CTAs live inside
              the panel instead — keeps the bar to logo + menu button. */}
          <Link href="/#psb" className="btn btn-outline hidden px-5 lg:inline-flex xl:px-6">
            Info PPDB
          </Link>
          <a
            href={DAFTAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden px-5 lg:inline-flex xl:px-6"
          >
            Daftar
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-800/15 text-navy-900 lg:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''
                  }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity ${open ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu — capped to the viewport so long lists scroll. */}
      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-navy-800/10 bg-cream/95 backdrop-blur-md lg:hidden"
        >
          <nav className="wrap flex flex-col py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="border-b border-navy-800/5"
                >
                  <button
                    type="button"
                    onClick={() => setSubOpen((v) => !v)}
                    aria-expanded={subOpen}
                    className="flex min-h-11 w-full items-center justify-between py-3 text-base font-medium text-navy-800 sm:text-sm"
                  >
                    {item.label}
                    <Chevron className={subOpen ? 'rotate-180' : ''} />
                  </button>
                  {subOpen && (
                    <div className="grid gap-0.5 pb-2 pl-3 sm:grid-cols-2">
                      {item.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 flex-col justify-center py-2 text-base text-navy-700/80 sm:text-sm"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center border-b border-navy-800/5 py-3 text-base font-medium text-navy-800 sm:text-sm"
                >
                  {item.label}
                </a>
              )
            )}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/#psb"
                onClick={() => setOpen(false)}
                className="btn btn-outline flex-1 justify-center"
              >
                Info PPDB
              </Link>
              <a
                href={DAFTAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn btn-primary flex-1 justify-center"
              >
                Daftar PPDB
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
