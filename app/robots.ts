import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/admin/',
          '/account/',
          '/account',
          '/cart',
          '/checkout',
          '/wishlist',
          '/login',
          '/register',
          '/dashboard',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/cart', '/checkout', '/account/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
