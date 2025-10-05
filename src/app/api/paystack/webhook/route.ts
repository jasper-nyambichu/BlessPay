import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET!;
    const hash = crypto.createHmac('sha512', secret)
      .update(await request.text())
      .digest('hex');
    
    if (hash !== request.headers.get('x-paystack-signature')) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = await request.json();
    
    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        // Handle successful payment
        console.log('Payment successful:', event.data);
        break;
      case 'transfer.success':
        // Handle successful transfer
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