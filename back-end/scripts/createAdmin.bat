@echo off
echo ========================================
echo    Admin User Creation Script
echo ========================================
echo.
echo This script will create an admin user for your application.
echo.
echo Default credentials:
echo Email: admin@gobelives.com
echo Password: Admin123!@#
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul
echo.
echo Creating admin user...
npm run create-admin
echo.
echo Press any key to exit...
pause >nul
