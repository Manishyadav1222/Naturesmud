import Link from 'next/link';
import { categories } from '@/lib/data/categories';
import { products as localProducts, normalizeProduct } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductSortSelect } from '@/components/ProductSortSelect';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const metadata = {
  title: "Products | Nature's Mud",
  description: 'Explore our full range of 100% natural and organic food products.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;

  let allProducts: Product[] = localProducts.map((p) => normalizeProduct(p));

  try {
    const params: Record<string, string | number> = { per_page: 50 };
    if (category) params.category = category;
    if (sort) {
      if (sort === 'price-asc') params.sort = 'price_asc';
      else if (sort === 'price-desc') params.sort = 'price_desc';
      else if (sort === 'rating') params.sort = 'rating';
      else if (sort === 'newest') params.sort = 'newest';
    }

    const res = await api.get('/products', { params });
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      allProducts = res.data.data
        .map((p: any) => normalizeProduct(p))
        .filter((p: any) => p.isActive !== false && p.is_active !== 0);
    }
  } catch (error) {
    // Fallback to local catalog if backend is briefly offline
    allProducts = localProducts.map((p) => normalizeProduct(p));
  }

  let filtered = allProducts;
  if (category) {
    filtered = filtered.filter(
      (p) => p.categorySlug === category || p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sort === 'popular') filtered = filtered.filter((p) => p.isBestSeller);

  return (
    <>
      {/* Header */}
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-[#3A6B35] font-medium">Products</li>
                </ol>
              </nav>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">
                {category
                  ? categories.find((c) => c.slug === category)?.name || category
                  : `All ${allProducts.length} Master Products`}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl text-sm sm:text-base">
                {category
                  ? categories.find((c) => c.slug === category)?.description || 'Premium organic superfoods and nutrition.'
                  : 'Discover our certified solar-dehydrated fruits, organic superfood powders, mountain nuts, seeds, and cold-pressed virgin oils.'}
              </p>
            </div>

            {/* Quick Catalog Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1B3D2F] hover:bg-[#2D5A27] text-white text-xs sm:text-sm font-heading font-bold shadow-sm transition-all"
              >
                Interactive Price List
              </Link>
              <a
                href="/Nature_Mud_Product_Catalog.pdf"
                download="Nature_Mud_Product_Catalog_2026.pdf"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9982A] hover:bg-[#B88720] text-[#1B3D2F] text-xs sm:text-sm font-heading font-bold shadow-sm transition-all"
              >
                Catalog
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-gray-100 bg-white sticky top-16 lg:top-20 z-30 shadow-sm w-full max-w-full overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto w-full max-w-full no-scrollbar">
          <Link
            href="/products"
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !category
                ? 'bg-[#3A6B35] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.slug
                  ? 'bg-[#3A6B35] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-semibold text-[#2B2B2B]">{filtered.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs sm:text-sm text-gray-600">Sort by:</label>
              <ProductSortSelect defaultValue={sort} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-[#F8F4EC]/50 rounded-3xl p-6 sm:p-8 border border-dashed border-gray-200">
              <p className="font-heading font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800">No products found</p>
              <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md mx-auto">Try a different category filter or browse our entire organic catalog.</p>
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#3A6B35] text-white font-semibold text-xs sm:text-sm hover:bg-[#2d5429] transition-colors shadow-sm">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((product, idx) => (
                <ProductCard key={product.id || product.slug} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}