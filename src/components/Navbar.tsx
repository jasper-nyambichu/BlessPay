'use client';
import { User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sda-blue text-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center">
            🙏 BlessPay
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {['Dashboard', 'Payments', 'History', 'Profile', 'Admin'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`}
                className="hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                {item}
              </Link>
            ))}
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-400">
              <User className="w-5 h-5" />
              <span>Guest</span>
              <LogOut className="w-5 h-5 cursor-pointer hover:text-blue-200" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
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
                {['Dashboard', 'Payments', 'History', 'Profile', 'Admin'].map((item) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="block hover:text-blue-200 transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="flex items-center space-x-3 pt-4 border-t border-blue-400">
                  <User className="w-5 h-5" />
                  <span>Guest</span>
                  <LogOut className="w-5 h-5 cursor-pointer hover:text-blue-200 ml-auto" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}