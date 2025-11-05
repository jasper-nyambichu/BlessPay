// src/app/dashboard/page.tsx
'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Heart, Target, BarChart3 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const stats = [
    { 
      icon: DollarSign, 
      label: "Total Contributions", 
      value: "$1,250", 
      change: "+12%",
      trend: 'up',
      description: "Lifetime giving",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-100"
    },
    { 
      icon: Calendar, 
      label: "Monthly Giving", 
      value: "$150", 
      change: "+5%",
      trend: 'up',
      description: "October 2024",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-100"
    },
    { 
      icon: TrendingUp, 
      label: "Growth Rate", 
      value: "24%", 
      change: "+8%",
      trend: 'up',
      description: "Year over year",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-100"
    },
    { 
      icon: Users, 
      label: "Community Impact", 
      value: "156", 
      change: "+3%",
      trend: 'up',
      description: "Active members",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-100"
    }
  ];

  const recentActivities = [
    { 
      type: 'Tithe', 
      amount: '$50', 
      date: '2 hours ago', 
      status: 'completed',
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      type: 'Offering', 
      amount: '$25', 
      date: '1 day ago', 
      status: 'completed',
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    { 
      type: 'Building Fund', 
      amount: '$100', 
      date: '3 days ago', 
      status: 'completed',
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center lg:text-left"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight"
          >
            Welcome back, {user?.full_name?.split(' ')[0] || 'Friend'}! 
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700 font-medium max-w-2xl mx-auto lg:mx-0"
          >
            Your <span className="font-bold text-indigo-600">Generosity Journey</span> and <span className="font-bold text-purple-600">Spiritual Growth</span> Overview
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`${stat.bgColor} backdrop-blur-sm p-6 rounded-3xl shadow-xl border-2 ${stat.borderColor} hover:shadow-2xl transition-all duration-500 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`p-2 rounded-xl ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  } shadow-sm`}
                >
                  {stat.trend === 'up' ? 
                    <ArrowUpRight className="w-4 h-4" /> : 
                    <ArrowDownRight className="w-4 h-4" />
                  }
                </motion.div>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2 tracking-wide uppercase">{stat.label}</p>
                <motion.p 
                  className="text-3xl font-black text-gray-900 mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">{stat.description}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/30 p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recent Transactions
              </h2>
              <motion.button 
                onClick={() => handleNavigation('/history')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                View All
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ 
                    x: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.8)"
                  }}
                  className="flex items-center justify-between p-5 bg-white/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`w-12 h-12 ${activity.bgColor} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                    </motion.div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{activity.type}</p>
                      <p className="text-sm text-gray-600 font-medium">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-lg">{activity.amount}</p>
                    <span className="inline-block px-3 py-1 text-xs bg-emerald-100 text-emerald-800 font-bold rounded-full shadow-sm">
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Spiritual Section */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/30 p-8">
              <h2 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                Quick Actions
              </h2>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleNavigation('/payments')}
                  whileHover={{ 
                    scale: 1.03,
                    y: -2
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-6 rounded-2xl font-black text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <DollarSign className="w-6 h-6" />
                  <span>Make a Donation</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleNavigation('/history')}
                  whileHover={{ 
                    scale: 1.03,
                    y: -2
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-black text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>Giving History</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleNavigation('/profile')}
                  whileHover={{ 
                    scale: 1.03,
                    y: -2
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-2xl font-black text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <Users className="w-6 h-6" />
                  <span>Account Settings</span>
                </motion.button>
              </div>
            </div>

            {/* Spiritual Quote */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl border-2 border-white/30"
            >
              <div className="text-white">
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className="text-lg font-semibold italic mb-4 leading-relaxed"
                >
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </motion.p>
                <div className="flex items-center justify-between">
                  <p className="text-indigo-100 font-bold text-sm">- 2 Corinthians 9:7</p>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 font-medium text-sm">
            Your generosity makes a difference • Blessed to be a blessing
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <DashboardContent />
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}