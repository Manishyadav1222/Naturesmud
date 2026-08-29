<?php
require_once "/home8/kathma13/api.naturesmud.shop/vendor/autoload.php";
$app = require_once "/home8/kathma13/api.naturesmud.shop/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
$items = DB::table("products")
    ->whereIn("slug", ["dehydrated-mango", "dehydrated-apple", "dehydrated-pineapple", "raw-himalayan-almonds", "roasted-cashewnuts"])
    ->select("id", "name", "slug", "image")
    ->get();

echo "PRODUCTS TABLE:
";
print_r($items);

$images = DB::table("product_images")
    ->whereIn("product_id", $items->pluck("id"))
    ->get();
echo "PRODUCT_IMAGES TABLE:
";
print_r($images);
