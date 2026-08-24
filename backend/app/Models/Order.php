<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_REFUNDED = 'refunded';

    public const PAYMENT_PENDING = 'pending';
    public const PAYMENT_PAID = 'paid';
    public const PAYMENT_FAILED = 'failed';
    public const PAYMENT_REFUNDED = 'refunded';

    protected $fillable = [
        'user_id', 'order_number', 'status', 'payment_status', 'payment_method',
        'subtotal', 'discount', 'shipping_fee', 'tax', 'total',
        'coupon_code', 'shipping_name', 'shipping_phone', 'shipping_email',
        'shipping_address', 'shipping_city', 'shipping_zone', 'shipping_country',
        'billing_address', 'notes', 'gift_note', 'tracking_number',
        'receipt_image', 'payment_reference', 'is_valley',
        'paid_at', 'shipped_at', 'delivered_at', 'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function recordStatusHistory(string $status, ?string $paymentStatus = null, ?string $note = null, ?int $changedBy = null): OrderStatusHistory
    {
        return $this->statusHistories()->create([
            'status' => $status,
            'payment_status' => $paymentStatus,
            'note' => $note,
            'changed_by' => $changedBy,
        ]);
    }

    public function getCustomerNameAttribute(): string
    {
        return $this->shipping_name ?? $this->user?->name ?? 'Guest';
    }

    public static function generateOrderNumber(): string
    {
        return 'NM-' . strtoupper(uniqid());
    }
}