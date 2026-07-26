// The CMS host is not hardcoded: it is derived from WP_URL so that moving the
// WordPress install to another domain stays a one-variable change. Next loads
// .env.local before evaluating this file, so the value is available here.
// Note this is baked into the build — a domain change needs a rebuild, not
// just a restart. See docs/domain-cutover.md.
function cmsImageHost() {
  if (!process.env.WP_URL) return [];
  try {
    const { protocol, hostname } = new URL(process.env.WP_URL);
    return [{ protocol: protocol.replace(':', ''), hostname }];
  } catch {
    console.warn('[next.config] WP_URL is not a valid URL:', process.env.WP_URL);
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project so a stray lockfile in a parent
  // directory doesn't get picked up as the root.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      // Whatever host WP_URL currently points at (the media library lives there).
      ...cmsImageHost(),
      // Kept so that media URLs still resolve during the cutover, when some
      // posts may reference the old host. `**.host` only matches subdomains,
      // so the apex needs its own entry.
      { protocol: 'https', hostname: 'smkcbm.sch.id' },
      { protocol: 'https', hostname: '**.smkcbm.sch.id' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
