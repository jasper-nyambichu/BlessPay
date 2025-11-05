// src/app/notifications/page.tsx
'use client';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your tithe payment of $50 has been processed successfully.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'info',
      title: 'Monthly Statement',
      message: 'Your October 2024 giving statement is now available.',
      time: '1 day ago',
      read: true,
      icon: Info
    },
    {
      id: 3,
      type: 'warning',
      title: 'Upcoming Event',
      message: 'Church picnic this Saturday. Don\'t forget to RSVP!',
      time: '2 days ago',
      read: true,
      icon: AlertTriangle
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with your account activity</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              Mark All as Read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  notification.type === 'success' ? 'border-green-500' :
                  notification.type === 'warning' ? 'border-yellow-500' :
                  'border-blue-500'
                } ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <notification.icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className="text-sm text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}