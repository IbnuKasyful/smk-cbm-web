'use client';

import { useState } from 'react';
import { SCHOOL } from '@/lib/mock-data';

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

// Contact / PPDB enquiry form. Submits to /api/contact, which forwards the
// payload to WordPress (Contact Form 7 / WPForms / custom endpoint).
export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [error, setError] = useState('');

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Gagal mengirim pesan.');
      setStatus('ok');
      setForm(initial);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-700/40 focus:border-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-800/10';

  return (
    <section id="kontak" className="wrap pt-0 pb-[100px]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* Left: heading + contact details */}
        <div>
          <p className="eyebrow mb-3">Hubungi Kami</p>
          <h2 className="font-display text-3xl font-black leading-tight text-navy-900 sm:text-[2.75rem] sm:leading-[1.05]">
            Punya Pertanyaan? Kami Senang Mendengarnya.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-navy-700/70">
            Sampaikan pertanyaan seputar pendaftaran, program keahlian, atau
            kunjungan sekolah. Tim kami akan menghubungi Anda kembali.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-navy-900">Alamat</dt>
              <dd className="mt-1 max-w-sm text-navy-700/70">{SCHOOL.address}</dd>
            </div>
            <div className="flex gap-10">
              <div>
                <dt className="font-semibold text-navy-900">Telepon</dt>
                <dd className="mt-1 text-navy-700/70">{SCHOOL.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Email</dt>
                <dd className="mt-1 text-navy-700/70">{SCHOOL.email}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Right: form */}
        <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy-900">
                Nama Depan
              </span>
              <input
                required
                value={form.firstName}
                onChange={update('firstName')}
                className={inputCls}
                placeholder="Nama depan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy-900">
                Nama Belakang
              </span>
              <input
                value={form.lastName}
                onChange={update('lastName')}
                className={inputCls}
                placeholder="Nama belakang"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy-900">
                Email
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                className={inputCls}
                placeholder="nama@email.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-navy-900">
                Nomor Telepon
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                className={inputCls}
                placeholder="+62 8xx xxxx xxxx"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-navy-900">
              Subjek
            </span>
            <input
              value={form.subject}
              onChange={update('subject')}
              className={inputCls}
              placeholder="Contoh: Informasi PPDB 2026"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-semibold text-navy-900">
              Pesan
            </span>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={update('message')}
              className={`${inputCls} resize-none`}
              placeholder="Tulis pesan Anda..."
            />
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn btn-primary disabled:opacity-60"
            >
              {status === 'sending' ? 'Mengirim…' : 'Kirim Pesan'}
              {status !== 'sending' && <span aria-hidden>→</span>}
            </button>

            {status === 'ok' && (
              <p className="text-sm font-medium text-green-700" role="status">
                Terima kasih! Pesan Anda telah terkirim.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
