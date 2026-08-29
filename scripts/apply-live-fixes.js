const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const config = {
  host: '167.235.9.123',
  port: 2083,
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13'
};

const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');

function uploadFile(localPath, remoteDir, remoteFileName) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const fileData = fs.readFileSync(localPath);
    
    const header = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="dir"\r\n\r\n` +
      `${remoteDir}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="overwrite"\r\n\r\n` +
      `1\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file-1"; filename="${remoteFileName}"\r\n` +
      `Content-Type: image/jpeg\r\n\r\n`
    );
    
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const contentLength = header.length + fileData.length + footer.length;
    
    const req = https.request({
      hostname: config.host,
      port: config.port,
      path: '/execute/Fileman/upload_files',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': contentLength
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
    req.write(header);
    req.write(fileData);
    req.write(footer);
    req.end();
  });
}

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
      res.on('end', () => resolve(data));
    });

    req.write(postData);
    req.end();
  });
}

async function fixLiveIssues() {
  console.log('1. Uploading missing combo images to live server...');
  const combosLocal = path.join(__dirname, '../public/images/combos');
  
  await uploadFile(
    path.join(combosLocal, 'baby-weaning-combo.jpg'),
    `${config.homeDir}/naturesmud.shop/public/images/combos`,
    'baby-weaning-combo.jpg'
  );
  console.log('   Uploaded baby-weaning-combo.jpg ✅');

  await uploadFile(
    path.join(combosLocal, 'sports-nutrition-combo.jpg'),
    `${config.homeDir}/naturesmud.shop/public/images/combos`,
    'sports-nutrition-combo.jpg'
  );
  console.log('   Uploaded sports-nutrition-combo.jpg ✅');

  console.log('2. Updating .htaccess with HTTPS redirect rule...');
  const htaccessContent = `# BEGIN HTTPS Force Redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# END HTTPS Force Redirect

# BEGIN cPanel-generated php ini directives, do not edit
<IfModule php8_module>
   php_value error_log "/home8/kathma13/logs/php.error.log"
   php_flag log_errors On
</IfModule>
<IfModule lsapi_module>
   php_value error_log "/home8/kathma13/logs/php.error.log"
   php_flag log_errors On
</IfModule>
# END cPanel-generated php ini directives, do not edit

# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home8/kathma13/naturesmud.shop"
PassengerBaseURI "/"
PassengerNodejs "/home8/kathma13/nodevenv/naturesmud.shop/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
`;

  await saveFile(`${config.homeDir}/naturesmud.shop`, '.htaccess', htaccessContent);
  console.log('   Updated naturesmud.shop .htaccess with HTTPS enforcement ✅');

  console.log('\nFixes applied successfully!');
}

fixLiveIssues().catch(console.error);
