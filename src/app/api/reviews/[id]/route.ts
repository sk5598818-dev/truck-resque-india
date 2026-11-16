import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { rating, comment, photos, driverUid, driverPhone } = body;

    if (!adminDb) {
      return NextResponse.json({ success: true, message: 'Updated in local mode' });
    }

    const docRef = adminDb.collection('reviews').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const current = snap.data();
    if (current?.driverUid && driverUid && current.driverUid !== driverUid) {
      return NextResponse.json({ error: 'Unauthorized: You can only edit your own reviews' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const patch: any = { updatedAt: now };
    if (rating) patch.rating = Number(rating);
    if (comment) patch.comment = comment.trim();
    if (photos) patch.photos = photos;

    await docRef.update(patch);
    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const driverUid = searchParams.get('driverUid');
    const adminKey = searchParams.get('adminKey');

    if (!adminDb) {
      return NextResponse.json({ success: true, message: 'Deleted in local mode' });
    }

    const docRef = adminDb.collection('reviews').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const current = snap.data();
    const isAdmin = adminKey === 'TRUCK_RESCUE_ADMIN_2026_SECURE' || adminKey === 'admin123';

    if (!isAdmin && current?.driverUid && driverUid && current.driverUid !== driverUid) {
      return NextResponse.json({ error: 'Unauthorized: You can only delete your own reviews' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
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
    const { action, replyText, ownerName, reason, adminUid, adminKey } = body;

    if (!adminDb) {
      return NextResponse.json({ success: true, message: 'Updated in local mode' });
    }

    const docRef = adminDb.collection('reviews').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'reply') {
      // Garage owner reply
      if (!replyText || !replyText.trim()) {
        return NextResponse.json({ error: 'replyText is required' }, { status: 400 });
      }

      await docRef.update({
        ownerReply: {
          text: replyText.trim(),
          ownerName: ownerName || 'Garage Owner',
          repliedAt: now
        }
      });
      return NextResponse.json({ success: true, message: 'Reply added successfully' });
    }

    if (action === 'report') {
      // Driver or owner reporting abusive review
      await docRef.update({
        status: 'reported',
        reportReason: reason || 'Reported by user for policy review',
        reportedAt: now
      });
      return NextResponse.json({ success: true, message: 'Review reported for administrative moderation' });
    }

    if (action === 'moderate') {
      // Admin moderation: hide or restore
      const isAdmin = adminKey === 'TRUCK_RESCUE_ADMIN_2026_SECURE' || adminKey === 'admin123';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized admin credential' }, { status: 403 });
      }

      const newStatus = body.status === 'hidden' ? 'hidden' : 'active';
      await docRef.update({
        status: newStatus,
        moderatedBy: adminUid || 'Admin Operations',
        moderationReason: reason || 'Administrative decision',
        moderatedAt: now
      });
      return NextResponse.json({ success: true, message: `Review status updated to ${newStatus}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
