import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

// Mock admin stats (replace with real API)
const MOCK_STATS = {
  todayOrders: 24,
  todayRevenue: 48600,
  totalOrders: 1842,
  totalCustomers: 892,
  pendingOrders: 7,
  lowStockProducts: 3,
  monthRevenue: 842000,
  conversionRate: 4.2,
};

const RECENT_ORDERS = [
  { id: 'ORD-2401', customer: 'Aarav Sharma', amount: 1890, status: 'delivered', time: '2h ago' },
  { id: 'ORD-2400', customer: 'Priya Thapa', amount: 520, status: 'processing', time: '3h ago' },
  { id: 'ORD-2399', customer: 'Raj Gurung', amount: 2400, status: 'shipped', time: '5h ago' },
  { id: 'ORD-2398', customer: 'Sunita KC', amount: 750, status: 'pending', time: '6h ago' },
  { id: 'ORD-2397', customer: 'Mohan Rai', amount: 3200, status: 'delivered', time: '8h ago' },
];

const LOW_STOCK = [
  { name: 'Shilajit Resin 10g', stock: 4, sku: 'NM-SHI-10G' },
  { name: 'Wild Honey 500ml', stock: 7, sku: 'NM-HON-500' },
  { name: 'Moringa 100g', stock: 11, sku: 'NM-MOR-100' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '18' }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(MOCK_STATS);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('https://naturesmud.shop/api/admin/stats', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data || MOCK_STATS);
      }
    } catch {}
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>NaturesMud Control Panel</Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3826']} />}
      >
        {/* Today Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<ShoppingBag size={20} color="#1A3826" />}
              label="Orders Today"
              value={stats.todayOrders}
              sub="↑ 12% vs yesterday"
              color="#1A3826"
            />
            <StatCard
              icon={<DollarSign size={20} color="#7C3AED" />}
              label="Today's Revenue"
              value={`Rs. ${stats.todayRevenue.toLocaleString()}`}
              sub="↑ 8% vs yesterday"
              color="#7C3AED"
            />
            <StatCard
              icon={<Clock size={20} color="#F59E0B" />}
              label="Pending Orders"
              value={stats.pendingOrders}
              sub="Needs attention"
              color="#F59E0B"
            />
            <StatCard
              icon={<AlertTriangle size={20} color="#EF4444" />}
              label="Low Stock"
              value={stats.lowStockProducts}
              sub="Items below 15 units"
              color="#EF4444"
            />
          </View>
        </View>

        {/* Monthly Overview */}
        <View style={styles.monthCard}>
          <View style={styles.monthHeader}>
            <BarChart3 size={18} color="#1A3826" />
            <Text style={styles.monthTitle}>Monthly Overview</Text>
          </View>
          <View style={styles.monthStats}>
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>Rs. {(stats.monthRevenue / 1000).toFixed(0)}K</Text>
              <Text style={styles.monthStatLabel}>Revenue</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{stats.totalOrders.toLocaleString()}</Text>
              <Text style={styles.monthStatLabel}>Total Orders</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{stats.totalCustomers}</Text>
              <Text style={styles.monthStatLabel}>Customers</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{stats.conversionRate}%</Text>
              <Text style={styles.monthStatLabel}>Conversion</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { label: 'Orders', icon: <ShoppingBag size={22} color="#FFFFFF" />, color: '#1A3826', route: '/admin/orders' },
              { label: 'Products', icon: <Package size={22} color="#FFFFFF" />, color: '#7C3AED', route: '/admin/products' },
              { label: 'Customers', icon: <Users size={22} color="#FFFFFF" />, color: '#1D4ED8', route: '/admin/customers' },
              { label: 'Analytics', icon: <TrendingUp size={22} color="#FFFFFF" />, color: '#D97706', route: '/admin/dashboard' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.85}
              >
                {action.icon}
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/admin/orders' as any)}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_ORDERS.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderRow}
              onPress={() => router.push('/admin/orders' as any)}
              activeOpacity={0.85}
            >
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>Rs. {order.amount.toLocaleString()}</Text>
                <View style={[styles.statusPill, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>
                    {order.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Low Stock Alert */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Low Stock Alerts</Text>
            <TouchableOpacity onPress={() => router.push('/admin/products' as any)}>
              <Text style={styles.viewAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          {LOW_STOCK.map((item) => (
            <View key={item.sku} style={styles.stockRow}>
              <View style={styles.stockAlertDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stockName}>{item.name}</Text>
                <Text style={styles.stockSku}>{item.sku}</Text>
              </View>
              <View style={styles.stockBadge}>
                <Text style={styles.stockCount}>{item.stock} left</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  headerSub: { fontSize: 10, color: '#78716C', fontWeight: '600' },
  adminBadge: {
    backgroundColor: '#1A3826', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  adminBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: 12, fontWeight: '700', color: '#1A3826' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: (screenWidth - 42) / 2, backgroundColor: '#FFFFFF', borderRadius: 16,
    padding: 14, gap: 6, borderWidth: 1, borderColor: '#EAE3D6',
  },
  statIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#1A3826', marginTop: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#57534E' },
  statSub: { fontSize: 10, color: '#78716C' },

  monthCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 14,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  monthHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  monthStats: { flexDirection: 'row', justifyContent: 'space-around' },
  monthStat: { alignItems: 'center', gap: 4 },
  monthStatValue: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  monthStatLabel: { fontSize: 10, color: '#78716C', fontWeight: '600' },
  monthDivider: { width: 1, backgroundColor: '#EAE3D6' },

  actionsGrid: { flexDirection: 'row', gap: 10 },
  actionCard: {
    flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  orderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  orderId: { fontSize: 13, fontWeight: '800', color: '#1A3826' },
  orderCustomer: { fontSize: 11, color: '#78716C', marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontSize: 14, fontWeight: '800', color: '#1A3826' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },

  stockRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF5F5', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: '#FECACA',
  },
  stockAlertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  stockName: { fontSize: 13, fontWeight: '700', color: '#1A3826' },
  stockSku: { fontSize: 10, color: '#78716C', marginTop: 2 },
  stockBadge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  stockCount: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
});
