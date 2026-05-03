import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'Webhook secret not configured' }, { status: 500 });
    }

    const body = await request.text();
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

    if (hash !== request.headers.get('x-paystack-signature')) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'charge.success':
        console.log('Payment successful:', event.data);
        break;
      case 'transfer.success':
        console.log('Transfer successful:', event.data);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
