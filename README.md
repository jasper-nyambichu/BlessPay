# BlessPay

## Overview

BlessPay is a modern web application built with Next.js, designed to provide a secure and efficient payment processing solution. It integrates with AWS Amplify for robust backend services, authentication, and leverages Paystack for handling payments. The application emphasizes a clean user interface and a smooth payment experience.

## Features

*   **Secure Authentication**: User authentication and authorization managed by AWS Amplify and Supabase.
*   **Payment Gateway Integration**: Seamless integration with Paystack for processing payments.
*   **Responsive Design**: Built with Radix UI and Tailwind CSS for a mobile-first and accessible interface.
*   **State Management**: Utilizes React Context for managing application state, including authentication, notifications, and theme.
*   **Form Handling**: Implements `react-hook-form` with `zod` for robust form validation.
*   **Carousel/Sliders**: Uses Embla Carousel for dynamic content display.
*   **Animations**: Incorporates Framer Motion for smooth UI animations.

## Technology Stack

*   **Framework**: Next.js 15.5.4
*   **Styling**: Tailwind CSS, Radix UI
*   **Backend/Authentication**: AWS Amplify (v6.16.4), Supabase (v2.74.0)
*   **Payment Gateway**: Paystack (via `@paystack/inline-js` v2.22.7)
*   **Form Management**: `react-hook-form` with `@hookform/resolvers` (v5.2.2) and `zod` (v3.23.28)
*   **UI Components**: Radix UI
*   **Carousel**: Embla Carousel (v8.6.0)
*   **Animation**: Framer Motion (v12.23.26)
*   **HTTP Client**: Axios (v1.12.2)
*   **Icons**: Lucide React (v0.544.0)

## Installation and Setup

To get started with BlessPay, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jasper-nyambichu/blesspay.git
    cd blesspay
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add your AWS Amplify, Supabase, and Paystack credentials:
    ```env
    NEXT_PUBLIC_AWS_AMPLIFY_REGION=your_aws_amplify_region
    NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID=your_aws_amplify_user_pool_id
    NEXT_PUBLIC_AWS_AMPLIFY_CLIENT_ID=your_aws_amplify_client_id
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000 ) with your browser to see the result.


