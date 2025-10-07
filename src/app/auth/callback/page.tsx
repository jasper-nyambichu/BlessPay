'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');
  const router = useRouter();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the current session - this will automatically confirm the email
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (session?.user) {
          // Email confirmed successfully and user is logged in
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to dashboard...');
          
          // Wait a moment to show success message, then redirect
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          // No session found - might need to manually confirm
          throw new Error('Unable to confirm email. Please try logging in.');
        }
      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to confirm email. Please try logging in.');
        
        // Redirect to login after error message
        setTimeout(() => {
          router.push('/login');
        }, 4000);
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirming Email</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </motion.div>
    </div>
  );
}