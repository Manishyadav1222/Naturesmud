'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Truck, ShieldCheck, Lock, MapPin, Phone, Mail, Check, RadioButtonOff, RadioButtonOn, Plus, Minus, Eye, EyeOff, ChevronDown, ChevronUp, ArrowRight, User, Calendar, Clock, HelpCircle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { ScrollReveal } from '@/components/ScrollReveal';

const SHIPPING_THRESHOLD = 3000;
const SHIPPING_COST = 150;

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: Truck },
  { id: 'upi', label: 'UPI', desc: 'PhonePe, Google Pay, Paytm, etc.', icon: CreditCard },
  { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', desc: '50+ banks supported', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', desc: 'Use wallet balance', icon: CreditCard },
];

const nepalStates = [
  'Bagmati', 'Gandaki', 'Koshi', 'Lumbini', 'Madhesh', 'Sudurpashchim', 'Karnali',
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nepal',
    type: 'home',
    is_default: false,
  });
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping - discount;

  // Mock addresses - in real app, fetch from API
  const addresses = [
    {
      id: '1',
      name: user?.name || 'John Doe',
      phone: user?.phone || '+977 98XXXXXXXX',
      address_line_1: 'Thamel Marg',
      address_line_2: 'Near Durbar Square',
      city: 'Kathmandu',
      state: 'Bagmati',
      postal_code: '44600',
      country: 'Nepal',
      is_default: true,
    },
  ];

  if (!token) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleAddressSubmit = () => {
    if (!formData.name || !formData.phone || !formData.address_line_1 || !formData.city || !formData.state || !formData.postal_code) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid Nepali phone number');
      return;
    }

    const newAddress = {
      ...formData,
      id: Date.now().toString(),
      is_default: addresses.length === 0,
    };

    // In real app, call API
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    setEditingAddress(null);
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

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Alert.alert('Error', 'Please select a delivery address');
      setStep('address');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrderNumber = `ORD-${Date.now().toString().slice(-8)}`;
      setOrderNumber(newOrderNumber);
      await clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatPhoneInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 10) return cleaned;
    return `+977 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const steps = [
    { id: 'address', label: 'Delivery', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Check },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Steps */}
      <View style={styles.stepsContainer}>
        {steps.map((s, index) => (
          <View key={s.id} style={styles.stepWrapper}>
            <View style={[
              styles.stepCircle,
              (step === s.id || steps.findIndex(st => st.id === step) > index) && styles.stepCircleActive,
            ]}>
              <Text style={[
                styles.stepNumber,
                (step === s.id || steps.findIndex(st => st.id === step) > index) && styles.stepNumberActive,
              ]}>{index + 1}</Text>
            </View>
            <Text style={[
              styles.stepLabel,
              step === s.id && styles.stepLabelActive,
            ]}>{s.label}</Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                steps.findIndex(st => st.id === step) > index && styles.stepLineActive,
              ]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Address */}
        {step === 'address' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Delivery Address</Text>
            <Text style={styles.stepSubtitle}>Where should we deliver your order?</Text>

            {/* Saved Addresses */}
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressCard,
                  selectedAddressId === address.id && styles.addressCardSelected,
                ]}
                onPress={() => setSelectedAddressId(address.id)}
              >
                <View style={styles.addressRadio}>
                  {selectedAddressId === address.id ? (
                    <RadioButtonOn style={styles.radioSelected} />
                  ) : (
                    <RadioButtonOff style={styles.radioUnselected} />
                  )}
                </View>
                <View style={styles.addressDetails}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    {address.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                  <Text style={styles.addressFull}>
                    {address.address_line_1}
                    {address.address_line_2 && `, ${address.address_line_2}`}
                    , {address.city}, {address.state} {address.postal_code}
                    , {address.country}
                  </Text>
                </View>
                <TouchableOpacity style={styles.editAddressButton} onPress={(e) => { e.stopPropagation(); setEditingAddress(address); setFormData(address); setShowAddressForm(true); }}>
                  <Text style={styles.editAddressText}>Edit</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Add New Address */}
            <TouchableOpacity style={styles.addAddressButton} onPress={() => { setFormData({ name: '', phone: '', address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '', country: 'Nepal', type: 'home', is_default: false }); setEditingAddress(null); setShowAddressForm(true); }}>
              <Plus style={styles.addAddressIcon} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>

            {/* Address Form Modal/Bottom Sheet */}
            {(showAddressForm || editingAddress) && (
              <View style={styles.formOverlay} onTouchStart={() => { if (!editingAddress) { setShowAddressForm(false); } }}>
                <View style={styles.formContainer} onTouchStart={(e) => e.stopPropagation()}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>{editingAddress ? 'Edit Address' : 'Add New Address'}</Text>
                    <TouchableOpacity onPress={() => { setShowAddressForm(false); setEditingAddress(null); }}>
                      <ChevronDown style={styles.formCloseIcon} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.formFields}>
                      <FormField label="Full Name" placeholder="John Doe" value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} required />
                      <FormField label="Phone Number" placeholder="+977 98XXXXXXXX" value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: formatPhoneInput(v) })} keyboardType="phone-pad" required />
                      <FormField label="Address Line 1" placeholder="House/Flat No., Building, Street" value={formData.address_line_1} onChangeText={(v) => setFormData({ ...formData, address_line_1: v })} required />
                      <FormField label="Address Line 2 (Optional)" placeholder="Landmark, Area, Sector" value={formData.address_line_2} onChangeText={(v) => setFormData({ ...formData, address_line_2: v })} />
                      <FormField label="City" placeholder="Kathmandu" value={formData.city} onChangeText={(v) => setFormData({ ...formData, city: v })} required />
                      <FormField
                        label="State"
                        placeholder="Select State"
                        value={formData.state}
                        onChangeText={(v) => setFormData({ ...formData, state: v })}
                        required
                        select
                        options={nepalStates}
                      />
                      <FormField label="Postal Code" placeholder="44600" value={formData.postal_code} onChangeText={(v) => setFormData({ ...formData, postal_code: v })} keyboardType="numeric" required />
                      <FormField label="Country" placeholder="Nepal" value={formData.country} onChangeText={(v) => setFormData({ ...formData, country: v })} required />
                    </View>
                  </ScrollView>

                  <TouchableOpacity style={styles.formSubmitButton} onPress={handleAddressSubmit} disabled={editingAddress && formData.name === editingAddress.name}>
                    <Text style={styles.formSubmitText}>{editingAddress ? 'Save Changes' : 'Save Address'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Payment Method</Text>
            <Text style={styles.stepSubtitle}>Choose how you\'d like to pay</Text>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  selectedPaymentMethod === method.id && styles.paymentCardSelected,
                ]}
                onPress={() => {
                  setSelectedPaymentMethod(method.id);
                  setShowCardForm(method.id === 'card');
                }}
              >
                <View style={styles.paymentRadio}>
                  {selectedPaymentMethod === method.id ? (
                    <RadioButtonOn style={styles.radioSelected} />
                  ) : (
                    <RadioButtonOff style={styles.radioUnselected} />
                  )}
                </View>
                <View style={styles.paymentInfo}>
                  <method.icon style={styles.paymentIcon} />
                  <View style={styles.paymentTexts}>
                    <Text style={styles.paymentLabel}>{method.label}</Text>
                    <Text style={styles.paymentDesc}>{method.desc}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Card Form */}
            {(selectedPaymentMethod === 'card' || showCardForm) && (
              <View style={styles.cardForm}>
                <Text style={styles.cardFormTitle}>Card Details</Text>
                <View style={styles.formFields}>
                  <FormField
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChangeText={(v) => setCardData({ ...cardData, number: formatCardNumber(v) })}
                    keyboardType="numeric"
                    required
                    secureTextEntry={false}
                  />
                  <View style={styles.cardRow}>
                    <FormField
                      label="Expiry (MM/YY)"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChangeText={(v) => setCardData({ ...cardData, expiry: formatExpiry(v) })}
                      keyboardType="numeric"
                      required
                    />
                    <FormField
                      label="CVV"
                      placeholder="123"
                      value={cardData.cvv}
                      onChangeText={(v) => setCardData({ ...cardData, cvv: v })}
                      keyboardType="numeric"
                      required
                      secureTextEntry
                    />
                  </View>
                  <FormField
                    label="Name on Card"
                    placeholder="John Doe"
                    value={cardData.name}
                    onChangeText={(v) => setCardData({ ...cardData, name: v })}
                    required
                  />
                </View>
                <Text style={styles.cardNote}>
                  <Lock style={styles.cardNoteIcon} />
                  Your card details are encrypted and secure. We don\'t store your full card number.
                </Text>
              </View>
            )}

            {/* Promo Code */}
            <View style={styles.promoSection}>
              <Text style={styles.promoTitle}>Promo Code</Text>
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
          </View>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review Your Order</Text>
            <Text style={styles.stepSubtitle}>Please verify all details before placing your order</Text>

            {/* Address Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryCardTitle}>Delivery Address</Text>
                <TouchableOpacity style={styles.changeLink} onPress={() => setStep('address')}>
                  <Text style={styles.changeLinkText}>Change</Text>
                </TouchableOpacity>
              </View>
              {addresses.find(a => a.id === selectedAddressId) && (
                <View style={styles.summaryAddress}>
                  <Text style={styles.summaryAddressName}>{addresses.find(a => a.id === selectedAddressId)!.name}</Text>
                  <Text style={styles.summaryAddressPhone}>{addresses.find(a => a.id === selectedAddressId)!.phone}</Text>
                  <Text style={styles.summaryAddressFull}>
                    {addresses.find(a => a.id === selectedAddressId)!.address_line_1}
                    {addresses.find(a => a.id === selectedAddressId)!.address_line_2 && `, ${addresses.find(a => a.id === selectedAddressId)!.address_line_2}`}
                    , {addresses.find(a => a.id === selectedAddressId)!.city}, {addresses.find(a => a.id === selectedAddressId)!.state} {addresses.find(a => a.id === selectedAddressId)!.postal_code}
                  </Text>
                </View>
              )}
            </View>

            {/* Payment Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <Text style={styles.summaryCardTitle}>Payment Method</Text>
                <TouchableOpacity style={styles.changeLink} onPress={() => setStep('payment')}>
                  <Text style={styles.changeLinkText}>Change</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.summaryPayment}>
                <Text style={styles.summaryPaymentLabel}>
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.label}
                </Text>
                {selectedPaymentMethod === 'card' && cardData.number && (
                  <Text style={styles.summaryPaymentCard}>•••• •••• •••• {cardData.number.slice(-4)}</Text>
                )}
              </View>
            </View>

            {/* Order Items */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Order Items ({items.length})</Text>
              {items.map((item) => (
                <View key={item.productId} style={styles.reviewItem}>
                  <Image source={{ uri: item.product?.image }} style={styles.reviewItemImage} />
                  <View style={styles.reviewItemDetails}>
                    <Text style={styles.reviewItemName}>{item.product?.name}</Text>
                    <Text style={styles.reviewItemQty}>Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}</Text>
                  </View>
                  <Text style={styles.reviewItemTotal}>{formatPrice((item.product?.price || 0) * item.quantity)}</Text>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </Text>
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
            </View>

            {/* Terms */}
            <View style={styles.termsRow}>
              <Check style={styles.termsCheck} />
              <Text style={styles.termsText}>
                I agree to the {' '}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
                {' '} and {' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
              style={[styles.placeOrderButton, isPlacingOrder && styles.placeOrderDisabled]}
              onPress={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <Text style={styles.placeOrderText}>Placing Order...</Text>
              ) : (
                <Text style={styles.placeOrderText}>Place Order — {formatPrice(total)}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.secureNote}>
              <ShieldCheck style={styles.secureIcon} />
              Secure checkout • COD available • Easy returns
            </Text>
          </View>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <View style={styles.modalOverlay} onTouchStart={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.modalSuccessIcon}>
                <Check style={styles.modalCheckIcon} />
              </View>
              <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
              <Text style={styles.modalSubtitle}>Your order has been confirmed</Text>
              <View style={styles.modalOrderInfo}>
                <Text style={styles.modalOrderLabel}>Order Number</Text>
                <Text style={styles.modalOrderNumber}>{orderNumber}</Text>
              </View>
              <Text style={styles.modalDesc}>
                You\'ll receive a confirmation SMS and email shortly. Track your order in the Orders section.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => { setShowSuccessModal(false); router.push('/account/orders'); }}>
                  <Text style={styles.modalButtonSecondaryText}>View Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonPrimary} onPress={() => { setShowSuccessModal(false); router.push('/'); }}>
                  <Text style={styles.modalButtonPrimaryText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Next/Back Buttons */}
      <View style={styles.stickyNav}>
        {step !== 'address' && (
          <TouchableOpacity style={styles.navButtonBack} onPress={() => setStep(steps[steps.findIndex(s => s.id === step) - 1].id)}>
            <ChevronLeft style={styles.navButtonIcon} />
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.navButtonNext,
            step === 'address' && !selectedAddressId && styles.navButtonDisabled,
          ]}
          onPress={() => {
            if (step === 'address') {
              if (selectedAddressId) setStep('payment');
            } else if (step === 'payment') {
              setStep('review');
            } else if (step === 'review') {
              handlePlaceOrder();
            }
          }}
          disabled={step === 'address' && !selectedAddressId || isPlacingOrder}
        >
          <Text style={styles.navButtonText}>
            {step === 'review' ? 'Place Order' : 'Continue'}
          </Text>
          {step !== 'review' && <ChevronRight style={styles.navButtonIcon} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Form Field Component
function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  required = false,
  select = false,
  options = [],
  secureTextEntry = false,
}: any) {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label} {required && <Text style={styles.required}>*</Text>}</Text>
      {select ? (
        <TouchableOpacity style={styles.selectField}>
          <Text style={[styles.selectValue, value ? styles.selectValueFilled : styles.selectValuePlaceholder]}>{value || placeholder}</Text>
          <ChevronDown style={styles.selectArrow} />
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={keyboardType === 'default' ? 'words' : 'none'}
        />
      )}
    </View>
  );
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+977|977|0)?[98][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

import { X } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#2B2B2B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  headerSpacer: {
    width: 40,
  },
  stepsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.1)',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#365314',
    borderColor: '#365314',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    opacity: 0.4,
    fontFamily: 'Poppins_700Bold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2B2B2B',
    opacity: 0.6,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  stepLabelActive: {
    color: '#365314',
    opacity: 1,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  stepLineActive: {
    backgroundColor: '#365314',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  stepContent: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  addressCardSelected: {
    borderColor: '#365314',
    borderWidth: 2,
    backgroundColor: '#F5F7EF',
  },
  addressRadio: {
    padding: 4,
  },
  radioSelected: {
    color: '#365314',
  },
  radioUnselected: {
    color: '#D1D5DB',
  },
  addressDetails: {
    flex: 1,
    gap: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  defaultBadge: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  addressPhone: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  addressFull: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  editAddressButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editAddressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
    borderStyle: 'dashed',
  },
  addAddressIcon: {
    color: '#365314',
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.1)',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  formCloseIcon: {
    color: '#2B2B2B',
  },
  formScroll: {
    maxHeight: 300,
  },
  formFields: {
    gap: 16,
    paddingTop: 16,
  },
  formField: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8F4EC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  selectField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F4EC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectValue: {
    fontSize: 16,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  selectValuePlaceholder: {
    opacity: 0.4,
  },
  selectValueFilled: {
    opacity: 1,
  },
  selectArrow: {
    color: '#2B2B2B',
  },
  formSubmitButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  formSubmitText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  paymentCardSelected: {
    borderColor: '#365314',
    borderWidth: 2,
    backgroundColor: '#F5F7EF',
  },
  paymentRadio: {
    padding: 4,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentIcon: {
    color: '#365314',
  },
  paymentTexts: {
    gap: 2,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  cardForm: {
    padding: 16,
    backgroundColor: '#F8F4EC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
  },
  cardFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardRow > *: {
    flex: 1,
  },
  cardNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  cardNoteIcon: {
    color: '#059669',
  },
  promoSection: {
    marginTop: 8,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 12,
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
    marginTop: 8,
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
    marginTop: 8,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  changeLink: {
    padding: 4,
  },
  changeLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryAddress: {
    gap: 2,
  },
  summaryAddressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryAddressPhone: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  summaryAddressFull: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  summaryPayment: {
    gap: 2,
  },
  summaryPaymentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryPaymentCard: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.08)',
  },
  reviewItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  reviewItemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  reviewItemQty: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  reviewItemTotal: {
    fontSize: 14,
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
  freeShipping: {
    color: '#059669',
    fontWeight: '700',
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
    marginVertical: 8,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  termsCheck: {
    color: '#365314',
    marginTop: 2,
  },
  termsText: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  termsLink: {
    color: '#365314',
    fontWeight: '600',
  },
  placeOrderButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  placeOrderDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  secureIcon: {
    color: '#059669',
  },
  stickyNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
    gap: 12,
  },
  navButtonBack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.2)',
    borderRadius: 9999,
    paddingVertical: 14,
  },
  navButtonNext: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 14,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonIcon: {
    color: step === 'address' && !selectedAddressId ? '#2B2B2B40' : '#2B2B2B',
  },
  navButtonText: {
    color: step === 'address' && !selectedAddressId ? '#2B2B2B40' : '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 200,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 12,
  },
  modalSuccessIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCheckIcon: {
    color: '#059669',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  modalOrderInfo: {
    backgroundColor: '#F5F7EF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  modalOrderLabel: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  modalOrderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  modalDesc: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.2)',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#2B2B2B',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
});