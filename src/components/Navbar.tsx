'use client';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle smooth scroll for section links
  const scrollToSection = (sectionId: string) => {
    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Adjust for navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home then scroll
      router.push('/');
      // Use timeout to ensure page loads before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  // Return null for authenticated users (they get dashboard nav)
  if (user) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-gold"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-serif text-2xl font-bold text-foreground">
              Bless<span className="text-gradient-gold">Pay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-accent transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-accent transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              About
            </button>
            <Link
              href="/login"
              className="text-foreground hover:text-accent transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="bg-gradient-to-br from-accent to-accent/80 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-gold hover:shadow-gold/50 font-medium flex items-center gap-2 group hover-lift"
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
            className="md:hidden p-2 rounded-lg hover:bg-primary/5 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
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
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm mt-2 rounded-xl shadow-elevated overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left hover:bg-primary/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-foreground"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-left hover:bg-primary/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-foreground"
                >
                  About
                </button>
                <Link
                  href="/login"
                  className="block hover:bg-primary/5 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-br from-accent to-accent/80 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium text-center flex items-center justify-center gap-2 group mt-4"
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