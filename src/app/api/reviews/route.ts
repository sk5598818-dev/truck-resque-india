import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { Review } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const garageId = searchParams.get('garageId');
    const includeHidden = searchParams.get('includeHidden') === 'true';

    if (!garageId) {
      return NextResponse.json({ error: 'garageId is required' }, { status: 400 });
    }

    if (adminDb) {
      let queryRef: FirebaseFirestore.Query = adminDb.collection('reviews').where('garageId', '==', garageId);
      if (!includeHidden) {
        queryRef = queryRef.where('status', '!=', 'hidden');
      }

      const snap = await queryRef.limit(100).get();
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, count: list.length, data: list });
    }

    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      garageId,
      driverUid,
      authorName,
      driverPhone,
      rating,
      comment,
      vehicleModel,
      emergencyRequestId,
      photos = []
    } = body;

    if (!garageId || !authorName || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required review fields: garageId, authorName, rating, and comment are required.' },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5 stars.' }, { status: 400 });
    }

    if (comment.trim().length < 5) {
      return NextResponse.json({ error: 'Review comment must be at least 5 characters.' }, { status: 400 });
    }

    let isVerifiedService = false;

    // Check emergency request verification if provided
    if (emergencyRequestId && adminDb) {
      const sosDoc = await adminDb.collection('emergency_requests').doc(emergencyRequestId).get();
      if (sosDoc.exists) {
        const sosData = sosDoc.data();
        if (sosData?.assignedGarageId === garageId && sosData?.status === 'completed') {
          isVerifiedService = true;
        }
      }
    }

    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const reviewDoc: Review = {
      id,
      garageId,
      driverUid: driverUid || null,
      authorName: authorName.trim(),
      driverPhone: driverPhone || '',
      rating: numRating,
      comment: comment.trim(),
      vehicleModel: vehicleModel || '',
      emergencyRequestId: emergencyRequestId || undefined,
      isVerifiedService,
      photos: Array.isArray(photos) ? photos.slice(0, 5) : [],
      status: 'active',
      createdAt: now,
      updatedAt: now
    };

    if (adminDb) {
      // Duplicate check 1: check if review for this emergencyRequestId already exists
      if (emergencyRequestId) {
        const existingSosReview = await adminDb.collection('reviews')
          .where('emergencyRequestId', '==', emergencyRequestId)
          .limit(1)
          .get();

        if (!existingSosReview.empty) {
          return NextResponse.json(
            { error: 'A review has already been submitted for this emergency service.' },
            { status: 409 }
          );
        }
      }

      await adminDb.collection('reviews').doc(id).set(reviewDoc);

      // Recalculate garage rating aggregate
      const allGarageReviews = await adminDb.collection('reviews')
        .where('garageId', '==', garageId)
        .where('status', '!=', 'hidden')
        .get();

      if (!allGarageReviews.empty) {
        let sum = 0;
        const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        allGarageReviews.docs.forEach(docSnap => {
          const r = docSnap.data().rating;
          const star = Math.min(5, Math.max(1, Math.round(r))) as 1 | 2 | 3 | 4 | 5;
          dist[star] = (dist[star] || 0) + 1;
          sum += r;
        });
        const total = allGarageReviews.size;
        const avg = Math.round((sum / total) * 10) / 10;

        await adminDb.collection('mechanic_garages').doc(garageId).update({
          rating: avg,
          reviewCount: total,
          ratingDistribution: dist
        });
      }
    }

    return NextResponse.json({
      success: true,
      review: reviewDoc,
      message: 'Review published successfully.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
