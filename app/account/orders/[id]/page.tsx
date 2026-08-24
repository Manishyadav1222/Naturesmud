'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import OrderInvoice from '@/components/OrderInvoice';
import { ordersApi, type Order } from '@/lib/orders-api';

export default function OrderInvoicePage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        // Try to fetch the single order first
        const orderData = await ordersApi.getByNumber(id);
        setOrder(orderData);
      } catch {
        // Fallback: check if it's a demo order stored in sessionStorage
        try {
          const stored = sessionStorage.getItem(`order_${id}`);
          if (stored) {
            setOrder(JSON.parse(stored));
          } else {
            setError('Order not found.');
          }
        } catch {
          setError('Order not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{error || 'Order not found.'}</p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2D5A27] transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <OrderInvoice
          order={{
            orderNumber: order.order_number,
            createdAt: order.created_at,
            customerName: order.shipping_name,
            customerPhone: order.shipping_phone,
            customerEmail: order.shipping_email || undefined,
            shippingAddress: order.shipping_address,
            shippingCity: order.shipping_city,
            shippingProvince: order.shipping_zone || undefined,
            items: order.items.map((it) => ({
              id: it.id,
              name: it.product_name,
              quantity: it.quantity,
              price: Number(it.unit_price) || 0,
            })),
            subtotal: Number(order.subtotal) || 0,
            shippingFee: Number(order.shipping_fee) || 0,
            discount: Number(order.discount) || 0,
            total: Number(order.total) || 0,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            paymentReference: order.payment_reference || undefined,
            receiptUrl: order.receipt_image || undefined,
          }}
        />
      </div>
    </div>
  );
}