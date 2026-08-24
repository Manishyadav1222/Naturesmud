import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireMinRole } from '../middlewares/rbac';
import { laravelDb } from '../services/laravelDb';

const router = Router();

// All recipe routes require authentication
router.use(authenticate);

// GET /api/admin/recipes - List recipes
router.get('/', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const { page, limit, search, status, sortBy, sortOrder } = req.query;
    const result = await laravelDb.getRecipes({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search?.toString(),
      status: status?.toString(),
      sortBy: sortBy?.toString(),
      sortOrder: sortOrder?.toString(),
    });

    res.json({
      data: result.data.map((recipe: any) => ({
        id: String(recipe.id),
        title: recipe.title,
        slug: recipe.slug,
        excerpt: recipe.excerpt,
        coverImage: recipe.featured_image,
        category: recipe.category,
        cookingTime: (Number(recipe.prep_time) || 0) + (Number(recipe.cook_time) || 0),
        servings: Number(recipe.servings || 1),
        difficulty: (recipe.difficulty || 'easy').toUpperCase(),
        status: recipe.is_published ? 'PUBLISHED' : 'DRAFT',
        views: Number(recipe.views_count || 0),
        isFeatured: false,
        author: null,
        publishedAt: recipe.created_at,
        createdAt: recipe.created_at,
      })),
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/recipes/:id - Get single recipe
router.get('/:id', requireMinRole('VIEWER'), async (req, res, next) => {
  try {
    const recipe = await laravelDb.getRecipeById(String(req.params.id));
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    let ingredients: string[] = [];
    try { ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : (recipe.ingredients || []); } catch (_err) { ingredients = []; }

    let instructions: string[] = [];
    try { instructions = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : (recipe.instructions || []); } catch (_err) { instructions = []; }

    let nutrition: any = {};
    try { nutrition = typeof recipe.nutrition === 'string' ? JSON.parse(recipe.nutrition) : (recipe.nutrition || {}); } catch (_err) { nutrition = {}; }

    res.json({
      data: {
        id: String(recipe.id),
        title: recipe.title,
        slug: recipe.slug,
        excerpt: recipe.excerpt,
        content: recipe.content,
        coverImage: recipe.featured_image,
        category: recipe.category,
        prepTime: Number(recipe.prep_time || 0),
        cookTime: Number(recipe.cook_time || 0),
        servings: Number(recipe.servings || 1),
        difficulty: (recipe.difficulty || 'easy').toUpperCase(),
        ingredients,
        instructions,
        nutrition,
        status: recipe.is_published ? 'PUBLISHED' : 'DRAFT',
        views: Number(recipe.views_count || 0),
        seoTitle: recipe.meta_title,
        seoDescription: recipe.meta_description,
        createdAt: recipe.created_at,
        updatedAt: recipe.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/recipes - Create recipe
router.post('/', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const recipe = await laravelDb.createRecipe(req.body);
    res.status(201).json({ data: recipe });
  } catch (err: any) {
    if (err.message?.includes('duplicate') || err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'A recipe with this slug already exists' });
    }
    next(err);
  }
});

// PUT /api/admin/recipes/:id - Update recipe
router.put('/:id', requireMinRole('CONTENT_MANAGER'), async (req, res, next) => {
  try {
    const result = await laravelDb.updateRecipe(String(req.params.id), req.body);
    if (!result) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ data: result });
  } catch (err: any) {
    if (err.message?.includes('duplicate slug') || err.message?.includes('ER_DUP_ENTRY')) {
      return res.status(400).json({ message: 'A recipe with this slug already exists' });
    }
    next(err);
  }
});

// DELETE /api/admin/recipes/:id - Delete recipe
router.delete('/:id', requireMinRole('ADMIN'), async (req, res, next) => {
  try {
    const result = await laravelDb.deleteRecipe(String(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

export default router;