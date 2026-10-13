import fs from 'fs';
import path from 'path';
import { products } from '../lib/data/products.ts';
import { categories } from '../lib/data/categories.ts';
import { masterBlogCatalog, BLOG_REDIRECT_MAP } from '../lib/data/blogs-database.ts';
import { recipes, RECIPE_REDIRECT_MAP } from '../lib/data/recipes.ts';
import { PRODUCT_SEO_DOSSIERS } from '../lib/data/product-seo-dossier.ts';

const validProductSlugs = new Set(products.map((p) => p.slug));
const validCategorySlugs = new Set(categories.map((c) => c.slug));
const validBlogSlugs = new Set(masterBlogCatalog.map((b) => b.slug));
const validRecipeSlugs = new Set(recipes.map((r) => r.slug));

const issues = [];

// 1. Check blogs-database.ts markdown links and featuredProductSlug
for (const b of masterBlogCatalog) {
  if (b.featuredProductSlug && !validProductSlugs.has(b.featuredProductSlug)) {
    issues.push({ source: `blog:${b.slug}`, type: 'INVALID_FEATURED_PRODUCT_SLUG', value: b.featuredProductSlug });
  }
  const fullText = (b.content || []).join('\n');
  const mdLinkRegex = /\]\((\/[^)]+)\)/g;
  let m;
  while ((m = mdLinkRegex.exec(fullText)) !== null) {
    const href = m[1];
    if (href.startsWith('/products?category=')) {
      issues.push({ source: `blog:${b.slug}`, type: 'BLOG_MD_QUERY_CATEGORY', value: href });
    } else if (href.startsWith('/products/')) {
      const s = href.slice('/products/'.length);
      if (/\.(jpg|jpeg|png|webp|avif|svg|gif)$/i.test(s)) continue;
      if (!validProductSlugs.has(s)) {
        issues.push({ source: `blog:${b.slug}`, type: 'BLOG_MD_INVALID_PRODUCT', value: href });
      }
    } else if (href.startsWith('/blog/')) {
      const s = href.slice('/blog/'.length);
      if (!validBlogSlugs.has(s)) {
        issues.push({ source: `blog:${b.slug}`, type: 'BLOG_MD_INVALID_BLOG', value: href });
      }
    } else if (href.startsWith('/recipes/')) {
      const s = href.slice('/recipes/'.length);
      if (!validRecipeSlugs.has(s)) {
        issues.push({ source: `blog:${b.slug}`, type: 'BLOG_MD_INVALID_RECIPE', value: href });
      }
    } else if (href.startsWith('/category/')) {
      const s = href.slice('/category/'.length);
      if (!validCategorySlugs.has(s)) {
        issues.push({ source: `blog:${b.slug}`, type: 'BLOG_MD_INVALID_CATEGORY', value: href });
      }
    }
  }
}

// 2. Check recipes.ts productSlugs
for (const r of recipes) {
  for (const ps of r.productSlugs || []) {
    if (!validProductSlugs.has(ps)) {
      issues.push({ source: `recipe:${r.slug}`, type: 'RECIPE_INVALID_PRODUCT_SLUG', value: ps });
    }
  }
}

// 3. Check product-seo-dossier.ts complementarySlugs and variants
for (const [slug, d] of Object.entries(PRODUCT_SEO_DOSSIERS)) {
  if (!validProductSlugs.has(slug)) {
    issues.push({ source: `dossier:${slug}`, type: 'DOSSIER_ORPHAN_SLUG', value: slug });
  }
  for (const cs of d.complementarySlugs || []) {
    if (!validProductSlugs.has(cs)) {
      issues.push({ source: `dossier:${slug}`, type: 'DOSSIER_INVALID_COMPLEMENTARY', value: cs });
    }
  }
  for (const v of d.variants || []) {
    if (!validProductSlugs.has(v.slug)) {
      issues.push({ source: `dossier:${slug}`, type: 'DOSSIER_INVALID_VARIANT', value: v.slug });
    }
  }
}

console.log(`=== DATA LAYER LINK & SLUG AUDIT (${issues.length} findings) ===`);
for (const i of issues) {
  console.log(`[${i.type}] ${i.source} -> ${i.value}`);
}
