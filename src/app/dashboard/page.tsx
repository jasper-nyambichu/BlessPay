'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  // Make sure stats is used in the JSX below
  const stats = [
    { icon: DollarSign, label: "Total Given", value: "$1,250", change: "+12%" },
    { icon: Calendar, label: "This Month", value: "$150", change: "+5%" },
    { icon: TrendingUp, label: "Growth", value: "24%", change: "+8%" },
    { icon: Users, label: "Community", value: "156", change: "+3%" }
  ];

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-sda-gray p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-sda-blue mb-2">Dashboard</h1>
            <p className="text-gray-600">Overview of your giving and spiritual journey</p>
          </div>

          {/* MAKE SURE stats IS USED HERE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-sda-blue"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-sda-blue mt-1">{stat.value}</p>
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
                  <stat.icon className="w-8 h-8 text-sda-blue" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rest of your dashboard content */}
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}