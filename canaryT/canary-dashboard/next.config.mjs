/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Deterministic IDs to reduce stale chunk references
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';

      // Reduce file watcher sensitivity — poll less aggressively
      // This prevents rapid recompiles when multiple files are written
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 1000,  // Wait 1s after last change before recompiling
        poll: false,             // Use native FS events, not polling
        ignored: ['**/node_modules/**', '**/.git/**', '**/canary-design-system/**'],
      };
    }
    return config;
  },
  // Use onDemandEntries to keep compiled pages in memory longer
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,    // Keep pages compiled for 60s
    pagesBufferLength: 10,         // Keep 10 pages in buffer
  },
};

export default nextConfig;
