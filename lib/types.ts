export interface Product {
  id: string;
  dbId?: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  shortDescription: string;
  badges: ('new' | 'sale' | 'bestseller' | 'organic' | 'natural-sweetener' | 'superfood' | 'popular' | 'raw' | 'cold-pressed' | string)[];
  stock: number;
  weight: string;
  packing?: string;
  basePrice?: number;
  mrp?: number;
  ingredients: string[];
  benefits: string[];
  nutrition: { label: string; value: string }[];
  usage: string;
  storage: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  tags: string[];
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleNp?: string;
  excerpt: string;
  excerptNp?: string;
  image: string;
  category: 'Nutrition' | 'Health Tips' | 'Lifestyle' | 'Organic Living' | 'Superfoods' | string;
  categoryNp?: string;
  author: string;
  authorNp?: string;
  date: string;
  dateNp?: string;
  readTime: number;
  content: string[];
  contentNp?: string[];
  tags?: string[];
  tagsNp?: string[];
  featured?: boolean;
  isFeatured?: boolean; // Added for admin sync
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  product?: string;
  verified: boolean;
  avatar?: string;
}

export interface CartProductSnapshot {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  weight?: string;
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: CartProductSnapshot;
}

export interface Testimonial {
  id: string;
  author?: string;
  name?: string;
  role: string;
  content?: string;
  comment?: string;
  rating: number;
  avatar?: string;
  video?: string;
}

export interface Reel {
  id: number;
  title: string;
  description: string;
  video_url: string;
  cover_image: string;
  product_name?: string;
  product_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending' | 'confirmed' | 'packed' | 'ready' | string;
  total: number;
  items: { productId: string; name: string; quantity: number; price: number }[];
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    zip: string;
  };
}