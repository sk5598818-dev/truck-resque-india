import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { updateGarageVerification } from '@/lib/garageService';
import { logAuditEvent } from '@/lib/auditService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!verifyAdminAccess(request, body.adminKey)) {
      return unauthorizedAdminResponse();
    }

    const { garageId, status, notes, rejectionReason, adminUid, adminName } = body;
    if (!garageId || !status) {
      return NextResponse.json({ success: false, error: 'Missing garageId or status' }, { status: 400 });
    }

    await updateGarageVerification(garageId, status, notes, rejectionReason);

    await logAuditEvent({
      adminUid: adminUid || 'admin_ops',
      adminName: adminName || 'National Operations Admin',
      action: status === 'verified' ? 'GARAGE_APPROVAL' : status === 'rejected' ? 'GARAGE_REJECTION' : 'GARAGE_SUSPENSION',
      targetDocument: `mechanic_garages/${garageId}`,
      reason: rejectionReason || notes || `Verification status updated to ${status}`,
      newStatus: status
    });

    return NextResponse.json({ 
      success: true, 
      message: `Garage ${garageId} status successfully updated to ${status}` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
