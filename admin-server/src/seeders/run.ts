import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { env } from '../config/env';

const roles = [
  {
    name: 'SUPER_ADMIN',
    description: 'Full access to all features',
  },
  {
    name: 'ADMIN',
    description: 'Administrative access with most permissions',
  },
  {
    name: 'MANAGER',
    description: 'Manage day-to-day operations',
  },
  {
    name: 'MARKETING',
    description: 'Manage marketing campaigns and content',
  },
  {
    name: 'WAREHOUSE',
    description: 'Manage inventory and fulfillment',
  },
  {
    name: 'SUPPORT',
    description: 'Handle customer support and messages',
  },
  {
    name: 'CONTENT_MANAGER',
    description: 'Manage blog and content',
  },
  {
    name: 'VIEWER',
    description: 'Read-only access',
  },
] as const;

// Using RoleName enum values
type RoleType = (typeof roles)[number]['name'];

const allPermissionKeys = [
  // Dashboard
  'dashboard.view',

  // Orders
  'orders.view', 'orders.create', 'orders.edit', 'orders.delete', 'orders.update_status', 'orders.invoice', 'orders.refund',

  // Customers
  'customers.view', 'customers.edit', 'customers.delete', 'customers.reward_points',

  // Products
  'products.view', 'products.create', 'products.edit', 'products.delete',

  // Categories
  'categories.view', 'categories.create', 'categories.edit', 'categories.delete',

  // Inventory
  'inventory.view', 'inventory.edit', 'inventory.adjust',

  // Suppliers
  'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',

  // Marketing
  'marketing.view', 'marketing.campaigns', 'marketing.coupons', 'marketing.flash_sales', 'marketing.social',

  // Reviews
  'reviews.view', 'reviews.moderate', 'reviews.respond',

  // Blog & Recipes
  'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
  'recipes.view', 'recipes.create', 'recipes.edit', 'recipes.delete',

  // Media
  'media.view', 'media.upload', 'media.delete',

  // CMS
  'cms.view', 'cms.edit', 'cms.pages', 'cms.banners',

  // Users
  'users.view', 'users.create', 'users.edit', 'users.delete', 'users.roles',

  // Settings
  'settings.view', 'settings.edit',

  // Reports & Analytics
  'analytics.view', 'reports.view', 'reports.export',
] as const;

type PermissionKey = (typeof allPermissionKeys)[number];

const rolePermissions: Record<RoleType, readonly PermissionKey[]> = {
  SUPER_ADMIN: allPermissionKeys,
  ADMIN: allPermissionKeys,
  MANAGER: [
    'dashboard.view',
    'orders.view', 'orders.create', 'orders.edit', 'orders.update_status', 'orders.invoice', 'orders.refund',
    'customers.view', 'customers.edit', 'customers.reward_points',
    'products.view', 'products.create', 'products.edit',
    'categories.view', 'categories.create', 'categories.edit',
    'inventory.view', 'inventory.edit', 'inventory.adjust',
    'suppliers.view', 'suppliers.create', 'suppliers.edit',
    'reviews.view', 'reviews.moderate', 'reviews.respond',
    'reports.view', 'reports.export',
  ],
  MARKETING: [
    'dashboard.view',
    'marketing.view', 'marketing.campaigns', 'marketing.coupons', 'marketing.flash_sales', 'marketing.social',
    'blog.view', 'blog.create', 'blog.edit',
    'recipes.view', 'recipes.create', 'recipes.edit',
    'media.view', 'media.upload',
    'customers.view',
    'analytics.view', 'reports.view',
  ],
  WAREHOUSE: [
    'dashboard.view',
    'orders.view', 'orders.update_status',
    'products.view',
    'inventory.view', 'inventory.edit', 'inventory.adjust',
    'suppliers.view',
  ],
  SUPPORT: [
    'dashboard.view',
    'orders.view', 'orders.update_status',
    'customers.view', 'customers.edit',
    'reviews.view', 'reviews.respond',
  ],
  CONTENT_MANAGER: [
    'dashboard.view',
    'blog.view', 'blog.create', 'blog.edit', 'blog.delete',
    'recipes.view', 'recipes.create', 'recipes.edit', 'recipes.delete',
    'media.view', 'media.upload', 'media.delete',
    'cms.view', 'cms.edit', 'cms.pages', 'cms.banners',
  ],
  VIEWER: [
    'dashboard.view',
    'orders.view',
    'products.view',
    'categories.view',
    'customers.view',
  ],
};

// Permission display names
const permissionNames: Record<PermissionKey, string> = {
  'dashboard.view': 'View Dashboard',
  'orders.view': 'View Orders',
  'orders.create': 'Create Orders',
  'orders.edit': 'Edit Orders',
  'orders.delete': 'Delete Orders',
  'orders.update_status': 'Update Order Status',
  'orders.invoice': 'View Invoices',
  'orders.refund': 'Process Refunds',
  'customers.view': 'View Customers',
  'customers.edit': 'Edit Customers',
  'customers.delete': 'Delete Customers',
  'customers.reward_points': 'Manage Reward Points',
  'products.view': 'View Products',
  'products.create': 'Create Products',
  'products.edit': 'Edit Products',
  'products.delete': 'Delete Products',
  'categories.view': 'View Categories',
  'categories.create': 'Create Categories',
  'categories.edit': 'Edit Categories',
  'categories.delete': 'Delete Categories',
  'inventory.view': 'View Inventory',
  'inventory.edit': 'Edit Inventory',
  'inventory.adjust': 'Adjust Inventory',
  'suppliers.view': 'View Suppliers',
  'suppliers.create': 'Create Suppliers',
  'suppliers.edit': 'Edit Suppliers',
  'suppliers.delete': 'Delete Suppliers',
  'marketing.view': 'View Marketing',
  'marketing.campaigns': 'Manage Campaigns',
  'marketing.coupons': 'Manage Coupons',
  'marketing.flash_sales': 'Manage Flash Sales',
  'marketing.social': 'Manage Social Media',
  'reviews.view': 'View Reviews',
  'reviews.moderate': 'Moderate Reviews',
  'reviews.respond': 'Respond to Reviews',
  'blog.view': 'View Blog',
  'blog.create': 'Create Blog Posts',
  'blog.edit': 'Edit Blog Posts',
  'blog.delete': 'Delete Blog Posts',
  'recipes.view': 'View Recipes',
  'recipes.create': 'Create Recipes',
  'recipes.edit': 'Edit Recipes',
  'recipes.delete': 'Delete Recipes',
  'media.view': 'View Media',
  'media.upload': 'Upload Media',
  'media.delete': 'Delete Media',
  'cms.view': 'View CMS',
  'cms.edit': 'Edit CMS',
  'cms.pages': 'Manage Pages',
  'cms.banners': 'Manage Banners',
  'users.view': 'View Users',
  'users.create': 'Create Users',
  'users.edit': 'Edit Users',
  'users.delete': 'Delete Users',
  'users.roles': 'Manage Roles',
  'settings.view': 'View Settings',
  'settings.edit': 'Edit Settings',
  'analytics.view': 'View Analytics',
  'reports.view': 'View Reports',
  'reports.export': 'Export Reports',
};

async function seed(force = false) {
  try {
    console.log('🌱 Starting database seeding...');

    const existingRoles = await prisma.role.findFirst();
    if (existingRoles && !force) {
      console.log('✅ Database already seeded. Use --force to re-seed.');
      return;
    }

    if (force) {
      console.log('🧹 Cleaning existing data...');
      await prisma.refreshToken.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.permission.deleteMany({});
      await prisma.role.deleteMany({});
      await prisma.setting.deleteMany({});
    }

    // Create permissions
    console.log('📝 Creating permissions...');
    const permissionIdMap = new Map<string, string>();
    for (const permKey of allPermissionKeys) {
      const existing = await prisma.permission.findUnique({
        where: { key: permKey },
      });
      if (existing) {
        permissionIdMap.set(permKey, existing.id);
      } else {
        const created = await prisma.permission.create({
          data: {
            key: permKey,
            name: permissionNames[permKey],
          },
        });
        permissionIdMap.set(permKey, created.id);
      }
    }

    // Create roles
    console.log('👥 Creating roles...');
    const roleIdMap = new Map<string, string>();
    for (const role of roles) {
      const existing = await prisma.role.findUnique({
        where: { name: role.name },
      });

      const permKeys = rolePermissions[role.name] ?? [];
      const permIds = permKeys.map((k) => ({ id: permissionIdMap.get(k)! }));

      if (existing) {
        await prisma.role.update({
          where: { id: existing.id },
          data: {
            description: role.description,
            permissions: {
              set: permIds,
            },
          },
        });
        roleIdMap.set(role.name, existing.id);
        console.log(`  ✓ Updated role: ${role.name}`);
      } else {
        const created = await prisma.role.create({
          data: {
            name: role.name,
            description: role.description,
            permissions: {
              connect: permIds,
            },
          },
        });
        roleIdMap.set(role.name, created.id);
        console.log(`  ✓ Created role: ${role.name}`);
      }
    }

    // Create super admin
    console.log('👤 Creating super admin...');
    const superAdminRoleId = roleIdMap.get('SUPER_ADMIN');
    if (!superAdminRoleId) {
      throw new Error('Super admin role not found');
    }

    const hashedPassword = await bcrypt.hash(env.SEED_SUPER_ADMIN_PASSWORD, 12);
    const existingAdmin = await prisma.user.findUnique({
      where: { email: env.SEED_SUPER_ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: env.SEED_SUPER_ADMIN_NAME,
          email: env.SEED_SUPER_ADMIN_EMAIL,
          password: hashedPassword,
          roleId: superAdminRoleId,
          avatar: null,
          phone: null,
          isActive: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
      });
      console.log(`  ✅ Super admin created: ${env.SEED_SUPER_ADMIN_EMAIL}`);
    } else {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          roleId: superAdminRoleId,
          isActive: true,
          emailVerifiedAt: existingAdmin.emailVerifiedAt ?? new Date(),
        },
      });
      console.log(`  ✅ Super admin updated: ${env.SEED_SUPER_ADMIN_EMAIL}`);
    }

    // Create default settings
    console.log('⚙️ Creating default settings...');
    await prisma.setting.deleteMany({}); // Clear existing
    const defaultSettings = [
      { key: 'site_name', value: JSON.stringify('Nature Mud'), group: 'general' },
      { key: 'site_email', value: JSON.stringify(env.SEED_SUPER_ADMIN_EMAIL), group: 'general' },
      { key: 'site_phone', value: 'null', group: 'general' },
      { key: 'currency', value: JSON.stringify('NPR'), group: 'general' },
      { key: 'orders_auto_confirm', value: 'false', group: 'orders' },
      { key: 'maintenance_mode', value: 'false', group: 'system' },
    ];
    await prisma.setting.createMany({
      data: defaultSettings,
    });
    console.log('  ✅ Default settings created');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const force = args.includes('--force');
seed(force);