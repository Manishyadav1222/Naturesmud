const https = require('https');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function saveFile(remoteDir, fileName, content) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      dir: remoteDir,
      file: fileName,
      content: content,
      encoding: 'utf-8'
    });

    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/save_file_content',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.write(postData);
    req.end();
  });
}

const prodFrontendEnv = `# ── Nature's Mud — Production Frontend Environment (Nest Nepal) ───────────────
NODE_ENV=production
PORT=3000

# API Base URL (Laravel backend on api.naturesmud.shop)
NEXT_PUBLIC_API_URL=https://api.naturesmud.shop/api

# Admin API Base URL (Node.js admin server on admin-api.naturesmud.shop)
NEXT_PUBLIC_ADMIN_API_URL=https://admin-api.naturesmud.shop/api/admin

# Site URL
NEXT_PUBLIC_SITE_URL=https://naturesmud.shop

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=9779713888002
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello Nature's Mud! I would like to know more about your products.

# Server rewrites for Next.js Node.js server
INTERNAL_API_URL=https://api.naturesmud.shop/api
INTERNAL_ADMIN_API_URL=https://admin-api.naturesmud.shop/api/admin

# Database credentials (cPanel MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kathma13_natures_mud
DB_USERNAME=kathma13_muduser
DB_PASSWORD=2*5Qt7iSrB7-Uz
`;

async function main() {
  console.log('Writing production .env to naturesmud.shop...');
  const res = await saveFile(`${config.homeDir}/naturesmud.shop`, '.env', prodFrontendEnv);
  console.log('Status:', res.status === 1 ? '✅ Saved' : JSON.stringify(res));
}

main().catch(console.error);
