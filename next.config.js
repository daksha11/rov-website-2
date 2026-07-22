const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    if (!process.env.BRANDKIT_URL) return [];
    return [
      {
        source: '/tools/brandkit',
        destination: `${process.env.BRANDKIT_URL}/builder/brand-info`,
      },
      {
        source: '/tools/brandkit/:path*',
        destination: `${process.env.BRANDKIT_URL}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ai',
        destination: '/ai-automation',
        permanent: true,
      },
      {
        source: '/services/sound',
        destination: 'https://www.rovmusic.com/',
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
