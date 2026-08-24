'use client';

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Plus, Minus, Trash2, Heart, Gift, ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight } from 'lucide-react-native';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { formatPrice } from '@/lib/utils';
import { ScrollReveal } from '@/components/ScrollReveal';

const { width: screenWidth } = Dimensions.get('window');

const SHIPPING_THRESHOLD = 3000;
const SHIPPING_COST = 150;

export default function CartScreen() {
  const router = useRouter();
  const { items, isOpen, closeCart, getSubtotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [discount, setDiscount] = React.useState(0);

  const subtotal = getSubtotal();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? SHIPPING_COST : 0);
  const total = subtotal + shipping - discount;

  const updateQuantity = (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty > 0) {
        useCartStore.getState().updateQuantity(productId, newQty);
      } else {
        useCartStore.getState().removeItem(productId);
      }
    }
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setAppliedPromo('WELCOME10');
      setDiscount(Math.round(subtotal * 0.1));
    } else if (promoCode.toUpperCase() === 'HIMALAYA20') {
      setAppliedPromo('HIMALAYA20');
      setDiscount(Math.round(subtotal * 0.2));
    } else {
      Alert.alert('Invalid Code', 'Please check your promo code and try again.');
    }
  };

  const handleCheckout = () => {
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ScrollView style={styles.emptyScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIllustration}>
              <View style={styles.emptyCartIcon}>
                <Heart style={styles.emptyHeart} />
              </View>
              <View style={styles.emptySparkles}>
                {[1,2,3,4].map(i => (
                  <View key={i} style={styles.sparkle} />
                ))}
              </View>
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyDesc}>Looks like you haven\'t added anything yet.</Text>
            <TouchableOpacity style={styles.emptyCTA} onPress={() => router.push('/products')}>
              <Text style={styles.emptyCTAText}>Start Shopping</Text>
              <ArrowRight style={styles.emptyCTAArrow} />
            </TouchableOpacity>
            <View style={styles.emptyFeatures}>
              <View style={styles.emptyFeature}>
                <ShieldCheck style={styles.emptyFeatureIcon} />
                <Text style={styles.emptyFeatureText}>100% Organic</Text>
              </View>
              <View style={styles.emptyFeature}>
                <Truck style={styles.emptyFeatureIcon} />
                <Text style={styles.emptyFeatureText}>Free Shipping > Rs. 3,000</Text>
              </View>
              <View style={styles.emptyFeature}>
                <RotateCcw style={styles.emptyFeatureIcon} />
                <Text style={styles.emptyFeatureText}>Easy Returns</Text>
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
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
      </View>

      {/* Cart Items */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <ScrollReveal key={item.productId} direction="up" distance={20} delay={index * 50}>
            <View style={styles.itemCard}>
              <Image source={{ uri: item.product?.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product?.name}</Text>
                <Text style={styles.itemWeight}>{item.product?.weight}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.product?.price || 0)}</Text>
              </View>
              <View style={styles.itemActions}>
                <View style={styles.quantityControl}>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.productId, -1)}>
                    <Minus style={styles.qtyIcon} />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.productId, 1)}>
                    <Plus style={styles.qtyIcon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => useCartStore.getState().removeItem(item.productId)}>
                  <Trash2 style={styles.removeIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollReveal>
        ))}
      </View>

      {/* Promo Code */}
      <ScrollReveal direction="up" distance={20} delay={200}>
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Have a Promo Code?</Text>
          <View style={styles.promoInputWrapper}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter code"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholderTextColor="#2B2B2B40"
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoButton} onPress={handlePromoApply}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {appliedPromo && (
            <View style={styles.appliedPromo}>
              <Text style={styles.appliedPromoText}>✓ {appliedPromo} applied — {formatPrice(discount)} off</Text>
              <TouchableOpacity onPress={() => { setAppliedPromo(null); setDiscount(0); setPromoCode(''); }}>
                <X style={styles.removePromoIcon} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.promoSuggestions}>
            <Text style={styles.promoSuggestionLabel}>Try: </Text>
            {['WELCOME10', 'HIMALAYA20'].map((code) => (
              <TouchableOpacity key={code} style={styles.promoChip} onPress={() => { setPromoCode(code); handlePromoApply(); }}>
                <Text style={styles.promoChipText}>{code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollReveal>

      {/* Order Summary */}
      <ScrollReveal direction="up" distance={20} delay={300}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <View style={styles.shippingContainer}>
              <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Text>
              {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
                <Text style={styles.shippingHint}>Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for FREE shipping</Text>
              )}
            </View>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow discount}>
              <Text style={styles.summaryLabel}>Discount ({appliedPromo})</Text>
              <Text style={styles.discountValue}>-{formatPrice(discount)}</Text>
            </View>
          )}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow total}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>

          <View style={styles.secureBadges}>
            <View style={styles.badge}>
              <ShieldCheck style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Secure Checkout</Text>
            </View>
            <View style={styles.badge}>
              <CreditCard style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Multiple Payment Options</Text>
            </View>
            <View style={styles.badge}>
              <Gift style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Gift Wrapping Available</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={!token}>
            <Text style={styles.checkoutButtonText}>
              {token ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Text>
            <ArrowRight style={styles.checkoutArrow} />
          </TouchableOpacity>

          <Text style={styles.checkoutNote}>Cash on Delivery · UPI · Cards · Net Banking</Text>
        </View>
      </ScrollReveal>

      {/* Free Shipping Progress */}
      {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
        <ScrollReveal direction="scale" distance={10} delay={400}>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for FREE shipping</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
        </ScrollReveal>
      )}

      {/* Recommended Products */}
      <ScrollReveal direction="up" distance={20} delay={500}>
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>You May Also Like</Text>
          <View style={styles.recommendedGrid}>
            {[
              { id: 'rec1', name: 'Organic Chia Seeds', price: 699, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200' },
              { id: 'rec2', name: 'Virgin Coconut Oil', price: 799, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200' },
              { id: 'rec3', name: 'Wild Blueberries', price: 1199, image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200' },
            ].map((product) => (
              <TouchableOpacity key={product.id} style={styles.recommendedCard} onPress={() => { useCartStore.getState().addItem({ id: product.id, slug: product.id, name: product.name, price: product.price, image: product.image }); }}>
                <Image source={{ uri: product.image }} style={styles.recommendedImage} />
                <Text style={styles.recommendedName}>{product.name}</Text>
                <Text style={styles.recommendedPrice}>{formatPrice(product.price)}</Text>
                <TouchableOpacity style={styles.recommendedAdd}>
                  <Plus style={styles.recommendedAddIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollReveal>
    </ScrollView>
  );
}

// Need to import Alert and TextInput
import { Alert, TextInput } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
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
    position: 'relative',
    width: 120,
    height: 120,
  },
  emptyCartIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHeart: {
    color: '#365314',
  },
  emptySparkles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9A441',
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
    fontFamily: 'Inter_400Regular',
  },
  emptyCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#365314',
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
  emptyCTAArrow: {
    color: '#FFFFFF',
  },
  emptyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  emptyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
  },
  emptyFeatureIcon: {
    color: '#365314',
  },
  emptyFeatureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  itemCount: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemWeight: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F4EC',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  qtyIcon: {
    color: '#365314',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    color: '#EF4444',
  },
  promoSection: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  promoInputWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F8F4EC',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  promoButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  appliedPromo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  appliedPromoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    fontFamily: 'Poppins_600SemiBold',
  },
  removePromoIcon: {
    color: '#059669',
  },
  promoSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  promoSuggestionLabel: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  promoChip: {
    backgroundColor: '#F5F7EF',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  promoChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    gap: 16,
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
  shippingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  freeShipping: {
    color: '#059669',
    fontWeight: '700',
  },
  shippingHint: {
    fontSize: 11,
    color: '#D9A441',
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(43, 43, 43, 0.1)',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2B2B2B',
    fontFamily: 'Poppins_800ExtraBold',
  },
  secureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F4EC',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeIcon: {
    color: '#365314',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
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
  checkoutArrow: {
    color: '#FFFFFF',
  },
  checkoutNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  progressSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FEFCE8',
    borderRadius: 20,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CA8A04',
    fontFamily: 'Poppins_600SemiBold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FDE68A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D9A441',
    borderRadius: 4,
  },
  recommendedSection: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  recommendedGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendedCard: {
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
  recommendedImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  recommendedName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  recommendedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  recommendedAdd: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#365314',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedAddIcon: {
    color: '#FFFFFF',
  },
});