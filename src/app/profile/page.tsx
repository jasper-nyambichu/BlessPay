'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Save, Mail, Phone, Church, Shield, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    church_name: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        church_name: user.church_name || '',
      });
      setPreviewUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'profiles');
      
      if (!bucketExists) {
        return await saveToLocalStorage(file);
      }

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        return await saveToLocalStorage(file);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrl;

    } catch (error) {
      return await saveToLocalStorage(file);
    }
  };

  const saveToLocalStorage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`profile_avatar_${user?.id}`, base64String);
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  const loadLocalStorageAvatar = (): string | null => {
    if (!user) return null;
    return localStorage.getItem(`profile_avatar_${user.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let avatarUrl = user.avatar_url;
      const localAvatar = loadLocalStorageAvatar();
      if (localAvatar && !avatarUrl) {
        avatarUrl = localAvatar;
      }

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, user.id);
      }

      await updateProfile({
        ...formData,
        avatar_url: avatarUrl,
      });

      setSuccess('Profile updated successfully!');
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !previewUrl) {
      const localAvatar = loadLocalStorageAvatar();
      if (localAvatar) {
        setPreviewUrl(localAvatar);
      }
    }
  }, [user, previewUrl]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center text-accent"
            >
              <Check className="w-5 h-5 mr-3" />
              {success}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center text-destructive"
            >
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center overflow-hidden border-4 border-card">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const localAvatar = loadLocalStorageAvatar();
                            if (localAvatar) {
                              setPreviewUrl(localAvatar);
                            } else {
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <User className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-accent text-accent-foreground p-3 rounded-full shadow-gold hover:bg-gold-dark transition-all"
                      disabled={loading}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {user.full_name || 'User'}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      <Shield className="w-3 h-3" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spiritual Quote */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-6 bg-accent/5 rounded-2xl border border-accent/20"
              >
                <p className="text-foreground/80 italic text-center font-serif text-sm">
                  "For we are God's handiwork, created in Christ Jesus to do good works..."
                </p>
                <p className="text-muted-foreground text-center text-xs mt-2">— Ephesians 2:10</p>
              </motion.div>
            </motion.div>

            {/* Profile Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name" className="text-foreground mb-2">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground mb-2">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          id="email"
                          value={user.email}
                          disabled
                          className="pl-10 border-border bg-muted/50 text-muted-foreground"
                        />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="phone_number" className="text-foreground mb-2">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="church_name" className="text-foreground mb-2">
                        Church
                      </Label>
                      <div className="relative">
                        <Church className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          id="church_name"
                          value={formData.church_name}
                          onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
                          className="pl-10 border-border focus:border-accent"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground mb-2">Account Role</Label>
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-border">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground capitalize">{user.role}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your role is managed by church administrators
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 text-lg font-semibold bg-accent hover:bg-gold-dark text-accent-foreground rounded-xl shadow-gold transition-all"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}