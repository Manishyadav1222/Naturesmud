import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, RefreshControl, Image, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Phone, MessageCircle, ChevronRight, Star, ShoppingBag } from 'lucide-react-native';

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Aarav Sharma', email: 'aarav@email.com', phone: '+977 9841234567', orders: 12, totalSpent: 24600, loyaltyPoints: 340, location: 'Kathmandu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', joinedAt: '2025-01-15' },
  { id: 'c2', name: 'Priya Thapa', email: 'priya@email.com', phone: '+977 9801234567', orders: 7, totalSpent: 13400, loyaltyPoints: 180, location: 'Pokhara', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', joinedAt: '2025-03-20' },
  { id: 'c3', name: 'Raj Gurung', email: 'raj@email.com', phone: '+977 9861234567', orders: 23, totalSpent: 51200, loyaltyPoints: 890, location: 'Biratnagar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', joinedAt: '2024-11-08' },
  { id: 'c4', name: 'Sunita KC', email: 'sunita@email.com', phone: '+977 9821234567', orders: 4, totalSpent: 7800, loyaltyPoints: 90, location: 'Jhapa', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100', joinedAt: '2026-01-02' },
  { id: 'c5', name: 'Himalayan Organic Mart', email: 'partner@himalayanmart.np', phone: '+977 9801987654', orders: 156, totalSpent: 842000, loyaltyPoints: 1250, location: 'Kathmandu', avatar: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=100', joinedAt: '2024-09-01' },
  { id: 'c6', name: 'Krishna Shrestha', email: 'krishna@email.com', phone: '+977 9841111111', orders: 9, totalSpent: 18300, loyaltyPoints: 220, location: 'Bhaktapur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', joinedAt: '2025-06-14' },
];

export default function AdminCustomersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'orders' | 'spent' | 'joined'>('spent');

  const filtered = MOCK_CUSTOMERS
    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'orders') return b.orders - a.orders;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    });

  const totalRevenue = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = Math.round(totalRevenue / MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0));

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customers</Text>
        <Text style={styles.headerCount}>{MOCK_CUSTOMERS.length}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_CUSTOMERS.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Rs. {(totalRevenue / 1000).toFixed(0)}K</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Rs. {avgOrderValue}</Text>
          <Text style={styles.statLabel}>Avg Order</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search size={16} color="#78716C" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, phone, location..."
          placeholderTextColor="#A8A29E"
        />
      </View>

      {/* Sort Row */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['spent', 'orders', 'joined'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sortChip, sortBy === s && styles.sortChipActive]}
            onPress={() => setSortBy(s)}
          >
            <Text style={[styles.sortChipText, sortBy === s && styles.sortChipTextActive]}>
              {s === 'spent' ? 'Revenue' : s === 'orders' ? 'Orders' : 'Newest'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3826']} />}
      >
        {filtered.map((customer, idx) => (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.customerTop}>
              <Image source={{ uri: customer.avatar }} style={styles.avatar} />
              <View style={styles.customerInfo}>
                <View style={styles.customerNameRow}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  {idx === 0 && <View style={styles.topBadge}><Text style={styles.topBadgeText}>Top</Text></View>}
                </View>
                <Text style={styles.customerLocation}>{customer.location} · Since {customer.joinedAt.slice(0, 7)}</Text>
                <Text style={styles.customerEmail}>{customer.email}</Text>
              </View>
            </View>

            <View style={styles.customerStats}>
              <View style={styles.cStat}>
                <ShoppingBag size={13} color="#1A3826" />
                <Text style={styles.cStatValue}>{customer.orders}</Text>
                <Text style={styles.cStatLabel}>orders</Text>
              </View>
              <View style={styles.cStatDivider} />
              <View style={styles.cStat}>
                <Text style={styles.cStatValue}>Rs. {(customer.totalSpent / 1000).toFixed(1)}K</Text>
                <Text style={styles.cStatLabel}>spent</Text>
              </View>
              <View style={styles.cStatDivider} />
              <View style={styles.cStat}>
                <Star size={13} color="#D97706" />
                <Text style={styles.cStatValue}>{customer.loyaltyPoints}</Text>
                <Text style={styles.cStatLabel}>pts</Text>
              </View>
            </View>

            <View style={styles.customerActions}>
              <TouchableOpacity
                style={styles.waBtn}
                onPress={() => {
                  const msg = `Namaste ${customer.name}! From NaturesMud Nepal — `;
                  Linking.openURL(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`).catch(() => {});
                }}
              >
                <MessageCircle size={14} color="#FFFFFF" />
                <Text style={styles.waBtnText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${customer.phone}`).catch(() => {})}
              >
                <Phone size={14} color="#1A3826" />
                <Text style={styles.callBtnText}>{customer.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '900', color: '#1A3826' },
  headerCount: {
    backgroundColor: '#1A3826', color: '#FFFFFF', fontSize: 12,
    fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 12,
    justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#78716C' },
  statDivider: { width: 1, backgroundColor: '#EAE3D6', marginVertical: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 12, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1C1917' },
  sortRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingBottom: 10,
  },
  sortLabel: { fontSize: 12, color: '#78716C', fontWeight: '600' },
  sortChip: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  sortChipActive: { backgroundColor: '#1A3826', borderColor: '#1A3826' },
  sortChipText: { fontSize: 11, fontWeight: '600', color: '#78716C' },
  sortChipTextActive: { color: '#FFFFFF' },
  scrollContent: { padding: 12, gap: 10, paddingBottom: 40 },
  customerCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 12,
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  customerTop: { flexDirection: 'row', gap: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  customerInfo: { flex: 1, gap: 2 },
  customerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  customerName: { fontSize: 14, fontWeight: '800', color: '#1A3826', flex: 1 },
  topBadge: { backgroundColor: '#FEF9C3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  topBadgeText: { fontSize: 9, fontWeight: '800', color: '#B45309' },
  customerLocation: { fontSize: 11, color: '#78716C' },
  customerEmail: { fontSize: 11, color: '#A8A29E' },
  customerStats: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: '#FAFAF9', borderRadius: 12, padding: 10,
  },
  cStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cStatValue: { fontSize: 13, fontWeight: '800', color: '#1A3826' },
  cStatLabel: { fontSize: 10, color: '#78716C' },
  cStatDivider: { width: 1, backgroundColor: '#EAE3D6' },
  customerActions: { flexDirection: 'row', gap: 8 },
  waBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: '#25D366', borderRadius: 10, paddingVertical: 8,
  },
  waBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  callBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: '#F0EDE7', borderRadius: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  callBtnText: { fontSize: 11, fontWeight: '600', color: '#1A3826' },
});
