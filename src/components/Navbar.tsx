'use client';
import { User, LogOut, Menu, X, Bell, Settings, ChevronDown } from 'lucide-react';
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
      className="bg-blue-600 text-white shadow-lg sticky top-0 z-50"
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
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                    Admin
                  </Link>
                )}
                
                {/* Notifications */}
                <Link href="/notifications" className="hover:text-blue-200 transition-colors duration-200 relative">
                  <Bell className="w-5 h-5" />
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <span>{user.full_name || user.email}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50"
                      >
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <Link 
                          href="/notifications" 
                          className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Notifications
                        </Link>
                        <Link 
                          href="/settings" 
                          className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors duration-200">
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
                {user ? (
                  <>
                    <Link href="/dashboard" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/payments" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Payments
                    </Link>
                    <Link href="/history" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      History
                    </Link>
                    <Link href="/profile" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link href="/notifications" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Notifications
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                        Admin
                      </Link>
                    )}
                    <button onClick={logout} className="block hover:text-blue-200 transition-colors duration-200 font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link href="/signup" className="block hover:text-blue-200 transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
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