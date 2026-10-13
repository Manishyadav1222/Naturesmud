const BASE_URL = 'https://naturesmud.shop';

const TOP_NEPALI_LAYER_SLUGS = [
  'sweet-potato-powder',
  'dates-powder',
  'banana-powder',
  'carrot-powder',
  'freeze-dried-avocado-powder',
  'beetroot-powder',
  'moringa-leaf-powder',
  'strawberry-powder',
  'chia-seeds',
  'pumpkin-seeds',
  'raw-himalayan-almonds',
  'virgin-coconut-oil-500ml',
];

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function run() {
  console.log('=== 1. VERIFYING LIVE keyword_map.csv ===');
  const csvRes = await fetch(`${BASE_URL}/keyword_map.csv?_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  const csvText = await csvRes.text();
  const csvLines = csvText.trim().split('\n');
  console.log(
    JSON.stringify(
      {
        url: `${BASE_URL}/keyword_map.csv`,
        status: csvRes.status,
        totalRows: csvLines.length - 1,
        header: csvLines[0],
        sampleRow1: csvLines[1]?.slice(0, 180),
      },
      null,
      2
    )
  );

  console.log('\n=== 2. VERIFYING LIVE NEPALI LAYER (lang="ne") ON TOP PRIORITY PRODUCTS ===');
  for (const slug of TOP_NEPALI_LAYER_SLUGS) {
    const res = await fetch(`${BASE_URL}/products/${slug}?_t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    const html = await res.text();
    const hasLangNeBlock = /lang="ne"/i.test(html);
    const hasNepaliHeading = /नेपालीमा संक्षिप्त जानकारी र प्रयोग विधि/.test(html);
    const hasSajiwan = slug === 'moringa-leaf-powder' ? /सजिवन \/ सहिजन पातको पाउडर/.test(html) : undefined;
    console.log(
      JSON.stringify({
        slug,
        status: res.status,
        hasLangNeBlock,
        hasNepaliHeading,
        ...(hasSajiwan !== undefined ? { hasSajiwan } : {}),
      })
    );
  }

  console.log('\n=== 3. VERIFYING LIVE /faq PAGE & JSON-LD ===');
  const faqRes = await fetch(`${BASE_URL}/faq?_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  const faqHtml = await faqRes.text();
  const faqTitle = decodeHtml((faqHtml.match(/<title>([^<]+)<\/title>/i) || [])[1] || '');
  const faqDesc = decodeHtml(
    (faqHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || [])[1] || ''
  );
  const hasHoneyMention = /Mustang Honey|honey crystallization/i.test(faqHtml);
  const hasSajiwanFaq = /Sajiwan|सजिवन/.test(faqHtml);
  console.log(
    JSON.stringify(
      {
        url: `${BASE_URL}/faq`,
        status: faqRes.status,
        title: faqTitle,
        titleLen: faqTitle.length,
        desc: faqDesc,
        descLen: faqDesc.length,
        hasHoneyMention,
        hasSajiwanFaq,
      },
      null,
      2
    )
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
