'use client';

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Dumbbell, Sunrise, Heart, Brain, Sparkles, Star, Leaf, ShieldCheck, ArrowRight } from 'lucide-react-native';

const campaigns = [
  {
    id: 'gym-performance',
    name: 'Gym Performance Stack',
    theme: 'Pre & Post Workout',
    description: 'Clean energy, faster recovery, natural muscle support',
    price: 3999,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    icon: Dumbbell,
    iconColor: '#EF4444',
    badge: 'Athletes\' Choice',
    color: 'bg-red-50',
    products: ['Shilajit Resin 20g', 'Moringa Powder 100g', 'Chia Seeds 200g', 'Dates Powder 200g'],
  },
  {
    id: 'morning-ritual',
    name: 'Morning Vitality Ritual',
    theme: 'Daily Wellness Routine',
    description: 'Start your day with Himalayan superfoods for sustained energy',
    price: 2999,
    originalPrice: 3699,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    icon: Sunrise,
    iconColor: '#D9A441',
    badge: 'Most Popular',
    color: 'bg-yellow-50',
    products: ['Wild Honey 500g', 'Turmeric Latte 100g', 'Amla Powder 100g', 'Green Tea 50g'],
  },
  {
    id: 'total-health',
    name: 'Total Health Transformation',
    theme: 'Complete Family Wellness',
    description: 'Comprehensive nutrition for immunity, digestion & vitality',
    price: 5999,
    originalPrice: 7499,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    icon: Heart,
    iconColor: '#EC4899',
    badge: 'Best Value',
    color: 'bg-pink-50',
    products: ['Shilajit 20g', 'Moringa 100g', 'Honey 500g', 'Chia 200g', 'Almonds 250g', 'Turmeric 100g'],
  },
  {
    id: 'focus-clarity',
    name: 'Focus & Clarity Bundle',
    theme: 'Brain Health & Memory',
    description: 'Adaptogens & nootropics for mental performance',
    price: 3499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1518841904640-138458322969?w=400',
    icon: Brain,
    iconColor: '#8B5CF6',
    badge: 'Students & Pros',
    color: 'bg-purple-50',
    products: ['Shilajit Resin 20g', 'Brahmi Powder 50g', 'Ashwagandha 100g', 'Walnut Kernels 100g'],
  },
  {
    id: 'festive-tihar',
    name: 'Tihar Festival Hamper',
    theme: 'Festive Gifting Special',
    description: 'Premium hampers for Laxmi Puja & Bhai Tika celebrations',
    price: 4499,
    originalPrice: 5499,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    icon: Sparkles,
    iconColor: '#F97316',
    badge: 'Limited Edition',
    color: 'bg-orange-50',
    products: ['Premium Dry Fruits 1kg', 'Wild Honey 500g', 'Saffron 1g', 'Ghee 500ml', 'Dates 500g'],
  },
];

export function CampaignCombosShowcaseSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Star style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Special Campaigns</Text>
          </View>
          <Text style={styles.title}>Curated Combos for Every Goal</Text>
          <Text style={styles.subtitle}>
            Expertly crafted bundles targeting specific health goals — save up to 25%
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.decorativeSparkle}>
            <Sparkles style={styles.sparkleIcon} />
          </View>
        </View>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.campaignsScroll}>
        {campaigns.map((campaign) => (
          <TouchableOpacity key={campaign.id} style={styles.campaignCard} activeOpacity={0.95}>
            <View style={styles.campaignImageContainer}>
              <Image source={{ uri: campaign.image }} style={styles.campaignImage} />
              <View style={[styles.campaignBadge, { backgroundColor: campaign.iconColor + '20' }]}>
                <Text style={[styles.campaignBadgeText, { color: campaign.iconColor }]}>{campaign.badge}</Text>
              </View>
            </View>

            <View style={styles.campaignContent}>
              <View style={styles.campaignIconContainer}>
                <campaign.icon style={[styles.campaignIcon, { color: campaign.iconColor }]} />
              </View>

              <Text style={styles.campaignTheme}>{campaign.theme}</Text>
              <Text style={styles.campaignName}>{campaign.name}</Text>
              <Text style={styles.campaignDesc}>{campaign.description}</Text>

              <View style={styles.campaignPriceRow}>
                <Text style={styles.campaignPrice}>Rs. {campaign.price.toLocaleString()}</Text>
                <Text style={styles.campaignOriginalPrice}>Rs. {campaign.originalPrice.toLocaleString()}</Text>
              </View>

              <Text style={styles.campaignSavings}>Save Rs. {campaign.originalPrice - campaign.price} ({(Math.round((campaign.originalPrice - campaign.price) / campaign.originalPrice * 100))}% OFF)</Text>

              <View style={styles.campaignFeatures}>
                {campaign.products.slice(0, 3).map((product, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={[styles.featureDot, { backgroundColor: campaign.iconColor }]} />
                    <Text style={styles.featureText}>{product}</Text>
                  </View>
                ))}
                {campaign.products.length > 3 && (
                  <View style={styles.featureItem}>
                    <View style={[styles.featureDot, { backgroundColor: campaign.iconColor }]} />
                    <Text style={styles.featureText}>+{campaign.products.length - 3} more</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={[styles.campaignCTA, { backgroundColor: campaign.iconColor }]}>
                <Text style={styles.campaignCTAText}>Get This Bundle</Text>
                <ArrowRight style={styles.campaignCTAArrow} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.whyChoose}>
        <Text style={styles.whyChooseTitle}>Why Choose Our Combos?</Text>
        <View style={styles.whyChooseGrid}>
          {[
            { icon: ShieldCheck, label: 'Curated by Experts', desc: 'Nutritionists select each product' },
            { icon: Leaf, label: '100% Organic', desc: 'Certified Himalayan sourcing' },
            { icon: Sparkles, label: 'Better Together', desc: 'Synergistic formulations' },
            { icon: Star, label: 'Maximum Savings', desc: 'Up to 25% off individual prices' },
          ].map((item, i) => (
            <View key={i} style={styles.whyChooseItem}>
              <View style={styles.whyChooseIconContainer}>
                <item.icon style={styles.whyChooseIcon} />
              </View>
              <Text style={styles.whyChooseLabel}>{item.label}</Text>
              <Text style={styles.whyChooseDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEFCE8',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeIcon: {
    color: '#D9A441',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CA8A04',
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
    backgroundColor: '#FEFCE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleIcon: {
    color: '#D9A441',
  },
  campaignsScroll: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  campaignCard: {
    width: '85%',
    minWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  campaignImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  campaignImage: {
    width: '100%',
    height: '100%',
  },
  campaignBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  campaignBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  campaignContent: {
    padding: 16,
    gap: 8,
  },
  campaignIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFAF5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  campaignIcon: {
    width: 20,
    height: 20,
  },
  campaignTheme: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365314',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  campaignDesc: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  campaignPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  campaignPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#365314',
    fontFamily: 'Poppins_800ExtraBold',
  },
  campaignOriginalPrice: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  campaignSavings: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  campaignFeatures: {
    gap: 6,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
  campaignCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9999,
    paddingVertical: 12,
    marginTop: 8,
  },
  campaignCTAText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  campaignCTAArrow: {
    color: '#FFFFFF',
  },
  whyChoose: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  whyChooseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  whyChooseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  whyChooseItem: {
    width: '48%',
    alignItems: 'center',
    gap: 8,
  },
  whyChooseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyChooseIcon: {
    color: '#365314',
  },
  whyChooseLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  whyChooseDesc: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});