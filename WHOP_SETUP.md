# Whop Setup Guide for MasteryFlow

## 🔧 Setting Up Your Whop Credentials

The error you're seeing (`Invalid app id provided to verifyUserToken`) occurs because your Whop app is not properly configured with real credentials.

### Step 1: Get Your Whop Credentials

1. **Go to Whop Dashboard**: Visit [https://whop.com/dashboard/apps](https://whop.com/dashboard/apps)
2. **Create or Select Your App**: 
   - If you don't have an app yet, create one
   - If you already have an app, select it from the list
3. **Get Your Credentials**:
   - **App ID**: Found in the app settings
   - **API Key**: Found in the app settings under "API Keys"
   - **Company ID**: Found in your company settings
   - **Agent User ID**: Create or use an existing user ID for your app

### Step 2: Create Your Environment File

Create a `.env.local` file in your project root with the following structure:

```bash
# Whop API Configuration
WHOP_API_KEY="your_actual_api_key_here"
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"
NEXT_PUBLIC_WHOP_APP_ID="your_actual_app_id_here"
NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_agent_user_id_here"
NEXT_PUBLIC_WHOP_COMPANY_ID="your_company_id_here"

# Database Configuration (already set)
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."

# OpenAI Configuration (for AI features)
OPENAI_API_KEY="your_openai_api_key_here"
```

### Step 3: Replace Placeholder Values

Replace the placeholder values with your actual credentials:

- `your_actual_api_key_here` → Your Whop API key
- `your_actual_app_id_here` → Your Whop app ID
- `your_agent_user_id_here` → A user ID your app can control
- `your_company_id_here` → Your Whop company ID
- `your_openai_api_key_here` → Your OpenAI API key (optional for AI features)

### Step 4: Restart Your Development Server

After creating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 5: Test Your Setup

Once you've set up your credentials, the app should work properly:

1. **Main Page** (`/`): Should redirect to `/auth` if not authenticated
2. **Auth Page** (`/auth`): Should show the welcome page
3. **Experience Page** (`/experiences/[id]`): Should work with proper Whop authentication

## 🚨 Common Issues

### "Invalid app id provided to verifyUserToken"
- **Cause**: Missing or incorrect `NEXT_PUBLIC_WHOP_APP_ID`
- **Solution**: Make sure you're using the actual app ID from your Whop dashboard

### "Whop user token not found"
- **Cause**: App accessed outside of Whop iframe
- **Solution**: This is expected behavior when developing locally. The app will work properly when accessed through Whop.

### "API key not found"
- **Cause**: Missing or incorrect `WHOP_API_KEY`
- **Solution**: Make sure you're using the actual API key from your Whop dashboard

## 📝 Example .env.local File

Here's what your `.env.local` file should look like (with real values):

```bash
# Whop API Configuration
WHOP_API_KEY="whop_live_abc123def456ghi789..."
WHOP_WEBHOOK_SECRET="whop_webhook_secret_xyz789..."
NEXT_PUBLIC_WHOP_APP_ID="app_1234567890abcdef"
NEXT_PUBLIC_WHOP_AGENT_USER_ID="user_9876543210fedcba"
NEXT_PUBLIC_WHOP_COMPANY_ID="company_abcdef123456789"

# Database Configuration
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."

# OpenAI Configuration
OPENAI_API_KEY="sk-proj-abc123def456ghi789..."
```

## 🔍 Verification

After setting up your credentials, you should see:

1. **No more console warnings** about missing credentials
2. **Proper authentication flow** when accessed through Whop
3. **Working experience pages** with user data
4. **No more "Invalid app id" errors**

## 🆘 Need Help?

If you're still having issues:

1. **Check the console** for any warning messages
2. **Verify your credentials** are correct in the Whop dashboard
3. **Make sure the `.env.local` file** is in the project root
4. **Restart your development server** after making changes
5. **Check that your app is properly configured** in the Whop dashboard

The app is designed to work seamlessly with Whop once the credentials are properly configured!

