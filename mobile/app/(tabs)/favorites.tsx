'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Heart, Heart as HeartFilled, Package, Search, Filter, Grid, List } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { Product } from '@/types';
import { products as staticProducts } from '@/lib/data/products';

const { width: screenWidth } = Dimensions.get('window');

// Mock favorites - in real app, this would come from user profile/favorites API
const favoriteProductIds = ['1', '3', '4', '7'];
const favoriteProducts = staticProducts.filter(p => favoriteProductIds.includes(p.id));

export default function FavoritesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEmptyState, setShowEmptyState] = useState(false);

  const toggleFavorite = (productId: string) => {
    // In real app, call API to toggle favorite
    console.log('Toggle favorite:', productId);
  };

  const isFavorite = (productId: string) => favoriteProductIds.includes(productId);

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ScrollView style={styles.emptyScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIllustration}>
              <View style={styles.emptyHeartContainer}>
                <Heart style={styles.emptyHeart} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyDesc}>
              Start exploring and tap the heart icon on products you love to save them here.
            </Text>
            <TouchableOpacity style={styles.emptyCTA} onPress={() => router.push('/products')}>
              <Text style={styles.emptyCTAText}>Discover Products</Text>
              <Package style={styles.emptyCTAIcon} />
            </TouchableOpacity>
            <View style={styles.emptyBenefits}>
              <Text style={styles.emptyBenefitsTitle}>Why Save Favorites?</Text>
              <View style={styles.emptyBenefitsList}>
                {[
                  'Quick access to your loved products',
                  'Get notified when favorites go on sale',
                  'Easy reordering of staples',
                  'Share wishlists with family',
                ].map((benefit, i) => (
                  <View key={i} style={styles.benefitItem}>
                    <View style={styles.benefitDot} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>My Favorites</Text>
          <Text style={styles.subtitle}>{favoriteProducts.length} saved items</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/search')}>
          <Search style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <ScrollReveal direction="up" distance={15}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid style={[styles.viewIcon, viewMode === 'grid' && styles.viewIconActive]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <List style={[styles.viewIcon, viewMode === 'list' && styles.viewIconActive]} />
          </TouchableOpacity>
        </View>
      </ScrollReveal>

      {/* Favorites Grid/List */}
      <ScrollReveal direction="up" distance={20} delay={100}>
        {viewMode === 'grid' ? (
          <View style={styles.productsGrid}>
            {favoriteProducts.map((product, index) => (
              <ScrollReveal key={product.id} direction="up" distance={15} delay={index * 50}>
                <ProductCard
                  product={product}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                />
              </ScrollReveal>
            ))}
          </View>
        ) : (
          <View style={styles.productsList} gap={12}>
            {favoriteProducts.map((product, index) => (
              <ScrollReveal key={product.id} direction="left" distance={20} delay={index * 50}>
                <View style={styles.listItem}>
                  <Image source={{ uri: product.image }} style={styles.listItemImage} />
                  <View style={styles.listItemDetails}>
                    <Text style={styles.listItemName}>{product.name}</Text>
                    <Text style={styles.listItemWeight}>{product.weight}</Text>
                    <View style={styles.listItemPriceRow}>
                      <Text style={styles.listItemPrice}>{product.price}</Text>
                      {product.compareAtPrice && (
                        <Text style={styles.listItemComparePrice}>{product.compareAtPrice}</Text>
                      )}
                    </View>
                    <Text style={styles.listItemRating}>
                      {product.rating} ★ ({product.reviewCount})
                    </Text>
                  </View>
                  <View style={styles.listItemActions}>
                    <TouchableOpacity
                      style={[styles.favoriteButton, { backgroundColor: '#FEF2F2' }]}
                      onPress={() => toggleFavorite(product.id)}
                    >
                      <HeartFilled style={styles.favoriteIconFilled} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listAddToCart}>
                      <Text style={styles.listAddToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollReveal>
            ))}
          </View>
        )}
      </ScrollReveal>

      {/* Recently Viewed Section */}
      <ScrollReveal direction="up" distance={20} delay={200}>
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recently Viewed</Text>
          <View style={styles.recentGrid}>
            {staticProducts.slice(0, 4).map((product) => (
              <TouchableOpacity key={product.id} style={styles.recentCard} onPress={() => router.push(`/products/${product.slug}`)}>
                <Image source={{ uri: product.image }} style={styles.recentImage} />
                <Text style={styles.recentName}>{product.name}</Text>
                <Text style={styles.recentPrice}>{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollReveal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  emptyScroll: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 24,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
  },
  emptyHeartContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FDF2F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHeart: {
    color: '#EC4899',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  emptyDesc: {
    fontSize: 16,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  emptyCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EC4899',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  emptyCTAText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyCTAIcon: {
    color: '#FFFFFF',
  },
  emptyBenefits: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
    marginTop: 16,
  },
  emptyBenefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyBenefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#365314',
  },
  benefitText: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    color: '#2B2B2B',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#365314',
  },
  viewIcon: {
    color: '#2B2B2B',
    opacity: 0.5,
  },
  viewIconActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  productsList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  listItemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  listItemWeight: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  listItemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  listItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  listItemComparePrice: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  listItemRating: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  listItemActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'flex-end',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIconFilled: {
    color: '#EF4444',
  },
  listAddToCart: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listAddToCartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  recentSection: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  recentGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recentCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  recentName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  recentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
});