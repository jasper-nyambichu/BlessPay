'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PaymentForm } from '@/components/PaymentForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState('');

  const handlePaymentSuccess = (response: any) => {
    setMessage('Payment completed successfully!');
    console.log('Payment success:', response);
  };

  const handlePaymentError = (error: string) => {
    setMessage(`Payment failed: ${error}`);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>
        
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="100"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter amount"
            />
          </div>

          {user && (
            <PaymentForm
              userEmail={user.email}
              amount={amount}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('failed') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}