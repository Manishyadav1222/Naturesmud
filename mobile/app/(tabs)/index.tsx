import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Image,
  Dimensions,
  Linking,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  Leaf,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  ChevronRight,
  MessageCircle,
  Award,
  ShoppingBag,
  CheckCircle2,
  Heart,
  Truck,
  Lock,
  Mail,
  Check,
  Sprout,
  Globe,
  Phone,
} from 'lucide-react-native';
import { products, categories, getFeaturedProducts, getBestSellers } from '@/lib/data/products';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toast } from '@/store/ui-store';
import { formatPrice } from '@/lib/utils';

const { width: screenWidth } = Dimensions.get('window');

const CATEGORIES_DATA = [
  {
    id: 'cat-veg',
    name: 'Vegetables',
    itemsCount: '120+ items',
    image: 'https://naturesmud.shop/images/greenbasket/cat-vegetables.jpg',
    fallback: 'https://naturesmud.shop/products/beetroot-powder-100g.jpg',
    categoryKey: 'superfoods',
  },
  {
    id: 'cat-fruit',
    name: 'Fruits',
    itemsCount: '80+ items',
    image: 'https://naturesmud.shop/images/greenbasket/cat-fruits.jpg',
    fallback: 'https://naturesmud.shop/products/authentic-dehydrated-mango.jpg',
    categoryKey: 'dried-fruits',
  },
  {
    id: 'cat-herbs',
    name: 'Herbs & Greens',
    itemsCount: '60+ items',
    image: 'https://naturesmud.shop/images/greenbasket/cat-herbs.jpg',
    fallback: 'https://naturesmud.shop/products/sweet-potato-powder-100g.jpg',
    categoryKey: 'superfoods',
  },
  {
    id: 'cat-dairy',
    name: 'Dairy & Ghee',
    itemsCount: '40+ items',
    image: 'https://naturesmud.shop/products/coconut-oil.jpg',
    fallback: 'https://naturesmud.shop/products/coconut-oil.jpg',
    categoryKey: 'oils',
  },
  {
    id: 'cat-nuts',
    name: 'Nuts & Seeds',
    itemsCount: '50+ items',
    image: 'https://naturesmud.shop/products/authentic-cashewnuts-roasted.jpg',
    fallback: 'https://naturesmud.shop/products/authentic-almonds.jpg',
    categoryKey: 'nuts',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { addItem, getTotalItems } = useCartStore();
  const { notifications } = useUIStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [wishlist, setWishlist] = useState<{ [id: string]: boolean }>({});
  const [addedMap, setAddedMap] = useState<{ [id: string]: boolean }>({});

  const cartCount = getTotalItems();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const featured = getFeaturedProducts(10);
  const bestSellers = getBestSellers(10);

  const displayList =
    activeTab === 'All'
      ? featured
      : featured.filter(
          (p) =>
            p.category?.toLowerCase().includes(activeTab.toLowerCase()) ||
            p.name?.toLowerCase().includes(activeTab.toLowerCase())
        );

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/9779713888002?text=Namaste!%20I%20am%20interested%20in%20ordering%20GreenBasket%20organic%20produce.'
    ).catch(() => {});
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = !prev[id];
      if (next) {
        toast.success('Wishlist', 'Item saved to your favorites ❤️');
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.slug || product.id,
      slug: product.slug || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      weight: product.weight || '100 GM',
    });

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    toast.success('Added to Basket 🌿', `${product.name} added.`);

    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleSubscribe = () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Invalid Email', 'Please enter a valid email address');
      return;
    }
    toast.success('Subscribed! 🌿', 'You will receive 10% off your first order.');
    setNewsletterEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 TOP ANNOUNCEMENT BAR */}
      <View style={styles.announcementBar}>
        <View style={styles.announcementRow}>
          <Truck size={12} color="#A3E635" />
          <Text style={styles.announcementText}>
            <Text style={{ fontWeight: '900', color: '#FFFFFF' }}>FREE DELIVERY</Text> on orders over Rs. 3,000
          </Text>
        </View>
        <TouchableOpacity style={styles.announcementPhone} onPress={handleWhatsApp}>
          <Phone size={11} color="#A3E635" />
          <Text style={styles.announcementPhoneText}>24/7 Support</Text>
        </TouchableOpacity>
      </View>

      {/* 🟢 MAIN NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconWrap}>
            <Sprout size={20} color="#091B10" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.brandTitle}>GreenBasket</Text>
              <View style={styles.brandLiveDot} />
            </View>
            <Text style={styles.brandTagline}>Fresh from Nature · 100% Organic</Text>
          </View>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/search')}>
            <Search size={18} color="#D1FAE5" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/notifications')}>
            <Bell size={18} color="#D1FAE5" />
            {unreadCount > 0 && <View style={styles.navBadgeDot} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
            <ShoppingBag size={15} color="#091B10" />
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#84CC16']} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🟢 HERO SECTION: FRESH FOOD. HEALTHY LIFE. HAPPY YOU. */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Leaf size={12} color="#A3E635" />
            <Text style={styles.heroBadgeText}>100% Organic & Single-Origin</Text>
          </View>

          <Text style={styles.heroTitle}>Fresh Food.</Text>
          <Text style={styles.heroTitleHighlight}>Healthy Life.</Text>
          <Text style={styles.heroTitle}>Happy You.</Text>

          <Text style={styles.heroDesc}>
            100% organic fruits, vegetables, Himalayan superfoods & snacks delivered fresh to your door across Nepal.
          </Text>

          {/* CTA & Actions */}
          <View style={styles.heroBtnRow}>
            <TouchableOpacity
              style={styles.heroShopNowBtn}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.88}
            >
              <Text style={styles.heroShopNowText}>Shop Now</Text>
              <ArrowRight size={16} color="#091B10" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heroWhatsAppBtn} onPress={handleWhatsApp} activeOpacity={0.88}>
              <MessageCircle size={16} color="#A3E635" />
              <Text style={styles.heroWhatsAppText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Heart Produce Basket Artwork */}
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: 'https://naturesmud.shop/images/greenbasket/hero-heart-basket.jpg' }}
              defaultSource={{ uri: 'https://naturesmud.shop/products/authentic-dehydrated-mango.jpg' }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Floating "EAT FRESH STAY HEALTHY" Badge */}
            <View style={styles.heroFloatingBadge}>
              <Sparkles size={12} color="#FACC15" />
              <Text style={styles.heroFloatingBadgeSub}>EAT FRESH</Text>
              <Text style={styles.heroFloatingBadgeMain}>STAY HEALTHY</Text>
              <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={8} color="#FACC15" fill="#FACC15" />
                ))}
              </View>
            </View>
          </View>

          {/* 3 Trust Badges */}
          <View style={styles.trustBadgesRow}>
            <View style={styles.trustItem}>
              <View style={styles.trustIconWrap}>
                <Leaf size={14} color="#A3E635" />
              </View>
              <Text style={styles.trustTitle}>100% Organic</Text>
              <Text style={styles.trustSub}>Pure & Natural</Text>
            </View>

            <View style={styles.trustItem}>
              <View style={styles.trustIconWrap}>
                <Truck size={14} color="#A3E635" />
              </View>
              <Text style={styles.trustTitle}>Fast Delivery</Text>
              <Text style={styles.trustSub}>On Time</Text>
            </View>

            <View style={styles.trustItem}>
              <View style={styles.trustIconWrap}>
                <Lock size={14} color="#A3E635" />
              </View>
              <Text style={styles.trustTitle}>Secure Pay</Text>
              <Text style={styles.trustSub}>Protected</Text>
            </View>
          </View>
        </View>

        {/* 🟢 "FROM OUR FARM TO YOUR TABLE" SECTION */}
        <View style={styles.farmSection}>
          <View style={styles.farmCard}>
            <View style={styles.farmerRow}>
              <Image
                source={{ uri: 'https://naturesmud.shop/images/greenbasket/farmer-crate.jpg' }}
                style={styles.farmerImg}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.farmPreTitle}>WELCOME TO GREENBASKET</Text>
                <Text style={styles.farmTitle}>From Our Farm To Your Table</Text>
                <Text style={styles.farmDesc}>
                  We bring you the freshest, handpicked produce from trusted Himalayan farms.
                </Text>
                <TouchableOpacity style={styles.farmLearnBtn} onPress={() => router.push('/about')}>
                  <Text style={styles.farmLearnBtnText}>Learn More</Text>
                  <ChevronRight size={13} color="#091B10" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Counters */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Sprout size={16} color="#A3E635" />
                <Text style={styles.statNum}>25+</Text>
                <Text style={styles.statLabel}>Local Farms</Text>
              </View>

              <View style={styles.statItem}>
                <Leaf size={16} color="#A3E635" />
                <Text style={styles.statNum}>500+</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>

              <View style={styles.statItem}>
                <Award size={16} color="#A3E635" />
                <Text style={styles.statNum}>10K+</Text>
                <Text style={styles.statLabel}>Customers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 🟢 "SHOP BY CATEGORY" SECTION */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Leaf size={18} color="#A3E635" />
              <Text style={styles.sectionTitle}>Shop by Category</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text style={styles.viewAllText}>View all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES_DATA.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => router.push('/(tabs)/products')}
                activeOpacity={0.88}
              >
                <View style={styles.catImgWrap}>
                  <Image source={{ uri: cat.image }} style={styles.catImg} resizeMode="cover" />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catCount}>{cat.itemsCount}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 🟢 "UP TO 30% OFF" LIMITED TIME PROMO BANNER */}
        <View style={styles.promoSection}>
          <View style={styles.promoCard}>
            <Image
              source={{ uri: 'https://naturesmud.shop/images/greenbasket/vegetables-promo-banner.jpg' }}
              style={styles.promoBgImg}
              resizeMode="cover"
            />
            <View style={styles.promoOverlay}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>LIMITED TIME OFFER</Text>
              </View>
              <Text style={styles.promoTitle}>UP TO 30% OFF</Text>
              <Text style={styles.promoSub}>On Fresh Vegetables & Superfoods</Text>

              <TouchableOpacity
                style={styles.grabDealBtn}
                onPress={() => router.push('/(tabs)/products')}
                activeOpacity={0.85}
              >
                <Text style={styles.grabDealBtnText}>Grab the Deal</Text>
                <ArrowRight size={14} color="#091B10" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 🟢 "WHY CHOOSE US?" SECTION */}
        <View style={styles.whySection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Leaf size={18} color="#A3E635" />
            <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          </View>

          <View style={styles.whyGrid}>
            <View style={styles.whyCard}>
              <View style={styles.whyIconWrap}>
                <Sprout size={18} color="#A3E635" />
              </View>
              <Text style={styles.whyTitle}>Farm Fresh</Text>
              <Text style={styles.whyDesc}>Handpicked with care</Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconWrap}>
                <ShieldCheck size={18} color="#A3E635" />
              </View>
              <Text style={styles.whyTitle}>Chemical Free</Text>
              <Text style={styles.whyDesc}>Safe for your family</Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconWrap}>
                <Globe size={18} color="#A3E635" />
              </View>
              <Text style={styles.whyTitle}>Sustainably Grown</Text>
              <Text style={styles.whyDesc}>Good for nature</Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconWrap}>
                <Award size={18} color="#A3E635" />
              </View>
              <Text style={styles.whyTitle}>Premium Quality</Text>
              <Text style={styles.whyDesc}>Best Himalayan purity</Text>
            </View>
          </View>
        </View>

        {/* 🟢 "TOP PICKS FOR YOU" SECTION */}
        <View style={styles.topPicksSection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Leaf size={18} color="#A3E635" />
              <Text style={styles.sectionTitle}>Top Picks For You</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text style={styles.viewAllText}>View all →</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {['All', 'Dried', 'Powders', 'Honey', 'Nuts'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, activeTab === tab && styles.filterChipActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>
                  {tab === 'All' ? 'All Items' : tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Product Cards Carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
            {displayList.map((p) => {
              const isFav = wishlist[p.id];
              const isAdded = addedMap[p.id];

              return (
                <View key={p.id} style={styles.productCard}>
                  {/* Card Header: Weight + Wishlist */}
                  <View style={styles.prodCardTop}>
                    <View style={styles.prodWeightTag}>
                      <Text style={styles.prodWeightText}>{p.weight || '100 GM'}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.wishBtn}
                      onPress={() => toggleWishlist(p.id)}
                      activeOpacity={0.8}
                    >
                      <Heart size={14} color={isFav ? '#EF4444' : '#9CA3AF'} fill={isFav ? '#EF4444' : 'transparent'} />
                    </TouchableOpacity>
                  </View>

                  {/* Product Image */}
                  <TouchableOpacity
                    style={styles.prodImgWrap}
                    onPress={() => router.push({ pathname: '/products/[slug]', params: { slug: p.slug || p.id } })}
                  >
                    <Image source={{ uri: p.image }} style={styles.prodImg} resizeMode="contain" />
                  </TouchableOpacity>

                  {/* Title */}
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/products/[slug]', params: { slug: p.slug || p.id } })}
                  >
                    <Text style={styles.prodTitle} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>

                  {/* Price Row */}
                  <View style={styles.prodPriceRow}>
                    <Text style={styles.prodPrice}>{formatPrice(p.price)}</Text>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <Text style={styles.prodComparePrice}>{formatPrice(p.compareAtPrice)}</Text>
                    )}
                  </View>

                  {/* Add to Cart Button */}
                  <TouchableOpacity
                    style={[styles.addBtn, isAdded && styles.addBtnDone]}
                    onPress={() => handleAddToCart(p)}
                    activeOpacity={0.85}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} color="#FFFFFF" />
                        <Text style={[styles.addBtnText, { color: '#FFFFFF' }]}>Added</Text>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} color="#091B10" />
                        <Text style={styles.addBtnText}>Add to Cart</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* 🟢 NEWSLETTER SUBSCRIPTION */}
        <View style={styles.newsletterSection}>
          <View style={styles.newsletterCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={styles.newsletterIconWrap}>
                <Mail size={18} color="#A3E635" />
              </View>
              <Text style={styles.newsletterTitle}>Stay Healthy, Stay Updated!</Text>
            </View>
            <Text style={styles.newsletterSub}>Subscribe for fresh farm updates and exclusive 10% discount.</Text>

            <View style={styles.newsletterInputRow}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                value={newsletterEmail}
                onChangeText={setNewsletterEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.newsletterInput}
              />
              <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                <Text style={styles.subscribeBtnText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 🟢 FOREST GREEN FOOTER */}
        <View style={styles.footerSection}>
          <View style={styles.footerBrandRow}>
            <View style={styles.footerIconWrap}>
              <Sprout size={18} color="#091B10" />
            </View>
            <View>
              <Text style={styles.footerBrandTitle}>GreenBasket</Text>
              <Text style={styles.footerBrandSub}>Fresh from Nature · Nature's Mud</Text>
            </View>
          </View>

          <Text style={styles.footerDesc}>
            Your trusted source for fresh, organic and healthy Himalayan produce across all 77 districts of Nepal.
          </Text>

          {/* Payment Badges */}
          <View style={styles.paymentBadgesRow}>
            <View style={styles.payBadge}>
              <Text style={styles.payBadgeText}>VISA</Text>
            </View>
            <View style={styles.payBadge}>
              <Text style={styles.payBadgeText}>Mastercard</Text>
            </View>
            <View style={[styles.payBadge, { backgroundColor: '#16A34A' }]}>
              <Text style={[styles.payBadgeText, { color: '#FFFFFF' }]}>eSewa</Text>
            </View>
            <View style={[styles.payBadge, { backgroundColor: '#7C3AED' }]}>
              <Text style={[styles.payBadgeText, { color: '#FFFFFF' }]}>Khalti</Text>
            </View>
          </View>

          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} GreenBasket · Nature's Mud. All Rights Reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091B10',
  },
  announcementBar: {
    backgroundColor: '#0B2415',
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(163,230,53,0.15)',
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  announcementText: {
    fontSize: 10,
    color: '#D1FAE5',
  },
  announcementPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  announcementPhoneText: {
    fontSize: 10,
    color: '#A3E635',
    fontWeight: '700',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0C2817',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16,185,129,0.15)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A3E635',
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '600',
    color: '#86EFAC',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#07190E',
    borderWidth: 1,
    borderColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#A3E635',
  },
  cartCountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#091B10',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
    backgroundColor: '#0C2817',
    borderBottomWidth: 1,
    borderBottomColor: '#064E3B',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6,78,59,0.7)',
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A3E635',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  heroTitleHighlight: {
    fontSize: 28,
    fontWeight: '900',
    color: '#A3E635',
    lineHeight: 32,
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(209,250,229,0.8)',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 18,
  },
  heroBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  heroShopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#A3E635',
  },
  heroShopNowText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#091B10',
  },
  heroWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(6,78,59,0.6)',
    borderWidth: 1,
    borderColor: '#059669',
  },
  heroWhatsAppText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#A3E635',
  },
  heroImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(5,150,105,0.4)',
    backgroundColor: '#07190E',
    marginBottom: 18,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFloatingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#07190E',
    borderWidth: 2,
    borderColor: '#A3E635',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  heroFloatingBadgeSub: {
    fontSize: 8,
    fontWeight: '900',
    color: '#A3E635',
  },
  heroFloatingBadgeMain: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(6,78,59,0.5)',
  },
  trustItem: {
    alignItems: 'center',
  },
  trustIconWrap: {
    marginBottom: 3,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trustSub: {
    fontSize: 9,
    color: 'rgba(167,243,208,0.7)',
  },
  farmSection: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  farmCard: {
    backgroundColor: '#0C2817',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#064E3B',
  },
  farmerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  farmerImg: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#059669',
  },
  farmPreTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#A3E635',
    letterSpacing: 0.5,
  },
  farmTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 4,
  },
  farmDesc: {
    fontSize: 11,
    color: 'rgba(209,250,229,0.8)',
    lineHeight: 15,
  },
  farmLearnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: '#A3E635',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 6,
  },
  farmLearnBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#091B10',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(6,78,59,0.6)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 9,
    color: 'rgba(167,243,208,0.7)',
  },
  categorySection: {
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A3E635',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
  },
  catImgWrap: {
    width: 70,
    height: 70,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    marginBottom: 6,
  },
  catImg: {
    width: '100%',
    height: '100%',
  },
  catName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  catCount: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
  promoSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  promoCard: {
    height: 160,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0C2817',
    borderWidth: 1,
    borderColor: '#059669',
  },
  promoBgImg: {
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
    width: '70%',
    opacity: 0.65,
  },
  promoOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  promoBadge: {
    backgroundColor: '#A3E635',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  promoBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#091B10',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  promoSub: {
    fontSize: 11,
    color: '#D1FAE5',
    marginBottom: 10,
  },
  grabDealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#A3E635',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  grabDealBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#091B10',
  },
  whySection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  whyCard: {
    width: (screenWidth - 42) / 2,
    backgroundColor: '#0C2817',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#064E3B',
  },
  whyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(6,78,59,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  whyDesc: {
    fontSize: 10,
    color: 'rgba(209,250,229,0.7)',
    marginTop: 2,
  },
  topPicksSection: {
    paddingVertical: 14,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0C2817',
    borderWidth: 1,
    borderColor: '#064E3B',
  },
  filterChipActive: {
    backgroundColor: '#A3E635',
    borderColor: '#A3E635',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D1FAE5',
  },
  filterChipTextActive: {
    color: '#091B10',
  },
  productsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  prodCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prodWeightTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  prodWeightText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#15803D',
  },
  wishBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prodImgWrap: {
    width: '100%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 6,
  },
  prodImg: {
    width: '85%',
    height: '85%',
  },
  prodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  prodPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  prodPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  prodComparePrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#A3E635',
    paddingVertical: 7,
    borderRadius: 14,
  },
  addBtnDone: {
    backgroundColor: '#16A34A',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#091B10',
  },
  newsletterSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  newsletterCard: {
    backgroundColor: '#0C2817',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#064E3B',
  },
  newsletterIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(163,230,53,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  newsletterSub: {
    fontSize: 11,
    color: 'rgba(209,250,229,0.7)',
    marginBottom: 12,
  },
  newsletterInputRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
  },
  newsletterInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 11,
    color: '#0F172A',
  },
  subscribeBtn: {
    backgroundColor: '#A3E635',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  subscribeBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#091B10',
  },
  footerSection: {
    backgroundColor: '#06140B',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#071F11',
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#A3E635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  footerBrandSub: {
    fontSize: 9,
    color: '#86EFAC',
  },
  footerDesc: {
    fontSize: 11,
    color: 'rgba(209,250,229,0.6)',
    lineHeight: 15,
    marginBottom: 14,
  },
  paymentBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  payBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  payBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F172A',
  },
  copyrightText: {
    fontSize: 9,
    color: 'rgba(167,243,208,0.5)',
  },
});