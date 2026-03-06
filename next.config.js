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
    ];
  },
};

module.exports = nextConfig;
