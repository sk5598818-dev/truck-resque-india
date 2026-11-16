import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { activateSubscription, recordPaymentTransaction } from '@/lib/businessService';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity || {};
      const notes = payment.notes || {};
      const garageId = notes.garageId;
      const planId = notes.planId;
      const garageName = notes.garageName || 'Truck Garage';
      const userUid = notes.userUid || 'webhook_user';

      if (garageId && planId) {
        await activateSubscription({
          garageId,
          garageName,
          ownerUid: userUid,
          ownerPhone: payment.contact || '',
          planId: planId as any,
          amount: (payment.amount || 0) / 100,
          paymentReference: payment.id,
          paymentOrderId: payment.order_id
        });

        await recordPaymentTransaction({
          orderId: payment.order_id || `ord_${Date.now()}`,
          userUid,
          garageId,
          garageName,
          planId,
          amount: (payment.amount || 0) / 100,
          currency: payment.currency || 'INR',
          gateway: 'razorpay',
          gatewayPaymentId: payment.id,
          gatewayOrderId: payment.order_id || '',
          paymentStatus: 'success',
          paymentMethod: payment.method || 'webhook'
        });
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
