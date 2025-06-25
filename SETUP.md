# Database Setup Guide

## Option 1: Local PostgreSQL

### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql` or download from postgresql.org
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### Setup Steps
1. **Start PostgreSQL service**
   \`\`\`bash
   # Windows (if installed as service)
   # PostgreSQL should start automatically
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   \`\`\`

2. **Create database**
   \`\`\`bash
   # Run the setup script
   bash scripts/setup-postgres.sh
   \`\`\`

3. **Update .env file**
   \`\`\`env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/travel_expense_tracker?schema=public"
   \`\`\`

## Option 2: Docker PostgreSQL (Recommended)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/get-started)

### Setup Steps
1. **Run Docker setup**
   \`\`\`bash
   bash scripts/setup-with-docker.sh
   \`\`\`

2. **Your .env should be**
   \`\`\`env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/travel_expense_tracker?schema=public"
   \`\`\`

## Complete Setup

After setting up PostgreSQL (either option):

\`\`\`bash
# Run complete setup
bash scripts/complete-setup.sh

# Or manually:
npm install
npx prisma generate
npx prisma db push
npm run dev
\`\`\`

## Troubleshooting

### "Authentication failed" Error
- Check your PostgreSQL password
- Update DATABASE_URL in .env file
- Make sure PostgreSQL is running

### "Connection refused" Error
- PostgreSQL service is not running
- Wrong host/port in DATABASE_URL
- Firewall blocking connection

### "Database does not exist" Error
- Run: `createdb -U postgres travel_expense_tracker`
- Or use the setup scripts provided

### Prisma Generate Issues
\`\`\`bash
# Clean and regenerate
rm -rf node_modules/.prisma
npx prisma generate
