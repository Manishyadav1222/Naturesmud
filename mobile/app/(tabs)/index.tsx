'use client';

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { RealCustomerReviewsSection } from '@/components/RealCustomerReviewsSection';
import { ReelsSection } from '@/components/ReelsSection';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { products as staticProducts, categories as staticCategories } from '@/lib/data/products';
import { normalizeProduct } from '@/lib/data/products';
import { ArrowRight, Sparkles, Leaf, ShieldCheck, Truck, Star } from 'lucide-react-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: productsData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const res = await api.get('/products/featured', { params: { limit: 8 } });
      return res.data.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'home'],
    queryFn: async () => {
      const res = await api.get('/categories', { params: { limit: 6 } });
      return res.data.data;
    },
  });

  const featuredProducts = productsData
    ? productsData.map((p: any) => normalizeProduct(p)).slice(0, 8)
    : staticProducts.filter(p => p.isFeatured).slice(0, 8);

  const bestSellers = staticProducts.filter(p => p.isBestSeller).slice(0, 4);

  const categoriesList = categoriesData || staticCategories.slice(0, 6);

  const features = [
    { icon: Leaf, title: '100% Organic', desc: 'NOCB & USDA Certified' },
    { icon: ShieldCheck, title: 'Lab Tested', desc: 'Third-party Verified' },
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above Rs. 3,000' },
    { icon: Sparkles, title: 'Fair Trade', desc: 'Direct Farmer Partnerships' },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Refresh queries would go here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#365314']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Features Strip */}
        <ScrollReveal direction="up" distance={20}>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <feature.icon style={styles.featureIcon} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal direction="up" distance={20} delay={100}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <Text style={styles.sectionSubtitle}>Explore our Himalayan harvest</Text>
            </View>
            <TouchableOpacity style={styles.viewAllLink}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight style={styles.viewAllArrow} />
            </TouchableOpacity>
          </View>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={150}>
          <View style={styles.categoriesGrid}>
            {categoriesList.map((category, index) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </View>
        </ScrollReveal>

        {/* Featured Products */}
        <ScrollReveal direction="up" distance={20} delay={200}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <Text style={styles.sectionSubtitle}>Hand-picked favorites from our harvest</Text>
            </View>
            <TouchableOpacity style={styles.viewAllLink}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight style={styles.viewAllArrow} />
            </TouchableOpacity>
          </View>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={250}>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </ScrollReveal>

        {/* Best Sellers */}
        <ScrollReveal direction="up" distance={20} delay={300}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.bestsellerBadge}>
                <Star style={styles.bestsellerStar} />
                <Text style={styles.bestsellerBadgeText}>Best Sellers</Text>
              </View>
              <Text style={styles.sectionTitle}>Customer Favorites</Text>
              <Text style={styles.sectionSubtitle}>Most loved by our community</Text>
            </View>
            <TouchableOpacity style={styles.viewAllLink}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight style={styles.viewAllArrow} />
            </TouchableOpacity>
          </View>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={20} delay={350}>
          <View style={styles.productsGrid}>
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </ScrollReveal>

        {/* Customer Reviews */}
        <ScrollReveal direction="up" distance={20} delay={400}>
          <RealCustomerReviewsSection />
        </ScrollReveal>

        {/* Reels Section */}
        <ScrollReveal direction="up" distance={20} delay={450}>
          <ReelsSection />
        </ScrollReveal>

        {/* Newsletter */}
        <ScrollReveal direction="up" distance={20} delay={500}>
          <View style={styles.newsletterContainer}>
            <View style={styles.newsletterCard}>
              <View style={styles.newsletterContent}>
                <View style={styles.newsletterIcon}>
                  <Sparkles style={styles.newsletterSparkle} />
                </View>
                <Text style={styles.newsletterTitle}>Join the Nature's Mud Family</Text>
                <Text style={styles.newsletterDesc}>
                  Get 10% off your first order, exclusive access to new harvests, and wellness tips from the Himalayas.
                </Text>
                <NewsletterForm />
              </View>
              <View style={styles.newsletterIllustration}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=300' }}
                  style={styles.newsletterImage}
                />
              </View>
            </View>
          </View>
        </ScrollReveal>

        {/* Footer CTA */}
        <View style={styles.footerCTA}>
          <Text style={styles.footerCTATitle}>Ready to Experience the Himalayas?</Text>
          <Text style={styles.footerCTADesc}>Pure, potent, and ethically sourced — delivered to your door.</Text>
          <TouchableOpacity style={styles.footerCTAButton}>
            <Text style={styles.footerCTAButtonText}>Start Shopping</Text>
            <ArrowRight style={styles.footerCTAArrow} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '47%',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    color: '#365314',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  featureDesc: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
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
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEFCE8',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bestsellerStar: {
    color: '#F59E0B',
  },
  bestsellerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CA8A04',
    fontFamily: 'Poppins_700Bold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  newsletterContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  newsletterCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2B2B2B',
    borderRadius: 24,
    overflow: 'hidden',
    gap: 20,
  },
  newsletterContent: {
    flex: 1,
    minWidth: 280,
    padding: 28,
    justifyContent: 'center',
    gap: 16,
  },
  newsletterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217, 164, 65, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsletterSparkle: {
    color: '#D9A441',
  },
  newsletterTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  newsletterDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  newsletterIllustration: {
    width: 160,
    height: '100%',
    minHeight: 200,
    position: 'relative',
  },
  newsletterImage: {
    width: '100%',
    height: '100%',
  },
  footerCTA: {
    marginHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  footerCTATitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  footerCTADesc: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  footerCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  footerCTAButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  footerCTAArrow: {
    color: '#FFFFFF',
  },
});