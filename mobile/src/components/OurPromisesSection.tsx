'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import { Leaf, ShieldCheck, Truck, Recycle, Heart, Sparkles, Award, CheckCircle2, Users, Droplets, Zap, Star } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const promises = [
  {
    id: 'pure-himalayan',
    title: 'Pure Himalayan Sourcing',
    description: 'Every product originates from certified organic farms above 3,000m in the pristine Himalayan foothills — no middlemen, no compromises.',
    icon: Leaf,
    color: '#365314',
    bgColor: '#F5F7EF',
    stats: ['180+ Certified Farms', '3,000m+ Altitude', 'Direct Farm Partnerships'],
  },
  {
    id: 'certified-organic',
    title: '100% Certified Organic',
    description: 'Rigorously tested and certified by Nepal Organic Certification Body (NOCB) and international standards — zero pesticides, zero synthetic additives.',
    icon: ShieldCheck,
    color: '#059669',
    bgColor: '#ECFDF5',
    stats: ['NOCB Certified', 'USDA NOP Compliant', 'Third-Party Lab Tested'],
  },
  {
    id: 'farm-fresh',
    title: 'Farm-to-Door Freshness',
    description: 'Harvested at peak potency and delivered within 72 hours through our cold-chain logistics — preserving nutrients, flavor, and vitality.',
    icon: Truck,
    color: '#D9A441',
    bgColor: '#FEFCE8',
    stats: ['72-Hour Delivery', 'Cold-Chain Logistics', 'Temperature Controlled'],
  },
  {
    id: 'eco-packaging',
    title: 'Zero-Waste Packaging',
    description: 'Plastic-free, compostable, and recyclable packaging made from plant fibers — protecting the Himalayas we source from.',
    icon: Recycle,
    color: '#65A30D',
    bgColor: '#F7FEE7',
    stats: ['100% Plastic-Free', 'Home Compostable', 'Plant-Fiber Materials'],
  },
  {
    id: 'fair-trade',
    title: 'Fair Trade & Farmer Welfare',
    description: 'Above-market prices paid directly to farming families — funding education, healthcare, and sustainable agriculture in mountain communities.',
    icon: Users,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    stats: ['2,500+ Farm Families', 'Fair Price Guarantee', 'Community Development'],
  },
  {
    id: 'satisfaction',
    title: 'Love It or Return It',
    description: 'If you\'re not completely satisfied with any product, return it within 30 days for a full refund — no questions asked.',
    icon: Heart,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    stats: ['30-Day Returns', 'Full Refund', 'Free Return Shipping'],
  },
];

export function OurPromisesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (screenWidth - 40));
    if (index >= 0 && index < promises.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Sparkles style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Our Promises</Text>
          </View>
          <Text style={styles.title}>Six Promises, One Purpose</Text>
          <Text style={styles.subtitle}>
            Unwavering commitments that guide every decision — from farm to your family
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.decorativeLeaf}>
            <Leaf style={styles.leafIcon} />
          </View>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth - 40}
        decelerationRate="fast"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      >
        {promises.map((promise, index) => (
          <TouchableOpacity
            key={promise.id}
            style={[styles.card, { borderColor: index === activeIndex ? promise.color : 'rgba(43, 43, 43, 0.1)' }]}
            onPress={() => setActiveIndex(index)}
            activeOpacity={0.95}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: promise.bgColor }]}>
                <promise.icon style={[styles.icon, { color: promise.color }]} />
              </View>

              <View style={styles.textContent}>
                <Text style={styles.promiseTitle}>{promise.title}</Text>
                <Text style={styles.promiseDesc}>{promise.description}</Text>
              </View>

              <View style={styles.statsContainer}>
                {promise.stats.map((stat, i) => (
                  <View key={i} style={styles.statItem}>
                    <CheckCircle2 style={[styles.statIcon, { color: promise.color }]} />
                    <Text style={styles.statText}>{stat}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Active indicator */}
            <Animated.View
              style={[
                styles.activeIndicator,
                { backgroundColor: promise.color },
                { transform: [{ translateX: scrollX.interpolate({ inputRange: [index * (screenWidth - 40), (index + 1) * (screenWidth - 40)], outputRange: [0, screenWidth - 40] }) }] },
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {promises.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
              { backgroundColor: index === activeIndex ? promises[activeIndex].color : 'rgba(43, 43, 43, 0.2)' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 20,
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F7EF',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeIcon: {
    color: '#365314',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    fontSize: 22,
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
  headerRight: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    color: '#365314',
  },
  carousel: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  carouselContent: {
    gap: 16,
    paddingBottom: 8,
  },
  card: {
    width: screenWidth - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardContent: {
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
  },
  textContent: {
    gap: 8,
  },
  promiseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  promiseDesc: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    gap: 10,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 18,
    height: 18,
  },
  statText: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
});