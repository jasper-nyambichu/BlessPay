'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, LogIn, MailCheck } from 'lucide-react';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'processing'>('loading');
  const [message, setMessage] = useState('Completing authentication...');
  const [authType, setAuthType] = useState<'oauth' | 'email' | 'unknown'>('unknown');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Auth callback initiated');
        
        // Check URL parameters for OAuth callback
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('❌ OAuth error from provider:', error, errorDescription);
          throw new Error(errorDescription || `Authentication failed: ${error}`);
        }

        // Check if this is an OAuth callback
        if (code) {
          console.log('🔐 Processing OAuth callback with code');
          setAuthType('oauth');
          setMessage('Completing Google authentication...');
        } else {
          console.log('📧 Processing email verification callback');
          setAuthType('email');
          setMessage('Verifying your email...');
        }

        setStatus('processing');

        // Get the session from the URL fragments (handled by Supabase)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          // Check if this is a new OAuth user
          const userMetadata = session.user.user_metadata;
          const isOAuthUser = userMetadata?.provider === 'google' || 
                              userMetadata?.avatar_url || 
                              userMetadata?.picture;
          
          console.log('✅ Authentication successful:', {
            userId: session.user.id,
            email: session.user.email,
            isOAuthUser,
            provider: userMetadata?.provider
          });

          setStatus('success');
          
          if (isOAuthUser) {
            setMessage('Google authentication successful! Welcome to BlessPay.');
          } else if (authType === 'email') {
            setMessage('Email verified successfully! Welcome to BlessPay.');
          } else {
            setMessage('Authentication successful! Welcome to BlessPay.');
          }

          // Store auth completion timestamp to prevent immediate logout
          localStorage.setItem('auth_completed_at', Date.now().toString());

          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            router.push('/dashboard');
          }, 2000);
        } else {
          // No session found - try to manually exchange the code for session
          if (code) {
            console.log('🔄 Attempting to exchange code for session...');
            setMessage('Finalizing authentication...');
            
            // Wait a bit for Supabase to process the OAuth response
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
            
            if (retryError || !retrySession) {
              console.error('❌ Failed to get session after retry:', retryError);
              throw new Error('Unable to complete authentication. Please try signing in again.');
            }
            
            // Session obtained successfully
            setStatus('success');
            setMessage('Authentication successful! Welcome to BlessPay.');
            
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } else {
            throw new Error('Unable to complete authentication. Please try signing in again.');
          }
        }
      } catch (error: any) {
        console.error('❌ Auth callback error:', error);
        setStatus('error');
        
        // Provide user-friendly error messages
        if (error.message?.includes('already confirmed')) {
          setMessage('This email has already been verified. Please sign in.');
        } else if (error.message?.includes('expired')) {
          setMessage('The verification link has expired. Please request a new one.');
        } else if (error.message?.includes('invalid')) {
          setMessage('Invalid verification link. Please try again.');
        } else if (error.message?.includes('OAuth')) {
          setMessage('Google authentication failed. Please try again.');
        } else {
          setMessage(error.message || 'Failed to complete authentication. Please try again.');
        }
        
        // Redirect to login after showing error
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,15%)] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-[hsl(240,10%,20%)] rounded-2xl shadow-2xl p-8 text-center border border-gold/20"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
            <div className="w-6 h-6 text-gold">
              {status === 'loading' || status === 'processing' ? (
                <LogIn className="w-6 h-6" />
              ) : status === 'success' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
          </div>
          <span className="text-white text-xl font-serif font-bold">BlessPay</span>
        </div>

        {/* Status Indicator */}
        <div className="mb-6">
          {status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {authType === 'oauth' ? 'Connecting with Google' : 'Processing Request'}
              </h2>
            </>
          )}

          {status === 'processing' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {authType === 'oauth' ? 'Finalizing Google Sign-In' : 'Verifying Account'}
              </h2>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-gradient-to-r from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                {authType === 'email' ? (
                  <MailCheck className="w-8 h-8 text-navy" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-navy" />
                )}
              </motion.div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {authType === 'oauth' ? 'Welcome!' : 'Email Verified!'}
              </h2>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                Authentication Failed
              </h2>
            </>
          )}

          <p className="text-cream/70">{message}</p>
        </div>

        {/* Additional Info */}
        {status === 'loading' || status === 'processing' ? (
          <div className="space-y-2 text-cream/50 text-sm">
            <p>This should only take a moment...</p>
            <p className="text-xs">Do not close this window</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-4">
            <div className="h-px bg-gold/20 w-full" />
            <p className="text-cream/60 text-sm">
              You will be automatically redirected to the dashboard
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gold hover:text-gold/80 text-sm underline transition-colors"
            >
              Click here if not redirected
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-px bg-red-500/20 w-full" />
            <p className="text-cream/60 text-sm">
              You will be redirected to the login page to try again
            </p>
            <button
              onClick={() => router.push('/login')}
              className="text-gold hover:text-gold/80 text-sm underline transition-colors"
            >
              Go to login now
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-cream/10">
          <p className="text-cream/40 text-xs">
            Having trouble?{' '}
            <a href="mailto:support@blesspay.com" className="text-gold hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </motion.div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}