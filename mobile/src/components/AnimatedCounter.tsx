'use client';

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  style?: Text['style'];
}

export function AnimatedCounter({ value, duration = 2000, style }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const targetValue = parseNumber(value);
    if (isNaN(targetValue)) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
      setDisplayValue(formatValue(currentValue, value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
    setHasAnimated(true);
  }, [value, duration]);

  return <Text style={[styles.counter, style]}>{displayValue}</Text>;
}

function parseNumber(str: string): number {
  // Handle numbers with commas, plus signs, decimal points
  return parseFloat(str.replace(/[^0-9.]/g, ''));
}

function formatValue(num: number, original: string): string {
  if (original.includes(',')) {
    return num.toLocaleString();
  }
  if (original.includes('+')) {
    return num + '+';
  }
  if (original.includes('★') || original.includes('/')) {
    return original; // Keep original format for ratings like "4.9★"
  }
  return num.toString();
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

const styles = StyleSheet.create({
  counter: {
    fontFamily: 'Poppins_800ExtraBold',
  },
});