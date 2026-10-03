import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Wishlist',
  description: 'Your saved NaturesMud superfoods and healthy snacks.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
