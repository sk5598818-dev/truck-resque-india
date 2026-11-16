import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (adminDb) {
      // 1. Check direct doc ID
      const docRef = adminDb.collection('emergency_requests').doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        return NextResponse.json({ success: true, data: { id: snap.id, ...snap.data() } });
      }

      // 2. Check requestId query
      const querySnap = await adminDb.collection('emergency_requests').where('requestId', '==', id).limit(1).get();
      if (!querySnap.empty) {
        const d = querySnap.docs[0];
        return NextResponse.json({ success: true, data: { id: d.id, ...d.data() } });
      }
    }

    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, updatedBy, role = 'mechanic', note, reason } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (adminDb) {
      const docRef = adminDb.collection('emergency_requests').doc(id);
      const snap = await docRef.get();
      if (!snap.exists) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }

      const current = snap.data() || {};
      const historyItem = {
        status,
        timestamp: now,
        updatedBy: updatedBy || 'Operations',
        role,
        note: note || reason || `Status changed to ${status}`
      };

      const patch: any = {
        status,
        updatedAt: now,
        statusHistory: [...(current.statusHistory || []), historyItem]
      };

      if (status === 'completed') {
        patch.completedAt = now;
      } else if (status === 'cancelled') {
        patch.cancelledAt = now;
        patch.cancelledBy = role;
        patch.cancellationReason = reason || note || 'Cancelled';
      } else if (status === 'searching') {
        // Released back
        patch.assignedGarageId = null;
        patch.assignedGarageName = null;
        patch.assignedGaragePhone = null;
        patch.assignedMechanicName = null;
      }

      await docRef.update(patch);
      return NextResponse.json({ success: true, message: `Status updated to ${status}`, data: { ...current, ...patch } });
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
