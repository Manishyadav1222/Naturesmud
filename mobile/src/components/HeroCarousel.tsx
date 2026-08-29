import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Leaf, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Wild Himalayan Cliff Honey',
    subtitle: 'Harvested by Gurung hunters at 3,500m+',
    description: 'Raw, unfiltered, enzyme-rich honey with natural wildflower bio-compounds.',
    ctaText: 'Shop Cliff Honey',
    slug: 'wild-cliff-honey-500g',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
    badge: '100% Raw',
    bgColor: '#365314',
  },
  {
    id: 2,
    title: 'Pure Surya Tapi Shilajit Resin',
    subtitle: 'Sun-purified above 16,000 ft in Himalayas',
    description: '65%+ Fulvic Acid and 85+ bio-available ionic minerals for peak natural vitality.',
    ctaText: 'Explore Shilajit',
    slug: 'pure-himalayan-shilajit-resin-50g',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    badge: 'Lab Certified',
    bgColor: '#1E2E0D',
  },
  {
    id: 3,
    title: 'Vedic A2 Himalayan Cow Ghee',
    subtitle: 'Wooden Bilona churned from grass-fed cows',
    description: 'Rich in healthy butyrate, vitamins A, D, E, K2 with golden organic aroma.',
    ctaText: 'Explore A2 Ghee',
    slug: 'organic-a2-desi-cow-ghee-1l',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800',
    badge: 'Ancient Recipe',
    bgColor: '#7B5E3B',
  },
];

export function HeroCarousel() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * (screenWidth - 32), animated: true });
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (screenWidth - 32));
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slideCard}>
            <Image source={{ uri: slide.image }} style={styles.slideImage} />
            <View style={styles.overlay} />

            <View style={styles.slideContent}>
              <View style={styles.badge}>
                <Sparkles size={12} color="#365314" />
                <Text style={styles.badgeText}>{slide.badge}</Text>
              </View>

              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSub}>{slide.subtitle}</Text>

              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => router.push(`/products/${slide.slug}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaText}>{slide.ctaText}</Text>
                <ArrowRight size={14} color="#365314" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, currentIndex === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    gap: 8,
  },
  scrollContent: {
    gap: 0,
  },
  slideCard: {
    width: screenWidth - 32,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1C1917',
  },
  slideImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    gap: 6,
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
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#365314',
  },
  slideTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  slideSub: {
    fontSize: 12,
    color: '#D9F99D',
    marginBottom: 4,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  ctaText: {
    color: '#365314',
    fontWeight: '700',
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D3D1',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#365314',
  },
});