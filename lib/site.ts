export const siteConfig = {
  name: "Nature's Mud",
  alternateNames: ['naturesmud', 'naturesmud.com', 'naturesmud.shop', 'Nature Mud', "Nature's Mud Nepal"],
  tagline: 'Pure Food · Real Nature · 100% Chemical-Free Himalayan Nutrition',
  description:
    "Nature's Mud Nepal (naturesmud.com / naturesmud.shop) delivers premium dehydrated fruits, organic superfood powders (Sweet Potato, Beetroot, Carrot, Dates), and mountain nuts sourced directly from pristine Himalayan valleys. 100% natural, 0% added sugar or preservatives.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://naturesmud.com',
  secondaryUrl: 'https://naturesmud.shop',
  primaryDomain: 'naturesmud.com',
  mirrorDomain: 'naturesmud.shop',
  phone: '+977 9713888002',
  secondaryPhone: '+977 9713888002',
  whatsappNumber: '9779713888002',
  whatsappMessage: "Hello Nature's Mud Nepal! I would like to order organic superfoods & dehydrated fruits.",
  email: 'info@naturesmud.com',
  secondaryEmail: 'info@naturesmud.shop',
  address: 'Samakhushi, Gongabu Chowk, Kathmandu, Nepal',
  locationDetails: {
    headquarters: 'Samakhushi, Gongabu Chowk (near Kumari Bank), Kathmandu, Nepal',
    outlets: [
      'Kids Kottage — Arya Complex, Gongabu Chowk, Kathmandu (Ph: 9802323451)',
      'Kids Kottage — Kupondol, Lalitpur & Kapan, Kathmandu',
      'Kids Kottage — Pokhara',
      'Zero to Ten — Chabahil, Kathmandu',
      'Baby Love — Hetauda',
    ],
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61589084257990',
    instagram: 'https://instagram.com/naturesmud',
    tiktok: 'https://www.tiktok.com/@naturesmud',
    youtube: 'https://youtube.com/@naturesmud',
  },
  freeShippingThreshold: 10000,
  currency: 'Rs.',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Festival Offers', href: '/offers' },
  { label: 'Our Story', href: '/about' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'Catalog', href: '/catalog' },
    { label: 'About Us & Sourcing', href: '/about' },
    { label: 'Our Himalayan Story', href: '/about#sourcing-journey' },
    { label: 'Festival Offers & Combos', href: '/offers' },
    { label: 'Health & Nutrition Blog', href: '/blog' },
    { label: 'Wellness Recipes', href: '/recipes' },
    { label: 'Contact & Showrooms', href: '/contact' },
  ],
  products: [
    { label: 'Solar-Dehydrated Fruits', href: '/products?category=dried-fruits' },
    { label: 'Organic Superfood Powders', href: '/products?category=powders' },
    { label: 'Mountain Nuts & Cashews', href: '/products?category=nuts' },
    { label: 'Organic Seeds (Chia & Pumpkin)', href: '/products?category=seeds' },
    { label: 'Cold-Pressed Virgin Oils', href: '/products?category=oils' },
    { label: 'Himalayan Rock Salts', href: '/products?category=salts-spices' },
  ],
  support: [
    { label: 'FAQ & Help', href: '/faq' },
    { label: 'Track My Order', href: '/track-order' },
    { label: 'Shipping Across Nepal', href: '/shipping-policy' },
    { label: 'Return & Refund Policy', href: '/return-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
  business: [
    { label: 'Catalog', href: '/Nature_Mud_Product_Catalog.pdf' },
    { label: 'Wholesale Inquiries', href: '/wholesale' },
    { label: 'Become a Retail Distributor', href: '/become-distributor' },
  ],
};