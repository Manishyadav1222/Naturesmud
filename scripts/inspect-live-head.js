const https = require('https');

function checkDomain(domain) {
  https.get(`https://${domain}`, (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
      console.log(`\n=== INSPECTING ${domain} (Status ${res.statusCode}) ===`);
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      console.log('TITLE:', titleMatch ? titleMatch[1] : 'NONE');

      const links = html.match(/<link[^>]+>/gi) || [];
      console.log('\nLINK TAGS:');
      links.filter(l => l.includes('icon') || l.includes('manifest') || l.includes('canonical')).forEach(l => {
        console.log(' ', l);
      });

      const metaOg = html.match(/<meta[^>]+>/gi) || [];
      console.log('\nMETA OG & SITE:');
      metaOg.filter(m => m.includes('og:') || m.includes('name="title"') || m.includes('application-name')).forEach(m => {
        console.log(' ', m);
      });
    });
  }).on('error', err => console.error(`${domain} ERROR:`, err.message));
}

checkDomain('naturesmud.shop');
checkDomain('naturesmud.com');
