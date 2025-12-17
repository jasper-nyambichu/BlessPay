'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Church, User, Phone, AlertCircle, CheckCircle, Shield, ArrowRight } from 'lucide-react';
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

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-cormorant font-semibold text-navy">BlessPay</h2>
          <p className="text-navy/60">Loading...</p>
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
      className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-navy/60'}`}
    >
      {met ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
      {text}
    </motion.div>
  );

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Background with Navy & Gold Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-navy">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-navy/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cream/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-cream w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 bg-cream/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-6 h-6 text-cream" />
            </div>
            <span className="text-xl font-cormorant font-bold">BlessPay</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-cormorant font-bold mb-4 leading-tight">
              Welcome to Your <span className="text-gradient-gold">Spiritual Giving</span> Journey
            </h1>
            <p className="text-cream/80 text-lg leading-relaxed">
              Join thousands of faithful members in supporting our church's mission through secure, 
              convenient digital offerings.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl border border-cream/20"
          >
            <div className="flex items-center gap-3 text-cream/70">
              <div className="flex-1 h-px bg-cream/30"></div>
              <span className="text-sm font-medium">"God loves a cheerful giver" - 2 Corinthians 9:7</span>
              <div className="flex-1 h-px bg-cream/30"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-warm">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-cormorant text-2xl font-bold text-navy">BlessPay</span>
            </motion.div>
            <p className="text-navy/60">Seventh-day Adventist Offering System</p>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 rounded-3xl shadow-elevated border border-muted">
            {/* Form Header */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-cormorant font-bold text-navy mb-2"
              >
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </motion.h2>
              <p className="text-navy/70">
                {isLogin 
                  ? 'Sign in to continue your spiritual giving journey' 
                  : 'Join our community of faithful givers'
                }
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-navy/5 rounded-2xl p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setLocalError('');
                  if (clearError) clearError();
                }}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-white shadow-soft text-navy' 
                    : 'text-navy/60 hover:text-navy'
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
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-white shadow-soft text-navy' 
                    : 'text-navy/60 hover:text-navy'
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>

                    <div className="relative">
                      <Church className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                      <input
                        type="text"
                        placeholder="Church Name"
                        value={formData.church}
                        onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white"
                        required={!isLogin}
                        disabled={loading}
                      />
                    </div>

                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' | 'pastor' })}
                      className="w-full px-4 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white appearance-none"
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
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-muted rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
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
                    className="relative overflow-hidden"
                  >
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy/40" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white ${
                        !passwordMatch && formData.confirmPassword ? 'border-red-300' : 'border-muted'
                      }`}
                      required={!isLogin}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
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
                    className="p-4 bg-navy/5 rounded-xl space-y-2 border border-muted overflow-hidden"
                  >
                    <p className="text-sm font-medium text-navy">Password Requirements:</p>
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
                className="w-full bg-gradient-gold text-white py-4 px-6 rounded-xl font-semibold hover:shadow-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group hover-lift"
              >
                <span>
                  {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                </span>
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                )}
              </motion.button>
            </form>

            {isLogin && (
              <div className="mt-6 text-center">
                <button 
                  type="button" 
                  className="text-navy hover:text-gold hover:underline text-sm transition-colors font-medium"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center text-navy/50 text-sm"
            >
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}