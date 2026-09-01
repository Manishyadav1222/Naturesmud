<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'product_id', 'product_name', 'product_sku',
        'quantity', 'unit_price', 'line_total',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    protected $appends = ['product_image'];

    public function getProductImageAttribute(): ?string
    {
        if ($this->product && !empty($this->product->images)) {
            $imgs = is_array($this->product->images) ? $this->product->images : json_decode($this->product->images, true);
            if (!empty($imgs) && is_array($imgs)) {
                return $imgs[0];
            }
        }
        return $this->product?->image ?? '/products/sweet-potato-powder.jpg';
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}