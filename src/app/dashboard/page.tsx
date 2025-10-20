// src/app/dashboard/page.tsx (Enhanced)
'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { 
      icon: DollarSign, 
      label: "Total Given", 
      value: "$1,250", 
      change: "+12%",
      trend: 'up',
      description: "Lifetime contributions"
    },
    { 
      icon: Calendar, 
      label: "This Month", 
      value: "$150", 
      change: "+5%",
      trend: 'up',
      description: "October 2024"
    },
    { 
      icon: TrendingUp, 
      label: "Growth", 
      value: "24%", 
      change: "+8%",
      trend: 'up',
      description: "Year over year"
    },
    { 
      icon: Users, 
      label: "Community", 
      value: "156", 
      change: "+3%",
      trend: 'up',
      description: "Active members"
    }
  ];

  const recentActivities = [
    { type: 'Tithe', amount: '$50', date: '2 hours ago', status: 'completed' },
    { type: 'Offering', amount: '$25', date: '1 day ago', status: 'completed' },
    { type: 'Building Fund', amount: '$100', date: '3 days ago', status: 'completed' },
  ];

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Friend'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">Here's your giving overview and spiritual journey</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`p-1 rounded-lg ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.trend === 'up' ? 
                      <ArrowUpRight className="w-4 h-4" /> : 
                      <ArrowDownRight className="w-4 h-4" />
                    }
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">{stat.description}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{activity.amount}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {activity.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Make a Payment</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>View History</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>My Profile</span>
                </motion.button>
              </div>

              {/* Spiritual Quote */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-700 italic">
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </p>
                <p className="text-xs text-gray-500 mt-2">- 2 Corinthians 9:7</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}