// src/context/AuthContext.tsx (UPDATED WITH GOOGLE AUTH)
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
  provider?: string;
  provider_id?: string;
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
  googleSignIn: () => Promise<void>;
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

  // Helper function to create or update user profile
  const createOrUpdateProfile = useCallback(async (userId: string, userData: Partial<AuthUser>, isOAuth = false) => {
    try {
      console.log('📝 Creating/updating profile for:', userId);
      
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error checking existing profile:', fetchError);
        return null;
      }

      const profileData: any = {
        id: userId,
        updated_at: new Date().toISOString(),
        ...userData
      };

      if (!existingProfile) {
        // New profile - add created_at
        profileData.created_at = new Date().toISOString();
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('❌ Error creating profile:', insertError);
          
          // Try alternative approach - update auth metadata instead
          if (isOAuth) {
            await supabase.auth.updateUser({
              data: {
                full_name: userData.full_name,
                phone_number: userData.phone_number,
                church_name: userData.church_name,
                role: userData.role || 'member'
              }
            });
          }
          return null;
        }
        
        console.log('✅ New profile created');
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId);

        if (updateError) {
          console.error('❌ Error updating profile:', updateError);
          return null;
        }
        
        console.log('✅ Profile updated');
      }

      // Clear cache for this user
      profileCache.delete(userId);
      
      return profileData;
    } catch (error) {
      console.error('❌ Error in createOrUpdateProfile:', error);
      return null;
    }
  }, []);

  // SIMPLIFIED Profile fetcher
  const fetchUserProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    // Check cache first
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ Using cached profile');
      return cached.profile;
    }

    try {
      console.time('🕐 ProfileFetch');
      
      // Get auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error('❌ Auth error:', authError);
        return null;
      }

      // Try to fetch profile
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, church_name, role, created_at, updated_at, avatar_url, provider, provider_id')
        .eq('id', userId)
        .single();

      // If profile doesn't exist, create one from auth metadata
      if (profileError && profileError.code === 'PGRST116') {
        console.log('📝 No profile found, creating from auth metadata');
        
        // Extract data from auth user metadata
        const userMetadata = authUser.user_metadata;
        const profileData = {
          full_name: userMetadata?.name || userMetadata?.full_name || userMetadata?.user_name || '',
          phone_number: userMetadata?.phone || userMetadata?.phone_number || '',
          church_name: userMetadata?.church || userMetadata?.church_name || '',
          role: (userMetadata?.role as 'member' | 'admin' | 'pastor') || 'member',
          avatar_url: userMetadata?.avatar_url || userMetadata?.picture || '',
          provider: userMetadata?.provider || userMetadata?.provider_name || '',
          provider_id: userMetadata?.provider_id || ''
        };

        // Create profile
        await createOrUpdateProfile(userId, profileData, true);

        // Build user object
        const userProfile: AuthUser = {
          id: userId,
          email: authUser.email || userMetadata?.email || '',
          ...profileData,
          created_at: new Date().toISOString(),
        };

        // Cache the profile
        profileCache.set(userId, { profile: userProfile, timestamp: Date.now() });
        
        console.timeEnd('🕐 ProfileFetch');
        return userProfile;
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
        avatar_url: data.avatar_url,
        provider: data.provider,
        provider_id: data.provider_id
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
        const userMetadata = authUser.user_metadata;
        const basicUser: AuthUser = {
          id: userId,
          email: authUser.email || userMetadata?.email || '',
          full_name: userMetadata?.name || userMetadata?.full_name || '',
          phone_number: userMetadata?.phone || '',
          church_name: userMetadata?.church || '',
          role: (userMetadata?.role as 'member' | 'admin' | 'pastor') || 'member',
          created_at: new Date().toISOString(),
          avatar_url: userMetadata?.avatar_url || userMetadata?.picture || '',
          provider: userMetadata?.provider || '',
          provider_id: userMetadata?.provider_id || ''
        };
        return basicUser;
      }
      
      return null;
    }
  }, [createOrUpdateProfile]);

  // OPTIMIZED Auth Initialization
  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      if (!mountedRef.current) return;

      try {
        console.time('🕐 AuthInitialization');
        setLoading(true);

        // Get session
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

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        // Debounce rapid state changes
        setTimeout(async () => {
          if (!mountedRef.current) return;

          console.log('🔄 Auth state changed:', event);
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
        }, 100);
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
        addNotification('success', 'Welcome Back!', 'You have been successfully logged in.');
        
        console.timeEnd('🕐 LoginProcess');
        
        // Immediate redirect
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

  // GOOGLE SIGN-IN FUNCTION
  const googleSignIn = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    clearError();
    
    try {
      console.time('🕐 GoogleSignInProcess');
      console.log('🔐 Attempting Google sign in...');

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        throw error;
      }

      console.log('✅ Google OAuth initiated:', data);
      
      // The actual authentication will happen in the OAuth flow
      // The auth state listener will handle the rest
      
      console.timeEnd('🕐 GoogleSignInProcess');
      
    } catch (error: any) {
      const errorMessage = error.message || 'Google sign-in failed. Please try again.';
      console.error('❌ Google sign-in error:', errorMessage);
      if (mountedRef.current) {
        setError(errorMessage);
        setLoading(false);
      }
      addNotification('error', 'Google Sign-In Failed', errorMessage);
      throw error;
    }
  }, [clearError, addNotification]);

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

      // Create profile entry
      if (authData.user) {
        await createOrUpdateProfile(authData.user.id, {
          full_name: userData.name,
          phone_number: userData.phone,
          church_name: userData.church,
          role: userData.role,
        });
      }

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
  }, [addNotification, router, clearError, createOrUpdateProfile]);

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
      if (profileData.role !== undefined) updateData.role = profileData.role;

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
    googleSignIn, // Added Google sign-in function
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