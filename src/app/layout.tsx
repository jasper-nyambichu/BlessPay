// src/app/layout.tsx
// ✅ NO 'use client' here — this is a SERVER component
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationWrapper } from '@/components/NotificationWrapper';
import AuthInitGate from '@/components/AuthInitGate';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlessPay',
  description: 'Spiritual Giving Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <NotificationProvider>
          <AuthProvider>
            {/* ✅ AuthInitGate blocks ALL children until auth is ready */}
            <AuthInitGate>
              {children}
            </AuthInitGate>
            <NotificationWrapper />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}