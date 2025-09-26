'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
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
        {/* ... rest of dashboard content ... */}
      </motion.div>
    </ProtectedRoute>
  );
}