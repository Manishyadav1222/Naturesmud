<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@naturesmud.com'],
            [
                'name' => 'Nature\'s Mud Admin',
                'phone' => '+9779713888002',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        // Roles & Permissions
        $roles = ['super-admin', 'admin', 'manager', 'customer'];
        foreach ($roles as $role) {
            Role::updateOrCreate(['name' => $role]);
        }

        $permissions = [
            'view products', 'create products', 'edit products', 'delete products',
            'view orders', 'edit orders', 'delete orders',
            'view customers', 'edit customers', 'delete customers',
            'view categories', 'create categories', 'edit categories', 'delete categories',
            'view coupons', 'create coupons', 'edit coupons', 'delete coupons',
            'view inventory', 'edit inventory',
            'view blogs', 'create blogs', 'edit blogs', 'delete blogs',
            'view recipes', 'create recipes', 'edit recipes', 'delete recipes',
            'view media', 'upload media', 'delete media',
            'view homepage sections', 'edit homepage sections',
            'view banners', 'create banners', 'edit banners', 'delete banners',
            'view reviews', 'approve reviews', 'delete reviews',
            'view reports', 'view analytics', 'view settings', 'edit settings',
            'manage seo', 'manage roles', 'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        $admin->assignRole('super-admin');
        Role::findByName('super-admin')->syncPermissions($permissions);
        Role::findByName('admin')->syncPermissions($permissions);
        Role::findByName('manager')->syncPermissions(array_filter($permissions, fn ($p) => !str_contains($p, 'delete') && !str_contains($p, 'manage roles')));

        // Demo customer
        User::updateOrCreate(
            ['email' => 'customer@naturesmud.com'],
            [
                'name' => 'Demo Customer',
                'phone' => '+9779800000000',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        )->assignRole('customer');

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            ContentSeeder::class,
            SettingsSeeder::class,
            ReelSeeder::class,
        ]);
    }
}