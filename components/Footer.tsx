'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Truck, Leaf, ShieldCheck, ArrowRight, Sparkles, Send } from 'lucide-react';
import { footerLinks, siteConfig } from '@/lib/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-ink text-white/80 relative overflow-hidden">
      {/* Decorative organic blob */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-2xl" />

      {/* Trust badges */}
      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
{ icon: Truck, title: 'Free Delivery', text: 'On orders over Rs. 10,000', accent: 'from-primary-500/20 to-primary-600/20 text-primary-300' },
            { icon: Leaf, title: '100% Natural', text: 'No artificial anything', accent: 'from-secondary-500/20 to-secondary-600/20 text-secondary-300' },
            { icon: ShieldCheck, title: 'Quality Assured', text: 'Tested & certified', accent: 'from-gold-500/20 to-gold-600/20 text-gold-300' },
          ].map((item, idx) => (
            <div
              key={item.title}
              className="flex items-center gap-4 group"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <span className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accent} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <item.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-heading font-semibold text-white text-sm group-hover:text-primary-200 transition-colors">{item.title}</p>
                <p className="text-xs text-white/60">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white shadow-glow group-hover:rotate-6 transition-transform duration-300">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-heading font-bold text-white text-2xl tracking-tight">
              Nature's <span className="text-gradient">Mud</span>
            </span>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">
            Premium organic and healthy food from the heart of Nepal. Sourced from nature,
            delivered with love. Experience the pure taste of the Himalayas.
          </p>

          {/* Contact info with modern cards */}
          <div className="space-y-2.5">
            {[
              { icon: MapPin, text: siteConfig.address, href: '#' },
              { icon: Phone, text: siteConfig.phone, href: `tel:${siteConfig.phone}` },
              { icon: Mail, text: siteConfig.email, href: `mailto:${siteConfig.email}` },
            ].map((item) => (
              <a
                key={item.text}
                href={item.href}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-4 h-4 text-primary-300" />
                </span>
                {item.text}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-2">
            {[
              { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook', hover: 'hover:bg-[#1877F2]' },
              { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram', hover: 'hover:bg-[#E4405F]' },
              { icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube', hover: 'hover:bg-[#FF0000]' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-transparent ${social.hover} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {[
          { title: 'Company', links: footerLinks.company },
          { title: 'Products', links: footerLinks.products },
          { title: 'Support', links: footerLinks.support },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="font-heading font-semibold text-white text-sm mb-5 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary after:rounded-full">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-primary-300 transition-all duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter - modern glass card */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border border-white/10 p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center backdrop-blur-sm">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-widest text-primary-200 mb-3">
              <Sparkles className="w-3 h-3" /> Join Our Community
            </span>
            <h3 className="font-heading font-semibold text-white text-2xl mb-2">
              Stay Fresh & Inspired
            </h3>
            <p className="text-sm text-white/70">
              Get 10% off your first order, healthy recipes, and exclusive offers straight to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-full bg-white/10 border border-white/20 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 backdrop-blur transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-600 px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:shadow-glow-lg hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {subscribed ? (
                <>Subscribed! <Sparkles className="w-4 h-4" /></>
              ) : (
                <>Subscribe <Send className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Nature's Mud. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Shipping', href: '/shipping-policy' },
              { label: 'Returns', href: '/return-policy' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-gold transition-colors hover:scale-105 inline-block"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}