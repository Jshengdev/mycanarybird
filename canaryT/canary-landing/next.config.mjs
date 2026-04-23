import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // The /demo dashboard is a separate Next.js static export copied into
  // public/demo/. These rewrites serve its index + sub-routes as plain
  // static HTML (files in public aren't automatically matched without
  // the .html extension).
  async rewrites() {
    return [
      { source: '/demo', destination: '/demo/index.html' },
      { source: '/demo/components', destination: '/demo/components.html' },
    ];
  },
};

export default nextConfig;
