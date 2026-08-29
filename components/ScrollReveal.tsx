'use client';

import { ReactNode } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
  className?: string;
  [key: string]: any;
}

export function ScrollReveal({
  children,
  className = '',
  ...rest
}: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default ScrollReveal;
