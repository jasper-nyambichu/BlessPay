// src/app/history/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, Search, ChevronRight, FileText, CreditCard, TrendingUp } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryPage() {
  const [transactions] = useState([
    {
      id: 1,
      type: 'Tithe',
      amount: 5000,
      date: '2024-11-15',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'BLESS_789012'
    },
    {
      id: 2,
      type: 'General Offering',
      amount: 2000,
      date: '2024-11-10',
      status: 'Completed',
      method: 'Card',
      reference: 'BLESS_345678'
    },
    {
      id: 3,
      type: 'Camp Meeting',
      amount: 3000,
      date: '2024-11-05',
      status: 'Pending',
      method: 'M-Pesa',
      reference: 'BLESS_901234'
    },
    {
      id: 4,
      type: 'Building Fund',
      amount: 10000,
      date: '2024-10-28',
      status: 'Completed',
      method: 'Bank Transfer',
      reference: 'BLESS_567890'
    },
    {
      id: 5,
      type: 'Tithe',
      amount: 5000,
      date: '2024-10-15',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'BLESS_123456'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalGiven = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = transactions.filter(t => t.status === 'Completed');
  const pendingTransactions = transactions.filter(t => t.status === 'Pending');

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Giving History
            </h1>
            <p className="text-muted-foreground">
              View your tithe and offering records
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Given</p>
                  <p className="text-2xl font-bold text-gradient-gold">{formatCurrency(totalGiven)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-accent">{completedTransactions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-500">{pendingTransactions.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                All Transactions
              </TabsTrigger>
              <TabsTrigger value="tithe" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Tithe
              </TabsTrigger>
              <TabsTrigger value="offerings" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Offerings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <TransactionsSection transactions={transactions} />
            </TabsContent>
            
            <TabsContent value="tithe" className="mt-6">
              <TransactionsSection transactions={transactions.filter(t => t.type === 'Tithe')} />
            </TabsContent>
            
            <TabsContent value="offerings" className="mt-6">
              <TransactionsSection transactions={transactions.filter(t => t.type !== 'Tithe')} />
            </TabsContent>
          </Tabs>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6 shadow-soft mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference, type, or amount..."
                  className="pl-10 border-border focus:border-accent"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="navy-outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  This Month
                </Button>
                <Button variant="navy-outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="gold" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Empty State */}
          {transactions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border border-border p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                No transactions yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your giving history will appear here once you make your first offering.
              </p>
              <Button variant="gold">Make Your First Offering</Button>
            </motion.div>
          )}

          {/* Spiritual Quote */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/20"
          >
            <p className="text-foreground/80 italic text-center font-serif">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
            </p>
            <p className="text-muted-foreground text-center text-sm mt-2">— 2 Corinthians 9:7</p>
          </motion.div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}

function TransactionsSection({ transactions }: { transactions: any[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No transactions in this category</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-navy">
            <tr>
              <th className="text-left py-4 px-6 text-cream font-semibold">Type</th>
              <th className="text-left py-4 px-6 text-cream font-semibold">Amount</th>
              <th className="text-left py-4 px-6 text-cream font-semibold">Date</th>
              <th className="text-left py-4 px-6 text-cream font-semibold">Status</th>
              <th className="text-left py-4 px-6 text-cream font-semibold">Method</th>
              <th className="text-left py-4 px-6 text-cream font-semibold">Reference</th>
              <th className="text-left py-4 px-6 text-cream font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border last:border-0 hover:bg-muted/20"
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{transaction.type}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-accent">{formatCurrency(transaction.amount)}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground/80">{formatDate(transaction.date)}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'Completed' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground/80">{transaction.method}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-mono text-sm text-muted-foreground">{transaction.reference}</div>
                </td>
                <td className="py-4 px-6">
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Import CheckCircle
import { CheckCircle } from 'lucide-react';