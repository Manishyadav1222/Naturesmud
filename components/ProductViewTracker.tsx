'use client';

import { useEffect } from 'react';
import { trackEcommerceEvent } from '@/lib/analytics';

interface ProductViewTrackerProps {
  sku: string;
  slug: string;
  name: string;
  category: string;
  weight: string;
  price: number;
}

export default function ProductViewTracker({
  sku,
  slug,
  name,
  category,
  weight,
  price,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackEcommerceEvent('view_item', {
      value: price,
      items: [
        {
          item_id: sku || slug,
          item_name: name,
          item_category: category,
          item_variant: weight,
          price,
          quantity: 1,
        },
      ],
    });
  }, [sku, slug, name, category, weight, price]);

  return null;
}
