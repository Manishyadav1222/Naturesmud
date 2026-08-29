import { PaymentMethod } from '@/store/order-store';

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  subtitle: string;
  badge?: string;
  color: string;
  iconName: string;
  instructions: string;
}

export const NEPAL_PAYMENT_METHODS: PaymentOption[] = [
  {
    id: 'esewa',
    name: 'eSewa Mobile Wallet',
    subtitle: 'Fast, secure Nepal digital wallet',
    badge: 'Popular',
    color: '#60BB46',
    iconName: 'Smartphone',
    instructions: 'You will be prompted to authorize payment via your eSewa ID or eSewa App.',
  },
  {
    id: 'khalti',
    name: 'Khalti Digital Wallet',
    subtitle: 'Pay via Khalti balance or eBanking',
    badge: 'Instant',
    color: '#5C2D91',
    iconName: 'CreditCard',
    instructions: 'Enter your Khalti registered mobile number and MPIN to complete payment.',
  },
  {
    id: 'fonepay',
    name: 'FonePay Direct QR',
    subtitle: 'Scan with any Nepal bank mobile app',
    badge: 'Quick QR',
    color: '#E31B23',
    iconName: 'QrCode',
    instructions: 'Scan the dynamic FonePay QR code using your mobile banking app.',
  },
  {
    id: 'card',
    name: 'Visa / Mastercard / SCT',
    subtitle: 'Debit or Credit card via secure gateway',
    color: '#1E3A8A',
    iconName: 'CreditCard',
    instructions: 'Protected with 3D Secure 2.0 and SCT Nepal inter-bank network.',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    subtitle: 'Pay cash or scan QR upon delivery',
    badge: 'Zero Risk',
    color: '#365314',
    iconName: 'Truck',
    instructions: 'Pay in cash or request a physical QR code scanner from our courier rider.',
  },
];

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  referenceNumber: string;
  message: string;
  paidAt: string;
}

export async function processNepalPayment(
  method: PaymentMethod,
  amount: number,
  orderNumber: string
): Promise<PaymentResult> {
  // Simulate network latency for payment processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const transactionId = `TXN-${method.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const referenceNumber = `REF-${orderNumber}-${Date.now().toString().slice(-4)}`;

  return {
    success: true,
    transactionId,
    referenceNumber,
    message:
      method === 'cod'
        ? 'Order placed successfully! Please pay on arrival.'
        : `Payment of NPR ${amount.toLocaleString()} received via ${method.toUpperCase()}.`,
    paidAt: new Date().toISOString(),
  };
}
