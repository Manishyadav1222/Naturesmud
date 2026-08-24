<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: #3A6B35; color: white; padding: 24px 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .content h2 { color: #333; margin-top: 0; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d1ecf1; color: #0c5460; }
        .status-delivered { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .status-refunded { background: #e2e3e5; color: #383d41; }
        .order-details { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .order-details table { width: 100%; border-collapse: collapse; }
        .order-details td { padding: 8px 0; border-bottom: 1px solid #eee; }
        .order-details td:last-child { text-align: right; font-weight: 600; }
        .footer { background: #f4f4f4; padding: 20px 30px; text-align: center; color: #888; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nature's Mud - Order Update</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $order->shipping_name }},</h2>
            <p>Your order <strong>#{{ $order->order_number }}</strong> has been updated.</p>
            <p>
                New status:
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucfirst($order->status) }}
                </span>
            </p>
            @if ($order->payment_status)
                <p>Payment status: <strong>{{ ucfirst($order->payment_status) }}</strong></p>
            @endif
            @if ($order->status === 'shipped')
                <p>Your order is on its way! It will be delivered within 1-4 business days.</p>
            @endif
            <div class="order-details">
                <table>
                    @foreach ($order->items as $item)
                        <tr>
                            <td>{{ $item->product_name }} × {{ $item->quantity }}</td>
                            <td>Rs. {{ number_format($item->line_total, 2) }}</td>
                        </tr>
                    @endforeach
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>Rs. {{ number_format($order->total, 2) }}</strong></td>
                    </tr>
                </table>
            </div>
            <p>Track your order anytime at <a href="{{ url('/track-order') }}">Nature's Mud Track Order</a>.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Nature's Mud. All rights reserved.</p>
        </div>
    </div>
</body>
</html>