#!/bin/bash
# Quick Start Script for Inventory & Order Management API

set -e

echo "🚀 Starting Inventory & Order Management API Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Start Docker Compose
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if containers are running
if docker-compose ps | grep -q "inventory_db"; then
    echo "✅ Database container is running"
else
    echo "❌ Database container failed to start"
    docker-compose logs db
    exit 1
fi

if docker-compose ps | grep -q "inventory_app"; then
    echo "✅ Application container is running"
else
    echo "❌ Application container failed to start"
    docker-compose logs app
    exit 1
fi

# Wait a bit more for the app to initialize
sleep 3

# Check health endpoint
echo "🏥 Checking application health..."
HEALTH=$(curl -s http://localhost:8000/health | grep -o '"status":"healthy"' || true)
if [ -n "$HEALTH" ]; then
    echo "✅ Application is healthy"
else
    echo "⚠️  Application is still starting, please wait a moment..."
    sleep 3
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo "1. Open API Documentation: http://localhost:8000/docs"
echo "2. Or use: http://localhost:8000/redoc"
echo ""
echo "🧪 Test the API:"
echo "   curl http://localhost:8000/health"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 Stop containers:"
echo "   docker-compose down"
echo ""
echo "🗑️  Stop and remove data:"
echo "   docker-compose down -v"
echo ""
echo "=========================================="
