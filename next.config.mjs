/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'swiper', 'date-fns', 'clsx', 'tailwind-merge', 'sonner'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/products/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async rewrites() {
    const adminUrl = process.env.INTERNAL_ADMIN_API_URL || 'http://localhost:4001/api/admin';
    const backendUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000/api';
    return [
      {
        source: '/api/admin/:path*',
        destination: `${adminUrl.replace(/\/api\/admin\/?$/, '')}/api/admin/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl.replace(/\/api\/?$/, '')}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;