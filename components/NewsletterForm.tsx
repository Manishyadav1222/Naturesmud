'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { classNames } from '@/lib/utils';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
}

interface FormData {
  email: string;
}

export function NewsletterForm({ variant = 'light' }: NewsletterFormProps) {
  const [subscribed, setSubscribed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // In production, POST to /api/newsletter
    console.log('Newsletter subscription:', data.email);
    setSubscribed(true);
    reset();
    setTimeout(() => setSubscribed(false), 4000);
  };

  const dark = variant === 'dark';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email',
            },
          })}
          className={classNames(
            'flex-1 px-4 py-2.5 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-[#7AA95C]',
            dark
              ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
              : 'bg-white border-gray-200 text-dark placeholder-gray-400'
          )}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3A6B35] text-white text-sm font-semibold hover:bg-[#2d5429] transition-colors whitespace-nowrap"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Subscribe</span>
        </button>
      </div>
      {errors.email && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {errors.email.message}
        </p>
      )}
      {subscribed && (
        <p className="mt-2 text-xs text-green-400" role="status">
          Thank you for subscribing! Check your inbox for a special gift. 🎉
        </p>
      )}
    </form>
  );
}