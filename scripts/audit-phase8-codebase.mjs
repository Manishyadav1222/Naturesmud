import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'public', 'scripts'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
}

const REDIRECT_SOURCES = [
  '/our-story',
  '/products/premium-coconut-oil',
  '/products/virgin-coconut-oil',
  '/products/cashewnuts',
  '/products/premium-cashewnut',
  '/products/flaxseed-crackers',
  '/products/pure-shilajit-resin',
  '/products/raw-almonds-200g',
  '/products/almonds',
  '/products/pink-salt',
  '/products/black-salt',
  '/products/dates-powder-100g',
  '/products/sweet-potato-powder-100g',
  '/products/beetroot-powder-100g',
  '/products/carrot-powder-100g',
  '/products/dried-blueberries-100g',
  '/products/blueberries',
  '/products/dried-cranberry-100g',
  '/products/dried-figs-200g',
  '/products/cashewnuts-roasted',
  '/products/black-chia-seeds',
  '/products/premium-pistachios',
  '/products/dehydrated-banana',
  '/products/dehydrated-strawberries',
  '/products/blueberry',
  '/products/raw-cashewnuts',
  '/products/immunity-shield-superfood-mix',
];

const files = walk('.');
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const trimmed = txt.trimStart();
  const isClient = trimmed.startsWith("'use client'") || trimmed.startsWith('"use client"');

  if (txt.includes('blogs-database') || txt.includes('recipes-database')) {
    console.log(`${isClient ? '[CLIENT-DB-IMPORT]' : '[SERVER-DB-IMPORT]'} ${f}`);
  }

  for (const r of REDIRECT_SOURCES) {
    // Match exact href or string literal
    const regex = new RegExp(`['"\`]${r.replace(/\//g, '\\/')}['"\`?#]`, 'g');
    if (regex.test(txt)) {
      console.log(`[REDIRECT-SOURCE-REF] ${f} -> ${r}`);
    }
  }

  if (txt.includes('?category=')) {
    console.log(`[QUERY-CATEGORY-REF] ${f}`);
  }
}
