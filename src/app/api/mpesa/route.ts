import { NextRequest, NextResponse } from "next/server";

import axios, { AxiosError } from "axios";
import { supabase } from "@/lib/supabase";

// Define proper interfaces
interface MpesaStkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

interface MpesaResponse {
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage?: string;
}

interface RequestBody {
  amount: number;
  phoneNumber: string;
  paymentType: string;
  description?: string;
  userId?: string;
}

// Generate M-Pesa password
function generatePassword(
  shortcode: string,
  passkey: string,
  timestamp: string
): string {
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );
  return password;
}

// Get M-Pesa access token
async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 10000,
      }
    );

    return response.data.access_token;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Error getting access token:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error("Failed to get access token");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();
    const { amount, phoneNumber, paymentType, description, userId } = body;

    // Validate input
    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: "Amount and phone number are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount < 10) {
      return NextResponse.json(
        { error: "Amount must be a number and at least 10" },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Generate timestamp (YYYYMMDDHHMMSS)
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    // Generate password
    const shortcode = process.env.NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE;
    const passkey = process.env.NEXT_PUBLIC_MPESA_PASSKEY;

    if (!shortcode || !passkey) {
      throw new Error("M-Pesa configuration incomplete");
    }

    const password = generatePassword(shortcode, passkey, timestamp);

    // Prepare STK push request
    const stkPushData: MpesaStkPushRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber.replace(/^0/, "254"),
      PartyB: shortcode,
      PhoneNumber: phoneNumber.replace(/^0/, "254"),
      CallBackURL:
        process.env.NEXT_PUBLIC_MPESA_CALLBACK_URL ||
        `${process.env.NEXTAUTH_URL}/api/mpesa/callback`,
      AccountReference: "BlessPay",
      TransactionDesc: description || `Church ${paymentType || "offering"}`,
    };

    // Send STK push request
    const response = await axios.post<MpesaResponse>(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // Save payment record to database
    if (userId) {
      const { error } = await supabase.from("payments").insert({
        user_id: userId,
        amount: amount,
        payment_type: paymentType,
        phone_number: phoneNumber,
        status: "pending",
        checkout_request_id: response.data.CheckoutRequestID,
        description: description,
      });

      if (error) {
        console.error("Error saving payment:", error);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      checkoutRequestID: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      message: "STK push sent successfully",
    });
  } catch (error: unknown) {
    console.error("M-Pesa STK push error:", error);

    let errorMessage = "Failed to process payment";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.errorMessage || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
