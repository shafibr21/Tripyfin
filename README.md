# Travel Expense Tracker

A comprehensive travel expense tracking application built with Next.js, PostgreSQL, Prisma, and NextAuth.js.

## 🌟 Features

- **User Authentication** - Email/password and OAuth (Google, GitHub)
- **Lobby Management** - Create and manage travel expense lobbies
- **Member Management** - Add friends and track individual balances
- **Expense Tracking** - Group and individual expenses
- **Deposit System** - Initial and additional deposits
- **Real-time Calculations** - Automatic balance updates
- **Transaction History** - Complete audit trail
- **Responsive Design** - Works on all devices

## 🚀 Live Demo

[Visit the live app](https://your-app-name.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon/Supabase)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **UI Components**: Radix UI

## 📦 Quick Start

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd travel-expense-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Update the \`.env\` file with your database URL and other settings.

4. **Set up the database**
   \`\`\`bash
   npx prisma db push
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables
   - Deploy!

   Or use the CLI:
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

## 🔧 Environment Variables

### Required
- \`DATABASE_URL\` - PostgreSQL connection string
- \`NEXTAUTH_SECRET\` - Secret for NextAuth.js
- \`NEXTAUTH_URL\` - Your app's URL

### Optional (for OAuth)
- \`GOOGLE_CLIENT_ID\` & \`GOOGLE_CLIENT_SECRET\`
- \`GITHUB_ID\` & \`GITHUB_SECRET\`

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Database Setup](./SETUP.md)
- [API Documentation](./docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- [GitHub Issues](https://github.com/your-username/travel-expense-tracker/issues)
- [Documentation](./docs/)
- [Deployment Guide](./DEPLOYMENT.md)

---

Built with ❤️ using Next.js and Vercel
