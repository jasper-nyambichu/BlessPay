'use client';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';
import api, { setAccessToken, getAccessToken } from '@/lib/api';

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'member' | 'admin' | 'treasurer';
  status: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  googleSignIn: () => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                   = useState<AuthUser | null>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken]                 = useState<string | null>(null);
  const router                            = useRouter();
  const { addNotification }               = useNotification();
  const mountedRef                        = useRef(true);
  // ✅ FIX 1 — prevent double execution in React StrictMode
  const initRan                           = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // ✅ FIX 2 — Check Google OAuth token FIRST before restoreSession
  // This prevents both effects running simultaneously and fighting each other
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    const restoreSession = async () => {
      // Check for Google OAuth token in URL first
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
          // Handle Google OAuth — clean URL immediately
          window.history.replaceState({}, '', window.location.pathname);
          setAccessToken(urlToken);
          setToken(urlToken);

          try {
            const { data } = await api.get('/api/user/profile');
            const u = data.user;
            if (mountedRef.current) {
              setUser({
                id:        u.id,
                firstName: u.first_name,
                lastName:  u.last_name,
                email:     u.email,
                phone:     u.phone,
                role:      u.role,
                status:    u.status,
                avatarUrl: u.avatar_url,
              });
              router.push('/dashboard');
            }
          } catch {
            setAccessToken(null);
            setToken(null);
          } finally {
            if (mountedRef.current) setIsInitialized(true);
          }
          return; // ← stop here, don't run refresh flow
        }
      }

      // ✅ FIX 3 — Merge both API calls into one atomic operation
      // No more gap between refresh and profile fetch
      try {
        const { data } = await api.get('/api/auth/refresh');
        const accessToken = data.accessToken;
        setAccessToken(accessToken);
        setToken(accessToken);

        const profile = await api.get('/api/user/profile');
        const u = profile.data.user;

        // ✅ Set user and initialized TOGETHER — no gap, no blink
        if (mountedRef.current) {
          setUser({
            id:        u.id,
            firstName: u.first_name,
            lastName:  u.last_name,
            email:     u.email,
            phone:     u.phone,
            role:      u.role,
            status:    u.status,
            avatarUrl: u.avatar_url,
          });
        }
      } catch {
        setAccessToken(null);
        setToken(null);
      } finally {
        if (mountedRef.current) {
          setIsInitialized(true); // ← always fires last
        }
      }
    };

    restoreSession();
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    clearError();
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setAccessToken(data.accessToken);
      setToken(data.accessToken);
      if (mountedRef.current) {
        setUser({
          id:        data.user.id,
          firstName: data.user.firstName,
          lastName:  data.user.lastName,
          email:     data.user.email,
          role:      data.user.role,
          status:    'active',
        });
      }
      addNotification('success', 'Welcome Back!', `Good to see you, ${data.user.firstName}!`);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      addNotification('error', 'Login Failed', msg);
      throw err;
    }
  }, [addNotification, router, clearError]);

  const signup = useCallback(async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    clearError();
    try {
      const { data } = await api.post('/api/auth/register', userData);
      setAccessToken(data.accessToken);
      setToken(data.accessToken);
      if (mountedRef.current) {
        setUser({
          id:        data.user.id,
          firstName: data.user.firstName,
          lastName:  data.user.lastName,
          email:     data.user.email,
          role:      data.user.role,
          status:    'active',
        });
      }
      addNotification('success', 'Account Created!', 'Welcome to BlessPay!');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      addNotification('error', 'Signup Failed', msg);
      throw err;
    }
  }, [addNotification, router, clearError]);

  const googleSignIn = useCallback(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // proceed even if request fails
    } finally {
      setAccessToken(null);
      setToken(null);
      setUser(null);
      if (mountedRef.current) setLoading(false);
      addNotification('success', 'Logged Out', 'You have been successfully logged out.');
      router.push('/login');
    }
  }, [router, addNotification]);

  const updateProfile = useCallback(async (profileData: Partial<AuthUser>) => {
    try {
      const payload: any = {};
      if (profileData.firstName) payload.firstName = profileData.firstName;
      if (profileData.lastName)  payload.lastName  = profileData.lastName;
      if (profileData.phone)     payload.phone     = profileData.phone;

      const { data } = await api.put('/api/user/profile', payload);
      const u = data.user;
      setUser(prev => prev ? {
        ...prev,
        firstName: u.first_name,
        lastName:  u.last_name,
        phone:     u.phone,
      } : null);
      addNotification('success', 'Profile Updated', 'Your profile has been updated.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      addNotification('error', 'Update Failed', msg);
      throw new Error(msg);
    }
  }, [addNotification]);

  return (
    <AuthContext.Provider value={{
      user,
      accessToken:     token,
      login,
      signup,
      googleSignIn,
      logout,
      updateProfile,
      loading,
      error,
      clearError,
      isAuthenticated: !!user && !!token,
      isInitialized,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
