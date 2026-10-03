<?php
header('Content-Type: text/plain');
echo "=== APPLYING SYSTEM FIXES ===\n";

// A. Update naturesmud.shop/.htaccess with Passenger limits
$frontendHtaccess = <<<'HTA'
# BEGIN HTTPS Force Redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# END HTTPS Force Redirect

# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home8/kathma13/naturesmud.shop"
PassengerBaseURI "/"
PassengerNodejs "/home8/kathma13/nodevenv/naturesmud.shop/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
PassengerMinInstances 1
PassengerMaxInstances 1
PassengerPoolIdleTime 0
PassengerMaxPreloaderIdleTime 0
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

# BEGIN cPanel-generated php ini directives, do not edit
<IfModule php8_module>
   php_value error_log "/home8/kathma13/logs/php.error.log"
   php_flag log_errors On
</IfModule>
<IfModule lsapi_module>
   php_value error_log "/home8/kathma13/logs/php.error.log"
   php_flag log_errors On
</IfModule>
# END cPanel-generated php ini directives, do not edit
HTA;

file_put_contents('/home8/kathma13/naturesmud.shop/.htaccess', $frontendHtaccess);
echo "✅ naturesmud.shop/.htaccess updated with PassengerMaxInstances 1\n";

// B. Update admin-api.naturesmud.shop/.htaccess with Passenger limits
$adminHtaccess = <<<'HTA'
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home8/kathma13/admin-api.naturesmud.shop"
PassengerBaseURI "/"
PassengerNodejs "/home8/kathma13/nodevenv/admin-api.naturesmud.shop/20/bin/node"
PassengerAppType node
PassengerStartupFile dist/index.js
PassengerMinInstances 1
PassengerMaxInstances 1
PassengerPoolIdleTime 0
PassengerMaxPreloaderIdleTime 0
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
HTA;

file_put_contents('/home8/kathma13/admin-api.naturesmud.shop/.htaccess', $adminHtaccess);
echo "✅ admin-api.naturesmud.shop/.htaccess updated with PassengerMaxInstances 1\n";

// C. Patch admin-api.naturesmud.shop/dist/index.js
$adminDistPath = '/home8/kathma13/admin-api.naturesmud.shop/dist/index.js';
if (file_exists($adminDistPath)) {
    $adminDist = file_get_contents($adminDistPath);
    
    // Ensure UV_THREADPOOL_SIZE is set at the top
    if (strpos($adminDist, 'UV_THREADPOOL_SIZE') === false) {
        $adminDist = "process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '2';\n" . $adminDist;
    }
    
    // Patch graceful shutdown to prevent hanging
    $pattern = '/const shutdown = async \(\) => \{[\s\S]*?process\.on\(\'SIGINT\', shutdown\);/';
    $replacement = 'const shutdown = async (signal) => {
    console.log("Shutting down admin API gracefully...");
    setTimeout(() => process.exit(0), 1500).unref();
    try {
        if (typeof server !== "undefined" && server.close) {
            server.close(() => process.exit(0));
        }
        if (database_1.prisma && database_1.prisma.$disconnect) {
            await database_1.prisma.$disconnect();
        }
    } catch (e) {}
    process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));';

    $patched = preg_replace($pattern, $replacement, $adminDist);
    if ($patched) {
        file_put_contents($adminDistPath, $patched);
        echo "✅ admin-api/dist/index.js patched with UV_THREADPOOL_SIZE=2 and forced exit timeout\n";
    }
}

// D. Setup directories & watchdog
@mkdir('/home8/kathma13/scripts', 0755, true);
@mkdir('/home8/kathma13/logs', 0755, true);

// E. Run watchdog script once to test
echo "\n=== RUNNING WATCHDOG NOW ===\n";
passthru('/usr/local/bin/php /home8/kathma13/scripts/watchdog.php 2>&1');
if (file_exists('/home8/kathma13/logs/watchdog.log')) {
    echo "Watchdog Log Content:\n";
    echo file_get_contents('/home8/kathma13/logs/watchdog.log') . "\n";
}

// F. Install crontab for kathma13 (runs every 5 minutes)
$cronJob = "*/5 * * * * /usr/local/bin/php /home8/kathma13/scripts/watchdog.php > /dev/null 2>&1\n";
$existingCron = shell_exec('crontab -l 2>/dev/null') ?: '';

if (strpos($existingCron, 'watchdog.php') === false) {
    $newCron = trim($existingCron) . "\n" . $cronJob;
    file_put_contents('/tmp/cron_temp.txt', $newCron);
    exec('crontab /tmp/cron_temp.txt 2>&1', $cOut, $cRet);
    @unlink('/tmp/cron_temp.txt');
    echo "\n=== CRONTAB INSTALLED (code $cRet) ===\n";
} else {
    echo "\n=== CRONTAB ALREADY PRESENT ===\n";
}
passthru('crontab -l 2>&1');

// G. Touch restart to refresh both apps
@file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
@file_put_contents('/home8/kathma13/admin-api.naturesmud.shop/tmp/restart.txt', time());
echo "\n✅ Restart files touched for naturesmud.shop and admin-api\n";

echo "\n=== CURRENT ACTIVE PROCESSES ===\n";
passthru('ps -u kathma13 -o pid,ppid,nlwp,args 2>&1');

echo "\n=== TOTAL THREAD COUNT ===\n";
passthru('ps -u kathma13 -L -o pid | wc -l 2>&1');
