'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sda-white to-sda-gray p-6"
    >
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-sda-blue mb-6 leading-tight"
        >
          Welcome to <span className="text-blue-600">BlessPay</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
        >
          Manage your tithes and offerings with a faith-inspired system designed for the Seventh-day Adventist community.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/payments" 
            className="bg-sda-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link 
            href="/dashboard" 
            className="border-2 border-sda-blue text-sda-blue px-8 py-3 rounded-lg font-semibold hover:bg-sda-blue hover:text-white transition-all duration-300"
          >
            View Dashboard
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Secure", desc: "Bank-level security for all transactions" },
            { title: "Simple", desc: "Easy-to-use interface for all ages" },
            { title: "Spiritual", desc: "Designed with faith principles" }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-sda-blue text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}