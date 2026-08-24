# Nature's Mud - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NATURE'S MUD ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │   Frontend   │    │   Laravel    │    │  Admin API   │    │  MySQL   │  │
│  │  (Next.js)   │◄───►│   Backend    │◄───►│  (Node.js)   │◄───►│ Database │  │
│  │   Port 3000  │    │   Port 8000  │    │   Port 4000  │    │ Port 3306│  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────┘  │
│         │                    │                    │                │        │
│         │                    │                    │                │        │
│         ▼                    ▼                    ▼                ▼        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    SHARED DATABASE: natures_mud                       │  │
│  │  • users (customers)    • products     • orders     • categories     │  │
│  │  • wishlist             • reviews      • coupons    • recipes        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  ADMIN DATABASE: natures_mud_admin                    │  │
│  │  • admin_users          • roles          • permissions                │  │
│  │  • refresh_tokens       • activity_logs  • settings                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Public Customer Flow (Frontend → Laravel)
1. Customer visits Next.js frontend (port 3000)
2. Frontend calls Laravel API (port 8000) for:
   - Products, categories, blogs, recipes
   - Cart/checkout operations
   - User authentication (Sanctum tokens)
3. Laravel reads/writes to shared database `natures_mud`

### Admin Flow (Admin Panel → Admin API)
1. Admin logs into admin panel (served by Next.js or separate)
2. Admin panel calls Admin API (port 4000) for:
   - Dashboard stats, orders, customers management
   - Product/category CRUD (writes to Laravel DB)
   - Admin user management (reads/writes to admin DB)
3. Admin API:
   - Reads orders/customers/products from Laravel DB (`natures_mud`)
   - Manages admin users/roles/permissions in Admin DB (`natures_mud_admin`)

## Database Separation Rationale

| Database | Purpose | Managed By |
|----------|---------|------------|
| `natures_mud` | **Customer-facing data**: products, orders, customers, content | Laravel (primary), Admin API (read + limited write) |
| `natures_mud_admin` | **Admin system data**: admin users, roles, permissions, audit logs | Admin API (exclusive) |

This separation ensures:
- Admin credentials never mix with customer data
- Admin schema changes don't affect customer-facing operations
- Clear security boundaries
- Independent scaling

## API Endpoints

### Laravel API (Customer-facing) - `/api/v1/`
```
GET    /products              # List products
GET    /products/{slug}       # Product detail
GET    /categories            # List categories
GET    /blogs                 # List blog posts
GET    /recipes               # List recipes
POST   /login                 # Customer login
POST   /register              # Customer registration
POST   /orders                # Place order (guest or authenticated)
GET    /orders/track          # Track order by number + phone

Authenticated (Sanctum):
GET    /me                    # Current user profile
GET    /orders                # User's orders
GET    /wishlist              # User's wishlist
POST   /wishlist              # Add to wishlist
DELETE /wishlist/{product}    # Remove from wishlist
```

### Admin API - `/api/admin/`
```
POST   /auth/login            # Admin login
POST   /auth/refresh          # Refresh access token
POST   /auth/logout           # Logout
GET    /auth/me               # Current admin user

Dashboard:
GET    /dashboard/stats       # Dashboard statistics

Orders:
GET    /orders                # List orders (with filters)
GET    /orders/:id            # Order detail
PUT    /orders/:id            # Update order
PUT    /orders/:id/status     # Update order status

Customers:
GET    /customers             # List customers
GET    /customers/:id         # Customer detail

Products:
GET    /products              # List products (admin view)
GET    /products/:id          # Product detail
POST   /products              # Create product
PUT    /products/:id          # Update product
DELETE /products/:id          # Delete product

Categories:
GET    /categories            # List categories
POST   /categories            # Create category
PUT    /categories/:id        # Update category
DELETE /categories/:id        # Delete category

Recipes:
GET    /recipes               # List recipes
GET    /recipes/:id           # Recipe detail
POST   /recipes               # Create recipe
PUT    /recipes/:id           # Update recipe
DELETE /recipes/:id           # Delete recipe

Blog:
GET    /blog                  # List blog posts
POST   /blog                  # Create blog post
PUT    /blog/:id              # Update blog post
DELETE /blog/:id              # Delete blog post
```

## Security Boundaries

### Authentication Systems
- **Customers**: Laravel Sanctum (API tokens)
- **Admins**: Admin API JWT (access + refresh tokens)

### Authorization
- **Customers**: Role-based (customer role via Spatie)
- **Admins**: RBAC with hierarchical roles + granular permissions

### CORS Policy
- Frontend (localhost:3000) → Laravel API: Allowed
- Frontend (localhost:3000) → Admin API: Allowed
- Admin Panel → Admin API: Allowed
- No cross-origin requests from unknown domains

## Deployment Architecture

```
Production:
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer (Nginx)                   │
│                         Port 80/443                          │
└──────────────┬──────────────────────┬────────────────────────┘
               │                      │
       ┌───────▼───────┐      ┌───────▼───────┐
       │   Frontend    │      │   Admin API   │
       │   (Next.js)   │      │   (Node.js)   │
       │   Port 3000   │      │   Port 4000   │
       └───────┬───────┘      └───────┬───────┘
               │                      │
       ┌───────▼──────────────────────▼───────┐
       │          Laravel Backend             │
       │            Port 8000                 │
       └──────────────┬───────────────────────┘
                      │
       ┌──────────────▼──────────────┐
       │       MySQL Database        │
       │   natures_mud +             │
       │   natures_mud_admin         │
       │        Port 3306            │
       └─────────────────────────────┘
```

## Environment Variables

### Frontend (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# ... other public configs
```

### Laravel Backend (.env)
```bash
APP_ENV=production
APP_KEY=base64:...
DB_DATABASE=natures_mud
DB_USERNAME=...
DB_PASSWORD=...
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Admin API (.env)
```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=mysql://user:pass@host:3306/natures_mud_admin
LARAVEL_DB_HOST=host
LARAVEL_DB_DATABASE=natures_mud
LARAVEL_DB_USER=...
LARAVEL_DB_PASSWORD=...
JWT_SECRET=... (min 32 chars, generated with openssl rand -base64 32)
JWT_REFRESH_SECRET=... (min 32 chars)
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

## Common Issues & Solutions

### Issue: "Why two databases?"
**Answer**: Security separation. Admin credentials (with full system access) must never share a database with customer data. If Laravel DB is compromised, admin system remains secure.

### Issue: "Admin API writes to Laravel DB directly?"
**Answer**: Yes, for products/categories/orders management. This avoids API round-trip Laravel → Admin API. Admin API has direct DB access for write operations on catalog data.

### Issue: "How to sync admin users with Laravel?"
**Answer**: They don't sync. Admin users are completely separate from customer users. Admin panel is for staff only.

### Issue: "Frontend calls which API?"
**Answer**: 
- Customer operations → Laravel API (`/api/v1/`)
- Admin panel operations → Admin API (`/api/admin/`)
- They are completely separate