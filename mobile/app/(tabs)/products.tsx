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
import { Search, Filter, Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { products as allProducts, categories as allCategories } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/store/cart-store';
import { toast } from '@/store/ui-store';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductsScreen() {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      weight: product.weight,
      category: product.category,
    });
    toast.success('Added to Cart', `${product.name} added.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Himalayan Harvest</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts.length} certified organic products
          </Text>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => router.push('/search')}
        >
          <Search size={20} color="#1C1917" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
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

      {/* Filter & Sort Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.resultsCount}>
          Showing {filteredProducts.length} items
        </Text>
        <View style={styles.sortChipsRow}>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'featured' && styles.sortChipActive]}
            onPress={() => setSortBy('featured')}
          >
            <Text style={[styles.sortChipText, sortBy === 'featured' && styles.sortChipTextActive]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'price_asc' && styles.sortChipActive]}
            onPress={() => setSortBy('price_asc')}
          >
            <Text style={[styles.sortChipText, sortBy === 'price_asc' && styles.sortChipTextActive]}>
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.productListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            variant="default"
            showQuickAdd
            onQuickAdd={() => handleQuickAdd(item)}
          />
        )}
      />
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
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F5F4',
  },
  catPillActive: {
    backgroundColor: '#365314',
  },
  catPillText: {
    fontSize: 13,
    color: '#57534E',
    fontWeight: '500',
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  sortChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#E7E5E4',
  },
  sortChipActive: {
    backgroundColor: '#D9F99D',
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  sortChipTextActive: {
    color: '#365314',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productListContent: {
    paddingBottom: 40,
  },
});