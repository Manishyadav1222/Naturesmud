import Link from 'next/link';
import { Star, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { categories } from '@/lib/data/categories';
import { getProductBySlug, normalizeProduct, products } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';
import { BuyNowButton } from '@/components/BuyNowButton';
import ProductImageGallery from '@/components/ProductImageGallery';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductReviews from './ProductReviews';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Product Details | Nature\'s Mud',
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const localFallback = getProductBySlug(slug) || null;
  let product: Product | null = localFallback;

  try {
    const res = await api.get(`/products/${slug}`);
    if (res.data) {
      product = normalizeProduct(res.data, localFallback);
    }
  } catch {
    // Fallback to local catalog
    product = localFallback;
  }

  if (!product) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-[#3A6B35] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2D5329] transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    );
  }

  let related: Product[] = [];
  try {
    const relatedRes = await api.get(`/products/related/${slug}`);
    if (Array.isArray(relatedRes.data)) {
      related = relatedRes.data.map((r: any) => normalizeProduct(r));
    }
  } catch {
    // Fallback related products from local catalog
    related = products
      .filter((p) => (p.categorySlug === product?.categorySlug || p.category === product?.category) && p.slug !== product?.slug)
      .slice(0, 4);
  }

  const categoryName = typeof product.category === 'object' 
    ? (product.category as any)?.name 
    : (categories.find((c) => c.slug === product.categorySlug)?.name || product.category || 'Superfoods');

  const discount = (product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0) || 0;
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const nutrition = Array.isArray(product.nutrition) ? product.nutrition : [];

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/products/sweet-potato-powder-100g.jpg'];

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/products" className="hover:text-[#3A6B35]">Products</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#3A6B35]">{categoryName}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[#3A6B35] font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={productImages}
              productName={product.name}
              discount={discount}
              badges={badges}
            />
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold text-[#3A6B35] uppercase tracking-wider mb-2">
              {categoryName}
            </p>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B] mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#D9A441]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 5) ? 'fill-[#D9A441]' : 'fill-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating || 4.8}</span>
              <span className="text-sm text-gray-500">({product.reviewCount || 12} reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading font-bold text-3xl text-[#2B2B2B]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.weight && (
                <span className="text-sm text-gray-500">
                  / {/^[0-9]+(\.[0-9]+)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)}g` : product.weight}
                </span>
              )}
            </div>

            {/* Stock status */}
            <p className="flex items-center gap-1.5 text-sm mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? (
                <span className="text-green-700 font-medium">In Stock — Ready to ship</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>

            {/* Add to cart & Buy Now */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <AddToCartButton productId={product.id} product={product} />
              <BuyNowButton productId={product.id} product={product} variant="gold" label="⚡ Buy Now" />
            </div>

            {/* Key benefits */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Truck, text: 'Free delivery on orders over Rs. 10,000' },
                { icon: ShieldCheck, text: 'Quality checked & certified organic' },
                { icon: Leaf, text: '100% natural — no artificial anything' },
              ].map((item) => (
                <p key={item.text} className="flex items-center gap-3 text-sm text-gray-700">
                  <item.icon className="w-5 h-5 text-[#3A6B35]" /> {item.text}
                </p>
              ))}
            </div>

            {/* Ingredients & Benefits */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <div>
                <h2 className="font-heading font-semibold text-lg mb-3">Ingredients</h2>
                <ul className="flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <li key={ing} className="bg-[#F8F4EC] px-3 py-1.5 rounded-full text-sm">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg mb-3">Key Benefits</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                      <Leaf className="w-4 h-4 text-[#7AA95C] shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nutrition */}
            {nutrition.length > 0 && (
              <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-[#3A6B35] text-white px-6 py-3">
                  <h2 className="font-heading font-semibold">Nutrition Facts</h2>
                  <p className="text-xs text-white/70">Per 100g serving</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {nutrition.map((n) => (
                      <tr key={n.label} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-6 py-3 text-gray-600">{n.label}</td>
                        <td className="px-6 py-3 font-semibold text-right">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Product Video Reel Section (if available) */}
        {(() => {
          const productVideoMap: Record<string, { videoUrl: string; title: string; desc: string }> = {
            'sweet-potato-powder': {
              videoUrl: '/videos/naturesmud-screen-reel.mp4',
              title: 'Organic Sweet Potato Dehydration & Baby Weaning Story',
              desc: 'Watch how farm-fresh Nepali sweet potatoes are gently solar-dehydrated and micro-milled into silky 100g powder.',
            },
            'dates-powder': {
              videoUrl: '/videos/dates-powder-energy.mp4',
              title: 'Natural Dates Powder — 0% White Sugar Preparation',
              desc: 'Whole dried dates micro-ground into 100g unrefined natural sweetener for children and daily cooking.',
            },
            'beetroot-powder': {
              videoUrl: '/videos/beetroot-family.mp4',
              title: 'Cold-Milled Himalayan Beetroot Nitric Oxide Reel',
              desc: 'Deep crimson hill roots dehydrated below 42°C to protect live dietary nitrates and antioxidants.',
            },
            'dried-blueberries': {
              videoUrl: '/videos/blueberries-stress.mp4',
              title: 'Wild Himalayan Blueberry Alpine Harvest Reel',
              desc: 'Foraged at 3,200m altitude in Nepal and gently dried without sugar or sulfur.',
            },
            'carrot-powder': {
              videoUrl: '/videos/naturesmud-product-reel.mp4',
              title: "Nature's Mud 100g Pure Food Collection in Action",
              desc: 'Single-ingredient superfoods from Nepal’s 3 ecological belts delivered in eco glass jars.',
            },
            'roasted-almonds': {
              videoUrl: '/videos/almonds-brain.mp4',
              title: 'Slow Dry-Roasted Himalayan Almonds',
              desc: 'Crunchy mountain almonds seasoned with pure pink rock salt.',
            },
            'raw-honey': {
              videoUrl: '/videos/coconut-oil-ad.mp4',
              title: 'Mustang Wild Cliff Honey Extraction',
              desc: '100% raw, unheated wild cliff honey harvested from high alpine cliffs.',
            },
            'dehydrated-papaya': {
              videoUrl: '/videos/apple.mp4',
              title: 'Active Papain Enzyme Dehydrated Papaya Slices',
              desc: 'Tree-ripened organic papayas slowly dehydrated for digestive health.',
            },
            'dehydrated-mango': {
              videoUrl: '/videos/apple.mp4',
              title: 'Sun-Dried Himalayan Sweet Mango Slices',
              desc: '100% pure sunshine dried mango slices from warm valleys of Nepal.',
            },
          };

          const matchedVideo = productVideoMap[product.slug] || productVideoMap['sweet-potato-powder'];

          return (
            <div className="mt-16 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                    🎥 Authentic Product Video
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                    {matchedVideo.title}
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    {matchedVideo.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href="/our-story"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#D9A441] hover:underline"
                    >
                      <span>Read Nepal Farmer Provenance Story</span> &rarr;
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
                    <video
                      src={matchedVideo.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Farmer Provenance Trust Banner */}
        <div className="mt-8 bg-[#FAF8F5] border border-stone-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-[#3A6B35] uppercase tracking-wider">
              🌾 100% Nepali Farmer Sourced
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-stone-900">
              Direct Fair-Trade from Nepal’s Terai, Hills & Himalayas
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Every 100g jar supports rural organic cooperatives with guaranteed +35% above-market pricing and zero chemical additives.
            </p>
          </div>
          <Link
            href="/our-story"
            className="px-6 py-3 rounded-full bg-[#3A6B35] hover:bg-[#2e552a] text-white font-bold text-xs shrink-0 shadow-md transition-all"
          >
            Learn How We Help Farmers
          </Link>
        </div>

        {/* Reviews */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading font-bold text-2xl mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}