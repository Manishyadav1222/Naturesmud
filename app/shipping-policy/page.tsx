import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Nature\'s Mud',
  description: 'Shipping information, delivery times, and costs for Nature\'s Mud orders across Nepal.',
};

const zones = [
  { zone: 'Kathmandu Valley', time: '1-2 business days', cost: 'Rs. 100 (Free over Rs. 3,000)' },
  { zone: 'Major Cities (Pokhara, Chitwan, Butwal, etc.)', time: '2-4 business days', cost: 'Rs. 150 (Free over Rs. 3,000)' },
  { zone: 'Other Regions', time: '3-7 business days', cost: 'Rs. 200 (Free over Rs. 3,000)' },
  { zone: 'Remote / Hilly Areas', time: '5-10 business days', cost: 'Calculated at checkout' },
];

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Shipping Policy</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Shipping Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F8F4EC] rounded-3xl p-6 sm:p-8 mb-8">
            <h2 className="font-heading font-bold text-xl mb-4">🚚 Free Shipping Over Rs. 3,000</h2>
            <p className="text-gray-600 leading-relaxed">
              Enjoy free delivery on all orders above Rs. 3,000 anywhere in Nepal. Orders below this amount are charged a flat shipping fee based on your location.
            </p>
          </div>

          <h2 className="font-heading font-bold text-xl mb-4">Delivery Zones & Times</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F4EC]">
                  <th className="text-left px-4 py-3 rounded-l-xl">Zone</th>
                  <th className="text-left px-4 py-3">Delivery Time</th>
                  <th className="text-left px-4 py-3 rounded-r-xl">Cost</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.zone} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{zone.zone}</td>
                    <td className="px-4 py-3">{zone.time}</td>
                    <td className="px-4 py-3">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl mb-3">Order Processing</h2>
              <p className="text-gray-600 leading-relaxed">
                Orders are processed within 24 hours of confirmation (excluding weekends and public holidays). You will receive a confirmation email with your order number and tracking details once your order ships.
              </p>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl mb-3">Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                Once your order ships, you can track it using the <Link href="/track-order" className="text-[#3A6B35] font-medium hover:underline">Track Order</Link> page with your order number.
              </p>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl mb-3">Delivery Notes</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Please ensure someone is available to receive your delivery.</li>
                <li>For Cash on Delivery orders, please have the exact amount ready.</li>
                <li>If delivery is attempted and no one is available, our courier will contact you to reschedule.</li>
                <li>Delivery times are estimates and may vary due to weather or other circumstances.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}