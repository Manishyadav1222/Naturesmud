import fs from 'fs';

async function main() {
  const blogsTs = fs.readFileSync('lib/data/blogs-database.ts', 'utf8');
  const tbIdx = blogsTs.indexOf('const topicBlueprints');
  const allPostsPart = blogsTs.slice(0, tbIdx);
  const tbPart = blogsTs.slice(tbIdx);

  const allBlogSlugs = [...allPostsPart.matchAll(/["']?slug["']?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const tbSlugs = [...tbPart.matchAll(/["']?slug["']?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  const bRes = await fetch('https://api.naturesmud.shop/api/v1/blogs?per_page=250');
  const bJson = await bRes.json();
  const apiBlogSlugs = (bJson.data || []).map(b => b.slug);

  const allUniqueBlogSlugs = [...new Set([...allBlogSlugs, ...tbSlugs, ...apiBlogSlugs])];
  console.log('allBlogPosts (with quotes):', allBlogSlugs.length);
  console.log('topicBlueprints:', tbSlugs.length);
  console.log('API blogs:', apiBlogSlugs.length);
  console.log('Total unique blog slugs:', allUniqueBlogSlugs.length);

  // Check which API blog slugs are NOT in allBlogSlugs or tbSlugs
  const localSet = new Set([...allBlogSlugs, ...tbSlugs]);
  const apiOnlyBlogs = apiBlogSlugs.filter(s => !localSet.has(s));
  console.log('API-only blog slugs:', apiOnlyBlogs);

  // Recipes
  const recTs = fs.readFileSync('lib/data/recipes.ts', 'utf8');
  const recSlugs = [...new Set([...recTs.matchAll(/["']?slug["']?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]))];
  const rRes = await fetch('https://api.naturesmud.shop/api/v1/recipes?per_page=250');
  const rJson = await rRes.json();
  const apiRecSlugs = (rJson.data || []).map(r => r.slug);
  const apiOnlyRecs = apiRecSlugs.filter(s => !recSlugs.includes(s));
  console.log('Local unique recipe slugs:', recSlugs.length);
  console.log('API-only recipe slugs:', apiOnlyRecs);
}

main().catch(console.error);
