<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_categories()
    {
        Category::factory()->count(5)->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'product_count']
                ]
            ]);
        
        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function it_can_show_a_single_category_with_products()
    {
        $category = Category::factory()->create(['slug' => 'organic', 'is_active' => true]);
        Category::factory()->count(3)->create(['category_id' => $category->id, 'is_active' => true]);

        $response = $this->getJson("/api/v1/categories/{$category->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $category->id,
                'slug' => 'organic',
            ]);
    }
}