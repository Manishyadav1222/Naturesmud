<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_products()
    {
        $category = Category::factory()->create(['slug' => 'organic']);
        Product::factory()->count(5)->create([
            'category_id' => $category->id,
            'is_active' => true,
        ]);
        Product::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'price', 'category']
                ],
                'links',
                'meta'
            ]);
        
        $this->assertCount(5, $response->json('data.data'));
    }

    /** @test */
    public function it_can_filter_products_by_category()
    {
        $organic = Category::factory()->create(['slug' => 'organic']);
        $nuts = Category::factory()->create(['slug' => 'nuts']);
        
        Product::factory()->count(3)->create(['category_id' => $organic->id, 'is_active' => true]);
        Product::factory()->count(2)->create(['category_id' => $nuts->id, 'is_active' => true]);

        $response = $this->getJson('/api/v1/products?category=organic');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data.data'));
    }

    /** @test */
    public function it_can_search_products()
    {
        Product::factory()->create(['name' => 'Organic Honey', 'is_active' => true]);
        Product::factory()->create(['name' => 'Organic Almonds', 'is_active' => true]);
        Product::factory()->create(['name' => 'Beetroot Powder', 'is_active' => true]);

        $response = $this->getJson('/api/v1/products?q=honey');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
        $this->assertStringContainsString('Honey', $response->json('data.data.0.name'));
    }

    /** @test */
    public function it_can_show_a_single_product()
    {
        $product = Product::factory()->create(['slug' => 'test-product', 'is_active' => true]);

        $response = $this->getJson("/api/v1/products/{$product->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $product->id,
                'slug' => 'test-product',
            ]);
    }

    /** @test */
    public function it_returns_404_for_nonexistent_product()
    {
        $response = $this->getJson('/api/v1/products/nonexistent');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_get_related_products()
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'is_active' => true]);
        Product::factory()->count(5)->create(['category_id' => $category->id, 'is_active' => true]);

        $response = $this->getJson("/api/v1/products/{$product->slug}/related");

        $response->assertStatus(200);
        $this->assertCount(4, $response->json()); // Limited to 4
        foreach ($response->json() as $related) {
            $this->assertNotEquals($product->id, $related['id']);
            $this->assertEquals($category->id, $related['category_id']);
        }
    }

    /** @test */
    public function it_respects_pagination_limit()
    {
        Product::factory()->count(50)->create(['is_active' => true]);

        $response = $this->getJson('/api/v1/products?per_page=10');

        $response->assertStatus(200);
        $this->assertCount(10, $response->json('data.data'));
        $this->assertEquals(10, $response->json('data.per_page'));
    }

    /** @test */
    public function it_can_sort_products()
    {
        Product::factory()->create(['price' => 100, 'is_active' => true, 'created_at' => now()->subDays(2)]);
        Product::factory()->create(['price' => 50, 'is_active' => true, 'created_at' => now()->subDay()]);
        Product::factory()->create(['price' => 200, 'is_active' => true, 'created_at' => now()]);

        $response = $this->getJson('/api/v1/products?sort=price_asc');
        $prices = array_column($response->json('data.data'), 'price');
        $this->assertEquals([50, 100, 200], $prices);

        $response = $this->getJson('/api/v1/products?sort=price_desc');
        $prices = array_column($response->json('data.data'), 'price');
        $this->assertEquals([200, 100, 50], $prices);
    }
}