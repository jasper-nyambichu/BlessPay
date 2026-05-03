'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, Search, ChevronRight, FileText, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  phone: string;
  status: string;
  mpesa_receipt_number: string | null;
  failure_reason: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/user/transactions');
        setTransactions(data.transactions);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filtered = transactions.filter(t =>
    search === '' ||
    t.type.toLowerCase().includes(search.toLowerCase()) ||
    t.mpesa_receipt_number?.toLowerCase().includes(search.toLowerCase()) ||
    String(t.amount).includes(search)
  );

  const totalGiven             = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + Number(t.amount), 0);
  const completedTransactions  = transactions.filter(t => t.status === 'success');
  const pendingTransactions    = transactions.filter(t => t.status === 'pending');

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Giving History</h1>
            <p className="text-muted-foreground">View your tithe and offering records</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: CreditCard, label: 'Total Given',    value: formatCurrency(totalGiven),          color: 'text-accent' },
              { icon: FileText,   label: 'Transactions',   value: String(transactions.length),          color: 'text-foreground' },
              { icon: CheckCircle,label: 'Completed',      value: String(completedTransactions.length), color: 'text-accent' },
              { icon: TrendingUp, label: 'Pending',        value: String(pendingTransactions.length),   color: 'text-amber-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>
                      {loading ? <span className="animate-pulse">...</span> : value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Search & Filters */}
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
                  placeholder="Search by type, receipt or amount..."
                  className="pl-10 border-border focus:border-accent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="navy-outline" className="gap-2">
                  <Calendar className="w-4 h-4" /> This Month
                </Button>
                <Button variant="navy-outline" className="gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                <Button variant="gold" className="gap-2">
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all"      className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">All</TabsTrigger>
              <TabsTrigger value="tithe"    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Tithe</TabsTrigger>
              <TabsTrigger value="offering" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Offering</TabsTrigger>
            </TabsList>
            <TabsContent value="all"      className="mt-6"><TransactionsTable transactions={filtered} loading={loading} formatCurrency={formatCurrency} formatDate={formatDate} /></TabsContent>
            <TabsContent value="tithe"    className="mt-6"><TransactionsTable transactions={filtered.filter(t => t.type === 'tithe')} loading={loading} formatCurrency={formatCurrency} formatDate={formatDate} /></TabsContent>
            <TabsContent value="offering" className="mt-6"><TransactionsTable transactions={filtered.filter(t => t.type === 'offering')} loading={loading} formatCurrency={formatCurrency} formatDate={formatDate} /></TabsContent>
          </Tabs>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/20">
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

function TransactionsTable({ transactions, loading, formatCurrency, formatDate }: {
  transactions: Transaction[];
  loading: boolean;
  formatCurrency: (n: number) => string;
  formatDate: (s: string) => string;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
      </div>
    );
  }

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
              {['Type', 'Amount', 'Date', 'Status', 'Receipt', ''].map(h => (
                <th key={h} className="text-left py-4 px-6 text-cream font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border last:border-0 hover:bg-muted/20"
              >
                <td className="py-4 px-6 font-medium text-foreground capitalize">{tx.type}</td>
                <td className="py-4 px-6 font-bold text-accent">{formatCurrency(tx.amount)}</td>
                <td className="py-4 px-6 text-foreground/80">{formatDate(tx.created_at)}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'success'  ? 'bg-accent/10 text-accent' :
                    tx.status === 'pending'  ? 'bg-amber-500/10 text-amber-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-sm text-muted-foreground">
                  {tx.mpesa_receipt_number || '—'}
                </td>
                <td className="py-4 px-6">
                  <Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
