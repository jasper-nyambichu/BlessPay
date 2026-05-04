# Blesspay - Project Architecture Skeleton

## Project Overview
**Blesspay** is a Next.js 15 full-stack payment processing application built with React 19, TypeScript, and Tailwind CSS. It integrates payment processing via Paystack, authentication via Supabase, and AWS Amplify for identity management.

**Stack:**
- Frontend: React 19 + Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database/Auth: Supabase
- Payments: Paystack
- Form Management: React Hook Form + Zod
- UI Components: Radix UI
- Animations: Framer Motion
- Charts: Recharts
- HTTP Client: Axios

---

## Directory Structure

### Root Level (`/`)
Configuration and setup files for the entire project.

```
├── eslint.config.mjs           # ESLint configuration
├── next.config.js              # Next.js configuration
├── next-env.d.ts              # Next.js TypeScript definitions
├── tsconfig.json              # TypeScript compiler options
├── postcss.config.mjs          # PostCSS/Tailwind configuration
├── package.json               # Dependencies and scripts
├── README.md                  # Project documentation
├── fix-deployment.ps1         # PowerShell deployment helper script
└── public/                    # Static assets
```

---

## Project Directories

### 📁 `/public`
Static assets served directly by Next.js without processing.

```
public/
├── images/
│   ├── landing/               # Landing page images
│   └── partners/              # Partner logos and images
│       └── NFS Most Wanted Redux 3.04 - Lite.torrent (user asset)
```

**Purpose:** Static files, images, favicons, and other public resources.

---

### 📁 `/src`
Main application source code.

---

#### **`/src/app`** - Next.js App Router Pages & API Routes
The core application structure following Next.js 13+ App Router convention.

```
src/app/
├── layout.tsx                 # Root layout (wrapper for all pages)
├── page.tsx                   # Landing page (home route: /)
├── globals.css               # Global CSS styles
├── admin/
│   └── page.tsx              # Admin dashboard
├── api/                       # Backend API routes
│   └── paystack/
│       ├── payments/
│       │   └── route.ts       # POST /api/paystack/payments - Initiate payment
│       ├── verify/
│       │   └── route.ts       # POST /api/paystack/verify - Verify transaction
│       └── webhook/
│           └── route.ts       # POST /api/paystack/webhook - Paystack webhooks
├── auth/
│   └── callback/
│       └── page.tsx           # Authentication callback handler
├── dashboard/
│   └── page.tsx              # User dashboard
├── history/
│   └── page.tsx              # Transaction/Payment history
├── login/
│   └── page.tsx              # Login page
├── notifications/
│   └── page.tsx              # Notifications page
├── payments/
│   └── page.tsx              # Payments page
├── profile/
│   └── page.tsx              # User profile page
├── settings/
│   └── page.tsx              # Settings page
└── signup/
    └── page.tsx              # User registration page
```

**Purpose:** 
- **Page files** (`page.tsx`): Render the UI for each route
- **API routes** (`route.ts`): Backend endpoints for Paystack integration
- **layout.tsx**: Shared layout wrapper for all routes

---

#### **`/src/components`** - Reusable React Components
UI components and feature-specific component groups.

```
src/components/
├── AboutSection.tsx           # About section component
├── AuthForm.tsx              # Generic authentication form
├── ChartComponent.tsx        # Chart/dashboard visualization
├── CTASection.tsx            # Call-to-action section
├── FeatureSection.tsx        # Features showcase
├── Footer.tsx                # Footer component
├── Header.tsx                # Header/top bar component
├── HeroSection.tsx           # Hero banner section
├── Navbar.tsx                # Navigation bar
├── OfferingCard.tsx          # Product/service card
├── PaymentForm.tsx           # Payment form component
├── PaymentForm.css           # Styling for payment form
├── ProtectedRoute.tsx        # Auth-protected route wrapper
├── Spinner.tsx               # Loading spinner component
├── TrustSection.tsx          # Trust/testimonials section
├── auth/
│   └── LoginForm.tsx         # Login form with validation
├── layout/
│   ├── AuthenticatedLayout.tsx # Layout for authenticated users
│   ├── Sidebar.tsx           # Sidebar navigation
│   └── TopHeader.tsx         # Top header for authenticated pages
└── ui/                       # Base UI component library (Radix UI)
    ├── Button.tsx            # Reusable button component
    ├── Card.tsx              # Card wrapper component
    ├── Input.tsx             # Form input component
    ├── Label.tsx             # Form label component
    ├── dialog.tsx            # Modal/dialog component
    ├── Notification.tsx      # Toast notification component
    ├── LoadingSpinner.tsx    # Animated loading spinner
    └── tabs.tsx              # Tab navigation component
```

**Purpose:** 
- Reusable UI components following atomic design
- Page-specific component groups
- Radix UI-based accessible components

---

#### **`/src/config`** - Configuration Files
Application-wide configuration constants.

```
src/config/
└── paystack.ts               # Paystack API keys and configuration
```

**Purpose:** Centralized configuration for external services.

---

#### **`/src/context`** - React Context (State Management)
Global state management using React Context API.

```
src/context/
├── AuthContext.tsx           # Authentication state (user, login, logout)
├── NotificationContext.tsx   # Toast/notification state
└── ThemeContext.tsx          # Theme (light/dark mode) state
```

**Purpose:** 
- Manage global application state
- Avoid prop drilling
- Provide auth, notifications, and theme to entire app

---

#### **`/src/hooks`** - Custom React Hooks
Reusable logic encapsulated as custom hooks.

```
src/hooks/
└── usePaystackPayment.ts     # Hook for Paystack payment integration
```

**Purpose:** Extract component logic into reusable hooks.

---

#### **`/src/lib`** - Utility Libraries & Helpers
Helper functions and library integrations.

```
src/lib/
├── api.ts                    # Axios instance and API request utilities
├── auth.ts                   # Authentication utilities and helpers
├── supabase.ts               # Supabase client initialization
└── utils.ts                  # General utility functions
```

**Purpose:** 
- HTTP client setup (Axios)
- Database client (Supabase)
- Reusable utility functions

---

#### **`/src/services`** - Business Logic Services
Service layer for business logic and API communication.

```
src/services/
└── paymentService.ts         # Payment processing business logic
```

**Purpose:** Encapsulate business logic separate from components.

---

#### **`/src/types`** - TypeScript Types & Interfaces
Centralized type definitions.

```
src/types/
└── index.ts                  # All TypeScript interfaces and types
```

**Purpose:** Single source of truth for application types.

---

### 📁 `/utils`
Root-level utility functions.

```
utils/
└── imagePath.js              # Image path resolution utility
```

**Purpose:** Shared utilities at project root level.

---

## Data Flow Architecture

### Authentication Flow
```
┌─────────────────┐
│   Login Page    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Supabase Auth       │
│ (AuthContext.tsx)   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Protected Routes    │
│ (ProtectedRoute)    │
└─────────────────────┘
```

### Payment Flow
```
┌──────────────────────┐
│  Payment Form Page   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ usePaystackPayment Hook      │
│ (src/hooks/)                 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ /api/paystack/payments       │
│ (Initiate payment)           │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Paystack Inline Payment      │
│ (@paystack/inline-js)        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ /api/paystack/verify         │
│ (Verify transaction)         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ /api/paystack/webhook        │
│ (Paystack confirmation)      │
└──────────────────────────────┘
```

### Global State Management
```
┌─────────────────────────┐
│   App (layout.tsx)      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ AuthContext Provider    │ ◄─── User authentication state
│ NotificationContext     │ ◄─── Toast notifications
│ ThemeContext Provider   │ ◄─── Theme management
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ All Child Components    │
│ (can consume context)   │
└─────────────────────────┘
```

---

## Folder Naming Conventions

| Directory | Pattern | Purpose |
|-----------|---------|---------|
| `/app` | Pages use `page.tsx` | Next.js App Router convention |
| `/api` | Routes use `route.ts` | API endpoint handlers |
| `/components` | PascalCase folders | Grouping related components |
| `/ui` | Base components | Reusable UI primitives |
| `/context` | PascalCase.tsx | React Context providers |
| `/hooks` | `use*.ts` | Custom React hooks |
| `/lib` | lowercase | Utilities and helpers |
| `/services` | lowercase | Business logic services |
| `/types` | `index.ts` | TypeScript definitions |
| `/config` | lowercase | Configuration files |

---

## Key Technologies & Their Roles

| Technology | Role | Files |
|-----------|------|-------|
| **Next.js 15** | Framework & routing | `/app/**` |
| **React 19** | UI library | `/components/**` |
| **TypeScript** | Type safety | `.ts`, `.tsx` files |
| **Tailwind CSS** | Styling | Global & component CSS |
| **Supabase** | Auth & Database | `/lib/supabase.ts`, `AuthContext.tsx` |
| **Paystack** | Payment gateway | `/api/paystack/**`, `usePaystackPayment.ts` |
| **React Hook Form** | Form handling | `AuthForm.tsx`, `LoginForm.tsx` |
| **Zod** | Schema validation | Form validation with RHF |
| **Radix UI** | Accessible components | `/components/ui/**` |
| **Framer Motion** | Animations | Component animations |
| **Recharts** | Data visualization | `ChartComponent.tsx` |
| **Axios** | HTTP requests | `/lib/api.ts` |

---

## API Routes Overview

```
POST /api/paystack/payments
├─ Purpose: Initiate a payment transaction
├─ Input: User data, amount, email
└─ Output: Payment authorization URL

POST /api/paystack/verify
├─ Purpose: Verify a completed payment
├─ Input: Transaction reference
└─ Output: Payment status and details

POST /api/paystack/webhook
├─ Purpose: Receive payment confirmation from Paystack
├─ Input: Payment event from Paystack
└─ Output: Transaction update in database
```

---

## Build & Deployment

```
npm run dev     → Development server (http://localhost:3000)
npm run build   → Production build (ignores lint errors)
npm start       → Production server

Next.js Output: Standalone (self-contained deployment)
```

---

## Environment Variables (Suggested)

```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## Component Hierarchy Example

```
layout.tsx (Root)
├── Header/Navbar
├── AuthContext Provider
│   ├── /page.tsx (Landing)
│   │   ├── HeroSection
│   │   ├── FeatureSection
│   │   ├── AboutSection
│   │   └── Footer
│   ├── /login/page.tsx
│   │   └── LoginForm
│   ├── /dashboard/page.tsx
│   │   └── AuthenticatedLayout
│   │       ├── Sidebar
│   │       ├── TopHeader
│   │       └── ChartComponent
│   └── /payments/page.tsx
│       └── PaymentForm
└── NotificationContext Provider
    └── Notification Toast
```

---

## Summary

This architecture follows **Next.js best practices** with:
- ✅ Clear separation of concerns (components, services, contexts)
- ✅ Reusable UI component library
- ✅ Centralized configuration and types
- ✅ API route handlers for backend logic
- ✅ Global state management via Context API
- ✅ Custom hooks for complex logic
- ✅ Protected routes for authentication
- ✅ Integration with external services (Supabase, Paystack, AWS)

This skeleton ensures **scalability**, **maintainability**, and **type safety** across the application.
