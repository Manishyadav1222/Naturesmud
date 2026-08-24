<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->orders()->with('items', 'statusHistories')->latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'shipping_name' => ['required', 'string', 'max:255'],
            'shipping_phone' => ['required', 'string', 'max:20'],
            'shipping_email' => ['nullable', 'email'],
            'shipping_address' => ['required', 'string'],
            'shipping_city' => ['required', 'string'],
            'shipping_zone' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:cod,fonepay,esewa,khalti,stripe'],
            'receipt_image' => ['nullable', 'string'],
            'payment_reference' => ['nullable', 'string', 'max:100'],
            'is_valley' => ['nullable', 'boolean'],
            'coupon_code' => ['nullable', 'string'],
            'gift_note' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string'],
        ]);

        $cityLower = strtolower(trim($validated['shipping_city']));
        $valleyCities = ['kathmandu', 'lalitpur', 'bhaktapur', 'patan', 'thimi', 'kirtipur', 'madhyapur thimi', 'gongabu', 'samakhushi', 'kupondol', 'chabahil', 'kapan', 'baluwatar', 'baneshwor', 'maharajgunj'];
        
        $isValley = isset($validated['is_valley']) 
            ? filter_var($validated['is_valley'], FILTER_VALIDATE_BOOLEAN)
            : in_array($cityLower, $valleyCities);

        // Outside Kathmandu Valley Rule: COD is NOT available, advance payment is required
        if (!$isValley && $validated['payment_method'] === 'cod') {
            return response()->json([
                'message' => 'Cash on Delivery (COD) is available exclusively within Kathmandu Valley. For delivery outside the valley, please select FonePay QR / Advance Payment.',
                'errors' => [
                    'payment_method' => ['Advance payment via FonePay is required for outside Kathmandu Valley deliveries.']
                ]
            ], 422);
        }

        return DB::transaction(function () use ($validated, $request, $isValley) {
            $subtotal = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal += $product->price * $item['quantity'];
            }

            $couponDiscount = 0;
            $couponCode = null;

            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])
                    ->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                    })
                    ->first();

                if (!$coupon || ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit)) {
                    return response()->json(['message' => 'Invalid or expired coupon.'], 422);
                }

                if (($coupon->min_order_amount && $subtotal < $coupon->min_order_amount)) {
                    return response()->json(['message' => 'Coupon requires minimum order of Rs. ' . $coupon->min_order_amount], 422);
                }

                $couponDiscount = $coupon->type === 'percentage'
                    ? round($subtotal * $coupon->value / 100, 2)
                    : $coupon->value;

                if ($coupon->max_discount && $couponDiscount > $coupon->max_discount) {
                    $couponDiscount = $coupon->max_discount;
                }

                $couponCode = $coupon->code;
                $coupon->increment('used_count');
            }

            $freeShippingMin = $isValley ? 2000 : 3000;
            $standardShippingFee = $isValley ? 100 : 200;
            $shippingFee = ($subtotal >= $freeShippingMin || $subtotal == 0) ? 0 : $standardShippingFee;
            $total = max(0, $subtotal - $couponDiscount + $shippingFee);

            $hasReceipt = !empty($validated['receipt_image']);
            $isPaidOnline = in_array($validated['payment_method'], ['fonepay', 'esewa', 'khalti', 'stripe']) && $hasReceipt;

            $orderStatus = $isPaidOnline ? 'processing' : 'pending';
            $paymentStatus = $isPaidOnline ? 'paid' : 'pending';

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'order_number' => 'NM-' . strtoupper(Str::random(10)),
                'status' => $orderStatus,
                'payment_status' => $paymentStatus,
                'payment_method' => $validated['payment_method'],
                'subtotal' => $subtotal,
                'discount' => $couponDiscount,
                'shipping_fee' => $shippingFee,
                'tax' => 0,
                'total' => $total,
                'coupon_code' => $couponCode,
                'shipping_name' => $validated['shipping_name'],
                'shipping_phone' => $validated['shipping_phone'],
                'shipping_email' => $validated['shipping_email'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_zone' => $validated['shipping_zone'] ?? null,
                'receipt_image' => $validated['receipt_image'] ?? null,
                'payment_reference' => $validated['payment_reference'] ?? null,
                'is_valley' => $isValley,
                'paid_at' => $isPaidOnline ? now() : null,
                'gift_note' => $validated['gift_note'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'line_total' => $product->price * $item['quantity'],
                ]);

                $product->decrement('stock_quantity', $item['quantity']);
                $product->increment('sold_count', $item['quantity']);
            }

            $historyNote = $isPaidOnline 
                ? 'Order placed with FonePay QR payment slip uploaded. Order is ready to fulfill.' 
                : 'Order placed by customer (Payment: ' . strtoupper($validated['payment_method']) . ').';
            $order->recordStatusHistory($orderStatus, $paymentStatus, $historyNote);

            return response()->json([
                'message' => $isPaidOnline ? 'Order placed and payment received! Your order is ready to process.' : 'Order placed successfully.',
                'order' => $order->load('items', 'statusHistories'),
            ], 201);
        });
    }

    public function status(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->select('id', 'order_number', 'status', 'payment_status', 'created_at', 'total')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json($order);
    }

    public function lookup(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items', 'statusHistories')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json($order);
    }

    public function show(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items', 'statusHistories')
            ->firstOrFail();

        abort_unless($request->user() && (
            $request->user()->id === $order->user_id || $request->user()->hasRole('admin')
        ), 403);

        return response()->json($order);
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string'],
            'phone' => ['required', 'string'],
        ]);

        $order = Order::where('order_number', $validated['order_number'])
            ->where('shipping_phone', $validated['phone'])
            ->with('items', 'statusHistories')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json($order);
    }

    public function cancel(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        abort_unless($request->user()->id === $order->user_id, 403);

        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json(['message' => 'Order cannot be cancelled.'], 422);
        }

        $order->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        $order->recordStatusHistory('cancelled', $order->payment_status, 'Order cancelled by customer.', $request->user()->id);

        foreach ($order->items as $item) {
            if ($item->product_id) {
                Product::where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }
        }

        return response()->json(['message' => 'Order cancelled.']);
    }
}