'use client';

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ChevronLeft, ChevronRight, Sparkles, Leaf, Mountain, Award } from 'lucide-react-native';
import { ScrollReveal } from '@/components/ScrollReveal';

const { width: screenWidth } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Wild Honey from the Roof of the World',
    subtitle: 'Harvested by Gurung honey hunters at 3,500m+',
    description: 'Rare multi-floral honey with 100+ wildflower essences. Raw, unfiltered, enzyme-rich.',
    ctaText: 'Shop Wild Honey',
    ctaLink: '/products/wild-himalayan-honey-500g',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800',
    badge: 'Bestseller',
    gradient: ['#365314', '#2D4312'],
  },
  {
    id: 2,
    title: 'Pure Shilajit — 40 Days of Sun',
    subtitle: 'Surya Tapi purified resin from 4,000m+',
    description: '60%+ fulvic acid, 85+ trace minerals. The gold standard of Himalayan Shilajit.',
    ctaText: 'Explore Shilajit',
    ctaLink: '/products/pure-shilajit-resin-20g',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    badge: 'Lab Tested',
    gradient: ['#1E2E0D', '#2D4312'],
  },
  {
    id: 3,
    title: 'Morning Vitality Ritual',
    subtitle: 'Curated 4-product wellness bundle',
    description: 'Wild honey, turmeric latte, amla powder & green tea. Save 19% — start your day the Himalayan way.',
    ctaText: 'Get the Bundle',
    ctaLink: '/products/morning-vitality-bundle',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    badge: 'New Arrival',
    gradient: ['#365314', '#1E2E0D'],
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const autoplayRef = useRef<any>(null);
  const containerWidth = screenWidth - 40;

  // Auto-play
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!isDragging) {
        const nextIndex = (currentIndex + 1) % slides.length;
        animateToSlide(nextIndex);
      }
    }, 5000);

    return () => clearInterval(autoplayRef.current);
  }, [currentIndex, isDragging]);

  const animateToSlide = (index: number) => {
    Animated.timing(scrollX, {
      toValue: index * containerWidth,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(index);
    });
  };

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / containerWidth);
    if (index !== currentIndex && index >= 0 && index < slides.length) {
      setCurrentIndex(index);
    }
  };

  const handleMomentumBegin = () => setIsDragging(true);
  const handleMomentumEnd = () => setIsDragging(false);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollBegin={handleMomentumBegin}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollRef={scrollX as any}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { width: containerWidth }]}>
            <Image
              source={{ uri: slide.image }}
              style={styles.slideImage}
              resizeMode="cover"
            />
            <View style={styles.gradientOverlay} />
            <View style={styles.content}>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  {slide.badge === 'Bestseller' && <Star style={styles.badgeIcon} />}
                  {slide.badge === 'Lab Tested' && <Award style={styles.badgeIcon} />}
                  {slide.badge === 'New Arrival' && <Sparkles style={styles.badgeIcon} />}
                  <Text style={styles.badgeText}>{slide.badge}</Text>
                </View>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.description}>{slide.description}</Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => {}}
              >
                <Text style={styles.ctaText}>{slide.ctaText}</Text>
                <ChevronRight style={styles.ctaArrow} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicators}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
            onPress={() => animateToSlide(index)}
          />
        ))}
      </View>

      {/* Navigation Arrows */}
      <View style={styles.navArrows}>
        <TouchableOpacity style={styles.navArrow} onPress={() => animateToSlide((currentIndex - 1 + slides.length) % slides.length)}>
          <ChevronLeft style={styles.navArrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navArrow} onPress={() => animateToSlide((currentIndex + 1) % slides.length)}>
          <ChevronRight style={styles.navArrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  slide: {
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: 280,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    backdropFilter: 'blur(10px)',
  },
  badgeIcon: {
    color: '#D9A441',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 32,
    fontFamily: 'Poppins_800ExtraBold',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  description: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: '85%',
    fontFamily: 'Inter_400Regular',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {
    color: '#365314',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  ctaArrow: {
    color: '#365314',
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  navArrows: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: -20,
    zIndex: 10,
    pointerEvents: 'none',
  },
  navArrow: {
    pointerEvents: 'auto',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  navArrowIcon: {
    color: '#FFFFFF',
  },
});