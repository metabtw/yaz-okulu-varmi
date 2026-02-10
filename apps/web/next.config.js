/** @type {import('next').NextConfig} */
const nextConfig = {
  // Resim optimizasyonu için izin verilen domainler
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Backend API proxy (CORS sorunlarını önler)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
