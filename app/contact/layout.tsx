import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact NaturesMud Nepal — Kathmandu Hub, Retail Partner Showrooms & Direct Orders',
  description:
    'Contact NaturesMud Nepal at +977-9713888002 or info@naturesmud.shop. Find our Kathmandu headquarters and retail partner outlets in Kathmandu, Lalitpur, Pokhara, Hetauda & Surkhet.',
  alternates: {
    canonical: 'https://naturesmud.shop/contact',
  },
  openGraph: {
    title: 'Contact NaturesMud Nepal — Kathmandu Hub & Retail Outlets',
    description:
      'Order via WhatsApp (+977-9713888002), visit partner outlets in Kathmandu, Lalitpur, Pokhara, Hetauda & Surkhet, or inquire about wholesale.',
    url: 'https://naturesmud.shop/contact',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://naturesmud.shop/contact#webpage',
      url: 'https://naturesmud.shop/contact',
      name: 'Contact NaturesMud Nepal',
      description:
        'Customer service, direct WhatsApp orders, wholesale inquiries, and retail partner outlets across Nepal.',
      isPartOf: { '@id': 'https://naturesmud.shop/#website' },
      mainEntity: { '@id': 'https://naturesmud.shop/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://naturesmud.shop' },
        { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://naturesmud.shop/contact' },
      ],
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
    </>
  );
}
