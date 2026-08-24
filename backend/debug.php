<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$slug = 'chia-seeds';
$p = \App\Models\Product::where('slug', $slug)->first();
echo "Normal Query: \n";
echo json_encode($p ? $p->toArray() : null) . "\n\n";

echo "Route Binding: \n";
$r = (new \App\Models\Product)->resolveRouteBinding($slug);
echo json_encode($r ? $r->toArray() : null) . "\n\n";
