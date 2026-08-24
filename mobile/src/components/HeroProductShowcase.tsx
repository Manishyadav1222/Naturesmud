'use client';

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { Leaf, Droplets, Zap, Sparkles } from 'lucide-react-native';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    name: 'Wild Honey',
    accent: '#D9A441',
    icons: [Leaf, Droplets, Sparkles],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    name: 'Shilajit Resin',
    accent: '#365314',
    icons: [Zap, Sparkles, Leaf],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400',
    name: 'Himalayan Almonds',
    accent: '#84CC16',
    icons: [Leaf, Sparkles, Droplets],
  },
];

export function HeroProductShowcase() {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    // Rotation animation - change product every 5 seconds
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % products.length;
      Animated.timing(rotationAnim, {
        toValue: currentIndex.current,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -12, 0],
    useNativeDriver: true,
  });

  const opacity = rotationAnim.interpolate({
    inputRange: [currentIndex.current - 1, currentIndex.current, currentIndex.current + 1],
    outputRange: [0, 1, 0],
    useNativeDriver: true,
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.floatingWrapper, { transform: [{ translateY }] }]}>
        <View style={styles.mainProductContainer}>
          <View style={styles.glowRing} />
          <View style={styles.productCard}>
            <Image
              source={{ uri: products[currentIndex.current].image }}
              style={styles.productImage}
            />
          </View>
        </View>

        {/* Orbiting accent elements */}
        {products[currentIndex.current].icons.map((Icon, i) => (
          <View key={i} style={styles.orbitContainer}>
            <Animated.View
              style={[
                styles.orbitElement,
                {
                  backgroundColor: products[currentIndex.current].accent + '20',
                  borderColor: products[currentIndex.current].accent + '80',
                },
              ]}
            >
              <Icon style={[styles.orbitIcon, { color: products[currentIndex.current].accent }]} />
            </Animated.View>
          </View>
        ))}

        {/* Product label */}
        <View style={styles.productLabel}>
          <Text style={styles.productName}>{products[currentIndex.current].name}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingWrapper: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainProductContainer: {
    width: '85%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: '110%',
    aspectRatio: 1,
    borderRadius: '55%',
    backgroundColor: 'rgba(54, 83, 20, 0.08)',
  },
  productCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  orbitContainer: {
    position: 'absolute',
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitElement: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  orbitIcon: {
    width: 24,
    height: 24,
  },
  productLabel: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
});