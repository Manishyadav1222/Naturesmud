import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Leaf, ShieldCheck, Truck, Recycle, Heart, Sparkles, CheckCircle2, Users } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const promises = [
  {
    id: 'pure-himalayan',
    title: 'Pure Himalayan Sourcing',
    description: 'Every product originates from pesticide-free partner farms above 3,000m in the pristine Himalayan foothills — no middlemen, no compromises.',
    icon: Leaf,
    color: '#365314',
    bgColor: '#F5F7EF',
    stats: ['180+ Partner Farms', '3,000m+ Altitude', 'Direct Farm Partnerships'],
  },
  {
    id: 'zero-additives',
    title: '0 Additives · 0 Preservatives',
    description: 'Rigorously tested for absolute purity — 0 synthetic chemicals, 0 preservatives, 0 artificial additives, and 0 added sugar.',
    icon: ShieldCheck,
    color: '#059669',
    bgColor: '#ECFDF5',
    stats: ['0% Additives', '0% Preservatives', 'Third-Party Lab Tested'],
  },
  {
    id: 'farm-fresh',
    title: 'Farm-to-Door Freshness',
    description: 'Harvested at peak potency and delivered through our cold-chain logistics — preserving nutrients, flavor, and vitality.',
    icon: Truck,
    color: '#D9A441',
    bgColor: '#FEFCE8',
    stats: ['Fast Nepal Delivery', 'Eco-Packaging', 'Fresh Sealed'],
  },
];

export function OurPromisesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#365314" />
          <Text style={styles.badgeText}>Our Guarantees</Text>
        </View>
        <Text style={styles.title}>Promises Guided by Nature</Text>
        <Text style={styles.subtitle}>
          Unwavering commitments that guide every harvest — from high mountain farms to your family.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      >
        {promises.map((promise, index) => (
          <View
            key={promise.id}
            style={[styles.card, { borderColor: index === activeIndex ? promise.color : '#E7E5E4' }]}
          >
            <View style={[styles.iconContainer, { backgroundColor: promise.bgColor }]}>
              <promise.icon size={26} color={promise.color} />
            </View>

            <Text style={styles.promiseTitle}>{promise.title}</Text>
            <Text style={styles.promiseDesc}>{promise.description}</Text>

            <View style={styles.statsContainer}>
              {promise.stats.map((stat, i) => (
                <View key={i} style={styles.statItem}>
                  <CheckCircle2 size={14} color={promise.color} />
                  <Text style={styles.statText}>{stat}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
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
  carouselContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: screenWidth * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    gap: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promiseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  promiseDesc: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 18,
  },
  statsContainer: {
    gap: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 11,
    color: '#292524',
    fontWeight: '500',
  },
});