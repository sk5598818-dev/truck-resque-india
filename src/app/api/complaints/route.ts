import { NextRequest, NextResponse } from 'next/server';
import { createComplaint, fetchComplaints } from '@/lib/complaintService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const garageId = searchParams.get('garageId') || undefined;
    const status = searchParams.get('status') || undefined;
    const userUid = searchParams.get('userUid') || undefined;

    const complaints = await fetchComplaints({ garageId, status, userUid });
    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userUid, userPhone, garageId, garageName, emergencyRequestId, complaintType, description, evidencePhotos } = body;

    if (!userPhone || !description) {
      return NextResponse.json({ success: false, error: 'User phone and complaint description are required' }, { status: 400 });
    }

    const complaint = await createComplaint({
      userUid: userUid || 'driver_anonymous',
      userName: body.userName || 'Truck Driver',
      userPhone,
      garageId,
      garageName,
      emergencyRequestId,
      complaintType: complaintType || 'other',
      description,
      evidencePhotos: evidencePhotos || []
    });

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
