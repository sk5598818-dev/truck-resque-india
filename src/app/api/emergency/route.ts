import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { encodeGeohash } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      driverPhone,
      driverName,
      driverUid,
      vehicleNumber,
      vehicleBrand,
      vehicleModel,
      vehicleType,
      breakdownCategory,
      description,
      photos = [],
      latitude,
      longitude,
      address,
      highway,
      landmark,
      city,
      district,
      state,
      pincode,
      requestedService = 'roadside_van',
      priority = 'urgent'
    } = body;

    if (!driverPhone || !vehicleNumber || !breakdownCategory) {
      return NextResponse.json(
        { error: 'Missing required fields: driverPhone, vehicleNumber, breakdownCategory are required.' },
        { status: 400 }
      );
    }

    const lat = Number(latitude) || 28.6139;
    const lon = Number(longitude) || 77.2090;
    const geohash = encodeGeohash(lat, lon);
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const requestId = `SOS-${randomNum}`;
    const now = new Date().toISOString();

    const emergencyData = {
      id,
      requestId,
      driverUid: driverUid || null,
      driverPhone,
      driverName: driverName || 'Highway Trucker',
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleBrand,
      vehicleModel,
      vehicleType: vehicleType || 'BS6',
      breakdownCategory,
      description: description || '',
      photos: Array.isArray(photos) ? photos.slice(0, 5) : [],
      latitude: lat,
      longitude: lon,
      geohash,
      address: address || 'Highway Location',
      highway: highway || '',
      landmark: landmark || '',
      city: city || 'Unspecified',
      district: district || 'Unspecified',
      state: state || 'Unspecified',
      pincode: pincode || '000000',
      requestedService,
      priority,
      status: 'searching',
      statusHistory: [
        {
          status: 'searching',
          timestamp: now,
          updatedBy: driverName || driverPhone,
          role: 'driver',
          note: `Emergency breakdown request submitted for ${vehicleBrand} (${vehicleNumber})`
        }
      ],
      createdAt: now,
      updatedAt: now,
      searchRadiusKm: 50
    };

    if (adminDb) {
      try {
        await adminDb.collection('emergency_requests').doc(id).set(emergencyData);
      } catch (err) {
        console.warn('Admin Firestore save failed, continuing:', err);
      }
    }

    return NextResponse.json({
      success: true,
      request: emergencyData,
      message: 'Emergency request registered. Searching for nearby mechanics.'
    });
  } catch (error: any) {
    console.error('Error creating emergency request:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const driverPhone = searchParams.get('driverPhone');

    if (adminDb) {
      let queryRef: FirebaseFirestore.Query = adminDb.collection('emergency_requests');
      if (status && status !== 'all') {
        queryRef = queryRef.where('status', '==', status);
      }
      if (driverPhone) {
        queryRef = queryRef.where('driverPhone', '==', driverPhone);
      }

      const snap = await queryRef.orderBy('createdAt', 'desc').limit(50).get();
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, count: list.length, data: list });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
