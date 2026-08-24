const fs = require('fs');
const path = 'admin-server/src/services/auth.service.ts';
let content = fs.readFileSync(path, 'utf8');

content = content
  .replace(/user\.twoFactorEnabled/g, 'user.isTwoFactorEnabled')
  .replace(/twoFactorEnabled: true/g, 'isTwoFactorEnabled: true')
  .replace(/twoFactorEnabled: false/g, 'isTwoFactorEnabled: false')
  .replace(
    "module: 'AUTH',\n        details: 'User logged in successfully',",
    "entityType: 'AUTH',\n        meta: { message: 'User logged in successfully' },"
  );

fs.writeFileSync(path, content, 'utf8');
console.log('Done - replacements applied');