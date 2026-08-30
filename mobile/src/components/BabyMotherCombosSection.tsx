import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Baby, Heart, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { formatPrice } from '@/lib/utils';

const combos = [
  {
    id: 'baby-weaning-combo',
    name: 'Baby & Mother Wellness Bundle',
    description: "Pure Himalayan A2 cow ghee, raw acacia honey & herbal baby massage oil.",
    price: 3499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=400',
    badge: 'Pediatrician Recommended',
  },
];

export function BabyMotherCombosSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Baby size={14} color="#BE185D" />
          <Text style={styles.badgeText}>Baby & Mother Care</Text>
        </View>
        <Text style={styles.title}>Nurturing Nature's Tiniest</Text>
        <Text style={styles.subtitle}>Safe, 0 additive essentials for mother & baby.</Text>
      </View>

      {combos.map((combo) => (
        <View key={combo.id} style={styles.card}>
          <Image source={{ uri: combo.image }} style={styles.image} />
          <View style={styles.body}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeLabel}>{combo.badge}</Text>
            </View>
            <Text style={styles.name}>{combo.name}</Text>
            <Text style={styles.desc}>{combo.description}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(combo.price)}</Text>
              <Text style={styles.comparePrice}>{formatPrice(combo.originalPrice)}</Text>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.push('/(tabs)/products')}
            >
              <Text style={styles.btnText}>Explore Bundles</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE185D',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  subtitle: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  image: {
    width: '100%',
    height: 140,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BE185D',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  desc: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#365314',
  },
  comparePrice: {
    fontSize: 12,
    color: '#A8A29E',
    textDecorationLine: 'line-through',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365314',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});