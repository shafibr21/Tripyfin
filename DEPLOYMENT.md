# Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel
   \`\`\`

### Option 2: Deploy with GitHub Integration

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings (see below)

## ⚙️ Environment Variables

Set these in your Vercel dashboard (Project Settings → Environment Variables):

### Required Variables
\`\`\`env
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_super_secret_key_for_production
NEXTAUTH_URL=https://your-app-name.vercel.app
\`\`\`

### Optional OAuth Variables
\`\`\`env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_ID=your_github_client_id
\`\`\`

## 🗄️ Database Setup for Production

### Option 1: Neon (Recommended)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Set DATABASE_URL**
   \`\`\`env
   DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
   \`\`\`

3. **Push Schema**
   \`\`\`bash
   npx prisma db push
   \`\`\`

### Option 2: Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Go to Settings → Database
   - Copy connection string

2. **Set DATABASE_URL**
   \`\`\`env
   DATABASE_URL="postgresql://postgres:password@hostname:5432/postgres"
   \`\`\`

### Option 3: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Create PostgreSQL database
   - Copy connection string

## 🔐 OAuth Setup (Optional)

### Google OAuth

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Configure Redirect URIs**
   \`\`\`
   https://your-app-name.vercel.app/api/auth/callback/google
   \`\`\`

### GitHub OAuth

1. **GitHub Settings**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL:
   \`\`\`
   https://your-app-name.vercel.app/api/auth/callback/github
   \`\`\`

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Production database configured
- [ ] Database schema pushed (\`npx prisma db push\`)
- [ ] OAuth providers configured (if using)
- [ ] NEXTAUTH_URL updated to production domain
- [ ] Test deployment works

## 🔧 Build Configuration

Vercel automatically detects Next.js projects. The build settings should be:

- **Framework Preset**: Next.js
- **Build Command**: \`npm run build\`
- **Output Directory**: \`.next\`
- **Install Command**: \`npm install\`

## 🚨 Troubleshooting

### Build Errors

1. **Prisma Client Issues**
   \`\`\`bash
   # Add to package.json scripts
   "postinstall": "prisma generate"
   \`\`\`

2. **Environment Variables**
   - Make sure all required env vars are set in Vercel
   - Check variable names match exactly

3. **Database Connection**
   - Verify DATABASE_URL is correct
   - Ensure database allows external connections
   - Check SSL requirements

### Runtime Errors

1. **NextAuth Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure OAuth redirect URIs are correct

2. **Database Issues**
   - Run \`npx prisma db push\` after deployment
   - Check database connection limits
   - Verify schema is up to date

## 📊 Monitoring

- **Vercel Analytics**: Enable in project settings
- **Error Tracking**: Check Vercel Functions logs
- **Performance**: Monitor Core Web Vitals

## 🔄 Updates

To update your deployment:

\`\`\`bash
git add .
git commit -m "Update message"
git push origin main
\`\`\`

Vercel will automatically redeploy on push to main branch.
