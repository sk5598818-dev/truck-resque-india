import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      garageId,
      garageName,
      garagePhone,
      mechanicName,
      distanceKm
    } = body;

    if (!garageId || !garageName) {
      return NextResponse.json(
        { error: 'garageId and garageName are required to accept emergency request.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (adminDb) {
      const docRef = adminDb.collection('emergency_requests').doc(id);

      const result = await adminDb.runTransaction(async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists) {
          throw new Error('NOT_FOUND');
        }

        const data = snap.data() || {};
        if (data.status !== 'pending' && data.status !== 'searching') {
          throw new Error('ALREADY_ACCEPTED');
        }

        const historyItem = {
          status: 'accepted',
          timestamp: now,
          updatedBy: mechanicName || garageName,
          role: 'mechanic',
          note: `Assistance accepted by ${garageName}. Rescue team preparing dispatch.`
        };

        const patch = {
          status: 'accepted',
          assignedGarageId: garageId,
          assignedGarageName: garageName,
          assignedGaragePhone: garagePhone || '',
          assignedMechanicName: mechanicName || garageName,
          assignedGarageDistanceKm: distanceKm ? Number(distanceKm) : null,
          acceptedAt: now,
          updatedAt: now,
          statusHistory: [...(data.statusHistory || []), historyItem]
        };

        transaction.update(docRef, patch);
        return { ...data, ...patch };
      });

      return NextResponse.json({
        success: true,
        message: 'Emergency request successfully accepted.',
        data: result
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Accepted in local mode',
      data: { id, status: 'accepted', assignedGarageId: garageId, assignedGarageName: garageName }
    });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Emergency request not found.' }, { status: 404 });
    }
    if (error.message === 'ALREADY_ACCEPTED') {
      return NextResponse.json(
        { error: 'This emergency request has already been accepted by another mechanic.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message || 'Acceptance failed' }, { status: 500 });
  }
}
