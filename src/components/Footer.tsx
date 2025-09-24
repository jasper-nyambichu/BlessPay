'use client';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sda-blue text-white py-8 mt-auto"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-xl font-bold">BlessPay</span>
          </div>
          <p className="text-blue-200 mb-2">&copy; 2025 BlessPay. All rights reserved.</p>
          <p className="text-blue-300 text-sm">Seventh-day Adventist Church Offering System</p>
          
          <div className="flex justify-center space-x-6 mt-4 text-blue-200 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}