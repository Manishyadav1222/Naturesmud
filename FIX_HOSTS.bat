@echo off
:: Nature's Mud — Automated Windows Hosts File Setup
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :admin
) else (
    echo Requesting Administrator Permissions...
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

:admin
echo ========================================================
echo   Updating Windows Hosts File for naturesmud.shop...
echo ========================================================

findstr /C:"167.235.9.123 naturesmud.shop" "%windir%\System32\drivers\etc\hosts" >nul
if %errorLevel% == 0 (
    echo [OK] Hosts entry already exists!
) else (
    echo 167.235.9.123 naturesmud.shop www.naturesmud.shop api.naturesmud.shop admin-api.naturesmud.shop >> "%windir%\System32\drivers\etc\hosts"
    echo [SUCCESS] Added naturesmud.shop to hosts file!
)

ipconfig /flushdns
echo.
echo ========================================================
echo   DONE! You can now open https://naturesmud.shop
echo ========================================================
pause
