import { whopSdk } from './whop-sdk'
import { headers } from 'next/headers'
import { prisma } from './db'
import { redirect } from 'next/navigation'

// ============================================================================
// TYPES
// ============================================================================

export interface WhopUser {
  id: string
  username: string
  role: 'CREATOR' | 'LEARNER'
}

export interface AuthenticatedUser {
  id: string
  whopUserId: string
  email: string
  name: string
  role: 'CREATOR' | 'LEARNER'
  tenantId: string
  tenant: {
    id: string
    name: string
    whopCompanyId: string
    branding: {
      name: string
      logo: string | null
    }
  }
}

// ============================================================================
// SERVER-SIDE AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Get Whop user information and determine their role
 * This function runs on the server and requires Whop authentication
 */
export async function getWhopUser(): Promise<WhopUser> {
  try {
    const headersList = await headers()
    const { userId: whopUserId } = await whopSdk.verifyUserToken(headersList)
    
    const whopUser = await whopSdk.users.getUser({ userId: whopUserId })
    
    // Check for test role assignment (highest priority)
    const testRole = getTestUserRole(whopUserId)
    if (testRole) {
      return {
        id: whopUserId,
        username: whopUser.username || whopUser.name || whopUserId,
        role: testRole
      }
    }

    // Check for manually assigned role (second highest priority)
    const manualRole = getManualUserRole(whopUserId)
    if (manualRole) {
      return {
        id: whopUserId,
        username: whopUser.username || whopUser.name || whopUserId,
        role: manualRole
      }
    }
    
    // Map Whop user to internal role system
    let role: 'CREATOR' | 'LEARNER' = 'LEARNER' // Default to LEARNER
    
    // Simple role determination based on user properties
    // In production, you'd want more sophisticated role checking
    if (whopUser.username && whopUser.username.toLowerCase().includes('admin')) {
      role = 'CREATOR'
    }
    
    // TODO: Implement proper role checking when Whop SDK supports it
    
    return {
      id: whopUserId,
      username: whopUser.username || whopUser.name || whopUserId,
      role
    }
  } catch (error) {
    console.error('Error getting Whop user:', error)
    throw new Error('Failed to get Whop user information')
  }
}

/**
 * Get the current authenticated user from the database
 * This function runs on the server and requires Whop authentication
 */
export async function getCurrentUser(): Promise<AuthenticatedUser> {
  try {
    const whopUser = await getWhopUser()
    
    // For now, use a default tenant since we can't get company info easily
    let tenant = await prisma.tenant.findFirst({
      where: { whopCompanyId: 'default' }
    })
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          whopCompanyId: 'default',
          name: 'Default Company',
          branding: { name: 'Default Company', logo: null }
        }
      })
    }
    
    let user = await prisma.user.findUnique({
      where: { whopUserId: whopUser.id },
      include: { tenant: true }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          whopUserId: whopUser.id,
          email: whopUser.username + '@example.com',
          name: whopUser.username,
          role: whopUser.role,
          tenantId: tenant.id
        },
        include: { tenant: true }
      })
    } else {
      // Update user role if it has changed
      if (user.role !== whopUser.role) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: whopUser.role },
          include: { tenant: true }
        })
      }
    }
    return user as AuthenticatedUser
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Whop user token not found. If you are the app developer, ensure you are developing in the whop.com iframe and have the dev proxy enabled.')
  }
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: 'CREATOR' | 'LEARNER'): Promise<boolean> {
  try {
    const whopUser = await getWhopUser()
    return whopUser.role === role
  } catch (error) {
    return false
  }
}

/**
 * Check if the current user is a creator
 */
export async function isCreator(): Promise<boolean> {
  return hasRole('CREATOR')
}

/**
 * Check if the current user is a learner
 */
export async function isLearner(): Promise<boolean> {
  return hasRole('LEARNER')
}

// ============================================================================
// CLIENT-SIDE ROLE HELPERS (for server-side use)
// ============================================================================

/**
 * Get test user role from environment or fallback
 * This is a simplified version for server-side use
 */
function getTestUserRole(whopUserId: string): 'CREATOR' | 'LEARNER' | null {
  // For server-side, we'll use a simple mapping
  // In production, this would come from a database or environment
  if (whopUserId === '@testcreator') return 'CREATOR'
  if (whopUserId === '@testlearner') return 'LEARNER'
  return null
}

/**
 * Get manually assigned user role from environment or fallback
 * This is a simplified version for server-side use
 */
function getManualUserRole(whopUserId: string): 'CREATOR' | 'LEARNER' | null {
  // For server-side, we'll use a simple mapping
  // In production, this would come from a database or environment
  return null
}
