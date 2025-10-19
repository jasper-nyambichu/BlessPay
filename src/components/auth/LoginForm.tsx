'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Church, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
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

  const { login, signup, loading, error: authError, clearError } = useAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  // Clear auth errors when switching between login/signup
  useEffect(() => {
    if (authError && clearError) {
      clearError();
    }
    setLocalError('');
    setPasswordMatch(true);
  }, [isLogin, authError, clearError]);

  // Display auth errors from context
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
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
    // Check if passwords match
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

    // Clear any existing auth errors
    if (clearError) {
      clearError();
    }

    console.log('Form submitted with data:', formData);

    // Validation
    if (!isLogin) {
      if (!formData.name.trim()) {
        setLocalError('Full name is required');
        return;
      }
      if (!formData.phone.trim()) {
        setLocalError('Phone number is required');
        return;
      }
      if (!formData.church.trim()) {
        setLocalError('Church name is required');
        return;
      }
      if (!validatePassword(formData.password)) {
        setLocalError('Please ensure your password meets all requirements');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match');
        setPasswordMatch(false);
        return;
      }
    }

    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!formData.password) {
      setLocalError('Password is required');
      return;
    }

    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login(formData.email, formData.password);
        console.log('Login successful, redirecting...');
        // Redirect happens in AuthContext
      } else {
        console.log('Attempting signup...');
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          church: formData.church,
          role: formData.role,
        });
        console.log('Signup successful');
        
        // Clear form only on successful signup
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          phone: '',
          church: '',
          role: 'member',
        });
        setPasswordStrength({
          hasMinLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        });
        
        // Success notification and auto-login is handled in AuthContext
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      // Error is now handled by AuthContext and notifications
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
      {text}
    </div>
  );

  // Determine which error to display (local validation errors vs auth errors)
  const displayError = localError || authError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">BlessPay</h1>
          <p className="text-blue-100">Seventh-day Adventist Offering System</p>
        </div>

        <div className="p-8">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setLocalError('');
                if (clearError) clearError();
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
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
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {displayError}
            </div>
          )}

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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>

                <div className="relative">
                  <Church className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Church Name"
                    value={formData.church}
                    onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>

                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'member' | 'admin' | 'pastor' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      !passwordMatch && formData.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!passwordMatch && formData.confirmPassword && (
                  <div className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Passwords do not match
                  </div>
                )}
              </>
            )}

            {!isLogin && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                <PasswordRequirement met={passwordStrength.hasUpperCase} text="One uppercase letter" />
                <PasswordRequirement met={passwordStrength.hasLowerCase} text="One lowercase letter" />
                <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
                <PasswordRequirement met={passwordStrength.hasSpecialChar} text="One special character" />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button type="button" className="text-blue-600 hover:underline text-sm">
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}