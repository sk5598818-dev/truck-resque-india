import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { fetchAllGarages } from '@/lib/garageService';
import { calculateGrowthMetrics } from '@/lib/referralService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const garages = await fetchAllGarages();
    const metrics = calculateGrowthMetrics(garages, []);
    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    console.error('Error calculating growth metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
