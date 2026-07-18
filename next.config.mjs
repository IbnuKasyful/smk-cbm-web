/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project so a stray lockfile in a parent
  // directory doesn't get picked up as the root.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Allow images served from the WordPress media library once WP is connected.
    // Add your WP host here, e.g. { protocol: 'https', hostname: 'cms.smkcbm.sch.id' }
    remotePatterns: [
      { protocol: 'https', hostname: '**.smkcbm.sch.id' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
