'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'admin' | 'treasurer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // only redirect AFTER session restore is fully complete
    if (!isInitialized) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [user, isInitialized, router, requiredRole]);

  // show nothing until session is restored — prevents any flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,15%)]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[hsl(38,70%,55%)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-serif text-lg">BlessPay</p>
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // session restored but no user — show nothing while redirect fires
  if (!user) return null;

  // wrong role — show nothing while redirect fires
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
