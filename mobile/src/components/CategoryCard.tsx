'use client';

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, Leaf, Mountain, Droplet, Sparkles, Seedling, Coffee, Heart, Package } from 'lucide-react-native';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'featured';
}

const categoryIcons: Record<string, any> = {
  'wild-honey': Leaf,
  'shilajit': Mountain,
  'superfoods': Seedling,
  'herbal-teas': Coffee,
  'baby-mother': Heart,
  'natural-sweeteners': Sparkles,
  'nuts-seeds': Droplet,
  'wellness-kits': Package,
};

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const IconComponent = categoryIcons[category.slug] || Leaf;
  const width = variant === 'featured' ? 160 : 140;

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={() => {}}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.iconContainer}>
          <IconComponent style={styles.icon} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>
          {category.productCount} product{category.productCount !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  icon: {
    color: '#FFFFFF',
  },
  content: {
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  count: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});