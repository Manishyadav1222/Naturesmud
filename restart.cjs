const ftp = require('basic-ftp');

(async () => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: '167.235.9.123',
      user: 'kathma13',
      password: '2*5Qt7iSrB7-Uz',
      secure: false
    });
    
    // Touch restart.txt to force Passenger reload
    const { Readable } = require('stream');
    await client.uploadFrom(Readable.from([new Date().toISOString()]), '/naturesmud.shop/tmp/restart.txt');
    console.log('✅ Passenger restart triggered!');

    client.close();
  } catch (e) {
    console.error('FTP Error:', e);
  }
})();
