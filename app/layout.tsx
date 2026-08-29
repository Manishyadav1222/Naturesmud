import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import StorefrontShell from '@/components/StorefrontShell';
import { siteConfig } from '@/lib/site';

import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} (naturesmud.com) — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name} (naturesmud.com)`,
  },
  description:
    "Nature's Mud Nepal (naturesmud.com) — 100% pure chemical-free Himalayan dehydrated superfood powders (Sweet Potato, Beetroot, Dates, Carrot), wild honey, shilajit, organic seeds & nuts. Direct from 180+ certified farms across Nepal.",
  keywords: [
    'naturesmud',
    'naturesmud.com',
    'naturesmud.shop',
    "Nature's Mud",
    'Nature Mud',
    'Natures Mud',
    "Nature's Mud Nepal",
    'Nature Mud Nepal',
    'natures mud shop',
    'organic food Nepal',
    'healthy snacks Nepal',
    'superfoods Nepal',
    'sweet potato powder Nepal',
    'beetroot powder Nepal',
    'dates powder Nepal',
    'carrot powder Nepal',
    'Himalayan Shilajit resin',
    'raw honey Nepal',
    'dried blueberries Nepal',
    'organic baby food powder Nepal',
    'cold pressed coconut oil Nepal',
    'chia seeds Nepal',
  ],
  alternates: {
    canonical: 'https://naturesmud.shop',
    languages: {
      'en-US': 'https://naturesmud.shop',
      'ne-NP': 'https://naturesmud.shop',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: "Nature's Mud (naturesmud.com)",
    title: `${siteConfig.name} (naturesmud.com) — ${siteConfig.tagline}`,
    description:
      "Official website of Nature's Mud Nepal (naturesmud.com). 100% pure Himalayan organic superfoods, dehydrated fruit powders, nuts & seeds delivered nationwide.",
    images: [
      {
        url: '/products/naturesmud-all-products-100g.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} (naturesmud.com) Himalayan Organic Superfoods`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} (naturesmud.com) — ${siteConfig.tagline}`,
    description:
      "Nature's Mud Nepal (naturesmud.com) delivers premium dehydrated fruits, organic powders, and mountain nuts across Nepal.",
    images: ['/products/naturesmud-all-products-100g.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-naturesmud',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'yandex-verification-naturesmud',
  },
  other: {
    'geo.region': 'NP-BA',
    'geo.placename': 'Kathmandu, Nepal',
    'geo.position': '27.7346;85.3123',
    'ICBM': '27.7346, 85.3123',
    'target_country': 'Nepal',
    'distribution': 'Global',
    'rating': 'General',
    'revisit-after': '1 days',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3A6B35',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'Brand'],
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      legalName: "Nature's Mud Nepal Pvt. Ltd.",
      alternateName: [
        'naturesmud',
        'naturesmud.com',
        'naturesmud.shop',
        'Nature Mud',
        'Natures Mud',
        "Nature's Mud Nepal",
        'Nature Mud Nepal',
        'NaturesMud',
        'नेचर्स मड',
      ],
      url: siteConfig.url,
      logo: `${siteConfig.url}/products/naturesmud-all-products-100g.jpg`,
      image: `${siteConfig.url}/products/naturesmud-all-products-100g.jpg`,
      description: siteConfig.description,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Samakhushi, Gongabu Chowk (near Kumari Bank)',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati',
        postalCode: '44600',
        addressCountry: 'NP',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 27.7346,
        longitude: 85.3123,
      },
      sameAs: [
        'https://naturesmud.com',
        'https://www.naturesmud.com',
        'https://facebook.com/profile.php?id=61589084257990',
        'https://instagram.com/naturesmud_official',
        'https://tiktok.com/@naturesmud',
        'https://youtube.com/@naturesmud',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: ['naturesmud', 'naturesmud.com', 'Natures Mud', 'Nature Mud', 'NaturesMud'],
      description: siteConfig.description,
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Store',
      '@id': `${siteConfig.url}/#store`,
      name: "Nature's Mud Nepal (naturesmud.com)",
      url: siteConfig.url,
      telephone: siteConfig.phone,
      priceRange: 'Rs. 200 - Rs. 2000',
      image: `${siteConfig.url}/products/naturesmud-all-products-100g.jpg`,
      areaServed: {
        '@type': 'Country',
        name: 'Nepal',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Samakhushi, Gongabu Chowk',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati',
        postalCode: '44600',
        addressCountry: 'NP',
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteConfig.url}/#featured-products`,
      name: "Nature's Mud Best-Selling Organic Superfoods Nepal",
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: "Organic Sweet Potato Powder (100g)",
          url: `${siteConfig.url}/products/sweet-potato-powder`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: "Organic Beetroot Powder (100g)",
          url: `${siteConfig.url}/products/beetroot-powder`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: "Natural Dates Powder Sweetener (100g)",
          url: `${siteConfig.url}/products/dates-powder`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: "Wild Dried Himalayan Blueberries (100g)",
          url: `${siteConfig.url}/products/dried-blueberries`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: "Pure Mustang Wild Cliff Honey",
          url: `${siteConfig.url}/products/raw-honey`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: "Himalayan Shilajit Resin",
          url: `${siteConfig.url}/products/pure-shilajit-resin`,
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-cream text-dark antialiased overflow-x-hidden w-full max-w-full">
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}