export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  baseUrl: process.env.NEXT_PUBLIC_PAYSTACK_BASE_URL || 'https://api.paystack.co',
};

export interface PaymentData {
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  channels?: string[];
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: any;
    }>;
  };
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
  };
}