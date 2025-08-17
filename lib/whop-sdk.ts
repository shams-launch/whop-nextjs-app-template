import { WhopServerSdk } from "@whop/api";

// Check if required environment variables are set
const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;
const appApiKey = process.env.WHOP_API_KEY;

if (!appId || appId === "use_the_corresponding_app_id_to_the_secret_api_key" || appId === "fallback") {
  console.warn("⚠️  NEXT_PUBLIC_WHOP_APP_ID is not set or is using placeholder value. Please set it in your .env.local file.");
}

if (!appApiKey || appApiKey === "get_this_from_the_whop_com_dashboard_under_apps" || appApiKey === "fallback") {
  console.warn("⚠️  WHOP_API_KEY is not set or is using placeholder value. Please set it in your .env.local file.");
}

export const whopSdk = WhopServerSdk({
	// Add your app id here - this is required.
	// You can get this from the Whop dashboard after creating an app section.
	appId: appId || "fallback",

	// Add your app api key here - this is required.
	// You can get this from the Whop dashboard after creating an app section.
	appApiKey: appApiKey || "fallback",

	// This will make api requests on behalf of this user.
	// This is optional, however most api requests need to be made on behalf of a user.
	// You can create an agent user for your app, and use their userId here.
	// You can also apply a different userId later with the `withUser` function.
	onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,

	// This is the companyId that will be used for the api requests.
	// When making api requests that query or mutate data about a company, you need to specify the companyId.
	// This is optional, however if not specified certain requests will fail.
	// This can also be applied later with the `withCompany` function.
	companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
});
