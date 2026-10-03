import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your NaturesMud Order Across Nepal',
  description:
    'Track your NaturesMud order status and delivery progress across Kathmandu Valley, Pokhara, Chitwan, Butwal, Biratnagar, and all 77 districts of Nepal.',
  alternates: {
    canonical: 'https://naturesmud.shop/track-order',
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
