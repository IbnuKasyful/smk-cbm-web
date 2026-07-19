'use client';

import { useState } from 'react';

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

// Enquiry form for the news CTA band. Shares the /api/contact endpoint with
// the homepage ContactForm.
export default function QuestionForm() {
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
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-8 max-w-2xl rounded-3xl bg-white p-6 text-left ring-1 ring-navy-900/5 sm:p-8"
    >
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
          placeholder="Contoh: Liputan kegiatan sekolah"
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
          placeholder="Tulis pertanyaan atau kabar Anda..."
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
  );
}
