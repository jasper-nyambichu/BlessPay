// src/components/PaymentForm.tsx (Enhanced)
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPaymentReference(`BLESS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const mockResponse = {
        data: {
          reference: paymentReference,
          status: 'success',
          message: 'Payment completed successfully'
        }
      };

      onPaymentSuccess?.(mockResponse);
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const offeringTypes = [
    { id: 'tithe', name: 'Tithe (10%)', percentage: 10 },
    { id: 'offering', name: 'General Offering', percentage: 0 },
    { id: 'building', name: 'Building Fund', percentage: 0 },
    { id: 'mission', name: 'Missions', percentage: 0 },
  ];

  const [selectedOffering, setSelectedOffering] = useState('tithe');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Secure Payment</h3>
              <p className="text-blue-100 text-sm">BlessPay - SDA Offering System</p>
            </div>
            <Shield className="w-8 h-8 text-white/80" />
          </div>
        </div>

        <div className="p-6">
          {/* Offering Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Offering Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {offeringTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOffering(type.id)}
                  className={`p-3 border-2 rounded-xl text-left transition-all ${
                    selectedOffering === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type.name}</span>
                    {selectedOffering === type.id && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  {type.percentage > 0 && (
                    <span className="text-xs text-gray-500">{type.percentage}% of income</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg text-gray-900">
                  ${amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900 truncate ml-2 max-w-[150px]">
                  {userEmail}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reference:</span>
                <span className="font-mono text-sm text-gray-500 bg-white px-2 py-1 rounded">
                  {paymentReference.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              <span>Encrypted</span>
            </div>
          </div>

          {/* Payment Button */}
          <motion.button
            onClick={handlePayment}
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ${amount.toLocaleString()}</span>
              </>
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Your payment is secure and encrypted. By proceeding, you agree to our terms of service.
          </p>
        </div>
      </div>
    </motion.div>
  );
};