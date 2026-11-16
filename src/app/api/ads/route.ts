import { NextRequest, NextResponse } from 'next/server';
import { fetchActiveAdvertisements, createAdvertisement } from '@/lib/businessService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement') || undefined;
    const category = searchParams.get('category') || undefined;

    const ads = await fetchActiveAdvertisements(placement, category);
    return NextResponse.json({ success: true, ads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminUid, ...adData } = body;

    if (!adminUid) {
      return NextResponse.json({ success: false, error: 'Unauthorized: adminUid required' }, { status: 401 });
    }

    const newAd = await createAdvertisement(adData, adminUid);
    return NextResponse.json({ success: true, advertisement: newAd });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
