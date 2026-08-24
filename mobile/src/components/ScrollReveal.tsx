'use client';

import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
  style?: any;
}

export function ScrollReveal({
  children,
  direction = 'up',
  distance = 20,
  duration = 600,
  delay = 0,
  once = true,
  threshold = 0.1,
  style,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animatedRef = useRef<Animated.View>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(direction === 'left' || direction === 'up' ? distance : -distance)).current;

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: translate }];
      case 'down':
        return [{ translateY: translate }];
      case 'left':
        return [{ translateX: translate }];
      case 'right':
        return [{ translateX: translate }];
      default:
        return [{ translateY: translate }];
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            animateIn();
            if (once) setHasAnimated(true);
          }
        } else if (!once && hasAnimated) {
          animateOut();
          setHasAnimated(false);
        }
      },
      { threshold }
    );

    if (animatedRef.current) {
      observer.observe(animatedRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, once, threshold]);

  const animateIn = () => {
    setIsVisible(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: direction === 'left' || direction === 'up' ? distance : -distance,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsVisible(false));
  };

  return (
    <Animated.View
      ref={animatedRef}
      style={[
        styles.container,
        {
          opacity,
          transform: getInitialTransform(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
});

// Staggered reveal for lists
interface StaggeredRevealProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
  style?: any;
}

export function StaggeredReveal({
  children,
  direction = 'up',
  distance = 20,
  duration = 600,
  staggerDelay = 100,
  once = true,
  threshold = 0.1,
  style,
}: StaggeredRevealProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<View>(null);
  const itemAnimations = children.map(() => ({
    opacity: new Animated.Value(0),
    translate: new Animated.Value(direction === 'left' || direction === 'up' ? distance : -distance),
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            animateItemsIn();
            if (once) setHasAnimated(true);
          }
        } else if (!once && hasAnimated) {
          animateItemsOut();
          setHasAnimated(false);
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, once, threshold]);

  const animateItemsIn = () => {
    itemAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translate, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]).start();
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  };

  const animateItemsOut = () => {
    itemAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translate, {
            toValue: direction === 'left' || direction === 'up' ? distance : -distance,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setVisibleItems(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }, index * (staggerDelay / 2));
    });
  };

  return (
    <View ref={containerRef} style={[styles.container, style]}>
      {children.map((child, index) => {
        const anim = itemAnimations[index];
        return (
          <Animated.View
            key={index}
            style={[
              styles.item,
              {
                opacity: anim.opacity,
                transform: [
                  direction === 'left' || direction === 'right'
                    ? { translateX: anim.translate }
                    : { translateY: anim.translate },
                ],
              },
            ]}
          >
            {child}
          </Animated.View>
        );
      })}
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {},
  item: {},
});

// Add item styles to the main styles
Object.assign(styles, itemStyles);