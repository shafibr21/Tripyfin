#!/bin/bash

echo "🚀 Complete Travel Expense Tracker Setup"
echo "========================================"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check database connection
echo "🔍 Checking database connection..."
node scripts/database-check.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Database connection failed. Please:"
    echo "1. Make sure PostgreSQL is running"
    echo "2. Update your .env file with correct DATABASE_URL"
    echo "3. Run one of these setup scripts:"
    echo "   - bash scripts/setup-postgres.sh (for local PostgreSQL)"
    echo "   - bash scripts/setup-with-docker.sh (for Docker PostgreSQL)"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database schema..."
npx prisma db push

echo ""
echo "✅ Setup complete!"
echo "🎉 You can now run: npm run dev"
