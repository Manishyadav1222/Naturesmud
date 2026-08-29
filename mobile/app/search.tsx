import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, ArrowLeft, Clock, SlidersHorizontal, Sparkles } from 'lucide-react-native';
import { products as allProducts, categories as allCategories } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import { toast } from '@/store/ui-store';

const { width: screenWidth } = Dimensions.get('window');

export default function SearchScreen() {
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useUIStore();
  const { addItem } = useCartStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = allProducts;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

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
    }

    return list;
  }, [query, selectedCategory, sortBy]);

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  };

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
    toast.success('Added to Cart', `${product.name} has been added.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1C1917" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Search size={18} color="#78716C" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Shilajit, Honey, Ghee, Herbs..."
            placeholderTextColor="#A8A29E"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <X size={16} color="#78716C" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'all', slug: 'all', name: 'All Harvest' }, ...allCategories]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryPillsList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.slug;
            return (
              <TouchableOpacity
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(item.slug)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Recent Searches (Show when query is empty) */}
      {!query && recentSearches.length > 0 && (
        <View style={styles.recentWrapper}>
          <View style={styles.recentHeader}>
            <View style={styles.recentHeaderTitle}>
              <Clock size={15} color="#78716C" />
              <Text style={styles.recentTitle}>Recent Searches</Text>
            </View>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearRecentText}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentChips}>
            {recentSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentChip}
                onPress={() => setQuery(term)}
              >
                <Text style={styles.recentChipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results Header */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCount}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
        </Text>
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'featured' && styles.sortBtnActive]}
            onPress={() => setSortBy('featured')}
          >
            <Text style={[styles.sortText, sortBy === 'featured' && styles.sortTextActive]}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price_asc' && styles.sortBtnActive]}
            onPress={() => setSortBy('price_asc')}
          >
            <Text style={[styles.sortText, sortBy === 'price_asc' && styles.sortTextActive]}>Price ↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'rating' && styles.sortBtnActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>Rating</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Sparkles size={40} color="#365314" />
            <Text style={styles.emptyTitle}>No matching harvest found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with keywords like "Shilajit", "Honey", "Ghee", or "Tea".
            </Text>
          </View>
        }
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1917',
  },
  clearBtn: {
    padding: 4,
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  categoryPillsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F5F4',
  },
  categoryPillActive: {
    backgroundColor: '#365314',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#57534E',
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recentWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  clearRecentText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  recentChipText: {
    fontSize: 12,
    color: '#292524',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E7E5E4',
  },
  sortBtnActive: {
    backgroundColor: '#D9F99D',
  },
  sortText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57534E',
  },
  sortTextActive: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 18,
  },
});
