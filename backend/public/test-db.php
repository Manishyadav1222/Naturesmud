<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

DB::enableQueryLog();

try {
    $router = app('router');
    $route = collect($router->getRoutes()->getRoutes())->first(function($r) {
        return $r->uri() === 'api/v1/products/{product}';
    });
    
    $instance = new \App\Models\Product;
    $field = $route ? $route->bindingFieldFor('product') : 'NOT_FOUND_ROUTE';
    
    $result = $instance->resolveRouteBinding('chia-seeds', $field === 'NOT_FOUND_ROUTE' ? null : $field);
    
    echo json_encode([
        "field" => $field,
        "product_id" => $result ? $result->id : null,
        "queries" => DB::getQueryLog()
    ]);
} catch (\Exception $e) {
    echo json_encode([
        "error" => $e->getMessage(),
        "queries" => DB::getQueryLog()
    ]);
}
