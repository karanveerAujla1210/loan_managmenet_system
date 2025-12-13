import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  User,
  Lock,
  Mail,
  RefreshCw,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ModernInput } from '../components/ui/ModernInput';
import { ModernButton } from '../components/ui/ModernButton';
import { ModernCard, ModernCardContent } from '../components/ui/ModernCard';

const ModernLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false,
    captcha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'counsellor', label: 'Counsellor', icon: User },
    { value: 'advisor', label: 'Advisor', icon: Shield },
    { value: 'manager', label: 'Manager', icon: Building2 },
    { value: 'admin', label: 'Admin', icon: Shield },
    { value: 'collector', label: 'Collector', icon: User }
  ];

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData.captcha) {
      newErrors.captcha = 'Security code is required';
    } else if (formData.captcha !== captchaCode) {
      newErrors.captcha = 'Invalid security code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
        setCaptchaCode(generateCaptcha());
        setFormData(prev => ({ ...prev, captcha: '' }));
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      setCaptchaCode(generateCaptcha());
      setFormData(prev => ({ ...prev, captcha: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex font-sans">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full"
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LoanCRM Pro</h1>
                <p className="text-blue-100">Business Loan & Debt Relief Platform</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Secure Employee
              <span className="block text-blue-200">Access Portal</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Access your role-based dashboard with enterprise-grade security. 
              Manage loans, customers, and collections efficiently.
            </p>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-center text-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Shield className="w-5 h-5 mr-3" />
                <span>Multi-factor authentication</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Lock className="w-5 h-5 mr-3" />
                <span>Role-based access control</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <User className="w-5 h-5 mr-3" />
                <span>Personalized dashboard</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Back to Welcome */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Login Card */}
          <ModernCard className="p-8">
            <ModernCardContent className="p-0">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">Employee Login</h3>
                <p className="text-base text-gray-600">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <ModernInput
                  type="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={Mail}
                  placeholder="Enter your email"
                  error={errors.email}
                  required
                />

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-12 py-3 text-base placeholder-gray-400 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                    required
                  >
                    <option value="">Choose your role</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Captcha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Code
                  </label>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        className="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base placeholder-gray-400 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                        placeholder="Enter code"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-100 px-4 py-3 rounded-xl font-mono text-lg font-bold text-gray-700 select-none min-w-[80px] text-center">
                        {captchaCode}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCaptchaCode(generateCaptcha())}
                        className="p-3 text-gray-500 hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {errors.captcha && (
                    <p className="mt-2 text-sm text-red-600">{errors.captcha}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <ModernButton
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </ModernButton>
              </form>

              {/* Customer Portal Link */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-3">Are you a customer?</p>
                <Link
                  to="/customer-login"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group"
                >
                  Access Customer Portal
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ModernCardContent>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLogin;