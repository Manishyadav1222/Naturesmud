import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Clipboard,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Tag,
  Clock,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  Zap,
  Gift,
  Truck,
  ChevronRight,
  Flame,
  Timer,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

// Countdown timer target: 48 hours from now
const TARGET_TIME = Date.now() + 48 * 60 * 60 * 1000;

const COUPONS = [
  {
    id: 'c1',
    code: 'NATURE10',
    title: '10% Off Your First Order',
    description: 'Valid for all products. New customers only.',
    discount: '10% OFF',
    discountType: 'percent',
    minOrder: 500,
    expiresAt: '2026-12-31',
    color: '#1A3826',
    icon: 'gift',
  },
  {
    id: 'c2',
    code: 'FREESHIP',
    title: 'Free Shipping on Any Order',
    description: 'No minimum order. One-time use.',
    discount: 'FREE SHIPPING',
    discountType: 'shipping',
    minOrder: 0,
    expiresAt: '2026-09-30',
    color: '#1D4ED8',
    icon: 'truck',
  },
  {
    id: 'c3',
    code: 'SUPER20',
    title: '20% Off Superfoods',
    description: 'On Chia Seeds, Moringa, Shilajit, and more.',
    discount: '20% OFF',
    discountType: 'percent',
    minOrder: 800,
    expiresAt: '2026-10-15',
    color: '#7C3AED',
    icon: 'sparkles',
  },
  {
    id: 'c4',
    code: 'BABY15',
    title: '15% Off Baby & Mother Care',
    description: 'Dates Powder, Moringa — perfect for new moms.',
    discount: '15% OFF',
    discountType: 'percent',
    minOrder: 600,
    expiresAt: '2026-11-30',
    color: '#BE185D',
    icon: 'heart',
  },
];

const BUNDLE_DEALS = [
  {
    id: 'b1',
    title: 'Morning Ritual Bundle',
    products: ['Shilajit Resin', 'Wild Honey', 'Moringa Powder'],
    originalPrice: 2400,
    bundlePrice: 1890,
    saving: 510,
    image: 'https://naturesmud.shop/images/bundles/morning-ritual.jpg',
    badge: 'Most Popular',
    badgeColor: '#1A3826',
  },
  {
    id: 'b2',
    title: 'Baby Nutrition Pack',
    products: ['Dates Powder', 'Moringa Powder', 'Chia Seeds'],
    originalPrice: 1350,
    bundlePrice: 1050,
    saving: 300,
    image: 'https://naturesmud.shop/images/bundles/baby-nutrition.jpg',
    badge: 'Best for Babies',
    badgeColor: '#BE185D',
  },
  {
    id: 'b3',
    title: 'Fitness Warrior Kit',
    products: ['Beetroot Powder', 'Pumpkin Seeds', 'Chia Seeds', 'Shilajit'],
    originalPrice: 2100,
    bundlePrice: 1650,
    saving: 450,
    image: 'https://naturesmud.shop/images/bundles/fitness-warrior.jpg',
    badge: 'Fitness Special',
    badgeColor: '#D97706',
  },
];

const FLASH_OFFERS = [
  {
    id: 'f1',
    title: 'Flash: 30% Off Shilajit Resin',
    subtitle: 'Limited to 50 units — going fast!',
    color: '#DC2626',
    discountText: '30% OFF',
  },
  {
    id: 'f2',
    title: 'Buy 2 Get 1 Free — All Seeds',
    subtitle: 'Chia, Pumpkin, Flaxseeds',
    color: '#1A3826',
    discountText: 'B2G1',
  },
];

function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, targetTime - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}

export default function OffersScreen() {
  const router = useRouter();
  const { h, m, s } = useCountdown(TARGET_TIME);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleCopy = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    Alert.alert('Copied!', `Coupon code "${code}" copied to clipboard.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1A3826" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <View style={styles.headerBadge}>
              <Flame size={12} color="#DC2626" />
              <Text style={styles.headerBadgeText}>Hot Deals</Text>
            </View>
            <Text style={styles.pageTitle}>Offers & Coupons</Text>
            <Text style={styles.pageSubtitle}>Exclusive savings on Himalayan superfoods</Text>
          </View>
        </View>

        {/* Flash Sale Countdown */}
        <View style={styles.flashSaleCard}>
          <View style={styles.flashSaleHeader}>
            <Flame size={18} color="#FDE047" />
            <Text style={styles.flashSaleTitle}>⚡ Flash Sale — Ends In</Text>
          </View>
          <View style={styles.countdownRow}>
            {[
              { label: 'HOURS', value: pad(h) },
              { label: 'MINS', value: pad(m) },
              { label: 'SECS', value: pad(s) },
            ].map((unit, idx) => (
              <React.Fragment key={unit.label}>
                {idx > 0 && <Text style={styles.colonSep}>:</Text>}
                <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>{unit.value}</Text>
                  <Text style={styles.timeLabel}>{unit.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {FLASH_OFFERS.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[styles.flashOfferRow, { borderLeftColor: offer.color }]}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.88}
            >
              <View style={[styles.flashDiscBadge, { backgroundColor: offer.color }]}>
                <Text style={styles.flashDiscText}>{offer.discountText}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.flashOfferTitle}>{offer.title}</Text>
                <Text style={styles.flashOfferSub}>{offer.subtitle}</Text>
              </View>
              <ChevronRight size={16} color="#78716C" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Coupon Codes */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Tag size={18} color="#1A3826" />
            <Text style={styles.sectionTitle}>Coupon Codes</Text>
          </View>

          {COUPONS.map((coupon) => (
            <View key={coupon.id} style={[styles.couponCard, { borderTopColor: coupon.color, borderTopWidth: 4 }]}>
              <View style={styles.couponTop}>
                <View>
                  <View style={[styles.discountBadge, { backgroundColor: coupon.color }]}>
                    <Text style={styles.discountBadgeText}>{coupon.discount}</Text>
                  </View>
                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDesc}>{coupon.description}</Text>
                  {coupon.minOrder > 0 && (
                    <Text style={styles.couponMin}>Min. order: Rs. {coupon.minOrder}</Text>
                  )}
                  <View style={styles.expiryRow}>
                    <Clock size={11} color="#78716C" />
                    <Text style={styles.expiryText}>Expires {coupon.expiresAt}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.couponBottom}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{coupon.code}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyBtn, copiedCode === coupon.code && styles.copyBtnDone]}
                  onPress={() => handleCopy(coupon.code)}
                >
                  {copiedCode === coupon.code
                    ? <Check size={16} color="#FFFFFF" />
                    : <Copy size={16} color="#FFFFFF" />
                  }
                  <Text style={styles.copyBtnText}>
                    {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Bundle Deals */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Gift size={18} color="#1A3826" />
            <Text style={styles.sectionTitle}>Bundle Deals</Text>
          </View>
          <Text style={styles.sectionSub}>More products, bigger savings</Text>

          {BUNDLE_DEALS.map((bundle) => (
            <TouchableOpacity
              key={bundle.id}
              style={styles.bundleCard}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.88}
            >
              <View style={styles.bundleTop}>
                <View style={[styles.bundleBadge, { backgroundColor: bundle.badgeColor }]}>
                  <Text style={styles.bundleBadgeText}>{bundle.badge}</Text>
                </View>
                <Text style={styles.bundleTitle}>{bundle.title}</Text>
                <View style={styles.bundleProducts}>
                  {bundle.products.map((p) => (
                    <View key={p} style={styles.productPill}>
                      <Text style={styles.productPillText}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.bundleBottom}>
                <View>
                  <Text style={styles.bundleOriginal}>Was Rs. {bundle.originalPrice.toLocaleString()}</Text>
                  <Text style={styles.bundlePrice}>Rs. {bundle.bundlePrice.toLocaleString()}</Text>
                </View>
                <View style={styles.savingBadge}>
                  <Zap size={12} color="#FFFFFF" />
                  <Text style={styles.savingText}>Save Rs. {bundle.saving}</Text>
                </View>
                <TouchableOpacity style={[styles.bundleBtn, { backgroundColor: bundle.badgeColor }]}>
                  <ShoppingBag size={14} color="#FFFFFF" />
                  <Text style={styles.bundleBtnText}>Add Bundle</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Free Shipping Banner */}
        <View style={styles.freeShippingCard}>
          <Truck size={24} color="#1A3826" />
          <View style={{ flex: 1 }}>
            <Text style={styles.freeShippingTitle}>Free Shipping on Orders Over Rs. 3,000</Text>
            <Text style={styles.freeShippingSub}>No coupon needed — automatically applied</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scrollContent: { paddingBottom: 40 },

  header: { padding: 16, gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerText: { gap: 6 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  headerBadgeText: { fontSize: 10, fontWeight: '700', color: '#DC2626' },
  pageTitle: { fontSize: 30, fontWeight: '900', color: '#1A3826', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#78716C', lineHeight: 18 },

  flashSaleCard: {
    margin: 16, backgroundColor: '#1A3826', borderRadius: 24, padding: 20, gap: 14,
  },
  flashSaleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flashSaleTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  countdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  timeBox: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 70,
  },
  timeValue: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', fontVariant: ['tabular-nums'] as any },
  timeLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginTop: 2, letterSpacing: 1 },
  colonSep: { fontSize: 24, fontWeight: '900', color: 'rgba(255,255,255,0.5)', marginBottom: 10 },

  flashOfferRow: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderLeftWidth: 3,
  },
  flashDiscBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  flashDiscText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF' },
  flashOfferTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  flashOfferSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  sectionBlock: { paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  sectionSub: { fontSize: 12, color: '#78716C', marginTop: -6 },

  couponCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  couponTop: { padding: 16, gap: 6 },
  discountBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    alignSelf: 'flex-start', marginBottom: 4,
  },
  discountBadgeText: { fontSize: 11, fontWeight: '900', color: '#FFFFFF' },
  couponTitle: { fontSize: 15, fontWeight: '800', color: '#1A3826' },
  couponDesc: { fontSize: 12, color: '#57534E', lineHeight: 17 },
  couponMin: { fontSize: 11, fontWeight: '600', color: '#78716C' },
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  expiryText: { fontSize: 11, color: '#78716C' },
  couponBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#F5F5F4',
    borderStyle: 'dashed', backgroundColor: '#FAFAF9',
  },
  codeBox: {
    flex: 1, borderWidth: 2, borderColor: '#E2D9CB', borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 8, alignItems: 'center',
    backgroundColor: '#FAF7F2', marginRight: 10,
  },
  codeText: { fontSize: 16, fontWeight: '900', color: '#1A3826', letterSpacing: 2 },
  copyBtn: {
    backgroundColor: '#1A3826', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  copyBtnDone: { backgroundColor: '#15803D' },
  copyBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  bundleCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  bundleTop: { padding: 16, gap: 8 },
  bundleBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bundleBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  bundleTitle: { fontSize: 17, fontWeight: '800', color: '#1A3826' },
  bundleProducts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  productPill: {
    backgroundColor: '#F0EDE7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, borderColor: '#E2D9CB',
  },
  productPillText: { fontSize: 11, fontWeight: '600', color: '#57534E' },
  bundleBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#EAE3D6',
    backgroundColor: '#FAFAF9',
  },
  bundleOriginal: { fontSize: 11, color: '#78716C', textDecorationLine: 'line-through' },
  bundlePrice: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  savingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#15803D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  savingText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  bundleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
  },
  bundleBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  freeShippingCard: {
    margin: 16, backgroundColor: '#F0FDF4', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  freeShippingTitle: { fontSize: 15, fontWeight: '800', color: '#1A3826', flex: 1, lineHeight: 20 },
  freeShippingSub: { fontSize: 11, color: '#15803D', marginTop: 4 },
});
