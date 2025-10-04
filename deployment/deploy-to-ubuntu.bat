@echo off
setlocal enabledelayedexpansion

echo AECOIN Store Ubuntu Deployment Script
echo ======================================

REM Check for required parameters
if "%~1"=="" (
    echo Usage: %0 ^<VPS_IP^> ^<DOMAIN_NAME^>
    echo Example: %0 192.168.1.100 yourdomain.com
    exit /b 1
)

if "%~2"=="" (
    echo Usage: %0 ^<VPS_IP^> ^<DOMAIN_NAME^>
    echo Example: %0 192.168.1.100 yourdomain.com
    exit /b 1
)

set VPS_IP=%~1
set DOMAIN_NAME=%~2

echo Starting AECOIN Store deployment to Ubuntu VPS at %VPS_IP%

REM Check if SSH is available
where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: SSH client not found. Please install OpenSSH client.
    exit /b 1
)

REM Test SSH connection
echo Testing SSH connection to %VPS_IP%...
ssh -o BatchMode=yes -o ConnectTimeout=10 ubuntu@%VPS_IP% "echo SSH connection successful" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Cannot establish SSH connection to %VPS_IP%
    echo Please ensure:
    echo   1. The VPS is running and accessible
    echo   2. SSH is enabled and accessible from your IP
    echo   3. You have SSH key access or password authentication enabled
    exit /b 1
)

echo SSH connection successful

REM Upload application files
echo Uploading application files...
scp -r . ubuntu@%VPS_IP%:/tmp/aecoin-store

if %errorlevel% neq 0 (
    echo Error: Failed to upload application files
    exit /b 1
)

echo Upload completed successfully

echo.
echo Deployment Summary:
echo ===================
echo 1. Application files uploaded to %VPS_IP%:/tmp/aecoin-store
echo 2. Next steps:
echo    - SSH into your VPS: ssh ubuntu@%VPS_IP%
echo    - Run the deployment commands as shown in ubuntu-deployment-guide.md
echo    - Update environment variables with your actual credentials
echo    - Configure SSL certificate with Let's Encrypt
echo    - Test your deployment

echo.
echo For detailed deployment instructions, please refer to ubuntu-deployment-guide.md
echo.