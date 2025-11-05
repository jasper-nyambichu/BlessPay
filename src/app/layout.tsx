// src/app/layout.tsx (UPDATED)
'use client';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/ui/Notification';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

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
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AppProviders>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}