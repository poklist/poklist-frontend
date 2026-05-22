import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/** @type {import('next').NextConfig} */
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
    // FIXME
    optimizePackageImports: [
      '@eslint',
      '@hookform',
      '@lingui',
      '@radix-ui',
      '@tanstack',
      'lucide-react',
      'react-easy-crop',
      'react-hook-form',
      'zod',
      'zustand',
    ],
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.relist.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
