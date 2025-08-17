import { getWhopUser } from '@/lib/auth'
import CreatorDashboard from '@/components/CreatorDashboard'
import LearnerDashboard from '@/components/LearnerDashboard'

export default async function DashboardPage() {
  try {
    const whopUser = await getWhopUser()
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">MasteryFlow</h1>
              </div>
              {whopUser && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {whopUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {whopUser.username}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {whopUser.role === 'CREATOR' ? (
            <CreatorDashboard />
          ) : whopUser.role === 'LEARNER' ? (
            <LearnerDashboard />
          ) : (
            <div className="flex items-center justify-center min-h-64">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Role Assigned
                </h2>
                <p className="text-gray-600 mb-4">
                  Your account doesn't have a role assigned yet. Please contact support to get your account configured.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium">Current User Info:</p>
                  <p>Username: {whopUser.username}</p>
                  <p>User ID: {whopUser.id}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  } catch (error) {
    // If authentication fails, show auth error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : 'Failed to authenticate with Whop. Please ensure you are logged in and try again.'}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
            <p className="font-medium">Troubleshooting:</p>
            <p>• Make sure you're accessing this app through Whop</p>
            <p>• Check that your Whop session is active</p>
            <p>• Contact support if the issue persists</p>
          </div>
          
          {/* Development testing link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">Development Testing:</p>
            <a 
              href="/test-roles" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Set Test User Roles
            </a>
            <p className="text-xs mt-1">Use this to test different user roles during development</p>
          </div>
        </div>
      </div>
    )
  }
}
