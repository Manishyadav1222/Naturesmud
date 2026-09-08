import { NextResponse } from 'next/server';
import { products, normalizeProduct } from '@/lib/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestseller');
    const sort = searchParams.get('sort');
    const limit = parseInt(searchParams.get('limit') || searchParams.get('per_page') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    let result = products.map((p) => normalizeProduct(p));

    if (category && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === catLower ||
          p.categorySlug?.toLowerCase() === catLower ||
          p.tags?.some((t) => t.toLowerCase() === catLower)
      );
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (featured === 'true' || featured === '1') {
      result = result.filter((p) => p.isFeatured);
    }

    if (bestSeller === 'true' || bestSeller === '1') {
      result = result.filter((p) => p.isBestSeller);
    }

    if (sort) {
      if (sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'newest') {
        result.sort((a, b) => Number(b.id) - Number(a.id));
      }
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      per_page: limit,
      total_pages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
