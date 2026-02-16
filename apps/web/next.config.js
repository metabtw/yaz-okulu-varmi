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
  // API_URL: backend base (örn. http://localhost:4000) - /api eklenmemeli
  async rewrites() {
    const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
