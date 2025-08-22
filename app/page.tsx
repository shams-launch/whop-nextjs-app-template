import { getWhopUser } from '@/lib/auth'
import CreatorDashboard from '@/components/CreatorDashboard'
import LearnerDashboard from '@/components/LearnerDashboard'

export default async function DashboardPage() {
  // Force deployment update - user-facing interface for all users
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

        {/* Main Content Area - User-Facing Interface */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to MasteryFlow
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your learning journey starts here, {whopUser.username}!
              </p>
              
              {/* User Info Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Logged in as:</strong> {whopUser.username} (Role: {whopUser.role})
                </p>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
                <p className="text-blue-100 mb-4">Access your personalized learning path</p>
                <a href="/learner/lessons" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
                  View Lessons
                </a>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Take Quizzes</h3>
                <p className="text-green-100 mb-4">Test your knowledge and track progress</p>
                <a href="/learner/quizzes" className="inline-block bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors">
                  Start Quiz
                </a>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
                <p className="text-purple-100 mb-4">Track your learning achievements</p>
                <a href="/learner/progress" className="inline-block bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors">
                  View Progress
                </a>
              </div>
            </div>

            {/* Admin Access (Hidden but accessible) */}
            {whopUser.role === 'CREATOR' && (
              <div className="border-t pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Admin Access</h3>
                  <p className="text-yellow-700 mb-4">
                    As a creator, you have access to admin features. These are temporarily hidden but still accessible.
                  </p>
                  <div className="flex gap-3">
                    <a href="/creator/lessons" className="bg-yellow-600 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-700 transition-colors">
                      Manage Lessons
                    </a>
                    <a href="/creator/analytics" className="bg-yellow-600 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-700 transition-colors">
                      View Analytics
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
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
