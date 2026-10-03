import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Superfood Combos, Baby Weaning Bundles & Festival Gift Hampers in Nepal',
  description:
    'Save on curated NaturesMud superfood combo packs, baby & mother weaning nutrition bundles, athletic energy trios, and healthy Dashain, Tihar & corporate gift hampers delivered across Nepal.',
  alternates: {
    canonical: 'https://naturesmud.shop/offers',
  },
  openGraph: {
    title: 'Superfood Combo Packs, Baby Bundles & Healthy Gift Hampers | NaturesMud Nepal',
    description:
      'Curated Himalayan superfood combos, baby first-solids bundles, and healthy gift boxes with 0 additives & 0 preservatives.',
    url: 'https://naturesmud.shop/offers',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

const offersJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://naturesmud.shop/offers#webpage',
      url: 'https://naturesmud.shop/offers',
      name: 'NaturesMud Superfood Combos, Baby Bundles & Healthy Gift Hampers in Nepal',
      description:
        'Value bundles of 100% pure Himalayan superfood powders, dehydrated fruits, nuts, and seeds.',
      isPartOf: { '@id': 'https://naturesmud.shop/#website' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://naturesmud.shop' },
        { '@type': 'ListItem', position: 2, name: 'Offers & Combos', item: 'https://naturesmud.shop/offers' },
      ],
    },
  ],
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
    </>
  );
}
