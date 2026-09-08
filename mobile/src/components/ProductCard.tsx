import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Heart, ShoppingBag, Zap, Sparkles } from 'lucide-react-native';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlist-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from '@/store/ui-store';
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
  showQuickAdd = true,
  onQuickAdd,
}: ProductCardProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useWishlistStore();
  const { addItem } = useCartStore();

  const favorited = isFavorite(product.id);
  const discount = product.compareAtPrice
    ? calculateDiscount(product.compareAtPrice, product.price)
    : 0;

  const isCompact = variant === 'compact';

  const handleCardPress = () => {
    router.push({
      pathname: '/products/[slug]',
      params: { slug: product.slug },
    });
  };

  const handleToggleWishlist = () => {
    const next = toggleFavorite(product.id);
    if (next) {
      toast.success('Saved to Wishlist', `${product.name}`);
    } else {
      toast.info('Removed', `${product.name} removed from wishlist.`);
    }
  };

  const handleDefaultQuickAdd = () => {
    if (onQuickAdd) {
      onQuickAdd();
    } else {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.image,
        weight: product.weight || '100g',
        category: typeof product.category === 'object' ? (product.category as any)?.name : product.category,
      });
      toast.success('Added to Basket', `${product.name}`);
    }
  };

  const categoryLabel =
    typeof product.category === 'object' && product.category !== null
      ? (product.category as any)?.name || 'Himalayan Superfood'
      : product.category || 'Himalayan Superfood';

  return (
    <TouchableOpacity
      style={[styles.podiumCard, isCompact && styles.podiumCardCompact]}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      {/* Top Controls Row */}
      <View style={styles.topRow}>
        <View style={styles.statusBadge}>
          <View style={styles.glowingDot} />
          <Text style={styles.statusText}>{discount > 0 ? `-${discount}%` : '100% PURE'}</Text>
        </View>

        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleToggleWishlist}
          activeOpacity={0.8}
        >
          <Heart
            size={14}
            color={favorited ? '#EF4444' : '#A7F3D0'}
            fill={favorited ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* 3D Floating Cylindrical Podium Section (Image 2) */}
      <View style={styles.podiumStage}>
        {/* 3D Circular Pedestal Disc Base */}
        <View style={styles.podiumDiscBase} />
        {/* Top Rim Reflection */}
        <View style={styles.podiumDiscTop} />
        {/* Cast Ambient Drop Shadow */}
        <View style={styles.podiumShadow} />

        {/* Floating Product Image on Podium */}
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* Product Details Area */}
      <View style={styles.infoArea}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {categoryLabel}
          </Text>
          {product.weight && (
            <Text style={styles.weightBadge}>
              {/^\d+(\.00)?$/.test(product.weight.trim()) ? `${parseFloat(product.weight)} GM` : product.weight}
            </Text>
          )}
        </View>

        <Text style={styles.titleText} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Rating Stars */}
        <View style={styles.ratingRow}>
          <View style={styles.starsBox}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                color="#FBBF24"
                fill={s <= Math.round(product.rating || 5) ? '#FBBF24' : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.ratingCount}>({product.reviewCount || 42})</Text>
        </View>

        {/* Price & Action Row */}
        <View style={styles.actionRow}>
          <View style={styles.priceCol}>
            <Text style={styles.priceVal}>{formatPrice(product.price)}</Text>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <Text style={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleDefaultQuickAdd}
            activeOpacity={0.85}
          >
            <ShoppingBag size={14} color="#041F13" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  podiumCard: {
    backgroundColor: '#0A2417',
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  podiumCardCompact: {
    width: screenWidth * 0.48,
    marginRight: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 78, 59, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  glowingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  podiumStage: {
    width: '100%',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  podiumDiscBase: {
    position: 'absolute',
    bottom: 8,
    width: '78%',
    height: 16,
    borderRadius: 100,
    backgroundColor: '#174A30',
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 211, 153, 0.4)',
  },
  podiumDiscTop: {
    position: 'absolute',
    bottom: 11,
    width: '72%',
    height: 11,
    borderRadius: 100,
    backgroundColor: '#206342',
    opacity: 0.85,
  },
  podiumShadow: {
    position: 'absolute',
    bottom: 2,
    width: '82%',
    height: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  productImage: {
    width: '82%',
    height: '82%',
    zIndex: 5,
    marginBottom: 8,
  },
  infoArea: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 211, 153, 0.15)',
    paddingTop: 8,
    gap: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34D399',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  weightBadge: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  starsBox: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingCount: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceCol: {
    flex: 1,
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  comparePrice: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
});