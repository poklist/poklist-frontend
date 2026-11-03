import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
);
const nextConfig = {
  // e2e 會另外 build 一份 feature toggle 關閉的版本，需要不同的輸出目錄（見 playwright.config.ts）
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
    minimumCacheTTL: 2678400,
  },
};
export default nextConfig;
