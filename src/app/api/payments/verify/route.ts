import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { activateSubscription, recordPaymentTransaction } from '@/lib/businessService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      garageId,
      garageName,
      ownerUid,
      ownerPhone,
      planId,
      amount,
      isSandbox
    } = body;

    if (!garageId || !planId) {
      return NextResponse.json({ success: false, error: 'Missing mandatory payment details' }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // Free plan zero-amount handling
    if (amount === 0 || planId === 'free') {
      const sub = await activateSubscription({
        garageId,
        garageName: garageName || 'Truck Garage',
        ownerUid: ownerUid || 'owner_anonymous',
        ownerPhone: ownerPhone || '',
        planId: 'free',
        amount: 0,
        paymentReference: 'FREE_TIER_REGISTRATION'
      });

      return NextResponse.json({
        success: true,
        message: 'Free tier activated successfully. Your garage remains 100% free forever.',
        subscription: sub
      });
    }

    // Real production signature check when Razorpay secret is present
    if (razorpayKeySecret && !isSandbox) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Missing Razorpay signature verification parameters' }, { status: 400 });
      }

      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        // Record failed transaction attempt
        await recordPaymentTransaction({
          orderId: razorpay_order_id,
          userUid: ownerUid || 'unknown',
          garageId,
          garageName: garageName || 'Unknown Garage',
          planId,
          amount: amount || 0,
          currency: 'INR',
          gateway: 'razorpay',
          gatewayPaymentId: razorpay_payment_id,
          gatewayOrderId: razorpay_order_id,
          gatewaySignature: razorpay_signature,
          paymentStatus: 'failed',
          failureReason: 'Cryptographic HMAC SHA256 signature mismatch'
        });

        return NextResponse.json({ success: false, error: 'Payment signature verification failed' }, { status: 400 });
      }
    }

    // Payment is valid (either signature matched or development sandbox)
    const effectivePaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
    const effectiveOrderId = razorpay_order_id || `order_mock_${Date.now()}`;

    // 1. Activate / Upgrade Subscription
    const subscription = await activateSubscription({
      garageId,
      garageName: garageName || 'Truck Garage',
      ownerUid: ownerUid || 'owner_anonymous',
      ownerPhone: ownerPhone || '',
      planId: planId as 'free' | 'featured' | 'premium',
      amount: amount || (planId === 'premium' ? 3999 : 1499),
      paymentReference: effectivePaymentId,
      paymentOrderId: effectiveOrderId
    });

    // 2. Record Immutable Transaction with Invoice Number
    const transaction = await recordPaymentTransaction({
      orderId: effectiveOrderId,
      userUid: ownerUid || 'unknown',
      garageId,
      garageName: garageName || 'Truck Garage',
      planId,
      amount: amount || (planId === 'premium' ? 3999 : 1499),
      currency: 'INR',
      gateway: 'razorpay',
      gatewayPaymentId: effectivePaymentId,
      gatewayOrderId: effectiveOrderId,
      gatewaySignature: razorpay_signature,
      paymentStatus: 'success',
      paymentMethod: isSandbox ? 'Test Sandbox / UPI' : 'Razorpay Verified (UPI/Card)'
    });

    return NextResponse.json({
      success: true,
      message: `Successfully activated ${planId.toUpperCase()} subscription for ${garageName || 'garage'}!`,
      subscription,
      transaction
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
