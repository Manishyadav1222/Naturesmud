# 🇳🇵 Complete Nest Nepal Hosting Deployment Guide

This guide walks you through deploying **Nature's Mud** entirely on **Nest Nepal (cPanel / Cloud Hosting / VPS)** without needing Vercel.

---

## 📦 Deployment Packages Ready

Your production packages have been built and compressed:

| Package File | Size | Destination on Nest Nepal | Application Type |
|---|---|---|---|
| **`naturesmud-frontend.zip`** | Standalone Next.js App | `/home/username/public_html` (or domain root) | **Node.js App (v20/v22)** |
| **`naturesmud-admin.zip`** | Express + Prisma API | `/home/username/admin-api.naturesmud.shop` | **Node.js App (v20/v22)** |
| **`naturesmud-backend.zip`** | Laravel 11 PHP Backend | `/home/username/api.naturesmud.shop` | **PHP 8.2 / 8.3 App** |

---

## 🛠️ Step-by-Step Deployment Instructions

### STEP 1: Set up Subdomains & Directories in cPanel

1. Log into your **Nest Nepal cPanel** (`https://yourserver:2083` or through Nest Nepal Client Area).
2. Under **Domains** -> Click **Domains** or **Subdomains**:
   - Main Domain: `naturesmud.shop` (Document Root: `public_html`)
   - Backend API Subdomain: `api.naturesmud.shop` (Document Root: `api.naturesmud.shop`)
   - Admin API Subdomain: `admin-api.naturesmud.shop` (Document Root: `admin-api.naturesmud.shop`)

---

### STEP 2: Create MySQL Databases in cPanel

1. In cPanel, click **MySQL Databases**.
2. **Create Database 1 (Backend API)**:
   - Database Name: `kathma13_natures_mud`
3. **Create Database 2 (Admin API)**:
   - Database Name: `kathma13_natures_mud_admin`
4. **Create Database User**:
   - Username: `kathma13_muduser` (or your preferred user)
   - Password: `YourStrongPassword`
5. **Assign User to Databases**:
   - Add user to `kathma13_natures_mud` -> Select **ALL PRIVILEGES** -> Save.
   - Add user to `kathma13_natures_mud_admin` -> Select **ALL PRIVILEGES** -> Save.

---

### STEP 3: Deploy Laravel Backend API (`api.naturesmud.shop`)

1. Open **File Manager** in cPanel.
2. Navigate to `api.naturesmud.shop`.
3. Click **Upload** and upload `naturesmud-backend.zip`.
4. Right-click `naturesmud-backend.zip` and click **Extract**.
5. Edit the `.env` file inside `api.naturesmud.shop` (Make sure DB credentials match Step 2):
   ```ini
   APP_NAME="Nature's Mud"
   APP_ENV=production
   APP_KEY=base64:sOlym3kcCRjqMijjGtn3eHW5cD/HFCBhQHfqhqwDDKw=
   APP_DEBUG=false
   APP_URL=https://api.naturesmud.shop
   FRONTEND_URL=https://naturesmud.shop

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=kathma13_natures_mud
   DB_USERNAME=kathma13_muduser
   DB_PASSWORD=YourPassword
   ```
6. Set **PHP Version**:
   - In cPanel, open **MultiPHP Manager** or **Select PHP Version**.
   - Set `api.naturesmud.shop` to **PHP 8.2** or **PHP 8.3**.
   - Ensure extensions `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl` are enabled.
7. Run Migrations:
   - Open cPanel **Terminal** (or SSH) and run:
     ```bash
     cd ~/api.naturesmud.shop
     php artisan migrate --force
     php artisan db:seed --force
     php artisan storage:link
     ```

---

### STEP 4: Deploy Admin Node.js API (`admin-api.naturesmud.shop`)

1. In cPanel, click **Setup Node.js App** (CloudLinux / Passenger).
2. Click **Create Application**:
   - **Node.js version**: `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `admin-api.naturesmud.shop`
   - **Application URL**: `admin-api.naturesmud.shop`
   - **Application startup file**: `dist/index.js`
   - Click **Create**.
3. In File Manager, go to `admin-api.naturesmud.shop`:
   - Upload `naturesmud-admin.zip` and **Extract** (replace placeholder files).
   - Ensure `.env` contains your database and JWT keys.
4. Back in **Setup Node.js App**:
   - Click on the `admin-api.naturesmud.shop` app.
   - Click **Run NPM Install** (or copy the virtual environment command into Terminal and run `npm install`).
   - In Terminal, run Prisma client generation:
     ```bash
     npx prisma generate
     node dist/seeders/run.js
     ```
   - Click **Restart**.

---

### STEP 5: Deploy Frontend Next.js 15 App (`naturesmud.shop`)

1. In cPanel, click **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `public_html` (or `frontend` if using dedicated folder)
   - **Application URL**: `naturesmud.shop` (or your domain)
   - **Application startup file**: `server.js`
   - Click **Create**.
3. In File Manager, navigate to `public_html` (or your chosen root):
   - Upload `naturesmud-frontend.zip` and **Extract**.
   - Verify that `.next`, `public`, `server.js`, `package.json`, and `.env` are present.
4. In **Setup Node.js App**:
   - Click **Run NPM Install** (installs production dependencies: React 19, Lucide, Tailwind runtime, etc.).
   - Click **Restart Application**.

---

### STEP 6: Enable Free SSL (HTTPS)

1. In cPanel, go to **SSL/TLS Status**.
2. Select:
   - `naturesmud.shop`
   - `www.naturesmud.shop`
   - `api.naturesmud.shop`
   - `admin-api.naturesmud.shop`
3. Click **Run AutoSSL**. AutoSSL will automatically issue and install free Let's Encrypt / Sectigo certificates for all domains!

---

## ⚡ Automated Re-packaging Command

Whenever you make changes to the code in the future, you can recreate all three packages instantly by running:

```bash
node scripts/package-all-for-nestnepal.js
```
