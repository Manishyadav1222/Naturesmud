import { act } from 'react';
import { useCartStore } from '@/lib/store/cart-store';

// Mock the product data
jest.mock('@/lib/data/products', () => ({
  getProductById: jest.fn(),
  getProductBySlug: jest.fn(),
}));

import { getProductById, getProductBySlug } from '@/lib/data/products';

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useCartStore.getState().clearCart();
    });
    jest.clearAllMocks();
  });

  it('starts with empty cart', () => {
    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(getItemCount()).toBe(0);
    expect(getSubtotal()).toBe(0);
  });

  it('adds item to cart', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);
    (getProductBySlug as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 2);
    });

    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('1');
    expect(items[0].quantity).toBe(2);
    expect(getItemCount()).toBe(2);
    expect(getSubtotal()).toBe(1000);
  });

  it('increments quantity when adding same product', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 1);
      useCartStore.getState().addItem('1', 2);
    });

    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(getItemCount()).toBe(3);
    expect(getSubtotal()).toBe(1500);
  });

  it('removes item from cart', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 2);
      useCartStore.getState().removeItem('1');
    });

    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toHaveLength(0);
    expect(getItemCount()).toBe(0);
    expect(getSubtotal()).toBe(0);
  });

  it('updates quantity', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 2);
      useCartStore.getState().updateQuantity('1', 5);
    });

    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
    expect(getItemCount()).toBe(5);
    expect(getSubtotal()).toBe(2500);
  });

  it('removes item when quantity set to 0', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 2);
      useCartStore.getState().updateQuantity('1', 0);
    });

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('clears cart', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 2);
      useCartStore.getState().clearCart();
    });

    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toHaveLength(0);
    expect(getItemCount()).toBe(0);
    expect(getSubtotal()).toBe(0);
  });

  it('opens and closes drawer', () => {
    const { isDrawerOpen, openDrawer, closeDrawer } = useCartStore.getState();
    expect(isDrawerOpen).toBe(false);

    act(() => {
      openDrawer();
    });
    expect(useCartStore.getState().isDrawerOpen).toBe(true);

    act(() => {
      closeDrawer();
    });
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it('respects max quantity limit (99)', () => {
    const mockProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      price: 500,
      image: '/products/test.jpg',
    };
    
    (getProductById as jest.Mock).mockReturnValue(mockProduct);

    act(() => {
      useCartStore.getState().addItem('1', 50);
      useCartStore.getState().addItem('1', 60);
    });

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(99); // Capped at 99
  });

  it('handles product not found gracefully', () => {
    (getProductById as jest.Mock).mockReturnValue(null);
    (getProductBySlug as jest.Mock).mockReturnValue(null);

    act(() => {
      useCartStore.getState().addItem('nonexistent', 1);
    });

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('nonexistent');
    expect(items[0].product?.name).toBe('Pure Himalayan Product');
  });
});