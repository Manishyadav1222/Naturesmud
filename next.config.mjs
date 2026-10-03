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
        // Only cache static product image assets, NOT the HTML product web pages!
        source: '/products/:file*\\.(jpg|jpeg|png|webp|avif|svg|gif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
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
  async redirects() {
    return [
      {
        source: '/our-story',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/products/premium-coconut-oil',
        destination: '/products/virgin-coconut-oil-500ml',
        permanent: true,
      },
      {
        source: '/products/virgin-coconut-oil',
        destination: '/products/virgin-coconut-oil-500ml',
        permanent: true,
      },
      {
        source: '/products/cashewnuts',
        destination: '/products/premium-cashewnuts',
        permanent: true,
      },
      {
        source: '/products/premium-cashewnut',
        destination: '/products/premium-cashewnuts',
        permanent: true,
      },
      {
        source: '/products/flaxseed-crackers',
        destination: '/products/flax-seeds',
        permanent: true,
      },
      {
        source: '/products/pure-shilajit-resin',
        destination: '/products/pure-mountain-himalayan-shilajit-resin',
        permanent: true,
      },
      {
        source: '/products/raw-almonds-200g',
        destination: '/products/raw-himalayan-almonds',
        permanent: true,
      },
      {
        source: '/products/almonds',
        destination: '/products/raw-himalayan-almonds',
        permanent: true,
      },
      {
        source: '/products/pink-salt',
        destination: '/products/himalayan-pink-salt',
        permanent: true,
      },
      {
        source: '/products/black-salt',
        destination: '/products/pure-himalayan-black-salt-bire-noon',
        permanent: true,
      },
      {
        source: '/products/dates-powder-100g',
        destination: '/products/dates-powder',
        permanent: true,
      },
      {
        source: '/products/sweet-potato-powder-100g',
        destination: '/products/sweet-potato-powder',
        permanent: true,
      },
      {
        source: '/products/beetroot-powder-100g',
        destination: '/products/beetroot-powder',
        permanent: true,
      },
      {
        source: '/products/carrot-powder-100g',
        destination: '/products/carrot-powder',
        permanent: true,
      },
      {
        source: '/products/dried-blueberries-100g',
        destination: '/products/dried-blueberries',
        permanent: true,
      },
      {
        source: '/products/blueberries',
        destination: '/products/dried-blueberries',
        permanent: true,
      },
      {
        source: '/products/dried-cranberry-100g',
        destination: '/products/dried-cranberries',
        permanent: true,
      },
      {
        source: '/products/dried-figs-200g',
        destination: '/products/dry-figs-anjeer',
        permanent: true,
      },
      {
        source: '/products/cashewnuts-roasted',
        destination: '/products/roasted-cashewnuts',
        permanent: true,
      },
      {
        source: '/products/black-chia-seeds',
        destination: '/products/chia-seeds',
        permanent: true,
      },
      {
        source: '/products/walnuts',
        destination: '/products/superfood-trail-mix',
        permanent: true,
      },
      {
        source: '/products/immunity-shield-superfood-mix',
        destination: '/products/superfood-trail-mix',
        permanent: true,
      },
      {
        source: '/products/raw-honey',
        destination: '/products/pure-mountain-himalayan-shilajit-resin',
        permanent: true,
      },
      {
        source: '/blog/could-another-flood-happen-nepal-new-glacial-lake-explained',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/nepal-hydropower-crisis-after-flood-which-projects-damaged',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/what-happened-gyirong-port-nepal-china-border-disaster-explained',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/august-2026-nepal-glacier-avalanche-bhotekoshi-trishuli-flood',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || 'https://api.naturesmud.shop/api';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl.replace(/\/api\/?$/, '')}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;