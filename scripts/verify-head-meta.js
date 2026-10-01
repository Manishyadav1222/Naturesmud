const https = require('https');

https.get('https://naturesmud.com', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('=== LIVE https://naturesmud.com HEAD & METADATA VERIFICATION ===');
    console.log('Status Code:', res.statusCode);
    console.log('Page Size:', body.length, 'bytes');

    const iconTags = [];
    const reLink = /<link[^>]+>/gi;
    let match;
    while ((match = reLink.exec(body)) !== null) {
      if (match[0].includes('icon') || match[0].includes('manifest')) {
        iconTags.push(match[0]);
      }
    }
    console.log('\n1. Discovered Icon & Manifest Links in <head>:');
    iconTags.forEach(t => console.log('  ', t));

    const metaTags = [];
    const reMeta = /<meta[^>]+>/gi;
    while ((match = reMeta.exec(body)) !== null) {
      if (match[0].includes('og:image') || match[0].includes('twitter:image')) {
        metaTags.push(match[0]);
      }
    }
    console.log('\n2. Discovered OpenGraph & Twitter Cards:');
    metaTags.forEach(t => console.log('  ', t));

    const ldJsonMatch = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ldJsonMatch) {
      try {
        const json = JSON.parse(ldJsonMatch[1]);
        const org = json['@graph']?.find(x => x['@type']?.includes('Organization'));
        console.log('\n3. Schema.org Structured Data:');
        console.log('   Organization Logo:', org?.logo);
        console.log('   Organization Image:', org?.image);
      } catch(e) {
        console.log('JSON parse error:', e.message);
      }
    }

    console.log('\n4. Logo Presence in Page:');
    console.log('   Has /logo.png:', body.includes('logo.png'));
    console.log('   Has /logo-white.png (Footer):', body.includes('logo-white.png'));
  });
});
