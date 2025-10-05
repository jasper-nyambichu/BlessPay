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

  const initializePayment = useCallback((paymentData: PaymentData) => {
    return new Promise<PaymentResponse>((resolve, reject) => {
      setIsProcessing(true);
      setError(null);

      try {
        if (!window.PaystackPop) {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.onload = () => {
            executePayment(paymentData, resolve, reject);
          };
          script.onerror = () => {
            setIsProcessing(false);
            reject(new Error('Failed to load Paystack script'));
          };
          document.body.appendChild(script);
        } else {
          executePayment(paymentData, resolve, reject);
        }
      } catch (err) {
        setIsProcessing(false);
        reject(err);
      }
    });
  }, []);

  const executePayment = (
    paymentData: PaymentData, 
    resolve: (value: PaymentResponse) => void, 
    reject: (reason?: any) => void
  ) => {
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
        reject(new Error('Payment cancelled by user'));
      },
    });

    handler.openIframe();
  };

  return {
    initializePayment,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};