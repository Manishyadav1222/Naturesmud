import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  Phone,
  RefreshCw,
} from 'lucide-react-native';
import { Linking } from 'react-native';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending:    { bg: '#FEF9C3', text: '#B45309', border: '#FDE68A' },
  processing: { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  shipped:    { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' },
  delivered:  { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  cancelled:  { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending:    <Clock size={14} color="#B45309" />,
  processing: <RefreshCw size={14} color="#1D4ED8" />,
  shipped:    <Truck size={14} color="#7C3AED" />,
  delivered:  <CheckCircle2 size={14} color="#15803D" />,
  cancelled:  <XCircle size={14} color="#DC2626" />,
};

const MOCK_ORDERS = [
  { id: 'ORD-2401', customer: 'Aarav Sharma', phone: '+977 9841234567', amount: 1890, status: 'delivered', items: ['Shilajit 10g', 'Dates Powder 100g'], date: '2026-09-02', address: 'Thamel, Kathmandu' },
  { id: 'ORD-2400', customer: 'Priya Thapa', phone: '+977 9801234567', amount: 520, status: 'processing', items: ['Chia Seeds 250g'], date: '2026-09-02', address: 'Lakeside, Pokhara' },
  { id: 'ORD-2399', customer: 'Raj Gurung', phone: '+977 9861234567', amount: 2400, status: 'shipped', items: ['Morning Ritual Bundle'], date: '2026-09-01', address: 'New Baneshwor, Kathmandu' },
  { id: 'ORD-2398', customer: 'Sunita KC', phone: '+977 9821234567', amount: 750, status: 'pending', items: ['Royal Cashews 150g', 'Cranberries 100g'], date: '2026-09-01', address: 'Birtamod, Jhapa' },
  { id: 'ORD-2397', customer: 'Mohan Rai', phone: '+977 9811234567', amount: 3200, status: 'delivered', items: ['Fitness Warrior Kit'], date: '2026-08-31', address: 'Dharan, Sunsari' },
  { id: 'ORD-2396', customer: 'Anita Sharma', phone: '+977 9851234567', amount: 430, status: 'cancelled', items: ['Beetroot Powder 100g'], date: '2026-08-31', address: 'Biratnagar, Morang' },
  { id: 'ORD-2395', customer: 'Krishna Shrestha', phone: '+977 9841111111', amount: 1350, status: 'shipped', items: ['Baby Nutrition Pack'], date: '2026-08-30', address: 'Bhaktapur' },
];

export default function AdminOrdersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('https://naturesmud.shop/api/admin/orders', { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.length) setOrders(data.data);
      }
    } catch {}
    setRefreshing(false);
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter.toLowerCase();
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetch(`https://naturesmud.shop/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdatingId(null);
  };

  const handleWhatsApp = (phone: string, orderId: string) => {
    const msg = `Namaste! Regarding your NaturesMud order ${orderId} — `;
    Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`).catch(() => {});
  };

  const NEXT_STATUS: Record<string, string> = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerCount}>{filtered.length}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search size={16} color="#78716C" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by order ID or customer..."
          placeholderTextColor="#A8A29E"
        />
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, statusFilter === s && styles.filterChipActive]}
            onPress={() => setStatusFilter(s)}
          >
            <Text style={[styles.filterChipText, statusFilter === s && styles.filterChipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3826']} />}
      >
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={40} color="#D6D3D1" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        )}

        {filtered.map((order) => {
          const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          const isExpanded = expandedId === order.id;
          const nextStatus = NEXT_STATUS[order.status];

          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => setExpandedId(isExpanded ? null : order.id)}
              activeOpacity={0.88}
            >
              {/* Order Header Row */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                  {STATUS_ICONS[order.status]}
                  <Text style={[styles.statusText, { color: sc.text }]}>{order.status}</Text>
                </View>
              </View>

              {/* Customer & Amount */}
              <View style={styles.orderMeta}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderAmount}>Rs. {order.amount.toLocaleString()}</Text>
              </View>

              {/* Items */}
              <Text style={styles.orderItems}>{order.items.join(', ')}</Text>

              {/* Expanded Actions */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressLabel}>Ship to:</Text>
                    <Text style={styles.addressText}>{order.address}</Text>
                  </View>

                  <View style={styles.actionRow}>
                    {/* WhatsApp Customer */}
                    <TouchableOpacity
                      style={styles.waBtn}
                      onPress={() => handleWhatsApp(order.phone, order.id)}
                    >
                      <MessageCircle size={15} color="#FFFFFF" />
                      <Text style={styles.waBtnText}>WhatsApp</Text>
                    </TouchableOpacity>

                    {/* Call Customer */}
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Linking.openURL(`tel:${order.phone}`).catch(() => {})}
                    >
                      <Phone size={15} color="#1A3826" />
                      <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>

                    {/* Advance Status */}
                    {nextStatus && (
                      <TouchableOpacity
                        style={styles.advanceBtn}
                        onPress={() => {
                          Alert.alert(
                            'Update Status',
                            `Mark ${order.id} as "${nextStatus}"?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Update', onPress: () => updateStatus(order.id, nextStatus) },
                            ]
                          );
                        }}
                      >
                        {updatingId === order.id
                          ? <ActivityIndicator size="small" color="#FFFFFF" />
                          : <Text style={styles.advanceBtnText}>Mark as {nextStatus} →</Text>
                        }
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              <ChevronRight
                size={16}
                color="#78716C"
                style={{ alignSelf: 'flex-end', transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          );
        })}
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
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 12, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1C1917' },
  filterRow: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  filterChipActive: { backgroundColor: '#1A3826', borderColor: '#1A3826' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#78716C' },
  filterChipTextActive: { color: '#FFFFFF' },
  scrollContent: { padding: 12, gap: 10, paddingBottom: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#78716C', fontWeight: '600' },
  orderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, gap: 8,
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 14, fontWeight: '800', color: '#1A3826' },
  orderDate: { fontSize: 11, color: '#78716C', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderCustomer: { fontSize: 14, fontWeight: '700', color: '#292524' },
  orderAmount: { fontSize: 15, fontWeight: '900', color: '#1A3826' },
  orderItems: { fontSize: 12, color: '#78716C' },
  expandedSection: { gap: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  addressRow: { flexDirection: 'row', gap: 6 },
  addressLabel: { fontSize: 12, fontWeight: '700', color: '#78716C' },
  addressText: { fontSize: 12, color: '#292524', flex: 1 },
  actionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  waBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#25D366', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  waBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F0EDE7', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  callBtnText: { fontSize: 12, fontWeight: '700', color: '#1A3826' },
  advanceBtn: {
    backgroundColor: '#1A3826', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  advanceBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});
