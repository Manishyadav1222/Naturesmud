export const siteConfig = {
  name: 'NaturesMud',
  alternateNames: ['naturesmud', 'naturesmud.com', 'naturesmud.shop', 'Nature Mud', 'NaturesMud Nepal'],
  tagline: 'Pure Food · Real Nature · 0 Additives · 0 Preservatives',
  description:
    'NaturesMud Nepal (naturesmud.com / naturesmud.shop) delivers premium naturally dehydrated fruits, organic superfood powders (Sweet Potato, Beetroot, Carrot, Dates), and mountain nuts sourced directly from pristine Himalayan valleys. 0 Additives, 0 Preservatives, 0 Added Sugar.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://naturesmud.com',
  secondaryUrl: 'https://naturesmud.shop',
  primaryDomain: 'naturesmud.com',
  mirrorDomain: 'naturesmud.shop',
  phone: '+977 9819844486',
  secondaryPhone: '+977 9819844486',
  whatsappNumber: '9779819844486',
  whatsappMessage: 'Hello NaturesMud Nepal! I would like to order organic superfoods & naturally dehydrated fruits.',
  email: 'info@naturesmud.shop',
  secondaryEmail: 'info@naturesmud.shop',
  address: 'Kathmandu, Nepal',
  locationDetails: {
    headquarters: 'Kathmandu, Nepal',
    outlets: [
      'Kids Kottage — Arya Complex, Kathmandu (Ph: 9802323451)',
      'Kids Kottage — Kupondol, Lalitpur & Kapan, Kathmandu',
      'Zero to Ten — Chabahil, Kathmandu',
      'Kids Kottage — Surkhet',
      'Kids Kottage — Pokhara',
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
    { label: 'Naturally Dehydrated Fruits', href: '/products?category=dried-fruits' },
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