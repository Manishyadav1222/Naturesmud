import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  MessageCircle,
  Phone,
  ShieldCheck,
  Award,
  ChevronRight,
  LogOut,
  LogIn,
  Zap,
  Star,
  Sparkles,
  Truck,
  Plus,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { toast } from '@/store/ui-store';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, loginWithDemo } = useAuthStore();
  const { orders } = useOrderStore();
  const { favoriteIds } = useWishlistStore();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      title: 'Home (Kathmandu)',
      address: 'Thamel Marg, Ward No. 26, Kathmandu, Bagmati Province',
      phone: '+977 9841234567',
      isDefault: true,
    },
    {
      id: 'addr_2',
      title: 'Office / Store',
      address: 'Lakeside-6, Baidam, Pokhara, Gandaki Province',
      phone: '+977 9801987654',
      isDefault: false,
    },
  ]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          toast.info('Signed Out', 'You have been signed out.');
        },
      },
    ]);
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/9779713888002?text=Namaste!%20I%20need%20assistance%20with%20my%20account%20or%20order.').catch(() => {});
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+9779713888002').catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Orders</Text>
        <TouchableOpacity style={styles.chatBtn} onPress={handleWhatsApp}>
          <MessageCircle size={20} color="#365314" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        {isAuthenticated && user ? (
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
              ) : (
                <User size={32} color="#365314" />
              )}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{user.name}</Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={12} color="#365314" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profilePhone}>{user.phone}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestHeader}>
              <View style={styles.guestIconBadge}>
                <User size={28} color="#365314" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guestTitle}>Welcome to Nature's Mud</Text>
                <Text style={styles.guestSub}>Sign in to earn loyalty points & track orders</Text>
              </View>
            </View>

            <View style={styles.guestButtonsRow}>
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={() => router.push('/login')}
              >
                <LogIn size={16} color="#FFFFFF" />
                <Text style={styles.signInBtnText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.registerBtnText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Demo Login Option */}
            <View style={styles.demoLoginBox}>
              <Text style={styles.demoLoginLabel}>⚡ Instant Preview:</Text>
              <TouchableOpacity
                style={styles.demoLoginChip}
                onPress={() => {
                  loginWithDemo('customer');
                  toast.success('Signed in as Demo Customer');
                }}
              >
                <Zap size={12} color="#365314" />
                <Text style={styles.demoLoginChipText}>Demo Customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Loyalty Points Banner */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyLeft}>
            <Award size={24} color="#D97706" />
            <View>
              <Text style={styles.loyaltyTitle}>Himalayan Club Points</Text>
              <Text style={styles.loyaltySub}>Redeemable for free gifts & discounts</Text>
            </View>
          </View>
          <View style={styles.loyaltyPointsBadge}>
            <Text style={styles.loyaltyPointsVal}>
              {user ? user.loyaltyPoints : 150} PTS
            </Text>
          </View>
        </View>

        {/* Recent Orders Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Package size={18} color="#365314" />
              <Text style={styles.sectionTitle}>Recent Orders ({orders.length})</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/track-order')}>
              <Text style={styles.trackShortcutText}>Live Track 🚚</Text>
            </TouchableOpacity>
          </View>

          {orders.slice(0, 3).map((ord) => (
            <TouchableOpacity
              key={ord.id}
              style={styles.orderItemCard}
              onPress={() =>
                router.push({
                  pathname: '/track-order',
                  params: { orderNumber: ord.orderNumber },
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.orderItemTop}>
                <View>
                  <Text style={styles.orderNumber}>{ord.orderNumber}</Text>
                  <Text style={styles.orderDate}>{formatDateTime(ord.createdAt)}</Text>
                </View>
                <View
                  style={[
                    styles.orderStatusBadge,
                    ord.status === 'delivered' && styles.statusDelivered,
                    ord.status === 'out_for_delivery' && styles.statusOut,
                  ]}
                >
                  <Text
                    style={[
                      styles.orderStatusText,
                      ord.status === 'delivered' && styles.statusDeliveredText,
                      ord.status === 'out_for_delivery' && styles.statusOutText,
                    ]}
                  >
                    {ord.status.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItemsSummary}>
                <Text style={styles.orderItemsText} numberOfLines={1}>
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </Text>
                <Text style={styles.orderTotalText}>{formatPrice(ord.total)}</Text>
              </View>

              <View style={styles.trackPromptRow}>
                <Text style={styles.trackPromptText}>Tap to view 5-step live tracker</Text>
                <ChevronRight size={14} color="#365314" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Shortcuts */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setShowAddressModal(true)}
          >
            <MapPin size={18} color="#365314" />
            <Text style={styles.menuLabel}>Saved Delivery Addresses</Text>
            <ChevronRight size={16} color="#A8A29E" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(tabs)/favorites')}
          >
            <Heart size={18} color="#DC2626" />
            <Text style={styles.menuLabel}>My Favorites ({favoriteIds.length})</Text>
            <ChevronRight size={16} color="#A8A29E" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/health-benefits')}
          >
            <Sparkles size={18} color="#D97706" />
            <Text style={styles.menuLabel}>Himalayan Health & Superfood Guide</Text>
            <ChevronRight size={16} color="#A8A29E" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleCallSupport}
          >
            <Phone size={18} color="#365314" />
            <Text style={styles.menuLabel}>Direct Phone Support (+977 9713888002)</Text>
            <ChevronRight size={16} color="#A8A29E" />
          </TouchableOpacity>

          {isAuthenticated && (
            <>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuRow}
                onPress={handleLogout}
              >
                <LogOut size={18} color="#DC2626" />
                <Text style={[styles.menuLabel, { color: '#DC2626' }]}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Brand Guarantee footer */}
        <View style={styles.footerBranding}>
          <Text style={styles.footerTitle}>Nature's Mud Nepal</Text>
          <Text style={styles.footerSub}>Authentic Himalayan Harvest · Kathmandu & Pokhara Delivery</Text>
          <Text style={styles.footerVersion}>App Version 1.0.0 (Expo SDK 52)</Text>
        </View>
      </ScrollView>

      {/* Saved Addresses Modal */}
      <Modal visible={showAddressModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Addresses</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>

            {addresses.map((addr) => (
              <View key={addr.id} style={styles.addressCard}>
                <View style={styles.addressTitleRow}>
                  <Text style={styles.addressCardTitle}>{addr.title}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultPill}>
                      <Text style={styles.defaultPillText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressCardText}>{addr.address}</Text>
                <Text style={styles.addressCardPhone}>📞 {addr.phone}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => {
                Alert.alert('New Address', 'You can add additional addresses during checkout.');
              }}
            >
              <Plus size={16} color="#365314" />
              <Text style={styles.addAddressText}>Add New Delivery Address</Text>
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
  chatBtn: {
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 14,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#365314',
  },
  profileEmail: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    color: '#365314',
    fontWeight: '600',
    marginTop: 2,
  },
  guestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 14,
  },
  guestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  guestSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  guestButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  signInBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365314',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  registerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F4',
    paddingVertical: 10,
    borderRadius: 12,
  },
  registerBtnText: {
    color: '#1C1917',
    fontWeight: '600',
    fontSize: 13,
  },
  demoLoginBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  demoLoginLabel: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '600',
  },
  demoLoginChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  demoLoginChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  loyaltyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  loyaltyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loyaltyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  loyaltySub: {
    fontSize: 11,
    color: '#B45309',
  },
  loyaltyPointsBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  loyaltyPointsVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  trackShortcutText: {
    fontSize: 12,
    color: '#365314',
    fontWeight: '700',
  },
  orderItemCard: {
    backgroundColor: '#F5F5F4',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  orderItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1917',
  },
  orderDate: {
    fontSize: 11,
    color: '#78716C',
  },
  orderStatusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusOut: {
    backgroundColor: '#ECFCCB',
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  statusDeliveredText: {
    color: '#16A34A',
  },
  statusOutText: {
    color: '#365314',
  },
  orderItemsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemsText: {
    flex: 1,
    fontSize: 12,
    color: '#57534E',
    marginRight: 10,
  },
  orderTotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  trackPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    paddingTop: 6,
    marginTop: 2,
  },
  trackPromptText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365314',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1917',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F5F5F4',
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#365314',
  },
  footerSub: {
    fontSize: 11,
    color: '#78716C',
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 10,
    color: '#A8A29E',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
  },
  addressCard: {
    backgroundColor: '#F5F5F4',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  addressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  defaultPill: {
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#365314',
  },
  addressCardText: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 16,
  },
  addressCardPhone: {
    fontSize: 11,
    color: '#365314',
    fontWeight: '600',
    marginTop: 2,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFCCB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    marginTop: 6,
  },
  addAddressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365314',
  },
});