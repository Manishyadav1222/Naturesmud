import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story, Himalayan Sourcing & Direct Farmer Partnerships in Nepal',
  description:
    'Learn how NaturesMud partners directly with smallholder farming communities across Nepal’s Terai, Hilly, and Himalayan regions to craft 100% pure dehydrated fruits, superfood powders, mountain nuts & seeds with 0 additives and 0 preservatives.',
  alternates: {
    canonical: 'https://naturesmud.shop/about',
  },
  openGraph: {
    title: 'Our Story & Direct Farmer Sourcing in Nepal | NaturesMud',
    description:
      'Discover NaturesMud’s 0-additive, 0-preservative whole-food mission and direct sourcing across Nepal’s Terai, Hilly & Himalayan regions.',
    url: 'https://naturesmud.shop/about',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://naturesmud.shop/about#webpage',
      url: 'https://naturesmud.shop/about',
      name: 'About NaturesMud Nepal — Pure Himalayan Superfoods & Farmer Sourcing',
      description:
        'NaturesMud connects Nepali families with 0-additive, 0-preservative dehydrated fruits, superfood powders, nuts, seeds, and cold-pressed oils.',
      isPartOf: { '@id': 'https://naturesmud.shop/#website' },
      about: { '@id': 'https://naturesmud.shop/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://naturesmud.shop' },
        { '@type': 'ListItem', position: 2, name: 'Our Story & Sourcing', item: 'https://naturesmud.shop/about' },
      ],
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
    </>
  );
}
