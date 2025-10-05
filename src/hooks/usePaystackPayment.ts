'use client';

import { useState, useCallback, useEffect } from 'react';
import { paystackConfig, PaymentData, PaymentResponse } from '@/config/paystack';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const usePaystackPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Paystack script on component mount
  useEffect(() => {
    if (scriptLoaded || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Paystack payment system');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [scriptLoaded]);

  const initializePayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResponse> => {
    setIsProcessing(true);
    setError(null);

    // Wait for script to load if not already loaded
    if (!scriptLoaded && typeof window !== 'undefined') {
      try {
        await new Promise((resolve, reject) => {
          const checkScript = () => {
            if (window.PaystackPop) {
              setScriptLoaded(true);
              resolve(true);
            } else {
              setTimeout(checkScript, 100);
            }
          };
          checkScript();
        });
      } catch (err) {
        setIsProcessing(false);
        throw new Error('Payment system not ready');
      }
    }

    return new Promise<PaymentResponse>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.PaystackPop) {
        setIsProcessing(false);
        reject(new Error('Payment system not available'));
        return;
      }

      const handler = window.PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: paymentData.email,
        amount: paymentData.amount * 100,
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
    });
  }, [scriptLoaded]);

  return {
    initializePayment,
    isProcessing,
    error,
    clearError: () => setError(null),
    scriptLoaded
  };
};