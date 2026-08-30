import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, Tag, Truck, ShieldCheck } from 'lucide-react-native';
import { formatPrice } from '@/lib/utils';

export function HeroOfferSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.offerCard}>
        <View style={styles.badge}>
          <Tag size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>Special Promotion</Text>
        </View>

        <Text style={styles.heading}>Use Code: STORE5</Text>
        <Text style={styles.subheading}>Get 5% off across all Himalayan Superfoods on checkout.</Text>

        <View style={styles.benefitsRow}>
          <View style={styles.benefitItem}>
            <Truck size={14} color="#365314" />
            <Text style={styles.benefitText}>Free Delivery &gt; Rs. 3,000</Text>
          </View>
          <View style={styles.benefitItem}>
            <ShieldCheck size={14} color="#365314" />
            <Text style={styles.benefitText}>100% Lab Tested</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push('/(tabs)/products')}
        >
          <Text style={styles.ctaBtnText}>Shop Offer Now</Text>
          <ArrowRight size={14} color="#365314" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  offerCard: {
    backgroundColor: '#365314',
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subheading: {
    fontSize: 13,
    color: '#D9F99D',
    lineHeight: 18,
  },
  benefitsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365314',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 6,
  },
  ctaBtnText: {
    color: '#365314',
    fontWeight: '700',
    fontSize: 13,
  },
});