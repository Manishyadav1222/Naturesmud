import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
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
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    // Continuous rotation for aura
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Gentle breathing pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currentProduct = products[currentIndex.current];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowRing, { transform: [{ rotate: spin }] }]} />
      <Animated.View style={[styles.imageContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image source={{ uri: currentProduct.image }} style={styles.productImage} />
        <View style={styles.productLabel}>
          <Text style={styles.productName}>{currentProduct.name}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 240,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderColor: '#BEF264',
    borderStyle: 'dashed',
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productLabel: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(54, 83, 20, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});