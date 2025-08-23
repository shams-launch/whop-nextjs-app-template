import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Map the role to the expected format
    let role = user.role.toLowerCase();
    
    // Handle CREATOR role mapping
    if (role === 'creator') {
      role = 'admin'; // Map creator to admin for routing
    }

    return NextResponse.json({
      role,
      userId: user.id,
      username: user.name || user.email
    });
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ error: 'Failed to get user role' }, { status: 500 });
  }
}
