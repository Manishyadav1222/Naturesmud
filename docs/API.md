# Nature's Mud — API Documentation

Base URL: `https://api.naturesmud.com/api` (production) · `http://localhost:8000/api` (local)

All responses are JSON. Authenticated endpoints require a Bearer token:

```
Authorization: Bearer <token>
```

---

## Authentication

### Register

```
POST /auth/register
```

| Field    | Type   | Required |
|----------|--------|----------|
| name     | string | yes      |
| email    | string | yes      |
| phone    | string | no       |
| password | string | yes (min 8) |

**Response:** `201`

```json
{
  "user": { "id": 1, "name": "Ramesh", "email": "ramesh@example.com" },
  "token": "1|abc123..."
}
```

### Login

```
POST /auth/login
```

| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | yes      |
| password | string | yes      |
| device_name | string | no    |

**Response:** `200` — same shape as register.

### Logout

```
POST /auth/logout
```

Requires auth. Revokes the current token.

### Me

```
GET /auth/me
```

Requires auth. Returns the authenticated user.

---

## Products

### List Products

```
GET /products
```

| Query Param | Type    | Description                          |
|-------------|---------|--------------------------------------|
| category    | string  | Category slug                        |
| search      | string  | Meilisearch full-text search         |
| sort        | string  | `price_asc`, `price_desc`, `newest`, `popular`, `rating` |
| min_price   | number  | Minimum price                        |
| max_price   | number  | Maximum price                        |
| page        | number  | Pagination (default 1)               |
| per_page    | number  | Items per page (default 12, max 48)  |

**Response:** `200`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Himalayan Walnuts",
      "slug": "himalayan-walnuts",
      "sku": "NM-WAL-001",
      "price": 450,
      "compare_at_price": 550,
      "rating": 4.8,
      "review_count": 124,
      "in_stock": true,
      "is_best_seller": true,
      "image": "https://res.cloudinary.com/...",
      "category": { "id": 1, "name": "Nuts", "slug": "nuts" }
    }
  ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "path": "...",
    "per_page": 12,
    "to": 12,
    "total": 58
  }
}
```

### Product Detail

```
GET /products/{slug}
```

**Response:** `200` — full product with `gallery`, `nutrition`, `ingredients`, `benefits`, `usage`, `storage`, `related_products`, `reviews`.

### SEO Sitemap URLs

```
GET /products/seo-sitemap
```

Returns all product slugs for sitemap generation.

---

## Categories

### List Categories

```
GET /categories
```

Returns categories with product counts.

### Category Detail

```
GET /categories/{slug}
```

Returns category + paginated products.

---

## Recipes & Blog

```
GET /recipes
GET /recipes/{slug}
GET /blog
GET /blog/{slug}
```

Public endpoints. Include `?page=1` for pagination.

---

## Orders

All endpoints below require authentication.

### Place Order

```
POST /orders
```

| Field            | Type   | Required |
|------------------|--------|----------|
| items            | array  | yes      |
| items[].product_id | number | yes   |
| items[].quantity   | number | yes   |
| shipping_name    | string | yes      |
| shipping_phone   | string | yes      |
| shipping_email   | string | yes      |
| shipping_address | string | yes      |
| shipping_city    | string | yes      |
| shipping_zone    | string | no       |
| shipping_country | string | yes      |
| payment_method   | string | yes (`cod`, `esewa`, `khalti`, `fonepay`, `stripe`) |
| coupon_code      | string | no       |
| notes            | string | no       |
| gift_note        | string | no       |

**Response:** `201`

```json
{
  "order": {
    "id": 128,
    "order_number": "NM-65A1B2C3D4",
    "status": "pending",
    "payment_status": "pending",
    "total": 2450,
    "items": [...]
  },
  "message": "Order placed successfully"
}
```

### List My Orders

```
GET /orders
```

### Track Order (Public)

```
GET /orders/track/{order_number}
```

### List My Wishlist

```
GET /wishlist
```

### Add to Wishlist

```
POST /wishlist
```

| Field      | Type   | Required |
|------------|--------|----------|
| product_id | number | yes      |

### Remove from Wishlist

```
DELETE /wishlist/{product_id}
```

---

## Content & Misc

```
GET /health-benefits
GET /faqs
GET /pages/{slug}          (privacy-policy, terms, shipping-policy, return-policy)
```

### Newsletter Subscribe

```
POST /newsletter
```

| Field | Type   | Required |
|-------|--------|----------|
| email | string | yes      |

**Response:** `200` — `{ "message": "Subscribed successfully" }`

### Track Order

```
POST /track-order
```

| Field        | Type   | Required |
|--------------|--------|----------|
| order_number | string | yes      |

---

## Payment Gateways

After placing an order, initiate payment through the selected gateway:

- **eSewa:** `POST /payments/esewa/initiate` with `{ order_number, amount }` — returns a redirect URL.
- **Khalti:** `POST /payments/khalti/initiate` — returns a Khalti payment URL.
- **FonePay:** `POST /payments/fonepay/initiate`.
- **Stripe:** `POST /payments/stripe/initiate`.

Webhook endpoints receive status callbacks from each gateway and update payment status automatically.

---

## Error Format

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

| Status | Meaning                          |
|--------|----------------------------------|
| 401    | Unauthenticated / invalid token  |
| 403    | Forbidden                        |
| 404    | Resource not found               |
| 422    | Validation error                 |
| 429    | Rate limit exceeded              |

---

## Rate Limiting

- Public endpoints: 60 requests/minute/IP
- Authenticated endpoints: 120 requests/minute/user

---

## Security

- CSRF protection on web routes
- Sanctum token authentication for API
- Input validation on every request
- Rate limiting middleware
- HTTPS-only in production (secure cookies)

---

## Meilisearch

Products, categories, recipes and blog posts are indexed in Meilisearch. The search index key uses the `MEILISEARCH_KEY` env variable. Re-index with:

```bash
php artisan scout:import "App\Models\Product"
php artisan scout:import "App\Models\Recipe"
php artisan scout:import "App\Models\BlogPost"