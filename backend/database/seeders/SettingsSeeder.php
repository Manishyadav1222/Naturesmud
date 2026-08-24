<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'store_name', 'value' => ['en' => 'Nature\'s Mud'], 'group' => 'general'],
            ['key' => 'store_phone', 'value' => ['en' => '+9779713888002'], 'group' => 'general'],
            ['key' => 'store_email', 'value' => ['en' => 'support@naturesmud.com'], 'group' => 'general'],
            ['key' => 'free_shipping_threshold', 'value' => ['en' => 3000], 'group' => 'shipping'],
            ['key' => 'shipping_fee', 'value' => ['en' => 200], 'group' => 'shipping'],
            ['key' => 'whatsapp_number', 'value' => ['en' => '+9779713888002'], 'group' => 'integrations'],
            ['key' => 'currency', 'value' => ['en' => 'NPR'], 'group' => 'general'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}