<?php
// ============================================================
// Nature's Mud 24/7 Production Watchdog & Auto-Healer
// Runs every 5 minutes to prevent orphan accumulation, thread
// exhaustion, and 503 Service Unavailable errors.
// ============================================================

$logFile = '/home8/kathma13/logs/watchdog.log';

function wlog($msg) {
    global $logFile;
    $time = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$time] $msg\n", FILE_APPEND);
    if (file_exists($logFile) && filesize($logFile) > 1048576) {
        @rename($logFile, $logFile . '.old');
    }
}

// 1. Gather all running processes for user kathma13
exec("ps -u kathma13 -o pid,ppid,nlwp,etimes,args 2>&1", $lines);
$adminApiProcs = [];
$frontendProcs = [];

foreach ($lines as $i => $line) {
    if ($i === 0) continue;
    $line = trim($line);
    if (empty($line)) continue;
    $parts = preg_split('/\s+/', $line, 5);
    if (count($parts) < 5) continue;
    
    $pid = intval($parts[0]);
    $ppid = intval($parts[1]);
    $nlwp = intval($parts[2]);
    $etimes = intval($parts[3]);
    $cmd = $parts[4];
    
    if (strpos($cmd, 'admin-api.naturesmud.shop') !== false) {
        $adminApiProcs[] = compact('pid', 'ppid', 'nlwp', 'etimes', 'cmd');
    } elseif (strpos($cmd, 'naturesmud.shop/server.js') !== false || (strpos($cmd, 'naturesmud.shop') !== false && strpos($cmd, 'admin-api') === false && strpos($cmd, 'lsnode') !== false)) {
        $frontendProcs[] = compact('pid', 'ppid', 'nlwp', 'etimes', 'cmd');
    }
}

// 2. Kill duplicate admin-api instances (keep only the newest)
if (count($adminApiProcs) > 1) {
    wlog("DUPLICATE ADMIN-API DETECTED (" . count($adminApiProcs) . " instances). Cleaning up...");
    usort($adminApiProcs, function($a, $b) { return $b['pid'] - $a['pid']; });
    $keep = array_shift($adminApiProcs);
    wlog("Retaining active admin-api PID {$keep['pid']}");
    foreach ($adminApiProcs as $p) {
        wlog("Terminating orphan admin-api PID {$p['pid']} (threads: {$p['nlwp']}, age: {$p['etimes']}s)");
        exec("kill -9 " . intval($p['pid']) . " 2>&1");
    }
}

// 3. Kill duplicate frontend instances (keep only the newest)
if (count($frontendProcs) > 1) {
    wlog("DUPLICATE FRONTEND DETECTED (" . count($frontendProcs) . " instances). Cleaning up...");
    usort($frontendProcs, function($a, $b) { return $b['pid'] - $a['pid']; });
    $keep = array_shift($frontendProcs);
    wlog("Retaining active frontend PID {$keep['pid']}");
    foreach ($frontendProcs as $p) {
        wlog("Terminating orphan frontend PID {$p['pid']} (threads: {$p['nlwp']}, age: {$p['etimes']}s)");
        exec("kill -9 " . intval($p['pid']) . " 2>&1");
    }
}

// 4. Thread limit check against CloudLinux LVE (limit ~100)
exec("ps -u kathma13 -L -o pid 2>&1", $threadLines);
$threadCount = max(0, count($threadLines) - 1);
if ($threadCount > 60) {
    wlog("HIGH THREAD COUNT WARNING: {$threadCount} active threads. Performing aggressive orphan cleanup...");
    foreach (array_merge($adminApiProcs, $frontendProcs) as $p) {
        if ($p['ppid'] === 1 && $p['etimes'] > 300) {
            wlog("Aggressively killing orphan PID {$p['pid']}");
            exec("kill -9 " . intval($p['pid']) . " 2>&1");
        }
    }
}

// 5. Live HTTP Health Check
$ch = curl_init('https://naturesmud.shop/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 503 || $httpCode === 500 || $httpCode === 0) {
    wlog("ALERT: Live site returned HTTP $httpCode. Initiating auto-recovery...");
    @mkdir('/home8/kathma13/naturesmud.shop/tmp', 0755, true);
    @file_put_contents('/home8/kathma13/naturesmud.shop/tmp/restart.txt', time());
    @mkdir('/home8/kathma13/admin-api.naturesmud.shop/tmp', 0755, true);
    @file_put_contents('/home8/kathma13/admin-api.naturesmud.shop/tmp/restart.txt', time());
    wlog("Auto-recovery complete. Restart touched.");
} else {
    $minute = date('i');
    if ($minute === '00' || $minute === '30') {
        wlog("STATUS OK: HTTP $httpCode, Active Threads: $threadCount");
    }
}
