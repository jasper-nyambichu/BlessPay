'use client';
import { motion } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Payment Successful',
    message: 'Your offering payment of $50 has been processed successfully.',
    date: '2024-01-15T10:30:00Z',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Church Event',
    message: 'Remember the prayer meeting this Friday at 7 PM.',
    date: '2024-01-14T14:20:00Z',
    read: true,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Profile Update',
    message: 'Please complete your profile information for better experience.',
    date: '2024-01-13T09:15:00Z',
    read: true,
  },
];

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
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
            <p className="text-gray-600 mt-2">Stay updated with your church activities</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {mockNotifications.filter(n => !n.read).length} Unread
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {mockNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
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

          {mockNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}