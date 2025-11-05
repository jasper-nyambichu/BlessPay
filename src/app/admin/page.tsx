// src/app/admin/page.tsx
'use client';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

export default function Admin() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AuthenticatedLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage users and system reports</p>
          </motion.div>

          {/* Admin Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Stats Cards */}
            {[
              { title: 'Total Users', value: '1,234', color: 'from-blue-500 to-cyan-500' },
              { title: 'Total Revenue', value: '$45,678', color: 'from-green-500 to-emerald-500' },
              { title: 'Monthly Growth', value: '+12.5%', color: 'from-purple-500 to-pink-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <div className="w-6 h-6 bg-white/30 rounded"></div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Manage Users', description: 'Add, edit, or remove users' },
                { label: 'View Reports', description: 'Generate financial reports' },
                { label: 'System Settings', description: 'Configure application settings' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 border border-gray-200 rounded-xl text-left hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}