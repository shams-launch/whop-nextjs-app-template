'use client'

import { useState } from 'react'
import { setTestUserRole, getTestUserRole } from '@/lib/auth-client'

export default function TestRolesPage() {
  const [whopUserId, setWhopUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<'CREATOR' | 'LEARNER'>('LEARNER')
  const [currentRole, setCurrentRole] = useState<string | null>(null)

  const handleSetRole = () => {
    if (whopUserId.trim()) {
      setTestUserRole(whopUserId.trim(), selectedRole)
      alert(`Role set to ${selectedRole} for user ${whopUserId}`)
      // Refresh current role display
      setCurrentRole(getTestUserRole(whopUserId.trim()))
    }
  }

  const handleCheckRole = () => {
    if (whopUserId.trim()) {
      const role = getTestUserRole(whopUserId.trim())
      setCurrentRole(role)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Role Assignment</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="whopUserId" className="block text-sm font-medium text-gray-700 mb-2">
              Whop User ID
            </label>
            <input
              type="text"
              id="whopUserId"
              value={whopUserId}
              onChange={(e) => setWhopUserId(e.target.value)}
              placeholder="Enter Whop User ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'CREATOR' | 'LEARNER')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LEARNER">LEARNER</option>
              <option value="CREATOR">CREATOR</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSetRole}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Set Role
            </button>
            <button
              onClick={handleCheckRole}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Check Role
            </button>
          </div>

          {currentRole && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Current role for {whopUserId}:</span> {currentRole}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2">Test Accounts Available:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <code>@testcreator</code> - CREATOR role</li>
              <li>• <code>@testlearner</code> - LEARNER role</li>
            </ul>
            <p className="text-xs text-yellow-600 mt-2">
              These accounts are created by the seed script and will automatically get their assigned roles.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Set a role for your Whop User ID</li>
              <li>Go back to the main page</li>
              <li>You should see the appropriate dashboard</li>
              <li>Roles are stored in localStorage for testing</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
