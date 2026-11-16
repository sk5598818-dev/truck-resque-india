import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { fetchUsers, updateUserStatus } from '@/lib/userService';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return unauthorizedAdminResponse();
    }

    const users = await fetchUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!verifyAdminAccess(request, body.adminKey)) {
      return unauthorizedAdminResponse();
    }

    const { uid, status, reason, adminUid } = body;

    if (!uid || !status || !reason) {
      return NextResponse.json({ success: false, error: 'Missing uid, status, or reason' }, { status: 400 });
    }

    const updatedUser = await updateUserStatus(uid, status, reason, adminUid || 'admin_operations');
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
