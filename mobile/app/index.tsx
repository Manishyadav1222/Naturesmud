'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, RefreshControl, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ChevronRight, Star, Star as StarFilled, ShieldCheck, Truck, RotateCcw, Leaf, Mountain, Seedling, Coffee, Heart, Sparkles, Droplet, Package, Search, Menu, Bell, ShoppingCart, User, Zap, Award, MapPin } from 'lucide-react-native';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { RealCustomerReviewsSection } from '@/components/RealCustomerReviewsSection';
import { ReelsSection } from '@/components/ReelsSection';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { categories, products, getFeaturedProducts, getBestSellers, getNewArrivals } from '@/lib/data/products';
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { items } = useCartStore();
  const { toasts } = useUIStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.products.featured(8),
    initialData: { data: getFeaturedProducts(8) },
  });

  const { data: bestSellers, isLoading: bestSellersLoading } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => api.products.bestsellers(10),
    initialData: { data: getBestSellers(10) },
  });

  const { data: newArrivals, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => api.products.list({ isNew: true, limit: 8 }),
    initialData: { data: getNewArrivals(8) },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#365314']}
            progressViewOffset={60}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>
              <Leaf style={styles.logoIcon} /> Nature's Mud
            </Text>
            <Text style={styles.tagline}>Himalayan Purity, Delivered</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/search')}>
              <Search style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
              <View style={styles.iconWrapper}>
                <Bell style={styles.headerIcon} />
                {toasts.filter(t => !t.isRead).length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>
                      {toasts.filter(t => !t.isRead).length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/cart')}>
              <View style={styles.iconWrapper}>
                <ShoppingCart style={styles.headerIcon} />
                {items.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{items.length > 9 ? '9+' : items.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/account')}>
              <User style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Bar */}
        <View style={styles.locationBar}>
          <MapPin style={styles.locationIcon} />
          <Text style={styles.locationText}>Delivering to Kathmandu, Bagmati</Text>
          <ChevronRight style={styles.locationArrow} />
        </View>

        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Categories */}
        <ScrollReveal direction="up" distance={20}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <TouchableOpacity style={styles.viewAll} onPress={() => router.push('/categories')}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight style={styles.viewAllArrow} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              style={styles.categoriesScroll}
            >
              {categories.slice(0, 8).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </ScrollView>
          </View>
        </ScrollReveal>

        {/* Featured Products */}
        <ScrollReveal direction="up" distance={20} delay={100}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity style={styles.viewAll} onPress={() => router.push('/products?featured=true')}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight style={styles.viewAllArrow} />
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {featuredLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                featuredProducts.data.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuickAdd
                    onQuickAdd={() => {
                      useCartStore.getState().addItem({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        image: product.image,
                        weight: product.weight,
                        category: product.category,
                      });
                    }}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal direction="up" distance={20} delay={200}>
          <View style={styles.trustSection}>
            <View style={styles.trustGrid}>
              {[
                { icon: ShieldCheck, title: '100% Authentic', desc: 'Third-party lab tested', color: '#059669' },
                { icon: Truck, title: 'Fast Delivery', desc: '2-5 business days nationwide', color: '#3B82F6' },
                { icon: RotateCcw, title: 'Easy Returns', desc: '7-day no-questions policy', color: '#F59E0B' },
                { icon: Award, title: 'Quality Guaranteed', desc: 'Sourced from 180+ partner farms', color: '#365314' },
              ].map((trust, index) => (
                <View key={index} style={styles.trustCard}>
                  <View style={[styles.trustIconWrapper, { backgroundColor: `${trust.color}15` }]}>
                    <trust.icon style={[styles.trustIcon, { color: trust.color }]} />
                  </View>
                  <Text style={styles.trustTitle}>{trust.title}</Text>
                  <Text style={styles.trustDesc}>{trust.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollReveal>

        {/* Best Sellers */}
        <ScrollReveal direction="up" distance={20} delay={300}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <StarFilled style={styles.sectionTitleIcon} />
                <Text style={styles.sectionTitle}>Best Sellers</Text>
              </View>
              <TouchableOpacity style={styles.viewAll} onPress={() => router.push('/products?bestseller=true')}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight style={styles.viewAllArrow} />
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {bestSellersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                bestSellers.data.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuickAdd
                    onQuickAdd={() => {
                      useCartStore.getState().addItem({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        image: product.image,
                        weight: product.weight,
                        category: product.category,
                      });
                    }}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollReveal>

        {/* Customer Reviews */}
        <ScrollReveal direction="up" distance={20} delay={400}>
          <RealCustomerReviewsSection />
        </ScrollReveal>

        {/* Reels Section */}
        <ScrollReveal direction="up" distance={20} delay={500}>
          <ReelsSection />
        </ScrollReveal>

        {/* New Arrivals */}
        <ScrollReveal direction="up" distance={20} delay={600}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrapper}>
                <Zap style={styles.sectionTitleIcon} />
                <Text style={styles.sectionTitle}>New Arrivals</Text>
              </View>
              <TouchableOpacity style={styles.viewAll} onPress={() => router.push('/products?new=true')}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight style={styles.viewAllArrow} />
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {newArrivalsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                newArrivals.data.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuickAdd
                    onQuickAdd={() => {
                      useCartStore.getState().addItem({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        image: product.image,
                        weight: product.weight,
                        category: product.category,
                      });
                    }}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollReveal>

        {/* Newsletter */}
        <ScrollReveal direction="up" distance={20} delay={700}>
          <View style={styles.newsletterSection}>
            <View style={styles.newsletterCard}>
              <View style={styles.newsletterContent}>
                <View style={styles.newsletterIconWrapper}>
                  <Sparkles style={styles.newsletterIcon} />
                </View>
                <Text style={styles.newsletterTitle}>Join the Himalayan Family</Text>
                <Text style={styles.newsletterDesc}>
                  Get 10% off your first order + exclusive wellness tips, farm stories, and early access to limited harvests.
                </Text>
                <NewsletterForm
                  variant="inline"
                  showLabel={false}
                  placeholder="Enter your email"
                  buttonText="Subscribe"
                />
                <Text style={styles.newsletterNote}>
                  No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
                </Text>
              </View>
            </View>
          </View>
        </ScrollReveal>

        {/* About/Story Section */}
        <ScrollReveal direction="up" distance={20} delay={800}>
          <View style={styles.storySection}>
            <Text style={styles.storyTitle}>Our Story</Text>
            <Text style={styles.storySubtitle}>Rooted in the Himalayas, shared with the world</Text>
            <View style={styles.storyGrid}>
              {[
                { icon: Mountain, title: 'Wild Harvested', desc: 'From 3,500m+ cliffs where rare flora blooms' },
                { icon: Leaf, title: 'Regenerative Farms', desc: '180+ partner farms healing the land' },
                { icon: ShieldCheck, title: 'Ancient Wisdom', desc: '40-day Surya Tapi & traditional methods' },
                { icon: Heart, title: 'Fair Trade', desc: 'Direct partnerships with mountain communities' },
              ].map((item, index) => (
                <View key={index} style={styles.storyCard}>
                  <View style={styles.storyIconWrapper}>
                    <item.icon style={styles.storyIcon} />
                  </View>
                  <Text style={styles.storyCardTitle}>{item.title}</Text>
                  <Text style={styles.storyCardDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.storyButton} onPress={() => router.push('/about')}>
              <Text style={styles.storyButtonText}>Read Our Full Story</Text>
              <ChevronRight style={styles.storyButtonArrow} />
            </TouchableOpacity>
          </View>
        </ScrollReveal>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Leaf style={[styles.navIcon, { color: '#365314' }]} />
          <Text style={[styles.navLabel, { color: '#365314' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/products')}>
          <Seedling style={styles.navIcon} />
          <Text style={styles.navLabel}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/cart')}>
          <View style={styles.navIconWrapper}>
            <ShoppingCart style={styles.navIcon} />
            {items.length > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{items.length > 9 ? '9+' : items.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/account')}>
          <User style={styles.navIcon} />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    gap: 2,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2B2B2B',
    fontFamily: 'Poppins_800ExtraBold',
  },
  logoIcon: {
    color: '#365314',
  },
  tagline: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    position: 'relative',
  },
  headerIcon: {
    color: '#2B2B2B',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.08)',
  },
  locationIcon: {
    color: '#365314',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2B2B2B',
    fontFamily: 'Inter_500Medium',
  },
  locationArrow: {
    color: '#2B2B2B',
    opacity: 0.4,
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  sectionTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleIcon: {
    color: '#365314',
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  viewAllArrow: {
    color: '#365314',
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trustSection: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  trustCard: {
    width: '47%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
    gap: 10,
  },
  trustIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustIcon: {},
  trustTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  trustDesc: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  newsletterSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  newsletterCard: {
    backgroundColor: '#365314',
    borderRadius: 24,
    padding: 24,
  },
  newsletterContent: {
    alignItems: 'center',
    gap: 16,
  },
  newsletterIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(217, 164, 65, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsletterIcon: {
    color: '#D9A441',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  newsletterDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  newsletterNote: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  storySection: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins_800ExtraBold',
  },
  storySubtitle: {
    fontSize: 15,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  storyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  storyCard: {
    width: '47%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
    gap: 12,
  },
  storyIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyIcon: {
    color: '#365314',
  },
  storyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  storyCardDesc: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  storyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  storyButtonArrow: {
    color: '#FFFFFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  navIconWrapper: {
    position: 'relative',
  },
  navIcon: {
    color: '#2B2B2B',
    opacity: 0.5,
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
});