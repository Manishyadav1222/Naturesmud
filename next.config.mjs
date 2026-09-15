/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // ✅ Remove unoptimized:true — re-enable WebP conversion and responsive sizing for LCP
    remotePatterns: [
      // ✅ Only allow known trusted image sources (prevents SSRF abuse)
      { protocol: 'https', hostname: 'naturesmud.shop' },
      { protocol: 'https', hostname: 'naturesmud.com' },
      { protocol: 'https', hostname: 'www.naturesmud.com' },
      { protocol: 'https', hostname: 'www.naturesmud.shop' },
      // Allow subdomain hosting e.g. cdn.naturesmud.shop, admin.naturesmud.shop
      { protocol: 'https', hostname: '*.naturesmud.shop' },
      { protocol: 'https', hostname: '*.naturesmud.com' },
    ],
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'swiper', 'date-fns', 'clsx', 'tailwind-merge', 'sonner'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
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