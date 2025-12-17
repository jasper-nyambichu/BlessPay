'use client';

import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/ui/Notification';
import { useNotification } from '@/context/NotificationContext';
import './globals.css';

// Google Fonts integration
const GoogleFonts = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
};

function NotificationWrapper() {
  const { notifications, removeNotification } = useNotification();
  return <NotificationContainer notifications={notifications} onDismiss={removeNotification} />;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        {children}
        <NotificationWrapper />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <GoogleFonts />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <AppProviders>
          {children} {/* Navbar/Footer should NOT be here */}
        </AppProviders>
      </body>
    </html>
  );
}