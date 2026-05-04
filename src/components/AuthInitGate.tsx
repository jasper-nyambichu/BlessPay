// src/components/AuthInitGate.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthInitGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized } = useAuth();

  return (
    <>
      {/* ✅ ONE global spinner while auth initializes */}
      {/* This prevents ProtectedRoute AND LoginForm from showing their own spinners */}
      <AnimatePresence>
        {!isInitialized && (
          <motion.div
            key="auth-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(240,10%,15%)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-[hsl(38,70%,55%)] border-t-transparent rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-serif font-semibold text-white">BlessPay</h2>
              <p className="text-white/50 text-sm">Loading...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Children always render but hidden until ready */}
      {/* visibility:hidden prevents flash but keeps layout stable */}
      <div style={{ visibility: isInitialized ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  );
}