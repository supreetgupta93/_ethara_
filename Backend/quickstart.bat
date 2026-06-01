@echo off
REM Quick Start Script for Inventory & Order Management API (Windows)

echo.
echo 🚀 Starting Inventory ^& Order Management API Setup...
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is installed

REM Start Docker Compose
echo 📦 Starting Docker containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start Docker containers
    pause
    exit /b 1
)

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak

REM Check if containers are running
docker-compose ps | find "inventory_db" >nul
if %errorlevel% equ 0 (
    echo ✅ Database container is running
) else (
    echo ❌ Database container failed to start
    docker-compose logs db
    pause
    exit /b 1
)

docker-compose ps | find "inventory_app" >nul
if %errorlevel% equ 0 (
    echo ✅ Application container is running
) else (
    echo ❌ Application container failed to start
    docker-compose logs app
    pause
    exit /b 1
)

echo ⏳ Waiting for application to initialize...
timeout /t 3 /nobreak

echo 🏥 Checking application health...
REM Simple curl test (requires curl installed, might not be available on older Windows)
curl -s http://localhost:8000/health >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Application is healthy
) else (
    echo ⚠️  Application is starting, please wait...
)

echo.
echo ==========================================
echo ✅ Setup Complete!
echo ==========================================
echo.
echo 📝 Next Steps:
echo 1. Open API Documentation: http://localhost:8000/docs
echo 2. Or use: http://localhost:8000/redoc
echo.
echo 🧪 Test the API:
echo    curl http://localhost:8000/health
echo.
echo 📊 View logs:
echo    docker-compose logs -f app
echo.
echo 🛑 Stop containers:
echo    docker-compose down
echo.
echo 🗑️  Stop and remove data:
echo    docker-compose down -v
echo.
echo ==========================================
echo.
pause
