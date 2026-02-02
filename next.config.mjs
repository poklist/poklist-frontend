/** @type {import('next').NextConfig} */
const nextConfig = {
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
