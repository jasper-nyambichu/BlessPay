'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';

// More flexible interface that matches common Supabase profiles table structure
interface AuthUser {
  id: string;
  email?: string;
  full_name?: string | null;
  phone_number?: string | null;
  church_name?: string | null;
  role?: 'member' | 'admin' | 'pastor' | string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Safe profile fetcher that handles schema variations
  const fetchUserProfile = useCallback(async (userId: string): Promise<AuthUser | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      
      // First, try to get the user's email from auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('❌ Error getting auth user:', authError);
        throw authError;
      }

      if (!authUser) {
        throw new Error('No auth user found');
      }

      // Try to fetch profile with minimal fields first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        
        // Profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating new profile...');
          return await createUserProfileFromSession(userId, authUser);
        }
        
        throw error;
      }
      
      // Build user profile safely, handling missing fields
      const userProfile: AuthUser = {
        id: data.id,
        email: authUser.email || data.email || '',
        full_name: data.full_name || data.name || authUser.user_metadata?.name || '',
        phone_number: data.phone_number || data.phone || '',
        church_name: data.church_name || data.church || '',
        role: data.role || 'member',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at,
        avatar_url: data.avatar_url
      };
      
      console.log('✅ User profile fetched successfully:', userProfile);
      return userProfile;
    } catch (error: any) {
      console.error('❌ Error in fetchUserProfile:', error);
      throw error;
    }
  }, []);

  const createUserProfileFromSession = useCallback(async (userId: string, authUser: User): Promise<AuthUser | null> => {
    try {
      console.log('🛠️ Creating profile for user:', userId);
      
      const userMetadata = authUser.user_metadata || {};
      
      // Use the most common column names for profiles table
      const profileData: any = {
        id: userId,
        // Only include email if your table has this column
        // email: authUser.email,
        full_name: userMetadata.name || authUser.email?.split('@')[0] || 'User',
        phone_number: userMetadata.phone || '',
        church_name: userMetadata.church || '',
        role: userMetadata.role || 'member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('📝 Inserting profile data:', profileData);

      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        
        // If it's a duplicate or other error, try to fetch existing profile
        if (profileError.code === '23505') {
          console.log('🔄 Profile might already exist, fetching...');
          return await fetchUserProfile(userId);
        }
        
        // If it's a column error, try with minimal fields
        if (profileError.message?.includes('column') && profileError.message?.includes('does not exist')) {
          console.log('🔄 Column error detected, trying minimal profile creation...');
          return await createMinimalProfile(userId, authUser);
        }
        
        throw profileError;
      }

      console.log('✅ Profile created successfully');
      
      // Return profile using auth user's email since profiles table might not have email column
      return {
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
    } catch (error: any) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  }, [fetchUserProfile]);

  // Fallback function for minimal profile creation
  const createMinimalProfile = async (userId: string, authUser: User): Promise<AuthUser | null> => {
    try {
      console.log('🔄 Creating minimal profile...');
      
      const minimalProfile = {
        id: userId,
        // Don't include email if it causes errors
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([minimalProfile])
        .select()
        .single();

      if (error) {
        console.error('❌ Minimal profile creation failed:', error);
        // Even if this fails, we can still create a basic user object
        console.log('🔄 Creating basic user object from auth data only...');
        
        const basicUser: AuthUser = {
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          phone_number: authUser.user_metadata?.phone || '',
          church_name: authUser.user_metadata?.church || '',
          role: authUser.user_metadata?.role || 'member',
          created_at: new Date().toISOString(),
        };
        
        return basicUser;
      }

      // Build user from minimal profile + auth data
      return {
        id: data.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        phone_number: authUser.user_metadata?.phone || '',
        church_name: authUser.user_metadata?.church || '',
        role: authUser.user_metadata?.role || 'member',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at,
      };
    } catch (error: any) {
      console.error('❌ Error in createMinimalProfile:', error);
      // Last resort - create user object from auth data only
      const basicUser: AuthUser = {
        id: userId,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        phone_number: authUser.user_metadata?.phone || '',
        church_name: authUser.user_metadata?.church || '',
        role: authUser.user_metadata?.role || 'member',
        created_at: new Date().toISOString(),
      };
      return basicUser;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log('🚀 Initializing auth...');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError('Failed to get session');
          setIsInitialized(true);
          setLoading(false);
          return;
        }

        console.log('📋 Session found:', session ? 'Yes' : 'No');
        setSession(session);
        
        if (session?.user) {
          console.log('👤 User found in session, fetching profile...');
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else {
          console.log('👤 No user in session');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setError('Authentication initialization failed');
      } finally {
        setLoading(false);
        setIsInitialized(true);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'Has session' : 'No session');
        
        setSession(session);
        
        if (session?.user) {
          try {
            setLoading(true);
            const userProfile = await fetchUserProfile(session.user.id);
            setUser(userProfile);
            setError(null);
          } catch (error: any) {
            console.error('❌ Error handling auth state change:', error);
            setError('Failed to load user profile');
            // Don't set user to null here - keep existing user if profile fetch fails
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
          clearError();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, clearError]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    
    try {
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
        console.log('✅ Login successful, fetching profile...');
        const userProfile = await fetchUserProfile(data.user.id);
        setUser(userProfile);
        addNotification('success', 'Welcome Back!', 'You have been successfully logged in.');
        
        // Use setTimeout to ensure state updates are complete before redirect
        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...');
          router.push('/dashboard');
        }, 100);
      } else {
        throw new Error('No user data received after login');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      addNotification('error', 'Login Failed', errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    church: string;
    role: 'member' | 'admin' | 'pastor';
  }) => {
    setLoading(true);
    clearError();
    
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      
      console.log('📝 Attempting signup...');

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

      // Try to create profile, but don't fail signup if this fails
      try {
        const profileData: any = {
          id: authData.user.id,
          // Only include if your table has email column
          // email: userData.email.trim().toLowerCase(),
          full_name: userData.name,
          phone_number: userData.phone,
          church_name: userData.church,
          role: userData.role,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.warn('⚠️ Profile creation warning (non-fatal):', profileError);
          // Continue anyway - profile can be created later
        }
      } catch (profileError) {
        console.warn('⚠️ Profile creation failed (non-fatal):', profileError);
        // Continue with signup anyway
      }

      if (authData.session) {
        // User is immediately logged in
        const userProfile = await fetchUserProfile(authData.user.id);
        setUser(userProfile);
        addNotification('success', 'Account Created!', 'Your account has been created successfully.');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
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
      setError(errorMessage);
      addNotification('error', 'Signup Failed', errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Only include fields that exist in your schema
      if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name;
      if (profileData.phone_number !== undefined) updateData.phone_number = profileData.phone_number;
      if (profileData.church_name !== undefined) updateData.church_name = profileData.church_name;
      if (profileData.avatar_url !== undefined) updateData.avatar_url = profileData.avatar_url;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...profileData } : null);
      addNotification('success', 'Profile Updated', 'Your profile has been updated successfully.');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      addNotification('error', 'Update Failed', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
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
      
      addNotification('success', 'Logged Out', 'You have been successfully logged out.');
      
      setTimeout(() => {
        router.push('/login');
      }, 100);
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed';
      setError(errorMessage);
      addNotification('error', 'Logout Failed', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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