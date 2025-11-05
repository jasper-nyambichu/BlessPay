// src/components/Navbar.tsx (UPDATED - Public only version)
'use client';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  // If user is authenticated, don't show this navbar
  if (user) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white shadow-xl sticky top-0 z-50 border-b border-purple-500/30"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Heart className="w-5 h-5" />
            </motion.div>
            <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              BlessPay
            </span>
          </Link>

          {/* Desktop Navigation - Public only */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/login" 
              className="hover:text-purple-200 transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              Login
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-purple-500/30 bg-purple-700/95 backdrop-blur-lg"
            >
              <div className="py-4 space-y-2">
                <Link 
                  href="/login" 
                  className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}