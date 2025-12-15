import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { promiseService } from '../../services/promiseService';

const PromiseToPayModal = ({ loanId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    promiseDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    promiseAmount: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.promiseDate) {
        toast.error('Promise date is required');
        return;
      }

      const promiseDateTime = new Date(formData.promiseDate);
      if (promiseDateTime < new Date()) {
        toast.error('Promise date must be in the future');
        return;
      }

      await promiseService.addPromiseToPay(loanId, {
        promiseDate: formData.promiseDate,
        promiseAmount: formData.promiseAmount ? parseFloat(formData.promiseAmount) : null,
        remarks: formData.remarks,
        collectorId: localStorage.getItem('userId')
      });

      toast.success('Promise recorded');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to record promise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Promise to Pay</h2>
          <p className="text-sm text-purple-100 mt-1">Record customer's commitment</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Promise Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Promise Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="promiseDate"
              value={formData.promiseDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">When customer will pay</p>
          </div>

          {/* Promise Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Promise Amount (₹) <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              name="promiseAmount"
              value={formData.promiseAmount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Leave empty if full amount promised"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="E.g., Customer will receive salary on 15th, promised after that"
            />
          </div>

          {/* Note */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-900">
              ⚠️ <strong>Breaking a promise reduces your score.</strong> Record promises you are confident will be kept.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Recording...' : 'Record Promise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromiseToPayModal;
