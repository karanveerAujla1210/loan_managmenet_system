import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function ModernLoginComplete() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Validation rules
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate different scenarios
      if (formData.email === 'error@test.com') {
        throw new Error('Invalid credentials. Please try again.');
      }

      if (formData.email === 'locked@test.com') {
        throw new Error('Account locked. Please contact support.');
      }

      if (formData.email === 'inactive@test.com') {
        throw new Error('Account inactive. Please contact administrator.');
      }

      // Success scenario
      setSuccess('✓ Login successful! Redirecting...');
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Simulate role-based redirect
      setTimeout(() => {
        const role = formData.email.includes('manager') ? 'manager' : 'collector';
        navigate(`/dashboard?role=${role}`);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1741FF] to-[#1230cc] flex items-center justify-center p-4">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start px-12">
        <div className="mb-12">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4">
            <span className="text-[#1741FF] font-bold text-lg">LMS</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">LoanCRM</h1>
          <p className="text-blue-100 text-lg">Professional NBFC Loan Management & Collections</p>
        </div>

        <div className="space-y-8">
          {[
            { title: 'Complete Loan Lifecycle', desc: 'From origination to closure' },
            { title: 'Advanced Collections', desc: 'Smart DPD tracking and follow-ups' },
            { title: 'Real-time Analytics', desc: 'Comprehensive dashboards and reports' },
          ].map((feature, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition ${
                      validationErrors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    aria-label="Email address"
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  />
                </div>
                {validationErrors.email && (
                  <p id="email-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
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
                    placeholder="••••••••"
                    disabled={loading}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1741FF] focus:border-transparent outline-none transition ${
                      validationErrors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    aria-label="Password"
                    aria-invalid={!!validationErrors.password}
                    aria-describedby={validationErrors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p id="password-error" className="text-red-600 text-xs mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validationErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-[#1741FF] rounded focus:ring-2 focus:ring-[#1741FF] disabled:cursor-not-allowed"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1741FF] hover:bg-[#1230cc] disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">
                Demo credentials:
              </p>
              <div className="space-y-2 text-xs text-gray-500">
                <p>✓ admin@loancrm.com / password</p>
                <p>✓ manager@loancrm.com / password</p>
                <p>✓ collector@loancrm.com / password</p>
                <p className="text-red-600 mt-3">Test error: error@test.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
