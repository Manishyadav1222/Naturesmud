import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Truck,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import {
  useCartStore,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/store/ui-store';

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getShippingCost,
    getDiscountAmount,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscountAmount();
  const total = getTotal();

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (res.success) {
      toast.success('Promo Code Applied', res.message);
      setPromoInput('');
    } else {
      Alert.alert('Invalid Code', res.message);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBadge}>
            <ShoppingBag size={48} color="#365314" />
          </View>
          <Text style={styles.emptyTitle}>Your Basket is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our Himalayan harvest of pure Shilajit, raw honey, and organic ghee.
          </Text>
          <TouchableOpacity
            style={styles.startShopBtn}
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.startShopText}>Discover Harvest</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.emptyValues}>
            <View style={styles.emptyValueItem}>
              <ShieldCheck size={18} color="#365314" />
              <Text style={styles.emptyValueText}>0 Additives · 0 Preservatives</Text>
            </View>
            <View style={styles.emptyValueItem}>
              <Truck size={18} color="#365314" />
              <Text style={styles.emptyValueText}>Free Delivery &gt; Rs. 3,000</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Harvest Cart</Text>
          <Text style={styles.headerSubtitle}>{items.length} unique items</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Free Shipping Meter */}
        <View style={styles.shippingMeterCard}>
          <View style={styles.shippingMeterHeader}>
            <Truck size={16} color="#365314" />
            <Text style={styles.shippingMeterTitle}>
              {amountNeededForFreeShipping === 0
                ? '🎉 You unlocked FREE Himalayan shipping!'
                : `Add ${formatPrice(amountNeededForFreeShipping)} more for FREE shipping`}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${freeShippingProgress}%` }]} />
          </View>
        </View>

        {/* Cart Items List */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <View style={styles.itemDetails}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.trashBtn}>
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemCategory}>{item.category} · {item.weight}</Text>
                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} color="#1C1917" />
                    </TouchableOpacity>
                    <Text style={styles.stepCount}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} color="#1C1917" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Coupon Card */}
        <View style={styles.couponCard}>
          <View style={styles.couponHeader}>
            <Tag size={16} color="#365314" />
            <Text style={styles.couponTitle}>Have a Promo Code?</Text>
          </View>

          {couponCode ? (
            <View style={styles.appliedRow}>
              <View>
                <Text style={styles.appliedCode}>Code '{couponCode}' Applied</Text>
                <Text style={styles.appliedSavings}>
                  Saved {formatPrice(discount)}
                </Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="WELCOME10 or HIMALAYA20"
                placeholderTextColor="#A8A29E"
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyPromo}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#16A34A' }]}>Coupon Savings</Text>
              <Text style={[styles.summaryVal, { color: '#16A34A' }]}>
                -{formatPrice(discount)}
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Checkout Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalVal}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 110,
  },
  shippingMeterCard: {
    backgroundColor: '#F7FEE7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D9F99D',
    gap: 8,
  },
  shippingMeterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shippingMeterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#365314',
    flex: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#D9F99D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#365314',
    borderRadius: 3,
  },
  itemsList: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 12,
  },
  itemImg: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    flex: 1,
  },
  trashBtn: {
    padding: 4,
  },
  itemCategory: {
    fontSize: 11,
    color: '#78716C',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#365314',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  stepBtn: {
    padding: 6,
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
    paddingHorizontal: 10,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 10,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1C1917',
  },
  applyBtn: {
    backgroundColor: '#365314',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  appliedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFCCB',
    padding: 10,
    borderRadius: 10,
  },
  appliedCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#365314',
  },
  appliedSavings: {
    fontSize: 11,
    color: '#4D7C0F',
  },
  removeCouponText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 10,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#78716C',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  totalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#365314',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: '#78716C',
  },
  bottomTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#365314',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  startShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  startShopText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyValues: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
  },
  emptyValueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyValueText: {
    fontSize: 11,
    color: '#57534E',
    fontWeight: '500',
  },
});