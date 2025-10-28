'use client';
import { User, LogOut, Menu, X, Bell, Settings, ChevronDown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hover:text-purple-200 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/payments" 
                  className="hover:text-purple-200 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  Payments
                </Link>
                <Link 
                  href="/history" 
                  className="hover:text-purple-200 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  History
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="hover:text-purple-200 transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                  >
                    Admin
                  </Link>
                )}
                
                {/* Notifications */}
                <Link 
                  href="/notifications" 
                  className="hover:text-purple-200 transition-all duration-200 relative p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full border-2 border-purple-700"></div>
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-3 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 px-3 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover border-2 border-white/30" 
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium max-w-32 truncate">
                      {user.full_name || user.email}
                    </span>
                    <motion.div
                      animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg text-gray-800 rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.full_name || 'User'}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          className="flex items-center px-4 py-3 hover:bg-purple-50 transition-colors duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>Profile</span>
                        </Link>
                        
                        <Link 
                          href="/notifications" 
                          className="flex items-center px-4 py-3 hover:bg-purple-50 transition-colors duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                            <Bell className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>Notifications</span>
                        </Link>
                        
                        <Link 
                          href="/settings" 
                          className="flex items-center px-4 py-3 hover:bg-purple-50 transition-colors duration-200 group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                            <Settings className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition-colors duration-200 group text-red-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span>Logout</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/payments" 
                      className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Payments
                    </Link>
                    <Link 
                      href="/history" 
                      className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      History
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <div className="border-t border-purple-500/30 my-2"></div>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="block w-full text-left hover:bg-red-500/20 text-red-200 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}