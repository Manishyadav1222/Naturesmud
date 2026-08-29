<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_order()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/orders', [
            'items' => [
                ['product_id' => 1, 'quantity' => 2],
                ['product_id' => 2, 'quantity' => 1],
            ],
            'shipping_address' => [
                'name' => 'John Doe',
                'phone' => '9876543210',
                'address' => '123 Main St',
                'city' => 'Kathmandu',
                'province' => 'Bagmati',
                'zip' => '44600',
            ],
            'payment_method' => 'cod',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'order' => ['order_number', 'status', 'total', 'items']
            ]);
    }

    /** @test */
    public function it_can_list_user_orders()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Order::factory()->count(3)->create(['user_id' => $user->id]);
        Order::factory()->create(['user_id' => 999]); // Other user's order

        $response = $this->getJson('/api/v1/orders');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function it_can_track_an_order()
    {
        $order = Order::factory()->create(['order_number' => 'ORD-12345']);

        $response = $this->getJson("/api/v1/orders/track/{$order->order_number}");

        $response->assertStatus(200)
            ->assertJson([
                'order_number' => 'ORD-12345',
            ]);
    }

    /** @test */
    public function it_returns_404_for_invalid_tracking_number()
    {
        $response = $this->getJson('/api/v1/orders/track/INVALID');

        $response->assertStatus(404);
    }
}