import { NextRequest, NextResponse } from 'next/server';
import { fetchAllGarages, searchNearbyGarages, registerNewGarage } from '@/lib/garageService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
  const lon = searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined;
  const radiusKm = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 100;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const is24x7 = searchParams.get('is24x7') === 'true';
  const isMobile = searchParams.get('isMobile') === 'true';
  const verifiedOnly = searchParams.get('verifiedOnly') === 'true';

  try {
    const garages = await searchNearbyGarages({
      latitude: lat,
      longitude: lon,
      radiusKm,
      category,
      searchQuery: search,
      is24x7,
      isMobile,
      verifiedOnly
    });
    return NextResponse.json({ success: true, count: garages.length, garages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newGarage = await registerNewGarage(body);
    return NextResponse.json({ success: true, garage: newGarage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
