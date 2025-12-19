import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const CreditAssessment = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credit Assessment</h1>
        <p className="text-gray-600 mt-1">Analyze risk and recommend approval</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="font-semibold text-gray-900">Recommend Approval</h3>
          </div>
          <p className="text-gray-600 text-sm">Low risk, strong financials</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-600" size={24} />
            <h3 className="font-semibold text-gray-900">Conditional Approval</h3>
          </div>
          <p className="text-gray-600 text-sm">Medium risk, requires conditions</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="text-red-600" size={24} />
            <h3 className="font-semibold text-gray-900">Recommend Rejection</h3>
          </div>
          <p className="text-gray-600 text-sm">High risk, insufficient income</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Metrics</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="text-gray-700">FOIR (Fixed Obligation to Income Ratio)</span>
            <span className="font-semibold text-blue-600">45%</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="text-gray-700">Risk Band</span>
            <span className="font-semibold text-orange-600">Medium</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
            <span className="text-gray-700">Credit Score</span>
            <span className="font-semibold text-green-600">720</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditAssessment;
