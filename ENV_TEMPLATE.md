# Environment Variables Template

Copy the content below to create your `.env.local` file:

```bash
# Whop App Environment Variables
# Get these values from your Whop Developer Dashboard: https://whop.com/dashboard/developer/

# Your Whop App API Key (required)
# Get this from your app settings in the Whop dashboard
WHOP_API_KEY="your_whop_api_key_here"

# Webhook Secret (required for webhook verification)
# Get this after creating a webhook in your app settings
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"

# Agent User ID (optional but recommended)
# Use any Whop user ID that your app can control
# You can create an agent user for your app and use their userId here
NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_agent_user_id_here"

# Your Whop App ID (required)
# This is the corresponding app ID to your API key
NEXT_PUBLIC_WHOP_APP_ID="your_whop_app_id_here"

# Company ID (optional but recommended)
# Use the corresponding company ID for your app
# Required for company-related API requests
NEXT_PUBLIC_WHOP_COMPANY_ID="your_company_id_here"

# OpenAI API Key (required for AI features)
# Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY="your_openai_api_key_here"

# Database URL (required for data storage)
# Use a PostgreSQL database (e.g., from Supabase, Railway, or Vercel Postgres)
DATABASE_URL="postgresql://username:password@host:port/database"
```

## How to get these values:

1. **WHOP_API_KEY**: Go to your Whop app settings → API Keys → Generate new key
2. **WHOP_WEBHOOK_SECRET**: Go to your Whop app settings → Webhooks → Create webhook → Copy secret
3. **NEXT_PUBLIC_WHOP_AGENT_USER_ID**: Use any user ID that your app can control (create an agent user)
4. **NEXT_PUBLIC_WHOP_APP_ID**: Found in your Whop app settings
5. **NEXT_PUBLIC_WHOP_COMPANY_ID**: Found in your company settings
6. **OPENAI_API_KEY**: Go to https://platform.openai.com/api-keys → Create new secret key
7. **DATABASE_URL**: Set up a PostgreSQL database and get the connection string

## Important Notes:

- Replace all `"your_*_here"` values with your actual credentials
- Keep your `.env.local` file secure and never commit it to version control
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Variables without `NEXT_PUBLIC_` are only available on the server
- The OpenAI API key is required for AI-powered quiz generation and feedback features

