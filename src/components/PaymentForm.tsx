'use client';

import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from '@/hooks/usePaystackPayment';
import { PaymentService } from '@/services/paymentService';
import LoadingSpinner from './ui/LoadingSpinner';

interface PaymentFormProps {
  userEmail: string;
  amount: number;
  onPaymentSuccess?: (response: any) => void;
  onPaymentError?: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  userEmail,
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [paymentReference, setPaymentReference] = useState('');
  const { initializePayment, isProcessing, error } = usePaystackPayment();

  useEffect(() => {
    setPaymentReference(PaymentService.generateReference());
  }, []);

  const handlePayment = async () => {
    try {
      const paymentData = {
        email: userEmail,
        amount: amount,
        reference: paymentReference,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: "Payment For",
              variable_name: "payment_for",
              value: "BLessPay Service"
            }
          ]
        }
      };

      const response = await initializePayment(paymentData);
      
      // Verify payment with backend
      await PaymentService.verifyPayment(response.data.reference);
      
      // Save payment record
      await PaymentService.savePayment({
        ...response.data,
        amount,
        userEmail,
        timestamp: new Date().toISOString()
      });

      onPaymentSuccess?.(response);

    } catch (error: any) {
      onPaymentError?.(error.message || 'Payment failed');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-details">
        <div className="detail-row">
          <span>Amount:</span>
          <span>₦{amount.toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <span>Email:</span>
          <span>{userEmail}</span>
        </div>
        <div className="detail-row">
          <span>Reference:</span>
          <span className="reference">{paymentReference}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="payment-button"
      >
        {isProcessing ? (
          <div className="button-loading">
            <LoadingSpinner />
            Processing...
          </div>
        ) : (
          `Pay ₦${amount.toLocaleString()}`
        )}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};