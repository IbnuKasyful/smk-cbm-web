'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PROGRAMS } from '@/lib/mock-data';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,21,49,0.08)]'
          : 'bg-transparent'
        }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-navy-900">
          <Image src="/logo.png" alt="Logo SMK CBM" width={48} height={48} className="h-10 w-auto object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-black tracking-tight">
              SMK CBM
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-navy-700/70">
              Citra Bangsa Mandiri
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
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

        <div className="flex items-center gap-2">
          <Link href="/#psb" className="btn btn-outline hidden sm:inline-flex">
            Info PPDB
          </Link>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSc3Fpb22YfUTF4GnwQEd5LvtTTl9pduG7-9JdHYfUtTAONQLA/viewform" target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden sm:inline-flex">
            Daftar
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-800/15 text-navy-900 lg:hidden"
            aria-label="Buka menu"
            aria-expanded={open}
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-navy-800/10 bg-cream/95 backdrop-blur-md lg:hidden">
          <nav className="wrap flex flex-col py-3">
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
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-navy-800"
                  >
                    {item.label}
                    <Chevron className={subOpen ? 'rotate-180' : ''} />
                  </button>
                  {subOpen && (
                    <div className="pb-2 pl-3">
                      {item.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-navy-700/80"
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
                  className="border-b border-navy-800/5 py-3 text-sm font-medium text-navy-800"
                >
                  {item.label}
                </a>
              )
            )}
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSc3Fpb22YfUTF4GnwQEd5LvtTTl9pduG7-9JdHYfUtTAONQLA/viewform" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn btn-primary mt-4 justify-center">
              Daftar PPDB
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
