// Server-side proxy for the contact / PPDB enquiry form.
//
// The browser posts JSON here; this route forwards it to WordPress using
// whichever provider is configured via env (see .env.local.example).
// Keeping the WP call server-side hides credentials and avoids CORS.
//
// When WP_URL is not set, it accepts the submission and logs it so the
// front-end flow works end-to-end during local development.

import { NextResponse } from 'next/server';

// No `runtime = 'edge'` here: the OpenNext Cloudflare adapter rejects Next's
// edge runtime, and on Workers this route already runs at the edge anyway.

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
  // CF7 6.x rejects the feedback request with `wpcf7_unit_tag_not_found`
  // unless these hidden fields (normally emitted by the rendered form) are
  // present. The unit tag only has to match `wpcf7-f{id}-...`; the "-o1"
  // offset is what a single on-page form instance would produce.
  form.append('_wpcf7', CF7_FORM_ID);
  form.append('_wpcf7_unit_tag', `wpcf7-f${CF7_FORM_ID}-o1`);
  form.append('your-name', `${body.firstName} ${body.lastName || ''}`.trim());
  form.append('your-email', body.email);
  form.append('your-phone', body.phone || '');
  form.append('your-subject', body.subject || 'Pesan dari website');
  form.append('your-message', body.message);

  const res = await fetch(
    `${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`,
    {
      method: 'POST',
      body: form,
      // CF7 6.x flags any submission with an empty/absent User-Agent as spam
      // and returns status:"spam". The Workers runtime sends no UA by default,
      // so a browser-like UA is required for the server-to-server call to be
      // accepted. (Content-Type is left unset so fetch keeps the multipart
      // boundary it generates for the FormData body.)
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    }
  );
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`CF7 non-JSON ${res.status}: ${raw.slice(0, 300)}`);
  }
  // CF7 returns { status: 'mail_sent' | 'validation_failed' | 'spam' | ... }
  if (data.status !== 'mail_sent') {
    // Full detail (invalid fields, spam flag) goes to the server log only.
    throw new Error(
      `CF7 ${res.status} ${data.status || data.code || '?'}: ${data.message || ''} ${JSON.stringify(data.invalid_fields || [])}`
    );
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

  // Accept-and-log mode. Used when no CMS is connected, and also when the CMS
  // is connected but no form has been set up on it yet — smkcbm.sch.id has
  // Contact Form 7 active but no form created, so CF7_FORM_ID cannot be filled
  // in until someone creates one in wp-admin → Contact → Forms. Failing soft
  // here keeps the front-end form usable instead of returning 502 to visitors.
  if (!WP_URL || (PROVIDER === 'cf7' && !CF7_FORM_ID)) {
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
