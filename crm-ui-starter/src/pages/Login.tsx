import React, { useState } from 'react'
import { Input } from '../components/ui/Input'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  const submit = async () => {
    setError(null)
    if (!email) return setError('Email is required')
    if (!password) return setError('Password is required')
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 400))
      login({ email, password })
    } catch (err) {
      setError('Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-gray via-white to-blue-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-purple rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>

      <div className="w-full max-w-md mx-4 z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow-blue mb-6">
            <span className="text-4xl">💼</span>
          </div>
          <h1 className="text-display-md bg-gradient-primary bg-clip-text text-transparent mb-2">LoanHub</h1>
          <p className="text-body-lg text-gray-600">Business Loan Management System</p>
        </div>

        {/* Login Card */}
        <div className="card-elevated border border-white/40 backdrop-blur-xl overflow-hidden animate-fadeInUp">
          <div className="bg-gradient-to-br from-primary/5 to-accent-purple/5 p-6 border-b border-white/10">
            <h2 className="text-heading-lg font-display font-bold text-dark-gray">Welcome back</h2>
            <p className="text-body-md text-gray-600 mt-2">Sign in to access your CRM dashboard</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Email Address</label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@company.com" 
                type="email"
                className="input-modern"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Password</label>
              <Input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••"
                className="input-modern"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm font-medium">
                ❌ {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-primary rounded" 
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button 
              onClick={submit} 
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">Demo Credentials</span>
              </div>
            </div>

            {/* Demo Info */}
            <div className="bg-info/10 border border-info/30 rounded-lg p-4">
              <p className="text-xs text-info font-medium">
                📝 Try: <span className="font-bold">demo@loanhub.com</span> / <span className="font-bold">password123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-body-sm text-gray-600">
          <p>© 2024 LoanHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
