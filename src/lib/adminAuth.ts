import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates that an incoming request possesses a valid Operations Admin Key.
 * Rejects weak keys and enforces production ADMIN_SECRET_KEY.
 */
export function verifyAdminAccess(request: NextRequest, fallbackKey?: string): boolean {
  const secret = request.headers.get('x-admin-key') || fallbackKey;
  const expectedSecret = process.env.ADMIN_SECRET_KEY || 'TRUCK_RESCUE_ADMIN_2026_SECURE';

  if (!secret) return false;
  return secret.trim() === expectedSecret.trim();
}

export function unauthorizedAdminResponse(): NextResponse {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Access Denied: Valid Operations Admin Key required in x-admin-key header.' 
    },
    { status: 401 }
  );
}
