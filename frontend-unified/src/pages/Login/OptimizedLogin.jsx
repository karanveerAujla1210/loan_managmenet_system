import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { authService } from '../../services';

const OptimizedLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { mobileOrEmail: '', password: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data.mobileOrEmail, data.password);
      
      // Store token and role
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userId', response.userId);
      
      toast.success('Login successful!');
      
      // Role-based redirect (handled server-side)
      if (response.role === 'COLLECTOR') {
        navigate('/collector/dashboard');
      } else if (response.role === 'MANAGER') {
        navigate('/manager/dashboard');
      } else if (response.role === 'LEGAL') {
        navigate('/legal/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Loan CRM</h1>
          <p className="text-sm text-gray-600">Collections Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Mobile or Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile or Email
              </label>
              <input
                type="text"
                placeholder="Enter mobile (10 digits) or email"
                {...register('mobileOrEmail', {
                  required: 'Mobile or email is required',
                  validate: (value) => {
                    const emailRegex = /^\S+@\S+$/i;
                    const mobileRegex = /^[0-9]{10}$/;
                    return emailRegex.test(value) || mobileRegex.test(value) || 'Enter valid mobile (10 digits) or email';
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
              {errors.mobileOrEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.mobileOrEmail.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              }`}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Loan Management System v1.0 | Production Environment</p>
        </div>
      </div>
    </div>
  );
};

export default OptimizedLogin;
