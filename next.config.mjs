/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist', // Changes the build output directory to `./dist/`.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
};

export default nextConfig;
