<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_product_with_all_fields()
    {
        $category = Category::factory()->create();
        
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-001',
            'description' => 'Test description',
            'short_description' => 'Short desc',
            'price' => 100.00,
            'compare_at_price' => 150.00,
            'cost_price' => 50.00,
            'stock_quantity' => 10,
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => true,
            'is_best_seller' => false,
            'is_new' => true,
            'weight' => 100.00,
            'unit' => 'g',
            'images' => ['/products/test.jpg'],
            'ingredients' => ['Ingredient 1', 'Ingredient 2'],
            'nutrition_facts' => [['label' => 'Calories', 'value' => '100 kcal']],
            'benefits' => ['Benefit 1', 'Benefit 2'],
            'usage_instructions' => 'Use as directed',
            'storage_instructions' => 'Store in cool place',
            'meta_title' => 'Test Product SEO',
            'meta_description' => 'SEO description',
            'meta_keywords' => 'test, product',
        ]);

        $this->assertDatabaseHas('products', [
            'slug' => 'test-product',
            'name' => 'Test Product',
        ]);
        
        $this->assertEquals('test-product', $product->slug);
        $this->assertEquals(100.00, $product->price);
        $this->assertTrue($product->is_featured);
        $this->assertIsArray($product->images);
        $this->assertIsArray($product->ingredients);
    }

    /** @test */
    public function it_has_correct_casts()
    {
        $product = Product::factory()->create([
            'images' => ['/products/test1.jpg', '/products/test2.jpg'],
            'ingredients' => ['Ingredient 1'],
            'nutrition_facts' => [['label' => 'Calories', 'value' => '100']],
            'benefits' => ['Benefit 1'],
            'price' => '99.99',
            'compare_at_price' => '149.99',
        ]);

        $this->assertIsArray($product->images);
        $this->assertIsArray($product->ingredients);
        $this->assertIsArray($product->nutrition_facts);
        $this->assertIsArray($product->benefits);
        $this->assertIsFloat($product->price);
        $this->assertIsFloat($product->compare_at_price);
        $this->assertIsBool($product->is_active);
        $this->assertIsBool($product->is_featured);
    }

    /** @test */
    public function it_uses_slug_as_route_key()
    {
        $product = Product::factory()->create(['slug' => 'my-product']);
        
        $this->assertEquals('slug', $product->getRouteKeyName());
    }

    /** @test */
    public function it_belongs_to_category()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id]);
        
        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($category->id, $product->category->id);
    }

    /** @test */
    public function it_has_searchable_array_for_meilisearch()
    {
        $product = Product::factory()->create([
            'name' => 'Organic Honey',
            'description' => 'Pure organic honey from Himalayas',
            'short_description' => 'Raw honey',
        ]);
        
        $searchable = $product->toSearchableArray();
        
        $this->assertArrayHasKey('id', $searchable);
        $this->assertArrayHasKey('name', $searchable);
        $this->assertArrayHasKey('description', $searchable);
        $this->assertArrayHasKey('short_description', $searchable);
        $this->assertArrayHasKey('category', $searchable);
    }
}