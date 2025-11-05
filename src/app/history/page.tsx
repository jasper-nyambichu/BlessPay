'use client';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';

export default function History() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h1 className="text-3xl font-bold text-sda-blue mb-6">Payment History</h1>
      <p className="text-gray-600">View your tithe and offering records.</p>
      {/* Placeholder for data */}
    </motion.div>
    </AuthenticatedLayout>
    </ProtectedRoute>
  );
}