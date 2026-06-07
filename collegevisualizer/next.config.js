/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Compress output
  compress: true,
  // Minimize JS
  swcMinify: true,
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['recharts'],
  },
};

module.exports = nextConfig;
