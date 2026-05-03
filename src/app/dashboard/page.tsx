'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, Heart, Target, BarChart3, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import api from '@/lib/api';

interface DashboardSummary {
  totalTithe: number;
  totalOffering: number;
  totalGiven: number;
  transactionCount: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  mpesa_receipt_number: string | null;
  created_at: string;
}

function DashboardContent() {
  const { user }                          = useAuth();
  const router                            = useRouter();
  const [summary, setSummary]             = useState<DashboardSummary | null>(null);
  const [recentTx, setRecentTx]           = useState<Transaction[]>([]);
  const [loadingData, setLoadingData]     = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/api/user/dashboard');
        setSummary(data.summary);
        setRecentTx(data.recentTransactions);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Given',
      value: summary ? formatCurrency(summary.totalGiven) : '—',
      description: 'Lifetime giving',
    },
    {
      icon: Calendar,
      label: 'Total Tithe',
      value: summary ? formatCurrency(summary.totalTithe) : '—',
      description: 'All time',
    },
    {
      icon: TrendingUp,
      label: 'Total Offering',
      value: summary ? formatCurrency(summary.totalOffering) : '—',
      description: 'All time',
    },
    {
      icon: Users,
      label: 'Transactions',
      value: summary ? String(summary.transactionCount) : '—',
      description: 'Completed payments',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-full bg-[hsl(40,30%,96%)] p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[hsl(220,50%,15%)] mb-3">
            Welcome back, {user?.firstName || 'Friend'}
          </h1>
          <p className="text-lg text-[hsl(220,20%,40%)]">
            Your <span className="text-[hsl(38,70%,50%)] font-semibold">Generosity Journey</span> and{' '}
            <span className="text-[hsl(38,70%,50%)] font-semibold">Spiritual Growth</span> Overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300 } }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[hsl(38,40%,85%)] hover:shadow-xl hover:border-[hsl(38,70%,50%)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)]">
                  <stat.icon className="w-6 h-6 text-[hsl(38,70%,55%)]" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-[hsl(220,20%,50%)] text-sm font-medium mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-serif font-bold text-[hsl(220,50%,15%)] mb-1">
                {loadingData ? <span className="animate-pulse">...</span> : stat.value}
              </p>
              <p className="text-xs text-[hsl(220,20%,60%)]">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[hsl(38,40%,85%)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-[hsl(220,50%,15%)]">Recent Transactions</h2>
              <motion.button
                onClick={() => router.push('/history')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)] text-[hsl(38,70%,55%)] py-2 px-5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
              >
                View All
              </motion.button>
            </div>

            <div className="space-y-4">
              {loadingData ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-[hsl(40,30%,94%)] animate-pulse" />
                ))
              ) : recentTx.length === 0 ? (
                <p className="text-center text-[hsl(220,20%,50%)] py-8">No transactions yet. Make your first offering!</p>
              ) : (
                recentTx.map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-[hsl(40,30%,97%)] hover:bg-[hsl(40,30%,94%)] transition-colors border border-[hsl(38,40%,90%)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[hsl(38,70%,50%)] to-[hsl(38,70%,60%)]">
                        {tx.type === 'tithe' ? <DollarSign className="w-5 h-5 text-white" /> : <Heart className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[hsl(220,50%,15%)] capitalize">{tx.type}</p>
                        <p className="text-sm text-[hsl(220,20%,50%)]">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-lg text-[hsl(220,50%,15%)]">{formatCurrency(tx.amount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tx.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Quote */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[hsl(38,40%,85%)] p-6"
            >
              <h2 className="text-xl font-serif font-bold text-[hsl(220,50%,15%)] mb-5">Quick Actions</h2>
              <div className="space-y-3">
                <motion.button
                  onClick={() => router.push('/payments')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[hsl(38,70%,50%)] to-[hsl(38,70%,55%)] text-[hsl(220,50%,15%)] py-4 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Target className="w-5 h-5" />
                  Make a Donation
                </motion.button>
                <motion.button
                  onClick={() => router.push('/history')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)] text-white py-4 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <BarChart3 className="w-5 h-5" />
                  Giving History
                </motion.button>
                <motion.button
                  onClick={() => router.push('/profile')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border-2 border-[hsl(220,50%,20%)] text-[hsl(220,50%,20%)] py-4 px-6 rounded-xl font-bold hover:bg-[hsl(220,50%,20%)] hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Account Settings
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[hsl(220,50%,15%)] to-[hsl(220,50%,25%)] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(38,70%,50%)]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Sparkles className="w-6 h-6 text-[hsl(38,70%,55%)] mb-3" />
              <p className="text-white/90 italic font-serif text-lg leading-relaxed mb-4">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              </p>
              <p className="text-[hsl(38,70%,55%)] font-semibold">— 2 Corinthians 9:7</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-[hsl(220,20%,50%)] text-sm">
            Your generosity makes a difference •{' '}
            <span className="text-[hsl(38,70%,50%)]">Blessed to be a blessing</span>
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
