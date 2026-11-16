import { NextRequest, NextResponse } from 'next/server';
import { fetchGarageById, updateGarage } from '@/lib/garageService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const garage = await fetchGarageById(params.id);
    if (!garage) {
      return NextResponse.json({ success: false, error: 'Garage not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, garage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateGarage(params.id, body);
    return NextResponse.json({ success: true, garage: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
