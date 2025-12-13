import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      icon: CreditCard,
      title: 'Loan Management',
      description: 'Complete loan lifecycle management with automated workflows'
    },
    {
      icon: Users,
      title: 'Customer Portal',
      description: 'Streamlined customer onboarding and management system'
    },
    {
      icon: TrendingUp,
      title: 'Collections CRM',
      description: 'Advanced collections and follow-up automation'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with role-based access control'
    }
  ];

  const stats = [
    { label: 'Active Loans', value: '₹2.5Cr+' },
    { label: 'Customers Served', value: '10,000+' },
    { label: 'Collection Rate', value: '95%' },
    { label: 'Processing Time', value: '24hrs' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LoanCRM Pro</h1>
                <p className="text-sm text-gray-600">Business Loan & Debt Relief Platform</p>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Modern NBFC
              <span className="text-blue-600 block">Loan Management</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your loan operations with our comprehensive CRM platform. 
              From application to closure, manage every aspect of your lending business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/customer-login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
              >
                Customer Portal
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Feature Showcase */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full max-w-lg"
          >
            {/* Main Feature Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16"></div>
              
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  {React.createElement(features[currentSlide].icon, {
                    className: "w-8 h-8 text-blue-600"
                  })}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {features[currentSlide].title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {features[currentSlide].description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time processing
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automated workflows
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Advanced analytics
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;