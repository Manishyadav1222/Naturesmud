'use client';

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Image, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ChevronLeft, Trash2, Plus, Minus, Heart, Heart as HeartFilled, ChevronRight, ShieldCheck, Truck, RotateCcw, Star, Star as StarFilled, Tag, Gift, Sparkles, ArrowRight, X } from 'lucide-react-native';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, calculateSavings } from '@/lib/utils';
import { ScrollReveal } from '@/components/ScrollReveal';
import { products as staticProducts } from '@/lib/data/products';

const { width: screenWidth } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotalItems } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const savings = items.reduce((sum, item) => {
    if (item.product?.compareAtPrice) {
      return sum + calculateSavings(item.product.compareAtPrice, item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  const SHIPPING_THRESHOLD = 3000;
  const SHIPPING_COST = 150;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  useEffect(() => {
    // Load cart from storage
  }, []);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconContainer}>
            <Gift style={styles.emptyIcon} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Looks like you haven\'t added any Himalayan goodness yet.</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/')}>
            <Text style={styles.emptyButtonText}>Start Shopping</Text>
            <ArrowRight style={styles.emptyButtonArrow} />
          </TouchableOpacity>
          <Text style={styles.emptyNote}>Free shipping on orders above Rs. 3,000</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={() => Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', onPress: clearCart, style: 'destructive' }])}>
          <Trash2 style={styles.clearIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <View key={item.productId} style={styles.itemCard}>
              <TouchableOpacity onPress={() => router.push(`/products/${item.product?.slug}`)}>
                <Image source={{ uri: item.product?.image }} style={styles.itemImage} />
              </TouchableOpacity>
              <View style={styles.itemDetails}>
                <TouchableOpacity onPress={() => router.push(`/products/${item.product?.slug}`)}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                </TouchableOpacity>
                <Text style={styles.itemWeight}>{item.product?.weight}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>{formatPrice(item.product?.price || 0)}</Text>
                  {item.product?.compareAtPrice && (
                    <Text style={styles.itemComparePrice}>{formatPrice(item.product.compareAtPrice)}</Text>
                  )}
                </View>
                <View style={styles.itemQty}>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus style={styles.qtyIcon} />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus style={styles.qtyIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.productId)}>
                  <Trash2 style={styles.removeIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveForLaterButton} onPress={() => {}}>
                  <Heart style={styles.saveIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalLabel}>Total</Text>
                <Text style={styles.itemTotalValue}>{formatPrice((item.product?.price || 0) * item.quantity)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <View style={styles.promoCard}>
            <View style={styles.promoLeft}>
              <Sparkles style={styles.promoIcon} />
              <View>
                <Text style={styles.promoTitle}>Have a promo code?</Text>
                <Text style={styles.promoSubtitle}>Apply at checkout for extra savings</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.promoLink} onPress={() => router.push('/checkout')}>
              <Text style={styles.promoLinkText}>Apply Code</Text>
              <ChevronRight style={styles.promoLinkArrow} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          {savings > 0 && (
            <View style={styles.summaryRow savings}>
              <Text style={styles.summaryLabel}>You Save</Text>
              <Text style={styles.savingsValue}>-{formatPrice(savings)}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Shipping</Text>
            <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
              {shipping === 0 ? 'FREE' : formatPrice(SHIPPING_COST)}
            </Text>
          </View>

          {subtotal < SHIPPING_THRESHOLD && (
            <View style={styles.shippingProgress}>
              <View style={styles.shippingProgressBar}>
                <Animated.View
                  style={[
                    styles.shippingProgressFill,
                    { width: `${(subtotal / SHIPPING_THRESHOLD) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.shippingProgressText}>
                Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for FREE shipping
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow total}>
            <Text style={styles.summaryLabel}>Estimated Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>

          <Text style={styles.summaryNote}>
            <ShieldCheck style={styles.noteIcon} />
            Taxes included. Shipping calculated at checkout.
          </Text>

          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <ChevronRight style={styles.checkoutButtonArrow} />
          </TouchableOpacity>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustContainer}>
          <Text style={styles.trustTitle}>Why Shop With Us</Text>
          <View style={styles.trustGrid}>
            {[
              { icon: ShieldCheck, title: 'Authentic Products', desc: 'Lab tested & verified' },
              { icon: Truck, title: 'Fast Delivery', desc: '2-5 business days' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
              { icon: Star, title: 'Loyalty Rewards', desc: 'Earn points on every order' },
            ].map((trust, index) => (
              <View key={index} style={styles.trustItem}>
                <View style={styles.trustIconContainer}>
                  <trust.icon style={styles.trustIcon} />
                </View>
                <Text style={styles.trustItemTitle}>{trust.title}</Text>
                <Text style={styles.trustItemDesc}>{trust.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommended Products */}
        <ScrollReveal direction="up" distance={20}>
          <View style={styles.recommendedContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.sectionSubtitle}>Based on your cart items</Text>
            </View>
            <View style={styles.recommendedGrid}>
              {staticProducts
                .filter(p => !items.some(i => i.productId === p.id))
                .slice(0, 4)
                .map((product) => (
                  <View key={product.id} style={styles.recommendedCard}>
                    <TouchableOpacity onPress={() => router.push(`/products/${product.slug}`)}>
                      <Image source={{ uri: product.image }} style={styles.recommendedImage} />
                    </TouchableOpacity>
                    <View style={styles.recommendedInfo}>
                      <TouchableOpacity onPress={() => router.push(`/products/${product.slug}`)}>
                        <Text style={styles.recommendedName}>{product.name}</Text>
                      </TouchableOpacity>
                      <Text style={styles.recommendedWeight}>{product.weight}</Text>
                      <View style={styles.recommendedPriceRow}>
                        <Text style={styles.recommendedPrice}>{formatPrice(product.price)}</Text>
                        {product.compareAtPrice && (
                          <Text style={styles.recommendedComparePrice}>{formatPrice(product.compareAtPrice)}</Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.recommendedAddButton}
                        onPress={() => {
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
                      >
                        <Plus style={styles.recommendedAddIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </ScrollReveal>
      </ScrollView>
    </SafeAreaView>
  );
}

// Need to import Animated
import { Animated } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    color: '#365314',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#2B2B2B',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyButtonArrow: {
    color: '#FFFFFF',
  },
  emptyNote: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#2B2B2B',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    color: '#EF4444',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    gap: 6,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemWeight: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  itemComparePrice: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  itemQty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyIcon: {
    color: '#365314',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    minWidth: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemActions: {
    padding: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: '#EF4444',
  },
  saveForLaterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    color: '#365314',
  },
  itemTotal: {
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  itemTotalLabel: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  itemTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  promoSection: {
    marginTop: 8,
  },
  promoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoIcon: {
    color: '#D9A441',
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  promoSubtitle: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  promoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  promoLinkArrow: {
    color: '#365314',
  },
  summaryContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  savings: {
    marginTop: -4,
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    fontFamily: 'Poppins_600SemiBold',
  },
  freeShipping: {
    color: '#059669',
    fontWeight: '700',
  },
  shippingProgress: {
    gap: 6,
    marginTop: 4,
  },
  shippingProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  shippingProgressFill: {
    height: '100%',
    backgroundColor: '#365314',
    borderRadius: 2,
  },
  shippingProgressText: {
    fontSize: 12,
    color: '#365314',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(43, 43, 43, 0.1)',
    marginVertical: 4,
  },
  total: {
    marginTop: 4,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2B2B2B',
    fontFamily: 'Poppins_800ExtraBold',
  },
  summaryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  noteIcon: {
    color: '#059669',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    marginTop: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  checkoutButtonArrow: {
    color: '#FFFFFF',
  },
  trustContainer: {
    marginTop: 24,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  trustItem: {
    width: '47%',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  trustIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustIcon: {
    color: '#365314',
  },
  trustItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  trustItemDesc: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  recommendedContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recommendedCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recommendedImage: {
    width: '100%',
    aspectRatio: 1,
  },
  recommendedInfo: {
    padding: 12,
    gap: 4,
  },
  recommendedName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    lineHeight: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  recommendedWeight: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  recommendedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  recommendedComparePrice: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  recommendedAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#365314',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  recommendedAddIcon: {
    color: '#FFFFFF',
  },
});