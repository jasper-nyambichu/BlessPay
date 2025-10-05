import { PaymentResponse } from '@/config/paystack';

export class PaymentService {
  private static baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  static generateReference(): string {
    return `BLP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/paystack/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  }

  static async savePayment(paymentData: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment');
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  }
}