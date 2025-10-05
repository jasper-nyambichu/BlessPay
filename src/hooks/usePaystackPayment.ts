'use client';

import { useState, useCallback } from 'react';
import { paystackConfig, PaymentData, PaymentResponse } from '@/config/paystack';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const usePaystackPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaystackScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      
      document.head.appendChild(script);
    });
  };

  const initializePayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResponse> => {
    setIsProcessing(true);
    setError(null);

    try {
      await loadPaystackScript();

      return new Promise<PaymentResponse>((resolve, reject) => {
        const handler = window.PaystackPop.setup({
          key: paystackConfig.publicKey,
          email: paymentData.email,
          amount: paymentData.amount * 100, // Convert to kobo
          ref: paymentData.reference,
          currency: paymentData.currency || 'NGN',
          channels: paymentData.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
          metadata: paymentData.metadata,
          callback: (response: any) => {
            setIsProcessing(false);
            resolve({
              status: true,
              message: 'Payment successful',
              data: {
                reference: response.reference,
                status: 'success',
                trans: response.trans,
                transaction: response.transaction,
                trxref: response.trxref
              }
            });
          },
          onClose: () => {
            setIsProcessing(false);
            reject(new Error('Payment window closed'));
          },
        });

        handler.openIframe();
      });
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    initializePayment,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};