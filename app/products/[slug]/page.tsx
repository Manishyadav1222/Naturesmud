import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Truck,
  ShieldCheck,
  Leaf,
  MessageCircle,
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Sparkles,
  BookOpen,
  Utensils,
} from 'lucide-react';
import { categories } from '@/lib/data/categories';
import { getProductBySlug, normalizeProduct, products } from '@/lib/data/products';
import { getProductDossier, getNepaliLayer, formatUnitPrice } from '@/lib/data/product-seo-dossier';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';
import { BuyNowButton } from '@/components/BuyNowButton';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductVisualsGallery from '@/components/ProductVisualsGallery';
import ProductLeftVideoReel, { ProductVideoClip } from '@/components/ProductLeftVideoReel';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductReviews from './ProductReviews';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import FeaturesStrip from '@/components/FeaturesStrip';
import ProductViewTracker from '@/components/ProductViewTracker';
import DeliveryCalculator from '@/components/DeliveryCalculator';
import MobileStickyAddToCart from '@/components/MobileStickyAddToCart';
import { siteConfig } from '@/lib/site';
import { recipes } from '@/lib/data/recipes';
import { masterBlogCatalog } from '@/lib/data/blogs-database';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const localFallback = getProductBySlug(slug) || null;
  let product: Product | null = localFallback ? normalizeProduct(localFallback) : null;
  try {
    const res = await api.get(`/products/${slug}`, {
      params: { nocache: 1, _t: Date.now() },
    });
    if (res.data) {
      const payload = res.data.data || res.data;
      product = normalizeProduct(payload, localFallback);
      if (
        product &&
        ((product as any).isActive === false ||
          (product as any).is_active === 0 ||
          (product as any).status === 'ARCHIVED')
      ) {
        product = null;
      }
    }
  } catch {
    // Keep localFallback if API is unreachable
  }

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested NaturesMud product is not available.',
      robots: { index: false, follow: true },
    };
  }

  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const officialName = product.official_label_name || product.name;
  const weightLabel = product.weight || '100 GM';
  const dossier = getProductDossier(product.slug, product);

  const rawTitle = dossier?.seoTitle || `${officialName} Price in Nepal | NaturesMud`;
  const title = rawTitle.length <= 60 ? rawTitle : rawTitle.slice(0, 60);

  let description = dossier?.metaDescription;
  if (!description) {
    const baseDesc = `Buy pure ${officialName} (${weightLabel}) at Rs. ${product.price} in Nepal. 100% pure whole food with 0 additives. Fast delivery in Kathmandu & Nepal.`;
    description = baseDesc.length > 155 ? baseDesc.slice(0, 155) : baseDesc.padEnd(142, ' ');
  }

  const img =
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    '/products/naturesmud-all-products-100g.jpg';
  const canonicalUrl = `${baseUrl}/products/${product.slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'NaturesMud Nepal',
      images: [
        {
          url: img.startsWith('http') ? img : `${baseUrl}${img}`,
          width: 800,
          height: 800,
          alt: `${officialName} ${weightLabel} - NaturesMud Nepal`,
        },
      ],
      type: 'website',
    },
    other: {
      'og:type': 'product',
      'product:price:amount': String(product.price),
      'product:price:currency': 'NPR',
      'product:availability': product.inStock !== false ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:retailer_item_id': product.slug,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img.startsWith('http') ? img : `${baseUrl}${img}`],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const localFallback = getProductBySlug(slug) || null;
  let product: Product | null = localFallback ? normalizeProduct(localFallback) : null;
  let rawApiReviews: any[] = [];

  try {
    const res = await api.get(`/products/${slug}`, {
      params: { nocache: 1, _t: Date.now() },
    });
    if (res.data) {
      const payload = res.data.data || res.data;
      if (Array.isArray(payload.reviews) && payload.reviews.length > 0) {
        rawApiReviews = payload.reviews;
      }
      product = normalizeProduct(payload, localFallback);
      if (
        product &&
        ((product as any).isActive === false ||
          (product as any).is_active === 0 ||
          (product as any).status === 'ARCHIVED')
      ) {
        product = null;
      }
    }
  } catch {
    // Keep localFallback if API is unreachable
  }

  if (rawApiReviews.length === 0) {
    try {
      const revRes = await fetch(
        `https://api.naturesmud.shop/reviews-api.php?product=${encodeURIComponent(slug)}`,
        { next: { revalidate: 60 } }
      );
      if (revRes.ok) {
        const revJson = await revRes.json();
        if (Array.isArray(revJson?.data)) {
          rawApiReviews = revJson.data;
        }
      }
    } catch {
      // Non-blocking review fallback
    }
  }

  if (!product) {
    notFound();
  }

  // Only count and display reviews that are approved AND have actual visible review text
  const visibleReviews = rawApiReviews
    .filter(
      (r: any) =>
        r &&
        r.is_approved !== false &&
        r.is_approved !== 0 &&
        typeof (r.body || r.content) === 'string' &&
        (r.body || r.content).trim().length > 0
    )
    .map((r: any) => ({
      id: String(r.id),
      author: r.customer_name || r.user?.name || r.author || 'Customer',
      title: r.title || '',
      content: (r.body || r.content || '').trim(),
      rating: Number(r.rating) || 5,
      images: Array.isArray(r.images) ? r.images : [],
      isVerified: Boolean(r.is_verified || r.order_id || r.order_number),
      orderNumber: r.order_number || undefined,
      createdAt: r.created_at || new Date().toISOString(),
    }));

  const verifiedReviewCount = visibleReviews.length;
  const verifiedAvgRating =
    verifiedReviewCount > 0
      ? Number(
          (
            visibleReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
            verifiedReviewCount
          ).toFixed(1)
        )
      : 0;

  const dossier = getProductDossier(product.slug, product);
  const officialName = product.official_label_name || product.name;
  const unitPriceLabel = formatUnitPrice(product.price, product.weight);

  // Build complementary & related products (prioritize dossier.complementarySlugs, then same-category)
  const complementaryProducts: Product[] = [];
  if (dossier?.complementarySlugs) {
    for (const cSlug of dossier.complementarySlugs) {
      const found = getProductBySlug(cSlug);
      if (found && found.slug !== product.slug) {
        complementaryProducts.push(normalizeProduct(found));
      }
    }
  }
  for (const p of products) {
    if (
      complementaryProducts.length < 4 &&
      p.slug !== product.slug &&
      !complementaryProducts.some((cp) => cp.slug === p.slug) &&
      p.categorySlug === product.categorySlug
    ) {
      complementaryProducts.push(normalizeProduct(p));
    }
  }

  const categoryName =
    typeof product.category === 'object'
      ? (product.category as any)?.name
      : categories.find((c) => c.slug === product.categorySlug)?.name ||
        product.category ||
        'Superfoods';

  const discount =
    (product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0) || 0;
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const nutrition = Array.isArray(product.nutrition) ? product.nutrition : [];

  const rawImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || '/products/sweet-potato-powder-100g.jpg'];
  const productImages = Array.from(new Set(rawImages));

  const faqItems =
    dossier?.faqs && dossier.faqs.length > 0
      ? dossier.faqs
      : [
          {
            q: `What are the exact ingredients in NaturesMud ${officialName}?`,
            a:
              ingredients.length > 0
                ? `NaturesMud ${officialName} (${product.weight || '100 GM'}) contains: ${ingredients.join(', ')}. It is 100% pure whole food with 0 artificial additives, 0 preservatives, and 0 added refined sugar.`
                : `NaturesMud ${officialName} (${product.weight || '100 GM'}) is crafted from 100% pure whole-food ingredients with 0 artificial additives, 0 preservatives, and 0 added refined sugar.`,
          },
          {
            q: `How do I use ${officialName} in daily Nepali meals?`,
            a:
              product.usage ||
              `Enjoy ${officialName} directly as a clean whole-food snack, or mix into warm milk, porridge, smoothies, yogurt bowls, and everyday Nepali kitchen recipes.`,
          },
          {
            q: `How should ${officialName} be stored during Nepal's monsoon humidity?`,
            a:
              product.storage ||
              `Store ${officialName} in its tightly sealed ${product.packing || 'airtight container'} in a cool, dry cupboard away from direct sunlight and moisture. Always use a dry spoon.`,
          },
          {
            q: `What is the price of ${officialName} in Nepal and where do you deliver?`,
            a: `NaturesMud ${officialName} (${product.weight || '100 GM'}) is priced at Rs. ${product.price} (${unitPriceLabel}) in Nepal. We deliver in 24–48 hours across Kathmandu Valley and 2–5 business days across all 77 districts.`,
          },
        ];

  // Product-specific & category-matched video reels for the Left Column and Lower Video Showcase
  const productVideoClipsMap: Record<string, ProductVideoClip[]> = {
    'sweet-potato-powder': [
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'Sweet Potato Powder — Preparation & Baby Weaning Guide',
        desc: 'See how Nepali sweet potatoes (Sakharkhanda) are gently dehydrated and milled into smooth 100 GM flour with 0 additives.',
        badge: 'Weaning & Kitchen',
      },
      {
        videoUrl: '/videos/banana-sweet-potato-cranberry-reel.mp4',
        title: 'Banana, Sweet Potato & Cranberry Family Trio',
        desc: 'Pure Sweet Potato Powder paired with Banana Powder and Dried Cranberries for infant weaning (from 6 months, as advised by your pediatrician) and smoothies.',
        badge: 'Family Trio',
      },
      {
        videoUrl: '/videos/clip-22.mp4',
        title: '100% Pure Dehydrated Sweet Potato Powder (100 GM)',
        desc: 'Fine, single-ingredient sweet potato flour sealed in a reusable glass jar.',
        badge: 'Pure Root Flour',
      },
      {
        videoUrl: '/videos/clip-27.mp4',
        title: 'Instant 2-Minute Sweet Potato Porridge & Puree',
        desc: 'Whisk into warm water or milk for a velvety, lump-free bowl.',
        badge: 'Quick Prep',
      },
    ],
    'dates-powder': [
      {
        videoUrl: '/videos/dates-powder-reel.mp4',
        title: 'Dates Powder (Khajur Powder) — 0% White Sugar Natural Sweetener',
        desc: 'Whole dry dates cold-milled into a 100 GM natural sweetener for baby porridge (from 6 months, as advised by your pediatrician), milk, and baking.',
        badge: '0% White Sugar',
      },
      {
        videoUrl: '/videos/dates-powder-energy.mp4',
        title: 'Dates Powder — Natural Caramel Sweetness & Dietary Fiber',
        desc: 'Replace refined white sugar 1:1 in warm milk, oats, suji halwa, and homemade baking.',
        badge: 'Natural Sweetener',
      },
      {
        videoUrl: '/videos/clip-3.mp4',
        title: 'Inside Our 100 GM Dates Powder Glass Jar',
        desc: 'Finely milled from 100% pitted dry dates with 0 anti-caking agents or preservatives.',
        badge: '100% Whole Dates',
      },
      {
        videoUrl: '/videos/clip-29.mp4',
        title: 'Dates, Sweet Potato, Carrot & Beetroot Powder Collection',
        desc: 'Our signature 100 GM glass jar superfood powder family.',
        badge: 'Collection',
      },
    ],
    'beetroot-powder': [
      {
        videoUrl: '/videos/beetroot-powder-promo.mp4',
        title: 'Beetroot Powder (Chukandar Powder) — Cold-Milled in Nepal',
        desc: 'Deep-crimson Nepali beetroots gently dehydrated to retain natural dietary nitrates and betalain color.',
        badge: 'Nitrate Stamina',
      },
      {
        videoUrl: '/videos/beetroot-stamina-drink.mp4',
        title: 'Beetroot Pre-Workout & Morning Stamina Drink',
        desc: 'Mix 1 teaspoon into chilled water, lime juice, or smoothies 30 minutes before workouts.',
        badge: 'Pre-Workout',
      },
      {
        videoUrl: '/videos/beetroot-motion-ad.mp4',
        title: '100% Pure Dehydrated Beetroot Powder (100 GM)',
        desc: 'Vibrant ruby root powder for smoothies, pink chapatis, curd dips, and natural food coloring.',
        badge: '0% Artificial Dye',
      },
      {
        videoUrl: '/videos/clip-26.mp4',
        title: 'Everyday Kitchen Uses for NaturesMud Beetroot Powder',
        desc: 'Easy ways to stir Beetroot Powder into juices, smoothies, and family meals.',
        badge: 'Kitchen Guide',
      },
    ],
    'freeze-dried-avocado-powder': [
      {
        videoUrl: '/videos/avocado-powder-reel.mp4',
        title: 'Freeze Dried Avocado Powder — 100% Pure Hass Avocado',
        desc: 'Vacuum freeze-dried ripe avocado flesh milled into a creamy, nutrient-dense powder rich in heart-healthy monounsaturated fats and potassium.',
        badge: 'Freeze-Dried',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud 100 GM Glass Jar Superfood Collection',
        desc: 'Explore our chemical-free Himalayan fruit and vegetable powders packed in airtight jars.',
        badge: 'Collection',
      },
    ],
    'strawberry-powder': [
      {
        videoUrl: '/videos/strawberry-powder-reel.mp4',
        title: 'Freeze Dried Strawberry Powder — Real Berry Aroma & Vitamin C',
        desc: '100% whole ripe strawberries vacuum freeze-dried and cold-milled into a fragrant ruby berry powder with 0% added sugar or artificial flavor.',
        badge: 'Freeze-Dried Berry',
      },
      {
        videoUrl: '/videos/strawberry-powder-craft.mp4',
        title: 'From Fresh Strawberries to Fine Freeze-Dried Powder',
        desc: 'Watch how real strawberries are transformed into vibrant powder for strawberry milk, frosting, yogurt bowls, and baby porridge.',
        badge: 'Craft Process',
      },
    ],
    'banana-powder': [
      {
        videoUrl: '/videos/banana-sweet-potato-cranberry-reel.mp4',
        title: 'Banana Powder — Baby Weaning, Smoothies & Baking Guide',
        desc: '100% pure dehydrated ripe bananas milled into a gentle, potassium-rich flour for baby porridge (from 6 months, as advised by your pediatrician) and shakes.',
        badge: 'Weaning & Shakes',
      },
      {
        videoUrl: '/videos/moringa-pumpkin-banana-reel.mp4',
        title: 'Banana Powder, Moringa Leaf & Pumpkin Seeds Vitality Trio',
        desc: 'Combine Banana Powder with Moringa and Pumpkin Seeds for nutrient-dense morning bowls.',
        badge: 'Daily Vitality',
      },
      {
        videoUrl: '/videos/mango-papaya-banana-smoothie.mp4',
        title: 'Tropical Banana, Mango & Papaya Smoothie Prep',
        desc: 'Blend Banana Powder with Dehydrated Mango and Papaya for a quick year-round fruit smoothie.',
        badge: 'Smoothie Recipe',
      },
    ],
    'carrot-powder': [
      {
        videoUrl: '/videos/clip-21.mp4',
        title: 'Carrot Powder (Gajar Powder) — Rich in Beta-Carotene & Provitamin A',
        desc: 'Dehydrated whole Nepali carrots finely milled into a 100 GM powder for baby jaulo (from 6 months, as advised by your pediatrician), soups, and chapati dough.',
        badge: 'Beta-Carotene',
      },
      {
        videoUrl: '/videos/clip-25.mp4',
        title: 'How to Enrich Daily Meals with NaturesMud Carrot Powder',
        desc: 'Add 1 teaspoon of pure Carrot Powder to dal, khichdi, pancakes, or vegetable broth.',
        badge: 'Kitchen Guide',
      },
      {
        videoUrl: '/videos/clip-29.mp4',
        title: 'Carrot, Beetroot, Sweet Potato & Dates Powder Collection',
        desc: 'Four essential single-ingredient root and fruit powders for Nepali family kitchens.',
        badge: 'Superfood Trio',
      },
    ],
    'moringa-leaf-powder': [
      {
        videoUrl: '/videos/moringa-pumpkin-banana-reel.mp4',
        title: 'Moringa Leaf Powder (Sajyun ko Paat) — Shade-Dried Green Superfood',
        desc: '100% shade-dried Tarai Moringa oleifera leaves milled into a vibrant green powder rich in plant iron, calcium, and antioxidants.',
        badge: 'Shade-Dried Green',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud 100% Pure Single-Ingredient Superfood Powders',
        desc: 'Zero fillers, zero preservatives, and batch-sealed freshness across our entire powder lineup.',
        badge: 'Collection',
      },
    ],
    'papaya-powder': [
      {
        videoUrl: '/videos/mango-papaya-banana-smoothie.mp4',
        title: 'Papaya Powder (Mewa Powder) — Natural Papain & Digestive Support',
        desc: 'Gently dehydrated ripe papaya milled into a versatile fruit powder for smoothies, digestive drinks, and culinary tenderizing.',
        badge: 'Digestive Enzymes',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud Pure Fruit & Root Powder Collection',
        desc: '100% single-ingredient dehydrated powders packed in 100 GM glass jars.',
        badge: 'Collection',
      },
    ],
    'barley-grass-powder': [
      {
        videoUrl: '/videos/moringa-pumpkin-banana-reel.mp4',
        title: 'Young Green Superfood Powders — Morning Alkalizing Routine',
        desc: 'Rich in natural chlorophyll, superoxide dismutase (SOD), and trace minerals for morning green shots and smoothies.',
        badge: 'Green Chlorophyll',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud 100% Pure Superfood Powders in Glass Jars',
        desc: 'Cold-milled with 0 additives, 0 artificial colors, and 0 preservatives.',
        badge: 'Collection',
      },
    ],
    'dried-cranberries': [
      {
        videoUrl: '/videos/dried-cranberries-pro.mp4',
        title: 'Dried Cranberries (100 GM) — Whole Plump Ruby Berries',
        desc: 'Tangy-sweet ruby dried cranberries with 0% artificial dye and 0% sulphur dioxide, rich in A-type proanthocyanidins.',
        badge: 'Whole Ruby Berries',
      },
      {
        videoUrl: '/videos/cranberries-yogurt-reel.mp4',
        title: 'Dried Cranberries & Morning Yogurt Bowl Crunch',
        desc: 'Top morning curd, overnight oats, salads, and trail mixes with plump Dried Cranberries.',
        badge: 'Yogurt & Oats',
      },
      {
        videoUrl: '/videos/cranberries.mp4',
        title: 'Close-Up Texture of NaturesMud Dried Cranberries',
        desc: 'Soft, moist, whole sliced cranberries sealed in a 100 GM jar.',
        badge: 'Texture Close-Up',
      },
      {
        videoUrl: '/videos/banana-sweet-potato-cranberry-reel.mp4',
        title: 'Dried Cranberries, Banana Powder & Sweet Potato Powder',
        desc: 'Pair tangy Dried Cranberries with naturally sweet fruit and root powders.',
        badge: 'Family Combo',
      },
    ],
    'dried-blueberries': [
      {
        videoUrl: '/videos/blueberries-harvest-reel.mp4',
        title: 'Dried Blueberries (100 GM) — Whole Plump Antioxidant Berries',
        desc: 'Naturally dried whole blueberries rich in anthocyanins for morning oats, yogurt bowls, and kids tiffin.',
        badge: 'Whole Blueberries',
      },
      {
        videoUrl: '/videos/blueberries-kitchen-reel.mp4',
        title: 'Dried Blueberries in Everyday Breakfast & Baking',
        desc: 'Stir into pancake batter, chia pudding, or enjoy straight from the jar as a brain-healthy desk snack.',
        badge: 'Breakfast Ideas',
      },
      {
        videoUrl: '/videos/blueberries.mp4',
        title: 'Plump Whole Dried Blueberries — Quality Inspection',
        desc: 'Zero sulphur dioxide and zero artificial glazing.',
        badge: '100% Pure',
      },
      {
        videoUrl: '/videos/naturesmud-product-reel.mp4',
        title: 'NaturesMud Dried Blueberries — Customer Favorite Berry Jar',
        desc: 'Packed fresh in a 100 GM reusable jar.',
        badge: 'Reel Spotlight',
      },
    ],
    'roasted-cashewnuts': [
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Roasted Cashew Nuts (150 GM) — Oil-Free Golden Crunch',
        desc: 'Whole W240 cashew kernels slow dry-roasted without refined oils and lightly seasoned for a clean, buttery crunch.',
        badge: 'Oil-Free Roasted',
      },
      {
        videoUrl: '/videos/cashews-crunch-reel.mp4',
        title: 'Jumbo Whole Cashew Kernels — Clean Desk & Tea-Time Snack',
        desc: 'High plant protein, copper, and magnesium in every crunchy handful.',
        badge: 'Jumbo W240',
      },
    ],
    'premium-cashewnuts': [
      {
        videoUrl: '/videos/cashews-crunch-reel.mp4',
        title: 'Cashew Nuts (200 GM) — Whole Creamy W240 Kernels',
        desc: 'Unblemished whole white cashew kernels for clean snacking, homemade kaju milk, rich gravies, and festive gifting.',
        badge: 'Whole W240 Grade',
      },
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'NaturesMud Premium Cashews — From Raw Kernels to Golden Roast',
        desc: 'Hand-sorted whole cashews with zero broken pieces or artificial bleaching.',
        badge: 'Hand-Sorted',
      },
    ],
    'fox-nuts-makhana': [
      {
        videoUrl: '/videos/makhana-fox-nuts-reel.mp4',
        title: 'Himalayan Fox Nuts (Makhana) — Light & Crunchy Popped Lotus Seeds',
        desc: 'Large, hand-graded Phool Makhana (100 GM) rich in plant calcium and protein with near-zero fat—ideal for ghee roasting and fasting snacks.',
        badge: 'AAA Phool Makhana',
      },
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Clean Roasted Dry Fruits & Makhana Evening Snacking',
        desc: 'Replace deep-fried packet chips with roasted Makhana and dry-roasted cashews.',
        badge: 'Clean Snacking',
      },
    ],
    'dehydrated-apple': [
      {
        videoUrl: '/videos/dehydrated-apple-reel.mp4',
        title: 'Dehydrated Apple (Syau ko Sukuti) — Mustang & Jumla Apple Rings',
        desc: 'Crisp high-altitude Himalayan apples sliced skin-on and gently air-dehydrated with 0% added sugar or sulphur.',
        badge: 'Himalayan Apples',
      },
      {
        videoUrl: '/videos/apple.mp4',
        title: 'Skin-On Dehydrated Apple Rings — Kids Tiffin & Trekking Snack',
        desc: 'Naturally sweet, chewy-crisp apple rings packed in a 100 GM jar.',
        badge: '0% Added Sugar',
      },
    ],
    'dehydrated-mango': [
      {
        videoUrl: '/videos/mango-papaya-banana-smoothie.mp4',
        title: 'Dehydrated Mango (100 GM) — Sun-Ripened Tarai Mango Slices',
        desc: 'Thick, aromatic mango slices gently dehydrated at low temperatures with 0% added white sugar and 0% sulphur dioxide.',
        badge: 'Tarai Mango',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'Dehydrated Mango & NaturesMud 100 GM Jar Collection',
        desc: 'Pure fruit slices and superfood powders sealed for year-round freshness.',
        badge: 'Collection',
      },
    ],
    'dehydrated-papaya': [
      {
        videoUrl: '/videos/mango-papaya-banana-smoothie.mp4',
        title: 'Dehydrated Sweet Papaya (100 GM) — Chewy Tropical Fruit Strips',
        desc: 'Naturally sweet ripe papaya slices gently dehydrated to preserve digestive papain enzymes and beta-carotene.',
        badge: 'Digestive Fruit',
      },
      {
        videoUrl: '/videos/dehydrated-apple-reel.mp4',
        title: 'Zero-Sulphur Dehydrated Fruits by NaturesMud',
        desc: 'Clean whole-fruit snacking for kids tiffin, trekking, and oatmeal bowls.',
        badge: '0% Sulphur',
      },
    ],
    'dehydrated-pineapple': [
      {
        videoUrl: '/videos/mango-papaya-banana-smoothie.mp4',
        title: 'Dehydrated Pineapple (100 GM) — Tangy Bromelain-Rich Rings',
        desc: 'Golden tropical pineapple rings gently air-dried with zero refined sugar coating or artificial preservatives.',
        badge: 'Tropical Rings',
      },
      {
        videoUrl: '/videos/dehydrated-apple-reel.mp4',
        title: 'Pure Dehydrated Fruit Rings — Apple, Pineapple & Mango',
        desc: 'Lightweight, non-messy real fruit snacks for school, office, and trails.',
        badge: 'Whole Fruit',
      },
    ],
    'dehydrated-coconut-chips': [
      {
        videoUrl: '/videos/snaptik-reel-2.mp4',
        title: 'Coconut Chips (100 GM) — Lightly Toasted Tropical Ribbons',
        desc: 'Crisp dehydrated mature coconut ribbons rich in natural MCTs and dietary fiber—0% trans fat and 0% refined sugar.',
        badge: 'Crisp Coconut',
      },
      {
        videoUrl: '/videos/coconut-oil.mp4',
        title: 'Pure Coconut Nutrition at NaturesMud Nepal',
        desc: 'From crisp toasted Coconut Chips to Cold-Pressed Extra Virgin Coconut Oil.',
        badge: 'Coconut Craft',
      },
    ],
    'chia-seeds': [
      {
        videoUrl: '/videos/chia-seed-ad.mp4',
        title: 'Chia Seeds (300 GM) — Triple-Cleaned High-Swell Omega-3 Seeds',
        desc: 'Hydrophilic black chia seeds rich in plant ALA Omega-3 and soluble fiber for morning lemon-chia water and overnight pudding.',
        badge: 'Plant Omega-3',
      },
      {
        videoUrl: '/videos/chia-seeds-outro.mp4',
        title: 'How to Prepare Creamy Chia Seed Pudding & Hydration Gel',
        desc: 'Soak 1 tablespoon in water or milk for 15 minutes for a smooth, nutrient-dense gel.',
        badge: 'Pudding Guide',
      },
    ],
    'pumpkin-seeds': [
      {
        videoUrl: '/videos/pumpkin-seeds-crunch.mp4',
        title: 'Pumpkin Seeds (300 GM) — Raw Green AAA Pepita Kernels',
        desc: 'Unroasted emerald-green hulled pumpkin seeds packed with natural zinc, magnesium, and plant protein.',
        badge: 'Zinc & Magnesium',
      },
      {
        videoUrl: '/videos/moringa-pumpkin-banana-reel.mp4',
        title: 'Pumpkin Seeds, Moringa & Banana Daily Vitality Routine',
        desc: 'Sprinkle raw Pumpkin Seeds over smoothies, oatmeal, salads, and curd bowls.',
        badge: 'Daily Crunch',
      },
    ],
    'sunflower-seeds': [
      {
        videoUrl: '/videos/pumpkin-seeds-crunch.mp4',
        title: 'Sunflower Seeds (300 GM) — Raw Hulled Vitamin E Kernels',
        desc: 'Clean, triple-sorted hulled sunflower seeds rich in Vitamin E and selenium for seed cycling, baking, and salads.',
        badge: 'Vitamin E Seeds',
      },
      {
        videoUrl: '/videos/chia-seed-ad.mp4',
        title: 'NaturesMud 300 GM Raw Super Seeds Collection',
        desc: 'Combine Sunflower Seeds, Pumpkin Seeds, Flax Seeds, and Chia Seeds for daily nutrition.',
        badge: 'Super Seeds',
      },
    ],
    'flax-seeds': [
      {
        videoUrl: '/videos/chia-seed-ad.mp4',
        title: 'Flax Seeds (300 GM) — Lignans, Dietary Fiber & Plant Omega-3',
        desc: 'Glossy whole brown flax seeds (Alasi) ideal for light dry-roasting, grinding into roti atta, or blending into smoothies.',
        badge: 'Alasi Omega-3',
      },
      {
        videoUrl: '/videos/pumpkin-seeds-crunch.mp4',
        title: 'Daily Seed Mix — Flax, Pumpkin, Sunflower & Chia',
        desc: 'Add 1 tablespoon of freshly ground or roasted seeds to your morning breakfast.',
        badge: 'Seed Routine',
      },
    ],
    'raw-himalayan-almonds': [
      {
        videoUrl: '/videos/almonds.mp4',
        title: 'Raw Almonds (Kancho Badam) — Whole Sweet Kernels',
        desc: '100% unroasted whole sweet almonds rich in Vitamin E—ideal for overnight soaking (badam pani), kids, and homemade badam milk.',
        badge: 'Whole Sweet Badam',
      },
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'NaturesMud Premium Whole Almonds & Cashews Collection',
        desc: 'Hand-selected whole nuts sealed in airtight jars for lasting crunch.',
        badge: 'Premium Nuts',
      },
    ],
    'roasted-almonds': [
      {
        videoUrl: '/videos/almonds.mp4',
        title: 'Roasted Almonds (150 GM) — Oil-Free Dry-Roasted Crunch',
        desc: 'Slow dry-roasted whole almonds lightly seasoned with pure Himalayan Pink Salt—zero vegetable oil.',
        badge: 'Dry-Roasted',
      },
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Oil-Free Roasted Almonds & Cashews — Clean Office & Travel Snack',
        desc: 'High-protein, heart-healthy roasted nuts ready to eat straight from the jar.',
        badge: 'High Protein',
      },
    ],
    'premium-pistachio-roasted-salted': [
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Roasted & Salted Pistachios (150 GM) — Naturally Split Jumbo Nuts',
        desc: 'Crisp, emerald-green pistachio kernels dry-roasted in their shells with a light touch of mineral salt.',
        badge: 'Jumbo Pistachios',
      },
      {
        videoUrl: '/videos/almonds.mp4',
        title: 'Premium Dry Fruits & Nuts for Everyday Wellness & Gifting',
        desc: 'Hand-graded Pistachios, Almonds, and Cashews packed fresh in Kathmandu.',
        badge: 'Dry Fruits',
      },
    ],
    'superfood-trail-mix': [
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Superfood Trail Mix (200 GM) — Nuts, Seeds & Dried Berries',
        desc: 'Balanced blend of almonds, cashews, pumpkin seeds, sunflower seeds, dried cranberries, and blueberries for sustained energy.',
        badge: 'Trek & Gym Fuel',
      },
      {
        videoUrl: '/videos/blueberries-harvest-reel.mp4',
        title: 'Real Dried Blueberries & Cranberries Inside Every Handful',
        desc: 'Zero candy-coated fillers or deep-fried sev—100% clean nuts, seeds, and berries.',
        badge: 'Antioxidant Mix',
      },
      {
        videoUrl: '/videos/pumpkin-seeds-crunch.mp4',
        title: 'High-Zinc Seeds & Whole Nuts Energy Blend',
        desc: 'Keep a jar on your work desk or in your trekking daypack.',
        badge: 'Clean Energy',
      },
    ],
    'virgin-coconut-oil-500ml': [
      {
        videoUrl: '/videos/coconut-oil.mp4',
        title: 'Cold-Pressed Extra Virgin Coconut Oil (500 ML) — Raw Centrifuged',
        desc: 'Unrefined, zero-hexane cold-pressed virgin coconut oil extracted from fresh coconut milk for cooking, baby massage, oil pulling, and hair care.',
        badge: '500 ML Family Jar',
      },
      {
        videoUrl: '/videos/snaptik-reel-2.mp4',
        title: '100% Pure Unrefined Coconut Craft at NaturesMud',
        desc: 'Rich in lauric acid (MCTs) with a delicate natural fresh-coconut aroma.',
        badge: 'Cold-Pressed',
      },
    ],
    'virgin-coconut-oil-180ml': [
      {
        videoUrl: '/videos/coconut-oil.mp4',
        title: 'Cold-Pressed Extra Virgin Coconut Oil (180 ML) — Baby & Skincare Size',
        desc: 'Compact 180 ML wide-mouth jar of 100% cold-pressed virgin coconut oil for infant massage, diaper care, oil pulling, and travel.',
        badge: '180 ML Jar',
      },
      {
        videoUrl: '/videos/snaptik-reel-2.mp4',
        title: 'Zero-Heat Centrifuged Virgin Coconut Oil Purity',
        desc: 'Unbleached, non-deodorized, and safe for both kitchen and baby skin.',
        badge: '100% Pure EVCO',
      },
    ],
    'pure-natural-yellow-mustard-oil': [
      {
        videoUrl: '/videos/coconut-oil.mp4',
        title: 'Pure Natural Yellow Mustard Oil — Cold-Pressed (Kachchi Ghani)',
        desc: 'Traditionally cold-pressed from clean Nepali yellow mustard seeds (Pahelo Tori) with zero argemone or palm oil blending.',
        badge: 'Cold-Pressed Tori',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud Chemical-Free Nepali Kitchen Staples',
        desc: 'Pure culinary oils, mineral salts, and single-ingredient superfood powders.',
        badge: 'Kitchen Staples',
      },
    ],
    'pure-himalayan-black-salt-bire-noon': [
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'Pure Himalayan Black Salt (Bire Noon) — Digestive Mineral Salt',
        desc: 'Authentic kiln-fired Himalayan black salt crystals ground fine for fruit salads, lemon pani, chaat, and digestive remedies.',
        badge: 'Authentic Bire Noon',
      },
      {
        videoUrl: '/videos/makhana-fox-nuts-reel.mp4',
        title: 'Seasoning Roasted Makhana & Snacks with Bire Noon',
        desc: 'Toss warm roasted Fox Nuts (Makhana) with a pinch of Bire Noon for a classic Nepali snack.',
        badge: 'Kitchen Pairing',
      },
    ],
    'himalayan-pink-salt': [
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'Himalayan Pink Salt (200 GM) — Unrefined 84 Trace Minerals',
        desc: 'Naturally mined ancient rock salt free from chemical bleaching and synthetic anti-caking agents.',
        badge: 'Unrefined Rock Salt',
      },
      {
        videoUrl: '/videos/roasted-cashews-reel.mp4',
        title: 'Clean Everyday Cooking & Dry-Roasting with Pink Salt',
        desc: 'Used across our own dry-roasted nuts and everyday Nepali dal-bhat kitchens.',
        badge: 'Daily Mineral Salt',
      },
    ],
    'pure-mountain-himalayan-shilajit-resin': [
      {
        videoUrl: '/videos/beetroot-stamina-drink.mp4',
        title: 'Pure Mountain Himalayan Shilajit Resin — High-Altitude Fulvic Acid',
        desc: 'Purified semi-solid Shilajit resin sourced from high-altitude Himalayan rock strata for stamina, recovery, and cellular vitality.',
        badge: 'Gold-Grade Resin',
      },
      {
        videoUrl: '/videos/sweet-potato-powder-video.mp4',
        title: 'NaturesMud Authentic Himalayan Wellness Collection',
        desc: 'Lab-verified purity and transparent batch sourcing across Nepal.',
        badge: 'Himalayan Purity',
      },
    ],
  };

  const defaultCategoryClips: ProductVideoClip[] = [
    {
      videoUrl: '/videos/sweet-potato-powder-video.mp4',
      title: `${officialName} — NaturesMud Pure Superfood Collection`,
      desc: `100% pure whole-food ${officialName} (${product.weight || '100 GM'}) packed fresh in Nepal with 0 additives and 0 preservatives.`,
      badge: '100% Pure',
    },
    {
      videoUrl: '/videos/roasted-cashews-reel.mp4',
      title: 'Inside NaturesMud Hygienic Jar & Pouch Packaging',
      desc: 'Every batch is sealed with exact net weight, manufacturing date, and expiry transparency.',
      badge: 'Quality Sealed',
    },
  ];

  const productVideoClips = productVideoClipsMap[product.slug] || defaultCategoryClips;
  const matchedVideo = productVideoClips[0] || null;

  return (
    <section className="py-10 sm:py-12 bg-white w-full max-w-full overflow-hidden">
      <ProductViewTracker
        sku={product.sku || product.slug}
        slug={product.slug}
        name={officialName}
        category={product.categorySlug || ''}
        weight={product.weight || '100 GM'}
        price={product.price}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#3A6B35]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-[#3A6B35]">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/category/${product.categorySlug || 'powders'}`}
                className="hover:text-[#3A6B35]"
              >
                {categoryName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[#3A6B35] font-medium">{officialName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: Selectable Image Gallery + Product Video Reel Showcase (Eliminates Left-Bottom Blank Space) */}
          <div className="flex flex-col justify-between">
            <ProductImageGallery
              images={productImages}
              productName={officialName}
              weight={product.weight}
              packing={product.packing}
              discount={discount}
              badges={badges}
            />

            <ProductLeftVideoReel
              productSlug={product.slug}
              categorySlug={product.categorySlug || 'powders'}
              productName={officialName}
              posterImage={productImages[0]}
              clips={productVideoClips}
            />
          </div>

          {/* Above-the-Fold Product Info & Conversion Strip */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href={`/category/${product.categorySlug || 'powders'}`}
                className="text-xs font-bold text-[#3A6B35] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {categoryName}
              </Link>
              {dossier && (
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  {dossier.nepaliNameDevanagari} · {dossier.nepaliNameRoman}
                </span>
              )}
            </div>

            {/* H1 = Exact Physical Label Name Only */}
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B] mb-3">
              {officialName}
            </h1>

            {/* Rating (ONLY if real approved reviews with visible text exist on this page) */}
            {verifiedReviewCount > 0 ? (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#D9A441]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(verifiedAvgRating || 5) ? 'fill-[#D9A441]' : 'fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{verifiedAvgRating}</span>
                <span className="text-sm text-gray-500">({verifiedReviewCount} customer reviews)</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3A6B35] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Pure · 0 Additives · 0 Preservatives
                </span>
                <a
                  href="#reviews"
                  className="text-xs font-medium text-gray-500 hover:text-[#3A6B35] underline"
                >
                  Write the first review
                </a>
              </div>
            )}

            {/* Price + Net Weight + Price per 100g/100ml Box */}
            <div className="bg-[#FAF8F5] border-2 border-amber-400/70 rounded-2xl p-4 sm:p-5 mb-5 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#3A6B35]">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through font-semibold">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  {discount && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {product.weight && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-800 bg-white border border-stone-200 px-3 py-1.5 rounded-lg">
                      <Package className="w-3.5 h-3.5 text-[#3A6B35]" />
                      Net Weight: {product.weight}
                    </span>
                  )}
                  <span className="inline-flex items-center text-xs font-bold text-[#3A6B35] bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-lg">
                    {unitPriceLabel}
                  </span>
                </div>
              </div>

              {/* Glowing Dashain Offer Perks Box */}
              <div className="mt-3.5 rounded-xl bg-gradient-to-r from-[#5a0b0b] via-[#7f1d1d] to-[#1a3826] p-3.5 text-white border border-amber-400/50">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 dashain-glow-text">
                    ✨ Dashain Blessings &amp; Health Offer (Valid Till Dashain End)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/25 rounded-lg p-2 border border-emerald-300/30">
                    <strong className="text-emerald-300 block">🚚 Free Delivery &gt; Rs. 3,000</strong>
                    <span className="text-emerald-100/90 text-[11px]">100% Free express delivery across Nepal</span>
                  </div>
                  <div className="bg-black/25 rounded-lg p-2 border border-rose-300/30">
                    <strong className="text-rose-300 block">🎁 Free Pink Salt &gt; Rs. 5,000+</strong>
                    <span className="text-rose-100/90 text-[11px]">Free Delivery + Free Himalayan Pink Salt (200g)</span>
                  </div>
                </div>
              </div>

              {/* Stock + Packing Type */}
              <div className="mt-3 pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  {product.stock > 0 ? (
                    <span className="text-green-700">
                      In Stock — Dispatched fresh from Kathmandu
                    </span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </span>
                <span className="text-stone-600 font-medium">
                  Pack: {product.packing || 'Airtight Food-Grade Container'}
                </span>
              </div>
            </div>

            {/* D12 Variant / Pack Size Selector (Coconut Oil 180ml/500ml, Almonds, Cashews, Salts) */}
            {dossier?.variants && dossier.variants.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  {dossier.variantGroupTitle || 'Available Options'}:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dossier.variants.map((v) => {
                    const isCurrent = v.slug === product.slug;
                    return (
                      <Link
                        key={v.slug}
                        href={`/products/${v.slug}`}
                        className={`rounded-xl p-3 border text-left transition-all flex flex-col justify-between ${
                          isCurrent
                            ? 'border-[#3A6B35] bg-emerald-50/70 ring-2 ring-[#3A6B35]/20'
                            : 'border-stone-200 bg-white hover:border-[#3A6B35]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading font-bold text-xs sm:text-sm text-stone-900">
                            {v.label}
                          </span>
                          <span className="font-heading font-extrabold text-xs sm:text-sm text-[#3A6B35]">
                            Rs. {v.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                          <span>{v.weight}</span>
                          {v.badge && <span className="font-medium text-stone-600">{v.badge}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Primary CTA Buttons: Add to Cart, Buy Now, WhatsApp */}
            <div className="flex flex-wrap items-center gap-3.5 mb-6">
              <AddToCartButton productId={product.id} product={product} />
              <BuyNowButton productId={product.id} product={product} variant="gold" label="⚡ Buy Now" />
              <a
                href={`https://api.whatsapp.com/send?phone=9779713888002&text=${encodeURIComponent(
                  `Hello NaturesMud Nepal! 🙏\nI would like to order: *${officialName}* (Rs. ${product.price}${product.weight ? `, ${product.weight}` : ''}).\nPlease confirm delivery availability in Nepal.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                title="Order directly via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Delivery ETA & Payment Methods Box (Above the Fold) */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm text-stone-700 mb-6">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#3A6B35] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Kathmandu Valley Delivery:</strong> 24–48 hours
                  (Kathmandu, Lalitpur &amp; Bhaktapur — Rs. 100 ·{' '}
                  <span className="text-[#3A6B35] font-semibold">Free over Rs. 3,000</span>)
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#3A6B35] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Outside Valley (All 77 Districts):</strong> 2–5
                  business days to Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Hetauda, Nepalgunj
                  &amp; Surkhet.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-[#3A6B35] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900">Payment Options:</strong> Cash on Delivery
                  (COD), eSewa, Khalti &amp; Fonepay / Bank QR.
                </div>
              </div>
            </div>

            {/* Interactive 77-District Delivery & COD Calculator */}
            <div className="pt-2">
              <DeliveryCalculator />
            </div>

            {/* Ingredients & Key Benefits */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <div>
                <h2 className="font-heading font-semibold text-lg mb-3">
                  Exact Ingredients ({ingredients.length === 1 ? '100% Single-Ingredient' : `${ingredients.length} Ingredients`})
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="bg-[#F8F4EC] border border-stone-200/80 px-3.5 py-1.5 rounded-full text-sm font-medium text-stone-800"
                    >
                      ✓ {ing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg mb-3">
                  Key Nutritional Highlights
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <Leaf className="w-4 h-4 text-[#7AA95C] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nutrition Table with Explicit Source Attribution */}
            {nutrition.length > 0 && (
              <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-[#3A6B35] text-white px-6 py-3">
                  <h2 className="font-heading font-semibold">
                    Nutrition Facts (Reference Values per 100g)
                  </h2>
                  <p className="text-xs text-white/85">
                    Source: USDA FoodData Central &amp; Nepal Food Composition Table reference values
                    for whole-food ingredient
                  </p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {nutrition.map((n) => (
                      <tr key={n.label} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-6 py-2.5 text-gray-600">{n.label}</td>
                        <td className="px-6 py-2.5 font-semibold text-right">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-[#FAF8F5] px-6 py-3 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
                  * Stated source: Standard whole-food reference values per 100g dry weight (USDA
                  FoodData Central / Nepal DFTQC Food Composition Table), not a batch-specific lab
                  certificate. Typical single serving is 5g–10g (1–2 tsp) for powders or 20g–30g for
                  nuts, seeds &amp; dried fruits. For infants (from 6 months, as advised by your
                  pediatrician), start with 1/2 to 1 teaspoon.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SKU-Specific 300–500 Word Nepal Kitchen, Storage & Comparison Guide */}
        {dossier && (
          <div className="mt-16 border-t border-stone-200/80 pt-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: What It Is, Who It Suits, Monsoon Storage & Proof Block */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200/80 space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A6B35]">
                    <Sparkles className="w-3.5 h-3.5" /> What Is NaturesMud {officialName}?
                  </span>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-stone-900">
                    {officialName} ({dossier.nepaliNameDevanagari}) — Purity &amp; Sourcing
                  </h2>
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                    {dossier.whatItIs}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200/70">
                      <span className="text-stone-500 block">Sourcing / Origin Belt:</span>
                      <strong className="text-stone-900 mt-0.5 block">{dossier.originBelt}</strong>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200/70">
                      <span className="text-stone-500 block">Shelf Life:</span>
                      <strong className="text-stone-900 mt-0.5 block">{dossier.shelfLife}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 space-y-4">
                  <h3 className="font-heading font-bold text-lg text-stone-900">
                    Who It Suits &amp; Monsoon Storage in Nepal
                  </h3>
                  <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
                    <p>
                      <strong className="text-stone-900">Who It Suits: </strong>
                      {dossier.whoItSuits}
                    </p>
                    <p>
                      <strong className="text-stone-900">
                        Monsoon &amp; Humidity Storage (Ashadh–Bhadra):{' '}
                      </strong>
                      {dossier.monsoonStorage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: How to Use in Nepali Kitchens + Proof Block */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8 border border-stone-200/80 space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A6B35]">
                    <Utensils className="w-3.5 h-3.5" /> Nepali Kitchen Guide
                  </span>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-stone-900">
                    How to Use {officialName} in Nepali Kitchens
                  </h2>
                  <ul className="space-y-3">
                    {dossier.nepaliKitchenUses.map((useItem, idx) => (
                      <li
                        key={idx}
                        className="bg-white rounded-2xl p-4 border border-stone-200/70 text-sm text-stone-700 leading-relaxed flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#3A6B35] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{useItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Packaging & Batch Transparency Proof Block */}
                <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                      <span>Physical Label &amp; Batch Transparency</span>
                    </span>
                    <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-emerald-200">
                      {product.weight} · {product.packing || 'Airtight Pack'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
                    Every physical pack of <strong>{officialName}</strong> is sealed at our Kathmandu
                    facility with the exact product label, net weight ({product.weight}), batch
                    number, and expiry date printed on the container.
                  </p>

                  {/* Batch & Regulatory Proof Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                      <span className="text-emerald-300 font-bold block text-[11px] uppercase tracking-wider">
                        DFTQC Compliance
                      </span>
                      <span className="text-white/85 text-[11px] leading-tight block">
                        {product.proof_block?.dftqc_registration || 'DFTQC Hygiene Standard Compliant'}
                      </span>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                      <span className="text-emerald-300 font-bold block text-[11px] uppercase tracking-wider">
                        Lab Verification
                      </span>
                      <span className="text-white/85 text-[11px] leading-tight block">
                        {product.proof_block?.lab_report || 'USDA & Nepal Food Table reference standards'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
                    <Link
                      href="/quality-and-proof"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white underline"
                    >
                      <span>Read Sourcing &amp; Quality Protocols</span> &rarr;
                    </Link>
                    <a
                      href={`https://api.whatsapp.com/send?phone=9779713888002&text=${encodeURIComponent(
                        `Hello NaturesMud! Please share a live photo of the current batch & expiry label for ${officialName} (${product.weight}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9A441] hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>Request Current Batch Label Photo on WhatsApp</span> &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
              <div className="bg-[#FAF8F5] px-6 py-4 border-b border-stone-200/80">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-stone-900">
                  {dossier.comparisonTitle}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/70 text-xs uppercase tracking-wider text-stone-500">
                      <th className="py-3.5 px-6 font-bold">Quality Factor</th>
                      <th className="py-3.5 px-6 font-bold text-[#3A6B35]">
                        NaturesMud {officialName}
                      </th>
                      <th className="py-3.5 px-6 font-bold text-stone-500">
                        Typical Commercial Alternative
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.comparisonRows.map((row, i) => (
                      <tr key={i} className="border-b border-stone-100 last:border-b-0">
                        <td className="py-3.5 px-6 font-semibold text-stone-800">{row.feature}</td>
                        <td className="py-3.5 px-6 font-semibold text-[#1A3826] bg-emerald-50/30">
                          ✓ {row.naturesMud}
                        </td>
                        <td className="py-3.5 px-6 text-stone-600">{row.typicalMarket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Native Nepali Layer (Top Priority Products — lang="ne") */}
            {(() => {
              const nepaliLayer = getNepaliLayer(product.slug);
              if (!nepaliLayer) return null;
              return (
                <div
                  lang="ne"
                  className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#D9A441]/40 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A5230] bg-[#D9A441]/15 px-3 py-1 rounded-full">
                      🇳🇵 नेपालीमा संक्षिप्त जानकारी र प्रयोग विधि (Nepali Guide)
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1A3826]">
                    {nepaliLayer.headingNp}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-800 leading-relaxed">
                    {nepaliLayer.summaryNp}
                  </p>
                  <div className="space-y-2 pt-1">
                    <h3 className="font-heading font-semibold text-sm text-[#1A3826]">
                      भान्सामा प्रयोग गर्ने तरिका (How to Use):
                    </h3>
                    <ul className="space-y-2">
                      {nepaliLayer.usesNp.map((u, idx) => (
                        <li
                          key={idx}
                          className="bg-white rounded-xl p-3.5 border border-stone-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed"
                        >
                          ✓ {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 bg-white/80 rounded-xl p-3.5 border border-stone-200/60">
                    <strong className="text-[#1A3826]">भण्डारण विधि (Storage Note): </strong>
                    {nepaliLayer.storageNp}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Product-Specific Video Reel Section (ONLY rendered when a dedicated video exists for this SKU) */}
        {matchedVideo && (
          <div className="mt-16 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                  🎥 Product Video Guide
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {matchedVideo.title}
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed">{matchedVideo.desc}</p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#D9A441] hover:underline"
                  >
                    <span>Explore Our Nepal Sourcing Belts</span> &rarr;
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
                  <video
                    src={matchedVideo.videoUrl}
                    controls
                    playsInline
                    preload="none"
                    poster={productImages[0]}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Situated Secondary Perspectives & Authentic Product Visuals Gallery */}
        <ProductVisualsGallery
          images={productImages}
          productName={officialName}
          productSlug={product.slug}
        />

        {/* Features Strip */}
        <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <FeaturesStrip />
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews" className="mt-16 border-t border-gray-100 pt-10">
          <ProductReviews
            productId={product.id}
            productSlug={product.slug}
            productName={officialName}
            initialReviews={visibleReviews}
          />
        </div>

        {/* 5 SKU-Specific FAQs (English, Roman Nepali & Devanagari) */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#2B2B2B] mb-6">
            Frequently Asked Questions About {officialName} in Nepal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] rounded-2xl p-5 border border-stone-200/80"
              >
                <h3 className="font-heading font-bold text-base text-[#1A3826] mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complementary & Related Products */}
        {complementaryProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-stone-900">
                  Pairs Well With {officialName}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Complementary whole foods frequently ordered together in Nepal
                </p>
              </div>
              <Link
                href={`/category/${product.categorySlug || 'powders'}`}
                className="text-sm font-semibold text-[#3A6B35] hover:underline"
              >
                View All {categoryName || 'Products'} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {complementaryProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id || p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Topical Cluster Internal Links: Matched Recipes & Nutrition Guides */}
        {(() => {
          const nameKeywords = officialName
            .toLowerCase()
            .replace(/pure|organic|himalayan|premium|natural|freeze|dried|dehydrated|extra|virgin/g, '')
            .split(/[\s()]+/)
            .filter((w) => w.length >= 4);

          const matchedRecipes = recipes
            .filter((r) => {
              const hay = `${r.title} ${r.excerpt} ${(r.ingredients || []).join(' ')}`.toLowerCase();
              return nameKeywords.some((kw) => hay.includes(kw));
            })
            .slice(0, 3);

          const matchedBlogs = masterBlogCatalog
            .filter((b) => {
              if (b.featuredProductSlug === product.slug) return true;
              const hay = `${b.title} ${b.excerpt} ${(b.tags || []).join(' ')}`.toLowerCase();
              return nameKeywords.some((kw) => hay.includes(kw));
            })
            .slice(0, 3);

          if (matchedRecipes.length === 0 && matchedBlogs.length === 0) return null;

          return (
            <div className="mt-16 border-t border-gray-100 pt-10">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#2B2B2B] mb-6">
                Recipes &amp; Nutrition Guides Using {officialName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedRecipes.length > 0 && (
                  <div className="bg-[#F8F4EC] rounded-2xl p-6 border border-stone-200/70">
                    <h3 className="font-heading font-bold text-lg text-[#1A3826] mb-3 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#3A6B35]" />
                      <span>Healthy Kitchen &amp; Baby Weaning Recipes</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {matchedRecipes.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/recipes/${r.slug}`}
                            className="text-sm font-medium text-[#2B2B2B] hover:text-[#3A6B35] hover:underline flex items-center justify-between gap-2"
                          >
                            <span>{r.title}</span>
                            <span className="text-xs text-gray-500 shrink-0">
                              {r.prepTime + r.cookTime} min
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/recipes"
                      className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[#3A6B35] hover:underline"
                    >
                      Explore All Superfood Recipes →
                    </Link>
                  </div>
                )}
                {matchedBlogs.length > 0 && (
                  <div className="bg-[#F8F4EC] rounded-2xl p-6 border border-stone-200/70">
                    <h3 className="font-heading font-bold text-lg text-[#1A3826] mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#3A6B35]" />
                      <span>Deep-Dive Nutrition &amp; Buying Guides</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {matchedBlogs.map((b) => (
                        <li key={b.slug}>
                          <Link
                            href={`/blog/${b.slug}`}
                            className="text-sm font-medium text-[#2B2B2B] hover:text-[#3A6B35] hover:underline block"
                          >
                            {b.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/blog"
                      className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[#3A6B35] hover:underline"
                    >
                      Read All Nutrition Guides →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Schema.org Product, Offer & BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Product',
                '@id': `${siteConfig.url}/products/${product.slug}#product`,
                name: officialName,
                image: productImages.map((img) =>
                  img.startsWith('http') ? img : `${siteConfig.url}${img}`
                ),
                description: dossier?.whatItIs || product.description || product.shortDescription,
                sku: `NM-${product.slug.toUpperCase()}`,
                mpn: `NM-${product.slug.toUpperCase()}`,
                category: categoryName || product.category || 'Superfoods',
                brand: {
                  '@type': 'Brand',
                  '@id': `${siteConfig.url}/#organization`,
                  name: 'NaturesMud',
                },
                ...(product.weight
                  ? {
                      weight: {
                        '@type': 'QuantitativeValue',
                        value: parseFloat(product.weight) || 100,
                        unitText: product.weight.replace(/[0-9.\s]/g, '') || 'GM',
                      },
                      hasMeasurement: {
                        '@type': 'QuantitativeValue',
                        value: parseFloat(product.weight) || 100,
                        unitCode: product.weight.includes('ML') ? 'MLT' : 'GRM',
                        unitText: product.weight,
                      },
                    }
                  : {}),
                ...(verifiedReviewCount > 0
                  ? {
                      aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: verifiedAvgRating,
                        reviewCount: verifiedReviewCount,
                        bestRating: 5,
                        worstRating: 1,
                      },
                      review: visibleReviews.map((rv) => ({
                        '@type': 'Review',
                        author: {
                          '@type': 'Person',
                          name: rv.author,
                        },
                        datePublished: rv.createdAt.split('T')[0],
                        name: rv.title || `${officialName} Review`,
                        reviewBody: rv.content,
                        reviewRating: {
                          '@type': 'Rating',
                          ratingValue: rv.rating,
                          bestRating: 5,
                          worstRating: 1,
                        },
                      })),
                    }
                  : {}),
                offers: {
                  '@type': 'Offer',
                  '@id': `${siteConfig.url}/products/${product.slug}#offer`,
                  url: `${siteConfig.url}/products/${product.slug}`,
                  priceCurrency: 'NPR',
                  price: product.price,
                  priceValidUntil: '2027-12-31',
                  itemCondition: 'https://schema.org/NewCondition',
                  availability:
                    product.stock > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                  seller: {
                    '@type': 'Organization',
                    '@id': `${siteConfig.url}/#organization`,
                    name: 'NaturesMud',
                    url: siteConfig.url,
                  },
                  hasMerchantReturnPolicy: {
                    '@type': 'MerchantReturnPolicy',
                    applicableCountry: 'NP',
                    returnPolicyCountry: 'NP',
                    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                    merchantReturnDays: 7,
                    returnMethod: 'https://schema.org/ReturnByMail',
                    returnFees: 'https://schema.org/FreeReturn',
                    refundType: 'https://schema.org/FullRefund',
                    returnShippingFeesAmount: {
                      '@type': 'MonetaryAmount',
                      value: 0,
                      currency: 'NPR',
                    },
                  },
                  shippingDetails: [
                    {
                      '@type': 'OfferShippingDetails',
                      shippingRate: {
                        '@type': 'MonetaryAmount',
                        value: product.price >= siteConfig.freeShippingThreshold ? 0 : 100,
                        currency: 'NPR',
                      },
                      shippingDestination: {
                        '@type': 'DefinedRegion',
                        addressCountry: 'NP',
                        addressRegion: 'Bagmati (Kathmandu Valley)',
                      },
                      deliveryTime: {
                        '@type': 'ShippingDeliveryTime',
                        handlingTime: {
                          '@type': 'QuantitativeValue',
                          minValue: 0,
                          maxValue: 1,
                          unitCode: 'DAY',
                        },
                        transitTime: {
                          '@type': 'QuantitativeValue',
                          minValue: 1,
                          maxValue: 2,
                          unitCode: 'DAY',
                        },
                      },
                    },
                    {
                      '@type': 'OfferShippingDetails',
                      shippingRate: {
                        '@type': 'MonetaryAmount',
                        value: product.price >= siteConfig.freeShippingThreshold ? 0 : 150,
                        currency: 'NPR',
                      },
                      shippingDestination: {
                        '@type': 'DefinedRegion',
                        addressCountry: 'NP',
                        addressRegion: 'Outside Kathmandu Valley (All 7 Provinces)',
                      },
                      deliveryTime: {
                        '@type': 'ShippingDeliveryTime',
                        handlingTime: {
                          '@type': 'QuantitativeValue',
                          minValue: 0,
                          maxValue: 1,
                          unitCode: 'DAY',
                        },
                        transitTime: {
                          '@type': 'QuantitativeValue',
                          minValue: 2,
                          maxValue: 4,
                          unitCode: 'DAY',
                        },
                      },
                    },
                  ],
                },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${siteConfig.url}/products/${product.slug}#breadcrumb`,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: siteConfig.url,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Products',
                    item: `${siteConfig.url}/products`,
                  },
                  ...(categoryName
                    ? [
                        {
                          '@type': 'ListItem',
                          position: 3,
                          name: categoryName,
                          item: `${siteConfig.url}/category/${product.categorySlug || 'powders'}`,
                        },
                        {
                          '@type': 'ListItem',
                          position: 4,
                          name: officialName,
                          item: `${siteConfig.url}/products/${product.slug}`,
                        },
                      ]
                    : [
                        {
                          '@type': 'ListItem',
                          position: 3,
                          name: officialName,
                          item: `${siteConfig.url}/products/${product.slug}`,
                        },
                      ]),
                ],
              },
              {
                '@type': 'FAQPage',
                '@id': `${siteConfig.url}/products/${product.slug}#faq`,
                mainEntity: faqItems.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.a,
                  },
                })),
              },
            ],
          }),
        }}
      />

      {/* Mobile Sticky Add to Cart Bar */}
      <MobileStickyAddToCart product={product} />
    </section>
  );
}