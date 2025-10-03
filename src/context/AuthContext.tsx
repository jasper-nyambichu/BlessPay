'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  church: string;
  role: 'member' | 'admin' | 'pastor';
  created_at: string;
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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
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
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If profile doesn't exist, create one from session data
        if (error.code === 'PGRST116') {
          await createUserProfileFromSession(userId);
          return;
        }
        throw error;
      }
      
      setUser(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfileFromSession = async (userId: string) => {
    try {
      // Get user email from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) throw new Error('No auth user found');

      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: authUser.email,
            name: authUser.user_metadata?.name || 'User',
            phone: authUser.user_metadata?.phone || '',
            church: authUser.user_metadata?.church || '',
            role: authUser.user_metadata?.role || 'member',
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Refetch the profile
      await fetchUserProfile(userId);
    } catch (error) {
      console.error('Error creating user profile:', error);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
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
    try {
      // Create auth user - CORRECTED SYNTAX
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
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: userData.email.trim().toLowerCase(),
              name: userData.name,
              phone: userData.phone,
              church: userData.church,
              role: userData.role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Profile error:', profileError);
          // Even if profile creation fails, we consider signup successful
          // but log the error for debugging
        }

        // Signup successful, but we don't set loading to false here
        // because we want to show the success message
        // The auth state change will handle setting loading to false
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Full signup error:', error);
      throw new Error(error.message || 'Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
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
    loading,
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