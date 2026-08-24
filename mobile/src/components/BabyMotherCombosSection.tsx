'use client';

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Baby, Heart, ShieldCheck, Leaf, Sparkles, Star, ArrowRight } from 'lucide-react-native';

const combos = [
  {
    id: 'newborn-essentials',
    name: 'Newborn Essentials Kit',
    description: 'Gentle care for baby\'s first days — organic oils, powders & balms',
    price: 2999,
    originalPrice: 3799,
    image: 'https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=400',
    badge: 'New Arrival',
    ageGroup: '0-6 months',
    products: ['Baby Massage Oil 100ml', 'Organic Baby Powder 50g', 'Diaper Rash Balm 30g', 'Soft Washcloths (3pk)'],
  },
  {
    id: 'growing-baby',
    name: 'Growing Baby Nutrition Pack',
    description: 'Wholesome first foods & supplements for healthy development',
    price: 3499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1593267530146-f9e4f817fbd8?w=400',
    badge: 'Pediatrician Recommended',
    ageGroup: '6-24 months',
    products: ['Ragi Porridge 200g', 'Millet Mix 200g', 'Dates Powder 100g', 'Ghee 200ml'],
  },
  {
    id: 'mommy-care',
    name: 'Mommy Postpartum Care',
    description: 'Recovery & nourishment for new mothers — inside & out',
    price: 3999,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1587944637312-5c00768b2b2a?w=400',
    badge: 'Best for Moms',
    ageGroup: 'Postpartum',
    products: ['Shatavari Powder 100g', 'Moringa Capsules 60ct', 'Nursing Tea 20 bags', 'Belly Butter 100g'],
  },
];

export function BabyMotherCombosSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Baby style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Baby & Mother Care</Text>
          </View>
          <Text style={styles.title}>Nurturing Nature\'s Tiniest</Text>
          <Text style={styles.subtitle}>Safe, organic essentials for pregnancy, postpartum & baby\'s first years</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.decorativeHeart}>
            <Heart style={styles.heartIcon} />
          </View>
        </View>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.combosScroll}>
        {combos.map((combo) => (
          <TouchableOpacity key={combo.id} style={styles.comboCard} activeOpacity={0.95}>
            <View style={styles.comboImageContainer}>
              <Image source={{ uri: combo.image }} style={styles.comboImage} />
              <View style={styles.comboBadge}>{combo.badge}</View>
              <View style={styles.ageBadge}>{combo.ageGroup}</View>
            </View>

            <View style={styles.comboContent}>
              <Text style={styles.comboName}>{combo.name}</Text>
              <Text style={styles.comboDesc}>{combo.description}</Text>

              <View style={styles.comboPriceRow}>
                <Text style={styles.comboPrice}>Rs. {combo.price.toLocaleString()}</Text>
                <Text style={styles.comboOriginalPrice}>Rs. {combo.originalPrice.toLocaleString()}</Text>
              </View>

              <Text style={styles.comboSavings}>Save Rs. {combo.originalPrice - combo.price}</Text>

              <View style={styles.comboFeatures}>
                {combo.products.slice(0, 2).map((product, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{product}</Text>
                  </View>
                ))}
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>+{combo.products.length - 2} more items</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.comboCTA}>
                <Text style={styles.comboCTAText}>View Details</Text>
                <ArrowRight style={styles.comboCTAArrow} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.trustIndicators}>
        <View style={styles.trustItem}>
          <View style={styles.trustIconContainer}>
            <ShieldCheck style={styles.trustIcon} />
          </View>
          <View style={styles.trustTextContainer}>
            <Text style={styles.trustTitle}>Pediatrician Approved</Text>
            <Text style={styles.trustDesc}>Recommended by child health experts</Text>
          </View>
        </View>
        <View style={styles.trustItem}>
          <View style={styles.trustIconContainer}>
            <Leaf style={styles.trustIcon} />
          </View>
          <View style={styles.trustTextContainer}>
            <Text style={styles.trustTitle}>100% Organic</Text>
            <Text style={styles.trustDesc}>No chemicals, no toxins, ever</Text>
          </View>
        </View>
        <View style={styles.trustItem}>
          <View style={styles.trustIconContainer}>
            <Sparkles style={styles.trustIcon} />
          </View>
          <View style={styles.trustTextContainer}>
            <Text style={styles.trustTitle}>Hypoallergenic</Text>
            <Text style={styles.trustDesc}>Gentle on sensitive baby skin</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
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
    backgroundColor: '#FDF2F8',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeIcon: {
    color: '#EC4899',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EC4899',
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
    backgroundColor: '#FDF2F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    color: '#EC4899',
  },
  combosScroll: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 8,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  comboCard: {
    width: '85%',
    minWidth: 280,
    backgroundColor: '#FAFAF5',
    borderRadius: 20,
    overflow: 'hidden',
  },
  comboImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  comboImage: {
    width: '100%',
    height: '100%',
  },
  comboBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D9A441',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  comboContent: {
    padding: 16,
    gap: 8,
  },
  comboName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  comboDesc: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.7,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  comboPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  comboPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#365314',
    fontFamily: 'Poppins_800ExtraBold',
  },
  comboOriginalPrice: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    fontFamily: 'Inter_400Regular',
  },
  comboSavings: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  comboFeatures: {
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
    backgroundColor: '#365314',
  },
  featureText: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
  comboCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 12,
    marginTop: 8,
  },
  comboCTAText: {
    color: '#365314',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  comboCTAArrow: {
    color: '#365314',
  },
  trustIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: '30%',
  },
  trustIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustIcon: {
    color: '#365314',
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  trustDesc: {
    fontSize: 10,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
});