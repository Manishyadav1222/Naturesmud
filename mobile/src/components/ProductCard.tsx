import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Heart, ShieldCheck, Zap } from 'lucide-react-native';
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
  showQuickAdd = false,
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
      toast.success('Wishlist Updated', `${product.name} saved.`);
    } else {
      toast.info('Removed from Wishlist', `${product.name} removed.`);
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
        weight: product.weight,
        category: product.category,
      });
      toast.success('Added to Cart', `${product.name} added.`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompact && styles.cardCompact]}
      onPress={handleCardPress}
      activeOpacity={0.88}
    >
      {/* Image & Overlay Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges Top-Left */}
        <View style={styles.badgeColumn}>
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
          {product.isFeatured && (
            <View style={styles.featuredBadge}>
              <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.featuredText}>Popular</Text>
            </View>
          )}
        </View>

        {/* Wishlist Top-Right */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleToggleWishlist}
          activeOpacity={0.8}
        >
          <Heart
            size={16}
            color={favorited ? '#DC2626' : '#1C1917'}
            fill={favorited ? '#DC2626' : 'transparent'}
          />
        </TouchableOpacity>

        {/* Quick Add Overlay Button */}
        {showQuickAdd && (
          <TouchableOpacity
            style={styles.quickAddOverlay}
            onPress={handleDefaultQuickAdd}
            activeOpacity={0.85}
          >
            <Zap size={13} color="#FFFFFF" />
            <Text style={styles.quickAddText}>Quick Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category} · {product.weight}
        </Text>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Star size={12} color="#D97706" fill="#D97706" />
          <Text style={styles.ratingText}>{product.rating || 4.9}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount || 24})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.compareAtPrice && (
            <Text style={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={[styles.card, styles.skeletonCard]}>
      <View style={[styles.imageContainer, styles.skeletonBox]} />
      <View style={styles.content}>
        <View style={[styles.skeletonLine, { width: '40%' }]} />
        <View style={[styles.skeletonLine, { width: '80%', height: 14 }]} />
        <View style={[styles.skeletonLine, { width: '50%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E5E4',
    width: '100%',
  },
  cardCompact: {
    borderRadius: 16,
  },
  imageContainer: {
    width: '100%',
    height: 145,
    backgroundColor: '#F5F5F4',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeColumn: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  discountBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(54, 83, 20, 0.92)',
    borderRadius: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  quickAddText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
    gap: 4,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
    lineHeight: 17,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  reviewCount: {
    fontSize: 10,
    color: '#A8A29E',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#365314',
  },
  comparePrice: {
    fontSize: 11,
    color: '#A8A29E',
    textDecorationLine: 'line-through',
  },
  skeletonCard: {
    borderColor: '#F0EFEA',
  },
  skeletonBox: {
    backgroundColor: '#E7E5E4',
  },
  skeletonLine: {
    height: 10,
    backgroundColor: '#E7E5E4',
    borderRadius: 4,
    marginBottom: 4,
  },
});