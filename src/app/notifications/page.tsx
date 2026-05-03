'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, Check, Trash2, XCircle, RefreshCw } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const TYPE_CONFIG = {
  success: { icon: CheckCircle,   bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  info:    { icon: Info,          bg: 'bg-blue-500/10',    color: 'text-blue-500'    },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10',   color: 'text-amber-500'   },
  error:   { icon: XCircle,       bg: 'bg-rose-500/10',    color: 'text-rose-500'    },
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [isReal, setIsReal]               = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/notifications');
      setNotifications(data.notifications);
      setIsReal(true);
    } catch {
      setIsReal(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/api/notifications/clear-all');
      setNotifications([]);
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  Stay updated with your account activity
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Real data indicator */}
                {!loading && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isReal
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isReal ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {isReal ? 'Live data' : 'Unavailable'}
                  </div>
                )}

                {unreadCount > 0 && (
                  <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="font-medium text-accent text-sm">{unreadCount} unread</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleMarkAllAsRead} variant="navy-outline" className="gap-2" disabled={unreadCount === 0 || loading}>
                <Check className="w-4 h-4" /> Mark All as Read
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="gap-2" disabled={notifications.length === 0 || loading}>
                <Trash2 className="w-4 h-4" /> Clear All
              </Button>
              <Button onClick={fetchNotifications} variant="navy-outline" className="gap-2" disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          )}

          {/* Tabs */}
          {!loading && (
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="all"       className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread"    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="important" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  Important
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <NotificationList
                  notifications={notifications}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="unread" className="mt-6">
                <NotificationList
                  notifications={notifications.filter(n => !n.read)}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="important" className="mt-6">
                <NotificationList
                  notifications={notifications.filter(n => n.type === 'warning' || n.type === 'error')}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Spiritual Quote */}
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/20"
            >
              <p className="text-foreground/80 italic text-center font-serif">
                "Be alert and of sober mind."
              </p>
              <p className="text-muted-foreground text-center text-sm mt-2">— 1 Peter 5:8</p>
            </motion.div>
          )}
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}

function NotificationList({ notifications, onMarkRead, onDelete }: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border p-12 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Bell className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">All caught up!</h3>
        <p className="text-muted-foreground text-sm">No notifications here yet. They'll appear when there's activity on your account.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {notifications.map((n, index) => {
          const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
          const Icon   = config.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.04 }}
              className={`bg-card rounded-2xl border p-5 transition-all ${
                !n.read ? 'border-accent/30 ring-1 ring-accent/20' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{n.title}</h3>
                      {!n.read && <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-foreground/70 text-sm">{n.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(n.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
