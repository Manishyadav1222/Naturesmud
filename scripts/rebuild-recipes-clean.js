// scripts/rebuild-recipes-clean.js
const fs = require('fs');
const path = require('path');

const recipesFilePath = path.join(__dirname, '..', 'lib', 'data', 'recipes.ts');

// Read the first 676 lines (the original 24 recipes)
const originalFile = fs.readFileSync(recipesFilePath, 'utf8');
const originalPart = originalFile.slice(0, originalFile.indexOf("id: 'r20',") + 500);
const lastR20Bracket = originalPart.lastIndexOf('},');
const baseCode = originalPart.slice(0, lastR20Bracket + 2);

const newRecipesModule = require('./generate-recipes-list.js');

let allUniqueRecipes = [];
const seenSlugs = new Set();

newRecipesModule.forEach((r) => {
  if (!seenSlugs.has(r.slug) && !seenSlugs.has(r.id)) {
    seenSlugs.add(r.slug);
    seenSlugs.add(r.id);
    allUniqueRecipes.push(r);
  }
});

let code = baseCode + '\n';

allUniqueRecipes.forEach((recipe) => {
  code += `  {
    id: ${JSON.stringify(recipe.id)},
    slug: ${JSON.stringify(recipe.slug)},
    title: ${JSON.stringify(recipe.title)},
    excerpt: ${JSON.stringify(recipe.excerpt)},
    image: ${JSON.stringify(recipe.image)},
    category: ${JSON.stringify(recipe.category)},
    prepTime: ${recipe.prepTime},
    cookTime: ${recipe.cookTime},
    servings: ${recipe.servings},
    difficulty: ${JSON.stringify(recipe.difficulty)},
    ingredients: ${JSON.stringify(recipe.ingredients, null, 6).replace(/\n\s*\]/, '\n    ]')},
    instructions: ${JSON.stringify(recipe.instructions, null, 6).replace(/\n\s*\]/, '\n    ]')},
    tags: ${JSON.stringify(recipe.tags)},
    featured: ${Boolean(recipe.featured)},
  },\n`;
});

code += '];\n';

fs.writeFileSync(recipesFilePath, code, 'utf8');
console.log(`Rebuilt recipes.ts successfully with ${allUniqueRecipes.length} newly added recipes!`);
