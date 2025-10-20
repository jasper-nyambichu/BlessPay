// src/app/settings/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, CreditCard, Globe, Moon, Sun } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Notifications */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Privacy & Security */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>
              
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </button>
                
                <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </button>
              </div>
            </motion.div>

            {/* Appearance */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                {darkMode ? <Moon className="w-6 h-6 text-indigo-600 mr-3" /> : <Sun className="w-6 h-6 text-yellow-600 mr-3" />}
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}