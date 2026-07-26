// On-demand revalidation webhook.
//
// WordPress pings this route whenever a post is published, edited, unpublished
// or trashed, so the site reflects the change in seconds instead of waiting out
// the 5-minute ISR window in lib/wordpress.js. The timer stays as a fallback:
// if this webhook never fires (plugin removed, network blocked), content still
// refreshes on its own, just more slowly.
//
// The WordPress side lives in docs/wp-revalidate-hook.php.

import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { CMS_TAG } from '@/lib/wordpress';

const SECRET = process.env.REVALIDATE_SECRET;

// Constant-time comparison. A plain `===` leaks how many leading characters
// matched via response timing, which is enough to recover the secret one
// character at a time.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request) {
  // Refuse rather than fall open: without a configured secret this endpoint
  // would let anyone force the site to re-fetch the CMS on demand.
  if (!SECRET) {
    console.error('[revalidate] REVALIDATE_SECRET is not set — refusing.');
    return NextResponse.json(
      { ok: false, message: 'Revalidation is not configured.' },
      { status: 503 }
    );
  }

  const provided =
    request.headers.get('x-revalidate-secret') ??
    new URL(request.url).searchParams.get('secret');

  if (!safeEqual(provided ?? '', SECRET)) {
    console.warn('[revalidate] rejected a request with a bad secret.');
    return NextResponse.json({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  // The payload is only used for logging — the purge is deliberately global.
  // Working out exactly which pages a post affects would mean replicating the
  // category rules here, and getting it wrong means stale content that looks
  // like a bug. Purging everything costs nothing: revalidateTag only marks the
  // cache stale, and each page is rebuilt on its next visit.
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    // A ping with no body is fine.
  }

  // The second argument is required as of Next 16 — the one-argument form is
  // deprecated and warns on every call. 'max' expires every cache profile
  // holding this tag, which is what a CMS edit means.
  revalidateTag(CMS_TAG, 'max');

  // Also drop the rendered pages. The tag above handles the data; these cover
  // the prerendered HTML, including every entry of the two dynamic routes.
  for (const path of ['/', '/news', '/cfa']) {
    revalidatePath(path);
  }
  revalidatePath('/news/[slug]', 'page');
  revalidatePath('/program/[slug]', 'page');

  console.info(
    '[revalidate] purged CMS cache',
    payload.slug ? `(trigger: ${payload.status || '?'} "${payload.slug}")` : ''
  );

  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}

// A GET is handy for confirming the route is deployed at all. It never
// revalidates and never reveals whether the secret is configured correctly.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Revalidation endpoint is live. Use POST.' });
}
