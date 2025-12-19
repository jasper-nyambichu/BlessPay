// src/app/notifications/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, Check, Trash2, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your tithe payment of KES 5,000 has been processed successfully.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'info',
      title: 'Monthly Statement',
      message: 'Your October 2024 giving statement is now available for download.',
      time: '1 day ago',
      read: true,
      icon: Info
    },
    {
      id: 3,
      type: 'warning',
      title: 'Upcoming Event',
      message: 'Church camp meeting this weekend. Please RSVP by tomorrow.',
      time: '2 days ago',
      read: true,
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      time: '3 days ago',
      read: true,
      icon: CheckCircle
    },
    {
      id: 5,
      type: 'info',
      title: 'New Feature Available',
      message: 'Try out our new recurring payment feature for consistent giving.',
      time: '1 week ago',
      read: true,
      icon: Info
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-accent';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-accent/10';
      case 'warning': return 'bg-amber-500/10';
      case 'info': return 'bg-primary/10';
      default: return 'bg-muted';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  Stay updated with your account activity and church events
                </p>
              </div>
              
              {/* Notification Badge */}
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="font-medium text-accent">{unreadCount} unread</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                onClick={markAllAsRead}
                variant="navy-outline" 
                className="gap-2"
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4" />
                Mark All as Read
              </Button>
              <Button 
                onClick={clearAllNotifications}
                variant="outline" 
                className="gap-2"
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
              <Button variant="navy-outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="important" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Important
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <NotificationList notifications={notifications} />
            </TabsContent>
            
            <TabsContent value="unread" className="mt-6">
              <NotificationList notifications={notifications.filter(n => !n.read)} />
            </TabsContent>
            
            <TabsContent value="important" className="mt-6">
              <NotificationList notifications={notifications.filter(n => n.type === 'warning')} />
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl border border-border p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                All caught up!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have any notifications right now. When you do, they'll appear here.
              </p>
              <Button variant="gold">Explore Dashboard</Button>
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
              "Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour."
            </p>
            <p className="text-muted-foreground text-center text-sm mt-2">— 1 Peter 5:8</p>
          </motion.div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}

function NotificationList({ notifications }: { notifications: any[] }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No notifications in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => {
        const Icon = notification.icon;
        return (
          <motion.div
            key={notification.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-card rounded-2xl border border-border p-6 shadow-soft transition-all hover-lift ${
              !notification.read ? 'ring-2 ring-accent/20' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getBgColor(notification.type)}`}>
                <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-foreground/80">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Helper functions
function getIconColor(type: string) {
  switch (type) {
    case 'success': return 'text-accent';
    case 'warning': return 'text-amber-500';
    case 'info': return 'text-primary';
    default: return 'text-muted-foreground';
  }
}

function getBgColor(type: string) {
  switch (type) {
    case 'success': return 'bg-accent/10';
    case 'warning': return 'bg-amber-500/10';
    case 'info': return 'bg-primary/10';
    default: return 'bg-muted';
  }
}