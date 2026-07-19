import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig();

export default {
  ...config,
  // Next 16 builds with Turbopack by default, and OpenNext cannot resolve the
  // chunk layout Turbopack emits (`server/chunks/ssr/[root-of-the-server]__*.js`),
  // which makes every SSR route fail with ChunkLoadError at runtime. Force a
  // webpack build so the adapter gets the layout it expects.
  buildCommand: 'npx next build --webpack',
};

// No incremental cache backend is wired up yet, so ISR pages regenerate per
// isolate. Add `r2IncrementalCache` later if the WordPress-backed pages need
// shared caching across the fleet.
