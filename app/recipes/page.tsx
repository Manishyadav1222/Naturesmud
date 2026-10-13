import { recipes as localRecipes } from '@/lib/data/recipes';
import RecipesListClient from '@/components/RecipesListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: {
    absolute: 'Healthy Superfood & Baby Food Recipes | NaturesMud',
  },
  description:
    'Easy Nepali kitchen recipes made with NaturesMud Sweet Potato Powder, Dates Powder, Beetroot Powder, Chia Seeds, Raw Almonds, and Dehydrated Fruits.',
  alternates: {
    canonical: 'https://naturesmud.shop/recipes',
  },
  openGraph: {
    title: 'Healthy Superfood & Baby Food Recipes | NaturesMud',
    description:
      'Easy Nepali kitchen recipes made with NaturesMud Sweet Potato Powder, Dates Powder, Beetroot Powder, Chia Seeds, Raw Almonds, and Dehydrated Fruits.',
    url: 'https://naturesmud.shop/recipes',
    siteName: 'NaturesMud',
    type: 'website',
  },
};

export default async function RecipesPage() {
  return <RecipesListClient initialRecipes={localRecipes} />;
}