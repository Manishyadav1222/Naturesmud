'use client';

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Star, Star as StarFilled, Heart, Heart as HeartFilled, Tag, Zap, ShieldCheck } from 'lucide-react-native';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickAdd?: boolean;
  onQuickAdd?: () => void;
}

export function ProductCard({
  product,
  variant = 'default',
  showQuickAdd = false,
  onQuickAdd,
}: ProductCardProps) {
  const discount = product.compareAtPrice ? calculateDiscount(product.compareAtPrice, product.price) : 0;
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const cardWidth = isCompact
    ? (screenWidth - 56) / 2
    : isFeatured
    ? (screenWidth - 40) * 0.6
    : (screenWidth - 56) / 2;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => {}}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges */}
        <View style={styles.badges}>
          {discount > 0 && (
            <View style={[styles.badge, styles.badgeDiscount]}>
              <Text style={styles.badgeText}>{discount}% OFF</Text>
            </View>
          )}
          {product.badges.includes('bestseller') && (
            <View style={[styles.badge, styles.badgeGold]}>
              <Star style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Bestseller</Text>
            </View>
          )}
          {product.badges.includes('new') && (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeText}>New</Text>
            </View>
          )}
          {product.badges.includes('organic') && (
            <View style={[styles.badge, styles.badgeGreen]}>
              <ShieldCheck style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Organic</Text>
            </View>
          )}
        </View>

        {/* Wishlist */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={(e) => { e.stopPropagation(); }}
        >
          <Heart style={styles.wishlistIcon} />
        </TouchableOpacity>

        {/* Quick Add */}
        {showQuickAdd && !isCompact && (
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={(e) => { e.stopPropagation(); onQuickAdd?.(); }}
          >
            <Zap style={styles.quickAddIcon} />
            <Text style={styles.quickAddText}>Quick Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <Text style={styles.category}>{product.category}</Text>

        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        {/* Weight */}
        <Text style={styles.weight}>{product.weight}</Text>

        {/* Rating */}
        {(product.rating > 0 || !isCompact) && (
          <View style={styles.ratingRow}>
            <StarFilled style={styles.star} />
            <Text style={styles.ratingText}>
              {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
            </Text>
            {product.reviewCount > 0 && (
              <Text style={styles.reviewCount}>({product.reviewCount})</Text>
            )}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.compareAtPrice && (
            <Text style={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</Text>
          )}
        </View>

        {/* Quick Add Button for compact */}
        {showQuickAdd && isCompact && (
          <TouchableOpacity
            style={styles.compactAddButton}
            onPress={(e) => { e.stopPropagation(); onQuickAdd?.(); }}
          >
            <Text style={styles.compactAddText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Skeleton for loading state
export function ProductCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const isCompact = variant === 'compact';
  const cardWidth = isCompact ? (screenWidth - 56) / 2 : (screenWidth - 56) / 2;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '70%' }]} />
        <View style={[styles.skeletonLine, { width: '40%' }]} />
        <View style={styles.skeletonPriceRow}>
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonComparePrice} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#F5F7EF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeDiscount: {
    backgroundColor: '#EF4444',
  },
  badgeGold: {
    backgroundColor: '#D9A441',
  },
  badgeNew: {
    backgroundColor: '#3B82F6',
  },
  badgeGreen: {
    backgroundColor: '#059669',
  },
  badgeIcon: {
    color: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wishlistIcon: {
    color: '#2B2B2B',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 8,
    opacity: 0,
  },
  quickAddIcon: {
    color: '#FFFFFF',
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  content: {
    padding: 12,
    gap: 6,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    color: '#365314',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    lineHeight: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  weight: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  star: {
    color: '#F59E0B',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  reviewCount: {
    fontSize: 10,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  comparePrice: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  compactAddButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  compactAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  // Skeleton styles
  skeletonImage: {
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  skeletonContent: {
    padding: 12,
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  skeletonPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  skeletonPrice: {
    width: 60,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  skeletonComparePrice: {
    width: 45,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
  },
});