'use client';

import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 35,
  once = true,
  margin = '-40px',
  className = '',
  ...props
}: ScrollRevealProps) {
  const getInitialVariants = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, filter: 'blur(4px)' };
      case 'down':
        return { opacity: 0, y: -distance, filter: 'blur(4px)' };
      case 'left':
        return { opacity: 0, x: -distance, filter: 'blur(4px)' };
      case 'right':
        return { opacity: 0, x: distance, filter: 'blur(4px)' };
      case 'scale':
        return { opacity: 0, scale: 0.92, filter: 'blur(4px)' };
      case 'blur':
        return { opacity: 0, filter: 'blur(10px)' };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateVariants = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0, filter: 'blur(0px)' };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0, filter: 'blur(0px)' };
      case 'scale':
        return { opacity: 1, scale: 1, filter: 'blur(0px)' };
      case 'blur':
      case 'fade':
      default:
        return { opacity: 1, filter: 'blur(0px)' };
    }
  };

  return (
    <motion.div
      initial={getInitialVariants()}
      whileInView={getAnimateVariants()}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Modern cubic-bezier curve for silky smoothness
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
