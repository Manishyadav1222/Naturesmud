import type { Metadata } from 'next';
import { faqs } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — Baby Weaning Powders, Superfoods & Nepal Delivery',
  description:
    'Answers to common questions about NaturesMud baby weaning powders (6m+), natural dates powder sweetener, dehydrated fruits, storage in Nepal humidity, Cash on Delivery (COD), and nationwide shipping.',
  alternates: {
    canonical: 'https://naturesmud.shop/faq',
  },
  openGraph: {
    title: 'FAQ — Baby Weaning, Superfoods, Storage & Delivery in Nepal | NaturesMud',
    description:
      'Everything you need to know about NaturesMud 0-additive superfood powders, dehydrated fruits, baby weaning nutrition, and delivery across Nepal.',
    url: 'https://naturesmud.shop/faq',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      '@id': 'https://naturesmud.shop/faq#faqpage',
      url: 'https://naturesmud.shop/faq',
      name: 'NaturesMud Nepal — Frequently Asked Questions',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://naturesmud.shop' },
        { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://naturesmud.shop/faq' },
      ],
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
