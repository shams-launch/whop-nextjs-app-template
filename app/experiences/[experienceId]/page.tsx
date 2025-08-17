import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	try {
		// The headers contains the user token
		const headersList = await headers();

		// The experienceId is a path param
		const { experienceId } = await params;

		// Check if Whop credentials are properly configured
		const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;
		const appApiKey = process.env.WHOP_API_KEY;

		if (!appId || appId === "use_the_corresponding_app_id_to_the_secret_api_key" || appId === "fallback") {
			return (
				<div className="flex justify-center items-center h-screen px-8">
					<div className="text-center">
						<h1 className="text-xl font-bold mb-4">Configuration Required</h1>
						<p className="mb-4">
							Your Whop app is not properly configured. Please set up your environment variables.
						</p>
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
							<p className="text-sm text-yellow-800">
								<strong>To fix this:</strong>
							</p>
							<ol className="text-sm text-yellow-800 mt-2 list-decimal list-inside space-y-1">
								<li>Create a <code>.env.local</code> file in your project root</li>
								<li>Add your Whop credentials from the dashboard</li>
								<li>Restart your development server</li>
							</ol>
						</div>
					</div>
				</div>
			);
		}

		// The user token is in the headers
		const { userId } = await whopSdk.verifyUserToken(headersList);

		const result = await whopSdk.access.checkIfUserHasAccessToExperience({
			userId,
			experienceId,
		});

		const user = await whopSdk.users.getUser({ userId });
		const experience = await whopSdk.experiences.getExperience({ experienceId });

		// Either: 'admin' | 'customer' | 'no_access';
		// 'admin' means the user is an admin of the whop, such as an owner or moderator
		// 'customer' means the user is a common member in this whop
		// 'no_access' means the user does not have access to the whop
		const { accessLevel } = result;

		return (
			<div className="flex justify-center items-center h-screen px-8">
				<h1 className="text-xl">
					Hi <strong>{user.name}</strong>, you{" "}
					<strong>{result.hasAccess ? "have" : "do not have"} access</strong> to
					this experience. Your access level to this whop is:{" "}
					<strong>{accessLevel}</strong>. <br />
					<br />
					Your user ID is <strong>{userId}</strong> and your username is{" "}
					<strong>@{user.username}</strong>.<br />
					<br />
					You are viewing the experience: <strong>{experience.name}</strong>
				</h1>
			</div>
		);
	} catch (error) {
		console.error("Experience page error:", error);
		
		// If it's an authentication error, redirect to auth page
		if (error instanceof Error && error.message.includes("Whop user token not found")) {
			redirect("/auth");
		}

		// For other errors, show a helpful error message
		return (
			<div className="flex justify-center items-center h-screen px-8">
				<div className="text-center">
					<h1 className="text-xl font-bold mb-4">Something went wrong</h1>
					<p className="mb-4">
						There was an error loading this experience. Please check your configuration.
					</p>
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
						<p className="text-sm text-red-800">
							<strong>Error:</strong> {error instanceof Error ? error.message : "Unknown error"}
						</p>
					</div>
				</div>
			</div>
		);
	}
}
