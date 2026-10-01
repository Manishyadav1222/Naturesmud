import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import StorefrontShell from '@/components/StorefrontShell';
import { siteConfig } from '@/lib/site';

import { Toaster } from 'sonner';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
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
    default: 'naturesmud.com · naturesmud.shop',
    template: '%s | naturesmud.com',
  },
  applicationName: 'naturesmud.com',
  description:
    "naturesmud.com · naturesmud.shop — 0 Additives · 0 Preservatives · pure Himalayan naturally dehydrated superfood powders (Sweet Potato, Beetroot, Dates, Carrot), wild honey, shilajit, organic seeds & nuts.",
  keywords: [
    'naturesmud',
    'naturesmud.com',
    'naturesmud.shop',
    'NaturesMud',
    'Nature Mud',
    'Natures Mud',
    'NaturesMud Nepal',
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
    'organic baby food powder Nepal',
    'cold pressed coconut oil Nepal',
    'chia seeds Nepal',
  ],
  alternates: {
    canonical: 'https://naturesmud.com',
    languages: {
      'en-US': 'https://naturesmud.com',
      'ne-NP': 'https://naturesmud.com',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: 'naturesmud.com · naturesmud.shop',
    title: 'naturesmud.com · naturesmud.shop',
    description:
      'naturesmud.com & naturesmud.shop — Pure Himalayan organic superfoods, naturally dehydrated fruit powders, nuts & seeds delivered nationwide.',
    images: [
      {
        url: '/naturesmud-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'naturesmud.com · naturesmud.shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'naturesmud.com · naturesmud.shop',
    description:
      'naturesmud.com & naturesmud.shop — Pure Himalayan organic superfoods, naturally dehydrated fruit powders, nuts & seeds delivered nationwide.',
    images: ['/naturesmud-og-image.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
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
      legalName: "NaturesMud Nepal Pvt. Ltd.",
      alternateName: [
        'naturesmud',
        'naturesmud.com',
        'naturesmud.shop',
        'Nature Mud',
        'Natures Mud',
        'NaturesMud Nepal',
        'Nature Mud Nepal',
        'NaturesMud',
        'नेचर्स मड',
      ],
      url: siteConfig.url,
      logo: 'https://naturesmud.com/icon-512x512.png',
      image: 'https://naturesmud.com/icon-512x512.png',
      description: siteConfig.description,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kathmandu, Nepal',
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
      name: 'naturesmud.com',
      alternateName: ['naturesmud.shop', 'naturesmud.com · naturesmud.shop', 'NaturesMud'],
      description: 'naturesmud.com · naturesmud.shop',
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
        '@type': 'Organization',
        name: 'naturesmud.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://naturesmud.com/icon-512x512.png',
          width: 512,
          height: 512,
        },
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
      name: 'NaturesMud Nepal (naturesmud.com)',
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
        streetAddress: 'Kathmandu, Nepal',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati',
        postalCode: '44600',
        addressCountry: 'NP',
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteConfig.url}/#featured-products`,
      name: 'NaturesMud Best-Selling Pure Superfoods Nepal',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Organic Sweet Potato Powder (100g)',
          url: `${siteConfig.url}/products/sweet-potato-powder`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Organic Beetroot Powder (100g)',
          url: `${siteConfig.url}/products/beetroot-powder`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Natural Dates Powder Sweetener (100g)',
          url: `${siteConfig.url}/products/dates-powder`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Dehydrated Himalayan Mango (100g)',
          url: `${siteConfig.url}/products/dehydrated-mango`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Pure Mustang Wild Cliff Honey',
          url: `${siteConfig.url}/products/raw-honey`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Himalayan Shilajit Resin',
          url: `${siteConfig.url}/products/pure-shilajit-resin`,
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/icon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/icon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-[#FAF7F2] text-[#242220] antialiased overflow-x-clip w-full max-w-full">
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}