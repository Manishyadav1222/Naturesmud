const fs = require('fs');
const path = 'admin-server/src/services/auth.service.ts';
let content = fs.readFileSync(path, 'utf8');

content = content
  .replace(/user\.twoFactorEnabled/g, 'user.isTwoFactorEnabled')
  .replace(/twoFactorEnabled: true/g, 'isTwoFactorEnabled: true')
  .replace(/twoFactorEnabled: false/g, 'isTwoFactorEnabled: false')
  .replace(
    `module: 'AUTH',
        details: 'User logged in successfully',`,
    `entityType: 'AUTH',
        meta: { message: 'User logged in successfully' },`
  );

fs.writeFileSync(path, content, 'utf8');
console.log('Done - replacements applied');
</write_to_file>
</write_to_file>
<task_progress>
- [x] Explore existing codebase patterns (types, api-client, components)
- [x] Review Prisma schema for remaining models
- [x] Build Recipe CMS
- [x] Build Media Library/Gallery
- [x] Build Marketing index page
- [x] Build Marketing Campaigns page
- [x] Build Marketing Coupons page
- [x] Build Marketing Social page
- [x] Build Reviews moderation
- [x] Build Analytics & Reports
- [x] Build Messages
- [x] Build Users & Roles
- [x] Build Notifications
- [x] Build Settings
- [x] Build Blog create page
- [x] Build Blog detail page
- [x] Build Blog edit page
- [x] Fix corrupted Modal.tsx
- [ ] Fix admin-server type errors
- [ ] Verify all routes compile
</task_progress>
</write_to_file>
</write_to_file>