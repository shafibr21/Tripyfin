#!/bin/bash

echo "🚀 Setting up Travel Expense Tracker..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database schema..."
npx prisma db push

echo "✅ Setup complete! You can now run 'npm run dev'"
