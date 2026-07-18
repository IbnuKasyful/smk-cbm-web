// Server-side proxy for the contact / PPDB enquiry form.
//
// The browser posts JSON here; this route forwards it to WordPress using
// whichever provider is configured via env (see .env.local.example).
// Keeping the WP call server-side hides credentials and avoids CORS.
//
// When WP_URL is not set, it accepts the submission and logs it so the
// front-end flow works end-to-end during local development.

import { NextResponse } from 'next/server';

const WP_URL = process.env.WP_URL?.replace(/\/$/, '');
const PROVIDER = process.env.CONTACT_FORM_PROVIDER || 'cf7';
const CF7_FORM_ID = process.env.CF7_FORM_ID;

function isValid(body) {
  return (
    body &&
    typeof body.firstName === 'string' &&
    body.firstName.trim() &&
    typeof body.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) &&
    typeof body.message === 'string' &&
    body.message.trim()
  );
}

async function submitToCF7(body) {
  const form = new FormData();
  form.append('your-name', `${body.firstName} ${body.lastName || ''}`.trim());
  form.append('your-email', body.email);
  form.append('your-phone', body.phone || '');
  form.append('your-subject', body.subject || 'Pesan dari website');
  form.append('your-message', body.message);

  const res = await fetch(
    `${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  // CF7 returns { status: 'mail_sent' | 'validation_failed' | ... }
  if (data.status !== 'mail_sent') {
    throw new Error(data.message || 'Formulir ditolak oleh server.');
  }
  return data;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Format permintaan tidak valid.' },
      { status: 400 }
    );
  }

  if (!isValid(body)) {
    return NextResponse.json(
      { ok: false, message: 'Mohon lengkapi nama, email, dan pesan yang valid.' },
      { status: 422 }
    );
  }

  // No CMS connected yet — accept and log so the UX works in development.
  if (!WP_URL) {
    console.info('[contact] (mock) submission received:', {
      name: `${body.firstName} ${body.lastName || ''}`.trim(),
      email: body.email,
      subject: body.subject,
    });
    return NextResponse.json({ ok: true, message: 'Pesan diterima (mode demo).' });
  }

  try {
    if (PROVIDER === 'cf7') {
      if (!CF7_FORM_ID) throw new Error('CF7_FORM_ID belum dikonfigurasi.');
      await submitToCF7(body);
    } else {
      // Extend here for WPForms or a custom endpoint.
      throw new Error(`Provider "${PROVIDER}" belum didukung.`);
    }
    return NextResponse.json({ ok: true, message: 'Pesan berhasil dikirim.' });
  } catch (err) {
    console.error('[contact] submission failed:', err.message);
    return NextResponse.json(
      { ok: false, message: 'Maaf, pesan gagal terkirim. Coba lagi nanti.' },
      { status: 502 }
    );
  }
}
