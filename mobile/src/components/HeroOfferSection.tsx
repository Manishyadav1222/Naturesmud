'use client';

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Leaf, Sparkles, ShieldCheck, Truck, Star, Heart } from 'lucide-react-native';

const offerData = {
  title: 'Festival & Lifestyle Combos',
  subtitle: 'Curated bundles for every occasion — save more, gift better',
  combos: [
    {
      id: 'festive-delight',
      name: 'Festive Delight Hamper',
      description: 'Premium dry fruits, wild honey & superfoods for celebrations',
      price: 4999,
      originalPrice: 6499,
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
      badge: 'Bestseller',
      savings: 'Save Rs. 1,500',
      products: ['Wild Honey 500g', 'Mixed Dry Fruits 1kg', 'Chia Seeds 200g', 'Moringa Powder 100g'],
    },
    {
      id: 'wellness-essentials',
      name: 'Wellness Essentials Kit',
      description: 'Daily immunity & energy boosters for the whole family',
      price: 3499,
      originalPrice: 4299,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      badge: 'Popular',
      savings: 'Save Rs. 800',
      products: ['Shilajit Resin 20g', 'Amla Powder 100g', 'Ashwagandha 100g', 'Turmeric Latte Mix 100g'],
    },
  ],
};

export function HeroOfferSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Sparkles style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Limited Time Offers</Text>
          </View>
          <Text style={styles.title}>{offerData.title}</Text>
          <Text style={styles.subtitle}>{offerData.subtitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.decorativeLeaf}>
            <Leaf style={styles.leafIcon} />
          </View>
        </View>
      </View>

      <View style={styles.combosGrid}>
        {offerData.combos.map((combo) => (
          <TouchableOpacity key={combo.id} style={styles.comboCard} activeOpacity={0.95}>
            <View style={styles.comboImageContainer}>
              <Image source={{ uri: combo.image }} style={styles.comboImage} />
              <View style={styles.comboBadge}>{combo.badge}</View>
            </View>

            <View style={styles.comboContent}>
              <Text style={styles.comboName}>{combo.name}</Text>
              <Text style={styles.comboDesc}>{combo.description}</Text>

              <View style={styles.comboPriceRow}>
                <Text style={styles.comboPrice}>Rs. {combo.price.toLocaleString()}</Text>
                <Text style={styles.comboOriginalPrice}>Rs. {combo.originalPrice.toLocaleString()}</Text>
              </View>

              <Text style={styles.comboSavings}>{combo.savings}</Text>

              <View style={styles.comboFeatures}>
                {combo.products.slice(0, 3).map((product, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{product}</Text>
                  </View>
                ))}
                {combo.products.length > 3 && (
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>+{combo.products.length - 3} more</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.comboCTA}>
                <Text style={styles.comboCTAText}>Add to Cart</Text>
                <ArrowRight style={styles.comboCTAArrow} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.benefitsRow}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconContainer}>
            <ShieldCheck style={styles.benefitIcon} />
          </View>
          <Text style={styles.benefitText}>100% Organic Certified</Text>
        </View>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconContainer}>
            <Truck style={styles.benefitIcon} />
          </View>
          <Text style={styles.benefitText}>Free Shipping</Text>
        </View>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconContainer}>
            <Star style={styles.benefitIcon} />
          </View>
          <Text style={styles.benefitText}>Premium Quality</Text>
        </View>
        <View style={styles.benefitItem}>
          <View style={styles.benefitIconContainer}>
            <Heart style={styles.benefitIcon} />
          </View>
          <Text style={styles.benefitText}>Gift Ready</Text>
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
    backgroundColor: '#F8F4EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    color: '#365314',
  },
  combosGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  comboCard: {
    flex: 1,
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
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 12,
    marginTop: 8,
  },
  comboCTAText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  comboCTAArrow: {
    color: '#FFFFFF',
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: '45%',
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitIcon: {
    color: '#365314',
  },
  benefitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
});