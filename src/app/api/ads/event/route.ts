import { NextRequest, NextResponse } from 'next/server';
import { recordAdEvent } from '@/lib/businessService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, eventType } = body;

    if (!adId || (eventType !== 'impression' && eventType !== 'click')) {
      return NextResponse.json({ success: false, error: 'Valid adId and eventType (impression | click) required' }, { status: 400 });
    }

    await recordAdEvent(adId, eventType);
    return NextResponse.json({ success: true, recorded: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
