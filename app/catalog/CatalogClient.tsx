'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  Grid,
  List,
  Leaf,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Package,
  ArrowRight,
  Check,
  Star,
  Eye,
  Maximize2,
  X,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
}

interface CatalogSectionDef {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  heroImage: string;
  heroImageAlt: string;
  accentColor: string;
  productIds: string[]; // Corresponding to 1-25 in products list
}

const CATALOG_SECTIONS: CatalogSectionDef[] = [
  {
    id: 'dehydrated-fruits',
    title: 'DEHYDRATED FRUITS',
    subtitle: 'NATURALLY NUTRITIOUS',
    tagline: 'Solar-dehydrated tropical slices below 42°C with 0% added sugar or sulfur dioxide.',
    badge: 'Standup Ziplock Pouches',
    heroImage: '/products/authentic-dehydrated-mango.jpg',
    heroImageAlt: "Nature's Mud Premium Dehydrated Mango Pouch",
    accentColor: '#C9982A',
    productIds: ['dehydrated-mango', 'dehydrated-pineapple', 'dehydrated-apple', 'dehydrated-coconut-chips', 'dehydrated-papaya'],
  },
  {
    id: 'dried-fruits-berries',
    title: 'DRIED FRUITS & BERRIES',
    subtitle: 'STRESS DEFENSE — LITTLE BERRIES, BIG GOODNESS',
    tagline: 'High-altitude wild alpine berries and nutrient-dense sun-dried figs in airtight glass jars.',
    badge: 'Antioxidant & Cognitive Power',
    heroImage: '/products/dried-blueberries-100g.jpg',
    heroImageAlt: "Nature's Mud Dried Blueberries & Cranberries Glass Jars",
    accentColor: '#8E2800',
    productIds: ['dried-blueberries', 'dried-cranberries', 'dried-figs'],
  },
  {
    id: 'powders-salts',
    title: "NATURE'S POWDERS & ESSENTIAL SALTS",
    subtitle: 'OUR SIGNATURE POWDER & SALT COLLECTION',
    tagline: '100% fine micro-milled superfood powders and ancient volcanic ionic mineral rock salts.',
    badge: 'Zero Sugar • 84+ Trace Minerals',
    heroImage: '/products/sweet-potato-powder-100g.jpg',
    heroImageAlt: "Nature's Mud Signature Powders & Himalayan Salts Collection",
    accentColor: '#3A6B35',
    productIds: ['dates-powder', 'beetroot-powder', 'carrot-powder', 'sweet-potato-powder', 'himalayan-pink-salt', 'pure-himalayan-black-salt-bire-noon'],
  },
  {
    id: 'nuts-mixes',
    title: 'PREMIUM NUTS & MIXES',
    subtitle: 'RAW ALMOND — BRAIN FUEL, MENTAL CLARITY',
    tagline: 'Jumbo whole cashews, mountain almonds, Californian pistachios, and rich macadamias.',
    badge: 'Oil-Free Roasted & Raw Whole',
    heroImage: '/products/authentic-almonds.jpg',
    heroImageAlt: "Nature's Mud Raw Almond & Whole Nuts Collection",
    accentColor: '#A75D5D',
    productIds: ['raw-himalayan-almonds', 'roasted-almonds', 'premium-cashewnuts', 'roasted-cashewnuts', 'premium-pistachios', 'superfood-trail-mix', 'macadamia-nuts'],
  },
  {
    id: 'seeds-oils',
    title: 'ORGANIC SEEDS & PREMIER OILS',
    subtitle: 'OUR SIGNATURE SEED & COLD-PRESSED OIL COLLECTION',
    tagline: 'Micro-cleaned hydrophilic seeds and 100% pure cold-pressed virgin coconut milk oil.',
    badge: 'Plant Omega-3 ALA • Lauric Acid',
    heroImage: '/products/chia-seeds.jpg',
    heroImageAlt: "Nature's Mud Organic Seeds & Cold-Pressed Virgin Oils",
    accentColor: '#1B3D2F',
    productIds: ['chia-seeds', 'pumpkin-seeds', 'virgin-coconut-oil-500ml', 'virgin-coconut-oil-180ml'],
  },
];

export default function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
  const [activeTab, setActiveTab] = useState<'flyer' | 'poster' | 'table'>('flyer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'mrp'>('default');
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 2000);
    openDrawer();
  };

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    initialProducts.forEach((p) => {
      map.set(String(p.id), p);
      map.set(String(p.slug), p);
      if (p.dbId) map.set(String(p.dbId), p);
    });
    return map;
  }, [initialProducts]);

  const packagingTypes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.packing) set.add(p.packing);
    });
    return Array.from(set);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesSearch =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat =
          selectedCategory === 'all' ||
          p.categorySlug === selectedCategory ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesPack = selectedPackaging === 'all' || p.packing === selectedPackaging;

        return matchesSearch && matchesCat && matchesPack;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'mrp') return (b.mrp || b.compareAtPrice || 0) - (a.mrp || a.compareAtPrice || 0);
        return Number(a.id) - Number(b.id);
      });
  }, [initialProducts, searchQuery, selectedCategory, selectedPackaging, sortBy]);

  const whatsappMessage = encodeURIComponent(
    "Hello Nature's Mud! I reviewed your official 2026 Product Catalog & Price List and would like to place an order / wholesale inquiry."
  );

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-gray-800">
      {/* ── TOP HERO HEADER ── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#142E23] via-[#1B3D2F] to-[#12271E] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#C9982A]/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9982A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#3A6B35]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <nav className="text-xs sm:text-sm text-emerald-200/70 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#C9982A] font-semibold">Official Product Catalog & Price List</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9982A]/20 border border-[#C9982A]/40 text-[#F4E8C1] text-xs font-semibold uppercase tracking-wider mb-3">
                <Leaf className="w-3.5 h-3.5 text-[#C9982A]" /> Official Master Catalog • 25 Certified Products
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                Nature's <span className="text-[#C9982A]">Mud</span> Product Catalog
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
                Official price list and specifications matching our master catalog edition. Explore all 25
                solar-dehydrated fruits, whole-food powders, organic salts, raw nuts, and cold-pressed virgin oils.
              </p>

              {/* Quick stats pills */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9982A]" /> 25 Certified Items
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9982A]" /> 100% Chemical-Free
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9982A]" /> Standup Pouch & Glass Jars
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9982A]" /> Nationwide Delivery in Nepal
                </span>
              </div>
            </div>

            {/* Quick Action Download Box */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-[#C9982A]/30 shadow-2xl flex flex-col gap-3 lg:min-w-[340px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C9982A] text-[#1B3D2F] flex items-center justify-center shrink-0 shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-base leading-snug">Official Printables</h2>
                  <p className="text-xs text-white/70">Official Master Catalog & Flyer</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="/Nature_Mud_Product_Catalog.pdf"
                  download="Nature_Mud_Product_Catalog_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9982A] to-[#D4AF37] hover:from-[#B88720] hover:to-[#C9982A] text-[#1B3D2F] font-heading font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" /> Catalog
                </a>

                <button
                  onClick={() => setIsPosterModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-xs transition-colors"
                >
                  <Eye className="w-4 h-4 text-[#C9982A]" /> View Full Official Flyer Image
                </button>

                <a
                  href={`https://wa.me/9779713888002?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-semibold text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Wholesale & Dealer Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── VIEW TABS & FILTER BAR ── */}
      <section className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-amber-900/10">
            <button
              onClick={() => setActiveTab('flyer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'flyer'
                  ? 'bg-[#1B3D2F] text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#C9982A]" /> Catalog Flyer View
            </button>
            <button
              onClick={() => setActiveTab('poster')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'poster'
                  ? 'bg-[#1B3D2F] text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C9982A]" /> Official Flyer Poster
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'table'
                  ? 'bg-[#1B3D2F] text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-[#C9982A]" /> Master Price Table
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or ingredient..."
              className="w-full pl-10 pr-4 py-1.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1B3D2F] focus:ring-1 focus:ring-[#1B3D2F] outline-none transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ========================================================= */}
        {/* TAB 1: EXACT CATALOG FLYER VIEW (Categorized 5 Sections) */}
        {/* ========================================================= */}
        {activeTab === 'flyer' && (
          <div className="space-y-12">
            {/* Introductory notice */}
            <div className="bg-[#FAF7F0] border border-[#C9982A]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B3D2F] text-[#C9982A] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm sm:text-base">
                    Master 5-Section Catalog Layout
                  </h3>
                  <p className="text-xs text-gray-600">
                    Organized exactly according to the Nature's Mud 2026 Master Flyer with certified official MRP.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPosterModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-[#1B3D2F] border border-gray-300 text-xs font-semibold shadow-sm transition-all"
                >
                  Inspect Full Poster
                </button>
                <a
                  href="/Nature_Mud_Product_Catalog.pdf"
                  download="Nature_Mud_Product_Catalog_2026.pdf"
                  className="px-3 py-1.5 rounded-lg bg-[#1B3D2F] hover:bg-[#2D5A27] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Catalog
                </a>
              </div>
            </div>

            {/* Loop through each of the 5 Catalog Flyer Sections */}
            {CATALOG_SECTIONS.map((sec, secIdx) => {
              // Gather products belonging to this section
              const secProducts = sec.productIds
                .map((id) => productMap.get(id))
                .filter((p): p is Product => Boolean(p))
                .filter((p) => {
                  if (!searchQuery.trim()) return true;
                  return (
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                });

              if (secProducts.length === 0) return null;

              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Section Top Header Banner */}
                  <div className="bg-gradient-to-r from-[#1B3D2F] via-[#244A39] to-[#1B3D2F] text-white p-5 sm:p-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9982A]/20 border border-[#C9982A]/40 text-[#F4E8C1] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                          <Sparkles className="w-3 h-3 text-[#C9982A]" /> {sec.badge}
                        </div>
                        <h2 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-wide">
                          {sec.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#F4E8C1] font-semibold tracking-wider uppercase mt-0.5">
                          {sec.subtitle}
                        </p>
                        <p className="text-xs text-white/75 mt-1.5 max-w-2xl">{sec.tagline}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold text-white">
                          {secProducts.length} Items
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section Content: Table + Product Cards */}
                  <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Official Catalog Table */}
                    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#2D5A27] text-white text-[11px] sm:text-xs font-heading uppercase tracking-wider">
                            <th className="py-3 px-3.5 text-center w-12">SN</th>
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4 text-center">Qty / Weight</th>
                            <th className="py-3 px-4">Packing</th>
                            <th className="py-3 px-4 text-right">Official MRP</th>
                            <th className="py-3 px-4 text-center">Quick Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                          {secProducts.map((p, rowIdx) => {
                            const isAdded = addedSlug === p.slug;
                            const mrpPrice = p.mrp || p.compareAtPrice || p.price;
                            const isDiscounted = p.compareAtPrice && p.compareAtPrice > p.price;

                            return (
                              <tr
                                key={p.slug}
                                className={`hover:bg-[#F9F7F2] transition-colors ${
                                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                                }`}
                              >
                                <td className="py-3.5 px-3.5 font-bold text-center text-gray-500">
                                  {rowIdx + 1}
                                </td>
                                <td className="py-3.5 px-4">
                                  <Link
                                    href={`/products/${p.slug}`}
                                    className="flex items-center gap-3 group"
                                  >
                                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                      <Image
                                        src={resolveImageUrl(p.image)}
                                        alt={p.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-heading font-bold text-gray-900 group-hover:text-[#2D5A27] transition-colors text-sm">
                                        {p.name}
                                      </div>
                                      <div className="text-[11px] text-gray-500 line-clamp-1">
                                        {p.shortDescription || p.description}
                                      </div>
                                    </div>
                                  </Link>
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-800">
                                  {p.weight}
                                </td>
                                <td className="py-3.5 px-4 text-gray-600 font-medium">
                                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-xs">
                                    {p.packing || 'Glass Jar'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="font-heading font-black text-[#1B3D2F] text-base leading-tight">
                                    Rs. {p.price}
                                  </div>
                                  {isDiscounted && (
                                    <div className="text-[11px] text-gray-400 line-through">
                                      MRP: Rs. {p.compareAtPrice}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={(e) => handleAddToCart(p, e)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                                        isAdded
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-[#1B3D2F] hover:bg-[#2D5A27] text-white shadow-sm'
                                      }`}
                                    >
                                      {isAdded ? (
                                        <span className="flex items-center gap-1">
                                          <Check className="w-3 h-3" /> Added
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1">
                                          <ShoppingBag className="w-3 h-3" /> Add
                                        </span>
                                      )}
                                    </button>
                                    <Link
                                      href={`/products/${p.slug}`}
                                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                                      title="View Product Details"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Section Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pt-2">
                      {secProducts.map((prod) => {
                        const isAdded = addedSlug === prod.slug;
                        const isDiscounted = prod.compareAtPrice && prod.compareAtPrice > prod.price;

                        return (
                          <div
                            key={prod.slug}
                            className="group bg-[#FAF9F5] hover:bg-white rounded-2xl border border-gray-200 hover:border-[#2D5A27]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                          >
                            <Link
                              href={`/products/${prod.slug}`}
                              className="block relative aspect-[4/3] bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={resolveImageUrl(prod.image)}
                                alt={prod.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 30vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />

                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <span className="bg-[#1B3D2F]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                  100% Pure
                                </span>
                              </div>

                              <div className="absolute top-2 right-2">
                                <span className="bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm font-mono">
                                  {prod.weight}
                                </span>
                              </div>

                              <div className="absolute bottom-2 left-2">
                                <span className="bg-white/90 backdrop-blur-sm text-[#1B3D2F] text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                  {prod.packing || 'Glass Jar'}
                                </span>
                              </div>
                            </Link>

                            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                              <div>
                                <Link href={`/products/${prod.slug}`}>
                                  <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug group-hover:text-[#2D5A27] transition-colors line-clamp-1">
                                    {prod.name}
                                  </h3>
                                </Link>
                                <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                  {prod.shortDescription || prod.description}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-gray-200/60">
                                <div className="flex items-center justify-between mb-2.5">
                                  <div>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                                      Official MRP
                                    </span>
                                    <span className="font-heading font-black text-[#1B3D2F] text-lg leading-tight">
                                      {formatPrice(prod.price)}
                                    </span>
                                  </div>

                                  {isDiscounted && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      Rs. {prod.compareAtPrice}
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={(e) => handleAddToCart(prod, e)}
                                    className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-heading font-bold transition-all ${
                                      isAdded
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#1B3D2F] hover:bg-[#2D5A27] text-white shadow-sm'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" /> Added!
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                                      </>
                                    )}
                                  </button>

                                  <Link
                                    href={`/products/${prod.slug}`}
                                    className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold transition-colors"
                                  >
                                    Details <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: OFFICIAL FLYER POSTER VIEWER & DOWNLOAD           */}
        {/* ========================================================= */}
        {activeTab === 'poster' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm text-center">
            <div className="max-w-2xl mx-auto mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9982A]/20 text-[#8B6B1B] text-xs font-bold uppercase tracking-wider mb-2">
                Official Printable Flyer
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Nature's Mud 2026 Master Product Flyer
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Click the preview below to inspect in high definition, or download the original high-res poster and
                official master catalog.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => setIsPosterModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1B3D2F] hover:bg-[#2D5A27] text-white text-xs sm:text-sm font-heading font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <ZoomIn className="w-4 h-4 text-[#C9982A]" /> Zoom / Fullscreen Preview
                </button>
                <a
                  href="/official-product-catalog.jpg"
                  download="Natures_Mud_Official_Product_Catalog.jpg"
                  className="px-5 py-2.5 rounded-xl bg-[#C9982A] hover:bg-[#B88720] text-[#1B3D2F] text-xs sm:text-sm font-heading font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Poster
                </a>
                <a
                  href="/Nature_Mud_Product_Catalog.pdf"
                  download="Nature_Mud_Product_Catalog_2026.pdf"
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#1B3D2F]" /> Catalog
                </a>
              </div>
            </div>

            {/* Flyer Image Container */}
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-[#C9982A]/40 shadow-2xl cursor-pointer group bg-[#F8F5EE]"
            >
              <img
                src="/official-product-catalog.jpg"
                alt="Nature's Mud Official Product Catalog 2026"
                className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-[#1B3D2F]/90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-[#C9982A]" /> Click to Open Fullscreen
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONSOLIDATED MASTER PRICE TABLE (Filterable)      */}
        {/* ========================================================= */}
        {activeTab === 'table' && (
          <div className="space-y-6">
            {/* Table Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-xs font-bold text-gray-400 uppercase mr-1 shrink-0">Category:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#1B3D2F] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All (25)
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c.slug
                        ? 'bg-[#1B3D2F] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 font-semibold uppercase">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-xl focus:border-[#1B3D2F] outline-none"
                >
                  <option value="default">Default Catalog Order (SN 1–25)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="mrp">Highest MRP</option>
                </select>
              </div>
            </div>

            {/* Big Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1B3D2F] text-white text-xs font-heading uppercase tracking-wider">
                      <th className="py-3.5 px-4 text-center w-12">SN</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-center">Weight / Qty</th>
                      <th className="py-3.5 px-4">Packaging Type</th>
                      <th className="py-3.5 px-4 text-right">Official MRP</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                    {filteredProducts.map((p, idx) => {
                      const isAdded = addedSlug === p.slug;
                      return (
                        <tr
                          key={p.slug}
                          className={`hover:bg-[#F8F6F0] transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-center text-gray-500">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <Link href={`/products/${p.slug}`} className="flex items-center gap-3 group">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                <Image
                                  src={resolveImageUrl(p.image)}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-heading font-bold text-gray-900 group-hover:text-[#2D5A27] transition-colors">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-gray-400 line-clamp-1">{p.shortDescription}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#2D5A27] border border-emerald-200/60">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-gray-800">
                            {p.weight}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-600">{p.packing || 'Glass Jar'}</td>
                          <td className="py-3 px-4 text-right font-heading font-black text-[#2D5A27] text-base">
                            Rs. {p.price}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => handleAddToCart(p, e)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#1B3D2F] hover:bg-[#2D5A27] text-white shadow-sm'
                              }`}
                            >
                              {isAdded ? 'Added' : 'Add'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM WHOLESALE & DEALER SUPPORT BANNER ── */}
        <section className="mt-14 bg-gradient-to-br from-[#1B3D2F] to-[#122B20] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#C9982A]/30">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C9982A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9982A]/20 border border-[#C9982A]/40 text-[#F4E8C1] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C9982A]" /> Institutional & Dealer Support
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Need wholesale pricing, dealer distribution or printed catalogs?
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
              Nature's Mud supplies certified superfoods and dehydrated fruits to retail stores, pediatric clinics,
              ayurvedic pharmacies, sports gyms, and hospitality partners nationwide across Nepal.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="/Nature_Mud_Product_Catalog.pdf"
                download="Nature_Mud_Product_Catalog_2026.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9982A] to-[#D4AF37] hover:from-[#B88720] hover:to-[#C9982A] text-[#1B3D2F] font-heading font-bold text-sm shadow-lg transition-all"
              >
                <Download className="w-4 h-4" /> Catalog
              </a>

              <a
                href={`https://wa.me/9779713888002?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp (+977 9713888002)
              </a>

              <Link
                href="/wholesale"
                className="inline-flex items-center gap-1.5 text-xs text-[#F4E8C1] hover:underline font-semibold"
              >
                View Wholesale Terms & Inquiries <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FULLSCREEN POSTER MODAL ── */}
      <AnimatePresence>
        {isPosterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsPosterModalOpen(false)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full bg-[#1B3D2F] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#142E23] text-white flex items-center justify-between border-b border-[#C9982A]/30">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#C9982A]" />
                  <span className="font-heading font-bold text-sm">
                    Nature's Mud Official 2026 Master Product Catalog Flyer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/official-product-catalog.jpg"
                    download="Nature_Mud_Product_Catalog_2026.jpg"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Save
                  </a>
                  <button
                    onClick={() => setIsPosterModalOpen(false)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Image Body with scroll */}
              <div className="overflow-y-auto p-4 flex items-center justify-center bg-black/40">
                <img
                  src="/official-product-catalog.jpg"
                  alt="Nature's Mud Official Master Product Catalog 2026"
                  className="max-h-[80vh] w-auto object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
