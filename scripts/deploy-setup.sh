#!/bin/bash

echo "🚀 Vercel Deployment Setup for Travel Expense Tracker"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"

# Build the project locally to check for errors
echo "🔧 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Local build successful"

echo ""
echo "🎯 Next steps:"
echo "1. Run 'vercel' to deploy"
echo "2. Set up environment variables in Vercel dashboard"
echo "3. Configure your database connection"
echo ""
echo "📝 Don't forget to:"
echo "- Set up your production database (Neon/Supabase recommended)"
echo "- Configure OAuth providers if using them"
echo "- Update NEXTAUTH_URL to your Vercel domain"
