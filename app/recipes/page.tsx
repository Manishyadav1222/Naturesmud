import { recipes as localRecipes } from '@/lib/data/recipes';
import RecipesListClient from '@/components/RecipesListClient';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Healthy Himalayan Recipes & Superfood Cooking | Nature\'s Mud Nepal',
  description: '100+ delicious, nutrient-dense recipes crafted with Nature\'s Mud organic sweet potato powder, dates powder, raw mountain honey, chia seeds, and dried fruits.',
  keywords: 'healthy recipes nepal, baby food recipe nepal, sweet potato powder pancakes, chia seed pudding kathmandu, clean breakfast recipes',
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