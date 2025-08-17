# 🚀 Whop App Setup Guide

Welcome to your Whop app! This guide will help you set up your app step by step.

## 📋 Prerequisites

- A Whop account
- Node.js 18+ installed
- Git installed

## 🛠️ Step 1: Environment Setup

### 1.1 Create Environment File

Create a `.env.local` file in your project root with the following variables:

```bash
# Whop App Environment Variables
# Get these values from your Whop Developer Dashboard: https://whop.com/dashboard/developer/

# Your Whop App API Key (required)
WHOP_API_KEY="your_whop_api_key_here"

# Webhook Secret (required for webhook verification)
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"

# Agent User ID (optional but recommended)
NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_agent_user_id_here"

# Your Whop App ID (required)
NEXT_PUBLIC_WHOP_APP_ID="your_whop_app_id_here"

# Company ID (optional but recommended)
NEXT_PUBLIC_WHOP_COMPANY_ID="your_company_id_here"
```

### 1.2 Get Your Environment Variables

1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Create a new app or select an existing one
3. Go to the "Settings" section
4. Copy the following values:
   - **App ID**: Found in the app settings
   - **API Key**: Generate a new API key in the app settings
   - **Company ID**: Found in your company settings
   - **Agent User ID**: Create an agent user or use an existing user ID

## 🏗️ Step 2: Configure Your Whop App

### 2.1 Set App Paths

In your Whop app settings, configure the following paths:

- **Base URL**: Set to your domain (e.g., `https://yourdomain.com` for production, `http://localhost:3000` for development)
- **App Path**: Set to `/experiences/[experienceId]`
- **Discover Path**: Set to `/discover`

### 2.2 Create Webhook (Optional)

1. In your app settings, go to the "Webhooks" section
2. Create a new webhook with the URL: `https://yourdomain.com/api/webhooks`
3. Copy the webhook secret to your `.env.local` file

## 🚀 Step 3: Run Your App

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

### 3.3 Install App in Your Whop

1. Go to your Whop
2. Navigate to the "Tools" section
3. Add your app to the whop

## 📁 Project Structure

```
MasteryFlow-App/
├── app/
│   ├── api/              # API routes
│   ├── discover/         # Discover page
│   ├── experiences/      # Experience pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   └── whop-sdk.ts       # Whop SDK configuration
├── .env.local            # Environment variables (create this)
└── package.json          # Dependencies
```

## 🔧 Key Features

### Authentication
- Uses Whop SDK for user authentication
- Verifies user tokens automatically
- Handles access control for experiences

### Experience Pages
- Dynamic routing for experiences: `/experiences/[experienceId]`
- Access level checking (admin, customer, no_access)
- User information display

### API Integration
- Webhook handling for real-time updates
- User management
- Experience management

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel
4. Deploy!

### Environment Variables for Production

Make sure to add all your environment variables in your hosting platform:
- `WHOP_API_KEY`
- `WHOP_WEBHOOK_SECRET`
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
- `NEXT_PUBLIC_WHOP_APP_ID`
- `NEXT_PUBLIC_WHOP_COMPANY_ID`

## 🐛 Troubleshooting

### Common Issues

1. **App not loading**: Check that your app paths are correctly set in the Whop dashboard
2. **Authentication errors**: Verify your environment variables are correct
3. **Webhook issues**: Ensure your webhook URL is accessible and the secret is correct

### Getting Help

- [Whop Documentation](https://dev.whop.com)
- [Whop Developer Discord](https://discord.gg/whop)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Next Steps

Now that your app is set up, you can:

1. Customize the UI in `app/page.tsx`
2. Add new features to experience pages
3. Integrate with other APIs
4. Add more authentication flows
5. Create custom webhooks

Happy coding! 🎉


