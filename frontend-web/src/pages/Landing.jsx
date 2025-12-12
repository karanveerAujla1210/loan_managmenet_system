import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-6">NBFC Loan Management System</h1>
        <p className="text-xl mb-8">Complete loan lifecycle management for NBFCs</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Login
          </Link>
          <Link to="/dashboard" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;