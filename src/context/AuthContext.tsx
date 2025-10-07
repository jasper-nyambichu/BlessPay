'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';

// Updated interface to match your database schema
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addNotification } = useNotification();

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session');
          return;
        }

        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Authentication initialization failed');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
        clearError();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      clearError();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        if (error.code === 'PGRST116') {
          await createUserProfileFromSession(userId);
          return;
        }
        
        setError('Failed to fetch user profile');
        setLoading(false);
        return;
      }
      
      const userProfile: AuthUser = {
        id: data.id,
        email: data.email || '',
        full_name: data.full_name,
        phone_number: data.phone_number,
        church_name: data.church_name,
        role: data.role || 'member',
        created_at: data.created_at,
        updated_at: data.updated_at,
        avatar_url: data.avatar_url
      };
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setError('Error loading user profile');
    } finally {
      setLoading(false);
    }
  };

  const createUserProfileFromSession = async (userId: string) => {
    try {
      clearError();
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !authUser) {
        throw new Error(userError?.message || 'No auth user found');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: authUser.email,
            full_name: authUser.user_metadata?.name || 'User',
            phone_number: authUser.user_metadata?.phone || '',
            church_name: authUser.user_metadata?.church || '',
            role: authUser.user_metadata?.role || 'member',
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      await fetchUserProfile(userId);
    } catch (error) {
      console.error('Error creating user profile:', error);
      setError('Failed to create user profile');
      setLoading(false);
    }
  };

 const login = async (email: string, password: string) => {
  setLoading(true);
  clearError();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      // Check if it's an email confirmation error
      if (error.message?.includes('Email not confirmed')) {
        // Resend confirmation email and show friendly message
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
      await fetchUserProfile(data.user.id);
      addNotification('success', 'Welcome Back!', 'You have been successfully logged in.');
      router.push('/dashboard');
    } else {
      throw new Error('No user data received after login');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Login failed. Please check your credentials.';
    setError(errorMessage);
    addNotification('error', 'Login Failed', errorMessage);
    setLoading(false);
    throw new Error(errorMessage);
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
    // Create auth user
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user data received after signup');
    }

    // Create user profile with correct field names
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: userData.email.trim().toLowerCase(),
          full_name: userData.name,
          phone_number: userData.phone,
          church_name: userData.church,
          role: userData.role,
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw here - the user was created in auth, just profile failed
    }

    // Check if email confirmation is required
    if (authData.session) {
      // User is immediately logged in (email confirmation might not be required)
      await fetchUserProfile(authData.user.id);
      addNotification('success', 'Account Created!', 'Your account has been created successfully.');
      router.push('/dashboard');
    } else {
      // Email confirmation required
      addNotification(
        'success', 
        'Account Created!', 
        'Please check your email to confirm your account before logging in.'
      );
      // Don't auto-login, wait for email confirmation
      setLoading(false);
    }
    
  } catch (error: any) {
    const errorMessage = error.message || 'Signup failed. Please try again.';
    setError(errorMessage);
    addNotification('error', 'Signup Failed', errorMessage);
    setLoading(false);
    throw new Error(errorMessage);
  }
};

  const updateProfile = async (profileData: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number,
          church_name: profileData.church_name,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
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
      addNotification('success', 'Logged Out', 'You have been successfully logged out.');
      router.push('/login');
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