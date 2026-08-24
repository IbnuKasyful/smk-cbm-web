// CMS connection health check.
//
// Exists because the WordPress connection fails *silently*: every function in
// lib/wordpress.js falls back to lib/mock-data.js when WP_URL is unset or a
// fetch throws, so a broken site still answers 200 with plausible-looking
// content. That failure shipped twice without anyone noticing for days.
//
// This route reports which of the two failure modes is active:
//   configured=false -> the build/runtime has no WP_URL at all
//   configured=true + reachable=false -> WP_URL is set but the CMS call fails
//
// Deliberately uncached (the pages it diagnoses are the cached ones) and it
// exposes no credentials: WP_URL is a public address, and only the host and an
// HTTP status are returned.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WP_URL = process.env.WP_URL?.replace(/\/$/, '');

export async function GET() {
  const result = {
    checkedAt: new Date().toISOString(),
    configured: Boolean(WP_URL),
    host: null,
    reachable: false,
    status: null,
    latencyMs: null,
    sampleSlug: null,
    error: null,
  };

  if (!WP_URL) {
    result.error = 'WP_URL is not set in this process';
    return NextResponse.json(result, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  try {
    result.host = new URL(WP_URL).host;
  } catch {
    result.host = 'invalid';
  }

  const started = Date.now();
  try {
    // `cache: 'no-store'` so this reflects the CMS right now rather than
    // whatever the ISR data cache happens to be holding.
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=1&_fields=slug`,
      { cache: 'no-store' }
    );
    result.latencyMs = Date.now() - started;
    result.status = res.status;
    result.reachable = res.ok;
    if (res.ok) {
      const data = await res.json();
      result.sampleSlug = data?.[0]?.slug ?? null;
    } else {
      result.error = `CMS responded ${res.status}`;
    }
  } catch (err) {
    result.latencyMs = Date.now() - started;
    result.error = err?.cause?.code || err?.message || 'fetch failed';
  }

  return NextResponse.json(result, {
    status: result.reachable ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
