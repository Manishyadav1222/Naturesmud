'use client';

import { useRouter } from 'next/navigation';

interface ProductSortSelectProps {
  defaultValue?: string;
}

export function ProductSortSelect({ defaultValue }: ProductSortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(window.location.search);
    if (e.target.value) params.set('sort', e.target.value);
    else params.delete('sort');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      id="sort"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7AA95C]"
    >
      <option value="">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
      <option value="newest">Newest</option>
    </select>
  );
}