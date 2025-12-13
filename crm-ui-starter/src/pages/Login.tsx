import React, { useState } from 'react'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('officer@crm.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()

  const submit = async () => {
    setError(null)
    if (!email) return setError('Email address is required')
    if (!password) return setError('Password is required')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError('Unable to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      submit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/5 to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-purple/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-accent-cyan/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Branding & Features (Hidden on mobile) */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              {/* Logo & Title */}
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg mb-6">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-2">LoanHub</h1>
                <p className="text-xl text-gray-600">Business Loan Management Platform</p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bank-Grade Security</h3>
                    <p className="text-sm text-gray-600">End-to-end encryption & 256-bit SSL</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Analytics</h3>
                    <p className="text-sm text-gray-600">Live dashboard with instant updates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Role Support</h3>
                    <p className="text-sm text-gray-600">Customized views for different roles</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-4 font-medium">TRUSTED BY LEADING NBFCs</p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">ISO 27001</div>
                  <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">RBI Compliant</div>
                  <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">SOC 2 Type II</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-primary-light text-sm">Enter your credentials to access your account</p>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="p-4 bg-danger/10 border-l-4 border-danger rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-danger text-2xl mt-0">⚠️</span>
                      <div>
                        <p className="font-semibold text-danger text-sm">Sign In Error</p>
                        <p className="text-xs text-danger/80 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900">Password</label>
                    <a href="#" className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary bg-white border border-gray-300 rounded focus:ring-primary accent-primary"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Keep me signed in</span>
                </label>

                {/* Sign In Button */}
                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Demo Credentials */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-900 mb-2">👤 Demo Credentials:</p>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p><span className="font-semibold">Email:</span> officer@crm.com</p>
                    <p><span className="font-semibold">Password:</span> password123</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  <Shield size={14} className="inline mr-1" />
                  Your data is protected with industry-leading encryption
                </p>
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mt-8">
              <p className="text-xs text-gray-500">© 2024 LoanHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
