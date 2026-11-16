import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_GARAGES } from '@/lib/mockGarages';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ 
        success: false, 
        message: 'Firebase Admin not configured yet. Set FIREBASE_ADMIN_PRIVATE_KEY in .env.local to seed directly into Cloud Firestore.' 
      }, { status: 400 });
    }

    const batch = adminDb.batch();
    for (const garage of INITIAL_GARAGES) {
      const ref = adminDb.collection('mechanic_garages').doc(garage.id);
      batch.set(ref, garage);
    }
    await batch.commit();

    return NextResponse.json({ success: true, message: `Seeded ${INITIAL_GARAGES.length} garages into Cloud Firestore.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
