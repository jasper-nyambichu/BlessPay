// src/context/AuthContext.tsx (OPTIMIZED VERSION)
'use client';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';

interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  church_name: string | null;
  role: 'member' | 'admin' | 'pastor';
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    church: string;
    role: 'member' | 'admin' | 'pastor';
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache for user profiles to avoid repeated database calls
const profileCache = new Map<string, { profile: AuthUser; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();
  
  // Refs to track mounted state and prevent memory leaks
  const mountedRef = useRef(true);
  const initializationRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // SIMPLIFIED Profile fetcher - removes complex fallback logic
  const fetchUserProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    // Check cache first
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ Using cached profile');
      return cached.profile;
    }

    try {
      console.time('🕐 ProfileFetch');
      
      // Get auth user (fast operation)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error('❌ Auth error:', authError);
        return null;
      }

      // SIMPLIFIED: Try to fetch profile with minimal fields
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, church_name, role, created_at, updated_at, avatar_url')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, create basic user from auth data only
      if (profileError && profileError.code === 'PGRST116') {
        console.log('📝 No profile found, using auth data only');
        const basicUser: AuthUser = {
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.name || '',
          phone_number: authUser.user_metadata?.phone || '',
          church_name: authUser.user_metadata?.church || '',
          role: authUser.user_metadata?.role || 'member',
          created_at: new Date().toISOString(),
        };
        
        // Cache the basic user
        profileCache.set(userId, { profile: basicUser, timestamp: Date.now() });
        return basicUser;
      }

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError);
        throw profileError;
      }

      // Build user profile
      const userProfile: AuthUser = {
        id: data.id,
        email: authUser.email || '',
        full_name: data.full_name,
        phone_number: data.phone_number,
        church_name: data.church_name,
        role: data.role || 'member',
        created_at: data.created_at,
        updated_at: data.updated_at,
        avatar_url: data.avatar_url
      };

      // Cache the profile
      profileCache.set(userId, { profile: userProfile, timestamp: Date.now() });
      
      console.timeEnd('🕐 ProfileFetch');
      return userProfile;
    } catch (error: any) {
      console.error('❌ Error in fetchUserProfile:', error);
      
      // Last resort: create basic user from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const basicUser: AuthUser = {
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.name || '',
          phone_number: authUser.user_metadata?.phone || '',
          church_name: authUser.user_metadata?.church || '',
          role: authUser.user_metadata?.role || 'member',
          created_at: new Date().toISOString(),
        };
        return basicUser;
      }
      
      return null;
    }
  }, []);

  // OPTIMIZED Auth Initialization - runs only once
  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      if (!mountedRef.current) return;

      try {
        console.time('🕐 AuthInitialization');
        setLoading(true);

        // Get session (fast operation)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session');
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          // Fetch profile but don't block initialization
          const userProfile = await fetchUserProfile(session.user.id);
          if (mountedRef.current) {
            setUser(userProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mountedRef.current) {
          setError('Authentication initialization failed');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setIsInitialized(true);
          console.timeEnd('🕐 AuthInitialization');
        }
      }
    };

    initializeAuth();

    // OPTIMIZED Auth state change listener - debounced and simplified
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        // Debounce rapid state changes
        setTimeout(async () => {
          if (!mountedRef.current) return;

          setSession(session);
          
          if (session?.user) {
            try {
              setLoading(true);
              const userProfile = await fetchUserProfile(session.user.id);
              if (mountedRef.current) {
                setUser(userProfile);
                setError(null);
              }
            } catch (error: any) {
              console.error('Error handling auth state change:', error);
              if (mountedRef.current) {
                setError('Failed to load user profile');
              }
            } finally {
              if (mountedRef.current) {
                setLoading(false);
              }
            }
          } else {
            if (mountedRef.current) {
              setUser(null);
              setLoading(false);
              clearError();
              // Clear cache on logout
              profileCache.clear();
            }
          }
        }, 100); // Small debounce
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, clearError]);

  // OPTIMIZED Login function
  const login = useCallback(async (email: string, password: string) => {
    if (!mountedRef.current) return;

    setLoading(true);
    clearError();
    
    try {
      console.time('🕐 LoginProcess');
      console.log('🔐 Attempting login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message?.includes('Email not confirmed')) {
          await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
          });
          addNotification('info', 'Email Confirmation Required', 'Please check your email to confirm your account. We sent you a new confirmation email.');
          setLoading(false);
          return;
        }
        throw error;
      }

      if (data.user) {
        console.log('✅ Login successful');
        // Profile will be loaded by auth state change listener
        addNotification('success', 'Welcome Back!', 'You have been successfully logged in.');
        
        console.timeEnd('🕐 LoginProcess');
        
        // Immediate redirect without waiting for profile
        setTimeout(() => {
          router.push('/dashboard');
        }, 50);
      } else {
        throw new Error('No user data received after login');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      console.error('❌ Login error:', errorMessage);
      if (mountedRef.current) {
        setError(errorMessage);
        setLoading(false);
      }
      addNotification('error', 'Login Failed', errorMessage);
      throw error;
    }
  }, [addNotification, router, clearError]);

  // OPTIMIZED Signup function
  const signup = useCallback(async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    church: string;
    role: 'member' | 'admin' | 'pastor';
  }) => {
    if (!mountedRef.current) return;

    setLoading(true);
    clearError();
    
    try {
      console.time('🕐 SignupProcess');
      console.log('📝 Attempting signup...');

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            church: userData.church,
            role: userData.role,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data received after signup');
      }

      // Profile creation is now non-blocking and handled by the auth state listener
      if (authData.session) {
        // User is immediately logged in
        addNotification('success', 'Account Created!', 'Your account has been created successfully.');
        
        console.timeEnd('🕐 SignupProcess');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 50);
      } else {
        // Email confirmation required
        addNotification(
          'success', 
          'Account Created!', 
          'Please check your email to confirm your account. You will be automatically logged in after confirmation.'
        );
        setLoading(false);
      }
      
    } catch (error: any) {
      const errorMessage = error.message || 'Signup failed. Please try again.';
      console.error('❌ Signup error:', errorMessage);
      if (mountedRef.current) {
        setError(errorMessage);
        setLoading(false);
      }
      addNotification('error', 'Signup Failed', errorMessage);
      throw error;
    }
  }, [addNotification, router, clearError]);

  const updateProfile = async (profileData: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name;
      if (profileData.phone_number !== undefined) updateData.phone_number = profileData.phone_number;
      if (profileData.church_name !== undefined) updateData.church_name = profileData.church_name;
      if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Update cache
      profileCache.delete(user.id);
      
      setUser(prev => prev ? { ...prev, ...profileData } : null);
      addNotification('success', 'Profile Updated', 'Your profile has been updated successfully.');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      addNotification('error', 'Update Failed', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    clearError();
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      profileCache.clear();
      
      addNotification('success', 'Logged Out', 'You have been successfully logged out.');
      
      setTimeout(() => {
        router.push('/login');
      }, 50);
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed';
      if (mountedRef.current) {
        setError(errorMessage);
      }
      addNotification('error', 'Logout Failed', errorMessage);
      throw new Error(errorMessage);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [router, addNotification, clearError]);

  const value: AuthContextType = {
    user,
    session,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    error,
    clearError,
    isAuthenticated: !!user && !!session,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
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