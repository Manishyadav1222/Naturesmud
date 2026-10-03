import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { categories } from '@/lib/data/categories';
import { products as localProducts, normalizeProduct } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductSortSelect } from '@/components/ProductSortSelect';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORY_SEO_META: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    guideTitle: string;
    guideBody: string;
    bestFor: string[];
  }
> = {
  'dried-fruits': {
    title: 'Naturally Dehydrated Fruits in Nepal — Mango, Pineapple, Apple, Berries & Anjeer',
    description:
      'Buy 100% natural dehydrated fruits in Nepal from NaturesMud: sun-dried mango, pineapple, Himalayan apple rings, papaya, blueberries, cranberries & dry figs (Anjeer). 0 added sugar, 0 sulfur dioxide, 0 preservatives.',
    h1: 'Naturally Dehydrated Fruits in Nepal',
    guideTitle: 'Why Choose NaturesMud Naturally Dehydrated Fruits Over Commercial Candied Dry Fruit?',
    guideBody:
      'Most commercial dried fruits sold in supermarkets are boiled in refined sugar syrup and treated with sulfur dioxide (E220) to artificially preserve color. NaturesMud dehydrated fruits—including Himalayan Apple Rings, Mango, Pineapple, Papaya, Dried Blueberries, Cranberries, Coconut Chips, and Dry Figs (Anjeer)—are gently dehydrated at low temperatures with 0 added sugar, 0 preservatives, and 0 sulfur.',
    bestFor: [
      'Clean office desk snacking & school tiffin boxes in Kathmandu & Pokhara',
      'Lightweight, high-energy trail fuel for Himalayan trekking & hiking',
      'Morning oatmeal, chia seed pudding, smoothie bowls & festive gifting',
    ],
  },
  powders: {
    title: 'Pure Superfood & Baby Weaning Powders in Nepal — Avocado, Banana, Strawberry, Moringa & Dates',
    description:
      'Shop 100% pure superfood powders in Nepal: Freeze-Dried Avocado Powder, Strawberry Powder, Banana Powder, Organic Moringa, Sweet Potato, Beetroot, Carrot & Dates Powder. 0 additives, 0 preservatives — ideal for baby weaning, smoothies & daily wellness.',
    h1: 'Pure Superfood & Fruit/Vegetable Powders in Nepal',
    guideTitle: 'Single-Ingredient Himalayan Superfood Powders for Baby Weaning, Smoothies & Daily Nutrition',
    guideBody:
      'NaturesMud Superfood Powders are crafted from 100% real fruits, roots, and botanical leaves—Freeze-Dried Avocado Powder, Freeze-Dried Strawberry Powder, Pure Banana Powder, Organic Moringa Leaf Powder, Sweet Potato Powder, Beetroot Powder, Carrot Powder, and Natural Dates Powder Sweetener. Every jar contains a single whole-food ingredient with 0 maltodextrin, 0 artificial flavors, 0 preservatives, and 0 refined sugar.',
    bestFor: [
      'Wholesome 6+ month infant weaning porridge (lito, jaulo, kheer) & toddler nutrition',
      'Natural sugar-free sweetening with 100% Dates Powder instead of white sugar',
      'Pre-workout nitric oxide stamina (Beetroot) & daily green micronutrient boosts (Moringa)',
    ],
  },
  nuts: {
    title: 'Premium Mountain Nuts in Nepal — Raw & Roasted Almonds, Cashews, Pistachios & Trail Mix',
    description:
      'Order premium whole nuts online in Nepal: Raw Himalayan Almonds, Roasted Almonds, Cashew Nuts, Roasted & Salted Pistachios, Macadamia Nuts & Superfood Trail Mix. Packed fresh in glass jars with nationwide delivery.',
    h1: 'Premium Mountain Nuts & Trail Mixes in Nepal',
    guideTitle: 'Unbleached, Crunch-Locked Whole Nuts Packed in Airtight Glass Jars',
    guideBody:
      'From unpasteurized Raw Himalayan Almonds (ideal for overnight soaking / badam pani) to slow dry-roasted Cashews, Pistachios, Macadamia Nuts, and our signature Superfood Trail Mix, NaturesMud nuts are hand-graded for kernel size and freshness without palm oil frying or chemical bleaching.',
    bestFor: [
      'Morning soaked almonds (badam) for student memory & cognitive focus',
      'High-protein post-workout recovery & heart-healthy monounsaturated fats',
      'Dashain, Tihar, Raksha Bandhan & corporate wellness gift hampers in Nepal',
    ],
  },
  seeds: {
    title: 'Organic Superfood Seeds in Nepal — Chia Seeds, Pumpkin Seeds, Flax Seeds (Alash) & Makhana',
    description:
      'Buy nutrient-dense superfood seeds in Nepal: Organic Black Chia Seeds, Raw Green Pumpkin Seeds (Pepitas), Brown Flax Seeds (Alash) & Makhana (Fox Nuts). Rich in Omega-3, zinc, magnesium & prebiotic fiber.',
    h1: 'Organic Superfood Seeds & Makhana in Nepal',
    guideTitle: 'Plant Omega-3, Zinc & Prebiotic Fiber: Essential Daily Seeds for Nepali Kitchens',
    guideBody:
      'Seeds are nature’s most concentrated reservoirs of trace minerals and essential fatty acids. Our collection includes hydrophilic Black Chia Seeds, AAA-grade Raw Green Pumpkin Seeds rich in zinc and magnesium, whole Brown Flax Seeds (Alash), and crunchy Makhana (Fox Nuts).',
    bestFor: [
      'Overnight chia seed puddings & morning lemon-chia gut hydration',
      'Zinc & magnesium support from raw pumpkin seeds for sleep, hair & immunity',
      'Low-GI roasted Makhana snacking for weight management & diabetes-friendly diets',
    ],
  },
  oils: {
    title: 'Cold-Pressed Extra Virgin Coconut Oil in Nepal (500ml & 180ml) | NaturesMud',
    description:
      'Buy 100% pure cold-pressed Extra Virgin Coconut Oil (500ml & 180ml) in Nepal. Unrefined, chemical-free, rich in Lauric Acid & MCTs for clean cooking, baby massage, oil pulling, hair & skin care.',
    h1: 'Cold-Pressed Extra Virgin Coconut Oil in Nepal',
    guideTitle: 'Unrefined Cold-Pressed Virgin Coconut Oil — Culinary, Baby Care & Ayurvedic Purity',
    guideBody:
      'Extracted from fresh coconut milk without heat, hexane solvents, bleaching, or deodorizing, NaturesMud Cold-Pressed Extra Virgin Coconut Oil retains its natural Lauric Acid (MCT) profile and gentle fresh coconut aroma. Available in 500ml and 180ml jars.',
    bestFor: [
      'Clean ketogenic & everyday cooking, baking, and bulletproof coffee',
      'Gentle, chemical-free baby skin massage & cradle-cap nourishment',
      'Ayurvedic morning oil pulling (Gandusha) & deep hair/scalp conditioning',
    ],
  },
  'salts-spices': {
    title: 'Himalayan Pink Rock Salt & Black Salt (Bire Noon) in Nepal | NaturesMud',
    description:
      'Shop unrefined Himalayan Pink Rock Salt (Sindhe Noon) and Ayurvedic Himalayan Black Salt (Bire Noon) in Nepal. Rich in 84 natural trace minerals with 0 anti-caking chemicals.',
    h1: 'Pure Himalayan Pink Salt & Black Salt (Bire Noon) in Nepal',
    guideTitle: 'Ancient Unrefined Himalayan Mineral Salts with Zero Anti-Caking Agents',
    guideBody:
      'Replace heavily bleached industrial table salt with NaturesMud unrefined Himalayan Pink Rock Salt (Sindhe Noon) and traditional Ayurvedic Black Salt (Bire Noon). Naturally rich in trace minerals and electrolytes to support digestion and hydration.',
    bestFor: [
      'Everyday mineral-rich cooking & electrolyte hydration water',
      'Digestive fruit salads, lemon-water, and traditional Nepali chutneys with Bire Noon',
    ],
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const catMeta = category ? CATEGORY_SEO_META[category] : null;

  const title = catMeta
    ? catMeta.title
    : 'Shop All Pure Himalayan Superfoods, Dehydrated Fruits, Powders, Nuts & Seeds in Nepal';
  const description = catMeta
    ? catMeta.description
    : 'Browse all 33+ NaturesMud pure food products in Nepal with 0 additives & 0 preservatives: freeze-dried avocado & strawberry powders, banana & moringa powders, sweet potato & dates powders, dehydrated fruits, mountain nuts, chia & pumpkin seeds, and virgin coconut oil.';
  const canonicalUrl = category
    ? `${baseUrl}/products?category=${encodeURIComponent(category)}`
    : `${baseUrl}/products`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | NaturesMud Nepal`,
      description,
      url: canonicalUrl,
      siteName: 'NaturesMud Nepal',
      type: 'website',
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';

  let allProducts: Product[] = localProducts.map((p) => normalizeProduct(p));

  try {
    const params: Record<string, string | number> = { per_page: 100, _t: Date.now() };
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

  const activeCategoryObj = category ? categories.find((c) => c.slug === category) : null;
  const activeSeoMeta = category ? CATEGORY_SEO_META[category] : null;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': category
          ? `${baseUrl}/products?category=${category}#collection`
          : `${baseUrl}/products#collection`,
        name: activeSeoMeta?.h1 || activeCategoryObj?.name || 'Pure Himalayan Superfoods in Nepal',
        description:
          activeSeoMeta?.description ||
          'Explore 100% natural dehydrated fruits, pure superfood powders, raw mountain nuts, seeds, and cold-pressed virgin oils across Nepal.',
        url: category ? `${baseUrl}/products?category=${category}` : `${baseUrl}/products`,
        isPartOf: { '@id': `${baseUrl}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: filtered.length,
          itemListElement: filtered.slice(0, 30).map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: p.name,
            url: `${baseUrl}/products/${p.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/products` },
          ...(activeCategoryObj
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: activeCategoryObj.name,
                  item: `${baseUrl}/products?category=${activeCategoryObj.slug}`,
                },
              ]
            : []),
        ],
      },
    ],
  };

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
                  <li><Link href="/products" className="hover:text-[#3A6B35]">Products</Link></li>
                  {activeCategoryObj && (
                    <>
                      <li aria-hidden="true">/</li>
                      <li className="text-[#3A6B35] font-medium">{activeCategoryObj.name}</li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#2B2B2B] tracking-tight">
                {activeSeoMeta?.h1 ||
                  (category
                    ? activeCategoryObj?.name || category
                    : 'Pure Himalayan Superfoods in Nepal')}
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                {activeSeoMeta?.description ||
                  (category
                    ? activeCategoryObj?.description || 'Pure superfoods and whole food nutrition with 0 additives.'
                    : 'Explore 100% natural dehydrated fruits, pure superfood powders, raw mountain nuts, seeds, and cold-pressed virgin oils delivered across Kathmandu, Pokhara & all 77 districts of Nepal.')}
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
                href="/api/catalog/download"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9982A] hover:bg-[#B88720] text-[#1B3D2F] text-xs sm:text-sm font-heading font-bold shadow-sm transition-all"
              >
                Download Catalog (PDF)
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
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> pure whole-food products
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs sm:text-sm text-gray-600">Sort by:</label>
              <ProductSortSelect defaultValue={sort} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-[#F8F4EC]/50 rounded-3xl p-6 sm:p-8 border border-dashed border-gray-200">
              <p className="font-heading font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-800">No products found</p>
              <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-md mx-auto">Try a different category filter or browse our entire catalog.</p>
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

          {/* Category Buying Guide & SEO Context Block */}
          <div className="mt-16 bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-stone-200/80">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1A3826] mb-3">
              {activeSeoMeta?.guideTitle ||
                'Why Nepali Families Trust NaturesMud Pure Superfoods, Powders & Dehydrated Fruits'}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              {activeSeoMeta?.guideBody ||
                'Every NaturesMud product is crafted with a strict 0-Additive, 0-Preservative, and 0-Refined-Sugar standard. Whether you are preparing nutrient-dense first weaning porridge for a 6-month-old baby, replacing refined white sugar with 100% Dates Powder, packing lightweight dehydrated fruits for a Himalayan trek, or stocking your family pantry with raw mountain almonds, chia seeds, pumpkin seeds, and cold-pressed virgin coconut oil, we deliver pure whole foods directly to your doorstep across Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda, Nepalgunj, and Surkhet.'}
            </p>
            {activeSeoMeta?.bestFor && (
              <div className="mb-6">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-[#7A5230] mb-2.5">
                  Ideal Daily Uses in Nepal:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeSeoMeta.bestFor.map((item, i) => (
                    <li
                      key={i}
                      className="bg-white rounded-xl p-3.5 text-xs sm:text-sm text-gray-700 border border-stone-200/60 font-medium"
                    >
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-200/80 text-xs sm:text-sm font-semibold text-[#3A6B35]">
              <Link href="/catalog" className="hover:underline">
                View Complete 2026 Price List →
              </Link>
              <span>·</span>
              <Link href="/offers" className="hover:underline">
                Explore Superfood Combo Offers →
              </Link>
              <span>·</span>
              <Link href="/recipes" className="hover:underline">
                Browse Healthy Superfood Recipes →
              </Link>
              <span>·</span>
              <Link href="/blog" className="hover:underline">
                Read Nutrition &amp; Weaning Guides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
    </>
  );
}