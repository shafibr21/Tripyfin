#!/bin/bash

echo "🐘 Setting up PostgreSQL for Travel Expense Tracker..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "Download from: https://www.postgresql.org/download/"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL service is not running. Please start PostgreSQL service."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database (you may need to adjust the username)
echo "📊 Creating database..."
createdb -U postgres travel_expense_tracker 2>/dev/null || echo "Database may already exist"

echo "✅ Database setup complete!"
echo "📝 Make sure your .env file has the correct DATABASE_URL:"
echo "DATABASE_URL=\"postgresql://postgres:your_password@localhost:5432/travel_expense_tracker?schema=public\""
