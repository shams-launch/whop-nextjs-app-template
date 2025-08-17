// Client-side authentication utilities
// These functions can run in the browser and don't require server-side APIs

const TEST_ROLES_KEY = 'masteryflow_test_roles'
const MANUAL_ROLES_KEY = 'masteryflow_manual_roles'

export interface TestUserRole {
  whopUserId: string
  role: 'CREATOR' | 'LEARNER'
}

export interface ManualUserRole {
  whopUserId: string
  role: 'CREATOR' | 'LEARNER'
}

/**
 * Set a test user role for development/testing purposes
 * This is stored in localStorage and only used during development
 */
export function setTestUserRole(whopUserId: string, role: 'CREATOR' | 'LEARNER'): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingRoles = getTestUserRoles()
    const updatedRoles = existingRoles.filter(r => r.whopUserId !== whopUserId)
    updatedRoles.push({ whopUserId, role })
    
    localStorage.setItem(TEST_ROLES_KEY, JSON.stringify(updatedRoles))
  } catch (error) {
    console.error('Failed to set test user role:', error)
  }
}

/**
 * Get a test user role for development/testing purposes
 */
export function getTestUserRole(whopUserId: string): 'CREATOR' | 'LEARNER' | null {
  if (typeof window === 'undefined') return null
  
  try {
    const roles = getTestUserRoles()
    const userRole = roles.find(r => r.whopUserId === whopUserId)
    return userRole?.role || null
  } catch (error) {
    console.error('Failed to get test user role:', error)
    return null
  }
}

/**
 * Get all test user roles
 */
export function getTestUserRoles(): TestUserRole[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(TEST_ROLES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to get test user roles:', error)
    return []
  }
}

/**
 * Clear all test user roles
 */
export function clearTestUserRoles(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(TEST_ROLES_KEY)
  } catch (error) {
    console.error('Failed to clear test user roles:', error)
  }
}

/**
 * Set a manually assigned user role
 * This is stored in localStorage and only used during development
 */
export function setManualUserRole(whopUserId: string, role: 'CREATOR' | 'LEARNER'): void {
  if (typeof window === 'undefined') return
  
  try {
    const existingRoles = getManualUserRoles()
    const updatedRoles = existingRoles.filter(r => r.whopUserId !== whopUserId)
    updatedRoles.push({ whopUserId, role })
    
    localStorage.setItem(MANUAL_ROLES_KEY, JSON.stringify(updatedRoles))
  } catch (error) {
    console.error('Failed to set manual user role:', error)
  }
}

/**
 * Get a manually assigned user role
 */
export function getManualUserRole(whopUserId: string): 'CREATOR' | 'LEARNER' | null {
  if (typeof window === 'undefined') return null
  
  try {
    const roles = getManualUserRoles()
    const userRole = roles.find(r => r.whopUserId === whopUserId)
    return userRole?.role || null
  } catch (error) {
    console.error('Failed to get manual user role:', error)
    return null
  }
}

/**
 * Get all manually assigned user roles
 */
export function getManualUserRoles(): ManualUserRole[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(MANUAL_ROLES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to get manual user roles:', error)
    return []
  }
}

/**
 * Clear all manually assigned user roles
 */
export function clearManualUserRoles(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(MANUAL_ROLES_KEY)
  } catch (error) {
    console.error('Failed to clear manual user roles:', error)
  }
}

