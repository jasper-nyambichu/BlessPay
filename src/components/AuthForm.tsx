'use client';

import { User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';

export default function AuthForm() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-sda-blue mb-4">Sign In</h2>
      <form className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <Input placeholder="Email" type="email" />
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <Input placeholder="Password" type="password" />
          </label>
        </div>
        <Button className="w-full">Sign In</Button>
        <p className="text-center text-sm text-gray-600">
          Need an account? <a href="#" className="text-sda-blue">Register</a>
        </p>
        {/* Placeholder for loading */}
        <LoadingSpinner />
      </form>
    </motion.div>
  );
}