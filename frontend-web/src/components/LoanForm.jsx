import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { loanAPI, customerAPI } from '../services/api';

const LoanForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const principalAmount = watch('principalAmount');
  const interestRate = watch('interestRate');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const calculateTotalAmount = () => {
    if (principalAmount && interestRate) {
      return principalAmount * (1 + interestRate / 100);
    }
    return 0;
  };

  const calculateInstallmentAmount = () => {
    const total = calculateTotalAmount();
    return total / 14;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loanAPI.create(data);
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Loan</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              {...register('customerId', { required: 'Customer is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.firstName} {customer.lastName} - {customer.phone}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Principal Amount *
            </label>
            <input
              type="number"
              {...register('principalAmount', { 
                required: 'Principal amount is required',
                min: { value: 1000, message: 'Minimum amount is ₹1,000' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.principalAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.principalAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%) *
            </label>
            <input
              type="number"
              step="0.1"
              {...register('interestRate', { 
                required: 'Interest rate is required',
                min: { value: 0, message: 'Interest rate cannot be negative' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.interestRate && (
              <p className="text-red-500 text-sm mt-1">{errors.interestRate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>
        </div>

        {/* Loan Summary */}
        {principalAmount && interestRate && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-semibold ml-2">₹{Number(principalAmount).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-semibold ml-2">{interestRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold ml-2">₹{calculateTotalAmount().toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Weekly Installment:</span>
                <span className="font-semibold ml-2">₹{Math.round(calculateInstallmentAmount()).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Number of Installments:</span>
                <span className="font-semibold ml-2">14 (Weekly)</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold ml-2">14 weeks</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Loan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;