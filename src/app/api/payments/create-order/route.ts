import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_SUBSCRIPTION_PLANS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { garageId, garageName, planId, userUid, ownerPhone } = body;

    if (!garageId || !planId) {
      return NextResponse.json({ success: false, error: 'Missing garageId or planId' }, { status: 400 });
    }

    const plan = DEFAULT_SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ success: false, error: 'Invalid subscription plan selected' }, { status: 400 });
    }

    // Free plan bypasses payment gateway
    if (plan.priceInr === 0) {
      return NextResponse.json({
        success: true,
        isFree: true,
        plan,
        order: {
          id: `order_free_${Date.now()}`,
          amount: 0,
          currency: 'INR',
          planId: plan.id,
          garageId,
          garageName
        }
      });
    }

    const amountInPaise = plan.priceInr * 100;
    const receipt = `rcpt_${garageId.substring(0, 10)}_${Date.now().toString().slice(-6)}`;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live/test Razorpay credentials are set in environment
    if (razorpayKeyId && razorpayKeySecret) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes: {
              garageId,
              garageName: garageName || 'Truck Garage',
              planId: plan.id,
              userUid: userUid || ''
            }
          })
        });

        const rzpData = await rzpRes.json();
        if (rzpRes.ok) {
          return NextResponse.json({
            success: true,
            isSandbox: false,
            keyId: razorpayKeyId,
            plan,
            order: {
              id: rzpData.id,
              amount: rzpData.amount,
              currency: rzpData.currency,
              receipt: rzpData.receipt,
              planId: plan.id,
              garageId,
              garageName
            }
          });
        }
      } catch (err) {
        console.warn('Razorpay API request error, using secure sandbox fallback:', err);
      }
    }

    // Secure Sandbox/Development fallback
    const mockOrderId = `order_test_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({
      success: true,
      isSandbox: true,
      keyId: razorpayKeyId || 'rzp_test_truckrescue_mock_key',
      plan,
      order: {
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        planId: plan.id,
        garageId,
        garageName
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
