'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useUIStore } from '@/store/ui-store';
import type { Product, Category } from '@/types';
import { products as staticProducts, normalizeProduct, categories as staticCategories } from '@/lib/data/products';
import { Filter, ChevronDown, Search, X } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductsScreen() {
  const router = useRouter();
  const { openSearch } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [showSort, setShowSort] = useState(false);

  const { data: productsData } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { per_page: 100 } });
      return res.data.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data;
    },
  });

  const allProducts = productsData
    ? productsData.map((p: any) => normalizeProduct(p))
    : staticProducts;

  const categoriesList = categoriesData || staticCategories;

  const filteredProducts = allProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.categorySlug === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.isFeatured ? -1 : 1;
      default: return a.isFeatured ? -1 : 1;
    }
  });

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>All Products</Text>
          <Text style={styles.subtitle}>{sortedProducts.length} products available</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={openSearch}>
          <Search style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollReveal direction="up" distance={20}>
        <View style={styles.categoryFilter}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContent}>
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}>All</Text>
            </TouchableOpacity>
            {categoriesList.map((cat) => (
              <TouchableOpacity
                key={cat.slug}
                style={[styles.categoryChip, selectedCategory === cat.slug && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.slug)}
              >
                <Text style={[styles.categoryChipText, selectedCategory === cat.slug && styles.categoryChipTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollReveal>

      {/* Sort & Results */}
      <ScrollReveal direction="up" distance={20} delay={100}>
        <View style={styles.toolbar}>
          <Text style={styles.resultsText}>{sortedProducts.length} products</Text>
          <TouchableOpacity style={styles.sortButton} onPress={() => setShowSort(!showShow)}>
            <Text style={styles.sortButtonText}>{sortOptions.find(o => o.value === sortBy)?.label}</Text>
            <ChevronDown style={[styles.sortIcon, showSort && styles.sortIconRotated]} />
          </TouchableOpacity>
        </View>
      </ScrollReveal>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={styles.sortDropdownOverlay} onTouchStart={() => setShowSort(false)}>
          <View style={styles.sortDropdown}>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sortOption, sortBy === opt.value && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy(opt.value as any);
                  setShowSort(false);
                }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.value && styles.sortOptionTextActive]}>{opt.label}</Text>
                {sortBy === opt.value && <Check style={styles.checkIcon} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Products Grid */}
      <ScrollReveal direction="up" distance={20} delay={200}>
        {sortedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Filter style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your filters or search</Text>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={() => { setSelectedCategory('all'); setSortBy('featured'); }}>
              <X style={styles.clearIcon} />
              <Text style={styles.clearText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </ScrollReveal>

      {/* Load More / Pagination placeholder */}
      {sortedProducts.length > 20 && (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Products</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    color: '#2B2B2B',
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    gap: 10,
    paddingBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: '#365314',
    borderColor: '#365314',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  sortIcon: {
    color: '#2B2B2B',
  },
  sortIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  sortDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  sortDropdown: {
    position: 'absolute',
    top: 60,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    minWidth: 200,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortOptionActive: {
    backgroundColor: '#F5F7EF',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2B2B2B',
    fontFamily: 'Inter_500Medium',
  },
  sortOptionTextActive: {
    color: '#365314',
    fontWeight: '600',
  },
  checkIcon: {
    color: '#365314',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyIcon: {
    color: '#2B2B2B',
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#F5F7EF',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  clearIcon: {
    color: '#365314',
  },
  clearText: {
    color: '#365314',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  loadMoreText: {
    color: '#2B2B2B',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});