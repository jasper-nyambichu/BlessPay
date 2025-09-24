'use client';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h1 className="text-3xl font-bold text-sda-blue mb-6">Profile</h1>
      <p className="text-gray-600">Manage your account details.</p>
      {/* Placeholder for data */}
    </motion.div>
  );
}