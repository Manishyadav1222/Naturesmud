const ftp = require('basic-ftp');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function checkServerFiles() {
  const client = new ftp.Client();
  await client.access({ host: '167.235.9.123', user: 'kathma13', password: '2*5Qt7iSrB7-Uz', secure: false });

  const php = `<?php
  header('Content-Type: application/json');
  $info = [];
  $info['root_build_id'] = @file_get_contents('/home8/kathma13/naturesmud.shop/.next/BUILD_ID');
  $info['standalone_build_id'] = @file_get_contents('/home8/kathma13/naturesmud.shop/.next/standalone/.next/BUILD_ID');
  $info['standalone_server_exists'] = file_exists('/home8/kathma13/naturesmud.shop/.next/standalone/server.js');
  $info['root_server_js'] = @file_get_contents('/home8/kathma13/naturesmud.shop/server.js');
  
  $rootPageHtml = '/home8/kathma13/naturesmud.shop/.next/server/app/index.html';
  $standalonePageHtml = '/home8/kathma13/naturesmud.shop/.next/standalone/.next/server/app/index.html';
  
  $info['root_index_html_exists'] = file_exists($rootPageHtml);
  $info['standalone_index_html_exists'] = file_exists($standalonePageHtml);
  
  // Look for .next/server/app/
  $appFiles = @scandir('/home8/kathma13/naturesmud.shop/.next/standalone/.next/server/app');
  $info['standalone_app_dir'] = $appFiles;

  echo json_encode($info, JSON_PRETTY_PRINT);
  `;

  const localFile = path.join(__dirname, 'temp_check_files.php');
  fs.writeFileSync(localFile, php);
  await client.uploadFrom(localFile, '/api.naturesmud.shop/public/temp_check_files.php');

  https.get('https://api.naturesmud.shop/temp_check_files.php', { rejectUnauthorized: false }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      console.log('Server Files:', d);
      try {
        await client.remove('/api.naturesmud.shop/public/temp_check_files.php');
      } catch(e) {}
      client.close();
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    });
  });
}

checkServerFiles().catch(console.error);
