'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  Truck,
  Baby,
  ShieldCheck,
  Phone,
  MessageCircle,
  AlertCircle,
  Check,
  ChevronRight,
  Minimize2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { searchAssistantKnowledge, AssistantSearchResult } from '@/lib/assistant/search-engine';
import { Product } from '@/lib/types';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  isPediatric?: boolean;
  matchedProduct?: Product;
  action?: {
    type: 'cart' | 'link' | 'whatsapp';
    label: string;
    url?: string;
    productSlug?: string;
  };
}

const DEFAULT_SUGGESTIONS = [
  '👶 Which powders are best for baby weaning lito?',
  '🚚 What are the delivery charges inside & outside Kathmandu?',
  '🍯 What is Dates Powder and how does it replace sugar?',
  '🏔️ Pure Himalayan Shilajit Resin price and testing?',
  '💬 Can I speak with human support on WhatsApp?',
];

export default function NaturesMudAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'np'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isEn = lang === 'en';

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: isEn
            ? "Namaste! 🙏 I am NaturesMud Assistant (AI). I'm here to assist you with our 32 pure Himalayan superfood powders, dehydrated fruits, delivery rates across Nepal, and baby weaning guidance."
            : 'नमस्ते! 🙏 म नेचर्स मड सहायक (AI) हुँ। म हजुरलाई हाम्रा ३२ प्रकारका शुद्ध सुपरफुड पाउडर, नेपालभर डेलिभरी शुल्क, र बच्चाको लिटो सम्बन्धी जानकारी दिन उपस्थित छु।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isEn, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Instant local semantic / BM25 search (<150ms simulated realistic typing)
    setTimeout(() => {
      const searchResults = searchAssistantKnowledge(query);

      let replyText = '';
      let isPediatric = false;
      let matchedProduct: Product | undefined;
      let action: Message['action'] = undefined;

      if (searchResults.length > 0) {
        const topResult = searchResults[0];
        replyText = isEn ? topResult.item.answerEn : topResult.item.answerNp;
        isPediatric = topResult.item.category === 'baby' || query.toLowerCase().includes('baby') || query.includes('बच्चा') || query.includes('lito');
        matchedProduct = topResult.matchedProduct;
        action = topResult.item.suggestedAction;
      } else {
        // Fallback with human concierge
        replyText = isEn
          ? "Thank you for asking. For specific custom orders, festival hampers, or medical health questions, our Baneshwor human team is happy to help you directly on WhatsApp (+977-9713888002)."
          : 'धन्यवाद। तपाईंको विशिष्ट प्रश्न वा अर्डरको लागि हाम्रो बानेश्वर टिमसँग सिधै WhatsApp (+९७७-९७१३८८८००२) मा कुराकानी गर्न सक्नुहुन्छ।';
        action = {
          type: 'whatsapp',
          label: 'Chat with Human Support (+977-9713888002)',
          url: `https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20have%20a%20question:%20${encodeURIComponent(query)}`,
        };
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPediatric,
        matchedProduct,
        action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 250);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedItemSlug(product.slug);
    setTimeout(() => setAddedItemSlug(null), 1500);
    openDrawer();
  };

  return (
    <>
      {/* ── 1. Floating Chat Trigger Button ── */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1A3826] hover:bg-[#234832] text-white shadow-2xl border-2 border-[#D9A441] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open NaturesMud AI Shop Assistant"
          >
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
              <Sparkles className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold font-heading tracking-wide">
                NaturesMud Assistant
              </span>
              <span className="block text-[10px] text-emerald-200/80 -mt-0.5">
                Instant Pure Food AI &amp; COD Desk
              </span>
            </div>
          </button>
        )}
      </div>

      {/* ── 2. Assistant Modal Window ── */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[640px] flex flex-col rounded-3xl bg-white shadow-2xl border border-[#EAE3D6] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#172D13] via-[#24451D] to-[#3A6B35] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-white">
                    NaturesMud Assistant (AI)
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 text-[#D9A441] px-1.5 py-0.5 rounded-md">
                    Verified Q&amp;A
                  </span>
                </div>
                <span className="text-[10px] text-emerald-200/80 block">
                  32 SKU Catalog · 77 Districts COD · WhatsApp Fallback
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'np' : 'en')}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[#D9A441] transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'नेपाली' : 'English'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1A3826] text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-[#EAE3D6] shadow-2xs rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Pediatric Advisory Callout if applicable */}
                  {m.isPediatric && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#7A5230] text-[11px] flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Pediatric Guidance:</strong> From 6 months, as advised by your pediatrician. No honey under 12 months.
                      </div>
                    </div>
                  )}

                  {/* Product Suggestion Card */}
                  {m.matchedProduct && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white relative overflow-hidden border border-[#EAE3D6] shrink-0">
                          <Image
                            src={m.matchedProduct.image}
                            alt={m.matchedProduct.name}
                            fill
                            unoptimized
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-[#1A3826] truncate max-w-[140px]">
                            {m.matchedProduct.name}
                          </div>
                          <div className="text-[10px] text-stone-500 font-semibold">
                            Rs. {m.matchedProduct.price} · {m.matchedProduct.weight}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(m.matchedProduct!)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1A3826] hover:bg-[#24451D] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {addedItemSlug === m.matchedProduct.slug ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3 text-[#D9A441]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* WhatsApp or Link CTA */}
                  {m.action && m.action.type === 'whatsapp' && (
                    <div className="mt-3">
                      <a
                        href={m.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{m.action.label}</span>
                      </a>
                    </div>
                  )}

                  {m.action && m.action.type === 'link' && m.action.url && (
                    <div className="mt-3">
                      <Link
                        href={m.action.url}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                      >
                        <span>{m.action.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-stone-400 text-xs italic p-2 bg-white rounded-2xl w-24 border border-[#EAE3D6]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-white border-t border-[#EAE3D6] overflow-x-auto whitespace-nowrap flex gap-2 shrink-0 scrollbar-none">
            {DEFAULT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(sug)}
                className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFEA] border border-[#EAE3D6] text-[10px] text-stone-700 font-medium transition-colors cursor-pointer shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#EAE3D6] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isEn
                    ? 'Ask about products, baby weaning, prices, delivery...'
                    : 'उत्पादन, मूल्य, लिटो, डेलिभरी बारे सोध्नुहोस्...'
                }
                className="flex-1 px-3.5 py-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#1A3826]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-full bg-[#1A3826] hover:bg-[#234832] text-white disabled:opacity-40 transition-all cursor-pointer shrink-0"
                aria-label="Send query"
              >
                <Send className="w-4 h-4 text-[#D9A441]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
