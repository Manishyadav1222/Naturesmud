import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Nature\'s Mud',
  description: 'How Nature\'s Mud collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'We collect information you provide directly, including your name, email address, phone number, shipping address, and payment information when you place an order or create an account.',
      'We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and referring URLs.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'We use your information to process orders, manage your account, provide customer support, send order updates, and improve our products and services.',
      'With your consent, we may send you marketing communications about new products, promotions, and company news. You can opt out at any time.',
    ],
  },
  {
    title: '3. Information Sharing',
    content: [
      'We do not sell your personal information to third parties. We share data only with service providers who help us operate our business, such as payment processors, shipping carriers, and analytics providers.',
      'These partners are contractually obligated to protect your data and use it only for the services they provide to us.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls to protect your personal information.',
      'While no method of transmission over the internet is 100% secure, we work hard to protect your data and regularly review our security practices.',
    ],
  },
  {
    title: '5. Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal information. You may also request a copy of the data we hold about you.',
      'To exercise these rights, contact us at privacy@naturesmud.com. We will respond to your request within 30 days.',
    ],
  },
  {
    title: '6. Cookies',
    content: [
      'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic.',
      'You can control cookies through your browser settings. Disabling cookies may affect certain features of our website.',
    ],
  },
  {
    title: '7. Contact Us',
    content: [
      'If you have questions about this Privacy Policy or our data practices, please contact us at privacy@naturesmud.com or call +977 971-3888002.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-[#F8F4EC] border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-gray-500 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-[#3A6B35]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#3A6B35] font-medium">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#2B2B2B]">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 2025</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-heading font-bold text-xl mb-3">{section.title}</h2>
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}