'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/admin/Card';
import { Megaphone, TicketPercent, Share2, ChevronRight, Sparkles } from 'lucide-react';

export default function AdminMarketingPage() {
  const sections = [
    {
      title: 'Festival Offers & Combos',
      description: 'Launch and manage festival promotions, combo packs, and discount deals shown on the homepage.',
      href: '/admin/marketing/offers',
      icon: <Sparkles className="h-8 w-8 text-gold-600" />,
      color: 'bg-gold-50',
    },
    {
      title: 'Campaigns',
      description: 'Create and manage marketing campaigns, promotions, and seasonal offers.',
      href: '/admin/marketing/campaigns',
      icon: <Megaphone className="h-8 w-8 text-primary-600" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Coupons & Deals',
      description: 'Create discount codes, manage promotions, and track coupon usage.',
      href: '/admin/marketing/coupons',
      icon: <TicketPercent className="h-8 w-8 text-lime-600" />,
      color: 'bg-lime-50',
    },
    {
      title: 'Social Media',
      description: 'Manage social media links, posts, and integrations.',
      href: '/admin/marketing/social',
      icon: <Share2 className="h-8 w-8 text-accent-600" />,
      color: 'bg-accent-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your promotional activities, discounts, and social media presence.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary-200 cursor-pointer">
              <CardContent className="flex h-full flex-col gap-4 pt-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${section.color}`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-end text-sm font-medium text-primary-600">
                  Get Started
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}