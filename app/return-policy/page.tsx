import Link from 'next/link';

export const metadata = {
  title: 'Return Policy | Nature\'s Mud',
  description: 'Return, exchange, and refund policy for Nature\'s Mud products.',
};

const sections = [
  { title: '1. Return Window', content: 'We accept returns within 7 days of delivery. Products must be unused, unopened, and in their original packaging with all seals intact.' },
  { title: '2. Eligibility', content: 'Returns are accepted for damaged, defective, or incorrect items. If you received a product that does not match your order, please contact us within 48 hours of delivery with photos of the issue.' },
  { title: '3. Non-Returnable Items', content: 'For hygiene and safety reasons, opened food products cannot be returned unless they are damaged or defective. Gift cards and promotional items are also non-returnable.' },
  { title: '4. How to Initiate a Return', content: 'Contact our support team at support@naturesmud.com or +977 971-3888002 with your order number and reason for return. We will provide instructions for returning the item.' },
  { title: '5. Refunds', content: 'Once we receive and inspect your returned item, we will process your refund within 5-7 business days. Refunds are issued to your original payment method. Cash on Delivery orders are refunded via bank transfer or eSewa/Khalti.' },
  { title: '6. Exchanges', content: 'If you received a damaged or incorrect item, we will arrange a replacement at no additional cost. Exchanges are subject to product availability.' },
  { title: '7. Shipping Costs for Returns', content: 'If the return is due to our error (damaged, defective, or incorrect item), we will cover the return shipping costs. For other returns, the customer is responsible for return shipping fees.' },
  { title: '8. Contact', content: 'For any return-related questions, contact us at support@naturesmud.com or call +977 971-3888002.' },
];

export default function ReturnPolicyPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Return Policy</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Return Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 2025</p>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading font-bold text-xl mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}