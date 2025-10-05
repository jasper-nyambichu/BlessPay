import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return NextResponse.json({
        success: true,
        data: data.data,
        message: 'Payment verified successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error verifying payment'
    }, { status: 500 });
  }
}