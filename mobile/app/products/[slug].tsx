'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Heart, Heart as HeartFilled, Share2, Star, Star as StarFilled, ShieldCheck, Truck, RotateCcw, Minus, Plus, Check, Info, AlertCircle, Expand } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { normalizeProduct } from '@/lib/data/products';
import { products as staticProducts } from '@/lib/data/products';
import type { Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { addItem, isInCart } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'benefits' | 'nutrition' | 'reviews'>('description');
  const [showImageViewer, setShowImageViewer] = useState(false);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });

  const product: Product | null = productData
    ? normalizeProduct(productData)
    : staticProducts.find(p => p.slug === slug) || null;

  if (isLoading && !product) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <ProductNotFound onBack={() => router.back()} />;
  }

  const inCart = isInCart(product.id);
  const discount = product.compareAtPrice ? calculateDiscount(product.compareAtPrice, product.price) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      weight: product.weight,
      category: product.category,
    }, quantity);
    Alert.alert('Added to Cart', `${product.name} (x${quantity}) added to your cart.`);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      weight: product.weight,
      category: product.category,
    }, quantity);
    router.push('/cart');
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: Info },
    { id: 'ingredients', label: 'Ingredients', icon: ShieldCheck },
    { id: 'benefits', label: 'Benefits', icon: Sparkles },
    { id: 'nutrition', label: 'Nutrition', icon: AlertCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} colors={['#365314']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button & Share */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft style={styles.backIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
            <Share2 style={styles.shareIcon} />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image
            source={{ uri: product.images[selectedImageIndex] || product.image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {product.images.length > 1 && (
            <TouchableOpacity style={styles.imageCounter} onPress={() => setShowImageViewer(true)}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {product.images.length}
              </Text>
              <Expand style={styles.expandIcon} />
            </TouchableOpacity>
          )}

          {product.images.length > 1 && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailsContainer}
              style={styles.thumbnailsScroll}
            >
              {product.images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    index === selectedImageIndex && styles.thumbnailActive,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {discount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{discount}% OFF</Text>
              </View>
            )}
            {product.badges.includes('bestseller') && (
              <View style={[styles.badge, styles.badgeGold]}>
                <Star style={styles.badgeIcon} />
                <Text style={styles.badgeText}>Bestseller</Text>
              </View>
            )}
            {product.badges.includes('organic') && (
              <View style={[styles.badge, styles.badgeGreen]}>
                <ShieldCheck style={styles.badgeIcon} />
                <Text style={styles.badgeText}>Organic</Text>
              </View>
            )}
            {product.badges.includes('raw') && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Raw</Text>
              </View>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <View style={styles.categoryRow}>
              <Text style={styles.category}>{product.category}</Text>
              {product.rating > 0 && (
                <View style={styles.ratingRow}>
                  <StarFilled style={styles.star} />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
                </View>
              )}
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productWeight}>{product.weight}</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.compareAtPrice && (
              <Text style={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</Text>
            )}
            {discount > 0 && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save {formatPrice(product.compareAtPrice! - product.price)}</Text>
              </View>
            )}
          </View>

          {/* Short Description */}
          <Text style={styles.shortDescription}>{product.shortDescription}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus style={styles.qtyIcon} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <Plus style={styles.qtyIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.stockText}>
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left in stock`
                : 'Out of Stock'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.addToCartButton, product.stock === 0 && styles.addToCartDisabled]}
              onPress={handleAddToCart}
              disabled={product.stock === 0}
              activeOpacity={0.9}
            >
              {inCart ? (
                <>
                  <Check style={styles.addToCartIcon} />
                  <Text style={styles.addToCartText}>Added to Cart</Text>
                </>
              ) : (
                <>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buyNowButton, product.stock === 0 && styles.buyNowDisabled]}
              onPress={handleBuyNow}
              disabled={product.stock === 0}
              activeOpacity={0.9}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <ShieldCheck style={styles.trustIcon} />
              <View>
                <Text style={styles.trustTitle}>100% Authentic</Text>
                <Text style={styles.trustDesc}>Third-party lab tested</Text>
              </View>
            </View>
            <View style={styles.trustItem}>
              <Truck style={styles.trustIcon} />
              <View>
                <Text style={styles.trustTitle}>Free Shipping</Text>
                <Text style={styles.trustDesc}>On orders above Rs. 3,000</Text>
              </View>
            </View>
            <View style={styles.trustItem}>
              <RotateCcw style={styles.trustIcon} />
              <View>
                <Text style={styles.trustTitle}>Easy Returns</Text>
                <Text style={styles.trustDesc}>7-day return policy</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab(tab.id as any)}
                >
                  <tab.icon style={[styles.tabIcon, activeTab === tab.id && styles.tabIconActive]} />
                  <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' && (
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Description</Text>
                <Text style={styles.contentText} numberOfLines={showFullDescription ? 0 : 6}>
                  {product.description}
                </Text>
                {product.description.split(' ').length > 100 && (
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() => setShowFullDescription(!showFullDescription)}
                  >
                    <Text style={styles.readMoreText}>
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </Text>
                    <ChevronLeft
                      style={[
                        styles.readMoreIcon,
                        showFullDescription && styles.readMoreIconRotated,
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {activeTab === 'ingredients' && (
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Ingredients</Text>
                <View style={styles.ingredientsList}>
                  {product.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.contentNote}>
                  No artificial preservatives, colors, or flavors. Non-GMO. Gluten-free.
                </Text>
              </View>
            )}

            {activeTab === 'benefits' && (
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Key Benefits</Text>
                <View style={styles.benefitsGrid}>
                  {product.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitCard}>
                      <Check style={styles.benefitCheck} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'nutrition' && (
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Nutritional Information (per 100g)</Text>
                <View style={styles.nutritionTable}>
                  {product.nutrition.map((item, index) => (
                    <View key={index} style={styles.nutritionRow}>
                      <Text style={styles.nutritionLabel}>{item.label}</Text>
                      <Text style={styles.nutritionValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'reviews' && (
              <View style={styles.contentSection}>
                <Text style={styles.contentTitle}>Customer Reviews</Text>
                <Text style={styles.contentSubtitle}>
                  {product.reviewCount} reviews • {product.rating}★ average
                </Text>
                <View style={styles.reviewsPlaceholder}>
                  <Text style={styles.placeholderText}>
                    Reviews are loaded from the server. Connect to API to see real reviews.
                  </Text>
                  <TouchableOpacity style={styles.writeReviewButton}>
                    <Text style={styles.writeReviewText}>Write a Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Usage & Storage */}
          <View style={styles.usageContainer}>
            <View style={styles.usageCard}>
              <Info style={styles.usageIcon} />
              <View>
                <Text style={styles.usageTitle}>How to Use</Text>
                <Text style={styles.usageText}>{product.usage}</Text>
              </View>
            </View>
            <View style={styles.usageCard}>
              <ShieldCheck style={styles.usageIcon} />
              <View>
                <Text style={styles.usageTitle}>Storage</Text>
                <Text style={styles.usageText}>{product.storage}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Related Products */}
        <ScrollReveal direction="up" distance={20}>
          <View style={styles.relatedContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
            </View>
            <View style={styles.relatedGrid}>
              {staticProducts
                .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </View>
          </View>
        </ScrollReveal>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.stickyBar}>
        <View style={styles.stickyPrice}>
          <Text style={styles.stickyPriceLabel}>Total</Text>
          <Text style={styles.stickyPriceValue}>{formatPrice(product.price * quantity)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.stickyAddToCart, product.stock === 0 && styles.stickyDisabled]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          activeOpacity={0.9}
        >
          <Text style={styles.stickyAddToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ProductDetailSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.skeletonImage} />
        <View style={styles.infoContainer}>
          {[80, 200, 60, 40, 120, 80, 80].map((width, i) => (
            <View key={i} style={[styles.skeletonLine, { width }]} />
          ))}
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((_, i) => (
              <View key={i} style={styles.skeletonCard} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductNotFound({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.notFoundContainer}>
      <View style={styles.notFoundContent}>
        <AlertCircle style={styles.notFoundIcon} />
        <Text style={styles.notFoundTitle}>Product Not Found</Text>
        <Text style={styles.notFoundDesc}>This product doesn't exist or has been removed.</Text>
        <TouchableOpacity style={styles.notFoundButton} onPress={onBack}>
          <Text style={styles.notFoundButtonText}>Continue Shopping</Text>
          <ChevronLeft style={styles.notFoundButtonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Need to import Sparkles
import { Sparkles } from 'lucide-react-native';

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
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
  backIcon: {
    color: '#2B2B2B',
  },
  shareButton: {
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
  shareIcon: {
    color: '#2B2B2B',
  },
  imageGallery: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1,
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  expandIcon: {
    color: '#FFFFFF',
  },
  thumbnailsScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  thumbnailsContainer: {
    gap: 8,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#365314',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeGold: {
    backgroundColor: '#D9A441',
  },
  badgeGreen: {
    backgroundColor: '#059669',
  },
  badgeIcon: {
    color: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  infoContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoHeader: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#F59E0B',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  reviewCount: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    lineHeight: 32,
    fontFamily: 'Poppins_700Bold',
  },
  productWeight: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#365314',
    fontFamily: 'Poppins_800ExtraBold',
  },
  comparePrice: {
    fontSize: 16,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  savingsBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 4,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    fontFamily: 'Poppins_600SemiBold',
  },
  shortDescription: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.8,
    lineHeight: 22,
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
  },
  quantityContainer: {
    marginTop: 20,
    gap: 8,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F4EC',
    borderRadius: 12,
    width: 130,
  },
  qtyButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyIcon: {
    color: '#365314',
  },
  qtyValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
  },
  addToCartDisabled: {
    opacity: 0.5,
  },
  addToCartIcon: {
    color: '#FFFFFF',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  buyNowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D9A441',
    borderRadius: 9999,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#D9A441',
  },
  buyNowDisabled: {
    opacity: 0.5,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  trustIcon: {
    color: '#365314',
    marginTop: 2,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  trustDesc: {
    fontSize: 10,
    color: '#2B2B2B',
    opacity: 0.6,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  tabsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  tabsScroll: {
    paddingHorizontal: 4,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabActive: {
    backgroundColor: '#F5F7EF',
    borderRadius: 9999,
  },
  tabIcon: {
    color: '#2B2B2B',
    opacity: 0.5,
  },
  tabIconActive: {
    color: '#365314',
    opacity: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Poppins_600SemiBold',
  },
  tabLabelActive: {
    color: '#365314',
    opacity: 1,
  },
  tabContent: {
    marginTop: 16,
    gap: 24,
  },
  contentSection: {
    gap: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  contentSubtitle: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.6,
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  contentText: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.8,
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  readMoreIcon: {
    color: '#365314',
  },
  readMoreIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#365314',
    marginTop: 6,
  },
  ingredientText: {
    fontSize: 14,
    color: '#2B2B2B',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  contentNote: {
    fontSize: 12,
    color: '#365314',
    marginTop: 12,
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  benefitsGrid: {
    gap: 10,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8F4EC',
    borderRadius: 12,
  },
  benefitCheck: {
    color: '#059669',
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: '#2B2B2B',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  nutritionTable: {
    gap: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.08)',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  reviewsPlaceholder: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  writeReviewButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  writeReviewText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  usageContainer: {
    marginTop: 24,
    gap: 12,
  },
  usageCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  usageIcon: {
    color: '#365314',
    marginTop: 2,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  usageText: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.8,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  relatedContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  stickyPrice: {
    flex: 1,
    gap: 2,
  },
  stickyPriceLabel: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  stickyPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#365314',
    fontFamily: 'Poppins_800ExtraBold',
  },
  stickyAddToCart: {
    flex: 1,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  stickyDisabled: {
    opacity: 0.5,
  },
  stickyAddToCartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  // Skeleton styles
  skeletonImage: {
    height: 300,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginTop: 12,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  skeletonCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notFoundContent: {
    alignItems: 'center',
    gap: 16,
  },
  notFoundIcon: {
    color: '#EF4444',
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  notFoundDesc: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  notFoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  notFoundButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  notFoundButtonIcon: {
    color: '#FFFFFF',
  },
});