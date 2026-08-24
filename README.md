# 🌿 Nature's Mud — Premium Organic eCommerce

A modern, premium, fully responsive eCommerce platform for **Nature's Mud**, a Nepal-based organic and healthy food brand.

> 🚚 Free Shipping Over Rs. 10,000 · 🌿 100% Natural · 🇳🇵 Proudly Made in Nepal

---

## ✨ Features

### Frontend (Next.js 15 + React 19)
- Server Components with ISR/SSR
- Framer Motion & GSAP scroll animations
- SwiperJS product carousels
- Floating WhatsApp chat button (+977 9713888002)
- Zustand cart/wishlist state management
- Full eCommerce flow: catalog → cart → checkout → order tracking
- Recipes, Blog, Health Benefits content hub
- SEO: sitemap, robots, JSON-LD (Product/Recipe/Organization/FAQ), OpenGraph, Twitter Cards
- Design system: Poppins + Inter, organic palette (#3A6B35, #7AA95C, #F8F4EC, #7B5E3B, #D9A441)

### Backend (Laravel 12 + PHP 8.4)
- REST API with Laravel Sanctum token auth
- MySQL 8 database (migrations + seeders)
- Redis cache/sessions/queues + Laravel Horizon
- Meilisearch full-text search
- Cloudinary image storage
- Filament 3 admin panel (Products, Orders, Categories, Users)
- Local payment integration ready: eSewa, Khalti, FonePay, Stripe, COD
- Email: SMTP/Mailtrap/SendGrid ready
- SEO: automatic sitemap, robots.txt, schema.org

### Infrastructure
- Docker Compose: MySQL 8, Redis 7, Meilisearch, Laravel, Next.js, Nginx, Horizon
- Ubuntu 24.04 LTS production guide with Cloudflare + Let's Encrypt SSL
- CDN, compression, browser caching, WAF

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PHP 8.4+ with Composer (or Docker)
- MySQL 8 (or Docker)

### 1. Frontend (standalone with mock data)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```

The frontend works out-of-the-box with rich local mock data. Connect the Laravel API by setting `NEXT_PUBLIC_API_URL` in `.env.local`.

### 2. Backend (Laravel API)

```bash
cd backend

# Install dependencies
composer install

# Configure
cp .env.example .env
php artisan key:generate

# Configure DB in .env, then:
php artisan migrate --seed

# Storage link for uploads
php artisan storage:link

# Start server
php artisan serve
# → http://localhost:8000
```

### 3. Full Stack (Docker)

```bash
# 1. Configure environment
cp .env.example .env              # root Docker env
cd backend && cp .env.example .env && cd ..

# 2. Build & start all services
docker compose up -d --build

# 3. Backend setup
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan storage:link

# 4. Meilisearch indexing
docker compose exec backend php artisan scout:import "App\Models\Product"

# Frontend → http://localhost:3000
# Backend API → http://localhost:8000/api
# Admin Panel → http://localhost:8000/admin
# Meilisearch → http://localhost:7700
```

---

## 🧪 Testing

### Frontend

```bash
npm run lint          # ESLint
npm run build         # TypeScript + production build verification
```

### Backend

```bash
cd backend
php artisan test                              # All tests
php artisan test --filter=ProductApiTest      # Specific test
vendor/bin/pest                                # If using Pest
```

### Manual Test Checklist

| Area | Test |
|------|------|
| Products | List, filter by category, sort, search, detail page |
| Cart | Add, remove, quantity update, drawer, coupon, persist on reload |
| Checkout | Guest + registered flow, shipping address, payment method selection |
| Wishlist | Add/remove, persists, shows in header count |
| WhatsApp | Button visible on all pages, opens WhatsApp with pre-filled message |
| Responsive | Mobile (375px), tablet (768px), desktop (1440px) |
| SEO | Meta tags, structured data, sitemap.xml, robots.txt |

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── products/           # Catalog listing + detail
│   ├── recipes/            # Recipe hub + detail
│   ├── blog/               # Blog hub + post
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── about/              # About Us
│   ├── our-story/          # Brand story
│   ├── contact/            # Contact page
│   ├── faq/                # FAQ page
│   ├── wholesale/          # B2B wholesale
│   ├── become-distributor/ # Distribution
│   ├── health-benefits/    # Health hub
│   ├── track-order/        # Order tracking
│   └── ...                 # Legal pages
├── components/             # Reusable UI components
├── lib/
│   ├── data/               # Mock data (products, categories, recipes, content)
│   ├── store/              # Zustand stores (cart, wishlist, ui)
│   └── types.ts            # TypeScript interfaces
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Laravel API controllers
│   │   ├── Models/                  # Eloquent models
│   │   └── Filament/Resources/     # Admin panel resources
│   ├── database/
│   │   ├── migrations/              # Schema (categories, products, orders, ...)
│   │   └── seeders/                 # Demo data
│   └── routes/api.php               # API routes
├── docker-compose.yml       # Full infrastructure
├── deploy/nginx.conf        # Production reverse proxy
└── docs/
    ├── API.md               # API documentation
    └── DEPLOYMENT.md        # Production deployment guide
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login → Bearer token |
| GET | `/api/products` | Product listing (filter/sort/search) |
| GET | `/api/products/{slug}` | Product detail |
| GET | `/api/categories` | Category listing |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/track/{number}` | Track order |
| GET | `/api/wishlist` | User wishlist |
| POST | `/api/newsletter` | Newsletter subscribe |

Full documentation: [`docs/API.md`](docs/API.md)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Green | `#3A6B35` |
| Secondary Green | `#7AA95C` |
| Cream | `#F8F4EC` |
| Brown | `#7B5E3B` |
| Gold Accent | `#D9A441` |
| Dark Text | `#2B2B2B` |
| Headings | Poppins |
| Body | Inter |
| Buttons | Poppins SemiBold |

---

## 🔐 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=9779713888002
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello Nature's Mud! I would like to know more about your products.
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

### Backend (`.env`)
```env
APP_NAME="Nature's Mud"
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=natures_mud
DB_USERNAME=root
DB_PASSWORD=
REDIS_HOST=127.0.0.1
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
CLOUDINARY_URL=
```

---

## 🔧 Configuration

### Meilisearch Search

```env
# backend/.env
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

Use [Meilisearch Cloud](https://www.meilisearch.com/cloud) for managed search, or self-host via Docker.

### Redis

```env
# backend/.env
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Cloudinary

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@cloud_name
```

### Payment Gateways

```env
ESEWA_MERCHANT_CODE=
KHALTI_SECRET_KEY=
FONEPAY_MERCHANT_CODE=
STRIPE_KEY=
STRIPE_SECRET=
```

---

## 📄 License

Proprietary — © 2026 Nature's Mud. All rights reserved.

---

## 🙏 Support

- Email: hello@naturesmud.com
- Phone: +977 9713888002
- WhatsApp: [Chat with us](https://wa.me/9779713888002?text=Hello%20Nature's%20Mud!%20I%20would%20like%20to%20know%20more%20about%20your%20products.)