# Nature's Mud — Production Deployment Guide

Target: **Ubuntu 24.04 LTS** · **Nginx** · **Docker** · **Cloudflare** · **Let's Encrypt**

---

## 1. Server Preparation

```bash
# SSH into your Ubuntu 24.04 server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker

# Install Git
sudo apt install -y git

# Add deploy user
sudo adduser deploy
sudo usermod -aG docker deploy
```

---

## 2. DNS Setup

Point your domain to the server **before** installing SSL:

| Type | Name             | Value         | Proxy  |
|------|------------------|---------------|--------|
| A    | naturesmud.com   | server-ip     | Cloudflare (orange) |
| A    | www              | server-ip     | Cloudflare (orange) |
| A    | api              | server-ip     | Cloudflare (grey — DNS only) |

> Backend API should bypass Cloudflare proxy during initial setup to avoid SSL conflicts.

---

## 3. Clone & Configure

```bash
cd /var/www
sudo git clone https://github.com/yourorg/natures-mud.git
cd natures-mud
sudo chown -R deploy:deploy /var/www/natures-mud
```

### Backend `.env`

```bash
cd backend
cp .env.example .env
nano .env
```

Key production values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://naturesmud.com
DB_HOST=mysql
DB_DATABASE=natures_mud
DB_USERNAME=naturesmud
DB_PASSWORD=<strong-password>
REDIS_HOST=redis
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=<strong-meili-key>
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>
```

### Frontend `.env`

```bash
cd ..
cp .env.example .env.local
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://naturesmud.com/api
NEXT_PUBLIC_SITE_URL=https://naturesmud.com
NEXT_PUBLIC_WHATSAPP_NUMBER=9779713888002
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello Nature's Mud! I would like to know more about your products.
```

### Root `.env` (Docker Compose)

```bash
cp .env.example .env
nano .env
```

```env
DB_DATABASE=natures_mud
DB_USERNAME=naturesmud
DB_PASSWORD=<strong-password>
DB_ROOT_PASSWORD=<strong-root-password>
MEILISEARCH_KEY=<strong-meili-key>
NEXT_PUBLIC_API_URL=https://naturesmud.com/api
NEXT_PUBLIC_SITE_URL=https://naturesmud.com
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>
```

---

## 4. Build & Start

```bash
# Build all images
docker compose build

# Start services
docker compose up -d

# Verify
docker compose ps
```

---

## 5. Backend Setup (First Run)

```bash
# Generate app key
docker compose exec backend php artisan key:generate

# Run migrations & seeders
docker compose exec backend php artisan migrate --seed --force

# Create storage symlink
docker compose exec backend php artisan storage:link

# Cache config & routes
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache
docker compose exec backend php artisan view:cache

# Import Meilisearch indexes
docker compose exec backend php artisan scout:import "App\Models\Product"
docker compose exec backend php artisan scout:import "App\Models\Recipe"
docker compose exec backend php artisan scout:import "App\Models\BlogPost"

# Create admin user
docker compose exec backend php artisan tinker --execute="
  App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@naturesmud.com',
    'password' => bcrypt('ChangeMe123!'),
    'role' => 'admin',
    'is_active' => true,
  ]);
"

# Restart Horizon for queue workers
docker compose restart horizon
```

---

## 6. SSL (Let's Encrypt via Certbot)

```bash
# Install certbot
sudo apt install -y certbot

# Obtain certificate (domain must point to server)
sudo certbot certonly --standalone -d naturesmud.com -d www.naturesmud.com

# Copy certs to deploy directory referenced by nginx.conf
sudo mkdir -p /var/www/natures-mud/deploy/certbot/conf/live/naturesmud.com
sudo cp /etc/letsencrypt/live/naturesmud.com/fullchain.pem \
  /var/www/natures-mud/deploy/certbot/conf/live/naturesmud.com/
sudo cp /etc/letsencrypt/live/naturesmud.com/privkey.pem \
  /var/www/natures-mud/deploy/certbot/conf/live/naturesmud.com/

# Set up auto-renewal (cron)
sudo crontab -e
# Add:
# 0 3 * * * certbot renew --quiet --deploy-hook "cp /etc/letsencrypt/live/naturesmud.com/*.pem /var/www/natures-mud/deploy/certbot/conf/live/naturesmud.com/ && docker compose -f /var/www/natures-mud/docker-compose.yml restart nginx"
```

---

## 7. Cloudflare Configuration

1. Set SSL/TLS mode to **Full (strict)**.
2. Enable **Brotli** and **gzip** compression.
3. Enable **HTTP/2** / **HTTP/3** support.
4. Configure **Caching**:
   - Static assets (`*.css`, `*.js`, `*.webp`, `*.avif`, `*.png`, `*.jpg`): 1 month cache.
   - HTML (`/`): 0 cache, `Cache-Control: no-cache` (ISR handles revalidation).
   - `/api/*`: Standard.
5. Enable **WAF** rules to protect `/admin` with IP allowlist.
6. Add **Page Rules**:
   - `https://naturesmud.com/*` → Browser Cache TTL: 1 month.
   - `https://naturesmud.com/api/*` → Cache Level: Bypass.

---

## 8. Backups

Add a cron job for daily database + storage backups:

```bash
sudo crontab -e
# Daily 2 AM
# 0 2 * * * docker compose -f /var/www/natures-mud/docker-compose.yml exec -T mysql mysqldump -u root -p<DB_ROOT_PASSWORD> natures_mud | gzip > /backups/naturesmud_$(date +\%Y\%m\%d).sql.gz
# 0 3 * * * tar -czf /backups/naturesmud_storage_$(date +\%Y\%m\%d).tar.gz -C /var/www/natures-mud/backend/storage app
```

Keep the last 30 days:

```bash
# Add: find /backups -name "*.gz" -mtime +30 -delete
```

---

## 9. Deploy Updates

```bash
cd /var/www/natures-mud
git pull origin main

# Frontend rebuild
docker compose build frontend
docker compose up -d frontend

# Backend migrations (if changed)
docker compose exec backend php artisan migrate --force

# Cache refresh
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache

# Restart
docker compose restart
```

---

## 10. Monitoring & Logs

| Service     | Command                                    |
|-------------|--------------------------------------------|
| All services | `docker compose ps`                       |
| Frontend    | `docker compose logs -f frontend`          |
| Backend     | `docker compose logs -f backend`           |
| MySQL       | `docker compose logs -f mysql`             |
| Horizon     | `docker compose logs -f horizon`           |
| Nginx       | `docker compose logs -f nginx`             |

Database monitoring:

```bash
docker compose exec mysql mysql -u root -p natures_mud -e "SHOW PROCESSLIST;"
```

---

## 11. Performance Checklist

- [x] Cloudflare CDN active with Orange cloud
- [x] Meilisearch replacing SQL LIKE queries
- [x] Redis cache for sessions/cache/queues
- [x] Image optimization (WebP/AVIF) through Next.js + Cloudinary
- [x] Gzip + Brotli compression
- [x] HTTP/2 & HTTP/3
- [x] Laravel OPcache enabled
- [x] Next.js standalone build
- [x] ISR for product/blog/recipe pages

---

## 12. Security Checklist

- [x] HTTPS enforced (301 redirect)
- [x] HSTS enabled
- [x] Secure cookies (`APP_URL` https, `SESSION_SECURE_COOKIE=true`)
- [x] CSRF protection
- [x] Input validation & rate limiting
- [x] Cloudflare WAF protecting `/admin`
- [x] Database accessible only inside Docker network (ports exposed to localhost only)
- [x] `.env` excluded from version control
- [x] Regular dependency updates (`composer update`, `npm audit fix`)