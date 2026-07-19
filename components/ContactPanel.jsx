'use client';

import { useState } from 'react';
import { SCHOOL } from '@/lib/mock-data';

// Topics offered as checkboxes; the selection is folded into the `subject`
// field so the existing /api/contact payload shape stays unchanged.
const TOPICS = [
  'Pendaftaran (PPDB)',
  'Program Keahlian',
  'Boarding School',
  'Biaya & Beasiswa',
  'Kunjungan Sekolah',
  'Lainnya',
];

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

function Icon({ name }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-5 w-5',
    'aria-hidden': true,
  };
  switch (name) {
    case 'chat':
      return (
        <svg {...props}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    default:
      return null;
  }
}

const CHANNELS = [
  {
    icon: 'chat',
    title: 'Kirim Pesan',
    caption: 'Tim kami siap membantu Anda.',
    value: SCHOOL.email,
    href: `mailto:${SCHOOL.email}`,
  },
  {
    icon: 'pin',
    title: 'Kunjungi Kami',
    caption: 'Datang langsung ke kampus CBM.',
    value: SCHOOL.address,
  },
  {
    icon: 'phone',
    title: 'Telepon Kami',
    caption: 'Senin–Sabtu, 07.00–15.00 WIB.',
    value: SCHOOL.phone,
    href: `tel:${SCHOOL.phone.replace(/[^\d+]/g, '')}`,
  },
];

function SocialIcon({ name }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className: 'h-4 w-4',
    'aria-hidden': true,
  };
  switch (name) {
    case 'facebook':
      return (
        <svg {...props}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...props}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...props}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPanel() {
  const [form, setForm] = useState(initial);
  const [topics, setTopics] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleTopic = (topic) =>
    setTopics((t) =>
      t.includes(topic) ? t.filter((x) => x !== topic) : [...t, topic]
    );

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const payload = {
        ...form,
        subject: topics.length ? topics.join(', ') : 'Pesan dari halaman kontak',
      };
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.message || 'Gagal mengirim pesan.');
      setStatus('ok');
      setForm(initial);
      setTopics([]);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  // Underlined fields on the gold panel, echoing the reference layout.
  const fieldCls =
    'w-full border-0 border-b border-navy-900/25 bg-transparent px-0 py-2.5 text-sm text-navy-900 placeholder:text-navy-900/50 focus:border-navy-900 focus:outline-none focus:ring-0';

  return (
    <section id="kontak" className="wrap pb-20 pt-28 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        {/* Left: contact channels */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="eyebrow mb-3">Hubungi Kami</p>
            <h1 className="font-display text-3xl font-black leading-tight text-navy-900">
              {SCHOOL.shortName}
            </h1>

            <ul className="mt-10 space-y-8">
              {CHANNELS.map((c) => (
                <li key={c.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-navy-800 ring-1 ring-navy-900/10">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-navy-900">{c.title}</h2>
                    <p className="mt-0.5 text-sm text-navy-700/65">{c.caption}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-2 inline-block text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="mt-2 max-w-xs text-sm font-medium leading-relaxed text-navy-900">
                        {c.value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex gap-3">
            {Object.entries(SCHOOL.socials).map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy-800 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-900 hover:text-white"
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </div>

        {/* Right: accent form panel */}
        <form
          onSubmit={onSubmit}
          className="rounded-[2rem] bg-gold-400 p-7 sm:p-10 lg:p-12"
        >
          <h2 className="font-display text-3xl font-black leading-[1.05] text-navy-900 sm:text-[2.75rem]">
            Punya pertanyaan?
            <br />
            Mari kita bicarakan.
          </h2>
          <p className="mt-4 text-sm font-medium text-navy-900/75">
            Ceritakan sedikit tentang Anda dan apa yang ingin Anda tanyakan.
          </p>

          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">Nama depan</span>
              <input
                required
                value={form.firstName}
                onChange={update('firstName')}
                className={fieldCls}
                placeholder="Nama depan"
              />
            </label>
            <label className="block">
              <span className="sr-only">Nama belakang</span>
              <input
                value={form.lastName}
                onChange={update('lastName')}
                className={fieldCls}
                placeholder="Nama belakang"
              />
            </label>
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                className={fieldCls}
                placeholder="nama@email.com"
              />
            </label>
            <label className="block">
              <span className="sr-only">Nomor telepon</span>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className={fieldCls}
                placeholder="+62 8xx xxxx xxxx"
              />
            </label>
          </div>

          <label className="mt-6 block">
            <span className="sr-only">Pesan</span>
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={update('message')}
              className={`${fieldCls} resize-none`}
              placeholder="Ceritakan sedikit tentang pertanyaan Anda..."
            />
          </label>

          <fieldset className="mt-8">
            <legend className="text-sm font-semibold text-navy-900">
              Apa yang bisa kami bantu?
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {TOPICS.map((topic) => (
                <label
                  key={topic}
                  className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-navy-900"
                >
                  <input
                    type="checkbox"
                    checked={topics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="h-4 w-4 rounded border-navy-900/40 bg-transparent text-navy-900 accent-navy-900 focus:ring-2 focus:ring-navy-900/30"
                  />
                  {topic}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn btn-primary mt-10 w-full justify-center disabled:opacity-60"
          >
            {status === 'sending' ? 'Mengirim…' : 'Kirim Pertanyaan'}
          </button>

          {status === 'ok' && (
            <p className="mt-4 text-center text-sm font-semibold text-navy-900" role="status">
              Terima kasih! Pesan Anda telah terkirim.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-center text-sm font-semibold text-red-700" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
