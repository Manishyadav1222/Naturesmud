<?php
// One-time deployer - delete after use
set_time_limit(300);
ignore_user_abort(false);
header('Content-Type: text/plain');

$home = '/home8/kathma13';
$repoDir = $home . '/repositories/naturesmud-frontend';
$publicHtml = $home . '/public_html';

echo "=== NaturesMud Deployer ===\n";
echo date('Y-m-d H:i:s') . "\n\n";

// Step 1: Clone or pull
if (!is_dir($repoDir . '/.git')) {
    echo "STEP 1: Cloning from GitHub...\n";
    $output = shell_exec("mkdir -p $repoDir && git clone https://github.com/Manishyadav1222/Naturesmud.git $repoDir 2>&1");
    echo $output . "\n";
} else {
    echo "STEP 1: Pulling latest from GitHub...\n";
    $output = shell_exec("cd $repoDir && git fetch origin && git reset --hard origin/main 2>&1");
    echo $output . "\n";
}

// Step 2: Install dependencies
echo "STEP 2: Installing npm dependencies...\n";
$output = shell_exec("cd $repoDir && npm ci --omit=dev 2>&1");
echo $output . "\n";

// Step 3: Build Next.js
echo "STEP 3: Building Next.js app...\n";
$output = shell_exec("cd $repoDir && npm run build 2>&1");
echo $output . "\n";

// Step 4: Copy static assets
echo "STEP 4: Copying static assets into standalone...\n";
shell_exec("cp -r $repoDir/.next/static $repoDir/.next/standalone/.next/static 2>&1");
shell_exec("cp -r $repoDir/public $repoDir/.next/standalone/public 2>&1");
echo "Done.\n";

// Step 5: Backup .env
echo "STEP 5: Backing up .env...\n";
shell_exec("cp $publicHtml/.env /tmp/.env.naturesmud.backup 2>&1");
echo "Done.\n";

// Step 6: Deploy to public_html
echo "STEP 6: Deploying to public_html...\n";
shell_exec("find $publicHtml -mindepth 1 -maxdepth 1 ! -name '.env' ! -name '.htaccess' ! -name 'naturesmud_deploy.php' -exec rm -rf {} + 2>&1");
shell_exec("cp -r $repoDir/.next/standalone/. $publicHtml/ 2>&1");
echo "Done.\n";

// Step 7: Restore .env
echo "STEP 7: Restoring .env...\n";
shell_exec("cp /tmp/.env.naturesmud.backup $publicHtml/.env 2>&1");
echo "Done.\n";

// Step 8: Restart Node.js app (Passenger)
echo "STEP 8: Restarting Node.js app...\n";
shell_exec("mkdir -p $publicHtml/tmp && touch $publicHtml/tmp/restart.txt 2>&1");
echo "Done.\n";

// Delete self
echo "\n=== DEPLOYMENT COMPLETE ===\n";
echo "Deleting deployer script...\n";
unlink(__FILE__);
echo "Done! Visit naturesmud.shop to verify.\n";
?>