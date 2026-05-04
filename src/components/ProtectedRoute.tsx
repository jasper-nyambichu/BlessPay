// src/components/ProtectedRoute.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'admin' | 'treasurer';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // AuthInitGate guarantees isInitialized=true before
    // this component ever becomes visible — safe to redirect
    if (!isInitialized) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [user, isInitialized, router, requiredRole]);

  // No spinner needed — AuthInitGate handles it globally
  if (!isInitialized) return null;
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}