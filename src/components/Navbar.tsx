'use client';
import { User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sda-blue text-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold flex items-center">
            🙏 BlessPay
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  Dashboard
                </Link>
                <Link href="/payments" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  Payments
                </Link>
                <Link href="/history" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  History
                </Link>
                <Link href="/profile" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-400">
                  <User className="w-5 h-5" />
                  <span>{user.name}</span>
                  <button onClick={logout} className="hover:text-blue-200">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-blue-400"
            >
              <div className="py-4 space-y-4">
                {/* Mobile menu items similar to desktop */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}