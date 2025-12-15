import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { remarkService } from '../../services/remarkService';

const AddRemarkModal = ({ loanId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!remark.trim()) {
        toast.error('Remark cannot be empty');
        return;
      }

      await remarkService.addRemark(loanId, {
        text: remark.trim(),
        collectorId: localStorage.getItem('userId'),
        timestamp: new Date()
      });

      toast.success('Remark added successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to add remark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <h2 className="text-xl font-bold">Add Remark</h2>
          <p className="text-sm text-blue-100 mt-1">Document your communication</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Examples:
• Customer said will pay by Friday
• Phone not reachable, will call again later
• Customer requesting 10 days extension
• Promised to send payment via UPI tonight"
            />
            <p className="text-xs text-gray-500 mt-2">
              {remark.length}/500 characters
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
              disabled={loading || !remark.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Adding...' : 'Add Remark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRemarkModal;
