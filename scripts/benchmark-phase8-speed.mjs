const URLS = [
  'https://naturesmud.shop/',
  'https://naturesmud.shop/products',
  'https://naturesmud.shop/category/powders',
  'https://naturesmud.shop/products/dates-powder',
  'https://naturesmud.shop/products/sweet-potato-powder',
  'https://naturesmud.shop/blog',
  'https://naturesmud.shop/blog/6-month-baby-food-chart-nepal',
  'https://naturesmud.shop/recipes',
  'https://naturesmud.shop/recipes/6-month-baby-sweet-potato-porridge-nepal',
  'https://naturesmud.shop/locations',
  'https://naturesmud.shop/about',
];

async function run() {
  console.log('=== PHASE 8 LIVE SPEED & SSR BENCHMARK ===');
  for (const url of URLS) {
    const t0 = performance.now();
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });
    const ttfb = Math.round(performance.now() - t0);
    const html = await res.text();
    const totalMs = Math.round(performance.now() - t0);
    const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    const ldJsonMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    console.log(
      `${res.status} | TTFB: ${String(ttfb).padStart(4)}ms | Total: ${String(totalMs).padStart(4)}ms | HTML: ${String(Math.round(html.length / 1024)).padStart(4)}KB | H1s: ${h1Matches.length} | JSON-LD: ${ldJsonMatches.length} | Canonical: ${canonicalMatch ? canonicalMatch[1] : 'MISSING'} | ${url}`
    );
  }
}

run();
