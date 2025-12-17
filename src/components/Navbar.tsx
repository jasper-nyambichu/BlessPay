'use client';
import { Menu, X, Shield, ArrowRight, Heart } from 'lucide-react';
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
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-muted shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-cormorant text-2xl font-bold text-navy">
              Bless<span className="text-gradient-gold">Pay</span>
            </span>
          </Link>

          {/* Desktop Navigation - Public only */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/features" 
              className="text-navy hover:text-gold transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-navy/5"
            >
              Features
            </Link>
            <Link 
              href="/about" 
              className="text-navy hover:text-gold transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-navy/5"
            >
              About
            </Link>
            <Link 
              href="/login" 
              className="text-navy hover:text-gold transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-navy/5"
            >
              Login
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="bg-gradient-gold text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-gold hover:shadow-gold/50 font-medium flex items-center gap-2 group hover-lift"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg hover:bg-navy/5 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-navy" /> : <Menu className="w-6 h-6 text-navy" />}
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
              className="md:hidden border-t border-muted bg-white/95 backdrop-blur-sm mt-2 rounded-xl shadow-elevated"
            >
              <div className="py-4 space-y-2">
                <Link 
                  href="/features" 
                  className="block hover:bg-navy/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-navy"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/about" 
                  className="block hover:bg-navy/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-navy"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/login" 
                  className="block hover:bg-navy/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-navy"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="block bg-gradient-gold text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium text-center flex items-center justify-center gap-2 group mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}