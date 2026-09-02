import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  ChevronRight,
  MessageCircle,
  Award,
} from 'lucide-react-native';
import { products, categories, getFeaturedProducts, getBestSellers } from '@/lib/data/products';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { toast } from '@/store/ui-store';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { notifications } = useUIStore();
  const [refreshing, setRefreshing] = useState(false);

  const featured = getFeaturedProducts(6);
  const bestSellers = getBestSellers(4);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      weight: product.weight,
      category: product.category,
    });
    toast.success('Added to Cart', `${product.name} added.`);
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/9779713888002?text=Namaste!%20I%20have%20an%20inquiry%20about%20Nature%27s%20Mud%20products.').catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <Leaf size={20} color="#365314" />
            <Text style={styles.brandTitle}>Nature's Mud</Text>
          </View>
          <Text style={styles.brandTagline}>Pure Himalayan Superfoods 🇳🇵</Text>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#1C1917" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color="#1C1917" />
            {unreadCount > 0 && <View style={styles.navBadgeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.waBtn]}
            onPress={handleWhatsApp}
          >
            <MessageCircle size={20} color="#365314" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#365314']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Award size={13} color="#365314" />
            <Text style={styles.heroBadgeText}>0 Additives · 0 Preservatives Harvest</Text>
          </View>
          <Text style={styles.heroHeading}>Purity Straight From the Himalayas</Text>
          <Text style={styles.heroDesc}>
            Lab-tested Shilajit Resin, Wild Cliff Honey, and Vedic A2 Ghee delivered right to your doorstep.
          </Text>
          <TouchableOpacity
            style={styles.heroCtaBtn}
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.heroCtaText}>Explore Harvest</Text>
            <ArrowRight size={16} color="#365314" />
          </TouchableOpacity>
        </View>

        {/* Value Props Strip */}
        <View style={styles.valuesStrip}>
          <View style={styles.valueItem}>
            <Leaf size={18} color="#365314" />
            <Text style={styles.valueTitle}>100% Organic</Text>
            <Text style={styles.valueSub}>Zero chemicals</Text>
          </View>
          <View style={styles.valueItem}>
            <ShieldCheck size={18} color="#365314" />
            <Text style={styles.valueTitle}>Lab Tested</Text>
            <Text style={styles.valueSub}>85+ Minerals</Text>
          </View>
          <View style={styles.valueItem}>
            <Truck size={18} color="#365314" />
            <Text style={styles.valueTitle}>Free Shipping</Text>
            <Text style={styles.valueSub}>Over Rs. 3,000</Text>
          </View>
        </View>

        {/* Shop By Category */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <Text style={styles.sectionSubtitle}>Authentic Himalayan specialties</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color="#365314" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.85}
            >
              <Image source={{ uri: cat.image }} style={styles.categoryImg} />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{cat.productCount || '4+'} Items</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Harvest Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Harvest</Text>
            <Text style={styles.sectionSubtitle}>Hand-picked customer favorites</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.viewAllText}>Explore</Text>
            <ChevronRight size={14} color="#365314" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
          {featured.map((product: Product) => (
            <View key={product.id} style={{ width: screenWidth * 0.52 }}>
              <ProductCard
                product={product}
                variant="compact"
                showQuickAdd
                onQuickAdd={() => handleQuickAdd(product)}
              />
            </View>
          ))}
        </ScrollView>

        {/* Himalayan Health Guide Banner */}
        <TouchableOpacity
          style={styles.healthBanner}
          onPress={() => router.push('/health-benefits')}
          activeOpacity={0.9}
        >
          <View style={styles.healthContent}>
            <View style={styles.healthBadge}>
              <Sparkles size={12} color="#FFFFFF" />
              <Text style={styles.healthBadgeText}>Himalayan Wellness</Text>
            </View>
            <Text style={styles.healthTitle}>Why Himalayan Shilajit & Raw Honey?</Text>
            <Text style={styles.healthDesc}>
              Learn how ancient Ayurvedic foods elevate immunity, stamina, and cellular longevity.
            </Text>
            <View style={styles.readMoreRow}>
              <Text style={styles.readMoreText}>Read Health Guide</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Best Sellers Grid */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Bestselling Products</Text>
            <Text style={styles.sectionSubtitle}>Loved by thousands in Nepal</Text>
          </View>
        </View>

        <View style={styles.bestSellersGrid}>
          {bestSellers.map((product: Product) => (
            <View key={product.id} style={{ width: (screenWidth - 44) / 2 }}>
              <ProductCard
                product={product}
                variant="default"
                showQuickAdd
                onQuickAdd={() => handleQuickAdd(product)}
              />
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.reviewsBox}>
          <Text style={styles.reviewsHeading}>What Our Customers Say</Text>
          <View style={styles.reviewCard}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} color="#D97706" fill="#D97706" />
              ))}
            </View>
            <Text style={styles.reviewQuote}>
              "The Shilajit resin dissolved completely in my morning tea. Within a week I noticed steady energy throughout the day without caffeine crashes!"
            </Text>
            <Text style={styles.reviewerName}>— Dr. Rajesh B., Kathmandu</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  brandCol: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  brandTagline: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '500',
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waBtn: {
    backgroundColor: '#ECFCCB',
  },
  navBadgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: '#365314',
    borderRadius: 24,
    padding: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#D9F99D',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  heroCtaText: {
    color: '#365314',
    fontWeight: '700',
    fontSize: 13,
  },
  valuesStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  valueItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  valueTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
    marginTop: 2,
  },
  valueSub: {
    fontSize: 10,
    color: '#78716C',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#78716C',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  categoryImg: {
    width: '100%',
    height: 80,
  },
  categoryInfo: {
    padding: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  categoryCount: {
    fontSize: 10,
    color: '#78716C',
    marginTop: 2,
  },
  featuredRow: {
    gap: 12,
  },
  healthBanner: {
    backgroundColor: '#7B5E3B',
    borderRadius: 20,
    padding: 18,
  },
  healthContent: {
    gap: 8,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  healthBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  healthDesc: {
    fontSize: 12,
    color: '#F8F4EC',
    lineHeight: 17,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  bestSellersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reviewsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 12,
  },
  reviewsHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  reviewCard: {
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewQuote: {
    fontSize: 12,
    color: '#44403C',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  reviewerName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
});