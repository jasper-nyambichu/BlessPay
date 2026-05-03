'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Save, Mail, Phone, Shield, AlertCircle, Check, Lock, Eye, EyeOff } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName:  '',
    phone:     '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [pwLoading,    setPwLoading]    = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [pwError,      setPwError]      = useState('');
  const [pwSuccess,    setPwSuccess]    = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // populate form from auth context user on mount and when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName:  user.lastName  || '',
        phone:     user.phone     || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName:  formData.lastName,
        phone:     formData.phone,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      await api.put('/api/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword:     passwordData.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(''), 4000);
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — Avatar + Info Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <div className="flex flex-col items-center">

                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)] flex items-center justify-center overflow-hidden border-4 border-card shadow-lg">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-[hsl(38,70%,55%)]">{initials}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[hsl(38,70%,50%)] text-[hsl(220,50%,15%)] p-2.5 rounded-full shadow-lg hover:bg-[hsl(38,70%,45%)] transition-all"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" />
                  </div>

                  {/* Name + Role */}
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                    {user ? `${user.firstName} ${user.lastName}` : '—'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    <Shield className="w-3 h-3" />
                    <span className="capitalize">{user?.role || 'member'}</span>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground truncate">{user?.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{user?.phone || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">ID: {user?.id?.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/20">
                <p className="text-foreground/80 italic text-center font-serif text-sm">
                  "For we are God's handiwork, created in Christ Jesus to do good works..."
                </p>
                <p className="text-muted-foreground text-center text-xs mt-2">— Ephesians 2:10</p>
              </div>
            </motion.div>

            {/* Right — Forms */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">

              {/* Profile Form */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <h2 className="text-xl font-serif font-semibold text-foreground mb-6">Personal Information</h2>

                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 text-sm"
                  >
                    <Check className="w-5 h-5 flex-shrink-0" /> {success}
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </motion.div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="firstName" className="text-foreground mb-2 block">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                          placeholder="First name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-foreground mb-2 block">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground mb-2 block">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="pl-10 border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground mb-2 block">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                          placeholder="e.g. 0712345678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-border">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground capitalize">{user?.role || 'member'}</p>
                      <p className="text-xs text-muted-foreground">Your role is managed by administrators</p>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full py-5 font-semibold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
                    {loading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                    )}
                  </Button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <h2 className="text-xl font-serif font-semibold text-foreground mb-6">Change Password</h2>

                {pwSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 text-sm"
                  >
                    <Check className="w-5 h-5 flex-shrink-0" /> {pwSuccess}
                  </motion.div>
                )}
                {pwError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {pwError}
                  </motion.div>
                )}

                {user?.avatarUrl && !user?.phone ? (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
                    Google sign-in accounts cannot change password here.
                  </p>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {[
                      { id: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent), key: 'currentPassword' as const },
                      { id: 'newPassword',     label: 'New Password',     show: showNew,     toggle: () => setShowNew(!showNew),         key: 'newPassword'     as const },
                      { id: 'confirmPassword', label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm), key: 'confirmPassword' as const },
                    ].map(({ id, label, show, toggle, key }) => (
                      <div key={id}>
                        <Label htmlFor={id} className="text-foreground mb-2 block">{label}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id={id}
                            type={show ? 'text' : 'password'}
                            value={passwordData[key]}
                            onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                            className="pl-10 pr-10 border-border focus:border-accent"
                            disabled={pwLoading}
                            placeholder={`Enter ${label.toLowerCase()}`}
                          />
                          <button type="button" onClick={toggle} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}

                    <Button type="submit" disabled={pwLoading} variant="navy-outline" className="w-full py-5 font-semibold rounded-xl">
                      {pwLoading ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" /> Updating...</>
                      ) : (
                        <><Lock className="w-4 h-4 mr-2" /> Update Password</>
                      )}
                    </Button>
                  </form>
                )}
              </div>

            </motion.div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}
