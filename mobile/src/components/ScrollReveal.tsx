import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function ScrollReveal({
  children,
  direction = 'up',
  distance = 20,
  duration = 500,
  delay = 0,
  style,
}: ScrollRevealProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(
    new Animated.Value(direction === 'up' || direction === 'left' ? distance : -distance)
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, opacity, translate]);

  const transform =
    direction === 'up' || direction === 'down'
      ? [{ translateY: translate }]
      : [{ translateX: translate }];

  return (
    <Animated.View style={[styles.container, { opacity, transform }, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});