const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

const config = {
  host: '167.235.9.123',
  username: 'kathma13',
  password: '2*5Qt7iSrB7-Uz',
  homeDir: '/home8/kathma13',
  rootDir: path.resolve(__dirname, '..')
};

async function deploy() {
  console.log('=== Deploying Backend and Admin Server Updates to Nest Nepal ===\n');
  const client = new ftp.Client();
  client.timeout = 60000;

  try {
    await client.access({
      host: config.host,
      user: config.username,
      password: config.password,
      secure: false
    });
    console.log('✅ FTP Connected successfully!');

    // 1. Deploy Laravel Backend files
    console.log('\n[1/3] Deploying Laravel backend changes...');
    const orderControllerLocal = path.join(config.rootDir, 'backend', 'app', 'Http', 'Controllers', 'Api', 'OrderController.php');
    const apiRoutesLocal = path.join(config.rootDir, 'backend', 'routes', 'api.php');

    console.log('  -> Uploading OrderController.php to /api.naturesmud.shop/app/Http/Controllers/Api/ ...');
    await client.uploadFrom(orderControllerLocal, '/api.naturesmud.shop/app/Http/Controllers/Api/OrderController.php');
    console.log('  ✅ OrderController.php uploaded!');

    console.log('  -> Uploading routes/api.php to /api.naturesmud.shop/routes/ ...');
    await client.uploadFrom(apiRoutesLocal, '/api.naturesmud.shop/routes/api.php');
    console.log('  ✅ api.php uploaded!');

    // 2. Deploy Admin Server dist files
    console.log('\n[2/3] Deploying Admin server compiled files...');
    const laravelDbJs = path.join(config.rootDir, 'admin-server', 'dist', 'services', 'laravelDb.js');
    const ordersRoutesJs = path.join(config.rootDir, 'admin-server', 'dist', 'routes', 'orders.routes.js');

    console.log('  -> Uploading dist/services/laravelDb.js to /admin-api.naturesmud.shop/dist/services/ ...');
    await client.uploadFrom(laravelDbJs, '/admin-api.naturesmud.shop/dist/services/laravelDb.js');
    console.log('  ✅ laravelDb.js uploaded!');

    console.log('  -> Uploading dist/routes/orders.routes.js to /admin-api.naturesmud.shop/dist/routes/ ...');
    await client.uploadFrom(ordersRoutesJs, '/admin-api.naturesmud.shop/dist/routes/orders.routes.js');
    console.log('  ✅ orders.routes.js uploaded!');

    // 3. Restart passenger app for admin-api
    console.log('\n[3/3] Triggering Passenger restart for admin-api...');
    const restartFileLocal = path.join(config.rootDir, 'scratch', 'restart.txt');
    fs.writeFileSync(restartFileLocal, new Date().toISOString());
    try {
      await client.uploadFrom(restartFileLocal, '/admin-api.naturesmud.shop/tmp/restart.txt');
      console.log('  ✅ Restart signal sent to admin-api!');
    } catch (rErr) {
      console.log('  ⚠️ Restart note (dir may not exist):', rErr.message);
    }

    console.log('\n🎉 Backend and Admin Server successfully deployed to production!');
  } catch (err) {
    console.error('Deployment error:', err);
    throw err;
  } finally {
    client.close();
  }
}

deploy();
