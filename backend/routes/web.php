<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => "Nature's Mud API",
        'version' => '1.0.0',
        'status' => 'active',
        'admin_panel' => url('/admin')
    ]);
});
