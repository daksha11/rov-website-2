/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed: output: 'export'
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
