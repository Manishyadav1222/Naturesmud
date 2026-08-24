'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const counterRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            
            // Parse the numeric value from the string (e.g., "25,000+" -> 25000)
            const numericMatch = value.match(/[\d,.]+/);
            if (!numericMatch) {
              setDisplayValue(value);
              return;
            }
            
            const target = parseFloat(numericMatch[0].replace(/,/g, ''));
            const prefix = value.includes('Rs.') ? 'Rs. ' : '';
            const suffix = value.replace(/[\d,.]+/g, '').replace('Rs. ', '');
            const formattedTarget = numericMatch[0];
            const [wholePart, decimalPart] = formattedTarget.split('.');
            const hasDecimal = !!decimalPart;
            
            const startTime = performance.now();
            
            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;
              
              // Format with comma separators
              const rounded = hasDecimal 
                ? current.toFixed(decimalPart.length)
                : Math.round(current).toString();
              
              const parts = rounded.split('.');
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              
              setDisplayValue(`${prefix}${parts.join('.')}${suffix}`);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={counterRef}>{displayValue}</span>;
}