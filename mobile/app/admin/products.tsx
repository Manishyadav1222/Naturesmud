import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Image, RefreshControl, Alert, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Edit3, Package, AlertTriangle } from 'lucide-react-native';
import { products as allProducts } from '@/lib/data/products';

export default function AdminProductsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(
    allProducts.map((p) => ({ ...p, isActive: true, stock: Math.floor(Math.random() * 80) + 5 }))
  );

  const filtered = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleEdit = (product: any) => {
    Alert.alert('Edit Product', `Open editor for: ${product.name}\n\nThis would open a full product edit form.`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const lowStock = products.filter((p) => p.stock < 15).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{products.filter((p) => p.isActive).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={[styles.statItem, lowStock > 0 && styles.lowStockItem]}>
          <Text style={[styles.statValue, lowStock > 0 && styles.lowStockValue]}>{lowStock}</Text>
          <Text style={[styles.statLabel, lowStock > 0 && styles.lowStockLabel]}>Low Stock</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={16} color="#78716C" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search products..."
          placeholderTextColor="#A8A29E"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3826']} />}
      >
        {filtered.map((product) => (
          <View key={product.id} style={[styles.productCard, !product.isActive && styles.productCardInactive]}>
            <Image source={{ uri: product.image }} style={styles.productImg} resizeMode="cover" />
            <View style={styles.productBody}>
              <View style={styles.productTopRow}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <Switch
                  value={product.isActive}
                  onValueChange={() => toggleActive(product.id)}
                  trackColor={{ false: '#D6D3D1', true: '#BBF7D0' }}
                  thumbColor={product.isActive ? '#15803D' : '#78716C'}
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              </View>
              <Text style={styles.productCategory}>{product.category}</Text>
              <View style={styles.productMetaRow}>
                <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
                <View style={[
                  styles.stockBadge,
                  product.stock < 15 ? styles.stockLow : styles.stockOk,
                ]}>
                  {product.stock < 15 && <AlertTriangle size={10} color="#DC2626" />}
                  <Text style={[styles.stockText, product.stock < 15 && styles.stockTextLow]}>
                    {product.stock} units
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(product)}>
              <Edit3 size={16} color="#1A3826" />
            </TouchableOpacity>
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
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1A3826', justifyContent: 'center', alignItems: 'center',
  },
  statsStrip: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingVertical: 12, paddingHorizontal: 20, justifyContent: 'space-around',
    borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#78716C' },
  statDivider: { width: 1, backgroundColor: '#EAE3D6' },
  lowStockItem: {},
  lowStockValue: { color: '#DC2626' },
  lowStockLabel: { color: '#DC2626' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 12, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1C1917' },
  scrollContent: { padding: 12, gap: 10, paddingBottom: 40 },
  productCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', gap: 12, padding: 10,
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  productCardInactive: { opacity: 0.6 },
  productImg: { width: 60, height: 60, borderRadius: 12 },
  productBody: { flex: 1, gap: 3 },
  productTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1A3826' },
  productCategory: { fontSize: 10, color: '#78716C', fontWeight: '600' },
  productMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#1A3826' },
  stockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  stockOk: { backgroundColor: '#DCFCE7' },
  stockLow: { backgroundColor: '#FEE2E2' },
  stockText: { fontSize: 10, fontWeight: '700', color: '#15803D' },
  stockTextLow: { color: '#DC2626' },
  editBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
});
