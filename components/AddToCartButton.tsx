'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { classNames } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  product?: any;
  size?: 'md' | 'lg';
}

export function AddToCartButton({ productId, product, size = 'lg' }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(product || productId);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={classNames(
        'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
        size === 'lg' ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm',
        added
          ? 'bg-green-600 text-white'
          : 'bg-[#3A6B35] text-white hover:bg-[#2d5429] shadow-lg shadow-[#3A6B35]/25 hover:shadow-xl'
      )}
      aria-label={added ? 'Added to cart' : 'Add to cart'}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> Added to Cart!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" /> Add to Cart
        </>
      )}
    </button>
  );
}