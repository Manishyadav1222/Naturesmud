-- Create admin database if not exists
CREATE DATABASE IF NOT EXISTS natures_mud_admin;

-- Create a mysql_native_password user for Prisma compatibility
CREATE USER IF NOT EXISTS 'naturesmud_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin_secret_2024';
CREATE USER IF NOT EXISTS 'naturesmud_admin'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'admin_secret_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON natures_mud_admin.* TO 'naturesmud_admin'@'localhost';
GRANT ALL PRIVILEGES ON natures_mud_admin.* TO 'naturesmud_admin'@'127.0.0.1';
FLUSH PRIVILEGES;
</｜DSML｜_file>
<task_progress>
- [x] Docker unavailable - daemon not running
- [x] Found local MySQL97 service on 3306
- [x] Updated admin-server .env to port 3306
- [x] Connection fails - sha256_password unsupported by Prisma
- [ ] Create SQL script for user with mysql_native_password
- [ ] Run SQL script as root
- [ ] Update admin-server .env with new credentials
- [ ] Run Prisma migrations + seed
- [ ] Start admin API server
- [ ] Start Next.js frontend
- [ ] Open admin panel in browser
</task_progress>
</｜DSML｜_file>