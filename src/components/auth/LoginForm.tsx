'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Church, User, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    phone: string;
    church: string;
    role: 'member' | 'admin' | 'pastor';
  }>({
    email: '',
    password: '',
    name: '',
    phone: '',
    church: '',
    role: 'member',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
        // Redirect to confirmation page
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle error (show toast/notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-sda-blue text-white p-6 text-center">
          <h1 className="text-3xl font-bold">BlessPay</h1>
          <p className="text-blue-100">Seventh-day Adventist Offering System</p>
        </div>

        <div className="p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin ? 'bg-white shadow-sm text-sda-blue' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin ? 'bg-white shadow-sm text-sda-blue' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <Church className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Church Name"
                    value={formData.church}
                    onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                    required
                  />
                </div>

                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' | 'pastor' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                >
                  <option value="member">Church Member</option>
                  <option value="pastor">Pastor</option>
                  <option value="admin">Administrator</option>
                </select>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sda-blue focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sda-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button className="text-sda-blue hover:underline text-sm">
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}