'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { Product } from '@/lib/types';

interface RecipeAddIngredientsButtonProps {
  products: Product[];
}

export default function RecipeAddIngredientsButton({ products }: RecipeAddIngredientsButtonProps) {
  const { addItem, openDrawer } = useCartStore();
  const [added, setAdded] = useState(false);

  if (!products || products.length === 0) return null;

  const totalPrice = products.reduce((acc, p) => acc + Number(p.price || 0), 0);

  const handleAddAll = () => {
    for (const p of products) {
      addItem(
        {
          id: p.id,
          slug: p.slug,
          name: p.official_label_name || p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          image: p.image,
          images: p.images,
          weight: p.weight,
          category: p.category,
        },
        1
      );
    }
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <button
      type="button"
      onClick={handleAddAll}
      className="w-full py-3.5 px-5 rounded-2xl bg-[#2D5A27] hover:bg-[#23471e] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
    >
      {added ? (
        <>
          <Check className="w-4 h-4 text-[#EBC164]" />
          <span>Added {products.length} Ingredients to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 text-[#EBC164]" />
          <span>
            Add {products.length} Recipe {products.length === 1 ? 'Ingredient' : 'Ingredients'} to Cart (Rs. {totalPrice.toLocaleString('en-NP')})
          </span>
        </>
      )}
    </button>
  );
}
