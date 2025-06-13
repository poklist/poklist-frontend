/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist', // Changes the build output directory to `./dist/`.
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
};

export default nextConfig;
