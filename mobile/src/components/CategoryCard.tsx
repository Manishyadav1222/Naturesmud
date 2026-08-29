import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf, Mountain, Droplet, Sparkles, Coffee, Heart, Package } from 'lucide-react-native';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'featured';
}

const categoryIcons: Record<string, any> = {
  'wild-honey': Leaf,
  'shilajit': Mountain,
  'superfoods': Sparkles,
  'herbal-teas': Coffee,
  'baby-mother': Heart,
  'natural-sweeteners': Sparkles,
  'nuts-seeds': Droplet,
  'wellness-kits': Package,
};

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const router = useRouter();
  const IconComponent = categoryIcons[category.slug] || Leaf;
  const width = variant === 'featured' ? 160 : 130;

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={() => router.push('/(tabs)/products')}
      activeOpacity={0.88}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.iconContainer}>
          <IconComponent size={22} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
        <Text style={styles.count}>
          {category.productCount || 4} Products
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
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1.1,
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
    textAlign: 'center',
  },
  count: {
    fontSize: 11,
    color: '#78716C',
    textAlign: 'center',
  },
});