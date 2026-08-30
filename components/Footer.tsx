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
    <footer className="bg-ink text-white/80 relative overflow-hidden w-full max-w-full">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(58,107,53,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-80 h-80 bg-[radial-gradient(circle,rgba(217,164,65,0.10)_0%,transparent_70%)] pointer-events-none" />

      {/* Trust badges — Compact 3-col on Mobile/Tablet */}
      <div className="relative border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 lg:py-6 grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {[
            { icon: Truck, title: 'Free Delivery', text: 'Over Rs. 10,000', accent: 'from-primary-500/20 to-primary-600/20 text-primary-300' },
            { icon: Leaf, title: '0 Additives', text: 'Pure Himalayan', accent: 'from-secondary-500/20 to-secondary-600/20 text-secondary-300' },
            { icon: ShieldCheck, title: 'Quality Assured', text: 'Tested & Verified', accent: 'from-gold-500/20 to-gold-600/20 text-gold-300' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 group"
            >
              <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${item.accent} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                <item.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </span>
              <div>
                <p className="font-heading font-bold text-white text-[11px] sm:text-xs lg:text-sm leading-tight group-hover:text-primary-200 transition-colors">
                  {item.title}
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-white/50 hidden xs:block">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand & Contacts */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-700 text-white shadow-glow">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="font-heading font-bold text-white text-xl sm:text-2xl tracking-tight">
                Natures<span className="text-gradient">Mud</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm">
              100% natural dehydrated fruit & vegetable powders, wild honey, and mountain nuts from Nepal.
            </p>

            {/* Compact Contact Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/70">
              <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary-300" />
                <span>{siteConfig.phone}</span>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary-300" />
                <span>{siteConfig.email}</span>
              </a>
              <div className="inline-flex items-center gap-1.5 text-white/60">
                <MapPin className="w-3.5 h-3.5 text-primary-300" />
                <span>{siteConfig.address}</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: Facebook, href: siteConfig.social.facebook, label: 'Facebook' },
                { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
                { icon: Youtube, href: siteConfig.social.youtube, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-transparent hover:bg-primary/30 transition-all text-white/80 hover:text-white"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — 3 columns grid on mobile/tablet */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Company', links: footerLinks.company },
              { title: 'Products', links: footerLinks.products },
              { title: 'Support & Help', links: [...footerLinks.support, ...footerLinks.business].slice(0, 5) },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-heading font-semibold text-white text-xs sm:text-sm mb-2.5 sm:mb-3 pb-1 border-b border-white/10">
                  {col.title}
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[11px] sm:text-xs text-white/60 hover:text-primary-300 transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter bar (Slim & Compact) */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary-300">
                <Sparkles className="w-3 h-3 text-gold-300" /> Get 5% Off First Order
              </span>
              <p className="text-xs text-white/70 mt-0.5">Subscribe for recipes, health tips, and flash sales.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full sm:w-auto items-center gap-2 max-w-md">
              <div className="relative flex-1 sm:w-60">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-600 px-4 py-2 text-xs font-bold text-white shrink-0 active:scale-95 transition-all shadow-xs"
              >
                {subscribed ? 'Done ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-white/50">
          <p>© {new Date().getFullYear()} NaturesMud Nepal. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
            {[
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Shipping', href: '/shipping-policy' },
              { label: 'Returns', href: '/return-policy' },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}