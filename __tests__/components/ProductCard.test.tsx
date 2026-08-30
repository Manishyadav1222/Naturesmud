import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useUIStore } from '@/lib/store/ui-store';

jest.mock('@/lib/store/cart-store', () => ({
  useCartStore: jest.fn(() => ({
    addItem: jest.fn(),
    getState: () => ({ closeDrawer: jest.fn() }),
  })),
}));

jest.mock('@/lib/store/wishlist-store', () => ({
  useWishlistStore: jest.fn(() => ({
    toggleItem: jest.fn(),
    isInWishlist: jest.fn(() => false),
  })),
}));

jest.mock('@/lib/store/ui-store', () => ({
  useUIStore: jest.fn(() => ({
    openQuickView: jest.fn(),
  })),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

jest.mock('lucide-react', () => ({
  Heart: () => <svg data-testid="heart" />,
  ShoppingBag: () => <svg data-testid="shopping-bag" />,
  Eye: () => <svg data-testid="eye" />,
  Star: () => <svg data-testid="star" />,
  Leaf: () => <svg data-testid="leaf" />,
  BadgeCheck: () => <svg data-testid="badge-check" />,
  Zap: () => <svg data-testid="zap" />,
}));

jest.mock('@/lib/utils', () => ({
  formatPrice: (price: number) => `Rs. ${price.toLocaleString()}`,
  calculateDiscount: (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return null;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  },
  resolveImageUrl: (url: string) => url,
  classNames: (...classes: (string | false | null | undefined)[]) => 
    classes.filter(Boolean).join(' '),
}));

const mockProduct = {
  id: '1',
  slug: 'test-product',
  name: 'Test Product',
  category: 'Test Category',
  categorySlug: 'test-category',
  price: 500,
  compareAtPrice: 600,
  rating: 4.5,
  reviewCount: 10,
  image: '/products/test.jpg',
  images: ['/products/test.jpg'],
  description: 'Test description',
  shortDescription: 'Short description',
  badges: ['bestseller', 'organic'],
  stock: 100,
  weight: '100g',
  packing: 'Pouch',
  ingredients: ['Ingredient 1'],
  benefits: ['Benefit 1'],
  nutrition: [{ label: 'Calories', value: '100' }],
  usage: 'Use as directed',
  storage: 'Store in cool place',
  isFeatured: true,
  isBestSeller: true,
  tags: ['test'],
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Rs. 500')).toBeInTheDocument();
  });

  it('displays discount badge when compareAtPrice is higher', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('-17%')).toBeInTheDocument();
  });

  it('displays bestseller badge', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/Bestseller/i)).toBeInTheDocument();
  });

  it('displays organic badge', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Organic')).toBeInTheDocument();
  });

  it('shows rating stars', () => {
    render(<ProductCard product={mockProduct} />);
    
    const stars = screen.getAllByTestId('star');
    expect(stars).toHaveLength(5);
  });

  it('displays weight badge', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('100g')).toBeInTheDocument();
  });
});