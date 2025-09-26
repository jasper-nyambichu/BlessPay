import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define interfaces for callback data
interface CallbackMetadataItem {
  Name: string;
  Value: string | number;
}

interface StkCallback {
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: CallbackMetadataItem[];
  };
}

interface CallbackData {
  Body: {
    stkCallback: StkCallback;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const callbackData: CallbackData = await request.json();
    
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const result = callbackData.Body.stkCallback;
    const checkoutRequestID = result.CheckoutRequestID;
    const resultCode = result.ResultCode;
    const resultDesc = result.ResultDesc;

    if (resultCode === 0) {
      // Payment successful
      const metadata = result.CallbackMetadata?.Item || [];
      
      const amount = metadata.find((item: CallbackMetadataItem) => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find((item: CallbackMetadataItem) => item.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = metadata.find((item: CallbackMetadataItem) => item.Name === 'PhoneNumber')?.Value;

      console.log(`Payment Successful: Receipt=${mpesaReceiptNumber}, Amount=${amount}, Phone=${phoneNumber}`);

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          mpesa_receipt_number: mpesaReceiptNumber as string,
          updated_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestID);

      if (error) {
        console.error('Error updating payment:', error);
      }

    } else {
      // Payment failed
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('checkout_request_id', checkoutRequestID);

      if (error) {
        console.error('Error updating failed payment:', error);
      }

      console.log('Payment failed:', resultDesc);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: 'Failed' },
      { status: 500 }
    );
  }
}