# PowerShell script to package Nature's Mud for Nest Nepal cPanel deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Nature's Mud — cPanel Package Builder  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $PSScriptRoot
Set-Location $baseDir

# 1. Build Next.js Frontend
Write-Host "`n[1/3] Building Next.js frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# 2. Build Admin Server
Write-Host "`n[2/3] Building Admin server..." -ForegroundColor Yellow
Set-Location "$baseDir\admin-server"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Admin server build failed!" -ForegroundColor Red
    exit 1
}
Set-Location $baseDir

# 3. Create Deploy Directory
$deployDir = "$baseDir\cpanel-deploy"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path "$deployDir\frontend" | Out-Null
New-Item -ItemType Directory -Path "$deployDir\admin-server" | Out-Null
New-Item -ItemType Directory -Path "$deployDir\backend" | Out-Null

Write-Host "`n[3/3] Copying production files..." -ForegroundColor Yellow

# Copy Frontend files
Write-Host "  Copying frontend files..." -ForegroundColor Gray
Copy-Item "$baseDir\server.js" "$deployDir\frontend\"
Copy-Item "$baseDir\package.json" "$deployDir\frontend\"
Copy-Item "$baseDir\package-lock.json" "$deployDir\frontend\"
Copy-Item "$baseDir\next.config.mjs" "$deployDir\frontend\"
Copy-Item "$baseDir\.env.production" "$deployDir\frontend\.env"
Copy-Item -Recurse "$baseDir\public" "$deployDir\frontend\public"
Copy-Item -Recurse "$baseDir\.next" "$deployDir\frontend\.next"

# Copy Admin Server files
Write-Host "  Copying admin server files..." -ForegroundColor Gray
Copy-Item "$baseDir\admin-server\package.json" "$deployDir\admin-server\"
Copy-Item "$baseDir\admin-server\package-lock.json" "$deployDir\admin-server\"
Copy-Item "$baseDir\admin-server\.env.production" "$deployDir\admin-server\.env"
Copy-Item -Recurse "$baseDir\admin-server\dist" "$deployDir\admin-server\dist"
Copy-Item -Recurse "$baseDir\admin-server\prisma" "$deployDir\admin-server\prisma"
Copy-Item -Recurse "$baseDir\admin-server\src\seeders" "$deployDir\admin-server\seeders" -ErrorAction SilentlyContinue

# Copy Backend (Laravel) files
Write-Host "  Copying backend (Laravel) files..." -ForegroundColor Gray
$backendItems = @("app", "bootstrap", "config", "database", "public", "resources", "routes", "storage", "artisan", "composer.json", "composer.phar")
foreach ($item in $backendItems) {
    if (Test-Path "$baseDir\backend\$item") {
        Copy-Item -Recurse "$baseDir\backend\$item" "$deployDir\backend\$item"
    }
}
Copy-Item "$baseDir\backend\.env.production" "$deployDir\backend\.env"

Write-Host "`nCreating deployment ZIP archives..." -ForegroundColor Yellow
if (Test-Path "$baseDir\naturesmud-frontend.zip") { Remove-Item "$baseDir\naturesmud-frontend.zip" }
if (Test-Path "$baseDir\naturesmud-admin.zip") { Remove-Item "$baseDir\naturesmud-admin.zip" }
if (Test-Path "$baseDir\naturesmud-backend.zip") { Remove-Item "$baseDir\naturesmud-backend.zip" }

Compress-Archive -Path "$deployDir\frontend\*" -DestinationPath "$baseDir\naturesmud-frontend.zip" -CompressionLevel Optimal
Compress-Archive -Path "$deployDir\admin-server\*" -DestinationPath "$baseDir\naturesmud-admin.zip" -CompressionLevel Optimal
Compress-Archive -Path "$deployDir\backend\*" -DestinationPath "$baseDir\naturesmud-backend.zip" -CompressionLevel Optimal

Write-Host "`n✅ All 3 production packages created successfully!" -ForegroundColor Green
Write-Host "1. naturesmud-frontend.zip  -> Upload to /home/username/public_html" -ForegroundColor Cyan
Write-Host "2. naturesmud-admin.zip     -> Upload to /home/username/admin-api.naturesmud.shop" -ForegroundColor Cyan
Write-Host "3. naturesmud-backend.zip   -> Upload to /home/username/api.naturesmud.shop" -ForegroundColor Cyan
