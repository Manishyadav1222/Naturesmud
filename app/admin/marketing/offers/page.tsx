'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useAdminAuth, PERMISSIONS } from '@/lib/admin/auth';
import { Card, CardContent } from '@/components/admin/Card';
import { Button } from '@/components/admin/Button';
import { Input } from '@/components/admin/Input';
import { Modal } from '@/components/admin/Modal';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { initialFestivalOffers, FestivalOffer, OfferItem } from '@/lib/data/offers';
import { products as localProducts } from '@/lib/data/products';
import { api } from '@/lib/admin/api-client';
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  CircleAlert,
  Flame,
  Tag,
  Calendar,
  Gift,
  Eye,
  Check,
  Search,
  Layers,
  Copy,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Percent,
  Timer,
  CheckCircle2,
  X,
  Sliders,
  ArrowRight,
  Wand2,
} from 'lucide-react';

interface CatalogProduct {
  id: string | number;
  name: string;
  sku?: string;
  price: number;
  weight?: string | number;
  unit?: string;
  image?: string;
  images?: string[] | string;
  category?: string | { name: string };
  stock?: number;
  stock_quantity?: number;
}

const FESTIVE_PRESETS = [
  {
    name: '🇳🇵 Dashain Maha Utsav',
    title: 'Dashain Maha Utsav Family Celebration Combo',
    subtitle: 'Mustang Forest Honey, Crunchy Himalayan Walnuts & Roasted Almonds',
    festivalName: '🇳🇵 Dashain Maha Dhamaka Offer',
    badge: '35% OFF · Festive Special',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Dhamaka',
    discountPercentage: 35,
    couponCode: 'DASHAIN35',
    tag: 'Limited Festive Stock',
    themeColor: 'gold' as const,
    highlights: [
      'Free Express Delivery Across Nepal',
      'Special Festive Wooden Gift Box',
      '100% Pure Himalayan Natural',
    ],
  },
  {
    name: '✨ Tihar Bhaitika Box',
    title: 'Tihar Special Bhaitika Himalayan Gift Box',
    subtitle: 'Raw Mountain Honey + Organic Walnuts + Roasted Almonds in Deluxe Gift Box',
    festivalName: '✨ Tihar Bhaitika Gift Box Campaign',
    badge: '30% OFF · Premium Gift Edition',
    categoryIcon: '🎁',
    categoryLabel: 'Tihar Gift Box',
    discountPercentage: 30,
    couponCode: 'TIHARGIFT',
    tag: 'Bhai Tihar Bestseller',
    themeColor: 'amber' as const,
    highlights: [
      'Traditional Festive Gift Packaging',
      'Handwritten Personalized Blessing Card',
      'Doorstep Delivery Before Bhaitika',
    ],
  },
  {
    name: '🏋️ Gym & Muscle Pack',
    title: 'Himalayan Gym & Workout Muscle Pack',
    subtitle: 'High-Protein Raw Walnuts, Zinc-Rich Pumpkin Seeds & Chia Omega-3',
    festivalName: '🏋️ Workout & Muscle Recovery Combo',
    badge: '32% OFF · High Plant Protein',
    categoryIcon: '🏋️‍♂️',
    categoryLabel: 'Gym & Workout',
    discountPercentage: 32,
    couponCode: 'GYMPOWER10',
    tag: 'Athletes #1 Pick',
    themeColor: 'emerald' as const,
    highlights: [
      'High Plant Protein & Zinc for Muscle Repair',
      'Plant Omega-3 to Reduce Joint Inflammation',
      'Clean Pre/Post-Workout Nutrition (Zero Sugar)',
    ],
  },
  {
    name: '🌅 Morning Cleanse Kit',
    title: 'Daily Morning Diet & Breakfast Cleanse Kit',
    subtitle: 'Metabolism Kickstart with Raw Mustang Honey, Chia Seeds & Pink Salt',
    festivalName: '🌅 Morning Diet & Cleanse Combo',
    badge: '28% OFF · Clean Metabolism',
    categoryIcon: '🌅',
    categoryLabel: 'Morning Diet',
    discountPercentage: 28,
    couponCode: 'MORNING10',
    tag: 'Morning Ritual',
    themeColor: 'amber' as const,
    highlights: [
      'Warm Water Morning Detox Electrolytes',
      'Gut Microbiome & Smooth Digestion Support',
      'Sustained Natural Energy Without Caffeine Spikes',
    ],
  },
  {
    name: '🧘 Total Immunity Shield',
    title: 'Maha Daily Health & Immunity Shield',
    subtitle: '3-in-1 Himalayan Superfood Mix, Roasted Almonds & Beetroot Powder',
    festivalName: '🧘 Total Health & Immunity Combo',
    badge: '30% OFF · Complete Wellness',
    categoryIcon: '🧘',
    categoryLabel: 'Health & Vitality',
    discountPercentage: 30,
    couponCode: 'HEALTH10',
    tag: 'Family Favorite',
    themeColor: 'purple' as const,
    highlights: [
      'Full Daily Spectrum of Minerals & Vitamins',
      'Blood Flow, Stamina & Heart Health Support',
      'Handpicked Organic Sourcing from Nepal Smallholders',
    ],
  },
];

const THEME_COLORS: Array<{ id: FestivalOffer['themeColor']; label: string; bgClass: string; borderClass: string; textClass: string }> = [
  { id: 'gold', label: 'Festive Gold', bgClass: 'bg-amber-500', borderClass: 'border-amber-500', textClass: 'text-amber-700' },
  { id: 'crimson', label: 'Festive Crimson', bgClass: 'bg-rose-600', borderClass: 'border-rose-600', textClass: 'text-rose-700' },
  { id: 'emerald', label: 'Himalayan Emerald', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-600', textClass: 'text-emerald-700' },
  { id: 'amber', label: 'Honey Amber', bgClass: 'bg-orange-500', borderClass: 'border-orange-500', textClass: 'text-orange-700' },
  { id: 'purple', label: 'Royal Purple', bgClass: 'bg-purple-600', borderClass: 'border-purple-600', textClass: 'text-purple-700' },
];

export default function AdminOffersPage() {
  const { hasPermission } = useAdminAuth();
  const [offers, setOffers] = useState<FestivalOffer[]>(initialFestivalOffers);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<FestivalOffer | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'FESTIVAL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const canManage = hasPermission(PERMISSIONS.MANAGE_CAMPAIGNS);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ data: FestivalOffer[] }>('/marketing/offers');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOffers(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get<{ data: CatalogProduct[] }>('/products?limit=100');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCatalogProducts(res.data);
      } else {
        // Fallback to local products
        const fallback: CatalogProduct[] = (localProducts || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || `NM-${p.id}`,
          price: p.price,
          weight: p.weight || '250g',
          image: p.image || (p.images && p.images[0]) || '/products/cranberries.jpg',
          category: typeof p.category === 'string' ? p.category : p.category?.name || 'Superfoods',
        }));
        setCatalogProducts(fallback);
      }
    } catch {
      // Fallback
      const fallback: CatalogProduct[] = (localProducts || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || `NM-${p.id}`,
        price: p.price,
        weight: p.weight || '250g',
        image: p.image || (p.images && p.images[0]) || '/products/cranberries.jpg',
        category: typeof p.category === 'string' ? p.category : p.category?.name || 'Superfoods',
      }));
      setCatalogProducts(fallback);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const handleToggleActive = async (id: string) => {
    const target = offers.find((o) => o.id === id);
    if (!target) return;
    const newActiveState = !target.isActive;

    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: newActiveState } : o))
    );

    try {
      await api.patch(`/marketing/offers/${id}`, { isActive: newActiveState });
    } catch {
      fetchOffers();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the offer "${title}"?`)) return;
    setOffers((prev) => prev.filter((o) => o.id !== id));
    try {
      await api.delete(`/marketing/offers/${id}`);
    } catch {
      fetchOffers();
    }
  };

  const handleDuplicate = (offer: FestivalOffer) => {
    const duplicated: FestivalOffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      title: `${offer.title} (Copy)`,
      couponCode: `${offer.couponCode}_NEW`,
      isActive: false,
    };
    setEditing(duplicated);
  };

  const handleSaveOffer = async (newOffer: FestivalOffer) => {
    setOffers((prev) => {
      const idx = prev.findIndex((o) => o.id === newOffer.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newOffer;
        return updated;
      }
      return [newOffer, ...prev];
    });

    setIsCreateOpen(false);
    setEditing(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    try {
      await api.post('/marketing/offers', newOffer);
      fetchOffers();
    } catch (err) {
      console.error('Failed to persist offer to server', err);
    }
  };

  if (!canManage) {
    return (
      <EmptyState
        icon={<CircleAlert className="h-12 w-12 text-red-400" />}
        title="Access Denied"
        description="You don't have permission to manage festival offers."
      />
    );
  }

  const activeCount = offers.filter((o) => o.isActive).length;
  const festivalCount = offers.filter((o) => o.isFestival).length;
  const totalCombos = offers.length;

  const filteredOffers = offers.filter((offer) => {
    if (filterType === 'FESTIVAL' && !offer.isFestival) return false;
    if (filterType === 'ACTIVE' && !offer.isActive) return false;
    if (filterType === 'INACTIVE' && offer.isActive) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        offer.title.toLowerCase().includes(q) ||
        offer.festivalName.toLowerCase().includes(q) ||
        offer.couponCode.toLowerCase().includes(q) ||
        offer.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Festival Offers & Custom Combos</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600 animate-pulse" /> Live Storefront Sync
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Create festival deals, pick custom products from the catalog, configure discounts, and showcase interactive bundle deals to customers on the homepage.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          Create Festival Offer
        </Button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 animate-fadeIn shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">Festival Offer successfully saved and published to the customer storefront!</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Active Storefront Deals"
          value={String(activeCount)}
          icon={<Flame className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Festival Campaigns"
          value={String(festivalCount)}
          icon={<Sparkles className="h-5 w-5 text-primary-600" />}
        />
        <StatCard
          title="Total Combo Offers"
          value={String(totalCombos)}
          icon={<Gift className="h-5 w-5 text-lime-600" />}
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['ALL', 'FESTIVAL', 'ACTIVE', 'INACTIVE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {type === 'ALL'
                ? `All Offers (${offers.length})`
                : type === 'FESTIVAL'
                ? `Festival Campaigns (${festivalCount})`
                : type === 'ACTIVE'
                ? `Live on Store (${activeCount})`
                : `Inactive (${offers.length - activeCount})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search offers or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <EmptyState
            icon={<Gift className="h-12 w-12 text-gray-300" />}
            title="No festival offers found"
            description="Create your custom festival offer or combo bundle by selecting products from your catalog."
            action={
              <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Festival Offer
              </Button>
            }
          />
        ) : (
          filteredOffers.map((offer) => {
            const savings = Math.max(0, offer.originalPrice - offer.offerPrice);
            return (
              <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow border-gray-200/80">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left info */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={offer.isActive ? 'success' : 'secondary'}>
                          {offer.isActive ? '● Live on Storefront' : 'Inactive'}
                        </Badge>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <span>{offer.categoryIcon || '🌿'}</span>
                          <span>{offer.festivalName}</span>
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-200">
                          Code: {offer.couponCode}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {offer.discountPercentage}% OFF
                        </span>
                        {offer.tag && (
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            {offer.tag}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{offer.subtitle}</p>
                      </div>

                      {/* Product Thumbnails Stack */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Bundle ({offer.items.length} items):
                        </span>
                        {offer.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/80 text-xs text-gray-700 hover:bg-white transition-colors"
                          >
                            <div className="w-5 h-5 rounded relative overflow-hidden shrink-0 border border-gray-200">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <span className="font-medium truncate max-w-[130px]">{item.name}</span>
                            <span className="text-[10px] font-semibold text-gray-500">({item.weight})</span>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      {offer.highlights && offer.highlights.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {offer.highlights.map((h, idx) => (
                            <span key={idx} className="text-[11px] text-gray-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Price & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <div className="text-left lg:text-right min-w-[130px]">
                        <div className="text-2xl font-black text-primary-700 font-heading">
                          Rs. {offer.offerPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block border border-amber-200">
                          Save Rs. {savings.toLocaleString()} ({offer.discountPercentage}% off)
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={offer.isActive ? 'outline' : 'primary'}
                          onClick={() => handleToggleActive(offer.id)}
                        >
                          {offer.isActive ? 'Deactivate' : 'Publish Live'}
                        </Button>

                        <button
                          onClick={() => handleDuplicate(offer)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          title="Duplicate Offer"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => setEditing(offer)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          title="Edit Offer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(offer.id, offer.title)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Offer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Comprehensive Festival Offer Modal with Live Product Selection */}
      <OfferEditorModal
        open={isCreateOpen || !!editing}
        onClose={() => {
          setIsCreateOpen(false);
          setEditing(null);
        }}
        offer={editing}
        catalogProducts={catalogProducts}
        onSave={handleSaveOffer}
      />
    </div>
  );
}

function OfferEditorModal({
  open,
  onClose,
  offer,
  catalogProducts,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  offer: FestivalOffer | null;
  catalogProducts: CatalogProduct[];
  onSave: (offer: FestivalOffer) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    festivalName: '🇳🇵 Dashain & Tihar Maha Utsav Offer',
    badge: '35% OFF · Festival Dhamaka',
    categoryIcon: '🇳🇵',
    categoryLabel: 'Festival Dhamaka',
    discountPercentage: '30',
    originalPrice: '0',
    offerPrice: '0',
    couponCode: 'FESTIVE30',
    tag: 'Limited Festive Stock',
    themeColor: 'gold' as FestivalOffer['themeColor'],
    isFestival: true,
    isActive: true,
  });

  const [selectedItems, setSelectedItems] = useState<OfferItem[]>([]);
  const [highlights, setHighlights] = useState<string[]>([
    'Free Express Doorstep Delivery Across Nepal',
    'Special Festive Wooden Gift Box Packaging',
    '100% Certified Organic & Chemical-Free',
  ]);
  const [newHighlight, setNewHighlight] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');

  // Initialize or reset form on open/change
  useEffect(() => {
    if (open) {
      if (offer) {
        setForm({
          title: offer.title || '',
          subtitle: offer.subtitle || '',
          festivalName: offer.festivalName || '🇳🇵 Dashain & Tihar Maha Utsav Offer',
          badge: offer.badge || '35% OFF · Festival Dhamaka',
          categoryIcon: offer.categoryIcon || '🇳🇵',
          categoryLabel: offer.categoryLabel || 'Festival Dhamaka',
          discountPercentage: String(offer.discountPercentage || 30),
          originalPrice: String(offer.originalPrice || 0),
          offerPrice: String(offer.offerPrice || 0),
          couponCode: offer.couponCode || 'FESTIVE30',
          tag: offer.tag || 'Bestseller Combo',
          themeColor: offer.themeColor || 'gold',
          isFestival: offer.isFestival !== false,
          isActive: offer.isActive !== false,
        });
        setSelectedItems(offer.items || []);
        setHighlights(
          offer.highlights && offer.highlights.length > 0
            ? offer.highlights
            : [
                'Free Express Delivery Across Nepal',
                'Special Festive Gift Packaging',
                '100% Pure Himalayan Natural',
              ]
        );
      } else {
        // Defaults for new offer
        const defaultItems: OfferItem[] = catalogProducts.slice(0, 3).map((p) => ({
          productId: String(p.id),
          name: p.name,
          weight: p.weight ? String(p.weight) : '250g',
          image: p.image || '/products/cranberries.jpg',
          price: Number(p.price || 500),
        }));

        const originalTotal = defaultItems.reduce((sum, item) => sum + item.price, 0);
        const discountPct = 30;
        const offerTotal = Math.round(originalTotal * (1 - discountPct / 100));

        setForm({
          title: 'Dashain & Tihar Maha Utsav Himalayan Combo',
          subtitle: 'Pure Himalayan Superfood Bundle with Honey, Walnuts & Roasted Almonds',
          festivalName: '🇳🇵 Dashain & Tihar Maha Dhamaka Offer',
          badge: '30% OFF · Festive Dhamaka',
          categoryIcon: '🇳🇵',
          categoryLabel: 'Festival Dhamaka',
          discountPercentage: String(discountPct),
          originalPrice: String(originalTotal),
          offerPrice: String(offerTotal),
          couponCode: 'FESTIVE30',
          tag: 'Festive Bestseller',
          themeColor: 'gold',
          isFestival: true,
          isActive: true,
        });
        setSelectedItems(defaultItems);
        setHighlights([
          'Free Express Doorstep Delivery Across Nepal',
          'Special Festive Wooden Gift Box Packaging',
          '100% Certified Organic & Chemical-Free',
        ]);
      }
    }
  }, [open, offer, catalogProducts]);

  // Recalculate original and offer price whenever selectedItems or discount changes
  const handleRecalculatePrices = (items: OfferItem[], discountPct: number) => {
    const totalOrig = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const calculatedOffer = Math.max(0, Math.round(totalOrig * (1 - discountPct / 100)));
    setForm((prev) => ({
      ...prev,
      originalPrice: String(totalOrig),
      offerPrice: String(calculatedOffer),
    }));
  };

  const handleApplyPreset = (preset: (typeof FESTIVE_PRESETS)[0]) => {
    setForm((prev) => {
      const orig = Number(prev.originalPrice) || 2500;
      const calcOffer = Math.round(orig * (1 - preset.discountPercentage / 100));
      return {
        ...prev,
        title: preset.title,
        subtitle: preset.subtitle,
        festivalName: preset.festivalName,
        badge: preset.badge,
        categoryIcon: preset.categoryIcon,
        categoryLabel: preset.categoryLabel,
        discountPercentage: String(preset.discountPercentage),
        couponCode: preset.couponCode,
        tag: preset.tag,
        themeColor: preset.themeColor,
        offerPrice: String(calcOffer),
      };
    });
    setHighlights(preset.highlights);
  };

  const handleToggleProduct = (product: CatalogProduct) => {
    const prodId = String(product.id);
    const existingIndex = selectedItems.findIndex((i) => i.productId === prodId);

    let updated: OfferItem[];
    if (existingIndex >= 0) {
      updated = selectedItems.filter((i) => i.productId !== prodId);
    } else {
      const newItem: OfferItem = {
        productId: prodId,
        name: product.name,
        weight: product.weight ? String(product.weight) : '250g',
        image: product.image || (Array.isArray(product.images) ? product.images[0] : typeof product.images === 'string' ? product.images : '/products/cranberries.jpg'),
        price: Number(product.price || 0),
      };
      updated = [...selectedItems, newItem];
    }

    setSelectedItems(updated);
    handleRecalculatePrices(updated, Number(form.discountPercentage) || 30);
  };

  const handleUpdateItemWeight = (index: number, weight: string) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], weight };
    setSelectedItems(updated);
  };

  const handleUpdateItemPrice = (index: number, priceStr: string) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], price: Number(priceStr) || 0 };
    setSelectedItems(updated);
    handleRecalculatePrices(updated, Number(form.discountPercentage) || 30);
  };

  const handleRemoveItem = (index: number) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
    handleRecalculatePrices(updated, Number(form.discountPercentage) || 30);
  };

  const handleDiscountChange = (newDiscount: string) => {
    const pct = Number(newDiscount) || 0;
    const orig = Number(form.originalPrice) || 0;
    const calculatedOffer = Math.round(orig * (1 - pct / 100));
    setForm((prev) => ({
      ...prev,
      discountPercentage: newDiscount,
      offerPrice: String(calculatedOffer),
      badge: `${pct}% OFF · ${prev.tag || 'Special Offer'}`,
    }));
  };

  const handleOfferPriceChange = (newOfferPrice: string) => {
    const offerP = Number(newOfferPrice) || 0;
    const orig = Number(form.originalPrice) || 0;
    let pct = 0;
    if (orig > 0) {
      pct = Math.round(((orig - offerP) / orig) * 100);
    }
    setForm((prev) => ({
      ...prev,
      offerPrice: newOfferPrice,
      discountPercentage: String(Math.max(0, pct)),
    }));
  };

  const handleGenerateCode = () => {
    const cleanTag = form.tag.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6) || 'FESTIVE';
    const disc = form.discountPercentage || '30';
    setForm((prev) => ({ ...prev, couponCode: `${cleanTag}${disc}` }));
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights((prev) => [...prev, newHighlight.trim()]);
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert('Please select at least 1 product for your festival offer combo bundle.');
      return;
    }

    const newOffer: FestivalOffer = {
      id: offer?.id || `offer-${Date.now()}`,
      title: form.title,
      subtitle: form.subtitle,
      festivalName: form.festivalName,
      badge: form.badge,
      categoryIcon: form.categoryIcon,
      categoryLabel: form.categoryLabel,
      discountPercentage: Number(form.discountPercentage) || 0,
      originalPrice: Number(form.originalPrice) || 0,
      offerPrice: Number(form.offerPrice) || 0,
      couponCode: form.couponCode.toUpperCase(),
      tag: form.tag,
      themeColor: form.themeColor,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: selectedItems,
      highlights,
      isFestival: form.isFestival,
      isActive: form.isActive,
    };

    onSave(newOffer);
  };

  const filteredCatalog = catalogProducts.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    const cat = typeof p.category === 'string' ? p.category : p.category?.name || '';
    return p.name.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
  });

  const savings = Math.max(0, Number(form.originalPrice) - Number(form.offerPrice));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={offer ? 'Edit Festival Combo Offer' : 'Create Custom Festival Combo Offer'}
      size="xl"
      className="max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        {/* Preset Templates bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-primary" /> Quick Presets:
          </span>
          {FESTIVE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-gray-50 hover:bg-amber-50 hover:text-amber-800 border border-gray-200 hover:border-amber-300 text-gray-700 transition-all whitespace-nowrap shrink-0"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('EDIT')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'EDIT' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Form & Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'PREVIEW' ? 'bg-white shadow-xs text-primary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Storefront Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="overflow-y-auto space-y-6 pr-1 max-h-[calc(90vh-140px)]">
        {activeTab === 'EDIT' ? (
          <div className="space-y-6">
            {/* Section 1: Offer Identity & Festival Details */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200/70 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-gray-900 font-heading">1. Festival & Campaign Branding</h3>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-700">Festival Campaign Name</label>
                  <Input
                    required
                    placeholder="e.g. 🇳🇵 Dashain & Tihar Maha Utsav Offer"
                    value={form.festivalName}
                    onChange={(e) => setForm({ ...form, festivalName: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-700">Offer Title</label>
                  <Input
                    required
                    placeholder="e.g. Dashain Maha Utsav Family Celebration Combo"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-700">Subtitle / Tagline</label>
                  <Input
                    placeholder="e.g. Mustang Forest Honey, Crunchy Himalayan Walnuts & Roasted Almonds"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Category / Tab Label</label>
                  <div className="flex gap-2">
                    <Input
                      className="w-14 text-center text-lg"
                      placeholder="🇳🇵"
                      value={form.categoryIcon}
                      onChange={(e) => setForm({ ...form, categoryIcon: e.target.value })}
                    />
                    <Input
                      required
                      placeholder="e.g. Festival Dhamaka"
                      value={form.categoryLabel}
                      onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Ribbon Tag / Badge</label>
                  <Input
                    placeholder="e.g. Limited Festive Stock"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  />
                </div>

                {/* Theme Color Selector */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">Visual Theme Color Accent</label>
                  <div className="flex flex-wrap gap-2.5">
                    {THEME_COLORS.map((theme) => {
                      const isSelected = form.themeColor === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setForm({ ...form, themeColor: theme.id })}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? `${theme.borderClass} ${theme.textClass} bg-white ring-2 ring-offset-1 ring-primary shadow-xs`
                              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${theme.bgClass}`} />
                          <span>{theme.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Selected Products from Catalog (Admin Choice) */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/90 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-gray-900 font-heading">
                    2. Choose Products for this Festival Combo ({selectedItems.length} selected)
                  </h3>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isProductPickerOpen ? 'Hide Catalog Browser' : '+ Add More Products'}
                </Button>
              </div>

              {/* Collapsible Product Catalog Browser */}
              {isProductPickerOpen && (
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      {filteredCatalog.length} catalog items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {filteredCatalog.map((prod) => {
                      const isSelected = selectedItems.some((i) => i.productId === String(prod.id));
                      const img = prod.image || (Array.isArray(prod.images) ? prod.images[0] : typeof prod.images === 'string' ? prod.images : '/products/cranberries.jpg');
                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleToggleProduct(prod)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary/5 border-primary shadow-xs'
                              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg relative overflow-hidden shrink-0 border border-gray-100">
                            <Image src={img} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                            <p className="text-[11px] text-gray-500">
                              Rs. {Number(prod.price).toLocaleString()} • {prod.weight ? String(prod.weight) : 'Pack'}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Combo Products Table */}
              {selectedItems.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-600">No products added to this combo yet</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Click "+ Add More Products" above to pick products for your festival offer.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-500 grid grid-cols-12 gap-2 px-2">
                    <span className="col-span-5">Product Details</span>
                    <span className="col-span-3">Pack Weight / Size</span>
                    <span className="col-span-3">Regular Price (Rs.)</span>
                    <span className="col-span-1 text-right">Remove</span>
                  </div>

                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 hover:bg-gray-100/50 transition-colors"
                    >
                      {/* Product Name & Thumbnail */}
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 truncate">{item.name}</span>
                      </div>

                      {/* Weight Customizer */}
                      <div className="col-span-3">
                        <Input
                          className="py-1 text-xs bg-white"
                          value={item.weight}
                          placeholder="e.g. 250g"
                          onChange={(e) => handleUpdateItemWeight(idx, e.target.value)}
                        />
                      </div>

                      {/* Price Customizer */}
                      <div className="col-span-3">
                        <Input
                          type="number"
                          className="py-1 text-xs bg-white"
                          value={item.price}
                          onChange={(e) => handleUpdateItemPrice(idx, e.target.value)}
                        />
                      </div>

                      {/* Delete */}
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Smart Pricing & Discount Calculator */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-gray-900 font-heading">3. Pricing & Discount Calculation</h3>
                </div>

                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Customer Saves: Rs. {savings.toLocaleString()} ({form.discountPercentage}% OFF)
                </span>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 items-center">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Total Original Price (Rs.)</label>
                  <Input
                    required
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => {
                      const newOrig = e.target.value;
                      setForm({ ...form, originalPrice: newOrig });
                      const calcOffer = Math.round(Number(newOrig) * (1 - (Number(form.discountPercentage) || 0) / 100));
                      setForm((prev) => ({ ...prev, originalPrice: newOrig, offerPrice: String(calcOffer) }));
                    }}
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Sum of individual items</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Festival Discount %</label>
                    <span className="text-xs font-black text-amber-700">{form.discountPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={form.discountPercentage}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-full accent-primary h-2 bg-amber-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10%</span>
                    <span>25%</span>
                    <span>35% (Festive)</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Final Offer Price (Rs.)</label>
                  <Input
                    required
                    type="number"
                    value={form.offerPrice}
                    onChange={(e) => handleOfferPriceChange(e.target.value)}
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                    Customer Pays: Rs. {Number(form.offerPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coupon Code and Badge settings */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 pt-2 border-t border-amber-200/50">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Coupon Promo Code</label>
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-[11px] text-primary font-bold hover:underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto-Generate
                    </button>
                  </div>
                  <Input
                    required
                    placeholder="e.g. FESTIVE30"
                    value={form.couponCode}
                    onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">Badge Label Text</label>
                  <Input
                    placeholder="e.g. 35% OFF · Festive Dhamaka"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Highlights & Value Props */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/90 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900 font-heading">4. Selling Points & Festive Highlights</h3>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a selling point (e.g., Free Express Doorstep Delivery Across Nepal)..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddHighlight}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{h}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-emerald-600 hover:text-red-600 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Real-time Live Storefront Preview Mode */
          <div className="space-y-6 py-2 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600 shrink-0" />
              <span>This is exactly how this Festival Combo Offer will appear to customers in the homepage showcase section.</span>
            </div>

            {/* Mock Storefront Showcase Card */}
            <div className="rounded-[2rem] bg-white border border-gray-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Glow Accent */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-400/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Side */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wide border border-amber-300">
                      {form.badge || 'FESTIVE OFFER'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200">
                      {form.tag || 'Special Combo'}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                      Coupon: {form.couponCode}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
                      {form.categoryIcon} {form.festivalName}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                      {form.title || 'Untitled Offer'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">{form.subtitle}</p>
                  </div>

                  {/* Products Grid */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Included in this Festival Pack ({selectedItems.length} items):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {selectedItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div className="w-8 h-8 rounded-lg relative overflow-hidden shrink-0 border border-gray-200">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500 font-semibold">{item.weight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Pricing Card */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-950 text-white shadow-lg space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[11px] text-white/60 uppercase font-semibold">Festival Price</span>
                        <div className="text-3xl font-black font-heading text-amber-400">
                          Rs. {Number(form.offerPrice).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-white/60 uppercase font-semibold">Regular Total</span>
                        <div className="text-sm text-white/50 line-through">
                          Rs. {Number(form.originalPrice).toLocaleString()}
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          Save Rs. {savings.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white/60 block text-[10px]">Use Promo Code</span>
                        <span className="font-mono font-bold text-amber-300 text-sm">{form.couponCode}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white font-bold text-xs">
                        {form.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-gray-950 font-black text-center text-sm shadow-md flex items-center justify-center gap-2 cursor-default">
                      <ShoppingBag className="w-4 h-4" />
                      Claim Festival Offer & Add to Cart
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              Publish Live Immediately
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="checkbox"
                checked={form.isFestival}
                onChange={(e) => setForm({ ...form, isFestival: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              Mark as Special Festival Campaign
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {offer ? 'Save Offer Changes' : 'Launch Festival Offer'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
