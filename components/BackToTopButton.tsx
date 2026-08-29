'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 15 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-primary shadow-[0_6px_20px_rgba(58,107,53,0.2)] border border-primary/20 flex items-center justify-center backdrop-blur-md transition-shadow hover:shadow-[0_8px_25px_rgba(58,107,53,0.3)] cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 text-primary stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
