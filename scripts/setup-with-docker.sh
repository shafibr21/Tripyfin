#!/bin/bash

echo "🐳 Setting up PostgreSQL with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Download from: https://www.docker.com/get-started"
    exit 1
fi

# Stop existing container if running
docker stop postgres-travel 2>/dev/null || true
docker rm postgres-travel 2>/dev/null || true

# Start PostgreSQL container
echo "🚀 Starting PostgreSQL container..."
docker run --name postgres-travel \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=travel_expense_tracker \
  -p 5432:5432 \
  -d postgres:15

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if container is running
if docker ps | grep -q postgres-travel; then
    echo "✅ PostgreSQL container is running!"
    echo "📝 Your DATABASE_URL should be:"
    echo "DATABASE_URL=\"postgresql://postgres:password@localhost:5432/travel_expense_tracker?schema=public\""
else
    echo "❌ Failed to start PostgreSQL container"
    exit 1
fi
