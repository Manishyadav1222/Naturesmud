# Nature's Mud - Deployment Checklist

## Pre-Deployment Requirements

### 1. Server Setup
- [ ] Ubuntu 22.04+ or similar Linux distribution
- [ ] Docker 24+ and Docker Compose 2+
- [ ] Minimum 4GB RAM, 2 CPU cores (8GB+ recommended)
- [ ] 50GB+ SSD storage
- [ ] Domain names configured (A records pointing to server):
  - `naturesmud.com` → Server IP
  - `www.naturesmud.com` → Server IP
  - `admin.naturesmud.com` → Server IP

### 2. SSL Certificates
- [ ] Run Certbot for initial certificate generation:
  ```bash
  docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
    -d naturesmud.com -d www.naturesmud.com -d admin.naturesmud.com
  ```
- [ ] Verify auto-renewal cron job exists

### 3. Environment Configuration
- [ ] Copy `.env.production.example` to `.env`
- [ ] Generate and fill ALL secrets:
  - `APP_KEY`: `php artisan key:generate --show`
  - `JWT_SECRET`: `openssl rand -base64 32`
  - `JWT_REFRESH_SECRET`: `openssl rand -base64 32`
  - `DB_PASSWORD`: Strong random password
  - `DB_ROOT_PASSWORD`: Strong random password
  - `REDIS_PASSWORD`: Strong random password
  - `MEILISEARCH_KEY`: Strong random key
  - `SEED_SUPER_ADMIN_PASSWORD`: Strong password
- [ ] Configure all payment gateway credentials
- [ ] Configure email (SMTP) credentials
- [ ] Configure Cloudinary credentials
- [ ] Configure reCAPTCHA keys

### 4. GitHub Secrets (for CI/CD)
- [ ] `SERVER_HOST` - Server IP or hostname
- [ ] `SERVER_USER` - SSH username (e.g., ubuntu)
- [ ] `SSH_PRIVATE_KEY` - Private key for SSH access
- [ ] `DOCKERHUB_USERNAME` - If using Docker Hub registry
- [ ] `DOCKERHUB_TOKEN` - If using Docker Hub registry

---

## Deployment Steps

### Initial Deployment (First Time)

1. **Clone repository on server:**
   ```bash
   git clone https://github.com/your-org/natures-mud.git /var/www/natures-mud
   cd /var/www/natures-mud
   ```

2. **Configure environment:**
   ```bash
   cp .env.production.example .env
   # Edit .env with all production values
   vim .env
   ```

3. **Initialize SSL certificates:**
   ```bash
   # Create certbot directories
   mkdir -p deploy/certbot/conf deploy/certbot/www
   
   # Get certificates (requires domains pointing to server)
   docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
     -d naturesmud.com -d www.naturesmud.com -d admin.naturesmud.com \
     --email admin@naturesmud.com --agree-tos --no-eff-email
   ```

3.5. **Run Pre-Deployment Tests:**
   ```bash
   # Run frontend unit tests
   npm test
   npm run lint

   # Run admin server verification
   cd admin-server && npm run typecheck && npm run lint && cd ..

   # Run backend tests (in development environment with dev dependencies)
   cd backend && composer install && php artisan test && cd ..
   ```

4. **Build and start services:**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

5. **Run database migrations and seeders:**
   ```bash
   # Laravel migrations
   docker-compose exec backend php artisan migrate --force
   docker-compose exec backend php artisan db:seed --force
   
   # Admin server migrations
   docker-compose exec admin-server npx prisma migrate deploy
   docker-compose exec admin-server npm run seed
   
   # Create storage link
   docker-compose exec backend php artisan storage:link
   ```

6. **Verify deployment:**
   ```bash
   docker-compose ps
   curl -f http://localhost/health || echo "Frontend health check failed"
   curl -f http://localhost:4000/health || echo "Admin API health check failed"
   curl -f http://localhost:8000/api/v1/health || echo "Backend health check failed"
   ```

### Subsequent Deployments (via GitHub Actions)

1. Push to `main` branch
2. CI Pipeline runs automatically
3. On success, Deploy workflow triggers
4. Monitor deployment in GitHub Actions

---

## Post-Deployment Verification

### Health Checks
- [ ] Frontend: `https://naturesmud.com` loads
- [ ] Admin Panel: `https://admin.naturesmud.com` loads
- [ ] Laravel API: `https://naturesmud.com/api/v1/products` returns JSON
- [ ] Admin API: `https://naturesmud.com/api/admin/health` returns JSON
- [ ] SSL certificates valid (check with `https://www.ssllabs.com/ssltest/`)

### Functional Tests
- [ ] Customer registration works
- [ ] Customer login works
- [ ] Product browsing works
- [ ] Cart and checkout works
- [ ] Order placement works (COD)
- [ ] Admin login works
- [ ] Admin dashboard shows stats
- [ ] Admin can manage products/orders/customers

### Monitoring Setup
- [ ] Set up log aggregation (ELK, Loki, etc.)
- [ ] Configure uptime monitoring (UptimeRobot, BetterUptime)
- [ ] Set up error tracking (Sentry)
- [ ] Configure database backups (verify `deploy/backup.sh` works)
- [ ] Set up disk space alerts

---

## Rollback Procedure

If deployment fails:

```bash
cd /var/www/natures-mud

# Option 1: Revert to previous git commit
git log --oneline -5
git checkout <previous-commit-hash>
docker-compose build --no-cache
docker-compose up -d

# Option 2: Use Docker image tags (if using registry)
docker-compose pull
docker-compose up -d

# Option 3: Restore database from backup
gunzip -c deploy/backups/db_backup_YYYY-MM-DD_HH-MM-SS.sql.gz | docker exec -i naturesmud_mysql mysql -u root -p natures_mud
```

---

## Maintenance Tasks

### Daily
- [ ] Check application logs for errors
- [ ] Verify backup completed successfully
- [ ] Check disk space: `df -h`

### Weekly
- [ ] Review security logs
- [ ] Check for available updates: `docker-compose pull`
- [ ] Review application performance metrics

### Monthly
- [ ] Rotate secrets (JWT, DB passwords, API keys)
- [ ] Update Docker base images
- [ ] Review and clean up old Docker images
- [ ] Test disaster recovery procedure

---

## Troubleshooting Quick Reference

### Frontend not loading
```bash
docker-compose logs frontend
# Check: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ADMIN_API_URL, build errors
```

### API returning 500
```bash
docker-compose logs backend
docker-compose logs admin-server
# Check: database connectivity, env vars, migrations
```

### Database connection failed
```bash
docker-compose exec mysql mysql -u root -p
# Check: DB credentials, network, container health
```

### SSL certificate issues
```bash
docker-compose logs nginx
# Check: cert paths, domain config, certbot renewal
```

### High memory usage
```bash
docker stats
# Check: PHP memory_limit, Node.js heap, MySQL innodb_buffer_pool_size
```

---

## Security Hardening Checklist

- [ ] Change all default passwords
- [ ] Use strong, unique passwords for all services
- [ ] Enable firewall (ufw) - only allow 80, 443, 22 (SSH)
- [ ] Disable root SSH login
- [ ] Use SSH keys only (no password auth)
- [ ] Set up fail2ban for SSH
- [ ] Regular security updates: `apt update && apt upgrade`
- [ ] Scan for vulnerabilities: `trivy image naturesmud-frontend:latest`
- [ ] Enable Content Security Policy headers
- [ ] Set secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] Rate limiting enabled on all endpoints
- [ ] CORS properly configured for production domains only
- [ ] Database users have minimal required permissions
- [ ] Regular backup encryption and offsite storage

---

## Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Primary DevOps | | |
| Backend Lead | | |
| Frontend Lead | | |
| Security Officer | | |
| Hosting Provider | | |

---

*Last updated: $(date)*
*Review this checklist before every production deployment*