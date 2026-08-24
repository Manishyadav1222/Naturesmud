'use client';

import React from 'react';
import { Globe, Check } from 'lucide-react';

interface BlogLanguageSwitcherProps {
  currentLang: 'en' | 'np';
  onLanguageChange: (lang: 'en' | 'np') => void;
  className?: string;
}

export default function BlogLanguageSwitcher({
  currentLang,
  onLanguageChange,
  className = '',
}: BlogLanguageSwitcherProps) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-sm ${className}`}
      role="group"
      aria-label="Language Switcher"
    >
      <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gray-500 border-r border-gray-100 mr-1 hidden sm:flex">
        <Globe className="w-3.5 h-3.5 text-[#2D5A27]" />
        <span>Language:</span>
      </div>

      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
          currentLang === 'en'
            ? 'bg-[#2D5A27] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
        }`}
      >
        <span>🇬🇧 English</span>
        {currentLang === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange('np')}
        className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
          currentLang === 'np'
            ? 'bg-[#2D5A27] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
        }`}
      >
        <span>🇳🇵 नेपाली</span>
        {currentLang === 'np' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>
    </div>
  );
}
