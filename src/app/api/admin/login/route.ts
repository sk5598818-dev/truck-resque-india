import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, securityKey } = await request.json();
    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'TRUCK_RESCUE_ADMIN_2026_SECURE';

    if (!securityKey || securityKey.trim() !== expectedSecret.trim()) {
      return NextResponse.json(
        { success: false, error: 'Invalid Administrative Security Key. Access Denied.' },
        { status: 401 }
      );
    }

    // Key is verified
    return NextResponse.json({
      success: true,
      message: 'Admin authorization successful',
      adminKey: securityKey.trim(),
      email: email?.trim() || 'ops@truckrescueindia.in',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
