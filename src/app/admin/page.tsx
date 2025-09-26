'use client';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Admin() {
  return (
    <ProtectedRoute requiredRole="admin">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <h1 className="text-3xl font-bold text-sda-blue mb-6">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and reports.</p>
        {/* Admin-specific content */}
      </motion.div>
    </ProtectedRoute>
  );
}