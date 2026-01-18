'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Church, User, Phone, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  
  // Restore the original form data structure with single name field
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // Changed from firstName/lastName to match initial code
    phone: '',
    church: '',
    role: 'member' as 'member' | 'admin' | 'pastor',
  });

  // Restore auth context and hooks - ADD googleSignIn
  const { login, signup, googleSignIn, loading: authLoading, error: authError, clearError, isInitialized } = useAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  const loading = isSubmitting || authLoading;

  // Restore initialization check
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240,10%,15%)]">
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
          <h2 className="text-xl font-serif font-semibold text-white">BlessPay</h2>
          <p className="text-cream/60">Loading...</p>
        </motion.div>
      </div>
    );
  }

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
      if (!formData.name.trim()) { // Changed to single name field
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
      if (!agreedToTerms) {
        setLocalError('Please agree to the Terms & Conditions');
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
          name: formData.name, // Single name field
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
      // Error is already handled by AuthContext, but we can set a fallback
      if (!authError) {
        setLocalError('Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Google authentication function to use AuthContext
  const handleGoogleSignIn = async () => {
    try {
      // Use the googleSignIn function from AuthContext
      await googleSignIn();
      // No need to set loading or error here - AuthContext handles that
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Error is already handled in AuthContext
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-cream/40'}`}>
      {met ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-cream/40" />}
      {text}
    </div>
  );

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Navy Background with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-32 right-16 w-80 h-80 bg-gold/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo & Back Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <Church className="w-5 h-5 text-gold" />
              </div>
              <span className="text-white text-xl font-serif font-bold">BlessPay</span>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="text-cream/80 hover:text-cream text-sm flex items-center gap-2 transition-colors"
            >
              Back to website
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl font-serif text-white leading-tight"
            >
              Welcome to Your{' '}
              <span className="text-gold">Spiritual Giving</span>{' '}
              Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-cream/70 text-lg max-w-md"
            >
              Join thousands of faithful members in supporting our church's mission through secure, 
              convenient digital offerings.
            </motion.p>
          </div>

          {/* Quote */}
          <div className="flex items-center gap-4">
            <div className="h-px bg-gold/30 flex-1" />
            <p className="text-cream/60 text-sm italic">
              "God loves a cheerful giver" - 2 Corinthians 9:7
            </p>
            <div className="h-px bg-gold/30 flex-1" />
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 bg-[hsl(240,10%,15%)] flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
              <Church className="w-5 h-5 text-gold" />
            </div>
            <span className="text-white text-xl font-serif font-bold">BlessPay</span>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-serif text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Create an account'}
            </h2>
            <p className="text-cream/60 text-sm">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      if (clearError) clearError();
                      setLocalError('');
                    }}
                    className="text-gold hover:text-gold/80 underline transition-colors"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      if (clearError) clearError();
                      setLocalError('');
                    }}
                    className="text-gold hover:text-gold/80 underline transition-colors"
                    disabled={loading}
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Full Name Field - Single field as in initial code */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200"
                      disabled={loading}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200"
                      disabled={loading}
                    />
                  </div>

                  {/* Church */}
                  <div className="relative">
                    <Church className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Church Name"
                      value={formData.church}
                      onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200"
                      disabled={loading}
                    />
                  </div>

                  {/* Role Select */}
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' | 'pastor' })}
                    className="w-full px-4 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200 appearance-none cursor-pointer"
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
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[hsl(240,10%,20%)] border border-cream/10 rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200"
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password (Sign Up only) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 bg-[hsl(240,10%,20%)] border rounded-xl text-white placeholder:text-cream/40 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200 ${
                        !passwordMatch && formData.confirmPassword ? 'border-red-500/50' : 'border-cream/10'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {!passwordMatch && formData.confirmPassword && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}

                  {/* Password Requirements */}
                  <div className="p-4 bg-[hsl(240,10%,18%)] rounded-xl border border-cream/5 space-y-2">
                    <p className="text-cream/80 text-xs font-medium mb-2">Password Requirements:</p>
                    <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                    <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
                    <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-cream/20 bg-[hsl(240,10%,20%)] text-gold focus:ring-gold/50 cursor-pointer"
                      disabled={loading}
                    />
                    <span className="text-cream/60 text-sm">
                      I agree to the{' '}
                      <a href="#" className="text-gold hover:underline">Terms & Conditions</a>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={loading ? undefined : { scale: 1.02 }}
              whileTap={loading ? undefined : { scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-navy font-semibold rounded-xl shadow-lg shadow-gold/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-cream/10 flex-1" />
              <span className="text-cream/40 text-sm">Or register with</span>
              <div className="h-px bg-cream/10 flex-1" />
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-[hsl(240,10%,20%)] hover:bg-[hsl(240,10%,25%)] border border-cream/10 rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-[hsl(240,10%,20%)] hover:bg-[hsl(240,10%,25%)] border border-cream/10 rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </motion.button>
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  className="text-gold hover:text-gold/80 text-sm underline transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-cream/40 text-xs mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="text-gold hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-gold hover:underline">Privacy Policy</a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;

