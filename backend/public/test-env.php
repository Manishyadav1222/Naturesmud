<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());
echo json_encode(["db" => env("DB_DATABASE"), "host" => env("DB_HOST"), "php_sapi" => php_sapi_name()]);
