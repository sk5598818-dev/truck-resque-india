import { NextRequest, NextResponse } from 'next/server';
import { resolveComplaint } from '@/lib/complaintService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminUid, adminNotes, resolution } = body;

    if (!status || !adminUid) {
      return NextResponse.json({ success: false, error: 'Status and adminUid are required' }, { status: 400 });
    }

    const updated = await resolveComplaint(id, {
      status,
      adminUid,
      adminNotes,
      resolution
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
