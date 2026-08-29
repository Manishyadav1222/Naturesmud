import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react-native';
import { useOrderStore, PlacedOrder, OrderStatus } from '@/store/order-store';
import { formatPrice, formatDateTime } from '@/lib/utils';

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; desc: string }> = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & logged in our system' },
  { key: 'verified', label: 'Order Verified', desc: 'Himalayan harvest batch checked' },
  { key: 'packed', label: 'Packed & Dispatched', desc: 'Eco-packaged with seal of purity' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'With courier rider in your area' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered to your doorstep' },
];

export default function TrackOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderNumber?: string }>();
  const { orders, activeOrder, getOrderByNumber } = useOrderStore();

  const [inputNumber, setInputNumber] = useState(
    params.orderNumber || activeOrder?.orderNumber || (orders[0] ? orders[0].orderNumber : 'NM-98241')
  );

  const currentOrder = getOrderByNumber(inputNumber) || activeOrder || orders[0];

  const handleSearch = () => {
    if (!inputNumber.trim()) {
      Alert.alert('Please enter an order number', 'Example: NM-98241');
      return;
    }
    const found = getOrderByNumber(inputNumber.trim());
    if (!found) {
      Alert.alert('Order Not Found', `No active order matches "${inputNumber.trim()}". Check your order number or account history.`);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'verified':
        return 1;
      case 'packed':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 3;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Namaste Nature's Mud! I'd like to check on my order ${currentOrder?.orderNumber || ''}.`);
    Linking.openURL(`https://wa.me/9779713888002?text=${text}`).catch(() => {
      Alert.alert('WhatsApp', 'Unable to open WhatsApp. Contact us at +977 9713888002.');
    });
  };

  const handleCall = () => {
    Linking.openURL('tel:+9779713888002').catch(() => {
      Alert.alert('Call Support', '+977 9713888002');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Your Harvest</Text>
        <TouchableOpacity style={styles.chatHeaderBtn} onPress={handleWhatsApp}>
          <MessageCircle size={20} color="#365314" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <Search size={18} color="#78716C" />
            <TextInput
              style={styles.input}
              placeholder="Enter Order # (e.g. NM-98241)"
              placeholderTextColor="#A8A29E"
              value={inputNumber}
              onChangeText={setInputNumber}
              autoCapitalize="characters"
            />
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Track</Text>
          </TouchableOpacity>
        </View>

        {currentOrder ? (
          <>
            {/* Order Status Banner */}
            <View style={styles.bannerCard}>
              <View style={styles.bannerTop}>
                <View>
                  <Text style={styles.orderLabel}>Order Number</Text>
                  <Text style={styles.orderNumber}>{currentOrder.orderNumber}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {currentOrder.status.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.bannerDivider} />

              <View style={styles.bannerMetaRow}>
                <View style={styles.metaCol}>
                  <Clock size={14} color="#78716C" />
                  <Text style={styles.metaText}>
                    Placed: {formatDateTime(currentOrder.createdAt)}
                  </Text>
                </View>
                <View style={styles.metaCol}>
                  <Calendar size={14} color="#365314" />
                  <Text style={[styles.metaText, { color: '#365314', fontWeight: '600' }]}>
                    ETA: 24-48 Hours
                  </Text>
                </View>
              </View>
            </View>

            {/* Stepper Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.sectionTitle}>Delivery Progress</Text>
              <View style={styles.stepperContainer}>
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <View key={step.key} style={styles.stepRow}>
                      <View style={styles.stepIndicatorCol}>
                        <View
                          style={[
                            styles.stepDot,
                            isDone && styles.stepDotDone,
                            isCurrent && styles.stepDotCurrent,
                          ]}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} color="#FFFFFF" />
                          ) : (
                            <View style={styles.stepDotInner} />
                          )}
                        </View>
                        {idx < STATUS_STEPS.length - 1 && (
                          <View
                            style={[
                              styles.stepLine,
                              idx < currentStepIdx && styles.stepLineDone,
                            ]}
                          />
                        )}
                      </View>
                      <View style={styles.stepTextCol}>
                        <Text
                          style={[
                            styles.stepLabel,
                            isCurrent && styles.stepLabelCurrent,
                          ]}
                        >
                          {step.label}
                        </Text>
                        <Text style={styles.stepDesc}>{step.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Courier Rider Card (When out for delivery) */}
            {currentStepIdx >= 3 && (
              <View style={styles.riderCard}>
                <View style={styles.riderHeader}>
                  <View style={styles.riderAvatar}>
                    <Truck size={22} color="#365314" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.riderName}>Sunil K. (Nature's Mud Express)</Text>
                    <Text style={styles.riderStatus}>Assigned Delivery Rider · EV Bike #448</Text>
                  </View>
                </View>
                <View style={styles.riderActionsRow}>
                  <TouchableOpacity style={styles.riderCallBtn} onPress={handleCall}>
                    <Phone size={16} color="#FFFFFF" />
                    <Text style={styles.riderCallText}>Call Rider</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.riderChatBtn} onPress={handleWhatsApp}>
                    <MessageCircle size={16} color="#365314" />
                    <Text style={styles.riderChatText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Delivery Address */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <MapPin size={18} color="#365314" />
                <Text style={styles.infoCardTitle}>Delivery Address</Text>
              </View>
              <Text style={styles.addressName}>{currentOrder.shippingAddress.name}</Text>
              <Text style={styles.addressLine}>
                {currentOrder.shippingAddress.address_line_1}
              </Text>
              <Text style={styles.addressLine}>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postal_code}
              </Text>
              <Text style={styles.addressPhone}>
                📞 {currentOrder.shippingAddress.phone}
              </Text>
            </View>

            {/* Order Items */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Package size={18} color="#365314" />
                <Text style={styles.infoCardTitle}>Items in this Package</Text>
              </View>
              {currentOrder.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemMeta}>
                      Qty: {item.quantity} · {item.weight}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.costSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatPrice(currentOrder.subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Charge</Text>
                  <Text style={styles.summaryValue}>
                    {currentOrder.shipping === 0 ? 'FREE' : formatPrice(currentOrder.shipping)}
                  </Text>
                </View>
                {currentOrder.discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: '#16A34A' }]}>Discount Saved</Text>
                    <Text style={[styles.summaryValue, { color: '#16A34A' }]}>
                      -{formatPrice(currentOrder.discount)}
                    </Text>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>{formatPrice(currentOrder.total)}</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
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
  chatHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1C1917',
  },
  searchBtn: {
    backgroundColor: '#365314',
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 12,
    color: '#78716C',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  bannerDivider: {
    height: 1,
    backgroundColor: '#F5F5F4',
    marginVertical: 12,
  },
  bannerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#78716C',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 16,
  },
  stepperContainer: {
    paddingLeft: 6,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E7E5E4',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepDotDone: {
    backgroundColor: '#365314',
  },
  stepDotCurrent: {
    backgroundColor: '#365314',
    borderWidth: 3,
    borderColor: '#BEF264',
  },
  stepDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A8A29E',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E7E5E4',
    marginVertical: 2,
  },
  stepLineDone: {
    backgroundColor: '#365314',
  },
  stepTextCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
  },
  stepLabelCurrent: {
    color: '#1C1917',
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    color: '#A8A29E',
    marginTop: 2,
  },
  riderCard: {
    backgroundColor: '#F7FEE7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  riderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#BEF264',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  riderStatus: {
    fontSize: 12,
    color: '#4D7C0F',
    marginTop: 2,
  },
  riderActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  riderCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365314',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  riderCallText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  riderChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BEF264',
    gap: 6,
  },
  riderChatText: {
    color: '#365314',
    fontWeight: '600',
    fontSize: 13,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  addressName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#292524',
    marginBottom: 2,
  },
  addressLine: {
    fontSize: 13,
    color: '#57534E',
    lineHeight: 18,
  },
  addressPhone: {
    fontSize: 13,
    color: '#365314',
    fontWeight: '600',
    marginTop: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
    gap: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
  },
  itemMeta: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  costSummary: {
    marginTop: 14,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#78716C',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#365314',
  },
});
