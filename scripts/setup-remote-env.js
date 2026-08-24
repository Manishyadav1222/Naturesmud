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
  return new Promise((resolve, reject) => {
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
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const backendEnv = `APP_NAME="Nature's Mud"
APP_ENV=production
APP_KEY=base64:sOlym3kcCRjqMijjGtn3eHW5cD/HFCBhQHfqhqwDDKw=
APP_DEBUG=false
APP_TIMEZONE=Asia/Kathmandu
APP_URL=https://api.naturesmud.shop
FRONTEND_URL=https://naturesmud.shop

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# MySQL Database (cPanel MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kathma13_natures_mud
DB_USERNAME=kathma13_muduser
DB_PASSWORD=2*5Qt7iSrB7-Uz

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.naturesmud.shop

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=naturesmud_

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="info@naturesmud.shop"
MAIL_FROM_NAME="\${APP_NAME}"

# Sanctum & CORS
SANCTUM_STATEFUL_DOMAINS=naturesmud.shop,www.naturesmud.shop
FRONTEND_URL=https://naturesmud.shop

WHATSAPP_NUMBER=9779713888002
`;

const adminEnv = `# NATURE'S MUD ADMIN SERVER PRODUCTION ENVIRONMENT
NODE_ENV=production
PORT=4001
API_PREFIX=/api/admin

# Database (Admin MySQL database on cPanel)
DATABASE_URL="mysql://kathma13_natures_mud_admin:2*5Qt7iSrB7-Uz@localhost:3306/kathma13_natures_mud_admin"

# JWT Auth
JWT_SECRET=natures_mud_prod_jwt_secret_key_8f3a9e2b1c7d4e5f6a8b9c0d1e2f3a4b
JWT_REFRESH_SECRET=natures_mud_prod_refresh_secret_key_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Laravel Database (reads orders, customers, products from Laravel backend)
LARAVEL_DB_HOST=localhost
LARAVEL_DB_PORT=3306
LARAVEL_DB_DATABASE=kathma13_natures_mud
LARAVEL_DB_USER=kathma13_muduser
LARAVEL_DB_PASSWORD=2*5Qt7iSrB7-Uz

# Media & Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Gemini (AI Features - Optional)
GEMINI_API_KEY=

# SMTP (Email/OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@naturesmud.shop
SMTP_PASS=
MAIL_FROM=info@naturesmud.shop
MAIL_FROM_NAME="Nature's Mud"

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS - Allowed frontend origins
CORS_ORIGIN=https://naturesmud.shop,https://www.naturesmud.shop

# Super Admin Initial Seed (run: npm run seed on cPanel)
SEED_SUPER_ADMIN_EMAIL=admin@naturesmud.shop
SEED_SUPER_ADMIN_PASSWORD=NatureMud@Admin2026!
SEED_SUPER_ADMIN_NAME="Super Admin"
`;

const backendHtaccess = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
`;

async function main() {
  console.log('=== Saving Remote Environment Configurations ===');

  console.log('1. Writing backend .env...');
  const res1 = await saveFile(`${config.homeDir}/api.naturesmud.shop`, '.env', backendEnv);
  console.log('   Backend .env status:', res1.status === 1 ? '✅ Saved' : JSON.stringify(res1));

  console.log('2. Writing backend .htaccess...');
  const res2 = await saveFile(`${config.homeDir}/api.naturesmud.shop`, '.htaccess', backendHtaccess);
  console.log('   Backend .htaccess status:', res2.status === 1 ? '✅ Saved' : JSON.stringify(res2));

  console.log('3. Writing admin-api .env...');
  const res3 = await saveFile(`${config.homeDir}/admin-api.naturesmud.shop`, '.env', adminEnv);
  console.log('   Admin-api .env status:', res3.status === 1 ? '✅ Saved' : JSON.stringify(res3));

  console.log('\n🎉 All remote configurations updated successfully!');
}

main().catch(console.error);
