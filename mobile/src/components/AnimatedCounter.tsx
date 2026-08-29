import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

export function AnimatedCounter({ value, duration = 2000, style }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

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
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
      setDisplayValue(formatValue(currentValue, value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <Text style={[styles.counter, style]}>{displayValue}</Text>;
}

function parseNumber(str: string): number {
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
    return original;
  }
  return num.toString();
}

const styles = StyleSheet.create({
  counter: {
    fontWeight: '800',
  },
});