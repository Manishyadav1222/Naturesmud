import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product & Community Visual Gallery',
  description:
    'Explore real photos of NaturesMud Himalayan superfood powders, naturally dehydrated fruits, mountain nuts, seeds, and kitchen recipes across Nepal.',
  alternates: {
    canonical: 'https://naturesmud.shop/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
