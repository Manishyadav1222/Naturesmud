import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Truck,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Tag,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore, PaymentMethod } from '@/store/order-store';
import { NEPAL_PAYMENT_METHODS, processNepalPayment } from '@/lib/payments';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/store/ui-store';

const NEPAL_PROVINCES = [
  'Bagmati Province',
  'Gandaki Province',
  'Koshi Province',
  'Lumbini Province',
  'Madhesh Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    getSubtotal,
    getShippingCost,
    getDiscountAmount,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();
  const { addOrder, setActiveOrder } = useOrderStore();

  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');

  // Address fields
  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(user?.phone || '+977 9841234567');
  const [addressLine1, setAddressLine1] = useState('Thamel Marg, Ward No. 26');
  const [city, setCity] = useState('Kathmandu');
  const [state, setState] = useState('Bagmati Province');
  const [postalCode, setPostalCode] = useState('44600');

  // Payment
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('esewa');
  const [promoInput, setPromoInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (res.success) {
      toast.success('Promo Applied', res.message);
      setPromoInput('');
    } else {
      Alert.alert('Promo Code Error', res.message);
    }
  };

  const handleNextStep = () => {
    if (step === 'address') {
      if (!name.trim() || !phone.trim() || !addressLine1.trim() || !city.trim()) {
        Alert.alert('Incomplete Address', 'Please fill in name, phone, address, and city.');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderNumber = `NM-${Math.floor(10000 + Math.random() * 90000)}`;

      // Process Nepal payment or COD
      const paymentRes = await processNepalPayment(selectedPayment, total, orderNumber);

      const createdOrder = addOrder({
        items: [...items],
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod: selectedPayment,
        paymentStatus: selectedPayment === 'cod' ? 'pending' : 'paid',
        shippingAddress: {
          name,
          phone,
          address_line_1: addressLine1,
          city,
          state,
          postal_code: postalCode,
          country: 'Nepal',
        },
      });

      setActiveOrder(createdOrder);
      setPlacedOrderNumber(createdOrder.orderNumber);
      clearCart();
      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert('Order Failed', err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone size={22} color="#60BB46" />;
      case 'QrCode':
        return <QrCode size={22} color="#E31B23" />;
      case 'Truck':
        return <Truck size={22} color="#365314" />;
      default:
        return <CreditCard size={22} color="#5C2D91" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step === 'review') setStep('payment');
              else if (step === 'payment') setStep('address');
              else router.back();
            }}
          >
            <ArrowLeft size={22} color="#1C1917" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.stepsBadge}>
            <Text style={styles.stepsText}>
              Step {step === 'address' ? '1' : step === 'payment' ? '2' : '3'} of 3
            </Text>
          </View>
        </View>

        {/* Step Indicator Tabs */}
        <View style={styles.stepsTabContainer}>
          <TouchableOpacity
            style={[styles.stepTab, step === 'address' && styles.stepTabActive]}
            onPress={() => setStep('address')}
          >
            <Text style={[styles.stepTabText, step === 'address' && styles.stepTabTextActive]}>
              1. Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stepTab, step === 'payment' && styles.stepTabActive]}
            onPress={() => setStep('payment')}
          >
            <Text style={[styles.stepTabText, step === 'payment' && styles.stepTabTextActive]}>
              2. Payment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stepTab, step === 'review' && styles.stepTabActive]}
            onPress={() => setStep('review')}
          >
            <Text style={[styles.stepTabText, step === 'review' && styles.stepTabTextActive]}>
              3. Review
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <MapPin size={20} color="#365314" />
                <Text style={styles.cardTitle}>Nepal Delivery Address</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Recipient Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contact Mobile (+977)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. +977 98XXXXXXXX"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Street / Locality / Ward No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Thamel Marg, Ward No. 26"
                  value={addressLine1}
                  onChangeText={setAddressLine1}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>City / Municipality</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Kathmandu"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={[styles.formGroup, { width: 100 }]}>
                  <Text style={styles.label}>Postal Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="44600"
                    keyboardType="numeric"
                    value={postalCode}
                    onChangeText={setPostalCode}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Province</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.provinceScroll}>
                  {NEPAL_PROVINCES.map((prov) => (
                    <TouchableOpacity
                      key={prov}
                      style={[styles.provChip, state === prov && styles.provChipActive]}
                      onPress={() => setState(prov)}
                    >
                      <Text style={[styles.provChipText, state === prov && styles.provChipTextActive]}>
                        {prov}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <CreditCard size={20} color="#365314" />
                <Text style={styles.cardTitle}>Select Payment Method</Text>
              </View>

              <View style={styles.paymentList}>
                {NEPAL_PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPayment === pm.id;
                  return (
                    <TouchableOpacity
                      key={pm.id}
                      style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                      onPress={() => setSelectedPayment(pm.id)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.paymentTop}>
                        <View style={styles.paymentIconBox}>
                          {getPaymentIcon(pm.iconName)}
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.paymentNameRow}>
                            <Text style={styles.paymentName}>{pm.name}</Text>
                            {pm.badge && (
                              <View style={styles.paymentBadge}>
                                <Text style={styles.paymentBadgeText}>{pm.badge}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.paymentSub}>{pm.subtitle}</Text>
                        </View>
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </View>
                      {isSelected && (
                        <View style={styles.instructionsBox}>
                          <ShieldCheck size={14} color="#365314" />
                          <Text style={styles.instructionsText}>{pm.instructions}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: REVIEW & COUPONS */}
          {step === 'review' && (
            <>
              {/* Promo code card */}
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <Tag size={18} color="#365314" />
                  <Text style={styles.cardTitle}>Coupons & Offers</Text>
                </View>

                {couponCode ? (
                  <View style={styles.appliedCouponRow}>
                    <View>
                      <Text style={styles.appliedCouponTitle}>Coupon Applied: {couponCode}</Text>
                      <Text style={styles.appliedCouponSavings}>
                        Saved {formatPrice(discount)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={removeCoupon} style={styles.removeCouponBtn}>
                      <Text style={styles.removeCouponText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="e.g. WELCOME10 or HIMALAYA20"
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

              {/* Order Items Review */}
              <View style={styles.sectionCard}>
                <Text style={styles.cardTitle}>Order Summary ({items.length} items)</Text>
                {items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemSub}>Qty: {item.quantity} · {item.weight}</Text>
                    </View>
                    <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                  </View>
                ))}
              </View>

              {/* Delivery & Payment Summary */}
              <View style={styles.sectionCard}>
                <Text style={styles.cardTitle}>Delivery Details</Text>
                <Text style={styles.reviewAddressText}>
                  📍 {name} ({phone}) - {addressLine1}, {city}, {state}
                </Text>
                <Text style={styles.reviewPaymentText}>
                  💳 Payment via:{' '}
                  {NEPAL_PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name}
                </Text>
              </View>
            </>
          )}

          {/* Pricing Breakdown */}
          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Items Subtotal</Text>
              <Text style={styles.priceVal}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Himalayan Delivery</Text>
              <Text style={styles.priceVal}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: '#16A34A' }]}>Coupon Discount</Text>
                <Text style={[styles.priceVal, { color: '#16A34A' }]}>
                  -{formatPrice(discount)}
                </Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalVal}>{formatPrice(total)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomTotalLabel}>Total Amount</Text>
            <Text style={styles.bottomTotalVal}>{formatPrice(total)}</Text>
          </View>
          {step !== 'review' ? (
            <TouchableOpacity style={styles.continueBtn} onPress={handleNextStep}>
              <Text style={styles.continueBtnText}>
                {step === 'address' ? 'Proceed to Payment' : 'Review Order'}
              </Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.placeOrderBtn, isProcessing && { opacity: 0.7 }]}
              onPress={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.placeOrderBtnText}>Place Harvest Order</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconBadge}>
              <CheckCircle2 size={44} color="#365314" />
            </View>
            <Text style={styles.successTitle}>Order Placed Successfully! 🎉</Text>
            <Text style={styles.successDesc}>
              Thank you for trusting Nature's Mud. Your pure Himalayan harvest package is being prepared.
            </Text>

            <View style={styles.orderBadgeBox}>
              <Text style={styles.orderBadgeLabel}>Order Reference Number</Text>
              <Text style={styles.orderBadgeValue}>{placedOrderNumber}</Text>
            </View>

            <TouchableOpacity
              style={styles.trackOrderBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace({
                  pathname: '/track-order',
                  params: { orderNumber: placedOrderNumber },
                });
              }}
            >
              <Truck size={18} color="#FFFFFF" />
              <Text style={styles.trackOrderBtnText}>Live Track Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueShoppingBtn}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.continueShoppingText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  stepsBadge: {
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  stepsTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    gap: 8,
  },
  stepTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F4',
  },
  stepTabActive: {
    backgroundColor: '#365314',
  },
  stepTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  stepTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#44403C',
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1C1917',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  provinceScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  provChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F5F5F4',
    marginRight: 8,
  },
  provChipActive: {
    backgroundColor: '#365314',
  },
  provChipText: {
    fontSize: 12,
    color: '#57534E',
  },
  provChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paymentList: {
    gap: 10,
  },
  paymentCard: {
    backgroundColor: '#F5F5F4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
  },
  paymentCardActive: {
    backgroundColor: '#F7FEE7',
    borderColor: '#365314',
  },
  paymentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  paymentBadge: {
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paymentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#365314',
  },
  paymentSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A8A29E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#365314',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#365314',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D9F99D',
  },
  instructionsText: {
    fontSize: 12,
    color: '#365314',
    flex: 1,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 42,
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
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFCCB',
    padding: 12,
    borderRadius: 10,
  },
  appliedCouponTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365314',
  },
  appliedCouponSavings: {
    fontSize: 12,
    color: '#4D7C0F',
    marginTop: 2,
  },
  removeCouponBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeCouponText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
    gap: 10,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
  },
  itemSub: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  reviewAddressText: {
    fontSize: 13,
    color: '#44403C',
    lineHeight: 18,
    marginBottom: 6,
  },
  reviewPaymentText: {
    fontSize: 13,
    color: '#365314',
    fontWeight: '600',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 13,
    color: '#78716C',
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
  },
  totalRow: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
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
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  orderBadgeBox: {
    backgroundColor: '#F7FEE7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9F99D',
    marginBottom: 20,
    width: '100%',
  },
  orderBadgeLabel: {
    fontSize: 11,
    color: '#4D7C0F',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderBadgeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#365314',
    marginTop: 2,
  },
  trackOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365314',
    borderRadius: 14,
    height: 48,
    width: '100%',
    gap: 8,
    marginBottom: 10,
  },
  trackOrderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  continueShoppingBtn: {
    paddingVertical: 8,
  },
  continueShoppingText: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '600',
  },
});