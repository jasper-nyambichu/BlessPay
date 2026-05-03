// src/services/paymentService.ts
import api from '@/lib/api';

export interface InitiatePaymentPayload {
  amount: number;
  phone: string;
  type: 'tithe' | 'offering';
}

export interface InitiatePaymentResponse {
  message: string;
  transactionId: string;
  checkoutRequestId: string;
}

export interface TransactionStatusResponse {
  message: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transaction: {
    id: string;
    amount: number;
    phone: string;
    type: string;
    status: string;
    mpesa_receipt_number: string | null;
    failure_reason: string | null;
    created_at: string;
  };
}

export class PaymentService {
  // initiate M-Pesa STK push
  static async initiatePayment(payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> {
    const { data } = await api.post('/api/payment/initiate', payload);
    return data;
  }

  // poll transaction status
  static async getTransactionStatus(transactionId: string): Promise<TransactionStatusResponse> {
    const { data } = await api.get(`/api/payment/status/${transactionId}`);
    return data;
  }

  // poll until success/failed/cancelled or timeout (max 3 minutes)
  static async pollUntilComplete(
    transactionId: string,
    onStatusUpdate?: (status: string) => void
  ): Promise<TransactionStatusResponse> {
    const MAX_POLLS  = 36; // 36 x 5s = 3 minutes
    const INTERVAL   = 5000;
    let   polls      = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          polls++;
          const result = await PaymentService.getTransactionStatus(transactionId);
          onStatusUpdate?.(result.status);

          if (['success', 'failed', 'cancelled'].includes(result.status)) {
            clearInterval(interval);
            resolve(result);
          } else if (polls >= MAX_POLLS) {
            clearInterval(interval);
            reject(new Error('Payment timed out. Please check your transaction history.'));
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, INTERVAL);
    });
  }
}
