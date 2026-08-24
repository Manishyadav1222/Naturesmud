'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useUIStore } from '@/lib/store/ui-store';
import { classNames } from '@/lib/utils';
import { toast } from 'sonner';

interface BuyNowButtonProps {
  productId?: string;
  product?: any;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'gold' | 'emerald' | 'amber';
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function BuyNowButton({
  productId,
  product,
  quantity = 1,
  size = 'lg',
  variant = 'gold',
  label = 'Buy Now',
  className = '',
  showIcon = true,
}: BuyNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const closeQuickView = useUIStore((s) => s.closeQuickView);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsNavigating(true);
    const itemToAdd = product || productId;
    if (itemToAdd) {
      addItem(itemToAdd, quantity);
    }
    
    // Close any open drawers / modals
    closeDrawer();
    closeQuickView();

    toast.success('Redirecting directly to secure checkout...');
    router.push('/checkout');
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const variantClasses = {
    gold: 'bg-gradient-to-r from-[#D9A441] via-[#E8B859] to-[#C9982A] text-white hover:brightness-105 shadow-[0_4px_16px_rgba(217,164,65,0.35)]',
    primary: 'bg-gradient-to-r from-primary via-primary-600 to-emerald-700 text-white hover:brightness-105 shadow-[0_4px_16px_rgba(58,107,53,0.35)]',
    emerald: 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white hover:brightness-105 shadow-[0_4px_16px_rgba(5,150,105,0.35)]',
    amber: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white hover:brightness-105 shadow-[0_4px_16px_rgba(217,119,6,0.35)]',
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={isNavigating}
      className={classNames(
        'group relative inline-flex items-center justify-center font-heading font-extrabold rounded-full transition-all duration-300 active:scale-95 hover:-translate-y-0.5 cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={`${label} - Proceed directly to checkout`}
    >
      {isNavigating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {showIcon && <Zap className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export default BuyNowButton;
