<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::capture();
DB::enableQueryLog();
try {
    $product = App\Models\Product::resolveRouteBinding('chia-seeds');
    var_dump($product ? $product->id : 'not found');
} catch (Exception $e) {
    echo $e->getMessage();
}
dd(DB::getQueryLog());
