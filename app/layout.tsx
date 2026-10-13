import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import StorefrontShell from '@/components/StorefrontShell';
import AnalyticsTracker from '@/components/AnalyticsTracker';
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
    default: 'NaturesMud Nepal | Himalayan Superfoods, Dried Fruits & Powders',
    template: '%s | NaturesMud Nepal',
  },
  applicationName: 'NaturesMud',
  description:
    'Shop 100% pure dehydrated fruits, superfood powders, mountain nuts & cold-pressed oils in Nepal. 0 additives, 0 added sugar. Fast delivery across Nepal.',
  alternates: {
    canonical: './',
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
    siteName: 'NaturesMud Nepal',
    title: 'NaturesMud Nepal | Himalayan Superfoods, Dried Fruits & Powders',
    description:
      'Shop 100% pure dehydrated fruits, superfood powders, mountain nuts & cold-pressed oils in Nepal. 0 additives, 0 added sugar. Fast delivery across Nepal.',
    images: [
      {
        url: '/naturesmud-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NaturesMud Nepal — Pure Superfoods, Dehydrated Fruits & Powders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaturesMud Nepal | Himalayan Superfoods, Dried Fruits & Powders',
    description:
      'Shop 100% pure dehydrated fruits, superfood powders, mountain nuts & cold-pressed oils in Nepal. 0 additives, 0 added sugar. Fast delivery across Nepal.',
    images: ['/naturesmud-og-image.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  other: {
    'geo.region': 'NP-BA',
    'geo.placename': 'Kathmandu, Nepal',
    'geo.position': '27.7172;85.3240',
    'ICBM': '27.7172, 85.3240',
    'target_country': 'Nepal',
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : {}),
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
      name: 'NaturesMud',
      alternateName: [
        'NaturesMud Nepal',
        "Nature's Mud",
        'Nature Mud',
        'Nature Mud Nepal',
        'नेचर्स मड',
      ],
      slogan: siteConfig.tagline,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        '@id': `${siteConfig.url}/#logo`,
        url: `${siteConfig.url}/icon-512x512.png`,
        contentUrl: `${siteConfig.url}/icon-512x512.png`,
        width: 512,
        height: 512,
        caption: 'NaturesMud Nepal',
      },
      image: `${siteConfig.url}/icon-512x512.png`,
      description: siteConfig.description,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Baneshwor',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati Province',
        postalCode: '44600',
        addressCountry: 'NP',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: siteConfig.phone,
          email: siteConfig.email,
          contactType: 'customer service',
          areaServed: 'NP',
          availableLanguage: ['English', 'Nepali'],
        },
        {
          '@type': 'ContactPoint',
          telephone: siteConfig.phone,
          email: siteConfig.email,
          contactType: 'sales',
          areaServed: 'NP',
          availableLanguage: ['English', 'Nepali'],
        },
      ],
      areaServed: [
        { '@type': 'Country', name: 'Nepal' },
        { '@type': 'City', name: 'Kathmandu' },
        { '@type': 'City', name: 'Lalitpur' },
        { '@type': 'City', name: 'Bhaktapur' },
        { '@type': 'City', name: 'Pokhara' },
        { '@type': 'City', name: 'Bharatpur' },
        { '@type': 'City', name: 'Butwal' },
        { '@type': 'City', name: 'Biratnagar' },
        { '@type': 'City', name: 'Dharan' },
        { '@type': 'City', name: 'Hetauda' },
        { '@type': 'City', name: 'Nepalgunj' },
        { '@type': 'City', name: 'Birendranagar' },
      ],
      sameAs: [
        siteConfig.social.facebook,
        siteConfig.social.instagram,
        siteConfig.social.tiktok,
        siteConfig.social.youtube,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: 'NaturesMud',
      alternateName: ['NaturesMud Nepal', "Nature's Mud"],
      description: siteConfig.description,
      inLanguage: 'en-NP',
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['OnlineStore', 'HealthFoodStore', 'LocalBusiness'],
      '@id': `${siteConfig.url}/#localbusiness`,
      name: 'NaturesMud Nepal',
      parentOrganization: {
        '@id': `${siteConfig.url}/#organization`,
      },
      url: siteConfig.url,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      currenciesAccepted: 'NPR',
      paymentAccepted: 'Cash on Delivery, FonePay QR, eSewa, Khalti, Bank Transfer',
      priceRange: 'NPR 220 - NPR 1995',
      image: `${siteConfig.url}/products/naturesmud-all-products-100g.jpg`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 27.6915,
        longitude: 85.342,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      areaServed: {
        '@type': 'Country',
        name: 'Nepal',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Baneshwor',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati Province',
        postalCode: '44600',
        addressCountry: 'NP',
      },
      sameAs: [
        siteConfig.social.facebook,
        siteConfig.social.instagram,
        siteConfig.social.tiktok,
        siteConfig.social.youtube,
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'NaturesMud Nepal Canonical Product Categories',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Pure Fruit & Vegetable Powders in Nepal',
            url: `${siteConfig.url}/category/powders`,
          },
          {
            '@type': 'OfferCatalog',
            name: 'Dehydrated Fruits & Berries in Nepal',
            url: `${siteConfig.url}/category/dried-fruits`,
          },
          {
            '@type': 'OfferCatalog',
            name: 'Premium Nuts & Dry Fruits in Nepal',
            url: `${siteConfig.url}/category/nuts`,
          },
          {
            '@type': 'OfferCatalog',
            name: 'Superfood Seeds & Makhana in Nepal',
            url: `${siteConfig.url}/category/seeds`,
          },
          {
            '@type': 'OfferCatalog',
            name: 'Cold-Pressed Coconut Oils & Rosemary in Nepal',
            url: `${siteConfig.url}/category/oils`,
          },
          {
            '@type': 'OfferCatalog',
            name: 'Himalayan Salts & Shilajit Resin in Nepal',
            url: `${siteConfig.url}/category/salts-spices`,
          },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteConfig.url}/#featured-products`,
      name: 'NaturesMud Pure Superfoods, Powders & Dehydrated Fruits Nepal',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Freeze Dried Avocado Powder',
          url: `${siteConfig.url}/products/freeze-dried-avocado-powder`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Freeze Dried Strawberry Powder',
          url: `${siteConfig.url}/products/strawberry-powder`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Banana Powder',
          url: `${siteConfig.url}/products/banana-powder`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Moringa Leaf Powder',
          url: `${siteConfig.url}/products/moringa-leaf-powder`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Sweet Potato Powder',
          url: `${siteConfig.url}/products/sweet-potato-powder`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Dates Powder',
          url: `${siteConfig.url}/products/dates-powder`,
        },
        {
          '@type': 'ListItem',
          position: 7,
          name: 'Dehydrated Mango',
          url: `${siteConfig.url}/products/dehydrated-mango`,
        },
        {
          '@type': 'ListItem',
          position: 8,
          name: 'Pure Mountain Himalayan Shilajit Resin',
          url: `${siteConfig.url}/products/pure-mountain-himalayan-shilajit-resin`,
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
        <AnalyticsTracker />
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}