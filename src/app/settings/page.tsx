'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, CreditCard, Globe, Moon, Sun, Save } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your account preferences
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Notifications */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mr-4">
                  <Bell className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-foreground">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                        value ? 'bg-accent' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-foreground">Security</h2>
                  <p className="text-sm text-muted-foreground">Manage your account security</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button variant="navy-outline" className="w-full justify-start py-6">
                  <Shield className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </Button>
                
                <Button variant="navy-outline" className="w-full justify-start py-6">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                </Button>
              </div>
            </motion.div>

            {/* Appearance */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mr-4">
                  {darkMode ? <Moon className="w-6 h-6 text-accent" /> : <Sun className="w-6 h-6 text-accent" />}
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-foreground">Appearance</h2>
                  <p className="text-sm text-muted-foreground">Customize your interface</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    darkMode ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button className="w-full py-6 text-lg font-semibold bg-accent hover:bg-gold-dark text-accent-foreground rounded-xl shadow-gold">
                <Save className="w-5 h-5 mr-2" />
                Save All Changes
              </Button>
            </motion.div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}