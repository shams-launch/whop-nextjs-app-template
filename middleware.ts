import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/api/webhook']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Protected routes
  if (pathname.startsWith('/creator') || pathname.startsWith('/learner')) {
    // Check for Whop token in headers
    const whopToken = request.headers.get('x-whop-token') || 
                     request.nextUrl.searchParams.get('whop-dev-user-token')
    
    if (!whopToken) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

