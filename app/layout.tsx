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
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'organic food Nepal',
    'healthy snacks',
    'superfoods',
    'nuts',
    'seeds',
    'raw honey',
    'moringa',
    'chia seeds',
    'sweet potato powder Nepal',
    'beetroot powder Nepal',
    'dates powder Nepal',
    'Himalayan Shilajit resin',
    "Nature's Mud",
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: '/products/naturesmud-all-products-100g.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Himalayan Organic Superfoods`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/products/naturesmud-all-products-100g.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/products/naturesmud-all-products-100g.jpg`,
      description: siteConfig.description,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Samakhushi, Gongabu Chowk',
        addressLocality: 'Kathmandu',
        addressRegion: 'Bagmati',
        postalCode: '44600',
        addressCountry: 'NP',
      },
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
      name: siteConfig.name,
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
      <body className="font-body bg-cream text-dark antialiased">
        <StorefrontShell>{children}</StorefrontShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}