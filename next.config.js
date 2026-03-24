const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed: output: 'export'
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/services/sound',
        destination: '/sound',
        permanent: true,
      },
      {
        source: '/services/web',
        destination: '/web',
        permanent: true,
      },
      {
        source: '/services/video-production',
        destination: '/video-production',
        permanent: true,
      },
      {
        source: '/services/ai-automation',
        destination: '/ai-automation',
        permanent: true,
      },
      {
        source: '/casestudy/aysegul-ikna',
        destination: '/casestudy/ikna',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
