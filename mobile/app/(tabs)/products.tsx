import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react-native';
import { products as allProducts, categories as allCategories } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/store/cart-store';
import { toast } from '@/store/ui-store';

const { width: screenWidth } = Dimensions.get('window');
const COLUMN_WIDTH = (screenWidth - 36) / 2;

export default function ProductsScreen() {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.categorySlug === selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => (a.isFeatured ? -1 : 1));
    }

    return list;
  }, [selectedCategory, sortBy]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌿 Deep Emerald Header (Image 2) */}
      <View style={styles.header}>
        <View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Botanical Sanctuary · Image 2</Text>
          </View>
          <Text style={styles.headerTitle}>Himalayan Harvest</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts.length} single-origin superfoods on 3D pedestals
          </Text>
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => router.push('/search')}
        >
          <Search size={18} color="#A7F3D0" />
        </TouchableOpacity>
      </View>

      {/* 🏷️ Glassmorphic Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[styles.catPill, selectedCategory === 'all' && styles.catPillActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.catPillText,
                selectedCategory === 'all' && styles.catPillTextActive,
              ]}
            >
              All Harvest
            </Text>
          </TouchableOpacity>

          {allCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catPill, selectedCategory === cat.slug && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat.slug)}
            >
              <Text
                style={[
                  styles.catPillText,
                  selectedCategory === cat.slug && styles.catPillTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 🌿 3D Podium Products Grid (Image 2) */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: COLUMN_WIDTH }}>
            <ProductCard product={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 211, 153, 0.15)',
    backgroundColor: '#0A2216',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(167, 243, 208, 0.7)',
    marginTop: 2,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6, 78, 59, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  categoriesWrapper: {
    paddingVertical: 10,
    backgroundColor: '#0A2216',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 211, 153, 0.15)',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  catPillActive: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(167, 243, 208, 0.8)',
  },
  catPillTextActive: {
    color: '#041F13',
  },
  gridContent: {
    padding: 12,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});