import { act } from 'react';
import { useWishlistStore } from '@/lib/store/wishlist-store';

describe('Wishlist Store', () => {
  beforeEach(() => {
    act(() => {
      useWishlistStore.getState().clearWishlist();
    });
  });

  it('starts with empty wishlist', () => {
    const { items, getItemCount } = useWishlistStore.getState();
    expect(items).toEqual([]);
    expect(getItemCount()).toBe(0);
  });

  it('adds item to wishlist', () => {
    act(() => {
      useWishlistStore.getState().addItem('1');
    });

    const { items, getItemCount, isInWishlist } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toBe('1');
    expect(getItemCount()).toBe(1);
    expect(isInWishlist('1')).toBe(true);
  });

  it('does not add duplicate items', () => {
    act(() => {
      useWishlistStore.getState().addItem('1');
      useWishlistStore.getState().addItem('1');
    });

    const { items, getItemCount } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(getItemCount()).toBe(1);
  });

  it('removes item from wishlist', () => {
    act(() => {
      useWishlistStore.getState().addItem('1');
      useWishlistStore.getState().removeItem('1');
    });

    const { items, getItemCount, isInWishlist } = useWishlistStore.getState();
    expect(items).toHaveLength(0);
    expect(getItemCount()).toBe(0);
    expect(isInWishlist('1')).toBe(false);
  });

  it('toggles item in wishlist', () => {
    const { isInWishlist, toggleItem } = useWishlistStore.getState();

    expect(isInWishlist('1')).toBe(false);

    act(() => {
      toggleItem('1');
    });
    expect(isInWishlist('1')).toBe(true);

    act(() => {
      toggleItem('1');
    });
    expect(isInWishlist('1')).toBe(false);
  });

  it('clears wishlist', () => {
    act(() => {
      useWishlistStore.getState().addItem('1');
      useWishlistStore.getState().addItem('2');
      useWishlistStore.getState().clearWishlist();
    });

    const { items, getItemCount } = useWishlistStore.getState();
    expect(items).toHaveLength(0);
    expect(getItemCount()).toBe(0);
  });
});