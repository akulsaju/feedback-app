@echo off
REM Deploy Feedback App as feedback.local on Windows
REM This script sets up the application to run on your local network

echo ==========================================
echo Feedback App - Local Network Deployment
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed.
    echo Please install Docker Desktop first: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Check if Docker Compose is available
set DOCKER_COMPOSE_AVAILABLE=0
docker-compose --version >nul 2>&1
if not errorlevel 1 set DOCKER_COMPOSE_AVAILABLE=1
docker compose version >nul 2>&1
if not errorlevel 1 set DOCKER_COMPOSE_AVAILABLE=1

if %DOCKER_COMPOSE_AVAILABLE%==0 (
    echo Error: Docker Compose is not available.
    pause
    exit /b 1
)

REM Get local IP address
echo Detecting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)

:found_ip
set LOCAL_IP=%LOCAL_IP: =%
echo Detected IP: %LOCAL_IP%
echo.

REM Stop any existing containers
echo Stopping existing containers...
docker compose down 2>nul
if errorlevel 1 docker-compose down 2>nul

REM Build and start the containers
echo Building and starting containers...
docker compose up -d --build
if errorlevel 1 docker-compose up -d --build

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Access the application at:
echo   - http://%LOCAL_IP%
echo   - http://feedback.local (after hosts file configuration)
echo.
echo To use 'feedback.local' hostname:
echo.
echo 1. Run Notepad as Administrator
echo 2. Open: C:\Windows\System32\drivers\etc\hosts
echo 3. Add this line:
echo    %LOCAL_IP% feedback.local
echo 4. Save and close
echo.
echo 5. Open Windows Firewall and allow port 80
echo.
echo 6. For network-wide access, configure your router's DNS:
echo    - Login to your router (usually 192.168.1.1)
echo    - Add DNS entry: feedback.local -^> %LOCAL_IP%
echo.
echo Admin Dashboard: http://feedback.local/admin
echo.
echo Useful commands:
echo   docker compose logs -f    # View logs
echo   docker compose stop       # Stop containers
echo   docker compose restart    # Restart containers
echo ==========================================
echo.
pause
