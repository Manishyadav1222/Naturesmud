import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { formatPrice } from '@/lib/utils';

export function CampaignCombosShowcaseSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Sparkles size={13} color="#365314" />
        <Text style={styles.badgeText}>Limited Season Bundles</Text>
      </View>
      <Text style={styles.title}>Himalayan Vitality Combinations</Text>
      <Text style={styles.subtitle}>Save 5% on matched Ayurvedic superfoods</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500' }}
          style={styles.image}
        />
        <View style={styles.body}>
          <Text style={styles.cardTitle}>Complete Energy & Immunity Duo</Text>
          <Text style={styles.cardDesc}>
            Pure Surya Tapi Shilajit Resin (50g) paired with Wild Himalayan Cliff Honey (500g).
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(4085)}</Text>
            <Text style={styles.comparePrice}>{formatPrice(4300)}</Text>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.btnText}>View Value Bundles</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
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
    marginBottom: 12,
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
    height: 150,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  cardDesc: {
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
    fontSize: 18,
    fontWeight: '800',
    color: '#365314',
  },
  comparePrice: {
    fontSize: 13,
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