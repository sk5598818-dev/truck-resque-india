import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { fetchAuditLogs } from '@/lib/auditService';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAccess(request)) {
      return unauthorizedAdminResponse();
    }

    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '100', 10);
    const logs = await fetchAuditLogs(limitCount);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
