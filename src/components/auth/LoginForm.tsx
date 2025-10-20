// src/components/auth/LoginForm.tsx (Modernized)
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Church, User, Phone, AlertCircle, CheckCircle, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    church: '',
    role: 'member' as 'member' | 'admin' | 'pastor',
  });

  const { login, signup, loading: authLoading, error: authError, clearError, isInitialized } = useAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  // Only show loading when actually submitting, not during auth initialization
  const loading = isSubmitting;

  useEffect(() => {
    if (authError && clearError) {
      clearError();
    }
    setLocalError('');
    setPasswordMatch(true);
  }, [isLogin, authError, clearError]);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  // Show loading screen until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">BlessPay</h2>
          <p className="text-gray-500">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const validatePassword = (password: string) => {
    const strength = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordStrength(strength);
    return Object.values(strength).every(Boolean);
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    validatePassword(password);
    if (!isLogin) {
      setPasswordMatch(password === formData.confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setFormData({ ...formData, confirmPassword });
    setPasswordMatch(formData.password === confirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setPasswordMatch(true);
    setIsSubmitting(true);

    if (clearError) {
      clearError();
    }

    // Validation
    if (!isLogin) {
      if (!formData.name.trim()) {
        setLocalError('Full name is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.phone.trim()) {
        setLocalError('Phone number is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.church.trim()) {
        setLocalError('Church name is required');
        setIsSubmitting(false);
        return;
      }
      if (!validatePassword(formData.password)) {
        setLocalError('Please ensure your password meets all requirements');
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match');
        setPasswordMatch(false);
        setIsSubmitting(false);
        return;
      }
    }

    if (!formData.email.trim()) {
      setLocalError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      setLocalError('Password is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          church: formData.church,
          role: formData.role,
        });
        
        if (!authError) {
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phone: '',
            church: '',
            role: 'member',
          });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}
    >
      {met ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
      {text}
    </motion.div>
  );

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full"
          />
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Heart className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">BlessPay</h1>
            </div>
            <p className="text-blue-100 text-sm">Seventh-day Adventist Offering System</p>
          </motion.div>
        </div>

        <div className="p-8">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setLocalError('');
                if (clearError) clearError();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-white shadow-lg text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setLocalError('');
                if (clearError) clearError();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white shadow-lg text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700"
              >
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Church className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Church Name"
                      value={formData.church}
                      onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>

                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' | 'pastor' })}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    disabled={loading}
                  >
                    <option value="member">Church Member</option>
                    <option value="pastor">Pastor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 ${
                      !passwordMatch && formData.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                    required={!isLogin}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!passwordMatch && formData.confirmPassword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Passwords do not match
              </motion.div>
            )}

            {/* Password Requirements */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-50 rounded-xl space-y-2 border border-blue-100"
                >
                  <p className="text-sm font-medium text-blue-900">Password Requirements:</p>
                  <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
                  <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  <span className="relative z-10">
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </span>
                </>
              ) : (
                <span className="relative z-10">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </span>
              )}
            </motion.button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button 
                type="button" 
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors font-medium"
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}