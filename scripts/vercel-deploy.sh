#!/bin/bash

echo "🚀 Deploying Travel Expense Tracker to Vercel"
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build locally first to catch errors
echo "🔧 Testing local build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production database (Neon/Supabase)"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Update NEXTAUTH_URL to your Vercel domain"
echo "4. Set up OAuth providers if needed"
echo "5. Run 'npx prisma db push' with production DATABASE_URL"
