<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/v1/products/chia-seeds', 'GET', [], [], [], ['HTTP_ACCEPT' => 'application/json']);
$response = $kernel->handle($request);
echo $response->getContent();
