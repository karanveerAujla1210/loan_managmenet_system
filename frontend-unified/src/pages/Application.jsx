import React, { useState } from 'react';
import { Save, Send } from 'lucide-react';

const Application = () => {
  const [formData, setFormData] = useState({
    personalDetails: {},
    businessDetails: {},
    incomeDetails: {},
    bankDetails: {},
    documents: []
  });

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
  };

  const handleSubmit = () => {
    console.log('Submitting application:', formData);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
        <p className="text-gray-600 mt-1">Collect structured, verifiable data</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="email" placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="tel" placeholder="Phone" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="PAN" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Business Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Select Business Type</option>
                <option>Retail</option>
                <option>Manufacturing</option>
                <option>Services</option>
              </select>
            </div>
          </div>

          {/* Income Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Income & Obligations</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Monthly Income" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Existing EMI" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Loan Amount Required" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>Select Tenure</option>
                <option>12 months</option>
                <option>24 months</option>
                <option>36 months</option>
              </select>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Bank Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Account Number" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="IFSC Code" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Account Holder Name" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-600">Drag and drop documents or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">KYC, Bank Statements, Income Proof</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Save size={20} /> Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send size={20} /> Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default Application;
