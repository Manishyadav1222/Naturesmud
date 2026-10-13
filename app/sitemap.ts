import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { products } from '@/lib/data/products';
import { recipes } from '@/lib/data/recipes';
import { masterBlogCatalog } from '@/lib/data/blogs-database';
import { categories } from '@/lib/data/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url || 'https://naturesmud.shop';
  const now = new Date();

  // 1. Core Static & Policy Pages (strictly canonical 200 OK indexable URLs)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/offers`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/recipes`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/send-gifts-to-nepal`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/baby-weaning`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gym-fitness`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/sugar-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/fasting-snacks`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/facts`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/quality-and-proof`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/wholesale`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/shipping-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/return-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 2. 6 Canonical Category Hub Pages (/category/{slug})
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. 32 Canonical Product Detail Pages
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.isActive !== false && p.isPublished !== false)
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: product.isFeatured || product.isBestSeller ? 0.9 : 0.85,
    }));

  // 4. Canonical Recipe Detail Pages
  const recipePages: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // 5. 28 Canonical Blog Article Pages
  const blogPages: MetadataRoute.Sitemap = masterBlogCatalog.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || now),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...recipePages,
    ...blogPages,
  ];
}
