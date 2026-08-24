<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$slug = 'chia-seeds';
$product = \App\Models\Product::where('slug', $slug)->first();
var_dump($product ? $product->toArray() : null);

$productByKey = \App\Models\Product::where((new \App\Models\Product)->getRouteKeyName(), $slug)->first();
var_dump($productByKey ? $productByKey->toArray() : null);

$routeBinding = (new \App\Models\Product)->resolveRouteBinding($slug);
var_dump($routeBinding ? $routeBinding->toArray() : null);
