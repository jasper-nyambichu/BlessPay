'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Save, Mail, Phone, Church, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
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

      console.log('Uploading avatar to:', filePath);

      // First, check if the bucket exists by trying to list files (this will fail if bucket doesn't exist)
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('Bucket error:', bucketError);
        throw new Error('Storage bucket not configured. Please create a "profiles" bucket in Supabase.');
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'profiles');
      
      if (!bucketExists) {
        // If bucket doesn't exist, fall back to localStorage
        console.warn('Profiles bucket not found, using localStorage fallback');
        return await saveToLocalStorage(file);
      }

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Fall back to localStorage if upload fails
        return await saveToLocalStorage(file);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('Upload successful, public URL:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Fall back to localStorage
      return await saveToLocalStorage(file);
    }
  };

  // Fallback: Save image to localStorage as base64
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

  // Load image from localStorage fallback
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

      // Check if we have a localStorage fallback first
      const localAvatar = loadLocalStorageAvatar();
      if (localAvatar && !avatarUrl) {
        avatarUrl = localAvatar;
      }

      // Upload new avatar if selected
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, user.id);
      }

      // Update profile
      await updateProfile({
        ...formData,
        avatar_url: avatarUrl,
      });

      setSuccess('Profile updated successfully!');
      
      // Clear the file input after successful upload
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load localStorage avatar on component mount
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            {error}
          </motion.div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, try localStorage fallback
                        const localAvatar = loadLocalStorageAvatar();
                        if (localAvatar) {
                          setPreviewUrl(localAvatar);
                        } else {
                          e.currentTarget.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="church_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Church
                  </label>
                  <div className="relative">
                    <Church className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="church_name"
                      value={formData.church_name}
                      onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="capitalize font-medium">{user.role}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Your role is managed by church administrators</p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        
      </div>
    </motion.div>
  );
}