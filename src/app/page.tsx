'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">BlessPay</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Manage your tithes and offerings with a faith-inspired system designed for 
              the Seventh-day Adventist community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/login"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
                  >
                    View Dashboard
                  </Link>
                </>
              )}
            </div>

            <div className="w-24 h-1 bg-blue-600 mx-auto mb-16"></div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Secure Feature */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Bank-level security for all transactions with end-to-end encryption and 
                secure payment processing.
              </p>
            </div>

            {/* Simple Feature */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simple</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Easy-to-use interface designed for all ages with intuitive navigation 
                and step-by-step guidance.
              </p>
            </div>

            {/* Spiritual Feature */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Spiritual</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Designed with faith principles to support your spiritual journey and 
                church community growth.
              </p>
            </div>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Join Thousands of Faithful Members
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the convenience of modern digital giving while staying true to 
              your spiritual commitments. BlessPay makes supporting your church community 
              simple, secure, and meaningful.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600">Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Churches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$5M+</div>
                <div className="text-gray-600">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}