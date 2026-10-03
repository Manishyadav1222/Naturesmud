import { recipes as localRecipes } from '@/lib/data/recipes';
import RecipesListClient from '@/components/RecipesListClient';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Healthy Superfood, Baby Porridge & Smoothie Recipes in Nepal',
  description:
    'Explore 100+ easy, nutrient-dense recipes crafted with NaturesMud pure sweet potato powder, dates powder, banana powder, avocado powder, chia seeds, and dehydrated fruits.',
  keywords:
    'healthy recipes nepal, baby food recipe nepal, sweet potato powder porridge, dates powder kheer, chia seed pudding kathmandu, naturesmud recipes',
  alternates: {
    canonical: 'https://naturesmud.shop/recipes',
  },
  openGraph: {
    title: 'Healthy Superfood, Baby Porridge & Smoothie Recipes | NaturesMud Nepal',
    description:
      '100+ easy, wholesome recipes for baby weaning, pre-workout smoothies, and sugar-free Nepali desserts using NaturesMud superfoods.',
    url: 'https://naturesmud.shop/recipes',
    siteName: 'NaturesMud Nepal',
    type: 'website',
  },
};

export default async function RecipesPage() {
  let recipeList: any[] = localRecipes;

  try {
    const res = await api.get('/recipes?per_page=100');
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const apiRecipes = res.data.data.map((r: any) => ({
        id: String(r.id),
        title: r.title,
        slug: r.slug,
        category: r.category || 'Healthy Snack',
        image: r.featured_image || r.image || '/products/superfood-mix.jpg',
        prepTime: Number(r.prep_time || 10),
        cookTime: Number(r.cook_time || 5),
        servings: Number(r.servings || 2),
        difficulty: r.difficulty || 'Easy',
        excerpt: r.excerpt || r.description || '',
      }));

      // Combine local recipes with API recipes deduplicated by slug
      recipeList = [
        ...localRecipes,
        ...apiRecipes.filter((ar: any) => !localRecipes.some((lr) => lr.slug === ar.slug))
      ];
    }
  } catch {
    recipeList = localRecipes;
  }

  return <RecipesListClient initialRecipes={recipeList} />;
}