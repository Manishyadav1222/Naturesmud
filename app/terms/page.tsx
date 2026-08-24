import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Nature\'s Mud',
  description: 'Terms and conditions for using Nature\'s Mud website and services.',
};

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using the Nature\'s Mud website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.' },
  { title: '2. Products & Pricing', content: 'All product descriptions, images, and pricing are subject to change without notice. We reserve the right to modify or discontinue products at any time. Prices are listed in Nepalese Rupees (NPR) and include applicable taxes unless stated otherwise.' },
  { title: '3. Orders & Payment', content: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received in full before order processing. We accept eSewa, Khalti, FonePay, Stripe, and Cash on Delivery.' },
  { title: '4. Shipping & Delivery', content: 'We aim to deliver within 2-5 business days within Kathmandu Valley and 3-7 business days for other regions. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery.' },
  { title: '5. Returns & Refunds', content: 'Please refer to our Return Policy for details on returns, exchanges, and refunds. Products must be returned in their original condition within 7 days of delivery.' },
  { title: '6. Intellectual Property', content: 'All content on this website, including text, graphics, logos, images, and software, is the property of Nature\'s Mud and protected by copyright laws. You may not reproduce or use any content without our written permission.' },
  { title: '7. Limitation of Liability', content: 'Nature\'s Mud shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the products.' },
  { title: '8. Governing Law', content: 'These terms are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.' },
  { title: '9. Contact', content: 'For questions about these terms, contact us at support@naturesmud.com or +977 971-3888002.' },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Terms & Conditions</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Terms & Conditions</h1>
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