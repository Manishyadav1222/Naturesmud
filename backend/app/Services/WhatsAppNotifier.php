<?php

namespace App\Services;

use App\Models\Order;

class WhatsAppNotifier
{
    public static function storeNumber(): string
    {
        return config('services.whatsapp.number', '9779713888002');
    }

    public static function waLink(string $phone, string $message): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($phone) <= 10) {
            $phone = '977' . $phone;
        }

        return 'https://wa.me/' . $phone . '?text=' . rawurlencode($message);
    }

    public static function orderStatusMessage(Order $order): string
    {
        $lines = [
            "Namaste {$order->shipping_name} \xF0\x9F\x99\x8F",
            '',
            "Your Nature's Mud order *#{$order->order_number}*",
            'status has been updated to: *' . strtoupper(str_replace('_', ' ', $order->status)) . '*',
        ];

        if ($order->payment_status) {
            $lines[] = 'Payment: ' . ucfirst($order->payment_status);
        }

        if (in_array($order->status, ['shipped', 'delivered'], true) && $order->tracking_number) {
            $lines[] = 'Tracking: ' . $order->tracking_number;
        }

        $lines[] = '';
        $lines[] = 'Order Total: Rs. ' . number_format((float) $order->total, 2);
        $lines[] = "Thank you for choosing Nature's Mud!";

        return implode("\n", $lines);
    }

    public static function notifyOrderStatus(Order $order): string
    {
        return self::waLink($order->shipping_phone, self::orderStatusMessage($order));
    }

    public static function newOrderAdminAlert(Order $order): string
    {
        $lines = [
            "\xF0\x9F\x9B\x92 *New Order #{$order->order_number}*",
            '',
            "Customer: {$order->shipping_name}",
            "Phone: {$order->shipping_phone}",
            "City: {$order->shipping_city}",
            'Total: Rs. ' . number_format((float) $order->total, 2),
            'Payment: ' . strtoupper(str_replace('_', ' ', $order->payment_method)),
            '',
            'Items:',
        ];

        foreach ($order->items as $item) {
            $lines[] = "\xE2\x80\xA2 {$item->product_name} x {$item->quantity}";
        }

        return self::waLink(self::storeNumber(), implode("\n", $lines));
    }
}